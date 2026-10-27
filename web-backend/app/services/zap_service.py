import httpx
import asyncio
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.models import ScanReport
from app.services.report_service import format_zap_report

from app.db.database import SessionLocal

# Note: Concurrent scans against the same ZAP daemon instance may need queuing/locking 
# in a future iteration. This is a known limitation for now.

async def run_zap_scan(scan_report_id: str, url: str):
    """
    Runs the ZAP spider and active scan, then pulls the results.
    Updates the ScanReport in the database.
    """
    db = SessionLocal()
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # 1. Start Spider
            spider_res = await client.get(
                f"{settings.ZAP_API_URL}/JSON/spider/action/scan/",
                params={"url": url, "apikey": settings.ZAP_API_KEY}
            )
            spider_res.raise_for_status()
            scan_id = spider_res.json().get("scan")
            
            # Poll spider status
            while True:
                status_res = await client.get(
                    f"{settings.ZAP_API_URL}/JSON/spider/view/status/",
                    params={"scanId": scan_id, "apikey": settings.ZAP_API_KEY}
                )
                if int(status_res.json().get("status", 0)) >= 100:
                    break
                await asyncio.sleep(2)
                
            # Update DB status to running
            scan_report = db.query(ScanReport).filter(ScanReport.id == scan_report_id).first()
            if scan_report:
                scan_report.status = "running"
                db.commit()
            
            # 2. Run Active Scan
            ascan_res = await client.get(
                f"{settings.ZAP_API_URL}/JSON/ascan/action/scan/",
                params={"url": url, "apikey": settings.ZAP_API_KEY}
            )
            ascan_res.raise_for_status()
            ascan_id = ascan_res.json().get("scan")
            
            # Poll ascan status (Timeout after 60 seconds for a "light" scan)
            for _ in range(30):
                status_res = await client.get(
                    f"{settings.ZAP_API_URL}/JSON/ascan/view/status/",
                    params={"scanId": ascan_id, "apikey": settings.ZAP_API_KEY}
                )
                if int(status_res.json().get("status", 0)) >= 100:
                    break
                await asyncio.sleep(2)
            
            # Stop the scan if it hasn't finished (forces it to be a light/restricted scan)
            await client.get(
                f"{settings.ZAP_API_URL}/JSON/ascan/action/stop/",
                params={"scanId": ascan_id, "apikey": settings.ZAP_API_KEY}
            )
            
            # Give scanner a brief moment to finish processing results
            await asyncio.sleep(5)
            
            # 3. Get Alerts
            alerts_res = await client.get(
                f"{settings.ZAP_API_URL}/JSON/core/view/alerts/",
                params={"apikey": settings.ZAP_API_KEY}
            )
            alerts_res.raise_for_status()
            raw_alerts = alerts_res.json().get("alerts", [])
            
            # Format Report
            report_data = format_zap_report(raw_alerts)
            
            scan_report = db.query(ScanReport).filter(ScanReport.id == scan_report_id).first()
            if scan_report:
                scan_report.status = "completed"
                scan_report.severity_summary = report_data["summary"]
                scan_report.findings = report_data["vulnerabilities"]
                db.commit()
    except Exception as e:
        print(f"ZAP Scan failed for {scan_report_id}: {str(e)}")
        scan_report = db.query(ScanReport).filter(ScanReport.id == scan_report_id).first()
        if scan_report:
            scan_report.status = "failed"
            db.commit()
    finally:
        db.close()
