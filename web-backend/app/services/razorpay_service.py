import time
from app.core.config import settings

# Stub Razorpay Service

def create_order(plan_id: str) -> dict:
    """
    Creates a Razorpay order. Uses mocked keys for testing.
    """
    amount = 99900 if plan_id == 'pro' else 249900
    return {
        "orderId": f"order_mock_{int(time.time())}",
        "amount": amount,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    }

def verify_payment(payment_id: str, order_id: str, signature: str) -> bool:
    """
    Verifies the payment signature.
    Mocked to always return True for hackathon purposes.
    """
    return True
