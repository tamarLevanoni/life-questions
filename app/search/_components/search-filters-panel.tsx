'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { ChevronUp, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryFilterBar } from './category-filter-bar';
import type { UseSearchReturn } from './use-search';

interface SearchFiltersPanelProps {
  search: UseSearchReturn;
  isOpen: boolean;
  onToggle: () => void;
}

export function SearchFiltersPanel({ search, isOpen, onToggle }: SearchFiltersPanelProps) {
  return (
    <GlassCard variant="light" className="p-4 w-full md:w-72 shrink-0 md:sticky md:top-24">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full font-hebrew md:hidden"
        dir="rtl"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
          סינון
          {search.activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 leading-none">
              {search.activeFiltersCount}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {isOpen ? 'הסתר סינון' : 'הצג סינון'}
          <ChevronUp className={cn('w-4 h-4 transition-transform duration-200', !isOpen && 'rotate-180')} />
        </span>
      </button>
      {isOpen && (
        <div className="pt-3 md:pt-0" dir="rtl">
          <CategoryFilterBar
            masechtot={search.masechtot}
            shuSections={search.shuSections}
            topics={search.topics}
            books={search.books}
            activeFilters={search.filters}
            onFiltersChange={search.setFilters}
            onSearch={search.handleSearch}
          />
        </div>
      )}
    </GlassCard>
  );
}
