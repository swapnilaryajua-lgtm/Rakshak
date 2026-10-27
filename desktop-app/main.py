"""
Rakshak Desktop Monitor Entry Point.

This is the main entry point for the Rakshak desktop application (Feature 2).
It initializes the local database, sets up background monitoring and notifications,
and launches the PySide6 graphical user interface.
"""

import sys
import logging
from PySide6.QtWidgets import QApplication
from PySide6.QtGui import QIcon

from app.core.database import DatabaseManager
from app.core import config
from app.monitors.scheduler import MonitorScheduler
from app.notifier.desktop_notifier import DesktopNotifier
from app.gui.main_window import MainWindow

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

def main() -> int:
    """
    Initialize and run the Rakshak desktop application.
    """
    app = QApplication(sys.argv)
    
    # Set application metadata
    app.setApplicationName("Rakshak")
    app.setOrganizationName("RakshakSecurity")
    app.setApplicationDisplayName("Rakshak Desktop Monitor")
    
    logger.info("Initializing Rakshak desktop application...")
    
    # Initialize core components
    db_manager = DatabaseManager()
    db_manager.initialize()
    
    desktop_notifier = DesktopNotifier()
    monitor_scheduler = MonitorScheduler(db_manager, desktop_notifier)
    
    # Create and show main window
    main_window = MainWindow(db_manager, monitor_scheduler, desktop_notifier)
    main_window.show()
    
    # Load settings from database
    check_interval = int(db_manager.get_setting('check_interval_seconds', str(config.DEFAULT_CHECK_INTERVAL_SECONDS)))
    notifications_enabled = db_manager.get_setting('notifications_enabled', 'true').lower() == 'true'
    
    logger.info(f"Loaded settings: check_interval={check_interval}s, notifications={notifications_enabled}")
    
    # Start the scheduler
    monitor_scheduler.start(interval_seconds=check_interval)
    
    logger.info("Rakshak started successfully.")
    
    # Start event loop
    return app.exec()

if __name__ == '__main__':
    sys.exit(main())
