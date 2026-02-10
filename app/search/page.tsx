'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/layout/app-header';
import { SearchBar } from '@/components/search/search-bar';
import { CategoryFilterBar } from '@/components/search/category-filter-bar';
import { SearchResultsList } from '@/components/search/search-results-list';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { filterStories } from '@/lib/mock-data';
import type { Story, SearchFilters } from '@/lib/types';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE = 10;

export default function SearchPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch stories when filters or query change
  const fetchStories = useCallback(
    (pageNum: number, append: boolean = false) => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        const results = filterStories(
          debouncedQuery || undefined,
          filters.categoryType,
          filters.masechet,
          filters.chelek,
          filters.subject,
          filters.hasVideo
        );

        const start = (pageNum - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedResults = results.slice(start, end);

        if (append) {
          setStories((prev) => [...prev, ...paginatedResults]);
        } else {
          setStories(paginatedResults);
        }

        setHasMore(end < results.length);
        setIsLoading(false);
      }, 300);
    },
    [debouncedQuery, filters]
  );

  // Reset and fetch when filters or query change
  useEffect(() => {
    setPage(1);
    fetchStories(1, false);
  }, [debouncedQuery, filters, fetchStories]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStories(nextPage, true);
  };

  // Handle story click
  const handleStoryClick = (story: Story) => {
    router.push(`/story/${story.id}`);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <AppHeader />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-2">
              חיפוש סיפורים
            </h1>
            <p className="text-muted-foreground font-hebrew">
              חפשו לפי שם הסיפור או סננו לפי קטגוריות
            </p>
          </div>

          {/* Auth prompt for non-logged users */}
          {status === 'unauthenticated' && (
            <div className="glass-card p-4 rounded-xl mb-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm font-hebrew text-muted-foreground">
                יש להתחבר על מנת לראות את כל התוכן באפליקציה. ההרשמה בחינם.
              </p>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-hebrew font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                התחברות
              </Link>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              isLoading={isLoading && stories.length === 0}
              placeholder="חיפוש לפי שם סיפור..."
            />
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <CategoryFilterBar
              activeFilters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Results */}
          <SearchResultsList
            stories={stories}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onStoryClick={handleStoryClick}
            emptyMessage={
              debouncedQuery || Object.keys(filters).length > 0
                ? 'לא נמצאו תוצאות לחיפוש זה'
                : 'אין סיפורים להצגה'
            }
          />
        </div>
      </div>
    </main>
  );
}
