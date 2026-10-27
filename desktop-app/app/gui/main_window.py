from __future__ import annotations

from typing import Any
from PySide6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                               QStackedWidget, QPushButton, QLabel, QFrame)
from PySide6.QtCore import Qt
from PySide6.QtGui import QCloseEvent

from app.gui.resources import APP_STYLESHEET
from app.gui.tray_icon import TrayIcon
from app.gui.dashboard_widget import DashboardWidget
from app.gui.history_widget import HistoryWidget
from app.gui.settings_widget import SettingsWidget

class MainWindow(QMainWindow):
    """Main window of the Rakshak application."""

    def __init__(self, database: Any, scheduler: Any, notifier_instance: Any):
        super().__init__()
        self.database = database
        self.scheduler = scheduler
        self.notifier = notifier_instance
        self.really_quit = False

        self.setWindowTitle("Rakshak — Website Monitor")
        self.setMinimumSize(900, 600)
        self.setStyleSheet(APP_STYLESHEET)

        self._setup_ui()
        self._setup_tray()
        self._connect_signals()

    def _setup_ui(self):
        """Initialize the UI components."""
        main_widget = QWidget()
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Top Bar
        top_bar = QFrame()
        top_bar.setObjectName("TopBar")
        top_bar.setFixedHeight(60)
        top_layout = QHBoxLayout(top_bar)
        top_layout.setContentsMargins(20, 0, 20, 0)

        app_title = QLabel("Rakshak")
        app_title.setObjectName("AppTitle")
        
        self.check_now_btn = QPushButton("Check Now")
        self.status_label = QLabel("Status: Idle")

        top_layout.addWidget(app_title)
        top_layout.addStretch()
        top_layout.addWidget(self.status_label)
        top_layout.addSpacing(20)
        top_layout.addWidget(self.check_now_btn)

        # Main Content Area
        content_area = QWidget()
        content_layout = QHBoxLayout(content_area)
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)

        # Sidebar
        sidebar = QFrame()
        sidebar.setObjectName("Sidebar")
        sidebar.setFixedWidth(200)
        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(0, 20, 0, 0)
        sidebar_layout.setAlignment(Qt.AlignmentFlag.AlignTop)

        self.nav_btns = []
        
        self.dashboard_btn = QPushButton("Dashboard")
        self.dashboard_btn.setCheckable(True)
        self.dashboard_btn.setChecked(True)
        
        self.history_btn = QPushButton("History")
        self.history_btn.setCheckable(True)
        
        self.settings_btn = QPushButton("Settings")
        self.settings_btn.setCheckable(True)

        self.nav_btns.extend([self.dashboard_btn, self.history_btn, self.settings_btn])
        
        for btn in self.nav_btns:
            btn.setFixedHeight(40)
            sidebar_layout.addWidget(btn)
            btn.clicked.connect(lambda checked, b=btn: self._on_nav_clicked(b))

        # Stacked Widget
        self.stacked_widget = QStackedWidget()
        
        self.dashboard_view = DashboardWidget(self.database, self)
        self.history_view = HistoryWidget(self.database, self)
        self.settings_view = SettingsWidget(self.database, self)
        
        self.stacked_widget.addWidget(self.dashboard_view)
        self.stacked_widget.addWidget(self.history_view)
        self.stacked_widget.addWidget(self.settings_view)

        content_layout.addWidget(sidebar)
        content_layout.addWidget(self.stacked_widget)

        # Status Bar
        self.bottom_status_label = QLabel("Next check in: -- minutes")
        self.statusBar().addWidget(self.bottom_status_label)

        # Assemble main layout
        main_layout.addWidget(top_bar)
        main_layout.addWidget(content_area)

        self.setCentralWidget(main_widget)

    def _setup_tray(self):
        """Initialize the system tray icon."""
        self.tray = TrayIcon(self)
        self.tray.show()

    def _connect_signals(self):
        """Connect signals to slots."""
        self.tray.signals.show_requested.connect(self.bring_to_front)
        self.tray.signals.check_now_requested.connect(self._run_check_now)
        self.tray.signals.settings_requested.connect(lambda: self.dashboard_btn.setChecked(False) or self.settings_btn.setChecked(True) or self.stacked_widget.setCurrentWidget(self.settings_view))
        self.tray.signals.quit_requested.connect(self._quit_app)

        self.check_now_btn.clicked.connect(self._run_check_now)
        
        # Connect scheduler signals
        self.scheduler.check_completed.connect(self._on_check_completed)
        self.scheduler.all_checks_completed.connect(lambda: self.status_label.setText("Status: Idle"))

    def _on_nav_clicked(self, clicked_btn: QPushButton):
        """Handle navigation button clicks."""
        for btn in self.nav_btns:
            btn.setChecked(btn == clicked_btn)
            
        if clicked_btn == self.dashboard_btn:
            self.stacked_widget.setCurrentWidget(self.dashboard_view)
            self.dashboard_view.refresh_data()
        elif clicked_btn == self.history_btn:
            self.stacked_widget.setCurrentWidget(self.history_view)
            self.history_view.refresh_data()
        elif clicked_btn == self.settings_btn:
            self.stacked_widget.setCurrentWidget(self.settings_view)

    def _on_check_completed(self, site_id: int, result: Any):
        """Handle check completion from scheduler."""
        self.status_label.setText("Status: Idle")
        self.dashboard_view.refresh_data()

    def _run_check_now(self):
        """Run manual check."""
        self.status_label.setText("Status: Checking...")
        self.scheduler.run_checks_now()

    def bring_to_front(self):
        """Bring the window to the front."""
        self.showNormal()
        self.activateWindow()
        self.raise_()

    def _quit_app(self):
        """Quit the application."""
        self.really_quit = True
        self.close()

    def closeEvent(self, event: QCloseEvent):
        """Override close event to minimize to tray instead."""
        if not self.really_quit:
            event.ignore()
            self.hide()
            self.tray.show_status_notification("Rakshak", "App is still running in the background.")
        else:
            event.accept()
