import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { BarChart3, Users, Activity, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarItems = [
    { label: 'Overview', path: '/admin', icon: BarChart3 },
    { label: 'Users', path: '/admin/users', icon: Users },
  ];

  const getPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Admin Portal';
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100%',
      overflow: 'hidden', 
      backgroundColor: 'var(--bg-admin, #1C1917)',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      {/* Desktop Sidebar (hidden on mobile and tablet < 1024px) */}
      <div className="hidden lg:flex" style={{ position: 'relative', zIndex: 30 }}>
        <Sidebar variant="admin" items={sidebarItems} />
      </div>

      {/* Mobile / Tablet Drawer Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 60, backdropFilter: 'blur(3px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '280px',
                maxWidth: '80vw',
                backgroundColor: 'var(--bg-admin, #1C1917)',
                zIndex: 70,
                boxShadow: '8px 0 32px rgba(0,0,0,0.6)',
                borderRight: '1px solid var(--border-admin, #44403C)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-admin, #44403C)'
              }}>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent, #0D9488)',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Admin Portal
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted, #A8A29E)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                <Sidebar variant="admin" items={sidebarItems} />
              </div>

              <div style={{ padding: '16px', borderTop: '1px solid var(--border-admin, #44403C)' }}>
                <Link
                  to="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted, #A8A29E)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255,255,255,0.04)'
                  }}
                >
                  <ArrowLeft size={16} /> Return to Main Site
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main View Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        {/* Top bar */}
        <header style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'var(--bg-admin, #1C1917)',
          borderBottom: '1px solid var(--border-admin, #44403C)',
          color: 'var(--text-admin, #FAFAF9)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex lg:hidden"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-admin, #FAFAF9)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                minWidth: '40px',
                minHeight: '40px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle Admin Menu"
            >
              <Menu size={22} />
            </button>

            <h1 style={{ 
              fontSize: '15px', 
              fontWeight: '600', 
              margin: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ 
                padding: '3px 8px', 
                backgroundColor: 'var(--accent, #0D9488)', 
                color: '#FFFFFF',
                borderRadius: '4px', 
                fontSize: '11px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Admin
              </span>
              <span className="hidden sm:inline">{getPageTitle()}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/"
              className="hidden md:flex"
              style={{
                color: 'var(--text-muted, #A8A29E)',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-admin, #44403C)'
              }}
            >
              Back to App
            </Link>
            <span style={{ 
              fontSize: '13px', 
              color: 'var(--text-muted, #A8A29E)',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.name || user?.email}
            </span>
            <button 
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#F43F5E', fontSize: '13px', fontWeight: 500,
                padding: '8px 10px', minHeight: '36px'
              }}
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main scrollable content container */}
        <main 
          className="touch-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(16px, 3vw, 32px)',
            backgroundColor: 'var(--bg-admin-card, #292524)',
            color: 'var(--text-admin, #FAFAF9)',
            boxSizing: 'border-box'
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
