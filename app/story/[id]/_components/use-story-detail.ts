'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { useUserStore } from '@/lib/stores/user-store';

export function useStoryDetail() {
  const { id: storyId } = useParams<{ id: string }>();
  const router = useRouter();
  const isAuthenticated = useUserStore((s) => s.authStatus === 'authenticated');
  const { story, loading, error, fetchStory, clear } = useStoryDetailStore();
  const { books } = useReferenceStore();

  useEffect(() => {
    if (storyId) fetchStory(storyId);
    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const canViewExpansion = isAuthenticated;
  const book = story ? books.find((b) => b.id === story.bookId) : undefined;
  const prevId = story?.neighbors?.prev?.id ?? null;
  const nextId = story?.neighbors?.next?.id ?? null;
  const storyTitleEncoded = story ? encodeURIComponent(story.title) : '';

  const requestExpansionAccess = () => router.push('/api/auth/signin');

  return {
    storyId,
    story,
    book,
    loading,
    error,
    canViewExpansion,
    prevId,
    nextId,
    storyTitleEncoded,
    requestExpansionAccess,
  };
}

export type UseStoryDetailReturn = ReturnType<typeof useStoryDetail>;
