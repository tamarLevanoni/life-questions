'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/lib/auth-context';
import { SessionUserSync } from '@/components/providers/session-user-sync';
import { LoginModal } from '@/components/auth/login-modal';
import { OnboardingModal } from '@/components/auth/onboarding-modal';

function OnboardingTrigger() {
  const { data: session, status } = useSession();
  const { openOnboardingModal } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.isRegistrationComplete) {
      openOnboardingModal();
    }
  }, [status, session, openOnboardingModal]);

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
