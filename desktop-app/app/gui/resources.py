from __future__ import annotations

"""Design constants and stylesheet for the application."""

class Colors:
    """Color palette for the Rakshak application."""
    BG_PRIMARY = '#0f0f1a'       # very dark navy/black
    BG_SECONDARY = '#1a1a2e'     # dark navy card background
    BG_TERTIARY = '#16213e'      # slightly lighter panel
    ACCENT_PRIMARY = '#00d4aa'   # teal/cyan accent — matches Rakshak brand
    ACCENT_SECONDARY = '#7c3aed' # purple secondary accent
    ACCENT_DANGER = '#ef4444'    # red for critical
    ACCENT_WARNING = '#f59e0b'   # amber for warnings
    ACCENT_SUCCESS = '#10b981'   # green for healthy
    TEXT_PRIMARY = '#e2e8f0'     # light gray text
    TEXT_SECONDARY = '#94a3b8'   # muted gray text
    TEXT_MUTED = '#64748b'       # very muted
    BORDER = '#2d2d44'           # subtle border
    HOVER = '#252540'            # hover state

ICON_PATH = ""

APP_STYLESHEET = f"""
QMainWindow, QDialog, QWidget {{
    background-color: {Colors.BG_PRIMARY};
    color: {Colors.TEXT_PRIMARY};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
}}

QWidget#DashboardCard, QWidget#DashboardCard > QLabel {{
    background-color: {Colors.BG_SECONDARY};
    border-radius: 8px;
}}

QPushButton {{
    background-color: {Colors.ACCENT_PRIMARY};
    color: {Colors.BG_PRIMARY};
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: bold;
}}

QPushButton:hover {{
    background-color: #33e0c2;
}}

QPushButton:pressed {{
    background-color: #00b38f;
}}

QPushButton:disabled {{
    background-color: {Colors.BORDER};
    color: {Colors.TEXT_MUTED};
}}

QPushButton.secondary-button {{
    background-color: {Colors.BG_TERTIARY};
    color: {Colors.TEXT_PRIMARY};
    border: 1px solid {Colors.BORDER};
}}

QPushButton.secondary-button:hover {{
    background-color: {Colors.HOVER};
}}

QTableWidget, QTableView {{
    background-color: {Colors.BG_SECONDARY};
    alternate-background-color: {Colors.BG_PRIMARY};
    color: {Colors.TEXT_PRIMARY};
    gridline-color: {Colors.BORDER};
    border: 1px solid {Colors.BORDER};
    border-radius: 6px;
    outline: none;
}}

QHeaderView::section {{
    background-color: {Colors.BG_TERTIARY};
    color: {Colors.TEXT_SECONDARY};
    padding: 6px;
    border: none;
    border-right: 1px solid {Colors.BORDER};
    border-bottom: 1px solid {Colors.BORDER};
    font-weight: bold;
}}

QLineEdit, QSpinBox, QComboBox {{
    background-color: {Colors.BG_TERTIARY};
    color: {Colors.TEXT_PRIMARY};
    border: 1px solid {Colors.BORDER};
    border-radius: 4px;
    padding: 6px;
    selection-background-color: {Colors.ACCENT_PRIMARY};
    selection-color: {Colors.BG_PRIMARY};
}}

QLineEdit:focus, QSpinBox:focus, QComboBox:focus {{
    border: 1px solid {Colors.ACCENT_PRIMARY};
}}

QLabel {{
    background-color: transparent;
}}

QCheckBox {{
    spacing: 8px;
}}

QCheckBox::indicator {{
    width: 18px;
    height: 18px;
    border: 1px solid {Colors.BORDER};
    border-radius: 4px;
    background-color: {Colors.BG_TERTIARY};
}}

QCheckBox::indicator:checked {{
    background-color: {Colors.ACCENT_PRIMARY};
    border: 1px solid {Colors.ACCENT_PRIMARY};
}}

QGroupBox {{
    border: 1px solid {Colors.BORDER};
    border-radius: 6px;
    margin-top: 1.5ex;
    font-weight: bold;
    color: {Colors.TEXT_SECONDARY};
}}

QGroupBox::title {{
    subcontrol-origin: margin;
    subcontrol-position: top left;
    left: 10px;
    padding: 0 5px;
}}

QScrollBar:vertical {{
    border: none;
    background-color: {Colors.BG_PRIMARY};
    width: 12px;
    margin: 0px 0px 0px 0px;
}}

QScrollBar::handle:vertical {{
    background-color: {Colors.BORDER};
    min-height: 20px;
    border-radius: 6px;
}}

QScrollBar::handle:vertical:hover {{
    background-color: {Colors.TEXT_MUTED};
}}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
    border: none;
    background: none;
}}

QScrollBar:horizontal {{
    border: none;
    background-color: {Colors.BG_PRIMARY};
    height: 12px;
    margin: 0px 0px 0px 0px;
}}

QScrollBar::handle:horizontal {{
    background-color: {Colors.BORDER};
    min-width: 20px;
    border-radius: 6px;
}}

QScrollBar::handle:horizontal:hover {{
    background-color: {Colors.TEXT_MUTED};
}}

QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {{
    border: none;
    background: none;
}}

QToolTip {{
    background-color: {Colors.BG_TERTIARY};
    color: {Colors.TEXT_PRIMARY};
    border: 1px solid {Colors.BORDER};
    padding: 4px;
    border-radius: 4px;
}}

#Sidebar {{
    background-color: {Colors.BG_SECONDARY};
    border-right: 1px solid {Colors.BORDER};
}}

#Sidebar QPushButton {{
    background-color: transparent;
    color: {Colors.TEXT_SECONDARY};
    text-align: left;
    padding-left: 20px;
    border-radius: 0;
}}

#Sidebar QPushButton:hover {{
    background-color: {Colors.HOVER};
    color: {Colors.TEXT_PRIMARY};
}}

#Sidebar QPushButton:checked {{
    background-color: {Colors.BG_TERTIARY};
    color: {Colors.ACCENT_PRIMARY};
    border-left: 3px solid {Colors.ACCENT_PRIMARY};
}}

#TopBar {{
    background-color: {Colors.BG_SECONDARY};
    border-bottom: 1px solid {Colors.BORDER};
}}

#AppTitle {{
    font-size: 16px;
    font-weight: bold;
    color: {Colors.TEXT_PRIMARY};
}}
"""
