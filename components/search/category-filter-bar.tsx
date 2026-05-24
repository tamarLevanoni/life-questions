'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, UiShasRef, UiShuRef } from '@/lib/types';
import { X, Plus, Trash2, ChevronUp, Search, Square, CheckSquare } from 'lucide-react';
import { SearchCombobox } from './search-combobox';
import { ShasSubFilters, ShulchanAruchSubFilters } from './category-sub-filters';

function SectionHeader({
  label, count, isOpen, onToggle,
}: {
  label: string; count: number; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-sm font-medium font-hebrew"
    >
      <span className="flex items-center gap-2">
        {label}
        {count > 0 && (
          <span className="text-[10px] bg-primary text-primary-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {count}
          </span>
        )}
      </span>
      <ChevronUp className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', !isOpen && 'rotate-180')} />
    </button>
  );
}

function CheckList({
  options, selected, onToggle, maxHeight = 'max-h-48', searchable = false,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  maxHeight?: string;
  searchable?: boolean;
}) {
  const [search, setSearch] = useState('');
  const filtered = search ? options.filter((o) => o.label.includes(search)) : options;

  return (
    <div className="flex flex-col gap-0.5">
      {searchable && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש..."
          className="w-full px-2 py-1.5 mb-1 text-xs font-hebrew bg-muted/40 border border-border rounded-md outline-none placeholder:text-muted-foreground"
        />
      )}
      <div className={cn('overflow-y-auto', maxHeight)}>
        {filtered.map((opt) => {
          const isChecked = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => onToggle(opt.value)}
              className="flex items-center gap-2 w-full px-1 py-1.5 rounded-md text-sm font-hebrew text-right hover:bg-accent transition-colors"
            >
              {isChecked
                ? <CheckSquare className="w-4 h-4 shrink-0 text-primary" />
                : <Square className="w-4 h-4 shrink-0 text-muted-foreground/40" />
              }
              <span className={cn('truncate', isChecked && 'text-primary font-medium')}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryFilterBar({
  masechtot, shuSections, topics, books,
  activeFilters, onFiltersChange, onSearch, className,
}: CategoryFilterBarProps & { onSearch?: () => void }) {
  const [openSections, setOpenSections] = useState(new Set(['book', 'topic', 'shas', 'shu']));

  const { bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = activeFilters;

  const toggle = (key: string) => setOpenSections((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

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

  const hasActiveFilters = bookIds.length > 0 || topicIds.length > 0 || shasRefs.length > 0 || shuRefs.length > 0;

  const divider = <div className="h-px bg-border" />;

  return (
    <div className={cn('flex flex-col', className)} dir="rtl">
      {/* כותרת */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-sm font-semibold font-hebrew">סנן לפי</span>
        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange({})}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew"
          >
            <X className="w-3 h-3" />
            נקה הכל
          </button>
        )}
      </div>

      {divider}

      {/* ספר */}
      <SectionHeader label="ספר" count={bookIds.length} isOpen={openSections.has('book')} onToggle={() => toggle('book')} />
      {openSections.has('book') && (
        <div className="pb-3">
          <CheckList
            options={bookOptions}
            selected={bookIds}
            onToggle={handleBookToggle}
            maxHeight="max-h-56"
          />
        </div>
      )}

      {divider}

      {/* נושא */}
      <SectionHeader label="נושא" count={topicIds.length} isOpen={openSections.has('topic')} onToggle={() => toggle('topic')} />
      {openSections.has('topic') && (
        <div className="pb-3">
          <CheckList
            options={topicOptions}
            selected={topicIds}
            onToggle={handleTopicToggle}
            maxHeight="max-h-48"
            searchable
          />
        </div>
      )}

      {divider}

      {/* שו"ע */}
      <SectionHeader label='שולחן ערוך' count={shuRefs.filter(r => r.shuSectionId).length} isOpen={openSections.has('shu')} onToggle={() => toggle('shu')} />
      {openSections.has('shu') && (
        <div className="pb-3 space-y-2">
          {shuRefs.map((ref, idx) => (
            <div key={ref.id} className="flex items-start gap-1">
              <ShulchanAruchSubFilters
                shuSections={shuSections}
                sourceRef={ref}
                onRefChange={(updated) => handleShuRefChange(idx, updated)}
                usedSimanim={shuRefs
                  .filter((_, i) => i !== idx && _.shuSectionId && _.simanId)
                  .map((_) => ({ shuSectionId: _.shuSectionId!, simanId: _.simanId! }))}
                className="grid grid-cols-2 gap-1 flex-1"
              />
              <button
                onClick={() => handleRemoveShu(idx)}
                className="p-1.5 mt-0.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddShu}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew"
          >
            <Plus className="w-3.5 h-3.5" />
            הוספת חלק
          </button>
        </div>
      )}

      {divider}

      {/* ש"ס */}
      <SectionHeader label='ש"ס' count={shasRefs.filter(r => r.masechetId).length} isOpen={openSections.has('shas')} onToggle={() => toggle('shas')} />
      {openSections.has('shas') && (
        <div className="pb-3 space-y-2">
          {shasRefs.map((ref, idx) => (
            <div key={ref.id} className="flex items-start gap-1">
              <ShasSubFilters
                masechtot={masechtot}
                sourceRef={ref}
                onRefChange={(updated) => handleShasRefChange(idx, updated)}
                usedDafs={shasRefs
                  .filter((_, i) => i !== idx && _.masechetId && _.daf !== undefined)
                  .map((_) => ({ masechetId: _.masechetId!, daf: _.daf! }))}
                className="grid grid-cols-2 gap-1 flex-1"
              />
              <button
                onClick={() => handleRemoveShas(idx)}
                className="p-1.5 mt-0.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddShas}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew"
          >
            <Plus className="w-3.5 h-3.5" />
            הוספת מסכת
          </button>
        </div>
      )}

      {divider}

      {/* כפתור חיפוש */}
      {onSearch && (
        <button
          onClick={onSearch}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-hebrew font-medium hover:bg-primary/90 transition-colors"
        >
          <Search className="w-4 h-4" />
          חיפוש
        </button>
      )}
    </div>
  );
}
