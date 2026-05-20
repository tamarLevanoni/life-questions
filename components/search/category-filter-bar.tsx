'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, UiShasRef, UiShuRef } from '@/lib/types';
import { X, Library, Lightbulb, Plus, Trash2 } from 'lucide-react';
import { SearchCombobox } from './search-combobox';
import { ShasSubFilters, ShulchanAruchSubFilters } from './category-sub-filters';

export function CategoryFilterBar({
  masechtot, shuSections, topics, books,
  activeFilters, onFiltersChange, className,
}: CategoryFilterBarProps) {
  const [bookOpen, setBookOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);

  const { bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = activeFilters;

  const handleBookToggle = (id: string) => {
    const next = bookIds.includes(id) ? bookIds.filter((x) => x !== id) : [...bookIds, id];
    const validTopics = topicIds.filter(
      (tid) => topics.find((t) => t.id === tid && next.includes(t.bookId))
    );
    onFiltersChange({
      ...activeFilters,
      bookIds: next.length ? next : undefined,
      topicIds: validTopics.length ? validTopics : undefined,
    });
  };

  const handleTopicToggle = (id: string) => {
    const next = topicIds.includes(id) ? topicIds.filter((x) => x !== id) : [...topicIds, id];
    onFiltersChange({ ...activeFilters, topicIds: next.length ? next : undefined });
  };

  const handleAddShas = () => {
    const newRef: UiShasRef = { id: crypto.randomUUID() };
    onFiltersChange({ ...activeFilters, shasRefs: [...shasRefs, newRef] });
  };

  const handleAddShu = () => {
    const newRef: UiShuRef = { id: crypto.randomUUID() };
    onFiltersChange({ ...activeFilters, shuRefs: [...shuRefs, newRef] });
  };

  const handleRemoveShas = (idx: number) => {
    const next = shasRefs.filter((_, i) => i !== idx);
    onFiltersChange({ ...activeFilters, shasRefs: next.length ? next : undefined });
  };

  const handleRemoveShu = (idx: number) => {
    const next = shuRefs.filter((_, i) => i !== idx);
    onFiltersChange({ ...activeFilters, shuRefs: next.length ? next : undefined });
  };

  const handleShasRefChange = (idx: number, updated: UiShasRef) => {
    const next = shasRefs.map((ref, i) => i === idx ? updated : ref);
    onFiltersChange({ ...activeFilters, shasRefs: next });
  };

  const handleShuRefChange = (idx: number, updated: UiShuRef) => {
    const next = shuRefs.map((ref, i) => i === idx ? updated : ref);
    onFiltersChange({ ...activeFilters, shuRefs: next });
  };

  const bookOptions = books.map((b) => ({ value: b.id, label: b.name }));
  const topicOptions = (bookIds.length
    ? topics.filter((t) => bookIds.includes(t.bookId))
    : topics
  ).map((t) => ({ value: t.id, label: t.name }));

  const hasActiveFilters =
    bookIds.length > 0 || topicIds.length > 0 || shasRefs.length > 0 || shuRefs.length > 0;

  return (
    <div className={cn('space-y-3', className)} dir="rtl">
      {/* שורה 1 — ספר | נושא | נקה הכל */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchCombobox
          open={bookOpen} onOpenChange={setBookOpen}
          fieldLabel="ספר"
          label={bookIds.length > 1 ? `${bookIds.length} ספרים` : 'בחרו ספר...'}
          icon={<Library className="w-4 h-4 shrink-0" />}
          minWidth={200}
          activeValues={bookIds}
          onClear={() => onFiltersChange({ ...activeFilters, bookIds: undefined, topicIds: undefined })}
          options={bookOptions}
          onSelectMulti={handleBookToggle}
          placeholder="חיפוש ספר..." popoverWidth="w-[260px]" searchable={false}
        />

        <div className="h-6 w-px bg-border shrink-0" />

        <SearchCombobox
          open={topicOpen} onOpenChange={setTopicOpen}
          fieldLabel="נושא"
          label={topicIds.length > 1 ? `${topicIds.length} נושאים` : 'בחרו נושא...'}
          icon={<Lightbulb className="w-4 h-4 shrink-0" />}
          minWidth={180}
          activeValues={topicIds}
          onClear={() => onFiltersChange({ ...activeFilters, topicIds: undefined })}
          options={topicOptions}
          onSelectMulti={handleTopicToggle}
          placeholder="חיפוש נושא..." popoverWidth="w-[240px]"
        />

        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange({})}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span>נקה הכל</span>
          </button>
        )}
      </div>

      {/* שורות ש"ס */}
      {shasRefs.map((ref, idx) => (
        <div key={ref.id} className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-hebrew font-medium text-muted-foreground min-w-[28px]">ש"ס</span>
          <ShasSubFilters
            masechtot={masechtot}
            sourceRef={ref}
            onRefChange={(updated) => handleShasRefChange(idx, updated)}
          />
          <button
            onClick={() => handleRemoveShas(idx)}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent"
            aria-label="הסר מקור"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* שורות שו"ע */}
      {shuRefs.map((ref, idx) => (
        <div key={ref.id} className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-hebrew font-medium text-muted-foreground min-w-[28px]">שו"ע</span>
          <ShulchanAruchSubFilters
            shuSections={shuSections}
            sourceRef={ref}
            onRefChange={(updated) => handleShuRefChange(idx, updated)}
          />
          <button
            onClick={() => handleRemoveShu(idx)}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent"
            aria-label="הסר מקור"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* כפתורי הוספת מקור */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleAddShas}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg transition-colors font-hebrew"
        >
          <Plus className="w-4 h-4" />
          הוספת ש"ס
        </button>
        <button
          onClick={handleAddShu}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg transition-colors font-hebrew"
        >
          <Plus className="w-4 h-4" />
          הוספת שו"ע
        </button>
      </div>
    </div>
  );
}
