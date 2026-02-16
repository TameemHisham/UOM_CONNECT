# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.db_config import SessionLocal
from db.models import User
from auth.hash_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token
from schemas.auth import UserSignup, UserLogin, Token
from datetime import timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.jwt_handler import decode_access_token

security = HTTPBearer()


router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = decode_access_token(token)
    return payload


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}


def get_db():
    with SessionLocal() as session:
        yield session


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.full_name == user.full_name) | (User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="full_name or email already exists"
        )

    hashed_pwd = hash_password(user.password)
    new_user = User(full_name=user.full_name,
                    email=user.email, password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # db_user = db.query(User).filter(User.full_name == user.full_name).first()
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect full_name or password"
        )

    access_token = create_access_token(data={"sub": db_user.full_name})
    return Token(access_token=access_token, token_type="bearer")
