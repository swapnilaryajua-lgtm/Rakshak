import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronLeft } from 'lucide-react';

const Sidebar = ({ items = [], variant = 'user' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isUser = variant === 'user';
  
  const containerStyle = {
    width: collapsed ? '64px' : '260px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    backgroundColor: isUser ? 'var(--bg-card)' : 'var(--bg-admin)',
    borderRight: `1px solid ${isUser ? 'var(--border-default)' : 'var(--border-admin)'}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 300ms ease',
    boxSizing: 'border-box'
  };

  const toggleBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-end',
    padding: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isUser ? 'var(--text-secondary)' : 'var(--text-muted)'
  };

  const navListStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 8px',
    gap: '4px',
    listStyle: 'none',
    margin: 0,
    overflowY: 'auto'
  };

  const getItemStyle = (isActive, isHovered) => {
    let bg = 'transparent';
    let color = isUser ? 'var(--text-secondary)' : 'var(--text-muted)';

    if (isActive) {
      if (isUser) {
        bg = 'var(--accent-light)';
        color = 'var(--accent)';
      } else {
        bg = 'var(--accent)';
        color = '#FFFFFF';
      }
    } else if (isHovered) {
      if (isUser) {
        bg = 'var(--bg-secondary)';
      } else {
        bg = 'var(--bg-admin-card)';
      }
    }

    return {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      height: '48px',
      borderRadius: '8px',
      textDecoration: 'none',
      color,
      backgroundColor: bg,
      transition: 'all 150ms ease',
      cursor: 'pointer',
      justifyContent: collapsed ? 'center' : 'flex-start'
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
        <item.icon size={20} />
        {!collapsed && <span style={{ marginLeft: '12px', fontWeight: 500, fontSize: '14px' }}>{item.label}</span>}
      </Link>
    );
  };

  const bottomStyle = {
    padding: '16px',
    borderTop: `1px solid ${isUser ? 'var(--border-default)' : 'var(--border-admin)'}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '14px',
    flexShrink: 0
  };

  return (
    <div style={containerStyle}>
      <button style={toggleBtnStyle} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>
      <div style={navListStyle}>
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </div>
      <div style={bottomStyle}>
        <div style={avatarStyle}>U</div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: isUser ? 'var(--text-primary)' : 'var(--text-admin)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>User Name</span>
            <span style={{ 
              fontSize: '12px', 
              color: isUser ? 'var(--text-secondary)' : 'var(--text-muted)',
              backgroundColor: isUser ? 'var(--bg-secondary)' : 'var(--border-admin)',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              width: 'fit-content',
              marginTop: '4px'
            }}>{isUser ? 'User' : 'Admin'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
