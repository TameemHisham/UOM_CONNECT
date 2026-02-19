from pydantic import BaseModel, EmailStr


class GroupCreate(BaseModel):
    name: str


class GroupJoin(BaseModel):
    join_code: str


class GroupInvite(BaseModel):
    email: EmailStr
    join_code: str
