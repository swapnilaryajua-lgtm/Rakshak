import { authFetch } from './apiClient.js';

/* ════════════════════════════════════════════
   VULNERABILITY SCANNING
   ════════════════════════════════════════════ */

export async function scanWebsite(url) {
  return await authFetch('/api/v1/scans/', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

/* ════════════════════════════════════════════
   SCAN HISTORY
   ════════════════════════════════════════════ */

export async function getScanHistory() {
  return await authFetch('/api/v1/scans/');
}

export async function getScanReport(scanId) {
  return await authFetch(`/api/v1/scans/${scanId}`);
}

export async function pollScanStatus(scanId) {
  return await authFetch(`/api/v1/scans/${scanId}/status`);
}

/* ════════════════════════════════════════════
   USER / ACCOUNT
   ════════════════════════════════════════════ */

export async function getUserProfile() {
  return await authFetch('/api/v1/users/me');
}

export async function getSubscriptionStatus() {
  return await authFetch('/api/v1/users/me/subscription');
}

/* ════════════════════════════════════════════
   ADMIN
   ════════════════════════════════════════════ */

export async function getAdminUsers() {
  return await authFetch('/api/v1/admin/users');
}

export async function getAdminDashboardStats() {
  return await authFetch('/api/v1/admin/stats');
}

/* ════════════════════════════════════════════
   PAYMENTS (Razorpay mock)
   ════════════════════════════════════════════ */

export async function createCheckoutSession(planId) {
  return await authFetch('/api/v1/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan_id: planId }),
  });
}

