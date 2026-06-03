'use client';

import { Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { AuthRuntime } from '@/components/auth/auth-runtime';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <ToastProvider>
          <AuthProvider>
            {children}
            <Suspense fallback={null}>
              <AuthRuntime />
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
