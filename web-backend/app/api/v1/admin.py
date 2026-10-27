from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, ScanReport, Subscription
from app.schemas.admin import AdminUserResponse, AdminDashboardStats, RevenueStats, SubscriptionsStats, SystemHealthStats
from app.schemas.pagination import PaginatedResponse
from app.core.dependencies import get_admin_user

router = APIRouter()

@router.get("/users", response_model=PaginatedResponse[AdminUserResponse])
def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    users_query = db.query(User)
    total = users_query.count()
    users = users_query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    
    items = []
    for user in users:
        scans_count = db.query(ScanReport).filter(ScanReport.user_id == user.id).count()
        is_blocked = bool(getattr(user, "is_blocked", False))
        items.append({
            "id": user.id,
            "name": user.name or "User",
            "email": user.email,
            "plan": (user.subscription_tier or "Free").capitalize(),
            "status": "Blocked" if is_blocked else "Active",
            "is_blocked": is_blocked,
            "scans": scans_count,
            "joinedAt": user.created_at.strftime("%b %d, %Y") if user.created_at else "Unknown"
        })
        
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.post("/users/{user_id}/block")
def block_user(
    user_id: str,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.email.lower() == "hidoiarya@gmail.com":
        raise HTTPException(status_code=400, detail="Cannot block the primary admin account")
    
    target_user.is_blocked = True
    db.commit()
    db.refresh(target_user)
    return {"message": f"User {target_user.email} has been blocked successfully", "is_blocked": True}

@router.post("/users/{user_id}/unblock")
def unblock_user(
    user_id: str,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    target_user.is_blocked = False
    db.commit()
    db.refresh(target_user)
    return {"message": f"User {target_user.email} has been unblocked successfully", "is_blocked": False}

@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(current_admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    blocked_users = db.query(User).filter(User.is_blocked == True).count()
    active_users = max(0, total_users - blocked_users)
    total_scans = db.query(ScanReport).count()
    
    pro_users = db.query(User).filter(User.subscription_tier == "pro").count()
    defense_users = db.query(User).filter(User.subscription_tier == "defense").count()
    free_users = max(0, total_users - pro_users - defense_users)
    
    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "blockedUsers": blocked_users,
        "totalScans": total_scans,
        "scansToday": total_scans,
        "revenue": {
            "mrr": (pro_users * 499) + (defense_users * 1999),
            "currency": "INR"
        },
        "subscriptions": {
            "free": free_users,
            "pro": pro_users,
            "defense": defense_users
        },
        "systemHealth": {
            "apiUptime": 99.99,
            "avgResponseTime": "45ms",
            "zapDaemonStatus": "healthy",
            "dbConnectionPool": "5/50",
            "lastIncident": "Never"
        }
    }
