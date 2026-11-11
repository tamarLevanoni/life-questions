import type { Topic, SearchBody } from '@/lib/schemas';
import type { UiSearchFilters } from '@/lib/types';

export type SearchTab = 'book-topic' | 'sources';
export type SearchFilter =
  | { type: 'query' }
  | { type: 'book' | 'topic' | 'shas' | 'shu'; id: string };

export function buildSearchParams(filters: UiSearchFilters): SearchBody {
  const shasRefs = (filters.shasRefs ?? []).flatMap((ref) =>
    ref.masechetId ? [{ masechetId: ref.masechetId, daf: ref.daf }] : []
  );
  const shuRefs = (filters.shuRefs ?? []).flatMap((ref) =>
    ref.shuSectionId ? [{ shuSectionId: ref.shuSectionId, simanId: ref.simanId, seif: ref.seif }] : []
  );
  return {
    q: filters.q?.trim() || undefined,
    bookIds: filters.bookIds?.length ? filters.bookIds : undefined,
    topicIds: filters.topicIds?.length ? filters.topicIds : undefined,
    shasRefs: shasRefs.length ? shasRefs : undefined,
    shuRefs: shuRefs.length ? shuRefs : undefined,
    limit: 10,
  };
}

export function selectBooks(filters: UiSearchFilters, bookIds: string[], topics: Topic[]): UiSearchFilters {
  const topicIds = filters.topicIds?.filter((id) =>
    topics.some((topic) => topic.id === id && bookIds.includes(topic.bookId))
  );
  return {
    ...filters,
    bookIds: bookIds.length ? bookIds : undefined,
    topicIds: topicIds?.length ? topicIds : undefined,
  };
}

export function removeSearchFilter(filters: UiSearchFilters, filter: SearchFilter, topics: Topic[]): UiSearchFilters {
  switch (filter.type) {
    case 'query':
      return { ...filters, q: undefined };
    case 'book': {
      if (!filters.bookIds?.includes(filter.id)) return filters;
      const bookIds = filters.bookIds.filter((id) => id !== filter.id);
      return selectBooks(filters, bookIds, topics);
    }
    case 'topic':
      return { ...filters, topicIds: filters.topicIds?.filter((id) => id !== filter.id) };
    case 'shas':
      return { ...filters, shasRefs: filters.shasRefs?.filter((ref) => ref.id !== filter.id) };
    case 'shu':
      return { ...filters, shuRefs: filters.shuRefs?.filter((ref) => ref.id !== filter.id) };
  }
}
