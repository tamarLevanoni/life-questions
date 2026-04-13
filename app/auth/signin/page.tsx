'use client';

import { Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // מפנה ישירות לגוגל ללא עמוד ביניים
    signIn('google', { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground font-hebrew text-sm">מעביר להתחברות...</p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground font-hebrew text-sm">טוען...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
