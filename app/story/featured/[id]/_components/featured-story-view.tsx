'use client';

import Link from 'next/link';
import { Search, AlertCircle } from 'lucide-react';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { EmptyState } from '@/components/common/empty-state';
import { StoryPanels } from '@/components/story/story-panels';
import { useAppDataStore } from '@/lib/stores/app-data-store';

interface FeaturedStoryViewProps {
  storyId: string;
}

export function FeaturedStoryView({ storyId }: FeaturedStoryViewProps) {
  const featuredStories = useAppDataStore((s) => s.featuredStories);
  const books = useAppDataStore((s) => s.books);

  const story = featuredStories.find((s) => s.id === storyId) ?? null;
  const book = story ? books.find((b) => b.id === story.bookId) : undefined;

  if (!story) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="הסיפור לא נמצא"
        description="הסיפור המבוקש אינו זמין כעת"
      />
    );
  }

  return (
    <>
      <StoryPanels story={story} book={book} />

      <MotionFadeIn trigger="mount" delay={0.3} className="mb-8">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-primary/30 text-sm font-medium font-hebrew text-primary hover:bg-primary/5 transition-colors"
        >
          <Search className="w-4 h-4" />
          לכל הסיפורים
        </Link>
      </MotionFadeIn>
    </>
  );
}
