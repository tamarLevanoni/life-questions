'use client';

import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

interface SearchComboboxProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  fieldLabel: string;
  label: string;
  activeValue?: string;
  onClear: () => void;
  options: FilterOption[];
  onSelect: (value: string) => void;
  placeholder: string;
  popoverWidth: string;
  disabled?: boolean;
}

export function SearchCombobox({ open, onOpenChange, fieldLabel, label, activeValue, onClear, options, onSelect, placeholder, popoverWidth, disabled = false }: SearchComboboxProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const scrollPosition = useRef(0);
  const interactedOutside = useRef(false);
  const [search, setSearch] = useState('');
  const filtered = options.filter((option) => option.label.includes(search));

  const changeOpen = (value: boolean) => {
    if (value) {
      scrollPosition.current = window.scrollY;
      interactedOutside.current = false;
    } else {
      setSearch('');
    }
    onOpenChange(value);
  };
  const clearSelection = () => {
    trigger.current?.focus({ preventScroll: true });
    onClear();
  };
  const restoreScrollAfterClose = () => {
    if (interactedOutside.current) return;
    // Keep Radix's focus return. On compact pages it can scroll controls behind
    // the fixed header; restore the page position after that focus has occurred.
    const main = trigger.current?.closest('main');
    const fitsViewport = main && main.getBoundingClientRect().height <= window.innerHeight;
    const top = fitsViewport ? 0 : scrollPosition.current;
    requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
  };

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span id={id + '-label'} className="block text-[0.625rem] font-medium leading-3.5 text-muted-foreground md:text-[0.6875rem] md:leading-4">
        {fieldLabel}
      </span>
      <Popover open={open} onOpenChange={changeOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <Button
              ref={trigger} type="button" variant="outline" disabled={disabled}
              aria-label={fieldLabel + ': ' + label} aria-describedby={id + '-label'}
              aria-expanded={open} aria-controls={open ? id : undefined}
              className={cn(
                'h-6.5 w-full min-w-0 justify-between gap-1 rounded-lg border-border bg-card px-2 text-[0.6875rem] leading-(--text-xs--line-height) shadow-none hover:bg-muted hover:text-foreground md:h-8 md:text-xs md:leading-(--text-sm--line-height)',
                activeValue && 'pe-10'
              )}
            >
              <span className="truncate">{label}</span>
            </Button>
          </PopoverTrigger>
          {activeValue && (
            <Button
              type="button" variant="ghost" onClick={clearSelection} aria-label={'ניקוי ' + fieldLabel}
              className="absolute end-0 top-0 h-6.5 rounded-lg px-2 text-[0.6875rem] leading-normal text-muted-foreground hover:bg-muted hover:text-foreground md:h-8 md:text-xs"
            >
              נקה
            </Button>
          )}
        </div>
        <PopoverContent
          onPointerDownOutside={() => { interactedOutside.current = true; }}
          onCloseAutoFocus={restoreScrollAfterClose}
          id={id} aria-label={'בחירת ' + fieldLabel}
          className={cn('max-w-[calc(100vw-2rem)] p-2', popoverWidth)} align="start" side="bottom"
        >
          <div dir="rtl" className="space-y-2">
            <Input
              aria-label={placeholder} placeholder={placeholder} value={search}
              onChange={(event) => setSearch(event.target.value)} className="h-11 border-border"
            />
            <div className="max-h-60 overflow-y-auto overscroll-contain">
              {!filtered.length && <p className="py-4 text-center text-sm text-muted-foreground">לא נמצאו תוצאות</p>}
              {filtered.map((option) => (
                <Button
                  key={option.value} type="button" variant="ghost" aria-pressed={activeValue === option.value}
                  onClick={() => {
                    onSelect(option.value);
                    setSearch('');
                  }}
                  className="min-h-11 w-full justify-between rounded-lg px-3 text-sm hover:bg-muted hover:text-foreground aria-pressed:bg-primary/10 aria-pressed:text-primary"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
