# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from router import auth, groups
from typing import Dict, List
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
            # FIX: must serialize to string, not pass a dict
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
