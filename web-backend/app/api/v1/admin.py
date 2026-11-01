from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import not_, or_
from app.db.database import get_db
from app.db.models import User, ScanReport, Subscription, ActivityLog
from app.schemas.admin import AdminUserResponse, AdminDashboardStats, RevenueStats, SubscriptionsStats, SystemHealthStats
from app.schemas.pagination import PaginatedResponse
from app.core.dependencies import get_admin_user

router = APIRouter()

def is_test_user_condition():
    """Condition to exclude automated test/agent logins from the admin panel."""
    return or_(
        User.email.ilike("%test%"),
        User.email.ilike("%example.%"),
        User.email.ilike("%agent%"),
        User.name.ilike("%test%"),
        User.name.ilike("%agent%")
    )

@router.get("/users", response_model=PaginatedResponse[AdminUserResponse])
def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(500, ge=1, le=1000),
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    # Exclude test/agent accounts from user management
    users_query = db.query(User).filter(not_(is_test_user_condition()))
    total = users_query.count()
    users = users_query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    
    # Pre-fetch scan counts in 1 single grouped query to prevent N+1 overhead
    user_ids = [u.id for u in users]
    scan_counts = {}
    if user_ids:
        from sqlalchemy import func
        scan_counts_tuples = (
            db.query(ScanReport.user_id, func.count(ScanReport.id))
            .filter(ScanReport.user_id.in_(user_ids))
            .group_by(ScanReport.user_id)
            .all()
        )
        scan_counts = {uid: count for uid, count in scan_counts_tuples}

    items = []
    for user in users:
        scans_count = scan_counts.get(user.id, 0)
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

@router.get("/activity")
def get_admin_activity(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    action: str = Query("ALL"),
    search: str = Query(None),
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    query = db.query(ActivityLog)
    
    if action and action.upper() != "ALL":
        query = query.filter(ActivityLog.action_type == action.upper())
        
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ActivityLog.user_email.ilike(term),
                ActivityLog.user_name.ilike(term),
                ActivityLog.description.ilike(term),
                ActivityLog.location.ilike(term),
                ActivityLog.ip_address.ilike(term)
            )
        )
        
    total = query.count()
    items_db = query.order_by(ActivityLog.created_at.desc()).offset(offset).limit(limit).all()
    
    items = []
    for item in items_db:
        items.append({
            "id": item.id,
            "userId": item.user_id,
            "userEmail": item.user_email,
            "userName": item.user_name or item.user_email.split('@')[0],
            "actionType": item.action_type,
            "description": item.description,
            "status": item.status,
            "ipAddress": item.ip_address or "—",
            "location": item.location or "India",
            "deviceInfo": item.device_info or "Web Browser",
            "timestamp": item.created_at.isoformat() if item.created_at else "",
            "timeFormatted": item.created_at.strftime("%b %d, %Y • %I:%M %p") if item.created_at else ""
        })
        
    total_logins = db.query(ActivityLog).filter(ActivityLog.action_type == "LOGIN").count()
    total_scans_logged = db.query(ActivityLog).filter(ActivityLog.action_type == "SCAN_COMPLETED").count()
    total_registrations = db.query(ActivityLog).filter(ActivityLog.action_type == "USER_REGISTERED").count()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "summary": {
            "totalActivities": total,
            "totalLogins": total_logins,
            "totalScansLogged": total_scans_logged,
            "totalRegistrations": total_registrations
        }
    }

@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(current_admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    # Filter out test/agent logins from telemetry
    real_users_query = db.query(User).filter(not_(is_test_user_condition()))
    total_users = real_users_query.count()
    blocked_users = real_users_query.filter(User.is_blocked == True).count()
    active_users = max(0, total_users - blocked_users)
    
    # Exclude scans initiated by test/agent accounts
    test_user_ids = db.query(User.id).filter(is_test_user_condition()).subquery()
    total_scans = db.query(ScanReport).filter(~ScanReport.user_id.in_(test_user_ids)).count()
    
    pro_users = real_users_query.filter(User.subscription_tier == "pro").count()
    defense_users = real_users_query.filter(User.subscription_tier == "defense").count()
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
