'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import type { UserData } from '@/lib/schemas';

/**
 * מסנכרן את ה-NextAuth session לתוך Zustand store.
 * הצרכן היחיד של useSession ברמת ה-app מחוץ ל-AuthRuntime / header islands.
 * כל שאר הקוד צריך לקרוא את ה-user וה-authStatus מתוך useUserStore.
 */
export function SessionUserSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const setAuthStatus = useUserStore((s) => s.setAuthStatus);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUser(session.user as UserData);
      setAuthStatus('authenticated');
    } else if (status === 'unauthenticated') {
      clearUser();
      setAuthStatus('unauthenticated');
    }
  }, [session, status, setUser, clearUser, setAuthStatus]);

  return null;
}
