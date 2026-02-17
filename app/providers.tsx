'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { LoginModal } from '@/components/auth/login-modal';
import { OnboardingModal } from '@/components/auth/onboarding-modal';

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
            <LoginModal />
            <OnboardingModal />
          </AuthProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
