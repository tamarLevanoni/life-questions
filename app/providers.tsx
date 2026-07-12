'use client';

import { Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { WhatsAppProvider } from '@/lib/whatsapp-context';
import { AuthRuntime } from '@/components/auth/auth-runtime';
import { WhatsAppInviteModal } from '@/components/whatsapp/whatsapp-invite-modal';
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
          <WhatsAppProvider>
            <AuthProvider>
              {children}
              <Suspense fallback={null}>
                <AuthRuntime />
              </Suspense>
            </AuthProvider>
            <WhatsAppInviteModal />
          </WhatsAppProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
