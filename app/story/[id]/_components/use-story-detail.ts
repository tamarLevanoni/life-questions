'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/stores/user-store';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useAppDataStore } from '@/lib/stores/app-data-store';

export function useStoryDetail(storyId: string) {
  const router = useRouter();
  const { openLoginModal, openOnboardingModal } = useAuth();
  const story = useStoriesStore((s) => s.stories[storyId]);
  const books = useAppDataStore((s) => s.books);
  const authStatus = useUserStore((s) => s.authStatus);

  const book = books.find((b) => b.id === story?.bookId);
  const canViewExpansion = authStatus === 'authenticated' && story?.expansion != null;
  const shouldLoadExpansion = authStatus === 'authenticated' && story?.hasExpansion && story.expansion === null;

  useEffect(() => {
    if (shouldLoadExpansion) router.refresh();
  }, [router, shouldLoadExpansion]);
  const prevId = story?.neighbors?.prev?.id ?? null;
  const nextId = story?.neighbors?.next?.id ?? null;
  const storyTitleEncoded = encodeURIComponent(story?.title ?? '');

  const requestExpansionAccess = () => {
    if (authStatus === 'unauthenticated') openLoginModal();
    else if (authStatus === 'registration-required') openOnboardingModal();
  };

  return {
    story,
    book,
    canViewExpansion,
    prevId,
    nextId,
    storyTitleEncoded,
    requestExpansionAccess,
  };
}
