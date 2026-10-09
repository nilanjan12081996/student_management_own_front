import React, { createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const addToast = useCallback(() => {}, []);
  const success = useCallback(() => {}, []);
  const error = useCallback(() => {}, []);
  const info = useCallback(() => {}, []);
  const warning = useCallback(() => {}, []);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
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
