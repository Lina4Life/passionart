/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useEffect } from 'react';

const Toast = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: type === 'error' ? '#e00' : '#0077ff',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      zIndex: 9999,
      minWidth: 200,
      fontWeight: 500,
    }}>
      {message}
    </div>
  );
};

export default Toast;
