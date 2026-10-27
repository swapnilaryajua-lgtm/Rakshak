from __future__ import annotations

from PySide6.QtWidgets import QSystemTrayIcon, QMenu, QMainWindow
from PySide6.QtGui import QIcon, QPixmap, QColor, QPainter
from PySide6.QtCore import Signal, QObject, Qt

from app.gui.resources import Colors

class TrayIconSignals(QObject):
    show_requested = Signal()
    check_now_requested = Signal()
    settings_requested = Signal()
    quit_requested = Signal()

class TrayIcon(QSystemTrayIcon):
    """System tray icon for the Rakshak app."""

    def __init__(self, parent: QMainWindow):
        super().__init__(parent)
        self.parent_window = parent
        
        self.signals = TrayIconSignals()

        # Create a simple colored circle icon programmatically
        pixmap = QPixmap(32, 32)
        pixmap.fill(Qt.GlobalColor.transparent)
        painter = QPainter(pixmap)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        painter.setBrush(QColor(Colors.ACCENT_PRIMARY))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawEllipse(2, 2, 28, 28)
        painter.end()
        self.setIcon(QIcon(pixmap))

        self.setToolTip("Rakshak - Website Monitor")
        
        # Setup context menu
        self.menu = QMenu()
        
        show_action = self.menu.addAction("Show Rakshak")
        show_action.triggered.connect(self.signals.show_requested.emit)
        
        check_action = self.menu.addAction("Check Now")
        check_action.triggered.connect(self.signals.check_now_requested.emit)
        
        settings_action = self.menu.addAction("Settings")
        settings_action.triggered.connect(self.signals.settings_requested.emit)
        
        self.menu.addSeparator()
        
        quit_action = self.menu.addAction("Quit")
        quit_action.triggered.connect(self.signals.quit_requested.emit)
        
        self.setContextMenu(self.menu)
        
        self.activated.connect(self._on_activated)

    def _on_activated(self, reason: QSystemTrayIcon.ActivationReason):
        """Handle tray icon clicks."""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            self.signals.show_requested.emit()

    def update_tooltip(self, message: str):
        """Update the tooltip text for the tray icon."""
        self.setToolTip(message)

    def show_status_notification(self, title: str, message: str):
        """Show a balloon/tray notification."""
        self.showMessage(title, message, QSystemTrayIcon.MessageIcon.Information, 5000)
