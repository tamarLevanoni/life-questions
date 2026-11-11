'use client';

import { useLayoutEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { UiSearchFilters } from '@/lib/types';
import type { Book, Topic, MasechetWithPages, ShuSectionWithSimanim } from '@/lib/schemas';
import type { SearchFilter } from './search-filter-utils';

interface ActiveFilterTagsProps {
  filters: UiSearchFilters;
  books: Book[];
  topics: Topic[];
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  onRemove: (filter: SearchFilter) => void;
  onClear: () => void;
  onEmpty: () => void;
}

interface FilterTag {
  key: string;
  filter: SearchFilter;
  label: string;
}

export function ActiveFilterTags({ filters, books, topics, masechtot, shuSections, onRemove, onClear, onEmpty }: ActiveFilterTagsProps) {
  const pendingRemoval = useRef<{ index: number; container: HTMLElement } | null>(null);
  const { q = '', bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = filters;
  const tags: FilterTag[] = [];
  const addTag = (filter: SearchFilter, label: string) => {
    const key = filter.type === 'query' ? 'query' : filter.type + '-' + filter.id;
    tags.push({ key, filter, label });
  };

  if (q.trim()) addTag({ type: 'query' }, q.trim());
  bookIds.forEach((id) => {
    addTag({ type: 'book', id }, books.find((book) => book.id === id)?.name ?? id);
  });
  topicIds.forEach((id) => {
    addTag({ type: 'topic', id }, topics.find((topic) => topic.id === id)?.name ?? id);
  });
  shasRefs.forEach((ref) => {
    if (!ref.masechetId) return;
    const name = masechtot.find((item) => item.id === ref.masechetId)?.name ?? ref.masechetId;
    const page = ref.daf ? ' דף ' + toHebrewNumeral(ref.daf) : '';
    addTag({ type: 'shas', id: ref.id }, 'ש״ס: ' + name + page);
  });
  shuRefs.forEach((ref) => {
    if (!ref.shuSectionId) return;
    const section = shuSections.find((item) => item.id === ref.shuSectionId);
    const siman = section?.simanim.find((item) => item.id === ref.simanId);
    const simanLabel = siman ? ' סימן ' + toHebrewNumeral(siman.siman) : '';
    const seifLabel = ref.seif ? ' סעיף ' + toHebrewNumeral(ref.seif) : '';
    addTag({ type: 'shu', id: ref.id }, 'שו״ע: ' + (section?.name ?? ref.shuSectionId) + simanLabel + seifLabel);
  });

  useLayoutEffect(() => {
    const pending = pendingRemoval.current;
    if (!pending) return;
    pendingRemoval.current = null;
    if (!tags.length) {
      onEmpty();
      return;
    }
    // Resolve after rendering: removing a book may also remove its topic tags.
    const buttons = pending.container.querySelectorAll<HTMLButtonElement>('[data-remove-filter]');
    const target = buttons[Math.min(pending.index, buttons.length - 1)];
    target?.focus({ preventScroll: true });
  });

  if (!tags.length) return null;

  return (
    <div data-filter-tags aria-label="מסננים פעילים" className="flex flex-nowrap items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm md:px-5">
      <span className="flex shrink-0 items-center gap-2 text-xs font-semibold">
        <span className="hidden md:inline">מסננים פעילים</span>
        <span className="rounded-full bg-primary/10 px-1.5 text-primary">{tags.length}</span>
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-x-1 overflow-x-auto overscroll-x-contain">
        {tags.map((tag, index) => (
          <Badge key={tag.key} variant="outline" className="my-0.5 max-w-64 shrink-0 gap-1 rounded-full border-border bg-background/50 ps-3 pe-0 text-xs font-normal text-foreground shadow-xs">
            <span title={tag.label} className="min-w-0 truncate">{tag.label}</span>
            <Button
              data-remove-filter
              type="button" variant="ghost" aria-label={'הסרת מסנן ' + tag.label}
              className="h-8 rounded-full px-2 text-[11px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={(event) => {
                const container = event.currentTarget.closest<HTMLElement>('[data-filter-tags]');
                if (container) pendingRemoval.current = { index, container };
                onRemove(tag.filter);
              }}
            >
              הסר
            </Button>
          </Badge>
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={onClear} className="h-8 rounded-xl text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
        נקה הכל
      </Button>
    </div>
  );
}
