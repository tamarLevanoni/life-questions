'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SearchBar } from '@/components/search/search-bar';
import { CategoryFilterBar } from '@/components/search/category-filter-bar';
import { SearchResultsList } from '@/components/search/search-results-list';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { useAuth } from '@/lib/auth-context';
import type { Story, UiSearchFilters } from '@/lib/types';
import { LogIn } from 'lucide-react';

const PAGE_LIMIT = 10;

export function SearchClient() {
  const router = useRouter();
  const { status } = useSession();
  const { openLoginModal } = useAuth();
  const isUnauthenticated = status === 'unauthenticated';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      openLoginModal();
    }
  }, [openLoginModal]);

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

        <div className="relative">
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

          {isUnauthenticated && (
            <div
              className="absolute inset-0 z-10 backdrop-blur-[1px] bg-background/20 rounded-xl cursor-not-allowed flex items-start justify-center pt-16"
              onClick={openLoginModal}
            >
              <div className="glass-card px-6 py-4 rounded-xl text-center pointer-events-none">
                <LogIn className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-hebrew text-muted-foreground">
                  יש להתחבר כדי לחפש
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
