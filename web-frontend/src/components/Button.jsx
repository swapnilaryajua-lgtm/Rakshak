import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '0px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 200ms ease',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    boxSizing: 'border-box',
    transform: 'none',
  };

  const focusStyle = isFocused ? {
    outline: '2px solid var(--accent)',
    outlineOffset: '2px'
  } : {};

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: isHovered && !disabled ? 'var(--accent-hover)' : 'var(--accent)',
      color: '#FFFFFF'
    },
    secondary: {
      backgroundColor: isHovered && !disabled ? 'var(--bg-secondary)' : 'transparent',
      border: '1px solid var(--border-default)',
      color: 'var(--text-primary)'
    },
    ghost: {
      backgroundColor: isHovered && !disabled ? 'var(--bg-secondary)' : 'transparent',
      color: 'var(--text-primary)'
    },
    danger: {
      backgroundColor: isHovered && !disabled ? '#B91C1C' : 'var(--severity-critical)',
      color: '#FFFFFF'
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...focusStyle,
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
