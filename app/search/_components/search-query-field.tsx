'use client';

import { useRef, type RefObject } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import styles from './search-layout.module.css';

interface SearchQueryFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  ref?: RefObject<HTMLInputElement | null>;
  describedBy?: string;
  variant?: 'setup' | 'results';
}

export function SearchQueryField({ id, value, onChange, ref, describedBy, variant = 'results' }: SearchQueryFieldProps) {
  const localRef = useRef<HTMLInputElement>(null);
  const inputRef = ref ?? localRef;
  const clearQuery = () => {
    onChange('');
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="relative min-w-0 flex-1">
      <Label htmlFor={id} className="sr-only">חיפוש חופשי</Label>
      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="כתבו את השאלה שלכם"
        aria-describedby={describedBy}
        className={cn(
          'rounded-xl border-primary/30 bg-card ps-9 pe-10 shadow-none focus-visible:ring-1',
          variant === 'setup' ? cn(styles.setupQueryInput, 'leading-normal md:leading-(--text-sm--line-height)') : 'h-10 text-base md:text-sm'
        )}
      />
      {value && (
        <Button
          type="button" variant="ghost" size="icon" aria-label="נקה חיפוש"
          className={cn(
            'absolute end-0 top-1/2 -translate-y-1/2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground',
            variant === 'setup' ? styles.setupQueryClear : 'size-9'
          )}
          onClick={clearQuery}
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
