# schemas/auth.py
from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    tags: list[str] = Field(default_factory=list) # added tags too


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
