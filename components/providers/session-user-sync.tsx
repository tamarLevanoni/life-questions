'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import type { UserData } from '@/lib/schemas';

/**
 * מסנכרן את ה-NextAuth session לתוך Zustand store.
 * יש להוסיף את הקומפוננטה הזו בתוך <SessionProvider> ב-app/providers.tsx.
 * אינה מרנדרת תוכן — רק side-effect.
 */
export function SessionUserSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUser(session.user as UserData);
    } else if (status === 'unauthenticated') {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return null;
}
