'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronsUpDown, Square, CheckSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    } else {
      onSelect?.(value);
      setSearch('');
    }
  };

  const showChipsInside = isMulti && !externalChips && activeValues && activeValues.length > 0;

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
                        <X
                          className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); onSelectMulti?.(v); }}
                        />
                      </span>
                    );
                  })}
                </span>
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
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full transition-colors hover:bg-accent font-hebrew',
                      !isMulti && isChecked && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    {isMulti && (
                      isChecked
                        ? <CheckSquare className="w-4 h-4 shrink-0 text-primary" />
                        : <Square className="w-4 h-4 shrink-0 text-muted-foreground/50" />
                    )}
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
