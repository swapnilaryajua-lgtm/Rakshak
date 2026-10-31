import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ items = [], variant = 'user' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth() || {};

  const isUser = variant === 'user';
  
  const containerStyle = {
    width: collapsed ? '68px' : '260px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    backgroundColor: isUser ? 'var(--bg-card, #FFFFFF)' : '#0D111A',
    borderRight: `1px solid ${isUser ? 'var(--border-default, #E5E4E2)' : 'var(--border-admin, #1E2738)'}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box',
    zIndex: 20
  };

  const toggleBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-end',
    padding: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isUser ? 'var(--text-secondary)' : '#94A3B8'
  };

  const navListStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 10px',
    gap: '6px',
    listStyle: 'none',
    margin: 0,
    overflowY: 'auto'
  };

  const getItemStyle = (isActive, isHovered) => {
    let bg = 'transparent';
    let color = isUser ? 'var(--text-secondary)' : '#94A3B8';
    let shadow = 'none';

    if (isActive) {
      if (isUser) {
        bg = 'var(--accent-light)';
        color = 'var(--accent)';
      } else {
        bg = 'var(--accent, #0D9488)';
        color = '#FFFFFF';
        shadow = '0 0 16px rgba(13, 148, 136, 0.35)';
      }
    } else if (isHovered) {
      if (isUser) {
        bg = 'var(--bg-secondary)';
        color = 'var(--text-primary)';
      } else {
        bg = 'rgba(255, 255, 255, 0.05)';
        color = '#F8FAFC';
      }
    }

    return {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      height: '46px',
      borderRadius: '10px',
      textDecoration: 'none',
      color,
      backgroundColor: bg,
      boxShadow: shadow,
      transition: 'all 150ms ease',
      cursor: 'pointer',
      justifyContent: collapsed ? 'center' : 'flex-start',
      fontWeight: isActive ? 600 : 500,
      fontSize: '14px'
    };
  };

  const Item = ({ item }) => {
    const isActive = location.pathname === item.path;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Link 
        to={item.path} 
        style={getItemStyle(isActive, isHovered)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={collapsed ? item.label : ''}
      >
        <item.icon size={19} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}>{item.label}</span>}
      </Link>
    );
  };

  const bottomStyle = {
    padding: '16px',
    borderTop: `1px solid ${isUser ? 'var(--border-default, #E5E4E2)' : 'var(--border-admin, #1E2738)'}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: isUser ? 'var(--accent)' : 'rgba(13, 148, 136, 0.2)',
    border: isUser ? 'none' : '1px solid rgba(13, 148, 136, 0.4)',
    color: isUser ? '#fff' : '#2DD4BF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    flexShrink: 0
  };

  const displayName = user?.name || (isUser ? 'User' : 'Admin');
  const displayRole = user?.role === 'admin' ? 'Master Admin' : (user?.subscription_tier ? `${user.subscription_tier.toUpperCase()} Plan` : 'User');

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: collapsed ? '16px 8px' : '16px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--accent, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={16} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px', color: isUser ? 'var(--text-primary)' : '#FFFFFF', letterSpacing: '0.5px' }}>
              RAKSHAK
            </span>
          </div>
        )}
        <button style={toggleBtnStyle} onClick={() => setCollapsed(!collapsed)} aria-label="Toggle Sidebar">
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div style={navListStyle}>
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </div>

      <div style={bottomStyle}>
        <div style={avatarStyle}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: isUser ? 'var(--text-primary)' : '#F8FAFC',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>{displayName}</span>
            <span style={{ 
              fontSize: '11px', 
              color: isUser ? 'var(--text-secondary)' : '#94A3B8',
              backgroundColor: isUser ? 'var(--bg-secondary)' : 'rgba(255, 255, 255, 0.06)',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              width: 'fit-content',
              marginTop: '2px',
              fontWeight: 500
            }}>{displayRole}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
