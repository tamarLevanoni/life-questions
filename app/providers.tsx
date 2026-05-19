'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { LoginModal } from '@/components/auth/login-modal';
import { OnboardingModal } from '@/components/auth/onboarding-modal';
import { SessionUserSync } from '@/components/providers/session-user-sync';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { useStoriesStore } from '@/lib/stores/stories-store';

function ReferencePreloader() {
  const loadAll = useReferenceStore((s) => s.loadAll);
  const { loadFeaturedStories } = useStoriesStore();
  useEffect(() => {
    if (window.opener) return;
    loadAll();
    loadFeaturedStories();
  }, [loadAll, loadFeaturedStories]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <ReferencePreloader />
        <SessionUserSync />
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
