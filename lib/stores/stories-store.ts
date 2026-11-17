import { create } from 'zustand';
import { apiCall, ApiRequestError, UnauthenticatedError } from '@/lib/api-client';
import type {
  StoryCard, StoryWithNeighbors, SearchStart, SearchCursor, CursorStoryCards, SearchPageMeta,
} from '@/lib/schemas';

interface StoriesState {
  stories: Record<string, StoryWithNeighbors>;
  setStory: (story: StoryWithNeighbors) => void;
  searchResults: StoryCard[];
  total: number;
  cursor: SearchCursor | null;
  searchMeta: SearchPageMeta | null;
  loading: boolean;
  error: string | null;
  continuationError: string | null;
  expired: boolean;
  authRequired: boolean;
  searchStories: (params: SearchStart) => Promise<void>;
  loadMoreStories: () => Promise<void>;
  resetSearch: () => void;
  clearAuthRequired: () => void;
}

const emptySearch = {
  searchResults: [], total: 0, cursor: null, searchMeta: null,
  loading: false, error: null, continuationError: null, expired: false, authRequired: false,
};

let activeController: AbortController | null = null;

/** מבטל בקשת חיפוש קודמת כדי שרק הבקשה העדכנית תוכל לעדכן את המסך. */
function nextSignal() {
  activeController?.abort();
  activeController = new AbortController();
  return activeController.signal;
}

/** שולח ל־BFF בקשת פתיחה עם מסננים או בקשת המשך עם סמן. */
function requestPage(body: SearchStart | { cursor: SearchCursor }, signal: AbortSignal) {
  return apiCall<CursorStoryCards>('/api/stories/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
}

/** מזהה ביטול צפוי שאינו מצריך הודעת שגיאה. */
function ignoreFailure(signal: AbortSignal, error: unknown) {
  return signal.aborted || error instanceof DOMException && error.name === 'AbortError';
}

/** מחלץ הודעה להצגה מהשגיאה או משתמש בהודעת ברירת מחדל. */
function message(error: unknown) {
  return error instanceof Error ? error.message : 'שגיאה לא ידועה';
}

/** שומר את הכרטיסים שנצברו בחיפוש הנוכחי ואת הסמן שהתקבל לעמוד הבא. */
export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: {},
  /** שומר את פרטי המקרה לפי מזהה כשכבר נטענו בעמוד המקרה. */
  setStory: (story) => set((s) => ({ stories: { ...s.stories, [story.id]: story } })),
  ...emptySearch,

  /** מנקה את תוצאות החיפוש הקודם וטוען עמוד ראשון עם סמן חדש. */
  searchStories: async (params) => {
    const signal = nextSignal();
    set({ ...emptySearch, loading: true });
    try {
      const data = await requestPage(params, signal);
      if (signal.aborted) return;
      set({
        searchResults: data.stories, total: data.total, cursor: data.nextCursor,
        searchMeta: data.searchMeta, loading: false,
      });
    } catch (error) {
      if (ignoreFailure(signal, error)) return;
      set(error instanceof UnauthenticatedError
        ? { loading: false, authRequired: true }
        : { loading: false, error: message(error) });
    }
  },

  /** שולח בקשת המשך אחת בכל רגע ומצרף את הכרטיסים ואת הסימונים לתוצאות הקיימות. */
  loadMoreStories: async () => {
    const { cursor, loading } = get();
    if (loading || !cursor) return;
    const signal = nextSignal();
    set({ loading: true, continuationError: null });
    try {
      const data = await requestPage({ cursor }, signal);
      if (signal.aborted) return;
      set((state) => ({
        searchResults: [...state.searchResults, ...data.stories],
        total: data.total,
        cursor: data.nextCursor,
        searchMeta: { ...data.searchMeta, matches: { ...state.searchMeta?.matches, ...data.searchMeta.matches } },
        loading: false,
      }));
    } catch (error) {
      if (ignoreFailure(signal, error)) return;
      if (error instanceof UnauthenticatedError) {
        set({ loading: false, authRequired: true });
      } else if (error instanceof ApiRequestError && error.status === 410) {
        // שומרים את הכרטיסים שכבר נטענו ומאפשרים למשתמש להתחיל את אותו חיפוש מחדש.
        set({ loading: false, cursor: null, expired: true });
      } else {
        set({ loading: false, continuationError: message(error) });
      }
    }
  },

  /** מבטל את הבקשה הפעילה ומחזיר את מצב החיפוש לברירת המחדל. */
  resetSearch: () => {
    activeController?.abort();
    set(emptySearch);
  },
  /** מנקה את אות ההתחברות אחרי שהמסך טיפל בו. */
  clearAuthRequired: () => set({ authRequired: false }),
}));
