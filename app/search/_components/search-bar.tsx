'use client';

import { cn } from '@/lib/utils';
import type { SearchBarProps } from '@/lib/types';
import { Search, Loader2, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  isLoading = false,
  className,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className={cn('flex gap-2', className)} dir="rtl">
      <div className="relative flex-1">
        {/* Search icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
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

      {/* Search button */}
      <button
        onClick={onSearch}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-5 py-3 rounded-xl',
          'bg-primary text-primary-foreground font-hebrew font-medium text-base',
          'hover:opacity-90 active:scale-95 transition-all',
          'disabled:opacity-60 disabled:cursor-not-allowed shrink-0'
        )}
        aria-label="חפש"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
        <span>חיפוש</span>
      </button>
    </div>
  );
}
