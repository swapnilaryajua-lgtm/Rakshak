import requests
import time
import json
import random

base_url = 'http://localhost:8000/api/v1'
email = f'test_{random.randint(1000,9999)}@example.com'
password = 'TestPassword123!'

print('1. Registering')
resp = requests.post(f'{base_url}/auth/register', json={
    'email': email,
    'password': password,
    'name': 'Test User',
    'aadhaar_verified': True
})
print(resp.status_code, resp.text)

print('2. Logging in')
resp = requests.post(f'{base_url}/auth/login', data={
    'username': email,
    'password': password
})
print(resp.status_code, resp.text)
token = resp.json().get('access_token')

print('3. Submitting Scan')
headers = {'Authorization': f'Bearer {token}'}
resp = requests.post(f'{base_url}/scans/', headers=headers, json={
    'url': 'http://example.com/'
})
print(resp.status_code, resp.text)
scan_id = resp.json().get('id')

print('4. Polling')
for i in range(30):
    time.sleep(2)
    resp = requests.get(f'{base_url}/scans/{scan_id}/status', headers=headers)
    print(resp.status_code, resp.text)
    status = resp.json().get('status')
    if status in ['completed', 'failed']:
        break

print('5. Report')
resp = requests.get(f'{base_url}/scans/{scan_id}', headers=headers)
print(resp.status_code)
print(json.dumps(resp.json(), indent=2)[:1500])
