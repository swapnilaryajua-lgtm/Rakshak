import React from 'react';
import Card from './Card';

const StatCard = ({
  label,
  title,
  value,
  icon,
  trend,
  variant = 'light',
  subtitle,
  chip,
  className = '',
  style = {}
}) => {
  const isDark = variant === 'dark';
  const displayLabel = label || title || '';

  const cardStyle = {
    backgroundColor: isDark ? 'var(--bg-admin-card, #111622)' : 'var(--bg-card, #FFFFFF)',
    border: `1px solid ${isDark ? 'var(--border-admin, #1E2738)' : 'var(--border-default, #E5E4E2)'}`,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.35)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
    ...style
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  };

  const iconContainerStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const trendStyle = {
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '9999px',
    backgroundColor: trend?.direction === 'up'
      ? (isDark ? 'rgba(34, 197, 94, 0.18)' : '#DCFCE7')
      : (isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2'),
    color: trend?.direction === 'up'
      ? (isDark ? '#4ADE80' : '#166534')
      : (isDark ? '#F87171' : '#991B1B'),
    border: `1px solid ${trend?.direction === 'up'
      ? (isDark ? 'rgba(34, 197, 94, 0.3)' : '#86EFAC')
      : (isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5')}`,
    letterSpacing: '0.2px'
  };

  const chipStyle = {
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '9999px',
    backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.08)',
    color: isDark ? '#2DD4BF' : 'var(--accent, #0D9488)',
    border: `1px solid ${isDark ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.2)'}`
  };

  const valueStyle = {
    fontSize: '32px',
    fontWeight: 800,
    color: isDark ? '#FFFFFF' : '#0F172A',
    lineHeight: 1.15,
    marginBottom: '6px',
    letterSpacing: '-0.5px'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: isDark ? '#94A3B8' : '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '2px'
  };

  const subtitleStyle = {
    fontSize: '12px',
    color: isDark ? '#64748B' : '#94A3B8',
    marginTop: '4px',
    lineHeight: 1.4
  };

  return (
    <Card style={cardStyle} padding="md" className={className}>
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          {icon}
        </div>
        {trend && <div style={trendStyle}>{trend.value}</div>}
        {chip && !trend && <div style={chipStyle}>{chip}</div>}
      </div>
      <div>
        <div style={labelStyle}>{displayLabel}</div>
        <div style={valueStyle}>{value}</div>
        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
