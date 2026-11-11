'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import type { UserData } from '@/lib/schemas';

export function SessionUserSync() {
  const { data: session, status } = useSession();
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
  const occupationsKey = JSON.stringify(u?.occupations ?? []);

  // u?.occupations identity changes on every poll — שימוש ב-occupationsKey
  const userData = useMemo<UserData>(() => ({
    id,
    googleId,
    email,
    firstName,
    lastName,
    institutionName,
    phone,
    occupations: JSON.parse(occupationsKey) as UserData['occupations'],
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
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'auth-callback') return;
      // Installed NextAuth v4 skips update() for guests. Notify its provider
      // directly: a popup's storage broadcast can be lost within the same second.
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'nextauth.message',
        newValue: JSON.stringify({ event: 'session', data: { trigger: 'auth-callback' } }),
      }));
      closeLoginModal();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [closeLoginModal]);

  return null;
}
