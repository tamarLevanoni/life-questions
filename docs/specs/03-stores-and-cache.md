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

The canonical store name is `useSearchResultsStore`, defined in `lib/stores/search-results-store.ts`. The old `lib/stores/stories-store.ts` / `useStoriesStore` no longer exist; do not reintroduce them.

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

## Caching Model: Cache Components Only

`cacheComponents: true` is enabled globally in [next.config.ts](../../next.config.ts). All routes are dynamic by default. Persistent caching is **opt-in only**, declared close to the data access using `'use cache'` + `cacheLife` + `cacheTag`.

Do not introduce `export const revalidate`, `next: { revalidate }`, or `fetchCache` route-segment configs anywhere in the App Router. With Cache Components enabled, those segment configs are replaced by `'use cache'` and `cacheLife`. Mixing the two models is a known source of bugs and of conflicting agent-facing instructions.

### `'use cache'` Directive
Used for Next-layer server functions, including functions that do not call `fetch` directly. The function must be serializable and its inputs must be determined (no `cookies()` / `headers()` reads inside).

```ts
import { cacheTag, cacheLife } from 'next/cache';

export async function getReference() {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return { masechtot, shuSections, topics, books };
}
```

### `cacheTag`
Attached for every entity that an admin/webhook can update. Tag names are managed in the Tag Conventions section below. Invalidation flows through `revalidateTag` from an admin or webhook route.

### `react.cache()` — Per-Request Dedup Only
*Only* deduplicates repeated server calls within a single request (e.g. `getStory` called from both `generateMetadata` and the page). Not persistent across requests; never a substitute for `'use cache'`. Pair `react.cache()` with `'use cache'` when persistence is also required.

```ts
export const getStory = cache(async (id: string) => {
  // ...
});
```

---

### Page-Level Suspense For Data Streaming

Pages must not await data at the top level. The pattern is: keep `page.tsx` sync and push data fetching into a child Server Component, wrapping only the data-dependent slot in its own `<Suspense>` with a meaningful fallback. The static sections (hero, features, section titles) sit outside that boundary and prerender into the shell.

See [app/_components/featured-stories-section.tsx](../../app/_components/featured-stories-section.tsx) for the canonical example: a sync exported wrapper renders the section header + a `<Suspense>` around an async `FeaturedStoriesContent` + a skeleton sized to the cards area only. The home page (`/`) ends up fully prerendered as Static while the cards stream in.

---

### Auth As A Set Of Small Dynamic Islands

`SessionProvider` lives high in the tree (in [app/providers.tsx](../../app/providers.tsx)) so a single session context is shared, but **`useSession()` is forbidden outside designated islands.** [app/layout.tsx](../../app/layout.tsx) does not wrap children in a broad `<Suspense>` — that workaround makes the entire page dynamic and defeats Cache Components.

The only legal `useSession()` consumers are:

| Island | Path | Purpose |
|--------|------|---------|
| `AuthRuntime` | [components/auth/auth-runtime.tsx](../../components/auth/auth-runtime.tsx) | Wrapped in a single `<Suspense>` inside `<Providers>`. Hosts `SessionUserSync`, `OnboardingTrigger`, `LoginModal`, `OnboardingModal`. |
| `HeaderAuthDesktop` | [components/layout/header-auth-desktop.tsx](../../components/layout/header-auth-desktop.tsx) | Wrapped in its own `<Suspense>` inside `<AppHeader>`. |
| `HeaderAuthMobile` | [components/layout/header-auth-mobile.tsx](../../components/layout/header-auth-mobile.tsx) | Same, for the mobile menu's auth section. |
| `ProfileView` | [app/profile/_components/profile-view.tsx](../../app/profile/_components/profile-view.tsx) | Reads `session.user.image` (not on `UserData`). The page wraps it in `<Suspense fallback={<ProfileSkeleton />}>`. |

Everywhere else — page hooks (`use-search`, `use-story-detail`, `use-contact-form`), the rest of the header shell, and any other client code — must read auth state from `useUserStore` (`user`, `authStatus`). `SessionUserSync` is the single bridge that writes both fields from the session.

`AuthProvider` is UI-only: it owns the modal open/close state and exposes `useAuth()` to anyone who needs to open the login or onboarding modal. It does **not** read session.

If a new feature truly needs `useSession()`, treat it as a new island: extract the session-dependent fragment to its own client component and wrap it in `<Suspense>` at its render site, with a meaningful skeleton. Do not reintroduce a broad root `<Suspense>` and do not move `SessionProvider` deeper.

---

## Cache Safety Rules

A function or component may use `'use cache'` only if **all** of the following hold:

1. The result is safe to share between all users.
2. The result does not depend on session, cookies, headers, role, user id, or permissions.
3. The result does not depend on a request body.
4. The result has a clear invalidation strategy (`cacheTag` + an admin/webhook route that calls `revalidateTag`).
5. The entity appears in the Entity Strategy Table below.

Never use `'use cache'` for: user profile, session/auth/roles, coordinator or admin dashboards, search results, request-body-based reads, mutations, or any POST/PATCH/DELETE flow.

**Cacheable requests must be GET.** If a backend read uses POST, add a GET variant before attempting to cache it.

---

## Entity Strategy Table

| Entity | Strategy | TTL | Tags |
|--------|----------|-----|------|
| Reference bundle (masechtot, topics, books, Shulchan Aruch sections) | `'use cache'` + `cacheLife('hours')` | hours | `reference` |
| Single public story | `'use cache'` + `cacheLife('days')` | days, until invalidated | `story`, `story:<id>` |
| Featured entry stories (full) | `'use cache'` + `cacheLife('hours')` via `GET /api/stories/featured` *(see note below)* | hours | `featured` |
| Sitemap / public metadata | `'use cache'` + `cacheLife('hours')` | hours | optional |
| Search results | **no persistent cache** | — | — |
| User profile | **no persistent cache** | — | — |
| Session / roles | **no persistent cache** | — | — |
| Mutations | **no cache** | — | — |

---

### Note: Random Featured Stories Are Stable Per Cache Window

The core API endpoint `GET /api/stories/featured` returns three randomly selected stories. Wrapping it in `'use cache' + cacheLife('hours')` means the selection rotates once per cache window — within the hour every visitor sees the same three "examples". This is intentional: a fresh random draw on every request would be uncacheable and would defeat the point of using the home page as a stable preview surface. To force an earlier rotation, an admin/webhook route may call `revalidateTag('featured')`.

---

## Implementation Gaps Tracked Against This Spec

These are known gaps where the current code does not yet match the table above. They are intentionally listed here so any change in this area updates both the code and the spec together.

- **`getStory` lacks persistent cache.** [lib/server/stories.ts](../../lib/server/stories.ts) currently uses only `react.cache()`. Target: an inner fetcher wrapped in `'use cache' + cacheLife('days') + cacheTag('story') + cacheTag(\`story:${id}\`)`, with `react.cache()` on the outside for per-request dedup.
- **Sitemap is uncached.** [app/sitemap.ts](../../app/sitemap.ts) calls `getStoriesByQuery` directly with no cache. Target: wrap the story-list call in `'use cache' + cacheLife('hours')`.

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
