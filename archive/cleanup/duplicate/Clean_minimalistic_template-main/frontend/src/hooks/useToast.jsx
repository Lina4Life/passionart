/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = useCallback(({ type, message }) => {
    setToast({ type, message });
  }, []);

  const clearToast = useCallback(() => {
    setToast({ type: '', message: '' });
  }, []);

  return { toast, showToast, clearToast };
};
