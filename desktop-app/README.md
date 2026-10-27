# Rakshak Desktop Monitor

Real-time website monitoring desktop application. Part of the Rakshak cybersecurity platform (Feature 2).

## Description

Rakshak Desktop Monitor is a privacy-first, locally-running application designed to monitor the health and security posture of websites. It provides real-time insights without sending any of your data to external servers.

## Features

*   **Periodic Health Checks**: Monitor uptime and response times for specified websites.
*   **SSL Monitoring**: Track certificate validity and expiration dates.
*   **Security Header Auditing**: Analyze HTTP response headers for security best practices.
*   **Native Notifications**: Receive instant desktop alerts for critical events and status changes.
*   **Local-Only Storage**: All data, settings, and logs are stored locally using SQLite.

## Prerequisites

*   Python 3.10+

## Installation

Install the required dependencies using `pip`:

```bash
pip install -r requirements.txt
```

## Usage

Launch the application by running the main script:

```bash
python main.py
```

## Configuration

*   **Check Interval**: Configure how often the application checks website status (default is usually 5 minutes).
*   **Notifications**: Enable or disable native desktop notifications for alerts.
*   **System Tray**: The app can run in the background accessible via the system tray.

## Privacy

**All data stays local. There is no telemetry, no cloud sync, and no external tracking.** Your monitoring targets and results are securely stored on your own machine.

## Architecture

The application is structured into the following modules:
*   `core`: Core logic, configuration, and local SQLite database management.
*   `monitors`: Implementations for various checks (health, SSL, security headers) and the background scheduler.
*   `notifier`: Native desktop notification integration.
*   `gui`: PySide6 based graphical user interface.
*   `reporter`: Generation of monitoring reports and exports.

## License

[Placeholder for License]

---
*Note: This application represents Feature 2 of the Rakshak platform. It does not include packet sniffing, firewall blocking, or IP tracing.*
