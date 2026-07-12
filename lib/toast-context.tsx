'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  persistent?: boolean;
  position?: 'top' | 'bottom';
}

interface ToastOptions {
  type?: ToastType;
  persistent?: boolean;
  position?: 'top' | 'bottom';
}

interface ToastContextValue {
  showToast: (message: string, typeOrOptions?: ToastType | ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const STYLES: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200',
  error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200',
  info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, typeOrOptions?: ToastType | ToastOptions) => {
    const options: ToastOptions = typeof typeOrOptions === 'string'
      ? { type: typeOrOptions }
      : (typeOrOptions ?? {});
    const { type = 'info', persistent = false } = options;
    const position = options.position ?? (type === 'error' ? 'top' : 'bottom');
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type, persistent, position }]);

    if (!persistent) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, type === 'error' ? 7000 : 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          const isTop = toast.position === 'top';
          return (
            <motion.div
              key={toast.id}
              dir="rtl"
              initial={{ opacity: 0, y: isTop ? -16 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isTop ? -16 : 20 }}
              transition={{ duration: 0.25 }}
              className={`fixed z-50 flex items-center gap-3 px-4 py-3 border font-hebrew text-sm shadow-lg ${STYLES[toast.type]} ${
                isTop
                  ? 'top-0 inset-x-0 border-x-0 border-t-0 border-b'
                  : 'bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm rounded-xl'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="סגור"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
