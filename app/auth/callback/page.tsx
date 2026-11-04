'use client';

import { useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const sessionRequest = useRef<ReturnType<typeof getSession> | null>(null);

  useEffect(() => {
    if (!window.opener) {
      // Reload so the normal page initializes its own SessionProvider.
      window.location.replace('/');
      return;
    }

    let active = true;
    // Reuse the request when development Strict Mode reconnects this effect.
    sessionRequest.current ??= getSession();
    void sessionRequest.current.then(() => {
      if (!active) return;
      window.opener.postMessage({ type: 'auth-callback' }, window.location.origin);
      window.close();
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground font-hebrew text-sm">מסיים התחברות...</p>
      </div>
    </div>
  );
}
