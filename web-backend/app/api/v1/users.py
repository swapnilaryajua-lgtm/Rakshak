from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, ScanReport, Subscription
from app.schemas.users import UserResponse, SubscriptionStatusResponse
from app.schemas.scans import ScanHistoryItem
from app.schemas.pagination import PaginatedResponse
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scans_this_month = db.query(ScanReport).filter(ScanReport.user_id == current_user.id).count()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "plan": current_user.subscription_tier,
        "scansThisMonth": scans_this_month,
        "scansLimit": 50 if current_user.subscription_tier != "free" else 5,
        "createdAt": current_user.created_at.isoformat()
    }

@router.get("/me/scans", response_model=PaginatedResponse[ScanHistoryItem])
def get_user_scans(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    scans_query = db.query(ScanReport).filter(ScanReport.user_id == current_user.id)
    total = scans_query.count()
    scans = scans_query.order_by(ScanReport.created_at.desc()).offset(offset).limit(limit).all()
    
    items = []
    for scan in scans:
        summary = scan.severity_summary or {}
        items.append({
            "id": scan.id,
            "url": scan.url,
            "date": scan.created_at.isoformat(),
            "status": scan.status,
            "critical": summary.get("critical", 0),
            "high": summary.get("high", 0),
            "medium": summary.get("medium", 0),
            "low": summary.get("low", 0),
        })
        
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/me/subscription", response_model=SubscriptionStatusResponse)
def get_user_subscription(current_user: User = Depends(get_current_user)):
    return {
        "plan": current_user.subscription_tier,
        "status": "active",
        "amount": 99900 if current_user.subscription_tier == "pro" else 0,
        "currency": "INR",
        "billingCycle": "monthly",
        "features": ["Unlimited scans", "Real-time monitoring", "Priority support"] if current_user.subscription_tier != "free" else ["Limited scans"]
    }
