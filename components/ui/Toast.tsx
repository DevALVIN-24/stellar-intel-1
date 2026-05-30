'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, AlertCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'info' | 'error';

export interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

function ToastItem({ id, type, message, duration = 5000, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const triggerDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 200); // matches the 200ms duration of the exit animation
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      role="alert"
      className={clsx(
        'w-full max-w-sm rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto flex gap-3 items-start',
        isExiting ? 'animate-toast-out' : 'animate-toast-in',
        {
          'bg-white/90 border-blue-100 dark:bg-gray-900/90 dark:border-blue-900/30':
            type === 'info',
          'bg-white/90 border-red-100 dark:bg-gray-900/90 dark:border-red-900/30': type === 'error',
        }
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === 'info' ? (
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
        )}
      </div>

      <div className="flex-grow text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
        {message}
      </div>

      <button
        onClick={triggerDismiss}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  dismiss: (id: string) => void;
}

export function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onDismiss={dismiss}
        />
      ))}
    </div>,
    document.body
  );
}
