# main.py
from fastapi import FastAPI
from router import auth
from db.db_config import engine, Base
from db.models import User, Admin   # ← IMPORTANT
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://localhost:5173/singup",  # Vite frontend
        "http://localhost:5173/login",  # Vite frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
