'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import type { UserData } from '@/lib/schemas';

/**
 * הצרכן היחיד של useSession באפליקציה.
 * מסנכרן את ה-NextAuth session ל-useUserStore, ומאזין להודעת auth-callback
 * מחלון ההתחברות כדי לרענן את ה-session ולסגור את מודאל ההתחברות.
 */
export function SessionUserSync() {
  const { data: session, status, update } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setAuthStatus = useUserStore((s) => s.setAuthStatus);
  const { closeLoginModal } = useAuth();

  const u = session?.user;
  const id = u?.id;
  const googleId = u?.googleId;
  const email = u?.email;
  const firstName = u?.firstName;
  const lastName = u?.lastName;
  const institutionName = u?.institutionName;
  const phone = u?.phone;
  const marketingConsent = u?.marketingConsent;
  const occupationsKey = u?.occupations?.join(',') ?? '';

  const userData = useMemo<UserData | null>(() => {
    if (!id || !googleId || !email) return null;
    return {
      id,
      googleId,
      email,
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      institutionName,
      phone: phone ?? '',
      occupations: u?.occupations ?? [],
      marketingConsent: marketingConsent ?? false,
    };
    // u?.occupations identity changes on every poll — שימוש ב-occupationsKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    googleId,
    email,
    firstName,
    lastName,
    institutionName,
    phone,
    occupationsKey,
    marketingConsent,
  ]);

  useEffect(() => {
    if (status === 'authenticated' && userData) {
      setUser(userData);
      setAuthStatus('authenticated');
    } else if (status === 'unauthenticated') {
      clearUser();
      setAuthStatus('unauthenticated');
    }
  }, [status, userData, setUser, clearUser, setAuthStatus]);

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
