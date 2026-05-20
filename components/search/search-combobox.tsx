'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface FilterOption { value: string; label: string }

export function SearchCombobox({
  open, onOpenChange, fieldLabel, label, icon, minWidth = 180,
  activeValue, activeValues, onClear, options, onSelect, onSelectMulti,
  placeholder, popoverWidth, searchable = true,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  fieldLabel?: string; label: string; icon?: React.ReactNode; minWidth?: number;
  activeValue?: string; activeValues?: string[];
  onClear: () => void;
  options: FilterOption[]; onSelect?: (value: string) => void; onSelectMulti?: (value: string) => void;
  placeholder: string; popoverWidth: string; searchable?: boolean;
}) {
  const [search, setSearch] = useState('');

  const isMulti = activeValues !== undefined;
  const filtered = search
    ? options.filter((o) => o.label.includes(search))
    : options;

  const handleOpenChange = (v: boolean) => {
    if (!v) setSearch('');
    onOpenChange(v);
  };

  const handleSelect = (value: string) => {
    if (isMulti) {
      onSelectMulti?.(value);
      // במצב multi — שמור פתוח לבחירת פריטים נוספים
    } else {
      onSelect?.(value);
      setSearch('');
    }
  };

  const hasActive = isMulti ? (activeValues?.length ?? 0) > 0 : !!activeValue;

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
            className="filter-chip flex items-center justify-between gap-3"
            style={{ minWidth }}
          >
            <span className="flex items-center gap-2 truncate flex-1 flex-wrap">
              {icon}
              {isMulti && activeValues && activeValues.length > 0 ? (
                activeValues.map((v) => {
                  const lbl = options.find((o) => o.value === v)?.label ?? v;
                  return (
                    <span key={v} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-hebrew font-medium rounded-full px-2 py-0.5">
                      <span className="truncate max-w-[100px]">{lbl}</span>
                      <X
                        className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); onSelectMulti?.(v); }}
                      />
                    </span>
                  );
                })
              ) : !isMulti && activeValue ? (
                <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-hebrew font-medium rounded-full px-2 py-0.5">
                  <span className="truncate max-w-[140px]">{label}</span>
                  <X
                    className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                  />
                </span>
              ) : (
                <span className="truncate font-hebrew text-muted-foreground">{label}</span>
              )}
            </span>
            <span className="flex items-center gap-2 shrink-0">
              {hasActive && isMulti && (
                <X
                  className="w-3.5 h-3.5 opacity-40 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onClear(); }}
                />
              )}
              <span className="w-px h-4 bg-border/60" />
              <ChevronsUpDown className="w-4 h-4 opacity-40" />
            </span>
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className={cn('p-1', popoverWidth)} align="end" side="bottom">
        <div dir="rtl" className="flex flex-col gap-0.5">
          {searchable && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-sm font-hebrew bg-transparent border-b border-border outline-none placeholder:text-muted-foreground mb-1"
            />
          )}
          <div className="max-h-[220px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground font-hebrew">לא נמצאו תוצאות</p>
            ) : (
              filtered.map((opt) => {
                const isChecked = isMulti
                  ? activeValues?.includes(opt.value)
                  : activeValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full transition-colors hover:bg-accent font-hebrew"
                  >
                    <Check className={cn('w-4 h-4 shrink-0', isChecked ? 'opacity-100' : 'opacity-0')} />
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
