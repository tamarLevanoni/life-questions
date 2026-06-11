'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/user-store';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useAppDataStore } from '@/lib/stores/app-data-store';

export function useStoryDetail() {
  const { id: storyId } = useParams<{ id: string }>();
  const router = useRouter();
  const story = useStoriesStore((s) => s.stories[storyId]);
  const books = useAppDataStore((s) => s.books);
  const isAuthenticated = useUserStore((s) => s.authStatus === 'authenticated');

  const book = books.find((b) => b.id === story?.bookId);
  const canViewExpansion = isAuthenticated;
  const prevId = story?.neighbors?.prev?.id ?? null;
  const nextId = story?.neighbors?.next?.id ?? null;
  const storyTitleEncoded = encodeURIComponent(story?.title ?? '');

  const requestExpansionAccess = () => router.push('/api/auth/signin');

  return {
    storyId,
    story,
    book,
    canViewExpansion,
    prevId,
    nextId,
    storyTitleEncoded,
    requestExpansionAccess,
  };
}

export type UseStoryDetailReturn = ReturnType<typeof useStoryDetail>;
