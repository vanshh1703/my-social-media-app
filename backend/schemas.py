from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

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

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: datetime
    author: UserResponse

    class Config:
        from_attributes = True

class LikeResponse(BaseModel):
    id: int
    post_id: int
    user_id: int

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    content: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    image_url: Optional[str] = None
    author_id: int
    created_at: datetime
    author: UserResponse
    comments: List[CommentResponse] = []
    likes: List[LikeResponse] = []

    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    age: Optional[int] = None
    profile_picture: Optional[str] = None
    created_at: datetime
    posts: List[PostResponse] = []

    class Config:
        from_attributes = True
