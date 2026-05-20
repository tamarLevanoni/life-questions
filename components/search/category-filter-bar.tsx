'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, UiSourceRef } from '@/lib/types';
import { X, ChevronsUpDown, Check, Library, Lightbulb, Plus, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchCombobox } from './search-combobox';
import { ShasSubFilters, ShulchanAruchSubFilters } from './category-sub-filters';

const SOURCE_TYPES: { value: 'shas' | 'shulchanAruch'; label: string }[] = [
  { value: 'shas', label: 'ש"ס' },
  { value: 'shulchanAruch', label: 'שו"ע' },
];

export function CategoryFilterBar({
  masechtot, shuSections, topics, books,
  activeFilters, onFiltersChange, className,
}: CategoryFilterBarProps) {
  const [bookOpen, setBookOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [sourceTypeOpen, setSourceTypeOpen] = useState<Record<string, boolean>>({});

  const { bookIds = [], topicIds = [], sourceRefs = [] } = activeFilters;

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

  const handleAddSource = () => {
    const newRef: UiSourceRef = { id: crypto.randomUUID(), type: 'shas' };
    onFiltersChange({ ...activeFilters, sourceRefs: [...sourceRefs, newRef] });
  };

  const handleRemoveSource = (idx: number) => {
    const next = sourceRefs.filter((_, i) => i !== idx);
    onFiltersChange({ ...activeFilters, sourceRefs: next.length ? next : undefined });
  };

  const handleSourceTypeChange = (idx: number, type: 'shas' | 'shulchanAruch') => {
    const next = sourceRefs.map((ref, i) => i === idx ? { id: ref.id, type } : ref);
    onFiltersChange({ ...activeFilters, sourceRefs: next });
    setSourceTypeOpen((prev) => ({ ...prev, [sourceRefs[idx].id]: false }));
  };

  const handleSourceRefChange = (idx: number, updated: UiSourceRef) => {
    const next = sourceRefs.map((ref, i) => i === idx ? updated : ref);
    onFiltersChange({ ...activeFilters, sourceRefs: next });
  };

  const bookOptions = books.map((b) => ({ value: b.id, label: b.name }));
  const topicOptions = (bookIds.length
    ? topics.filter((t) => bookIds.includes(t.bookId))
    : topics
  ).map((t) => ({ value: t.id, label: t.name }));

  const hasActiveFilters =
    bookIds.length > 0 || topicIds.length > 0 || sourceRefs.length > 0;

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

      {/* שורות מקורות */}
      <div className="space-y-2">
        {sourceRefs.map((ref, idx) => (
          <div key={ref.id} className="flex items-center gap-2 flex-wrap">
            {/* בורר סוג מקור לשורה זו */}
            <Popover
              open={sourceTypeOpen[ref.id] ?? false}
              onOpenChange={(v) => setSourceTypeOpen((prev) => ({ ...prev, [ref.id]: v }))}
            >
              <div className="relative">
                <span className="absolute top-0 right-3 -translate-y-1/2 px-1 bg-background text-[10px] font-medium text-muted-foreground font-hebrew z-10 pointer-events-none">
                  מקור
                </span>
                <PopoverTrigger asChild>
                  <button
                    role="combobox"
                    className="filter-chip flex items-center justify-between gap-3 min-w-[120px]"
                  >
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-hebrew font-medium rounded-full px-2 py-0.5">
                      {SOURCE_TYPES.find((t) => t.value === ref.type)?.label}
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="w-px h-4 bg-border/60" />
                      <ChevronsUpDown className="w-4 h-4 opacity-40" />
                    </span>
                  </button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-[140px] p-1" align="end" side="bottom">
                <div dir="rtl" className="flex flex-col gap-0.5">
                  {SOURCE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleSourceTypeChange(idx, type.value)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full transition-colors hover:bg-accent',
                        ref.type === type.value && 'bg-accent font-medium'
                      )}
                    >
                      <Check className={cn('w-4 h-4 shrink-0', ref.type === type.value ? 'opacity-100' : 'opacity-0')} />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {ref.type === 'shas' && (
              <ShasSubFilters
                masechtot={masechtot}
                sourceRef={ref}
                onRefChange={(updated) => handleSourceRefChange(idx, updated)}
              />
            )}
            {ref.type === 'shulchanAruch' && (
              <ShulchanAruchSubFilters
                shuSections={shuSections}
                sourceRef={ref}
                onRefChange={(updated) => handleSourceRefChange(idx, updated)}
              />
            )}

            <button
              onClick={() => handleRemoveSource(idx)}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent"
              aria-label="הסר מקור"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* כפתור הוספת מקור */}
        <button
          onClick={handleAddSource}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg transition-colors font-hebrew"
        >
          <Plus className="w-4 h-4" />
          הוספת מקור
        </button>
      </div>
    </div>
  );
}
