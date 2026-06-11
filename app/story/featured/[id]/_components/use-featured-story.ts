'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import type { Story, Book } from '@/lib/schemas';

interface UseFeaturedStoryResult {
  story: Story | null;
  book: Book | undefined;
}

export function useFeaturedStory(storyId: string): UseFeaturedStoryResult {
  const router = useRouter();
  const featuredStories = useAppDataStore((s) => s.featuredStories);
  const books = useAppDataStore((s) => s.books);

  const story = featuredStories.find((s) => s.id === storyId) ?? null;
  const book = story ? books.find((b) => b.id === story.bookId) : undefined;

  useEffect(() => {
    if (!story) router.replace('/');
  }, [story, router]);

  return { story, book };
}
