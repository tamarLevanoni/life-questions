'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SearchBar } from '@/components/search/search-bar';
import { CategoryFilterBar } from '@/components/search/category-filter-bar';
import { SearchResultsList } from '@/components/search/search-results-list';
import { ActiveFilterTags } from '@/components/search/active-filter-tags';
import { AuthRequiredOverlay } from '@/components/search/auth-required-overlay';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { useAuth } from '@/lib/auth-context';
import type { UiSearchFilters, SearchBody } from '@/lib/types';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const activeFiltersCount =
    (filters.bookIds?.length ?? 0) +
    (filters.topicIds?.length ?? 0) +
    (filters.shasRefs?.filter((r) => r.masechetId)?.length ?? 0) +
    (filters.shuRefs?.filter((r) => r.shuSectionId)?.length ?? 0);

  const buildApiParams = useCallback(
    (uiFilters: UiSearchFilters): SearchBody => {
      const shasRefs = (uiFilters.shasRefs ?? [])
        .filter((r) => r.masechetId)
        .map((r) => ({ masechetId: r.masechetId!, daf: r.daf }));

      const shuRefs = (uiFilters.shuRefs ?? [])
        .filter((r) => r.shuSectionId)
        .map((r) => ({ shuSectionId: r.shuSectionId!, simanId: r.simanId, seif: r.seif }));

      return {
        q: query || undefined,
        bookIds: uiFilters.bookIds?.length ? uiFilters.bookIds : undefined,
        topicIds: uiFilters.topicIds?.length ? uiFilters.topicIds : undefined,
        shasRefs: shasRefs.length ? shasRefs : undefined,
        shuRefs: shuRefs.length ? shuRefs : undefined,
        limit: PAGE_LIMIT,
      };
    },
    [query]
  );

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    searchStories(buildApiParams(filters));
  }, [searchStories, buildApiParams, filters]);

  const handleLoadMore = () => {
    loadMoreStories({ ...buildApiParams(filters), page: page + 1 });
  };

  const handleStoryClick = (story: { id: string }) => {
    router.push(`/story/${story.id}`);
  };

  const hasMore = stories.length < total;

  useEffect(() => {
    if (status === 'unauthenticated') openLoginModal();
  }, [status, openLoginModal]);

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-1">חיפוש סיפורים</h1>
          <p className="text-muted-foreground font-hebrew text-sm">
            חיפוש מבוסס AI — לפי שם סיפור, מקור, נושא, ועוד
          </p>
        </div>

        <div className="flex gap-6 items-start" dir="rtl">
          {/* סיידבר פילטרים — דסקטופ */}
          <aside className="hidden md:block w-72 shrink-0 sticky top-24">
            <div className="rounded-xl border border-border bg-card p-4">
              <CategoryFilterBar
                masechtot={masechtot}
                shuSections={shuSections}
                topics={topics}
                books={books}
                activeFilters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
              />
            </div>
          </aside>

          {/* Drawer פילטרים — מובייל */}
          <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto" dir="rtl">
              <SheetHeader>
                <SheetTitle className="font-hebrew text-right">סנן תוצאות</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <CategoryFilterBar
                  masechtot={masechtot}
                  shuSections={shuSections}
                  topics={topics}
                  books={books}
                  activeFilters={filters}
                  onFiltersChange={setFilters}
                  onSearch={() => { handleSearch(); setFilterDrawerOpen(false); }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* אזור תוצאות */}
          <div className="flex-1 min-w-0 space-y-4 relative">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              isLoading={loading && stories.length === 0}
              placeholder="מה אתה מחפש?"
            />

            {/* כפתור סנן — מובייל */}
            <button
              className="md:hidden flex items-center gap-2 text-sm font-hebrew border border-border rounded-lg px-3 py-2 bg-card hover:bg-accent transition-colors"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              סנן תוצאות
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 leading-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <ActiveFilterTags
              filters={filters}
              onFiltersChange={setFilters}
              books={books}
              topics={topics}
              masechtot={masechtot}
              shuSections={shuSections}
            />

            <SearchResultsList
              stories={stories}
              books={books}
              topics={topics}
              isLoading={loading}
              hasMore={hasMore}
              total={total}
              onLoadMore={handleLoadMore}
              onStoryClick={handleStoryClick}
              emptyMessage={
                hasSearched ? 'לא נמצאו תוצאות לחיפוש זה' : 'התחל לחפש כדי לראות תוצאות'
              }
            />

            {isUnauthenticated && (
              <AuthRequiredOverlay onClick={openLoginModal} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
