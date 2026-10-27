from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    aadhaar_verified: bool = False

class RegisterResponse(BaseModel):
    id: str
    email: str
    message: str
