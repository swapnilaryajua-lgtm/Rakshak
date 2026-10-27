from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    role: str = "user"
    plan: str = "free"

class UserCreate(UserBase):
    password: str
    aadhaar_verified: bool = False

class UserResponse(UserBase):
    id: str
    phone: Optional[str] = None
    planExpiry: Optional[str] = None
    scansThisMonth: int = 0
    scansLimit: int = 50
    createdAt: str

    class Config:
        from_attributes = True

class SubscriptionStatusResponse(BaseModel):
    plan: str
    status: str
    amount: int
    currency: str = "INR"
    billingCycle: str = "monthly"
    nextBillingDate: Optional[str] = None
    features: list[str] = []
