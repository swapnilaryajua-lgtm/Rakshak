from pydantic import BaseModel
from typing import Dict

class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    plan: str
    status: str
    is_blocked: bool = False
    scans: int
    joinedAt: str

    class Config:
        from_attributes = True

class RevenueStats(BaseModel):
    mrr: int
    currency: str = "INR"

class SubscriptionsStats(BaseModel):
    free: int
    pro: int
    defense: int

class SystemHealthStats(BaseModel):
    apiUptime: float
    avgResponseTime: str
    zapDaemonStatus: str
    dbConnectionPool: str
    lastIncident: str

class AdminDashboardStats(BaseModel):
    totalUsers: int
    activeUsers: int
    blockedUsers: int = 0
    totalScans: int
    scansToday: int
    revenue: RevenueStats
    subscriptions: SubscriptionsStats
    systemHealth: SystemHealthStats
