from __future__ import annotations

import sqlite3
import json
from pathlib import Path
from typing import Optional

from app.core.config import get_db_path
from app.core.models import MonitoredSite, CheckResult, CheckStatus

"""Database management for the Rakshak Desktop Application."""

class DatabaseManager:
    """Handles all SQLite database operations."""
    
    def __init__(self, db_path: Optional[Path] = None) -> None:
        """Initialize the DatabaseManager with an optional custom path."""
        self.db_path = db_path or get_db_path()
        self.initialize()

    def _get_connection(self) -> sqlite3.Connection:
        """Get a new SQLite database connection."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def get_connection(self) -> sqlite3.Connection:
        """Public wrapper to get a new SQLite database connection."""
        return self._get_connection()

    def initialize(self) -> None:
        """Initialize the database schema, creating tables if they do not exist."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS monitored_sites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT NOT NULL,
                    license_key TEXT NOT NULL,
                    added_at TEXT NOT NULL,
                    is_active INTEGER DEFAULT 1
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS check_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    site_id INTEGER NOT NULL,
                    checked_at TEXT NOT NULL,
                    http_status INTEGER,
                    response_time_ms REAL,
                    ssl_valid INTEGER,
                    ssl_expiry TEXT,
                    ssl_days_remaining INTEGER,
                    headers_present TEXT,
                    headers_missing TEXT,
                    headers_score INTEGER,
                    issues TEXT,
                    status TEXT NOT NULL,
                    FOREIGN KEY (site_id) REFERENCES monitored_sites (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            ''')
            
            conn.commit()

    def add_site(self, url: str, license_key: str) -> int:
        """Add a new site to monitor, returning its ID."""
        from datetime import datetime, timezone
        added_at = datetime.now(timezone.utc).isoformat()
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO monitored_sites (url, license_key, added_at, is_active) VALUES (?, ?, ?, 1)',
                (url, license_key, added_at)
            )
            conn.commit()
            return cursor.lastrowid

    def get_sites(self, active_only: bool = True) -> list[MonitoredSite]:
        """Retrieve a list of monitored sites."""
        query = 'SELECT * FROM monitored_sites'
        if active_only:
            query += ' WHERE is_active = 1'
            
        sites = []
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            for row in cursor.fetchall():
                sites.append(MonitoredSite(
                    id=row['id'],
                    url=row['url'],
                    license_key=row['license_key'],
                    added_at=row['added_at'],
                    is_active=bool(row['is_active'])
                ))
        return sites

    def get_site_by_id(self, site_id: int) -> Optional[MonitoredSite]:
        """Retrieve a specific monitored site by ID."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM monitored_sites WHERE id = ?', (site_id,))
            row = cursor.fetchone()
            if row:
                return MonitoredSite(
                    id=row['id'],
                    url=row['url'],
                    license_key=row['license_key'],
                    added_at=row['added_at'],
                    is_active=bool(row['is_active'])
                )
        return None

    def remove_site(self, site_id: int) -> None:
        """Deactivate a monitored site (soft delete)."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE monitored_sites SET is_active = 0 WHERE id = ?', (site_id,))
            conn.commit()

    def save_check_result(self, result: CheckResult) -> int:
        """Save a health check result into the history."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            ssl_valid_int = None
            if result.ssl_valid is True:
                ssl_valid_int = 1
            elif result.ssl_valid is False:
                ssl_valid_int = 0

            cursor.execute('''
                INSERT INTO check_history (
                    site_id, checked_at, http_status, response_time_ms, 
                    ssl_valid, ssl_expiry, ssl_days_remaining, 
                    headers_present, headers_missing, headers_score, 
                    issues, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                result.site_id,
                result.checked_at,
                result.http_status,
                result.response_time_ms,
                ssl_valid_int,
                result.ssl_expiry,
                result.ssl_days_remaining,
                json.dumps(result.headers_present),
                json.dumps(result.headers_missing),
                result.headers_score,
                json.dumps(result.issues),
                result.status.value
            ))
            conn.commit()
            return cursor.lastrowid

    def get_check_history(self, site_id: Optional[int] = None, limit: int = 100) -> list[CheckResult]:
        """Retrieve check history, optionally filtered by site_id."""
        query = 'SELECT * FROM check_history'
        params = []
        
        if site_id is not None:
            query += ' WHERE site_id = ?'
            params.append(site_id)
            
        query += ' ORDER BY checked_at DESC LIMIT ?'
        params.append(limit)
        
        history = []
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            for row in cursor.fetchall():
                history.append(CheckResult.from_db_row(dict(row)))
        return history

    def get_last_check(self, site_id: int) -> Optional[CheckResult]:
        """Get the most recent check result for a given site."""
        history = self.get_check_history(site_id=site_id, limit=1)
        return history[0] if history else None

    def get_setting(self, key: str, default: str = '') -> str:
        """Retrieve a configuration setting from the database."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT value FROM settings WHERE key = ?', (key,))
            row = cursor.fetchone()
            if row:
                return row['value']
        return default

    def set_setting(self, key: str, value: str) -> None:
        """Save a configuration setting to the database."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
                (key, value, value)
            )
            conn.commit()
