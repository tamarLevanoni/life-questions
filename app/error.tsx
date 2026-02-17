'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-bold font-hebrew">משהו השתבש</h2>
        <p className="text-muted-foreground font-hebrew text-sm">
          אירעה שגיאה בלתי צפויה. אנא נסה שוב.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium font-hebrew hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          נסה שוב
        </button>
      </div>
    </div>
  );
}
