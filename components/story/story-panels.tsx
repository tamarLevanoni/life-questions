import { Video, BookOpen, Scale } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { ExpandableAnswerPanel } from './expandable-answer-panel';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { Story, Book } from '@/lib/schemas';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

interface StoryPanelsProps {
  story: Story;
  book: Book | undefined;
  expansionLocked?: boolean;
  onRequestExpansionAccess?: () => void;
}

function StoryBreadcrumb({ story, book }: { story: Story; book: Book | undefined }) {
  const siman = story.centralShuSiman;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-hebrew mb-3 flex-wrap">
      <span>{book?.name ?? '...'}</span>
      <span>›</span>
      <span>{story.topic.name}</span>
      {siman && (
        <span className="contents">
          <span>›</span>
          <span>
            סימן {toHebrewNumeral(siman.siman)}
            {siman.title ? ` - ${siman.title}` : ''}
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

function StorySourcesList({
  shasRefs,
  shuRefs,
  sourceReferencesText,
}: Pick<Story, 'shasRefs' | 'shuRefs' | 'sourceReferencesText'>) {
  const hasAny = shasRefs.length > 0 || shuRefs.length > 0 || !!sourceReferencesText;
  if (!hasAny) return null;
  return (
    <div className="mt-6 pt-4 border-t border-border/50">
      <span className="text-xs text-muted-foreground font-hebrew font-medium">מקורות:</span>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {shasRefs.map((ref) => (
          <Badge key={`shas-${ref.shasPageId}`} variant="source-shas" icon={BookOpen}>
            {ref.shasPage.masechet.name} {toHebrewNumeral(ref.shasPage.daf)}
            {ref.shasPage.amud ? `, ${ref.shasPage.amud}` : ''}
          </Badge>
        ))}
        {shuRefs.map((ref) => (
          <Badge key={`shu-${ref.shuSimanId}-${ref.seif}`} variant="source-shu" icon={Scale}>
            {ref.shuSiman.section.name} סימן {toHebrewNumeral(ref.shuSiman.siman)}
            {ref.seif ? ` סע׳ ${toHebrewNumeral(ref.seif)}` : ''}
          </Badge>
        ))}
        {!!sourceReferencesText &&
          sourceReferencesText.split(';').map((src, i) => (
            <Badge key={`src-${i}`} variant="muted">
              {src.trim()}
            </Badge>
          ))}
      </div>
    </div>
  );
}

export function StoryPanels({
  story,
  book,
  expansionLocked = false,
  onRequestExpansionAccess,
}: StoryPanelsProps) {
  return (
    <>
      <MotionFadeIn trigger="mount" as="article">
        <GlassCard className="p-6 md:p-8 mb-6">
          <StoryBreadcrumb story={story} book={book} />
          <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-6">{story.title}</h1>
          <div className="overflow-hidden mb-8">
            {story.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.imageUrl}
                alt={story.title}
                className="float-left mr-6 mb-3 w-40 md:w-52 h-auto"
              />
            )}
            <h2 className="text-lg font-semibold font-hebrew mb-3 text-primary">הסיפור</h2>
            <p className="text-foreground leading-relaxed font-hebrew whitespace-pre-wrap">
              {story.storyBody}
            </p>
          </div>
          <div className="mb-8 p-4 rounded-xl bg-muted/50 border-r-4 border-primary">
            <h2 className="text-lg font-semibold font-hebrew mb-2">השאלה</h2>
            <p className="text-foreground font-hebrew">{story.legalQuestion}</p>
          </div>
          <StorySourcesList
            shasRefs={story.shasRefs}
            shuRefs={story.shuRefs}
            sourceReferencesText={story.sourceReferencesText}
          />
          {story.conceptsFromIndex.length > 0 && (
            <div className="mt-3 mb-6">
              <span className="text-xs text-muted-foreground font-hebrew font-medium">מושגים:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {story.conceptsFromIndex.map((concept, i) => (
                  <Badge key={`concept-${i}`} variant="concept">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {story.videoUrl && (
            <div className="mb-8">
              <br/>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  src={getYouTubeEmbedUrl(story.videoUrl)}
                  title={story.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </GlassCard>
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" delay={0.1} className="mb-4">
        <ExpandableAnswerPanel
          title="תשובה קצרה"
          content={story.shortAnswer}
          variant="shortAnswer"
          defaultExpanded={false}
        />
      </MotionFadeIn>

      {story.expansion !== null && (
        <MotionFadeIn trigger="mount" delay={0.2} className="mb-8">
          <ExpandableAnswerPanel
            title="הרחבה"
            content={story.expansion}
            variant="expansion"
            isLocked={expansionLocked}
            defaultExpanded={false}
            onRequestAccess={onRequestExpansionAccess}
          />
        </MotionFadeIn>
      )}
    </>
  );
}
