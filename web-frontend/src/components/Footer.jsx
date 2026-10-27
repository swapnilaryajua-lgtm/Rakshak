import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    padding: '64px 24px 32px 24px',
    borderTop: '1px solid var(--border-default)',
    fontFamily: '"Plus Jakarta Sans", sans-serif'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '48px',
    marginBottom: '64px'
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '16px',
    color: 'var(--text-primary)'
  };

  const taglineStyle = {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const columnTitleStyle = {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '24px',
    color: 'var(--text-primary)'
  };

  const linkListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const linkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 200ms ease'
  };

  const bottomBarStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '32px',
    borderTop: '1px solid var(--border-default)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '14px',
    color: 'var(--text-secondary)'
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <div style={logoStyle}>
            <img src="/logo.png" alt="Rakshak" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <p style={taglineStyle}>Enterprise-grade cybersecurity for modern web applications.</p>
        </div>
        
        <div>
          <h3 style={columnTitleStyle}>Quick Links</h3>
          <ul style={linkListStyle}>
            <li><Link to="/" style={linkStyle}>Home</Link></li>
            <li><Link to="/about" style={linkStyle}>About</Link></li>
            <li><Link to="/scan" style={linkStyle}>Scanner</Link></li>
            <li><Link to="/pricing" style={linkStyle}>Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 style={columnTitleStyle}>Contact</h3>
          <p style={{ ...taglineStyle, marginBottom: '8px' }}>hello@rakshak.io</p>
          <div style={socialLinksStyle}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }} aria-label="Twitter"><ExternalLink size={16} /> Twitter</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }} aria-label="GitHub"><ExternalLink size={16} /> GitHub</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }} aria-label="LinkedIn"><ExternalLink size={16} /> LinkedIn</a>
          </div>
        </div>
      </div>

      <div style={bottomBarStyle}>
        <div>© 2026 Rakshak Technologies Pvt. Ltd. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/terms" style={linkStyle}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
