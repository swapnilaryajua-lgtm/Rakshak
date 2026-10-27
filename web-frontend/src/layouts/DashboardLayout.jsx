import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { LayoutDashboard, FileSearch, Radar, UserCog, Menu, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Scan Reports', path: '/dashboard/reports', icon: FileSearch },
    { label: 'Quick Scan', path: '/dashboard/scan', icon: Radar },
    { label: 'Account', path: '/dashboard/account', icon: UserCog },
  ];

  const getPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: 'var(--bg-primary, #FAF8F5)',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.5)', zIndex: 40 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
      }}>
        <Sidebar variant="user" items={sidebarItems} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: 'var(--bg-card, #FFFFFF)',
          borderBottom: '1px solid var(--border-default, #E7E5E4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: 'var(--text-primary, #1C1917)', 
              margin: 0 
            }}>
              {getPageTitle()}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary, #57534E)' }}>
              Hello, {user?.name}
            </span>
            <button 
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary, #57534E)', fontSize: '14px'
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
          backgroundColor: 'var(--bg-primary, #FAF8F5)'
        }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
