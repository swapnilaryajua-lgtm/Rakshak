import pytest

def test_submit_scan_unauthorized(client):
    response = client.post(
        "/api/v1/scans",
        json={"url": "https://example.com"}
    )
    assert response.status_code == 401

def test_submit_scan_authorized(client):
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "scanuser@example.com",
            "name": "Scan User",
            "password": "password123",
            "aadhaar_verified": False
        }
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "scanuser@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Submit scan
    scan_response = client.post(
        "/api/v1/scans",
        json={"url": "https://example.com"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert scan_response.status_code == 200
    assert "id" in scan_response.json()
    assert scan_response.json()["status"] == "pending"
    
    scan_id = scan_response.json()["id"]
    
    # Poll status
    status_response = client.get(
        f"/api/v1/scans/{scan_id}/status",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert status_response.status_code == 200
    assert status_response.json()["status"] in ["pending", "running", "completed", "failed"]
