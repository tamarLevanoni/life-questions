import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { StoryBreadcrumb } from './story-breadcrumb';
import { StorySourcesList } from './story-sources-list';
import type { StoryWithNeighbors } from '@/lib/types';
import type { Book } from '@/lib/types';

interface StoryArticleProps {
  story: StoryWithNeighbors;
  book: Book | undefined;
}

export function StoryArticle({ story, book }: StoryArticleProps) {
  const concepts = story.conceptsFromIndex;

  return (
    <GlassCard className="p-6 md:p-8 mb-6">
      <StoryBreadcrumb story={story} book={book} />

      <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-6">{story.title}</h1>

      {/* הסיפור */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold font-hebrew mb-3 text-primary">הסיפור</h2>
        <p className="text-foreground leading-relaxed font-hebrew whitespace-pre-wrap">
          {story.storyBody}
        </p>
      </div>

      {/* השאלה */}
      <div className="mb-8 p-4 rounded-xl bg-muted/50 border-r-4 border-primary">
        <h2 className="text-lg font-semibold font-hebrew mb-2">השאלה</h2>
        <p className="text-foreground font-hebrew">{story.legalQuestion}</p>
      </div>

      <StorySourcesList
        shasRefs={story.shasRefs}
        shuRefs={story.shuRefs}
        sourceReferencesText={story.sourceReferencesText}
      />

      {/* מושגים */}
      {concepts.length > 0 && (
        <div className="mt-3 mb-6">
          <span className="text-xs text-muted-foreground font-hebrew font-medium">מושגים:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {concepts.map((concept, i) => (
              <Badge key={`concept-${i}`} variant="concept">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* וידאו */}
      {story.videoUrl && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold font-hebrew mb-3">צפייה בוידאו</h2>
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <iframe
              src={story.videoUrl.replace('watch?v=', 'embed/')}
              title={story.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
}
