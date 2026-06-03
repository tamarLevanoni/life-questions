'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchResultsStore } from '@/lib/stores/search-results-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import type { UiSearchFilters, SearchBody } from '@/lib/types';

const PAGE_LIMIT = 10;

export function useSearch() {
  const router = useRouter();
  const authStatus = useUserStore((s) => s.authStatus);
  const { openLoginModal } = useAuth();
  const isUnauthenticated = authStatus === 'unauthenticated';

  const stories = useSearchResultsStore((s) => s.stories);
  const total = useSearchResultsStore((s) => s.total);
  const page = useSearchResultsStore((s) => s.page);
  const loading = useSearchResultsStore((s) => s.loading);
  const searchStories = useSearchResultsStore((s) => s.searchStories);
  const loadMoreStories = useSearchResultsStore((s) => s.loadMoreStories);
  const masechtot = useReferenceStore((s) => s.masechtot);
  const shuSections = useReferenceStore((s) => s.shuSections);
  const topics = useReferenceStore((s) => s.topics);
  const books = useReferenceStore((s) => s.books);

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

  const handleLoadMore = useCallback(() => {
    loadMoreStories({ ...buildApiParams(filters), page: page + 1 });
  }, [loadMoreStories, buildApiParams, filters, page]);

  const handleStoryClick = useCallback(
    (story: { id: string }) => {
      router.push(`/story/${story.id}`);
    },
    [router]
  );

  const closeDrawerAndSearch = useCallback(() => {
    handleSearch();
    setFilterDrawerOpen(false);
  }, [handleSearch]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') openLoginModal();
  }, [authStatus, openLoginModal]);

  const hasMore = stories.length < total;

  return {
    query,
    setQuery,
    filters,
    setFilters,
    hasSearched,
    filterDrawerOpen,
    setFilterDrawerOpen,
    activeFiltersCount,
    hasMore,
    isUnauthenticated,
    stories,
    total,
    loading,
    masechtot,
    shuSections,
    topics,
    books,
    handleSearch,
    handleLoadMore,
    handleStoryClick,
    closeDrawerAndSearch,
    openLoginModal,
  };
}

export type UseSearchReturn = ReturnType<typeof useSearch>;
