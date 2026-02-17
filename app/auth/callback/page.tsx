'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  useEffect(() => {
    // מודיע לחלון האב שההתחברות הושלמה וסוגר את ה-popup
    if (window.opener) {
      window.opener.postMessage({ type: 'auth-callback' }, window.location.origin);
      window.close();
    } else {
      // fallback - אם נפתח בלי popup, מפנה לדף הבית
      window.location.href = '/';
    }
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
