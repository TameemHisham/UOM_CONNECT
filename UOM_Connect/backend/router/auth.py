# backend/routers/auth.py (Partial update)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.db_config import SessionLocal
from db.models import User
from auth.hash_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token, decode_access_token
from schemas.auth import UserSignup, UserLogin, Token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    return payload


def get_db():
    with SessionLocal() as session:
        yield session


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user_db = db.query(User).filter(
        User.full_name == current_user["sub"]
    ).first()
    if not current_user_db:
        raise HTTPException(status_code=404, detail="User not found")

    current_user["email"] = current_user_db.email
    current_user["full_name"] = current_user_db.full_name
    return {"user": current_user}


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
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

    # Generate access token for automatic login after signup
    access_token = create_access_token(data={"sub": new_user.full_name})
    return Token(access_token=access_token, token_type="bearer")


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"sub": db_user.full_name})
    return Token(access_token=access_token, token_type="bearer")


@router.put("/update-profile")
def update_profile(
    update_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.full_name == current_user["sub"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_password = update_data.get("password")
    if new_password:
        if verify_password(new_password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password cannot be the same as your current password"
            )
        db_user.password = hash_password(new_password)

    db_user.full_name = update_data.get("full_name", db_user.full_name)
    db_user.email = update_data.get("email", db_user.email)

    db.commit()
    db.refresh(db_user)

    new_token = create_access_token(data={"sub": db_user.full_name})

    return {
        "message": "Data received.",
        "access_token": new_token,        # ← return it
        "token_type": "bearer",
        "preview": {
            "name": db_user.full_name,
            "email": db_user.email
        }
    }
