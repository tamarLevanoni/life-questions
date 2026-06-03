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
  const story = useStoryDetailStore((s) => s.story);
  const loading = useStoryDetailStore((s) => s.loading);
  const error = useStoryDetailStore((s) => s.error);
  const fetchStory = useStoryDetailStore((s) => s.fetchStory);
  const books = useReferenceStore((s) => s.books);

  useEffect(() => {
    if (storyId) fetchStory(storyId);
  }, [storyId, fetchStory]);

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
