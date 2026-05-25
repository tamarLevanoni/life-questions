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
import type {
  UiSearchFilters, SearchBody,
  Book, Topic, MasechetWithPages, ShuSectionWithSimanim,
} from '@/lib/types';
import { LogIn, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';

interface FilterTag {
  key: string;
  label: string;
  onRemove: () => void;
}

function ActiveFilterTags({
  filters, onFiltersChange,
  books, topics, masechtot, shuSections,
}: {
  filters: UiSearchFilters;
  onFiltersChange: (f: UiSearchFilters) => void;
  books: Book[];
  topics: Topic[];
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
}) {
  const { bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = filters;

  const tags: FilterTag[] = [];

  bookIds.forEach((id) => {
    const name = books.find((b) => b.id === id)?.name ?? id;
    tags.push({
      key: `book-${id}`,
      label: name,
      onRemove: () => {
        const next = bookIds.filter((x) => x !== id);
        const validTopics = topicIds.filter(
          (tid) => topics.find((t) => t.id === tid && next.includes(t.bookId))
        );
        onFiltersChange({
          ...filters,
          bookIds: next.length ? next : undefined,
          topicIds: validTopics.length ? validTopics : undefined,
        });
      },
    });
  });

  topicIds.forEach((id) => {
    const name = topics.find((t) => t.id === id)?.name ?? id;
    tags.push({
      key: `topic-${id}`,
      label: name,
      onRemove: () => {
        const next = topicIds.filter((x) => x !== id);
        onFiltersChange({ ...filters, topicIds: next.length ? next : undefined });
      },
    });
  });

  shasRefs.filter((r) => r.masechetId).forEach((ref) => {
    const masechet = masechtot.find((m) => m.id === ref.masechetId);
    const label = masechet
      ? ref.daf ? `${masechet.name} דף ${toHebrewNumeral(ref.daf)}` : masechet.name
      : ref.masechetId!;
    tags.push({
      key: `shas-${ref.id}`,
      label,
      onRemove: () => {
        const next = shasRefs.filter((r) => r.id !== ref.id);
        onFiltersChange({ ...filters, shasRefs: next.length ? next : undefined });
      },
    });
  });

  shuRefs.filter((r) => r.shuSectionId).forEach((ref) => {
    const section = shuSections.find((s) => s.id === ref.shuSectionId);
    const siman = ref.simanId ? section?.simanim.find((si) => si.id === ref.simanId) : undefined;
    const label = section
      ? siman ? `${section.name} ${toHebrewNumeral(siman.siman)}` : section.name
      : ref.shuSectionId!;
    tags.push({
      key: `shu-${ref.id}`,
      label,
      onRemove: () => {
        const next = shuRefs.filter((r) => r.id !== ref.id);
        onFiltersChange({ ...filters, shuRefs: next.length ? next : undefined });
      },
    });
  });

  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap" dir="rtl">
      <span className="text-xs text-muted-foreground font-hebrew shrink-0">מחפש בתוך:</span>
      {tags.map((tag) => (
        <span
          key={tag.key}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-hebrew bg-primary/10 text-primary border border-primary/20"
        >
          {tag.label}
          <button
            onClick={tag.onRemove}
            className="hover:text-primary/60 transition-colors"
            aria-label={`הסר ${tag.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

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
          {/* סיידבר פילטרים — דסקטופ בלבד */}
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

          {/* Drawer פילטרים — מובייל בלבד */}
          <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
            <SheetContent
              side="bottom"
              className="h-[85vh] rounded-t-2xl overflow-y-auto"
              dir="rtl"
            >
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

            {/* כפתור סנן — מובייל בלבד */}
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
    </div>
  );
}
