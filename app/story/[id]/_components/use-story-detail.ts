'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import { useReferenceStore } from '@/lib/stores/reference-store';

export function useStoryDetail() {
  const { id: storyId } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { story, loading, error, fetchStory, clear } = useStoryDetailStore();
  const { books } = useReferenceStore();

  useEffect(() => {
    if (storyId) fetchStory(storyId);
    return () => clear();
    // fetchStory handles dedup via storyCache; clear on unmount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const canViewExpansion = !!session;
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
