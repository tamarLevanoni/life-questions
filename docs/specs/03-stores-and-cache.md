# Stores And Cache Spec

## Goal
Define where state lives, how data crosses from server to client without duplicate requests, and how the full cache strategy works.

---

## Core Principle: One Layer Per Source Of Truth

```text
   +--------------+    +--------------+    +--------------+
   |  Next cache  |    |   RSC props  |    |   Zustand    |
   |  (server)    |--->|  transport   |--->|   client     |
   +--------------+    +--------------+    +--------------+
        stable            one-time             live
```

- **Next cache (server):** stores `backendFetch` results across requests.
- **RSC props:** transport data from RSC into client components once in the initial payload.
- **Zustand (client):** source of truth after the page loads. Every client-side change goes through the store.

Binding rules:
1. If the client needs data, stream it from RSC into the store synchronously, then read it from the store.
2. Components must not call `useInitialData()` when they can read the store.
3. Stores must not keep manual caches such as `Map<id, Story>`. Next cache and `react.cache()` cover that responsibility.

---

## Stores

| Store | Role | First Hydration Source |
|-------|------|------------------------|
| `useSearchResultsStore` | Search result pages returned by the server; request parameters, pagination, loading, and error state only | RSC: optional initial search results |
| `useStoryDetailStore` | Current story only; may be primed with one selected full story before navigation; no internal map | RSC: `getStory(id)` |
| `useReferenceStore` | Masechtot / Shulchan Aruch sections / topics / books; read-only on the client | RSC: `getReference()` |
| `useUserStore` | Authenticated user profile | RSC: `getCurrentUser()` |
| `useContactStore` | Contact-form submission state | None; action state only |

The canonical store name is `useSearchResultsStore`. The file `lib/stores/stories-store.ts` still exports `useStoriesStore` as a transitional name; any file that uses `useStoriesStore` must be updated to `useSearchResultsStore`.

`useSearchResultsStore` must not own featured stories. Featured examples are a server-provided home-page entry path and should be hydrated separately or rendered directly from the RSC payload.

> **Featured stories are NOT stored in `useSearchResultsStore`.** They are loaded via RSC `getStory(id)` and optionally primed in `useStoryDetailStore` before navigation.

`useSearchResultsStore` stores server-returned results exactly as returned. It may build request payloads or query parameters for the Core API, but it must not perform client-side ranking, filtering, sorting, scoring, or match interpretation.

> **Search hooks/stores must not perform client-side ranking, filtering, sorting, scoring, or match interpretation. All filtering is done server-side.**

### Featured Entry Stories

The home page shows three featured/example stories. They are high-intent entry points, so the app should load them as full `StoryWithNeighbors[]`, not as `StoryCard[]` from search.

Implementation contract:
- Featured examples are not search results and never belong in `useSearchResultsStore`.
- `getFeaturedEntryStories()` first loads the ordered featured selection, then resolves each selected id through the same `getStory(id)` server helper used by `/story/:id`.
- This warms the single-story cache, so clicking a featured example can reuse the cached `GET /api/stories/:id` response.
- The home page may render cards from the full story payload by passing only the display subset into card components.
- On card click, client code may call `useStoryDetailStore.getState().prime(story)` or `hydrate(story)` before navigation. This primes only the selected current story. It must not create a `Map`, list, or featured-story cache inside the store.

### `useReferenceStore`: Client Read-Only
This store has no fetch action. Its only data entry point is `hydrate(bundle)` from `<StoreHydrator>`.

### `useStoryDetailStore`: No Internal Map
Opening a story: RSC loads `story`, then hydrates the store synchronously. Navigating to another story creates a new page payload with the next story. Going back uses the router/cache layers; there is no need for `storyCache: Map`.

The only allowed pre-navigation optimization is a current-story handoff: when the user clicks a full featured entry story that is already in the home-page payload, set that one story as the current story before navigating. The `/story/:id` page still treats RSC `getStory(id)` as authoritative.

---

## Hydration Requirement

```tsx
// components/common/store-hydrator.tsx
'use client';
export function StoreHydrator({ children, ...initial }) {
  const hydrated = useRef(false);
  if (!hydrated.current) {
    if (initial.reference) useReferenceStore.setState({ ...initial.reference, loaded: true });
    if (initial.story) useStoryDetailStore.setState({ story: initial.story });
    if (initial.user !== undefined) useUserStore.setState({ user: initial.user });
    if (initial.search) useSearchResultsStore.setState({
      stories: initial.search.stories,
      total: initial.search.total,
    });
    hydrated.current = true;
  }
  return <>{children}</>;
}
```

What this solves:
- The `if` runs during the first render before children render, so the store is populated for the first client paint.
- Children read directly from the store without fallback props.
- `useRef` makes the operation first-run only and safe under Strict Mode.

Rules for `use-<route>.ts` hooks:
- Read only from stores. Do not read `useInitialData()` or `initial*` props.
- If an effect performs a fetch, check whether the entity is already hydrated. If it is, skip the fetch.

---

## Server-Side Cache Management

Next.js 16 baseline:
- No implicit fetch caching. Every `fetch` is dynamic unless caching is requested explicitly.
- The project uses three explicit cache tools.

### 1. `next: { revalidate, tags }` On Fetch
Used for external endpoints, meaning the core API:

```ts
backendFetch('/api/stories/featured', {
  next: { revalidate: 3600, tags: ['featured'] },
});
```

### 2. `'use cache'` Directive
Used for Next-layer functions, including functions that do not call `fetch` directly:

```ts
import { cacheTag, cacheLife } from 'next/cache';

export async function getReference() {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return { masechtot, shuSections, topics, books };
}
```

Requires `cacheComponents: true` in `next.config.ts`; this is part of the project contract.

### 3. `react.cache()` For Per-Request Dedup
Used when the same fetch may run more than once within a single request, such as `generateMetadata` and page body:

```ts
export const getStory = cache(async (id: string) => {
  // ...
});
```

This is not persistent across requests. It deduplicates only within one request.

---

## Entity Strategy Table

| Entity | Strategy | TTL | Tags |
|--------|----------|-----|------|
| Reference data: masechtot, topics, books, Shulchan Aruch sections | `'use cache'` + `cacheLife('hours')` | Hours, until invalidated | `reference` |
| Single story | `next: { tags: [...] }` | Until invalidated | `story`, `story:<id>` |
| Featured entry selection | `next: { revalidate, tags }`, then resolve selected ids through `getStory(id)` | 1 hour for selection; story TTL for each full story | `featured`, plus `story:<id>` for each story |
| Sitemap | `export const revalidate = 3600` | 1 hour | None |
| Search-filtered story list | No cache | None | None |
| User profile | No cache | None | None |
| Contact submission | No cache; mutation | None | None |

---

## Tag Conventions

Stable tags:
- `reference`: the full reference bundle.
- `featured`: the ordered home-page featured selection.
- `stories`: broad story-list invalidation when needed; do not use it for dynamic search results.
- `story`: all stories.
- `story:<id>`: one specific story.
- `user:<id>`: reserved for a future explicit decision to cache user data.

Revalidation:

```ts
// admin/webhook endpoint
import { revalidateTag } from 'next/cache';

revalidateTag('story:abc123', 'max');
revalidateTag('reference', 'max');
revalidateTag('stories', 'max');
```

---

## Client-Side Cache Policy

With Next.js 16 Cache Components, client navigation preserves nearby route state through React Activity and the router cache:
- Navigating back to `/search` restores screen state without a manual Zustand cache.
- Reference data flows again through the RSC payload when the route is reloaded or refreshed.

Do not add a client-side cache layer that imitates this. `useStoryDetailStore` stores only the current story.

---

## Non-Urgent Recommendations

1. **Custom `cacheLife` profiles.** Define profiles in `next.config.ts`, for example `reference: { stale: 300, revalidate: 3600, expire: 86400 }`.
2. **Direct `useSyncExternalStore`.** If Zustand feels too large for a tiny store, a native store is possible, but do not mix state patterns casually.
3. **React 19 `use(promise)`.** Pass promises through RSC and let Suspense consume them where streaming improves UX.
4. **Persisted Zustand.** Use `zustand/middleware/persist` only for non-business source-of-truth state, such as last-used UI filters.
5. **Service Worker / IndexedDB for reference data.** Consider only if reference data becomes large or the core API is slow enough to justify offline-first behavior.
