import { BookOpen, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { StoryWithNeighbors } from '@/lib/types';

type StoryRefs = Pick<StoryWithNeighbors, 'shasRefs' | 'shuRefs' | 'sourceReferencesText'>;

export function StorySourcesList({ shasRefs, shuRefs, sourceReferencesText }: StoryRefs) {
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
