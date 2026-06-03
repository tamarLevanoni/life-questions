'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/stores/user-store';
import { SessionUserSync } from '@/components/providers/session-user-sync';
import { LoginModal } from '@/components/auth/login-modal';
import { OnboardingModal } from '@/components/auth/onboarding-modal';

function OnboardingTrigger() {
  const authStatus = useUserStore((s) => s.authStatus);
  const user = useUserStore((s) => s.user);
  const { openOnboardingModal } = useAuth();

  // isRegistrationComplete הוא flag זמני של OAuth שלא נכנס ל-UserData עצמו.
  // אחרי שה-store הוזן, אם חסרים שדות חובה (firstName/phone/occupations) —
  // המשתמש עדיין באמצע onboarding.
  const needsOnboarding =
    !!user &&
    (!user.firstName || !user.phone || user.occupations.length === 0);

  useEffect(() => {
    if (authStatus === 'authenticated' && needsOnboarding) {
      openOnboardingModal();
    }
  }, [authStatus, needsOnboarding, openOnboardingModal]);

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
