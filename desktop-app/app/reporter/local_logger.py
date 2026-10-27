from __future__ import annotations

import csv
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

from app.core.database import DatabaseManager
from app.core.models import CheckResult

logger = logging.getLogger(__name__)

class LocalLogger:
    """Local logger for saving and exporting site check results."""

    def __init__(self, database: DatabaseManager) -> None:
        """
        Initialize the local logger.

        Args:
            database: The DatabaseManager instance to use for data access.
        """
        self.database = database

    def log_check(self, result: CheckResult) -> int:
        """
        Log a check result into the database.

        Args:
            result: The check result to save.

        Returns:
            int: The row ID of the inserted check result.
        """
        logger.debug(f"Logging check result for site_id: {result.site_id}")
        return self.database.save_check_result(result)

    def get_history(self, site_id: Optional[int] = None, limit: int = 100) -> list[CheckResult]:
        """
        Retrieve the check history.

        Args:
            site_id: Optional site ID to filter history by.
            limit: Maximum number of records to retrieve.

        Returns:
            list[CheckResult]: A list of check results.
        """
        return self.database.get_check_history(site_id=site_id, limit=limit)

    def export_csv(self, filepath: Path, site_id: Optional[int] = None) -> int:
        """
        Export check history to a CSV file.

        Args:
            filepath: Path object specifying where to save the CSV.
            site_id: Optional site ID to filter exported history.

        Returns:
            int: The number of rows exported.
        """
        logger.info(f"Exporting check history to {filepath}")
        
        query = '''
            SELECT 
                c.checked_at, 
                m.url, 
                c.http_status, 
                c.response_time_ms, 
                c.ssl_valid, 
                c.ssl_expiry, 
                c.headers_score, 
                c.headers_missing, 
                c.issues, 
                c.status
            FROM check_history c
            JOIN monitored_sites m ON c.site_id = m.id
        '''
        params: List[Any] = []
        if site_id is not None:
            query += ' WHERE c.site_id = ?'
            params.append(site_id)
            
        query += ' ORDER BY c.checked_at DESC'
        
        row_count = 0
        try:
            with self.database.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                rows = cursor.fetchall()
                
                with open(filepath, mode='w', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    # Write headers
                    writer.writerow([
                        'checked_at', 'url', 'http_status', 'response_time_ms', 
                        'ssl_valid', 'ssl_expiry', 'headers_score', 'headers_missing', 
                        'issues', 'status'
                    ])
                    # Write data
                    for row in rows:
                        writer.writerow(row)
                        row_count += 1
                        
        except Exception as e:
            logger.error(f"Failed to export CSV to {filepath}: {e}")
            raise
            
        return row_count

    def get_summary_stats(self, site_id: int) -> dict[str, Any]:
        """
        Get summary statistics for a specific site.

        Args:
            site_id: The ID of the monitored site.

        Returns:
            dict: A dictionary containing summary statistics.
        """
        logger.debug(f"Getting summary stats for site_id: {site_id}")
        
        stats: dict[str, Any] = {
            'total_checks': 0,
            'healthy_count': 0,
            'warning_count': 0,
            'critical_count': 0,
            'avg_response_time': 0.0,
            'last_check_at': None
        }
        
        query = '''
            SELECT 
                COUNT(*) as total_checks,
                SUM(CASE WHEN status = 'healthy' THEN 1 ELSE 0 END) as healthy_count,
                SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) as warning_count,
                SUM(CASE WHEN status = 'critical' THEN 1 ELSE 0 END) as critical_count,
                AVG(response_time_ms) as avg_response_time,
                MAX(checked_at) as last_check_at
            FROM check_history
            WHERE site_id = ?
        '''
        
        try:
            with self.database.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, (site_id,))
                row = cursor.fetchone()
                
                if row and row[0] > 0:
                    stats['total_checks'] = row[0] or 0
                    stats['healthy_count'] = row[1] or 0
                    stats['warning_count'] = row[2] or 0
                    stats['critical_count'] = row[3] or 0
                    stats['avg_response_time'] = float(row[4]) if row[4] is not None else 0.0
                    stats['last_check_at'] = row[5]
                    
        except Exception as e:
            logger.error(f"Failed to get summary stats for site_id {site_id}: {e}")
            
        return stats
