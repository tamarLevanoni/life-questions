'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, CategoryType } from '@/lib/types';
import { X, BookOpen, Scale, Lightbulb, ChevronsUpDown, Check, Library } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchCombobox } from './search-combobox';
import { ShasSubFilters, ShulchanAruchSubFilters, ConceptsSubFilters } from './category-sub-filters';

const CATEGORY_TYPES: { value: CategoryType; label: string; icon: React.ReactNode }[] = [
  { value: 'shas', label: 'ש"ס', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'shulchanAruch', label: 'שו"ע', icon: <Scale className="w-4 h-4" /> },
  { value: 'concepts', label: 'מושגים', icon: <Lightbulb className="w-4 h-4" /> },
];

export function CategoryFilterBar({
  masechtot, shuSections, topics, books,
  activeFilters, onFiltersChange, className,
}: CategoryFilterBarProps) {
  const [bookOpen, setBookOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { categoryType, bookId } = activeFilters;

  const handleBookSelect = (id: string) => {
    if (id === bookId) {
      onFiltersChange({ ...activeFilters, bookId: undefined, topicId: undefined });
    } else {
      const topicStillValid = topics.find((t) => t.id === activeFilters.topicId)?.bookId === id;
      onFiltersChange({ ...activeFilters, bookId: id, topicId: topicStillValid ? activeFilters.topicId : undefined });
    }
    setBookOpen(false);
  };

  const handleCategoryTypeChange = (type: CategoryType) => {
    onFiltersChange({ bookId, categoryType: type === categoryType ? undefined : type });
    setCategoryOpen(false);
  };

  const bookOptions = books.map((b) => ({ value: b.id, label: b.name }));
  const activeBookLabel = bookOptions.find((o) => o.value === bookId)?.label;
  const activeCategoryType = CATEGORY_TYPES.find((t) => t.value === categoryType);
  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== undefined);

  return (
    <div className={cn('space-y-3', className)} dir="rtl">
      {/* שורה 1 — ספר | קטגוריה + נקה הכל */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchCombobox
          open={bookOpen} onOpenChange={setBookOpen}
          label={activeBookLabel ?? 'בחרו ספר...'} icon={<Library className="w-4 h-4 shrink-0" />}
          minWidth={200} activeValue={bookId}
          onClear={() => onFiltersChange({ ...activeFilters, bookId: undefined, topicId: undefined })}
          options={bookOptions} onSelect={handleBookSelect}
          placeholder="חיפוש ספר..." popoverWidth="w-[260px]"
        />

        <div className="h-6 w-px bg-border shrink-0" />

        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <button role="combobox" aria-expanded={categoryOpen}
              className={cn('filter-chip flex items-center gap-2 min-w-[160px] justify-between', categoryType && 'active')}
            >
              <span className="flex items-center gap-2 truncate">
                {activeCategoryType?.icon}
                <span className="truncate">{activeCategoryType?.label ?? 'בחרו קטגוריה...'}</span>
              </span>
              {categoryType ? (
                <X className="w-3.5 h-3.5 shrink-0 opacity-50 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onFiltersChange({ bookId }); }} />
              ) : (
                <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-1" align="start" side="bottom">
            <div dir="rtl" className="flex flex-col gap-0.5">
              {CATEGORY_TYPES.map((type) => (
                <button key={type.value} onClick={() => handleCategoryTypeChange(type.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full transition-colors hover:bg-accent',
                    categoryType === type.value && 'bg-accent font-medium'
                  )}
                >
                  <Check className={cn('w-4 h-4 shrink-0', categoryType === type.value ? 'opacity-100' : 'opacity-0')} />
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <button onClick={() => onFiltersChange({})}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span>נקה הכל</span>
          </button>
        )}
      </div>

      {/* שורה 2 — תתי חיפוש לפי קטגוריה */}
      {categoryType && (
        <div className="flex items-center gap-2 flex-wrap">
          {categoryType === 'shas' && (
            <ShasSubFilters masechtot={masechtot} activeFilters={activeFilters} onFiltersChange={onFiltersChange} />
          )}
          {categoryType === 'shulchanAruch' && (
            <ShulchanAruchSubFilters shuSections={shuSections} activeFilters={activeFilters} onFiltersChange={onFiltersChange} />
          )}
          {categoryType === 'concepts' && (
            <ConceptsSubFilters topics={topics} bookId={bookId} activeFilters={activeFilters} onFiltersChange={onFiltersChange} />
          )}
        </div>
      )}
    </div>
  );
}
