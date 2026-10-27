import React from 'react';

const LoadingSpinner = ({ text, size = 'md' }) => {
  const sizeMap = {
    sm: '20px',
    md: '32px',
    lg: '48px'
  };

  const dim = sizeMap[size] || sizeMap.md;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes rakshak-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        width: dim,
        height: dim,
        border: '2px solid var(--border-default)',
        borderTop: '2px solid var(--accent)',
        borderRadius: '50%',
        animation: 'rakshak-spin 1s linear infinite'
      }} />
      {text && (
        <span style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
