'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/stores/user-store';
import { SessionUserSync } from '@/components/providers/session-user-sync';
import { LoginModal } from '@/components/auth/login-modal';
import { OnboardingModal } from '@/components/auth/onboarding-modal';

function OnboardingTrigger() {
  const authStatus = useUserStore((s) => s.authStatus);
  const { openOnboardingModal } = useAuth();

  useEffect(() => {
    if (authStatus === 'registration-required') {
      openOnboardingModal();
    }
  }, [authStatus, openOnboardingModal]);

  return null;
}

export function AuthRuntime() {
  return (
    <>
      <SessionUserSync />
      <OnboardingTrigger />
      <LoginModal />
      <OnboardingModal />
    </>
  );
}
