from __future__ import annotations

from typing import Any, Optional
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QComboBox, 
                               QPushButton, QTableView, QHeaderView)
from PySide6.QtGui import QStandardItemModel

class HistoryWidget(QWidget):
    """History view showing past checks."""

    def __init__(self, database: Any, parent: QWidget = None):
        super().__init__(parent)
        self.database = database
        self._setup_ui()

    def _setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        # Filters and Controls
        top_layout = QHBoxLayout()
        
        self.site_combo = QComboBox()
        self.site_combo.addItem("All Sites")
        # Populated from db
        
        refresh_btn = QPushButton("Refresh")
        refresh_btn.setProperty("class", "secondary-button")
        refresh_btn.clicked.connect(lambda: self.refresh_data())
        
        export_btn = QPushButton("Export CSV")
        export_btn.clicked.connect(self._export_csv)

        top_layout.addWidget(self.site_combo)
        top_layout.addWidget(refresh_btn)
        top_layout.addStretch()
        top_layout.addWidget(export_btn)
        
        layout.addLayout(top_layout)

        # Table
        self.table_view = QTableView()
        self.model = QStandardItemModel(0, 7)
        self.model.setHorizontalHeaderLabels(["Time", "URL", "Status", "HTTP Code", "Response Time", "SSL", "Issues"])
        
        self.table_view.setModel(self.model)
        self.table_view.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.table_view.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)
        self.table_view.setEditTriggers(QTableView.EditTrigger.NoEditTriggers)
        
        layout.addWidget(self.table_view)

    def refresh_data(self, site_id: Optional[int] = None):
        """Reload history data."""
        self.model.removeRows(0, self.model.rowCount())
        history = self.database.get_check_history(site_id=site_id, limit=500)
        sites = {s.id: s for s in self.database.get_sites(active_only=False)}
        for result in history:
            url = sites.get(result.site_id, None)
            url_text = url.url if url else str(result.site_id)
            from PySide6.QtGui import QStandardItem
            row = [
                QStandardItem(result.checked_at),
                QStandardItem(url_text),
                QStandardItem(result.status.value),
                QStandardItem(str(result.http_status) if result.http_status else '—'),
                QStandardItem(f"{result.response_time_ms:.0f}ms" if result.response_time_ms else '—'),
                QStandardItem('Valid' if result.ssl_valid else 'Invalid' if result.ssl_valid is not None else '—'),
                QStandardItem(', '.join(result.issues) if result.issues else 'None'),
            ]
            self.model.appendRow(row)

    def _export_csv(self):
        """Export history data to CSV."""
        from PySide6.QtWidgets import QFileDialog
        from app.reporter.local_logger import LocalLogger
        from pathlib import Path
        filepath, _ = QFileDialog.getSaveFileName(self, 'Export CSV', '', 'CSV Files (*.csv)')
        if filepath:
            logger_inst = LocalLogger(self.database)
            count = logger_inst.export_csv(Path(filepath))
