from __future__ import annotations

from typing import Any
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QGroupBox, 
                               QLabel, QSpinBox, QCheckBox, QPushButton)
from PySide6.QtCore import Signal

class SettingsWidget(QWidget):
    """Settings view for configuring the application."""
    
    settings_changed = Signal(dict)

    def __init__(self, database: Any, parent: QWidget = None):
        super().__init__(parent)
        self.database = database
        self._setup_ui()
        self._load_settings()

    def _setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Monitoring Group
        mon_group = QGroupBox("Monitoring")
        mon_layout = QVBoxLayout(mon_group)
        
        self.interval_spin = QSpinBox()
        self.interval_spin.setRange(1, 60)
        self.interval_spin.setSuffix(" minutes")
        
        ilayout = QHBoxLayout()
        ilayout.addWidget(QLabel("Check Interval:"))
        ilayout.addWidget(self.interval_spin)
        ilayout.addStretch()
        
        mon_layout.addLayout(ilayout)
        mon_layout.addWidget(QLabel("How often websites are checked for status.", parent=self))

        # Notifications Group
        notif_group = QGroupBox("Notifications")
        notif_layout = QVBoxLayout(notif_group)
        
        self.notif_check = QCheckBox("Enable desktop notifications")
        notif_layout.addWidget(self.notif_check)

        # Application Group
        app_group = QGroupBox("Application")
        app_layout = QVBoxLayout(app_group)
        
        self.minimize_check = QCheckBox("Auto-minimize to tray on close")
        app_layout.addWidget(self.minimize_check)

        # Save Button
        save_btn = QPushButton("Save Settings")
        save_btn.clicked.connect(self._save_settings)
        btn_layout = QHBoxLayout()
        btn_layout.addStretch()
        btn_layout.addWidget(save_btn)

        # Add to main layout
        layout.addWidget(mon_group)
        layout.addWidget(notif_group)
        layout.addWidget(app_group)
        layout.addStretch()
        layout.addLayout(btn_layout)

    def _load_settings(self):
        """Load settings from database."""
        interval = int(self.database.get_setting('check_interval_minutes', '5'))
        notif = self.database.get_setting('notifications_enabled', 'true').lower() == 'true'
        minimize = self.database.get_setting('minimize_to_tray', 'true').lower() == 'true'
        self.interval_spin.setValue(interval)
        self.notif_check.setChecked(notif)
        self.minimize_check.setChecked(minimize)

    def _save_settings(self):
        """Save settings to database."""
        self.database.set_setting('check_interval_minutes', str(self.interval_spin.value()))
        self.database.set_setting('notifications_enabled', str(self.notif_check.isChecked()).lower())
        self.database.set_setting('minimize_to_tray', str(self.minimize_check.isChecked()).lower())
        settings = {
            'check_interval': self.interval_spin.value(),
            'enable_notifications': self.notif_check.isChecked(),
            'minimize_to_tray': self.minimize_check.isChecked()
        }
        self.settings_changed.emit(settings)
