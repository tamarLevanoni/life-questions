'use client';

import Link from 'next/link';
import { ScenarioCard } from '@/components/story/scenario-card';
import { useReferenceStore } from '@/lib/stores/reference-store';
import type { Story } from '@/lib/types';

export function FeaturedStoryCard({ story, delay }: { story: Story; delay: number }) {
  const books = useReferenceStore((s) => s.books);
  const bookName = books.find((b) => b.id === story.bookId)?.name;

  return (
    <Link href={`/story/${story.id}`} className="block">
      <ScenarioCard story={story} bookName={bookName} topicName={story.topic.name} />
    </Link>
  );
}
