'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Home } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'בעיית הגדרות בשרת. אנא פנה למנהל המערכת.',
  AccessDenied: 'אין לך הרשאה לגשת לעמוד זה.',
  Verification: 'קישור האימות פג תוקף או כבר נוצל.',
  Default: 'אירעה שגיאה בתהליך ההתחברות. אנא נסה שוב.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-bold font-hebrew">שגיאת התחברות</h2>
        <p className="text-muted-foreground font-hebrew text-sm">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium font-hebrew hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-muted-foreground font-hebrew text-sm">טוען...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
