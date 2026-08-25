'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
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

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<UiSearchFilters>(() => {
    const bookId = searchParams.get('bookId');
    return bookId ? { bookIds: [bookId] } : {};
  });
  const [hasSearched, setHasSearched] = useState(false);
  // Snapshot of the query/filters actually searched — ActiveFilterTags
  // reads this instead of the live query/filters, so the tags only
  // change when a search is submitted, not while the user is still picking.
  const [applied, setApplied] = useState({ query, filters });

  const scrollToTop = useCallback(() => {
    // Blur the clicked button first — otherwise the browser's own
    // "keep focused element in view" behavior fights the smooth scroll
    // and snaps the page right back down.
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    setHasSearched(true);
    setApplied({ query, filters });
    searchStories(buildApiParams(filters));
    scrollToTop();
  }, [isUnauthenticated, showToast, openLoginModal, searchStories, buildApiParams, filters, query, scrollToTop]);

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

  useEffect(() => {
    if (!authRequired) return;
    showToast('יש להתחבר כדי לבצע חיפוש', 'info');
    openLoginModal();
    clearAuthRequired();
  }, [authRequired, showToast, openLoginModal, clearAuthRequired]);

  const hasInitialParams = Boolean(searchParams.get('q') || searchParams.get('bookId'));
  useEffect(() => {
    if (!hasInitialParams) return;
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = stories.length < total;

  return {
    query,
    setQuery,
    filters,
    setFilters,
    applied,
    hasSearched,
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
    openLoginModal,
  };
}

export type UseSearchReturn = ReturnType<typeof useSearch>;
