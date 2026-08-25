'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, UiShasRef, UiShuRef } from '@/lib/types';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { ShasSubFilters } from './shas-sub-filters';
import { ShulchanAruchSubFilters } from './shulchan-aruch-sub-filters';
import { FilterSectionHeader } from './filter-section-header';
import { FilterCheckList } from './filter-check-list';

export function CategoryFilterBar({
  masechtot, shuSections, topics, books,
  activeFilters, onFiltersChange, onSearch, className,
}: CategoryFilterBarProps & { onSearch?: () => void }) {
  const [openSections, setOpenSections] = useState(new Set(['book', 'topic']));

  const { q = '', bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = activeFilters;

  const handleQueryChange = (value: string) =>
    onFiltersChange({ ...activeFilters, q: value || undefined });

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
    onFiltersChange({ ...activeFilters, bookIds: next.length ? next : undefined, topicIds: validTopics.length ? validTopics : undefined });
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

  const handleShasRefChange = (idx: number, updated: UiShasRef) =>
    onFiltersChange({ ...activeFilters, shasRefs: shasRefs.map((ref, i) => (i === idx ? updated : ref)) });

  const handleShuRefChange = (idx: number, updated: UiShuRef) =>
    onFiltersChange({ ...activeFilters, shuRefs: shuRefs.map((ref, i) => (i === idx ? updated : ref)) });

  const bookOptions = books.map((b) => ({ value: b.id, label: b.name }));
  const topicOptions = (bookIds.length ? topics.filter((t) => bookIds.includes(t.bookId)) : topics)
    .map((t) => ({ value: t.id, label: t.name }));
  const hasActiveFilters = Boolean(q.trim()) || bookIds.length > 0 || topicIds.length > 0 || shasRefs.length > 0 || shuRefs.length > 0;

  return (
    <div className={cn('flex flex-col', className)} dir="rtl">
      {hasActiveFilters && (
        <div className="flex items-center justify-end pb-3">
          <button onClick={() => onFiltersChange({})} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew">
            <X className="w-3 h-3" />נקה הכל
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* לפי ספר/נושא */}
        <section className="min-w-0 md:col-span-2">
          <h3 className="text-sm font-semibold font-hebrew pb-2">לפי ספר/נושא</h3>
          <div className="h-px bg-border mb-1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <FilterSectionHeader label="ספר" count={bookIds.length} isOpen={openSections.has('book')} onToggle={() => toggle('book')} />
              {openSections.has('book') && <FilterCheckList options={bookOptions} selected={bookIds} onToggle={handleBookToggle} maxHeight="h-36" />}
            </div>
            <div className="min-w-0">
              <FilterSectionHeader label="נושא" count={topicIds.length} isOpen={openSections.has('topic')} onToggle={() => toggle('topic')} />
              {openSections.has('topic') && <FilterCheckList options={topicOptions} selected={topicIds} onToggle={handleTopicToggle} maxHeight="h-28" searchable />}
            </div>
          </div>
        </section>

        {/* לפי שולחן ערוך */}
        <section className="min-w-0">
          <h3 className="text-sm font-semibold font-hebrew pb-2">לפי שולחן ערוך</h3>
          <div className="h-px bg-border mb-3" />
          <div className="space-y-2">
            {shuRefs.map((ref, idx) => (
              <div key={ref.id} className="flex items-start gap-1">
                <ShulchanAruchSubFilters shuSections={shuSections} sourceRef={ref} onRefChange={(u) => handleShuRefChange(idx, u)} usedSimanim={shuRefs.filter((_, i) => i !== idx && _.shuSectionId && _.simanId).map((_) => ({ shuSectionId: _.shuSectionId!, simanId: _.simanId! }))} className="grid grid-cols-2 gap-1 flex-1" />
                <button onClick={() => handleRemoveShu(idx)} className="p-1.5 mt-0.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button onClick={handleAddShu} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew"><Plus className="w-3.5 h-3.5" />הוספת חלק</button>
          </div>
        </section>

        {/* לפי ש״ס */}
        <section className="min-w-0">
          <h3 className="text-sm font-semibold font-hebrew pb-2">לפי ש״ס</h3>
          <div className="h-px bg-border mb-3" />
          <div className="space-y-2">
            {shasRefs.map((ref, idx) => (
              <div key={ref.id} className="flex items-start gap-1">
                <ShasSubFilters masechtot={masechtot} sourceRef={ref} onRefChange={(u) => handleShasRefChange(idx, u)} usedDafs={shasRefs.filter((_, i) => i !== idx && _.masechetId && _.daf !== undefined).map((_) => ({ masechetId: _.masechetId!, daf: _.daf! }))} className="grid grid-cols-2 gap-1 flex-1" />
                <button onClick={() => handleRemoveShas(idx)} className="p-1.5 mt-0.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-accent shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button onClick={handleAddShas} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-hebrew"><Plus className="w-3.5 h-3.5" />הוספת מסכת</button>
          </div>
        </section>
      </div>

      {/* שדה חופשי */}
      <div className="h-px bg-border mt-2" />
      <div className="pt-3">
        <h3 className="text-sm font-semibold font-hebrew pb-2">שדה חופשי</h3>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
            placeholder="כתבו את השאלה שלכם"
            className="search-input w-full py-2 pr-10 pl-3 text-foreground placeholder:text-muted-foreground font-hebrew text-sm focus:outline-none"
            aria-label="חיפוש חופשי"
          />
        </div>
        <p className="text-xs font-hebrew text-muted-foreground text-right pt-2">
          חפשו באמצעות AI, מומלץ לכתוב שאלה מפורטת. עדיין בשלבי פיתוח כדי לדייק לכם כמה שיותר
        </p>
      </div>

      {onSearch && (
        <button onClick={onSearch} className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-hebrew font-medium hover:bg-primary/90 transition-colors">
          <Search className="w-4 h-4" />חיפוש
        </button>
      )}
    </div>
  );
}
