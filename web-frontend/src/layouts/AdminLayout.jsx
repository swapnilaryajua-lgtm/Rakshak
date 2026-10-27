import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { BarChart3, Users, Activity, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarItems = [
    { label: 'Overview', path: '/admin', icon: BarChart3 },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'System Health', path: '/admin/health', icon: Activity },
  ];

  const getPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Admin Portal';
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: 'var(--bg-admin, #1C1917)',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 40 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper */}
      <div style={{ position: 'relative', zIndex: 50, display: 'flex' }}>
        <Sidebar variant="admin" items={sidebarItems} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: 'var(--bg-admin, #1C1917)',
          borderBottom: '1px solid var(--border-admin, #44403C)',
          color: 'var(--text-admin, #FAFAF9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              fontSize: '16px', 
              fontWeight: '500', 
              margin: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: 'var(--accent, #0D9488)', 
                color: '#FFFFFF',
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Admin Portal
              </span>
              {getPageTitle()}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted, #A8A29E)' }}>
              {user?.name}
            </span>
            <button 
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted, #A8A29E)', fontSize: '14px'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          backgroundColor: 'var(--bg-admin-card, #292524)',
          color: 'var(--text-admin, #FAFAF9)'
        }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
