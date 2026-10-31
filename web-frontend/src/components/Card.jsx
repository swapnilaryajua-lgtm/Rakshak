import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  variant = 'light',
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isDark = variant === 'dark';

  const paddingStyles = {
    none: '0px',
    sm: '14px',
    md: '20px',
    lg: '28px'
  };

  const baseStyle = {
    backgroundColor: isDark ? 'var(--bg-admin-card, #111622)' : 'var(--bg-card, #FFFFFF)',
    border: `1px solid ${isDark ? 'var(--border-admin, #1E2738)' : 'var(--border-default, #E5E4E2)'}`,
    borderRadius: '16px',
    color: isDark ? '#F8FAFC' : 'var(--text-primary, #1A1A1A)',
    padding: paddingStyles[padding] !== undefined ? paddingStyles[padding] : paddingStyles.md,
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
    transition: 'all 200ms ease',
    transform: hover && isHovered ? 'translateY(-2px)' : 'none',
    boxSizing: 'border-box'
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ ...baseStyle, ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
