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

| Store | File | Role | First Hydration Source |
|-------|------|------|------------------------|
| `useAppDataStore` | `lib/stores/app-data-store.ts` | masechtot, shuSections, topics, books, featuredStories, weeklyStory — read-only on client | `AppDataHydrator` in root layout — once per session |
| `useStoriesStore` | `lib/stores/stories-store.ts` | (1) entity cache `stories: Record<id, StoryWithNeighbors>` — full stories by ID; (2) `searchResults: StoryCard[]` + pagination/loading/error | `StoryHydrator` (story page) + search actions |
| `useUserStore` | `lib/stores/user-store.ts` | Authenticated user + authStatus — single source of truth | `SessionUserSync` from JWT on session change |
| `useContactStore` | `lib/stores/contact-store.ts` | Contact-form submission state | None; action state only |

Rules:
- `useStoriesStore.stories` holds only `StoryWithNeighbors` (full). Written by `StoryHydrator` on story page visit.
- `useStoriesStore.searchResults` holds `StoryCard[]` (partial). Replaced on new search, appended on load-more.
- The two are separate: search results are never inserted into the entity cache.
- Featured stories are in `useAppDataStore.featuredStories` — not in `useStoriesStore`.
- `useUserStore` is populated entirely from the JWT via `SessionUserSync`. No RSC fetch for user data.

> **Search hooks/stores must not perform client-side ranking, filtering, sorting, scoring, or match interpretation. All filtering is done server-side.**

### Featured Entry Stories

The home page shows featured example stories. They are loaded as full `Story[]` via `getFeaturedStories()` and stored in `useAppDataStore.featuredStories`.

Implementation contract:
- Featured stories are not search results and never belong in `useStoriesStore.searchResults`.
- The featured story route (`/story/featured/[id]`) looks up by ID from `useAppDataStore.featuredStories` — if not found, redirects to home (these are runtime-random, never bookmarked).
- Featured story cards use `ScenarioCard` with `story.topic.name` directly (full `Story` has `topic: Topic` inline).

### Weekly Story

The home page shows one video-backed "story of the week". It is loaded as `Story | null` via `getWeeklyStory()` and stored in `useAppDataStore.weeklyStory`.

Implementation contract:
- `GET /api/stories/weekly` returns a full `Story` (no `neighbors`), or `data: null` (still `200`) if the backend has no story with a video for the current week — parse with `storySchema.nullable()`.
- `VideoSection` (`app/_components/video-section.tsx`) reads `weeklyStory` from the store and renders `null` when `weeklyStory` is `null` or `weeklyStory.videoUrl` is `null`.
- Unlike featured stories, the weekly story is a real, permanent backend entity — its CTA links directly to `/story/[id]`, not through a store-lookup route.

---

## Hydration Requirement

Each store has a dedicated hydrator — a focused client component that writes synchronously during render (guarded by `useRef`), never inside `useEffect`.

| Hydrator | Location | Store | When |
|---------|----------|-------|------|
| `AppDataHydrator` | `components/providers/app-data-hydrator.tsx` | `useAppDataStore` | Root layout — once per session |
| `StoryHydrator` | `app/story/[id]/_components/story-hydrator.tsx` | `useStoriesStore` (entity cache) | Story page — upserts `StoryWithNeighbors` by ID |
| `SessionUserSync` | `components/providers/session-user-sync.tsx` | `useUserStore` | Global — on session status change |

```tsx
// pattern — synchronous write during render
'use client';
export function XHydrator({ data }: { data: X }) {
  const hydratedId = useRef<string | null>(null);
  if (hydratedId.current !== data.id) {
    useXStore.getState().setX(data);
    hydratedId.current = data.id;
  }
  return null;
}
```

What this solves:
- Write runs before children render → store is populated for the first client paint.
- `useRef` guard makes it first-run only and safe under Strict Mode.

Rules for `use-<route>.ts` hooks:
- Read only from stores. Do not read `useInitialData()` or `initial*` props.

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
| Weekly story (full, nullable) | `'use cache'` + `cacheLife('hours')` via `GET /api/stories/weekly` | hours | `weekly` |
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
- **Sitemap is uncached.** [app/sitemap.ts](../../app/sitemap.ts) calls `searchStories` directly with no cache. Target: wrap the story-list call in `'use cache' + cacheLife('hours')`.

---

## Tag Conventions

Stable tags:
- `reference`: the full reference bundle.
- `featured`: the ordered home-page featured selection.
- `weekly`: the home-page "story of the week" (nullable — may resolve to no story with video for the week).
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

Do not add a client-side cache layer that imitates this. `useStoriesStore.stories` is the entity cache — populated by `StoryHydrator` on page visit, consumed by the contact form via `storyId` URL param.

---

## Non-Urgent Recommendations

1. **Custom `cacheLife` profiles.** Define profiles in `next.config.ts`, for example `reference: { stale: 300, revalidate: 3600, expire: 86400 }`.
2. **Direct `useSyncExternalStore`.** If Zustand feels too large for a tiny store, a native store is possible, but do not mix state patterns casually.
3. **React 19 `use(promise)`.** Pass promises through RSC and let Suspense consume them where streaming improves UX.
4. **Persisted Zustand.** Use `zustand/middleware/persist` only for non-business source-of-truth state, such as last-used UI filters.
5. **Service Worker / IndexedDB for reference data.** Consider only if reference data becomes large or the core API is slow enough to justify offline-first behavior.
