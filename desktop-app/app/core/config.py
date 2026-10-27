from __future__ import annotations

import os
from pathlib import Path

"""Configuration settings for the Rakshak Desktop Application."""

APP_NAME = 'Rakshak'
APP_VERSION = '0.1.0'
DEFAULT_CHECK_INTERVAL_SECONDS = 300
MIN_CHECK_INTERVAL_SECONDS = 60
MAX_CHECK_INTERVAL_SECONDS = 3600
DB_FILENAME = 'rakshak_monitor.db'
HTTP_TIMEOUT = 15
SSL_TIMEOUT = 10
USER_AGENT = 'Rakshak-Monitor/0.1.0'
SECURITY_HEADERS = [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy'
]

def get_data_dir() -> Path:
    """Get the application data directory, creating it if it doesn't exist."""
    appdata = os.environ.get('APPDATA')
    if appdata:
        base_dir = Path(appdata)
    else:
        base_dir = Path.home() / '.config'
    
    data_dir = base_dir / APP_NAME
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir

def get_db_path() -> Path:
    """Get the absolute path to the SQLite database file."""
    return get_data_dir() / DB_FILENAME
