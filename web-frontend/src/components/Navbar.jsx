import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 1024;
      setIsMobileOrTablet(isSmall);
      if (!isSmall) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Scanner', path: '/scan' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Download', path: '/download' },
  ];

  const dashboardLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scan Reports', path: '/dashboard/reports' },
    { name: 'Account', path: '/dashboard/account' },
  ];

  const adminLinks = isAdmin ? [{ name: 'Admin Portal', path: '/admin' }] : [];
  const links = user ? [...publicLinks, ...dashboardLinks, ...adminLinks] : publicLinks;

  const getLinkStyle = (path, isMobileDrawer = false) => {
    const isActive = location.pathname === path;
    if (isMobileDrawer) {
      return {
        textDecoration: 'none',
        color: isActive ? 'var(--accent, #0D9488)' : '#E7E5E4',
        fontWeight: isActive ? 600 : 500,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '14px 16px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent, #0D9488)' : '3px solid transparent',
        transition: 'all 0.2s ease',
        minHeight: '48px',
        boxSizing: 'border-box',
      };
    }

    return {
      textDecoration: 'none',
      color: isActive ? 'var(--accent, #0D9488)' : 'white',
      fontWeight: 500,
      fontSize: '15px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      minHeight: '44px',
      boxSizing: 'border-box',
    };
  };

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          height: isMobileOrTablet ? '72px' : '100vh',
          width: isMobileOrTablet ? '100%' : '250px',
          zIndex: 40,
          backgroundColor: '#1e1e1e',
          borderBottom: isMobileOrTablet ? '1px solid #282828' : 'none',
          borderRight: isMobileOrTablet ? 'none' : '1px solid #282828',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            padding: isMobileOrTablet ? '0 16px' : '32px 16px',
            display: 'flex',
            flexDirection: isMobileOrTablet ? 'row' : 'column',
            justifyContent: isMobileOrTablet ? 'space-between' : 'flex-start',
            alignItems: isMobileOrTablet ? 'center' : 'flex-start',
            height: '100%',
            gap: isMobileOrTablet ? '0' : '48px',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              marginLeft: isMobileOrTablet ? '0' : '16px',
            }}
          >
            <img
              src="/logo.png"
              alt="Rakshak"
              style={{
                height: isMobileOrTablet ? '42px' : '50px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          {!isMobileOrTablet && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <motion.div
                      style={getLinkStyle(link.path)}
                      whileHover={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: 'white',
                        x: 4,
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          style={{
                            position: 'absolute',
                            left: '0px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '60%',
                            borderRadius: '0 4px 4px 0',
                            backgroundColor: 'var(--accent, #0D9488)',
                            boxShadow: '0 0 8px var(--accent, #0D9488)',
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Bottom Actions */}
          {!isMobileOrTablet && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                marginTop: 'auto',
                paddingBottom: '24px',
                padding: '0 8px',
                boxSizing: 'border-box',
              }}
            >
              {user ? (
                <>
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      width: '100%',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      color: '#A8A29E',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.name || user.email}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    fullWidth
                    style={{
                      color: 'white',
                      backgroundColor: 'transparent',
                      borderRadius: '50px',
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ width: '100%', textDecoration: 'none' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      style={{
                        color: 'white',
                        backgroundColor: 'transparent',
                        borderRadius: '50px',
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" style={{ width: '100%', textDecoration: 'none' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      style={{ borderRadius: '50px' }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile & Tablet Top Right Controls */}
          {isMobileOrTablet && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(13,148,136,0.2)',
                        color: 'var(--accent, #0D9488)',
                        textDecoration: 'none',
                        border: '1px solid rgba(13,148,136,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard/account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#FAFAF9',
                      fontSize: '13px',
                      textDecoration: 'none',
                      padding: '6px 10px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <UserIcon size={14} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>
                </div>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      backgroundColor: 'transparent',
                      border: '1px solid #44403C',
                      color: '#FAFAF9',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      minHeight: '36px',
                    }}
                  >
                    Login
                  </button>
                </Link>
              )}

              {/* Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FAFAF9',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  minWidth: '44px',
                  minHeight: '44px',
                  touchAction: 'manipulation',
                }}
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile & Tablet Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileOrTablet && mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 60,
                touchAction: 'none',
              }}
            />

            {/* Sliding Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                backgroundColor: '#18181B',
                color: '#FAFAF9',
                zIndex: 70,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid #27272A',
                boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.6)',
                padding: '20px 20px 28px 20px',
                boxSizing: 'border-box',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #27272A',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src="/logo.png"
                    alt="Rakshak"
                    style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>
                    RAKSHAK
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Navigation Menu"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#A1A1AA',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '44px',
                    minHeight: '44px',
                    borderRadius: '6px',
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Links List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  flex: 1,
                  overflowY: 'auto',
                }}
              >
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{ textDecoration: 'none' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div style={getLinkStyle(link.path, true)}>
                      <span>{link.name}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Drawer Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: 'auto',
                  paddingTop: '20px',
                  borderTop: '1px solid #27272A',
                }}
              >
                {user ? (
                  <>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#A1A1AA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#27272A',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.name || user.email}
                      </span>
                      {isAdmin && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(13,148,136,0.3)',
                            color: '#2DD4BF',
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      fullWidth
                      style={{
                        color: '#F43F5E',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        borderRadius: '8px',
                        minHeight: '44px',
                      }}
                    >
                      <LogOut size={16} style={{ marginRight: '8px' }} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="secondary"
                        fullWidth
                        style={{ minHeight: '44px', borderRadius: '8px' }}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="primary"
                        fullWidth
                        style={{ minHeight: '44px', borderRadius: '8px' }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
