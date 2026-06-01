import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface StoryNavigationProps {
  prevId: string | null;
  nextId: string | null;
}

export function StoryNavigation({ prevId, nextId }: StoryNavigationProps) {
  if (!prevId && !nextId) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
      {prevId ? (
        <Link
          href={`/story/${prevId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-colors font-hebrew text-sm"
        >
          <ChevronRight className="w-4 h-4" />
          הסיפור הקודם
        </Link>
      ) : (
        <div />
      )}
      {nextId ? (
        <Link
          href={`/story/${nextId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-colors font-hebrew text-sm"
        >
          הסיפור הבא
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
