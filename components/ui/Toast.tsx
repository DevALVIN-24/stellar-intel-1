import React from 'react';

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'error';
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const Toast = ({ toasts, onRemove }: ToastProps) => {
  return (
    <div aria-live="polite" style={containerStyle}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          style={{
            ...toastStyle,
            ...(toast.type === 'error' ? errorStyle : infoStyle),
          }}
          onClick={() => onRemove(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  zIndex: 9999,
};

const toastStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '0.375rem',
  minWidth: '200px',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif',
  fontSize: '0.875rem',
  backdropFilter: 'blur(5px)',
};

const infoStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
};

const errorStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #ef4444, #f87171)',
};
