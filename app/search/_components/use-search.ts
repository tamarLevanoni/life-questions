'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { UiSearchFilters } from '@/lib/types';
import { buildSearchParams, removeSearchFilter, type SearchFilter, type SearchTab } from './search-filter-utils';

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
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [view, setView] = useState<'setup' | 'results'>(hasInitialParams ? 'results' : 'setup');
  const [activeTab, setActiveTab] = useState<SearchTab>('book-topic');
  const initialSearchStarted = useRef(false);
  // Pagination and result tags use the submitted snapshot, independently of draft edits.
  const [submittedFilters, setSubmittedFilters] = useState(initialFilters);

  const submit = useCallback((next: UiSearchFilters) => {
    if (authStatus !== 'authenticated') {
      if (isUnauthenticated) {
        showToast('יש להתחבר כדי לבצע חיפוש', 'info');
        openLoginModal();
      }
      return;
    }
    setView('results');
    setSubmittedFilters(next);
    void searchStories(buildSearchParams(next));
  }, [authStatus, isUnauthenticated, showToast, openLoginModal, searchStories]);

  const handleSearch = () => submit(draftFilters);
  const handleQueryChange = (q: string) => {
    setDraftFilters((draft) => ({ ...draft, q: q || undefined }));
  };
  const handleRemoveFilter = (filter: SearchFilter) => {
    setDraftFilters((draft) => removeSearchFilter(draft, filter, topics));
    submit(removeSearchFilter(submittedFilters, filter, topics));
  };
  const handleClearAll = () => {
    setDraftFilters({});
    setSubmittedFilters({});
    setActiveTab('book-topic');
    setView('setup');
  };

  const handleLoadMore = useCallback(() => {
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    loadMoreStories(buildSearchParams(submittedFilters));
  }, [isUnauthenticated, showToast, openLoginModal, loadMoreStories, submittedFilters]);

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
    void searchStories(buildSearchParams(initialFilters));
  }, [hasInitialParams, authStatus, openLoginModal, searchStories, initialFilters]);

  const hasMore = stories.length < total;

  return {
    draftFilters,
    setDraftFilters,
    submittedFilters,
    view,
    setView,
    activeTab,
    setActiveTab,
    canSearch: authStatus === 'authenticated',
    handleRemoveFilter,
    handleClearAll,
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
    handleQueryChange,
    handleLoadMore,
    handleStoryClick,
    openLoginModal,
  };
}

export type UseSearchReturn = ReturnType<typeof useSearch>;
