from fastapi import APIRouter, Depends, Query
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
    limit: int = Query(10, ge=1, le=50),
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
        items.append({
            "id": user.id,
            "name": user.name or "Unknown",
            "email": user.email,
            "plan": user.subscription_tier,
            "status": "active",
            "scans": scans_count,
            "joinedAt": user.created_at.isoformat()
        })
        
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(current_admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_scans = db.query(ScanReport).count()
    
    # Mock some data for demonstration
    return {
        "totalUsers": total_users,
        "activeUsers": total_users,
        "totalScans": total_scans,
        "scansToday": total_scans,
        "revenue": {
            "mrr": 124700,
            "currency": "INR"
        },
        "subscriptions": {
            "free": total_users,
            "pro": 0,
            "defense": 0
        },
        "systemHealth": {
            "apiUptime": 99.99,
            "avgResponseTime": "45ms",
            "zapDaemonStatus": "healthy",
            "dbConnectionPool": "5/50",
            "lastIncident": "Never"
        }
    }
