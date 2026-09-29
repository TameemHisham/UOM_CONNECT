# db/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from db.db_config import Base
from datetime import datetime
import uuid


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
    #added tags column to match db
    tags: Mapped[str | None] = mapped_column(Text, nullable=True)
    # This connects back to the Group.members relationship
    groups = relationship(
        "Group", secondary="group_members", back_populates="members")
    messages = relationship("Message", back_populates="sender")


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))

    sender = relationship("User", back_populates="messages")
    group = relationship("Group", back_populates="messages")


class Admin(Base):
    __tablename__ = "admins"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="admin")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)


class Group(Base):
    __tablename__ = "groups"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    # Unique 6-character code for joining
    join_code: Mapped[str] = mapped_column(String(
        6), unique=True, index=True, default=lambda: str(uuid.uuid4())[:6].upper())
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    members = relationship(
        "User", secondary="group_members", back_populates="groups")
    messages = relationship("Message", back_populates="group")


class GroupMember(Base):
    __tablename__ = "group_members"
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), primary_key=True)
    group_id: Mapped[int] = mapped_column(
        ForeignKey("groups.id"), primary_key=True)
