'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/stores/user-store';

interface StoryNavigationProps {
  prevId: string | null;
  nextId: string | null;
}

const controlClassName = 'flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-colors font-hebrew text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-50';

export function StoryNavigation({ prevId, nextId }: StoryNavigationProps) {
  const authStatus = useUserStore((s) => s.authStatus);
  const { openLoginModal, openOnboardingModal } = useAuth();
  if (!prevId && !nextId) return null;

  const requestAccess = authStatus === 'registration-required'
    ? openOnboardingModal
    : openLoginModal;
  const directions = [
    { id: prevId, label: 'הסיפור הקודם', previous: true },
    { id: nextId, label: 'הסיפור הבא', previous: false },
  ];

  return (
    <nav aria-label="ניווט בין סיפורים" className="flex items-center justify-between gap-4 pt-6 border-t border-border">
      {directions.map(({ id, label, previous }) => {
        if (!id) return <div key={label} />;
        const content = (
          <>
            {previous ? <ChevronRight className="w-4 h-4" aria-hidden="true" /> : null}
            {label}
            {!previous ? <ChevronLeft className="w-4 h-4" aria-hidden="true" /> : null}
          </>
        );

        return authStatus === 'authenticated' ? (
          <Link key={label} href={`/story/${id}`} className={controlClassName}>
            {content}
          </Link>
        ) : (
          <button
            key={label}
            type="button"
            className={controlClassName}
            disabled={authStatus === 'idle'}
            onClick={requestAccess}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
