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

