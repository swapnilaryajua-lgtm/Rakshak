from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import Token, RegisterRequest, RegisterResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.services.kyc_service import verify_aadhaar

router = APIRouter()

@router.post("/register", response_model=RegisterResponse)
def register(user_in: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    # Aadhaar Mock Logic
    verified = False
    if user_in.aadhaar_verified:
        verified = verify_aadhaar("mock_aadhaar_number")
        
    user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        aadhaar_verified=verified
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return RegisterResponse(id=user.id, email=user.email, message="Registration successful")

@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if getattr(user, "is_blocked", False):
        raise HTTPException(status_code=403, detail="Your account has been blocked by an administrator")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
