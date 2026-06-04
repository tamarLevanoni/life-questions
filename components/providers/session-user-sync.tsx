'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import type { UserData } from '@/lib/schemas';

export function SessionUserSync() {
  const { data: session, status, update } = useSession();
  const { closeLoginModal } = useAuth();

  const u = session?.user;
  const id = u?.id ?? '';
  const googleId = u?.googleId ?? '';
  const email = u?.email ?? '';
  const firstName = u?.firstName ?? '';
  const lastName = u?.lastName ?? '';
  const institutionName = u?.institutionName;
  const phone = u?.phone ?? '';
  const marketingConsent = u?.marketingConsent ?? false;
  const occupationsKey = u?.occupations?.join(',') ?? '';

  // u?.occupations identity changes on every poll — שימוש ב-occupationsKey
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userData = useMemo<UserData>(() => ({
    id,
    googleId,
    email,
    firstName,
    lastName,
    institutionName,
    phone,
    occupations: u?.occupations ?? [],
    marketingConsent,
  }), [id, googleId, email, firstName, lastName, institutionName, phone, occupationsKey, marketingConsent]);

  const image = u?.image ?? null;
  const isRegistrationComplete = u?.isRegistrationComplete ?? false;

  useEffect(() => {
    const { setUser, clearUser, setAuthStatus, setImage } = useUserStore.getState();
    if (status === 'authenticated') {
      setImage(image);
      if (isRegistrationComplete) {
        setUser(userData);
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('registration-required');
      }
    } else if (status === 'unauthenticated') {
      clearUser();
      setAuthStatus('unauthenticated');
    }
    // status === 'loading' → authStatus נשאר 'idle'
  }, [status, userData, image, isRegistrationComplete]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'auth-callback') return;
      await update();
      closeLoginModal();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [update, closeLoginModal]);

  return null;
}
