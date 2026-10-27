from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db.database import get_db
from app.db.models import User, ScanReport
from app.schemas.scans import ScanSubmitRequest, ScanReportResponse
from app.core.dependencies import get_current_user
from app.services.zap_service import run_zap_scan
import uuid

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("", response_model=ScanReportResponse)
@limiter.limit("5/hour")
def submit_scan(
    request: Request,
    scan_in: ScanSubmitRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check for active/pending scans
    active_scans = db.query(ScanReport).filter(
        ScanReport.user_id == current_user.id,
        ScanReport.status.in_(["pending", "running"])
    ).count()
    
    if active_scans >= 1:
        raise HTTPException(status_code=429, detail="You already have an active scan running. Please wait for it to complete.")
        
    scan_report = ScanReport(
        user_id=current_user.id,
        url=str(scan_in.url),
        status="pending"
    )
    db.add(scan_report)
    db.commit()
    db.refresh(scan_report)
    
    # Trigger background ZAP scan
    background_tasks.add_task(run_zap_scan, scan_report.id, str(scan_in.url))
    
    return {
        "id": scan_report.id,
        "url": scan_report.url,
        "timestamp": scan_report.created_at.isoformat(),
        "status": scan_report.status
    }

@router.get("", response_model=list[ScanReportResponse])
def get_scan_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scans = db.query(ScanReport).filter(ScanReport.user_id == current_user.id).order_by(ScanReport.created_at.desc()).all()
    
    # Format according to ScanReportResponse which isn't strictly defined but expected by the frontend
    # Let's return basic details
    result = []
    for scan in scans:
        result.append({
            "id": scan.id,
            "url": scan.url,
            "timestamp": scan.created_at.isoformat(),
            "date": scan.created_at.isoformat(), # frontend uses date
            "duration": scan.duration,
            "status": scan.status,
            "summary": scan.severity_summary,
            "vulnerabilities": scan.findings,
            "totalVulnerabilities": len(scan.findings) if scan.findings else 0
        })
    return result

@router.get("/{scan_id}/status")
def get_scan_status(scan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan_report = db.query(ScanReport).filter(ScanReport.id == scan_id, ScanReport.user_id == current_user.id).first()
    if not scan_report:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    return {"id": scan_report.id, "status": scan_report.status}

@router.get("/{scan_id}", response_model=ScanReportResponse)
def get_scan_report(scan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan_report = db.query(ScanReport).filter(ScanReport.id == scan_id, ScanReport.user_id == current_user.id).first()
    if not scan_report:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    return {
        "id": scan_report.id,
        "url": scan_report.url,
        "timestamp": scan_report.created_at.isoformat(),
        "date": scan_report.created_at.isoformat(),
        "duration": scan_report.duration,
        "status": scan_report.status,
        "summary": scan_report.severity_summary,
        "vulnerabilities": scan_report.findings,
        "totalVulnerabilities": len(scan_report.findings) if scan_report.findings else 0
    }
