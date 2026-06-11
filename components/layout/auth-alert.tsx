'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useToast } from '@/lib/toast-context';

const ALERT_MESSAGES: Record<string, string> = {
  'auth-story':   'יש להתחבר כדי לצפות בסיפור',
  'auth-profile': 'יש להתחבר כדי לגשת לאיזור האישי',
  'auth-contact': 'יש להתחבר כדי לשלוח שאלת המשך',
  'auth':         'יש להתחבר כדי לצפות בתוכן',
};

export function AuthAlert() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    const alertKey = searchParams.get('alert');
    const message = alertKey ? ALERT_MESSAGES[alertKey] : null;
    if (message) {
      showToast(message, { type: 'error', persistent: true, position: 'top' });
      const params = new URLSearchParams(searchParams.toString());
      params.delete('alert');
      const clean = params.size > 0 ? `${pathname}?${params}` : pathname;
      window.history.replaceState(null, '', clean);
    }
  }, [searchParams, pathname, showToast]);

  return null;
}
