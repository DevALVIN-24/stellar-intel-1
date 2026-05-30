'use client';

import React, { createContext, useCallback, useState, useMemo } from 'react';
import { ToastContainer } from '@/components/ui/Toast';

export type ToastType = 'info' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  toast: {
    (message: string, options?: { type?: ToastType; duration?: number }): void;
    info: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastBase = useCallback(
    (message: string, options?: { type?: ToastType; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const type = options?.type ?? 'info';
      const duration = options?.duration ?? 5000;

      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const toast = useMemo(() => {
    const fn = (message: string, options?: { type?: ToastType; duration?: number }) => {
      toastBase(message, options);
    };

    fn.info = (message: string, duration?: number) => {
      toastBase(message, { type: 'info', duration });
    };

    fn.error = (message: string, duration?: number) => {
      toastBase(message, { type: 'error', duration });
    };

    return fn;
  }, [toastBase]);

  const value = useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
    }),
    [toasts, toast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}
