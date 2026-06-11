'use client';

import Link from 'next/link';
import { ScenarioCard } from '@/components/story/scenario-card';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import type { Story } from '@/lib/schemas';

export function FeaturedStoryCard({ story }: { story: Story; delay: number }) {
  const books = useAppDataStore((s) => s.books);
  const bookName = books.find((b) => b.id === story.bookId)?.name;

  return (
    <Link href={`/story/featured/${story.id}`} className="block">
      <ScenarioCard story={story} bookName={bookName} topicName={story.topic.name} />
    </Link>
  );
}
