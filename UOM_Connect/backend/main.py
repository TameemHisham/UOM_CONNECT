# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from router import auth, groups
from typing import Dict, List
from datetime import datetime
import json

# NEW IMPORTS FOR DATABASE
from db.db_config import SessionLocal
from db.models import User, Message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://10.205.207.76:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(groups.router)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, group_id: int):
        await websocket.accept()
        if group_id not in self.active_connections:
            self.active_connections[group_id] = []
        self.active_connections[group_id].append(websocket)

    def disconnect(self, websocket: WebSocket, group_id: int):
        if group_id in self.active_connections:
            self.active_connections[group_id].remove(websocket)

    async def broadcast_to_group(self, message: str, group_id: int):
        if group_id in self.active_connections:
            dead = []
            for connection in self.active_connections[group_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    dead.append(connection)
            for d in dead:
                self.active_connections[group_id].remove(d)


manager = ConnectionManager()


@app.websocket("/ws/{group_id}/{user_name}")
async def websocket_endpoint(websocket: WebSocket, group_id: int, user_name: str):
    await manager.connect(websocket, group_id)
    try:
        while True:
            data = await websocket.receive_text()

            #  Open a new database session
            db = SessionLocal()
            try:
                # Find the user by their full_name
                user = db.query(User).filter(
                    User.full_name == user_name).first()
                if user:
                    # Save the message to the database
                    new_msg = Message(
                        content=data,
                        user_id=user.id,
                        group_id=group_id,
                        timestamp=datetime.utcnow()
                    )
                    db.add(new_msg)
                    db.commit()
            finally:
                db.close()

            await manager.broadcast_to_group(
                json.dumps({
                    "sender": user_name,
                    "text": data,
                    "time": datetime.now().strftime("%H:%M"),
                }),
                group_id,
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket, group_id)
