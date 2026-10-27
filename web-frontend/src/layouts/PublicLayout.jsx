import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function PublicLayout({ children }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      height: '100vh',
      backgroundColor: 'var(--bg-primary, #FAF8F5)',
      overflow: 'hidden'
    }}>
      <Navbar />
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}>
        <main style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
