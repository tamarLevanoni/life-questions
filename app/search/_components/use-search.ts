'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  const error = useStoriesStore((s) => s.error);
  const authRequired = useStoriesStore((s) => s.authRequired);
  const clearAuthRequired = useStoriesStore((s) => s.clearAuthRequired);
  const searchStories = useStoriesStore((s) => s.searchStories);
  const loadMoreStories = useStoriesStore((s) => s.loadMoreStories);
  const masechtot = useAppDataStore((s) => s.masechtot);
  const shuSections = useAppDataStore((s) => s.shuSections);
  const topics = useAppDataStore((s) => s.topics);
  const books = useAppDataStore((s) => s.books);

  const hasInitialParams = Boolean(searchParams.get('q') || searchParams.get('bookId'));
  const [initialFilters] = useState<UiSearchFilters>(() => {
    const q = searchParams.get('q') ?? undefined;
    const bookId = searchParams.get('bookId');
    return { q, bookIds: bookId ? [bookId] : undefined };
  });
  const [filters, setFilters] = useState(initialFilters);
  const [hasSearched, setHasSearched] = useState(hasInitialParams);
  const [filtersOpen, setFiltersOpen] = useState(!hasInitialParams);
  const initialSearchStarted = useRef(false);
  // Snapshot of the filters actually searched — ActiveFilterTags reads
  // this instead of the live filters, so the tags only change when a
  // search is submitted, not while the user is still picking.
  const [applied, setApplied] = useState(filters);

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
        q: uiFilters.q?.trim() || undefined,
        bookIds: uiFilters.bookIds?.length ? uiFilters.bookIds : undefined,
        topicIds: uiFilters.topicIds?.length ? uiFilters.topicIds : undefined,
        shasRefs: shasRefs.length ? shasRefs : undefined,
        shuRefs: shuRefs.length ? shuRefs : undefined,
        limit: PAGE_LIMIT,
      };
    },
    []
  );

  const handleSearch = useCallback(() => {
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    setHasSearched(true);
    setFiltersOpen(false);
    setApplied(filters);
    searchStories(buildApiParams(filters));
    scrollToTop();
  }, [isUnauthenticated, showToast, openLoginModal, searchStories, buildApiParams, filters, scrollToTop]);

  const handleLoadMore = useCallback(() => {
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    loadMoreStories(buildApiParams(applied));
  }, [isUnauthenticated, showToast, openLoginModal, loadMoreStories, buildApiParams, applied]);

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

  useEffect(() => {
    if (!hasInitialParams || authStatus === 'idle' || initialSearchStarted.current) return;
    if (authStatus !== 'authenticated') {
      openLoginModal();
      return;
    }
    initialSearchStarted.current = true;
    void searchStories(buildApiParams(initialFilters));
  }, [hasInitialParams, authStatus, openLoginModal, searchStories, buildApiParams, initialFilters]);

  const hasMore = stories.length < total;

  return {
    filters,
    setFilters,
    applied,
    hasSearched,
    filtersOpen,
    toggleFilters: () => setFiltersOpen((prev) => !prev),
    activeFiltersCount,
    hasMore,
    isUnauthenticated,
    stories,
    total,
    loading,
    error,
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
