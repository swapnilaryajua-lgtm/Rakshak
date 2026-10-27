from __future__ import annotations

from PySide6.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QLabel, 
                               QLineEdit, QPushButton)
from PySide6.QtCore import Qt
from app.gui.resources import Colors

class AddSiteDialog(QDialog):
    """Dialog to add a new monitored site."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Add Monitored Site")
        self.setMinimumWidth(400)
        self._setup_ui()

    def _setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(15)

        # URL Input
        layout.addWidget(QLabel("Website URL"))
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("https://example.com")
        layout.addWidget(self.url_input)

        self.url_error = QLabel("")
        self.url_error.setStyleSheet(f"color: {Colors.ACCENT_DANGER}; font-size: 11px;")
        layout.addWidget(self.url_error)

        # License Input
        layout.addWidget(QLabel("License Key (Optional)"))
        self.license_input = QLineEdit()
        self.license_input.setPlaceholderText("XXXX-XXXX-XXXX-XXXX")
        layout.addWidget(self.license_input)

        self.license_error = QLabel("")
        self.license_error.setStyleSheet(f"color: {Colors.ACCENT_DANGER}; font-size: 11px;")
        layout.addWidget(self.license_error)

        # Buttons
        btn_layout = QHBoxLayout()
        self.cancel_btn = QPushButton("Cancel")
        self.cancel_btn.setProperty("class", "secondary-button")
        self.cancel_btn.clicked.connect(self.reject)
        
        self.ok_btn = QPushButton("Add Site")
        self.ok_btn.clicked.connect(self._validate_and_accept)

        btn_layout.addStretch()
        btn_layout.addWidget(self.cancel_btn)
        btn_layout.addWidget(self.ok_btn)
        
        layout.addStretch()
        layout.addLayout(btn_layout)

    def _validate_and_accept(self):
        """Validate inputs before accepting."""
        url = self.url_input.text().strip()
        lic = self.license_input.text().strip()
        
        is_valid = True
        
        if not url.startswith("http://") and not url.startswith("https://"):
            self.url_error.setText("URL must start with http:// or https://")
            is_valid = False
        else:
            self.url_error.setText("")

        # TODO: call license.validate_license(lic) (currently stubbed to always true)
        
        if is_valid:
            self.accept()

    def get_data(self) -> tuple[str, str]:
        """Return the entered data."""
        return self.url_input.text().strip(), self.license_input.text().strip()
