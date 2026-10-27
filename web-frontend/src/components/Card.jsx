import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const paddingStyles = {
    sm: '12px',
    md: '24px',
    lg: '32px'
  };

    const baseStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    borderRadius: '0px',
    padding: paddingStyles[padding] || paddingStyles.md,
    boxShadow: 'none',
    transition: 'background-color 200ms ease',
    transform: 'none',
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
