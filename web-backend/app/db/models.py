import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:12]}")
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    aadhaar_verified = Column(Boolean, default=False)
    subscription_tier = Column(String, default="free")
    role = Column(String, default="user")
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scans = relationship("ScanReport", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")


class ScanReport(Base):
    __tablename__ = "scan_reports"
    
    id = Column(String, primary_key=True, default=lambda: f"scan_{uuid.uuid4().hex[:12]}")
    user_id = Column(String, ForeignKey("users.id"))
    url = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    duration = Column(String, nullable=True)
    severity_summary = Column(JSON, nullable=True)
    findings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="scans")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, default=lambda: f"sub_{uuid.uuid4().hex[:12]}")
    user_id = Column(String, ForeignKey("users.id"))
    tier = Column(String, nullable=False)
    razorpay_subscription_id = Column(String, nullable=True)
    status = Column(String, default="active")
    renewed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="subscriptions")


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(String, primary_key=True, default=lambda: f"act_{uuid.uuid4().hex[:12]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    user_email = Column(String, nullable=False, index=True)
    user_name = Column(String, nullable=True)
    action_type = Column(String, nullable=False, index=True)  # LOGIN, LOGOUT, SCAN_STARTED, SCAN_COMPLETED, USER_REGISTERED, USER_BLOCKED, USER_UNBLOCKED, PASSWORD_UPDATED
    description = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")  # SUCCESS, WARNING, INFO, ERROR
    ip_address = Column(String, nullable=True)
    location = Column(String, nullable=True)
    device_info = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    user = relationship("User", backref="activities")
