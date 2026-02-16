# db/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from db.db_config import Base
from datetime import datetime


# class User(Base):
#     __tablename__ = "users"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     username: Mapped[str] = mapped_column(unique=True, nullable=False)
#     email: Mapped[str] = mapped_column(unique=True, nullable=False)
#     password: Mapped[str] = mapped_column(nullable=False)
#     role: Mapped[str] = mapped_column(default="user")
#     created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


# class Admin(Base):
#     __tablename__ = "admins"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     username: Mapped[str] = mapped_column(unique=True, nullable=False)
#     password: Mapped[str] = mapped_column(nullable=False)
#     role: Mapped[str] = mapped_column(default="admin")
#     created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

# Move to uni website
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="user")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)


class Admin(Base):
    __tablename__ = "admins"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="admin")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
