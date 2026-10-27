from __future__ import annotations

from typing import Any
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QTableWidget, 
                               QTableWidgetItem, QPushButton, QLabel, QHeaderView, QMessageBox)
from PySide6.QtCore import Signal, Qt
from app.gui.resources import Colors
from app.gui.add_site_dialog import AddSiteDialog
from app.core.models import CheckStatus

class DashboardWidget(QWidget):
    """Dashboard view for showing summary and monitored sites."""
    
    site_added = Signal()
    site_removed = Signal(int)

    def __init__(self, database: Any, parent: QWidget = None):
        super().__init__(parent)
        self.database = database
        self._setup_ui()

    def _setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Summary Cards
        summary_layout = QHBoxLayout()
        self.total_lbl = self._create_summary_card("Total Sites", "0", Colors.TEXT_PRIMARY)
        self.healthy_lbl = self._create_summary_card("Healthy", "0", Colors.ACCENT_SUCCESS)
        self.issues_lbl = self._create_summary_card("Issues", "0", Colors.ACCENT_DANGER)
        
        summary_layout.addWidget(self.total_lbl.parentWidget())
        summary_layout.addWidget(self.healthy_lbl.parentWidget())
        summary_layout.addWidget(self.issues_lbl.parentWidget())
        layout.addLayout(summary_layout)

        # Controls
        controls_layout = QHBoxLayout()
        add_btn = QPushButton("+ Add Site")
        add_btn.clicked.connect(self._on_add_site)
        controls_layout.addWidget(add_btn)
        controls_layout.addStretch()
        layout.addLayout(controls_layout)

        # Table
        self.table = QTableWidget(0, 6)
        self.table.setHorizontalHeaderLabels(["URL", "Status", "Last Check", "Response Time", "SSL", "Actions"])
        self.table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.Stretch)
        self.table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        
        layout.addWidget(self.table)
        self.refresh_data()

    def _create_summary_card(self, title: str, value: str, color: str) -> QLabel:
        card = QWidget()
        card.setObjectName("DashboardCard")
        clayout = QVBoxLayout(card)
        
        title_lbl = QLabel(title)
        title_lbl.setStyleSheet(f"color: {Colors.TEXT_SECONDARY}; font-size: 14px;")
        
        val_lbl = QLabel(value)
        val_lbl.setStyleSheet(f"color: {color}; font-size: 24px; font-weight: bold;")
        
        clayout.addWidget(title_lbl)
        clayout.addWidget(val_lbl)
        return val_lbl

    def refresh_data(self):
        """Reload site data from the database."""
        sites = self.database.get_sites(active_only=True)
        self.table.setRowCount(len(sites))
        healthy = 0
        issues = 0
        for row_idx, site in enumerate(sites):
            self.table.setItem(row_idx, 0, QTableWidgetItem(site.url))
            last_check = self.database.get_last_check(site.id)
            if last_check:
                status_text = last_check.status.value
                self.table.setItem(row_idx, 1, QTableWidgetItem(status_text))
                self.table.setItem(row_idx, 2, QTableWidgetItem(last_check.checked_at))
                self.table.setItem(row_idx, 3, QTableWidgetItem(f"{last_check.response_time_ms:.0f}ms" if last_check.response_time_ms else "—"))
                self.table.setItem(row_idx, 4, QTableWidgetItem("Valid" if last_check.ssl_valid else "Invalid" if last_check.ssl_valid is not None else "—"))
                self.table.setItem(row_idx, 5, QTableWidgetItem(str(len(last_check.issues)) if last_check.issues else "0"))
                if last_check.status == CheckStatus.HEALTHY:
                    healthy += 1
                else:
                    issues += 1
            else:
                self.table.setItem(row_idx, 1, QTableWidgetItem("Pending"))
                for col in range(2, 6):
                    self.table.setItem(row_idx, col, QTableWidgetItem("—"))
        self.total_lbl.setText(str(len(sites)))
        self.healthy_lbl.setText(str(healthy))
        self.issues_lbl.setText(str(issues))

    def update_site_status(self, site_id: int, result: Any):
        """Update a specific row in-place."""
        pass

    def _on_add_site(self):
        """Show the add site dialog."""
        dialog = AddSiteDialog(self)
        if dialog.exec() == AddSiteDialog.DialogCode.Accepted:
            url, key = dialog.get_data()
            # Call database to add site
            self.database.add_site(url, key)
            self.refresh_data()
            self.site_added.emit()
