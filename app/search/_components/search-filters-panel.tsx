'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { FormField } from '@/components/ui/form-field';
import { ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryFilterBar } from './category-filter-bar';
import type { UseSearchReturn } from './use-search';

interface SearchFiltersPanelProps {
  search: UseSearchReturn;
  isOpen: boolean;
  onToggle: () => void;
  onSearch: () => void;
}

export function SearchFiltersPanel({ search, isOpen, onToggle, onSearch }: SearchFiltersPanelProps) {
  return (
    <GlassCard variant="light" className="p-4 w-full space-y-4">
      <FormField label={<span className="text-sm font-semibold text-foreground">חיפוש חופשי</span>}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search.filters.q ?? ''}
            onChange={(e) => search.setFilters({ ...search.filters, q: e.target.value || undefined })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="כתבו את השאלה שלכם"
            className="search-input w-full py-2 pr-10 pl-3 text-foreground placeholder:text-muted-foreground font-hebrew text-sm focus:outline-none"
            aria-label="חיפוש חופשי"
            aria-describedby="free-search-hint"
          />
        </div>
        <p id="free-search-hint" className="text-xs font-hebrew text-muted-foreground text-right pt-2">
          חפשו באמצעות AI, מומלץ לכתוב שאלה מפורטת. עדיין בשלבי פיתוח כדי לדייק לכם כמה שיותר
        </p>
      </FormField>
      <div className="border-y border-border py-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="search-category-filters"
          className="flex items-center justify-between w-full font-hebrew"
          dir="rtl"
        >
          <span className="flex items-center gap-2 text-base font-semibold">
            <SlidersHorizontal className="w-4 h-4" />
            חיפוש לפי קטגוריות
            {search.activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 leading-none">
                {search.activeFiltersCount}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {isOpen ? 'צמצום' : 'הרחבה'}
            <ChevronUp className={cn('w-4 h-4 transition-transform duration-200', !isOpen && 'rotate-180')} />
          </span>
        </button>
        {isOpen && (
          <div id="search-category-filters" className="pt-4" dir="rtl">
            <CategoryFilterBar
              masechtot={search.masechtot}
              shuSections={search.shuSections}
              topics={search.topics}
              books={search.books}
              activeFilters={search.filters}
              onFiltersChange={search.setFilters}
            />
          </div>
        )}
      </div>
      <button type="button" onClick={onSearch} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-hebrew font-medium hover:bg-primary/90 transition-colors">
        <Search className="w-4 h-4" />חיפוש
      </button>
    </GlassCard>
  );
}
