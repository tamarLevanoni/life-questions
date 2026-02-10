'use client';

import { cn } from '@/lib/utils';
import type { SearchBarProps } from '@/lib/types';
import { Search, Loader2, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'חיפוש לפי שם סיפור...',
  isLoading = false,
  className,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative', className)} dir="rtl">
      {/* Search icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'search-input w-full',
          'py-3 pr-12 pl-10',
          'text-foreground placeholder:text-muted-foreground',
          'font-hebrew text-base',
          'focus:outline-none'
        )}
        aria-label="חיפוש"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="נקה חיפוש"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
