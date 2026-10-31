from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, ScanReport, Subscription
from app.schemas.users import UserResponse, SubscriptionStatusResponse, UserUpdateRequest
from app.schemas.scans import ScanHistoryItem
from app.schemas.pagination import PaginatedResponse
from app.core.dependencies import get_current_user
from app.core.security import verify_password, get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
@router.get("/me/", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scans_this_month = db.query(ScanReport).filter(ScanReport.user_id == current_user.id).count()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "plan": current_user.subscription_tier,
        "scansThisMonth": scans_this_month,
        "scansLimit": 50 if current_user.subscription_tier != "free" else 10,
        "createdAt": current_user.created_at.isoformat() if current_user.created_at else "",
        "aadhaar_verified": getattr(current_user, "aadhaar_verified", True)
    }

@router.put("/me", response_model=UserResponse)
@router.put("/me/", response_model=UserResponse)
def update_user_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_data.name is not None and update_data.name.strip():
        current_user.name = update_data.name.strip()

    if update_data.new_password:
        if not update_data.current_password or not verify_password(update_data.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        if len(update_data.new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
        current_user.hashed_password = get_password_hash(update_data.new_password)

    db.commit()
    db.refresh(current_user)

    scans_this_month = db.query(ScanReport).filter(ScanReport.user_id == current_user.id).count()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "plan": current_user.subscription_tier,
        "scansThisMonth": scans_this_month,
        "scansLimit": 50 if current_user.subscription_tier != "free" else 10,
        "createdAt": current_user.created_at.isoformat() if current_user.created_at else "",
        "aadhaar_verified": getattr(current_user, "aadhaar_verified", True)
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
@router.get("/me/subscription/", response_model=SubscriptionStatusResponse)
def get_user_subscription(current_user: User = Depends(get_current_user)):
    tier = (current_user.subscription_tier or "free").lower()
    amount = 499900 if tier == "defense" else (99900 if tier == "pro" else 0)
    features = (
        ["Unlimited Autonomous Scans", "Zero-Day Exploit Defense", "Real-Time WAF Filtering", "Custom Rule Engine", "24/7 Dedicated Support"]
        if tier == "defense"
        else (["50 Scans per Month", "Detailed Vulnerability Reports", "Automated Remediation Guides", "Priority Email Support"]
              if tier == "pro"
              else ["10 Scans per Month", "Standard OWASP Audit", "Community Support", "Basic Security Reports"])
    )
    return {
        "plan": tier.capitalize(),
        "status": "active",
        "amount": amount,
        "currency": "INR",
        "billingCycle": "monthly",
        "features": features
    }
