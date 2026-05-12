'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, CategoryType } from '@/lib/types';
import { X, BookOpen, Scale, Lightbulb, ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface FilterOption {
  value: string;
  label: string;
}

const CATEGORY_TYPES: { value: CategoryType; label: string; icon: React.ReactNode }[] = [
  { value: 'shas', label: 'ש"ס', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'shulchanAruch', label: 'שו"ע', icon: <Scale className="w-4 h-4" /> },
  { value: 'concepts', label: 'מושגים', icon: <Lightbulb className="w-4 h-4" /> },
];

const SUB_FILTER_LABELS: Record<CategoryType, string> = {
  shas: 'בחרו מסכת...',
  shulchanAruch: 'בחרו חלק...',
  concepts: 'בחרו מושג...',
};

export function CategoryFilterBar({
  masechtot,
  shuSections,
  concepts,
  activeFilters,
  onFiltersChange,
  className,
}: CategoryFilterBarProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const handleCategoryTypeChange = (type: CategoryType) => {
    if (type === activeFilters.categoryType) {
      onFiltersChange({ ...activeFilters, categoryType: undefined, masechetId: undefined, shuSectionId: undefined, concept: undefined });
    } else {
      onFiltersChange({ ...activeFilters, categoryType: type, masechetId: undefined, shuSectionId: undefined, concept: undefined });
    }
  };

  const handleClearAll = () => onFiltersChange({});

  const hasActiveFilters = activeFilters.categoryType || activeFilters.masechetId || activeFilters.shuSectionId || activeFilters.concept;

  const getSubFilterOptions = (): FilterOption[] => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return masechtot.map((m) => ({ value: m.id, label: m.name }));
      case 'shulchanAruch':
        return shuSections.map((s) => ({ value: s.id, label: s.name }));
      case 'concepts':
        return concepts.map((c) => ({ value: c, label: c }));
      default:
        return [];
    }
  };

  const getActiveSubFilterValue = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return activeFilters.masechetId;
      case 'shulchanAruch': return activeFilters.shuSectionId;
      case 'concepts': return activeFilters.concept;
      default: return undefined;
    }
  };

  const getActiveSubFilterLabel = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return masechtot.find((m) => m.id === activeFilters.masechetId)?.name;
      case 'shulchanAruch': return shuSections.find((s) => s.id === activeFilters.shuSectionId)?.name;
      case 'concepts': return activeFilters.concept;
      default: return undefined;
    }
  };

  const handleSubFilterSelect = (value: string) => {
    const current = getActiveSubFilterValue();
    const next = current === value ? undefined : value;
    switch (activeFilters.categoryType) {
      case 'shas':
        onFiltersChange({ ...activeFilters, masechetId: next });
        break;
      case 'shulchanAruch':
        onFiltersChange({ ...activeFilters, shuSectionId: next });
        break;
      case 'concepts':
        onFiltersChange({ ...activeFilters, concept: next });
        break;
    }
    setComboboxOpen(false);
  };

  const subFilterOptions = getSubFilterOptions();
  const activeSubFilterValue = getActiveSubFilterValue();
  const activeSubFilterLabel = getActiveSubFilterLabel();

  return (
    <div className={cn('space-y-3', className)} dir="rtl">
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => handleCategoryTypeChange(type.value)}
            className={cn(
              'filter-chip flex items-center gap-2',
              activeFilters.categoryType === type.value && 'active'
            )}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span>נקה הכל</span>
          </button>
        )}
      </div>

      {activeFilters.categoryType && subFilterOptions.length > 0 && (
        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={comboboxOpen}
              className="filter-chip flex items-center gap-2 min-w-[180px] justify-between"
            >
              <span className="truncate">
                {activeSubFilterLabel || SUB_FILTER_LABELS[activeFilters.categoryType]}
              </span>
              <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start" side="bottom">
            <Command dir="rtl">
              <CommandInput placeholder="חיפוש..." className="font-hebrew" />
              <CommandList className="max-h-[200px]">
                <CommandEmpty className="font-hebrew py-4 text-center text-sm text-muted-foreground">
                  לא נמצאו תוצאות
                </CommandEmpty>
                <CommandGroup>
                  {subFilterOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSubFilterSelect(option.value)}
                      className="font-hebrew flex items-center gap-2 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'w-4 h-4 shrink-0',
                          activeSubFilterValue === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
