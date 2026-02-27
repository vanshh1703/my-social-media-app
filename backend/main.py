from fastapi import FastAPI, Depends, HTTPException, status, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
import os
import uuid
import shutil
import models, schemas, auth
from database import engine, get_db

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Social Media Backend")

# Serve the 'uploads' directory statically
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"
    "my-social-media-n10tqa5il-vanshh1703s-projects.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    age: int = Form(None),
    profile_picture: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Check if username exists
    existing_username = db.query(models.User).filter(models.User.username == username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    existing_email = db.query(models.User).filter(models.User.email == email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Handle Profile Picture Upload
    profile_picture_url = None
    if profile_picture and profile_picture.filename:
        # Generate a unique path using uuid
        ext = os.path.splitext(profile_picture.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)
            
        # The url will be accessible via http://localhost:8000/uploads/filename
        profile_picture_url = f"/uploads/{filename}"

    # Hash Password and Create User
    hashed_password = auth.get_password_hash(password)
    db_user = models.User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        age=age,
        profile_picture=profile_picture_url
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Find user by username
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/posts", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    content: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{filename}"
    
    if not content and not image_url:
        raise HTTPException(status_code=400, detail="Post must contain text or an image")

    db_post = models.Post(
        content=content,
        image_url=image_url,
        author_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/posts", response_model=List[schemas.PostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).all()
    return posts

@app.post("/posts/{post_id}/comments", response_model=schemas.CommentResponse)
def add_comment(
    post_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    db_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        author_id=current_user.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.post("/posts/{post_id}/like")
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    existing_like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == current_user.id
    ).first()
    
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Like removed", "liked": False}
    else:
        new_like = models.Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        db.commit()
        return {"message": "Like added", "liked": True}

