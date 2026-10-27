import React from 'react';
import Card from './Card';

const StatCard = ({ label, value, icon, trend, variant = 'light' }) => {
  const isDark = variant === 'dark';

  const cardStyle = {
    backgroundColor: isDark ? 'var(--bg-admin-card)' : 'var(--bg-card)',
    border: `1px solid ${isDark ? 'var(--border-admin)' : 'var(--border-default)'}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  };

  const iconContainerStyle = {
    color: isDark ? '#FAFAF9' : 'var(--text-primary)',
    display: 'flex'
  };

  const trendStyle = {
    fontSize: '12px',
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '9999px',
    backgroundColor: trend?.direction === 'up' ? (isDark ? 'rgba(34,197,94,0.2)' : '#DCFCE7') : (isDark ? 'rgba(239,68,68,0.2)' : '#FEE2E2'),
    color: trend?.direction === 'up' ? (isDark ? '#4ADE80' : '#166534') : (isDark ? '#F87171' : '#991B1B')
  };

  const valueStyle = {
    fontSize: '32px',
    fontWeight: 700,
    color: isDark ? '#FAFAF9' : 'var(--text-primary)',
    lineHeight: 1.2,
    marginBottom: '4px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: isDark ? '#A8A29E' : 'var(--text-muted)'
  };

  return (
    <Card style={cardStyle} padding="md">
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          {icon}
        </div>
        {trend && (
          <div style={trendStyle}>
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <div style={valueStyle}>{value}</div>
        <div style={labelStyle}>{label}</div>
      </div>
    </Card>
  );
};

export default StatCard;
