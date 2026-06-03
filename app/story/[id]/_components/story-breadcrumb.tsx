import { Video } from 'lucide-react';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { StoryWithNeighbors, Book } from '@/lib/schemas';

interface StoryBreadcrumbProps {
  story: StoryWithNeighbors;
  book: Book | undefined;
}

export function StoryBreadcrumb({ story, book }: StoryBreadcrumbProps) {
  const centralShuSiman = story.centralShuSiman;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-hebrew mb-3 flex-wrap">
      <span>{book?.name ?? '...'}</span>
      <span>›</span>
      <span>{story.topic.name}</span>
      {centralShuSiman && (
        <span className="contents">
          <span>›</span>
          <span>
            סימן {toHebrewNumeral(centralShuSiman.siman)}
            {centralShuSiman.title ? ` - ${centralShuSiman.title}` : ''}
          </span>
        </span>
      )}
      {story.videoUrl && (
        <>
          <span>·</span>
          <Video className="w-3 h-3" />
          <span>וידאו</span>
        </>
      )}
    </div>
  );
}
