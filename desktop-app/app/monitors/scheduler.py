from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Optional, Any

from PySide6.QtCore import QObject, Signal, QTimer, QThreadPool, QRunnable

from app.core import config
from app.core.models import MonitoredSite, CheckResult, CheckStatus
from app.monitors.http_checker import HttpChecker
from app.monitors.ssl_checker import SslChecker
from app.monitors.header_checker import HeaderChecker
from app.monitors.change_detector import ChangeDetector

if TYPE_CHECKING:
    from app.core.database import DatabaseManager
    from app.notifier.desktop_notifier import DesktopNotifier

logger = logging.getLogger(__name__)

class WorkerSignals(QObject):
    """Signals for the CheckWorker."""
    check_started = Signal(int)
    check_completed = Signal(int, object)
    check_error = Signal(int, str)

class CheckWorker(QRunnable):
    """Worker for executing a site check in a background thread."""

    def __init__(self, site: MonitoredSite, database: 'DatabaseManager', notifier: 'DesktopNotifier', scheduler: 'MonitorScheduler'):
        """
        Initialize the check worker.

        Args:
            site (MonitoredSite): The site to check.
            database (DatabaseManager): The database manager instance.
            notifier (DesktopNotifier): The desktop notifier instance.
            scheduler (MonitorScheduler): The scheduler managing this worker.
        """
        super().__init__()
        self.site = site
        self.database = database
        self.notifier = notifier
        self.scheduler = scheduler
        self.signals = WorkerSignals()
        
        # Instantiate stateless checkers for thread safety
        self.http_checker = HttpChecker()
        self.ssl_checker = SslChecker()
        self.header_checker = HeaderChecker()
        self.change_detector = ChangeDetector()

    def run(self):
        """Execute the check."""
        try:
            self.signals.check_started.emit(self.site.id)
            
            # Execute checks
            http_result = self.http_checker.check(self.site.url)
            ssl_result = self.ssl_checker.check(self.site.url)
            
            # Use headers from http response
            headers_result = self.header_checker.check(http_result.get("headers", {})) 
            
            from datetime import datetime, timezone
            checked_at = datetime.now(timezone.utc).isoformat()
            
            # Create the current check result
            status = CheckStatus.HEALTHY if (http_result.get("status_code") and 200 <= http_result.get("status_code") < 400) else CheckStatus.ERROR
            if status == CheckStatus.HEALTHY and (not ssl_result.get("valid") or headers_result.get("missing")):
                status = CheckStatus.WARNING
                
            issues = []
            if http_result.get("error"):
                issues.append(http_result["error"])
            if ssl_result.get("error"):
                issues.append(ssl_result["error"])
                
            current_result = CheckResult(
                site_id=self.site.id,
                checked_at=checked_at,
                status=status,
                http_status=http_result.get("status_code"),
                response_time_ms=http_result.get("response_time_ms"),
                ssl_valid=ssl_result.get("valid"),
                ssl_expiry=ssl_result.get("expiry"),
                ssl_days_remaining=ssl_result.get("days_remaining"),
                headers_present=headers_result.get("present", []),
                headers_missing=headers_result.get("missing", []),
                headers_score=headers_result.get("score"),
                issues=issues
            )
            
            # Detect changes (requires fetching previous result from DB)
            previous_result = None
            if self.database:
                previous_result = self.database.get_last_check(self.site.id)
                self.database.save_check_result(current_result)
                
            changes = self.change_detector.detect_changes(current_result, previous_result)
            
            # Trigger notification if there are changes
            if changes["is_changed"] and self.notifier:
                self.notifier.notify(
                    title=f"Site Update: {self.site.url}",
                    message=changes["summary"]
                )
                
            self.signals.check_completed.emit(self.site.id, current_result)
            logger.debug(f"Check completed for {self.site.url}")
            
        except Exception as e:
            logger.exception(f"Error checking site {self.site.url}: {e}")
            self.signals.check_error.emit(self.site.id, str(e))

class MonitorScheduler(QObject):
    """Schedules and manages periodic website health checks."""

    check_started = Signal(int)
    check_completed = Signal(int, object)
    check_error = Signal(int, str)
    all_checks_completed = Signal()

    def __init__(self, database: 'DatabaseManager', notifier: 'DesktopNotifier', parent=None):
        """
        Initialize the scheduler.

        Args:
            database (DatabaseManager): The database manager instance.
            notifier (DesktopNotifier): The desktop notifier instance.
            parent (QObject, optional): Parent object. Defaults to None.
        """
        super().__init__(parent)
        self.database = database
        self.notifier = notifier
        
        # Store references to checker instances
        self.http_checker = HttpChecker()
        self.ssl_checker = SslChecker()
        self.header_checker = HeaderChecker()
        self.change_detector = ChangeDetector()
        
        self.timer = QTimer(self)
        self.timer.timeout.connect(self._run_all_checks)
        self.thread_pool = QThreadPool.globalInstance()
        self._interval_seconds = config.DEFAULT_CHECK_INTERVAL_SECONDS
        
        logger.debug("MonitorScheduler initialized")

    def start(self, interval_seconds: Optional[int] = None):
        """
        Start the scheduled checks.

        Args:
            interval_seconds (int, optional): Interval between checks. Defaults to None (uses config).
        """
        if interval_seconds is not None:
            self._interval_seconds = interval_seconds
            
        self.timer.start(self._interval_seconds * 1000)
        logger.info(f"MonitorScheduler started with interval {self._interval_seconds}s")
        
    def stop(self):
        """Stop the scheduled checks."""
        self.timer.stop()
        logger.info("MonitorScheduler stopped")

    def set_interval(self, seconds: int):
        """
        Update the check interval.

        Args:
            seconds (int): New interval in seconds.
        """
        self._interval_seconds = seconds
        if self.timer.isActive():
            self.timer.start(self._interval_seconds * 1000)
            logger.debug(f"MonitorScheduler interval updated to {seconds}s")

    def run_checks_now(self):
        """Trigger an immediate check of all active sites."""
        logger.debug("Immediate check triggered")
        self._run_all_checks()

    def _perform_check(self, site: MonitoredSite):
        """
        Create and start a check worker for a site.

        Args:
            site (MonitoredSite): The site to check.
        """
        worker = CheckWorker(site, self.database, self.notifier, self)
        
        # Connect worker signals to scheduler signals
        worker.signals.check_started.connect(self.check_started)
        worker.signals.check_completed.connect(self.check_completed)
        worker.signals.check_error.connect(self.check_error)
        
        self.thread_pool.start(worker)

    def _run_all_checks(self):
        """Iterate over active sites and start a check worker for each."""
        if not self.database:
            logger.warning("No database configured for MonitorScheduler")
            return
            
        try:
            active_sites = self.database.get_sites(active_only=True)
            for site in active_sites:
                self._perform_check(site)
                
            self.all_checks_completed.emit()
            
        except Exception as e:
            logger.error(f"Error running all checks: {e}")
