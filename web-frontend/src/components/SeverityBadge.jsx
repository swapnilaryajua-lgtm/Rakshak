import React from 'react';

const SeverityBadge = ({ severity = 'info', count }) => {
  const styles = {
    critical: { bg: 'var(--color-severity-critical-bg, transparent)', text: 'var(--color-severity-critical, #991B1B)' },
    high: { bg: 'var(--color-severity-high-bg, transparent)', text: 'var(--color-severity-high, #C2410C)' },
    medium: { bg: 'var(--color-severity-medium-bg, transparent)', text: 'var(--color-severity-medium, #B45309)' },
    low: { bg: 'var(--color-severity-low-bg, transparent)', text: 'var(--color-severity-low, #1D4ED8)' },
    info: { bg: 'var(--color-severity-info-bg, transparent)', text: 'var(--color-severity-info, #4B5563)' }
  };

  const currentStyle = styles[severity.toLowerCase()] || styles.info;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '9999px',
    backgroundColor: currentStyle.bg,
    color: currentStyle.text,
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    whiteSpace: 'nowrap'
  };

  return (
    <span style={badgeStyle}>
      {severity} {count !== undefined && count !== null ? `(${count})` : ''}
    </span>
  );
};

export default SeverityBadge;
