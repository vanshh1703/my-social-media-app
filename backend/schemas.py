from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    profile_picture: Optional[str] = None

class UserLogin(BaseModel):
    username: str 
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    age: Optional[int] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
