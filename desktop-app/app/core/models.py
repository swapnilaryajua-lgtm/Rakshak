from __future__ import annotations

import enum
from dataclasses import dataclass, field
from typing import Optional

"""Data models for the Rakshak Desktop Application."""

class CheckStatus(enum.Enum):
    """Status of a website health check."""
    HEALTHY = 'healthy'
    WARNING = 'warning'
    CRITICAL = 'critical'
    ERROR = 'error'

@dataclass
class MonitoredSite:
    """Represents a monitored website."""
    url: str
    license_key: str
    added_at: str
    id: Optional[int] = None
    is_active: bool = True

@dataclass
class CheckResult:
    """Result of a single website health check."""
    site_id: int
    checked_at: str
    status: CheckStatus
    http_status: Optional[int] = None
    response_time_ms: Optional[float] = None
    ssl_valid: Optional[bool] = None
    ssl_expiry: Optional[str] = None
    ssl_days_remaining: Optional[int] = None
    headers_present: list[str] = field(default_factory=list)
    headers_missing: list[str] = field(default_factory=list)
    headers_score: int = 0
    issues: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        """Convert the check result to a dictionary."""
        return {
            'site_id': self.site_id,
            'checked_at': self.checked_at,
            'status': self.status.value,
            'http_status': self.http_status,
            'response_time_ms': self.response_time_ms,
            'ssl_valid': self.ssl_valid,
            'ssl_expiry': self.ssl_expiry,
            'ssl_days_remaining': self.ssl_days_remaining,
            'headers_present': self.headers_present,
            'headers_missing': self.headers_missing,
            'headers_score': self.headers_score,
            'issues': self.issues,
        }

    @classmethod
    def from_db_row(cls, row: dict) -> CheckResult:
        """Create a CheckResult from a database row dictionary."""
        import json
        
        def parse_json(val: Optional[str], default: list) -> list:
            if not val:
                return default
            try:
                return json.loads(val)
            except json.JSONDecodeError:
                return default

        return cls(
            site_id=row['site_id'],
            checked_at=row['checked_at'],
            status=CheckStatus(row['status']),
            http_status=row.get('http_status'),
            response_time_ms=row.get('response_time_ms'),
            ssl_valid=bool(row['ssl_valid']) if row.get('ssl_valid') is not None else None,
            ssl_expiry=row.get('ssl_expiry'),
            ssl_days_remaining=row.get('ssl_days_remaining'),
            headers_present=parse_json(row.get('headers_present'), []),
            headers_missing=parse_json(row.get('headers_missing'), []),
            headers_score=row.get('headers_score', 0),
            issues=parse_json(row.get('issues'), [])
        )
