import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const closeBtnRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 25, 23, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: show ? 1 : 0,
    transition: 'opacity 200ms ease',
  };

  const sizeStyles = {
    sm: '400px',
    md: '600px',
    lg: '800px'
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: sizeStyles[size] || sizeStyles.md,
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 15px -3px rgba(28,25,23,0.1)',
    transform: show ? 'scale(1)' : 'scale(0.95)',
    transition: 'transform 200ms ease',
    margin: '16px',
    boxSizing: 'border-box'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-default)'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  };

  const closeBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
  };

  const contentStyle = {
    padding: '24px',
    overflowY: 'auto'
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>{title}</h2>
          <button 
            ref={closeBtnRef}
            onClick={onClose} 
            style={closeBtnStyle}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
