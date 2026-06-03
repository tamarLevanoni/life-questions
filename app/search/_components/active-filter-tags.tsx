'use client';

import { Badge } from '@/components/ui/badge';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { UiSearchFilters } from '@/lib/types';
import type { Book, Topic, MasechetWithPages, ShuSectionWithSimanim } from '@/lib/schemas';

interface ActiveFilterTagsProps {
  filters: UiSearchFilters;
  onFiltersChange: (f: UiSearchFilters) => void;
  books: Book[];
  topics: Topic[];
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
}

interface FilterTag {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilterTags({
  filters,
  onFiltersChange,
  books,
  topics,
  masechtot,
  shuSections,
}: ActiveFilterTagsProps) {
  const { bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = filters;
  const tags: FilterTag[] = [];

  bookIds.forEach((id) => {
    const name = books.find((b) => b.id === id)?.name ?? id;
    tags.push({
      key: `book-${id}`,
      label: name,
      onRemove: () => {
        const next = bookIds.filter((x) => x !== id);
        const validTopics = topicIds.filter(
          (tid) => topics.find((t) => t.id === tid && next.includes(t.bookId))
        );
        onFiltersChange({
          ...filters,
          bookIds: next.length ? next : undefined,
          topicIds: validTopics.length ? validTopics : undefined,
        });
      },
    });
  });

  topicIds.forEach((id) => {
    const name = topics.find((t) => t.id === id)?.name ?? id;
    tags.push({
      key: `topic-${id}`,
      label: name,
      onRemove: () => {
        const next = topicIds.filter((x) => x !== id);
        onFiltersChange({ ...filters, topicIds: next.length ? next : undefined });
      },
    });
  });

  shasRefs.filter((r) => r.masechetId).forEach((ref) => {
    const masechet = masechtot.find((m) => m.id === ref.masechetId);
    const label = masechet
      ? ref.daf ? `${masechet.name} דף ${toHebrewNumeral(ref.daf)}` : masechet.name
      : ref.masechetId!;
    tags.push({
      key: `shas-${ref.id}`,
      label,
      onRemove: () => {
        const next = shasRefs.filter((r2) => r2.id !== ref.id);
        onFiltersChange({ ...filters, shasRefs: next.length ? next : undefined });
      },
    });
  });

  shuRefs.filter((r) => r.shuSectionId).forEach((ref) => {
    const section = shuSections.find((s) => s.id === ref.shuSectionId);
    const siman = ref.simanId ? section?.simanim.find((si) => si.id === ref.simanId) : undefined;
    const label = section
      ? siman ? `${section.name} ${toHebrewNumeral(siman.siman)}` : section.name
      : ref.shuSectionId!;
    tags.push({
      key: `shu-${ref.id}`,
      label,
      onRemove: () => {
        const next = shuRefs.filter((r2) => r2.id !== ref.id);
        onFiltersChange({ ...filters, shuRefs: next.length ? next : undefined });
      },
    });
  });

  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap" dir="rtl">
      <span className="text-xs text-muted-foreground font-hebrew shrink-0">מחפש בתוך:</span>
      {tags.map((tag) => (
        <Badge key={tag.key} variant="primary" onRemove={tag.onRemove}>
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}
