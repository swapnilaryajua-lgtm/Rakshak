from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

class ScanSubmitRequest(BaseModel):
    url: HttpUrl

class ScanSummary(BaseModel):
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    info: int = 0
    total: int = 0

class Vulnerability(BaseModel):
    id: str
    name: str
    severity: str
    description: str
    location: str
    remediation: str
    cweId: str
    references: List[str] = []

class ScanReportResponse(BaseModel):
    id: str
    url: str
    timestamp: str
    date: Optional[str] = None
    duration: Optional[str] = None
    status: str
    summary: Optional[ScanSummary] = None
    vulnerabilities: Optional[List[Vulnerability]] = None
    totalVulnerabilities: Optional[int] = 0

    class Config:
        from_attributes = True

class ScanHistoryItem(BaseModel):
    id: str
    url: str
    date: str
    status: str
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0

    class Config:
        from_attributes = True
