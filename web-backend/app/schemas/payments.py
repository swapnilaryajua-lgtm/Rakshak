from pydantic import BaseModel

class CheckoutSessionRequest(BaseModel):
    planId: str

class CheckoutSessionResponse(BaseModel):
    orderId: str
    amount: int
    currency: str
    key: str
