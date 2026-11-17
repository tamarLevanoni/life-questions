'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { UiSearchFilters } from '@/lib/types';
import { hasSearchCriteria, searchStartSchema } from '@/lib/schemas/search';
import { buildSearchParams, removeSearchFilter, type SearchFilter, type SearchTab } from './search-filter-utils';

/** מחבר בין הטופס, החיפוש השמור בחנות המצב והניווט בין מסך החיפוש לתוצאות. */
export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authStatus = useUserStore((s) => s.authStatus);
  const { openLoginModal } = useAuth();
  const { showToast } = useToast();
  const isUnauthenticated = authStatus === 'unauthenticated';

  const stories = useStoriesStore((s) => s.searchResults);
  const total = useStoriesStore((s) => s.total);
  const hasMore = useStoriesStore((s) => s.cursor !== null);
  const searchMeta = useStoriesStore((s) => s.searchMeta);
  const continuationError = useStoriesStore((s) => s.continuationError);
  const expired = useStoriesStore((s) => s.expired);
  const resetSearch = useStoriesStore((s) => s.resetSearch);
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

  // מאתחל את הטופס מהשאילתה או מהספר שהועברו בקישור.
  const [initialFilters] = useState<UiSearchFilters>(() => {
    const q = searchParams.get('q') ?? undefined;
    const bookId = searchParams.get('bookId');
    return { q, bookIds: bookId ? [bookId] : undefined };
  });
  const [initialSearch] = useState(() => searchStartSchema.safeParse(buildSearchParams(initialFilters)));
  // אפשר לערוך את הטיוטה בזמן שהתוצאות עדיין שייכות לחיפוש האחרון.
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [view, setView] = useState<'setup' | 'results'>(initialSearch.success ? 'results' : 'setup');
  const [activeTab, setActiveTab] = useState<SearchTab>('book-topic');
  const initialSearchStarted = useRef(false);
  // Result tags and a manual restart use the submitted filters.
  const [submittedFilters, setSubmittedFilters] = useState(initialFilters);

  /** בודק התחברות ותקינות, שומר את הבחירות שהוגשו ופותח חיפוש חדש. */
  const submit = useCallback((next: UiSearchFilters) => {
    const params = buildSearchParams(next);
    if (!hasSearchCriteria(params)) return;

    if (authStatus !== 'authenticated') {
      if (isUnauthenticated) {
        showToast('יש להתחבר כדי לבצע חיפוש', 'info');
        openLoginModal();
      }
      return;
    }
    const parsed = searchStartSchema.safeParse(params);
    if (!parsed.success) {
      showToast(parsed.error.issues[0]?.message ?? 'בקשת חיפוש לא תקינה', 'info');
      return;
    }
    setView('results');
    setSubmittedFilters(next);
    void searchStories(parsed.data);
  }, [authStatus, isUnauthenticated, showToast, openLoginModal, searchStories]);

  /** שולח את טיוטת החיפוש כפי שהיא עכשיו. */
  const handleSearch = () => submit(draftFilters);
  /** מעדכן רק את הטיוטה עד להגשה. */
  const handleQueryChange = (q: string) => {
    setDraftFilters((draft) => ({ ...draft, q: q || undefined }));
  };
  /** מחפש שוב לאחר הסרת מסנן, או חוזר לטופס אם לא נותרו תנאי חיפוש. */
  const handleRemoveFilter = (filter: SearchFilter) => {
    setDraftFilters((draft) => removeSearchFilter(draft, filter, topics));
    const next = removeSearchFilter(submittedFilters, filter, topics);
    if (hasSearchCriteria(buildSearchParams(next))) {
      submit(next);
      return;
    }
    resetSearch();
    setSubmittedFilters(next);
    setView('setup');
  };
  /** מבטל עבודה פעילה, מאפס את הטופס וחוזר למסך החיפוש. */
  const handleClearAll = () => {
    resetSearch();
    setDraftFilters({});
    setSubmittedFilters({});
    setActiveTab('book-topic');
    setView('setup');
  };

  /** ממשיך את החיפוש מהסמן שכבר נשמר לאחר בדיקת מצב ההתחברות. */
  const handleLoadMore = useCallback(() => {
    if (isUnauthenticated) {
      showToast('יש להתחבר כדי לבצע חיפוש', 'info');
      openLoginModal();
      return;
    }
    void loadMoreStories();
  }, [isUnauthenticated, showToast, openLoginModal, loadMoreStories]);

  /** פותח את עמוד המקרה שבחר המשתמש מתוך התוצאות. */
  const handleStoryClick = useCallback(
    (story: { id: string }) => {
      router.push(`/story/${story.id}`);
    },
    [router]
  );

  useEffect(() => {
    // מטפל גם בדחייה מהשרת כשהתחברות שהייתה בתוקף פגה במהלך השימוש.
    if (!authRequired) return;
    showToast('יש להתחבר כדי לבצע חיפוש', 'info');
    openLoginModal();
    clearAuthRequired();
  }, [authRequired, showToast, openLoginModal, clearAuthRequired]);

  useEffect(() => {
    // קישור עם ערכי חיפוש מתחיל בקשה אחת ברגע שמצב ההתחברות מאפשר זאת.
    if (!initialSearch.success || authStatus === 'idle' || initialSearchStarted.current) return;
    if (authStatus !== 'authenticated') {
      openLoginModal();
      return;
    }
    initialSearchStarted.current = true;
    void searchStories(initialSearch.data);
  }, [initialSearch, authStatus, openLoginModal, searchStories]);

  return {
    draftFilters,
    setDraftFilters,
    submittedFilters,
    view,
    setView,
    activeTab,
    setActiveTab,
    canSearch: authStatus === 'authenticated' && hasSearchCriteria(buildSearchParams(draftFilters)),
    handleRemoveFilter,
    handleClearAll,
    hasMore,
    searchMeta,
    continuationError,
    expired,
    // מתחיל מחדש עם הבחירות שהניבו את התוצאות המוצגות, למשל לאחר פקיעת הסמן.
    handleRestart: () => submit(submittedFilters),
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
