from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    role: str = "user"
    plan: str = "free"

class UserCreate(UserBase):
    password: str
    aadhaar_verified: bool = False

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    phone: Optional[str] = None
    planExpiry: Optional[str] = None
    scansThisMonth: int = 0
    scansLimit: int = 50
    createdAt: str
    aadhaar_verified: Optional[bool] = False

    class Config:
        from_attributes = True

class SubscriptionStatusResponse(BaseModel):
    plan: str
    status: str
    amount: int
    currency: str = "INR"
    billingCycle: str = "monthly"
    nextBillingDate: Optional[str] = None
    features: List[str] = []
