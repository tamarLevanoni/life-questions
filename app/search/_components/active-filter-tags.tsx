'use client';

import { Badge } from '@/components/ui/badge';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { UiSearchFilters } from '@/lib/types';
import type { Book, Topic, MasechetWithPages, ShuSectionWithSimanim } from '@/lib/schemas';

interface ActiveFilterTagsProps {
  filters: UiSearchFilters;
  books: Book[];
  topics: Topic[];
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
}

interface FilterTag {
  key: string;
  label: string;
}

export function ActiveFilterTags({
  filters,
  books,
  topics,
  masechtot,
  shuSections,
}: ActiveFilterTagsProps) {
  const { q = '', bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = filters;
  const tags: FilterTag[] = [];

  if (q.trim()) {
    tags.push({ key: 'query', label: q.trim() });
  }

  bookIds.forEach((id) => {
    const name = books.find((b) => b.id === id)?.name ?? id;
    tags.push({ key: `book-${id}`, label: name });
  });

  topicIds.forEach((id) => {
    const name = topics.find((t) => t.id === id)?.name ?? id;
    tags.push({ key: `topic-${id}`, label: name });
  });

  shasRefs.filter((r) => r.masechetId).forEach((ref) => {
    const masechet = masechtot.find((m) => m.id === ref.masechetId);
    const label = masechet
      ? ref.daf ? `${masechet.name} דף ${toHebrewNumeral(ref.daf)}` : masechet.name
      : ref.masechetId!;
    tags.push({ key: `shas-${ref.id}`, label });
  });

  shuRefs.filter((r) => r.shuSectionId).forEach((ref) => {
    const section = shuSections.find((s) => s.id === ref.shuSectionId);
    const siman = ref.simanId ? section?.simanim.find((si) => si.id === ref.simanId) : undefined;
    const label = section
      ? siman ? `${section.name} ${toHebrewNumeral(siman.siman)}` : section.name
      : ref.shuSectionId!;
    tags.push({ key: `shu-${ref.id}`, label });
  });

  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap" dir="rtl">
      <span className="text-xs text-muted-foreground font-hebrew shrink-0">מחפש בתוך:</span>
      {tags.map((tag) => (
        <Badge key={tag.key} variant="primary">
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}
