import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import { RequireAuth, RequireAdmin } from './routes/guards.jsx';

/* ── Public Pages ── */
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Scan from './pages/public/Scan.jsx';
import Pricing from './pages/public/Pricing.jsx';
import Download from './pages/public/Download.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';

/* ── User Protection & Audit Pages ── */
import History from './pages/dashboard/History.jsx';
import Account from './pages/dashboard/Account.jsx';

/* ── Admin Pages ── */
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminActivity from './pages/admin/AdminActivity.jsx';

export default function App() {
  return (
    <Routes>
      {/* ═══ Public Routes ═══ */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/download" element={<Download />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ═══ Authenticated User Pages (Auth Required) ═══ */}
        <Route element={<RequireAuth><Outlet /></RequireAuth>}>
          <Route path="/history" element={<History />} />
          <Route path="/account" element={<Account />} />
          {/* Legacy & Dashboard Redirects to History */}
          <Route path="/dashboard" element={<Navigate to="/history" replace />} />
          <Route path="/dashboard/reports" element={<Navigate to="/history" replace />} />
          <Route path="/dashboard/scan" element={<Navigate to="/scan" replace />} />
          <Route path="/dashboard/account" element={<Navigate to="/account" replace />} />
        </Route>
      </Route>

      {/* ═══ Admin Routes (Admin Role Required) ═══ */}
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/activity" element={<AdminActivity />} />
      </Route>

      {/* ═══ Fallback ═══ */}
      <Route path="*" element={
        <PublicLayout>
          <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
          }}>
            <h1 style={{ fontSize: '72px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>404</h1>
            <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', marginTop: '12px' }}>Page not found</p>
            <a href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none', marginTop: '24px', fontWeight: 600 }}>
              ← Back to Home
            </a>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}
