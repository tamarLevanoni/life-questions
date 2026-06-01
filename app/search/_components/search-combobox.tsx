'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchComboboxList } from './search-combobox-list';

export interface FilterOption { value: string; label: string }

export function SearchCombobox({
  open, onOpenChange, fieldLabel, label, icon, minWidth = 180,
  activeValue, activeValues, onClear, options, onSelect, onSelectMulti,
  placeholder, popoverWidth, searchable = true, externalChips = false,
  fullWidth = false,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  fieldLabel?: string; label: string; icon?: React.ReactNode; minWidth?: number;
  activeValue?: string; activeValues?: string[];
  onClear: () => void;
  options: FilterOption[]; onSelect?: (value: string) => void; onSelectMulti?: (value: string) => void;
  placeholder: string; popoverWidth: string; searchable?: boolean;
  externalChips?: boolean; fullWidth?: boolean;
}) {
  const [search, setSearch] = useState('');

  const isMulti = activeValues !== undefined;
  const showChipsInside = isMulti && !externalChips && activeValues && activeValues.length > 0;

  const handleOpenChange = (v: boolean) => {
    if (!v) setSearch('');
    onOpenChange(v);
  };

  const handleSelect = (value: string) => {
    if (isMulti) { onSelectMulti?.(value); }
    else { onSelect?.(value); setSearch(''); }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className="relative">
        {fieldLabel && (
          <span className="absolute top-0 right-3 -translate-y-1/2 px-1 bg-background text-[10px] font-medium text-muted-foreground font-hebrew z-10 pointer-events-none">
            {fieldLabel}
          </span>
        )}
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            className={cn('filter-chip flex items-center justify-between gap-3', fullWidth && 'w-full')}
            style={fullWidth ? undefined : { minWidth, maxWidth: showChipsInside ? 260 : undefined }}
          >
            <span className="flex items-center gap-2 min-w-0 flex-1">
              {icon}
              {showChipsInside ? (
                <span className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {activeValues!.map((v) => {
                    const lbl = options.find((o) => o.value === v)?.label ?? v;
                    return (
                      <span key={v} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-hebrew font-medium rounded-full px-2 py-0.5 shrink-0">
                        <span className="truncate max-w-[100px]">{lbl}</span>
                        <X className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100" onClick={(e) => { e.stopPropagation(); onSelectMulti?.(v); }} />
                      </span>
                    );
                  })}
                </span>
              ) : !isMulti && activeValue ? (
                <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-hebrew font-medium rounded-full px-2 py-0.5">
                  <span className="truncate max-w-[140px]">{label}</span>
                  <X className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100" onClick={(e) => { e.stopPropagation(); onClear(); }} />
                </span>
              ) : (
                <span className="truncate font-hebrew text-muted-foreground">{label}</span>
              )}
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="w-px h-4 bg-border/60" />
              <ChevronsUpDown className="w-4 h-4 opacity-40" />
            </span>
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className={cn('p-1', popoverWidth)} align="end" side="bottom">
        <SearchComboboxList
          options={options} isMulti={isMulti} activeValue={activeValue} activeValues={activeValues}
          onSelect={handleSelect} searchable={searchable} search={search} onSearchChange={setSearch}
          placeholder={placeholder}
        />
      </PopoverContent>
    </Popover>
  );
}
