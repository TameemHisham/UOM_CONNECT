# router/groups.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from db.db_config import SessionLocal
from db.models import Group, User, GroupMember, Message
from router.auth import get_current_user
from schemas.groups import GroupCreate, GroupJoin, GroupInvite

load_dotenv()

email_password = os.getenv("email_password")
conf = ConnectionConfig(
    MAIL_USERNAME="uomconnect89@gmail.com",
    MAIL_PASSWORD=email_password,
    MAIL_FROM="uomconnect89@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

# FIX: only ONE router definition — second definition was silently wiping /invite
router = APIRouter(prefix="/groups", tags=["groups"])


def get_db():
    with SessionLocal() as session:
        yield session


def _group_to_dict(g: Group) -> dict:
    """Shared serializer so every endpoint returns the same shape."""
    return {
        "id": g.id,
        "name": g.name,
        "join_code": g.join_code,
        "member_count": len(g.members),
    }


@router.post("/invite")
async def send_invite(
    body: GroupInvite,
    current_user: dict = Depends(get_current_user)  # Add this
):
    """Send an email invite with the join code."""
    message = MessageSchema(
        subject="Join my group on UOM Connect!",
        recipients=[body.email],
        body=f"Hey! Join my chat group using this unique code: {body.join_code}",
        subtype=MessageType.plain,
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"message": "Invitation sent!"}


@router.post("/create")
def create_group(
    group_data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.query(User).filter(User.full_name == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_group = Group(name=group_data.name)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    new_group.members.append(user)
    db.commit()
    db.refresh(new_group)

    return _group_to_dict(new_group)


@router.post("/join")
def join_group(
    join_data: GroupJoin,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    group = db.query(Group).filter(Group.join_code ==
                                   join_data.join_code.upper()).first()
    if not group:
        raise HTTPException(status_code=404, detail="Invalid join code")

    user = db.query(User).filter(User.full_name == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user in group.members:
        # Still return the group so the frontend can add it to state
        return {"message": "Already a member", "group": _group_to_dict(group)}

    group.members.append(user)
    db.commit()
    db.refresh(group)

    return {"message": f"Joined {group.name}", "group": _group_to_dict(group)}


@router.get("/me")
def get_my_groups(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.query(User).filter(User.full_name == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return [_group_to_dict(g) for g in user.groups]


@router.get("/{group_id}/messages")
def get_group_messages(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Fetch all past messages for a specific group"""

    # 1. Verify user exists
    user = db.query(User).filter(User.full_name == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Check if the group exists and the user is actually a member of it
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group or user not in group.members:
        raise HTTPException(
            status_code=403, detail="Not a member of this group")

    # 3. Retrieve messages ordered by timestamp
    messages = db.query(Message).filter(Message.group_id ==
                                        group_id).order_by(Message.timestamp.asc()).all()

    # 4. Return formatted message data
    return [
        {
            "id": msg.id,
            "sender": msg.sender.full_name,
            "text": msg.content,
            "time": msg.timestamp.strftime("%H:%M")
        }
        for msg in messages
    ]
