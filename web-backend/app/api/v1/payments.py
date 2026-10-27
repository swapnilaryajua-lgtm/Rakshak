from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Subscription
from app.schemas.payments import CheckoutSessionRequest, CheckoutSessionResponse
from app.core.dependencies import get_current_user
from app.services.razorpay_service import create_order, verify_payment
import json

router = APIRouter()

@router.post("/checkout", response_model=CheckoutSessionResponse)
def create_checkout_session(request_data: CheckoutSessionRequest, current_user: User = Depends(get_current_user)):
    order_data = create_order(request_data.planId)
    return order_data

@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    # In a real app, you would verify the signature here using the raw body and razorpay signature header
    payload = await request.json()
    
    # Mocking successful payment processing
    # Extract user_id from notes or customer info in real integration
    # For now, this is just a stub endpoint to show the structure
    return {"status": "ok"}
