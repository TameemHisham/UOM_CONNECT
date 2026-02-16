# schemas/auth.py
from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
