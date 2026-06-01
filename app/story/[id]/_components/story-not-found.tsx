import Link from 'next/link';
import { ArrowRight, SearchX } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';

interface StoryNotFoundProps {
  error?: string | null;
}

export function StoryNotFound({ error }: StoryNotFoundProps) {
  return (
    <EmptyState
      icon={SearchX}
      title="הסיפור לא נמצא"
      description={error ?? 'הסיפור שחיפשת לא קיים או הוסר'}
      action={
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לחיפוש
        </Link>
      }
    />
  );
}
