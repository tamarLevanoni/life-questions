'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SearchBar } from '@/components/search/search-bar';
import { CategoryFilterBar } from '@/components/search/category-filter-bar';
import { SearchResultsList } from '@/components/search/search-results-list';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import type { Story, UiSearchFilters } from '@/lib/types';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const PAGE_LIMIT = 10;

export function SearchClient() {
  const router = useRouter();
  const { status } = useSession();

  const { stories, total, page, loading, searchStories, loadMoreStories } = useStoriesStore();
  const { masechtot, shuSections, topics, books } = useReferenceStore();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<UiSearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const buildApiParams = useCallback(
    (uiFilters: UiSearchFilters) => ({
      q: query || undefined,
      bookId: uiFilters.bookId,
      masechetId: uiFilters.masechetId,
      daf: uiFilters.daf,
      shuSectionId: uiFilters.shuSectionId,
      simanId: uiFilters.simanId,
      topicId: uiFilters.topicId,
      limit: PAGE_LIMIT,
    }),
    [query]
  );

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    searchStories(buildApiParams(filters));
  }, [searchStories, buildApiParams, filters]);

  const handleLoadMore = () => {
    loadMoreStories({ ...buildApiParams(filters), page: page + 1 });
  };

  const handleFiltersChange = (newFilters: UiSearchFilters) => {
    setFilters(newFilters);
  };

  const handleStoryClick = (story: Story) => {
    router.push(`/story/${story.id}`);
  };

  const hasMore = stories.length < total;

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-2">
            חיפוש סיפורים
          </h1>
          <p className="text-muted-foreground font-hebrew">
            חיפוש מבוסס AI — לפי שם סיפור, מקור, נושא, ועוד
          </p>
        </div>

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

        <div className="mb-6">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            isLoading={loading && stories.length === 0}
            placeholder="מה אתה מחפש?"
          />
        </div>

        <div className="mb-8">
          <CategoryFilterBar
            masechtot={masechtot}
            shuSections={shuSections}
            topics={topics}
            books={books}
            activeFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <SearchResultsList
          stories={stories}
          isLoading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onStoryClick={handleStoryClick}
          emptyMessage={
            hasSearched
              ? 'לא נמצאו תוצאות לחיפוש זה'
              : 'התחל לחפש כדי לראות תוצאות'
          }
        />
      </div>
    </div>
  );
}
