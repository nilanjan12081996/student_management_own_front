import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    if (!message) return;
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let IconComponent = Info;
          let iconColor = 'var(--info, #3b82f6)';
          let borderColor = 'var(--info, #3b82f6)';

          if (toast.type === 'success') {
            IconComponent = CheckCircle;
            iconColor = 'var(--success, #10b981)';
            borderColor = 'var(--success, #10b981)';
          } else if (toast.type === 'error') {
            IconComponent = AlertCircle;
            iconColor = 'var(--danger, #ef4444)';
            borderColor = 'var(--danger, #ef4444)';
          } else if (toast.type === 'warning') {
            IconComponent = AlertTriangle;
            iconColor = 'var(--warning, #f59e0b)';
            borderColor = 'var(--warning, #f59e0b)';
          }

          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              style={{
                pointerEvents: 'auto',
                minWidth: '320px',
                maxWidth: '440px',
                padding: '0.85rem 1.15rem',
                borderRadius: '10px',
                background: 'var(--bg-card, #1e293b)',
                border: '1px solid var(--border-medium, rgba(255,255,255,0.12))',
                borderLeft: `5px solid ${borderColor}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.85rem',
                fontSize: '0.92rem',
                color: 'var(--text-main, #f8fafc)',
                animation: 'toastIn 250ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <IconComponent size={20} color={iconColor} style={{ flexShrink: 0 }} />
                <span style={{ lineHeight: '1.4', fontWeight: 500 }}>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'color 0.15s ease'
                }}
                title="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const useWarning = () => {
  const { warning } = useToast();
  return warning;
};
