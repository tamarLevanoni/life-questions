'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { UiSearchFilters } from '@/lib/types';
import type { SearchBody } from '@/lib/schemas';

const PAGE_LIMIT = 10;

export function useSearch() {
  const router = useRouter();
  const authStatus = useUserStore((s) => s.authStatus);
  const { openLoginModal } = useAuth();
  const { showToast } = useToast();
  const isUnauthenticated = authStatus === 'unauthenticated';

  const stories = useStoriesStore((s) => s.searchResults);
  const total = useStoriesStore((s) => s.total);
  const loading = useStoriesStore((s) => s.loading);
  const authRequired = useStoriesStore((s) => s.authRequired);
  const clearAuthRequired = useStoriesStore((s) => s.clearAuthRequired);
  const searchStories = useStoriesStore((s) => s.searchStories);
  const loadMoreStories = useStoriesStore((s) => s.loadMoreStories);
  const masechtot = useAppDataStore((s) => s.masechtot);
  const shuSections = useAppDataStore((s) => s.shuSections);
  const topics = useAppDataStore((s) => s.topics);
  const books = useAppDataStore((s) => s.books);

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
    console.log("🚀 ~ useSearch ~ isUnauthenticated:", isUnauthenticated)
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    setHasSearched(true);
    searchStories(buildApiParams(filters));
  }, [isUnauthenticated, showToast, openLoginModal, searchStories, buildApiParams, filters]);

  const handleLoadMore = useCallback(() => {
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    loadMoreStories(buildApiParams(filters));
  }, [isUnauthenticated, showToast, openLoginModal, loadMoreStories, buildApiParams, filters]);

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
    if (!authRequired) return;
    showToast('יש להתחבר כדי לבצע חיפוש', 'info');
    openLoginModal();
    clearAuthRequired();
  }, [authRequired, showToast, openLoginModal, clearAuthRequired]);

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
