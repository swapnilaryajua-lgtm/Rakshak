import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Changed from #121212 to a slightly lighter grey #1e1e1e
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    isMobile ? ['var(--bg-primary)', 'var(--bg-card)'] : ['#1e1e1e', '#1e1e1e']
  );
  
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    isMobile ? ['1px solid transparent', '1px solid var(--border-default)'] : ['1px solid #282828', '1px solid #282828']
  );

  const containerStyle = {
    width: '100%',
    padding: isMobile ? '0 24px' : '32px 16px',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    alignItems: isMobile ? 'center' : 'flex-start',
    height: '100%',
    gap: isMobile ? '0' : '48px'
  };

  const desktopLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    width: '100%'
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      textDecoration: 'none',
      color: isActive ? 'var(--accent)' : 'white',
      fontWeight: 500,
      fontSize: '15px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer'
    };
  };

  const rightActionsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 'auto',
    paddingBottom: '32px',
    padding: '0 16px'
  };

  const mobileMenuBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    padding: '4px'
  };

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Scanner', path: '/scan' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Download', path: '/download' }
  ];

  const dashboardLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scan Reports', path: '/dashboard/reports' },
    { name: 'Account', path: '/dashboard/account' }
  ];

  const adminLinks = isAdmin ? [{ name: 'Admin Portal', path: '/admin' }] : [];
  const links = user ? [...publicLinks, ...dashboardLinks, ...adminLinks] : publicLinks;

  return (
    <motion.nav 
      style={{
        position: 'sticky',
        top: 0,
        height: isMobile ? '72px' : '100vh',
        width: isMobile ? '100%' : '250px',
        zIndex: 50,
        backgroundColor: navBackground,
        borderBottom: isMobile ? navBorder : 'none',
        borderRight: isMobile ? 'none' : navBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      <div style={containerStyle}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginLeft: isMobile ? '-8px' : '16px' }}>
          <img src="/logo.png" alt="Rakshak" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        
        {!isMobile && (
          <div style={desktopLinksStyle}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} style={{ textDecoration: 'none', width: '100%' }}>
                  <motion.div
                    style={getLinkStyle(link.path)}
                    whileHover={{ 
                      backgroundColor: 'rgba(255,255,255,0.08)', 
                      color: 'white',
                      textShadow: '0px 0px 10px rgba(255, 255, 255, 0.8)',
                      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
                      x: 4
                    }}
                    transition={{ duration: 0.2 }}
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
                          backgroundColor: 'var(--accent)',
                          boxShadow: '0 0 8px var(--accent)'
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        {!isMobile && (
          <div style={rightActionsStyle}>
            {user ? (
              <>
                <motion.div 
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)',
                    textShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)'
                  }} 
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  style={{ width: '100%', borderRadius: '50px' }}
                >
                  <Button variant="ghost" size="sm" onClick={logout} fullWidth style={{ color: 'white', backgroundColor: 'transparent', borderRadius: '50px' }}>Logout</Button>
                </motion.div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ width: '100%', textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)',
                      textShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    style={{ borderRadius: '50px' }}
                  >
                    <Button variant="ghost" size="sm" fullWidth style={{ color: 'white', backgroundColor: 'transparent', borderRadius: '50px' }}>Login</Button>
                  </motion.div>
                </Link>
                <Link to="/register" style={{ width: '100%', textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: '0px 4px 12px rgba(0, 255, 128, 0.2)' 
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    style={{ borderRadius: '50px' }}
                  >
                    <Button variant="primary" size="sm" fullWidth style={{ borderRadius: '50px' }}>Sign Up</Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        )}

        {isMobile && (
          <button style={mobileMenuBtnStyle} onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        )}

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
              backgroundColor: 'var(--bg-card)', zIndex: 100, padding: '24px',
              borderLeft: '1px solid var(--border-default)',
              boxShadow: '-4px 0 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={mobileMenuBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map((link) => (
                <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                  <div style={{...getLinkStyle(link.path), fontSize: '18px'}}>
                    {link.name}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              {user ? (
                <motion.div 
                  style={{ width: '100%', borderRadius: '50px' }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)',
                    textShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)'
                  }} 
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Button variant="ghost" size="md" onClick={() => { logout(); setMobileMenuOpen(false); }} fullWidth style={{ color: 'white', backgroundColor: 'transparent', borderRadius: '50px' }}>Logout</Button>
                </motion.div>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" fullWidth>Login</Button>
                  </Link>
                  <Link to="/register" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
