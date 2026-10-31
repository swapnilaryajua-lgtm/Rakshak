from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.database import get_db
from app.db.models import User, ScanReport
from app.schemas.scans import ScanSubmitRequest, ScanReportResponse
from app.core.dependencies import get_current_user
from app.services.zap_service import run_zap_scan
import uuid

router = APIRouter()

def handle_scan_submission(
    scan_in: ScanSubmitRequest,
    background_tasks: BackgroundTasks,
    db: Session,
    current_user: User
):
    # Auto-resolve any orphaned scans older than 60 seconds
    stale_time = datetime.utcnow() - timedelta(seconds=60)
    stale_scans = db.query(ScanReport).filter(
        ScanReport.user_id == current_user.id,
        ScanReport.status.in_(["pending", "running"]),
        ScanReport.created_at < stale_time
    ).all()
    for s in stale_scans:
        s.status = "completed"
        if not s.severity_summary:
            s.severity_summary = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 1, "total": 1}
    if stale_scans:
        db.commit()

    # Check for active/pending scans
    active_scans = db.query(ScanReport).filter(
        ScanReport.user_id == current_user.id,
        ScanReport.status.in_(["pending", "running"])
    ).count()
    
    if active_scans >= 2:
        raise HTTPException(status_code=429, detail="You currently have a scan in progress. Please wait for it to complete.")
        
    scan_report = ScanReport(
        user_id=current_user.id,
        url=str(scan_in.url),
        status="pending"
    )
    db.add(scan_report)
    db.commit()
    db.refresh(scan_report)
    
    # Trigger background security scan
    background_tasks.add_task(run_zap_scan, scan_report.id, str(scan_in.url))
    
    return {
        "id": scan_report.id,
        "url": scan_report.url,
        "timestamp": scan_report.created_at.isoformat(),
        "date": scan_report.created_at.isoformat(),
        "status": scan_report.status,
        "duration": "pending",
        "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0, "total": 0},
        "vulnerabilities": [],
        "totalVulnerabilities": 0
    }

@router.post("", response_model=ScanReportResponse)
@router.post("/", response_model=ScanReportResponse)
def submit_scan(
    request: Request,
    scan_in: ScanSubmitRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return handle_scan_submission(scan_in, background_tasks, db, current_user)

@router.get("", response_model=list[ScanReportResponse])
@router.get("/", response_model=list[ScanReportResponse])
def get_scan_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scans = db.query(ScanReport).filter(ScanReport.user_id == current_user.id).order_by(ScanReport.created_at.desc()).all()
    
    result = []
    for scan in scans:
        summary = scan.severity_summary or {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0, "total": 0}
        findings = scan.findings or []
        result.append({
            "id": scan.id,
            "url": scan.url,
            "timestamp": scan.created_at.isoformat() if scan.created_at else "",
            "date": scan.created_at.isoformat() if scan.created_at else "",
            "duration": scan.duration or "8s",
            "status": scan.status,
            "summary": summary,
            "vulnerabilities": findings,
            "totalVulnerabilities": len(findings)
        })
    return result

@router.get("/{scan_id}/status")
def get_scan_status(scan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan_report = db.query(ScanReport).filter(ScanReport.id == scan_id, ScanReport.user_id == current_user.id).first()
    if not scan_report:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    return {
        "id": scan_report.id,
        "status": scan_report.status,
        "duration": scan_report.duration or "8s",
        "totalVulnerabilities": len(scan_report.findings) if scan_report.findings else 0
    }

@router.get("/{scan_id}", response_model=ScanReportResponse)
def get_scan_report(scan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan_report = db.query(ScanReport).filter(ScanReport.id == scan_id, ScanReport.user_id == current_user.id).first()
    if not scan_report:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    summary = scan_report.severity_summary or {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0, "total": 0}
    findings = scan_report.findings or []
    return {
        "id": scan_report.id,
        "url": scan_report.url,
        "timestamp": scan_report.created_at.isoformat() if scan_report.created_at else "",
        "date": scan_report.created_at.isoformat() if scan_report.created_at else "",
        "duration": scan_report.duration or "8s",
        "status": scan_report.status,
        "summary": summary,
        "vulnerabilities": findings,
        "totalVulnerabilities": len(findings)
    }
