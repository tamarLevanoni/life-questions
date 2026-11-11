# State, hydration and cache

## Goal

Describe the implemented ownership of state and caching without adding parallel caches.

## Stores

| Store | Ownership | Initialization |
|---|---|---|
| `useAppDataStore` | masechtot, Shulchan Aruch sections, topics, books, featured stories, weekly story | provider-scoped `createAppDataStore` via `AppDataHydrator` |
| `useStoriesStore` | full stories by id; ordered search cards, pagination, loading/error/authRequired | `StoryHydrator` and search actions |
| `useUserStore` | profile, authStatus and image | `SessionUserSync`; profile/onboarding actions |
| `useContactStore` | submission progress and success | contact form actions |

These are the current store names. Do not rename or split them as incidental maintenance. Full stories and partial search cards are different shapes. Do not put featured stories into search results. Search ordering/ranking is owned by the Core API, not browser code. The search route owns its draft/submitted filters, active tab and setup/results view locally; switching tabs or returning to the draft does not reset selections or submit a request. Pagination reads the submitted snapshot, including while the desktop results query is being edited. Clear all resets local search state and returns to setup without issuing a request.

## Hydration

`AppDataLoader` fetches the bundle server-side and wraps consumers. `AppDataHydrator` uses lazy `useState` to create a store per provider/SSR tree; it never mutates a shared app-data store during render. The root provider retains that initial bundle through client navigation.

[`StoryHydrator`](../../components/story/story-hydrator.tsx) synchronously primes `useStoriesStore` with a lazy initializer; the server keys the bridge by story id so a new story initializes on mount. Unlike app data, the story/user/contact stores are module-level Zustand stores. The app-data SSR isolation tests do not establish request isolation for those stores. Client story consumers read the store, not an initial-prop fallback.

Auth status begins `idle`; session synchronization runs in a client effect. Render loading UI while auth data is pending. These stores use in-memory state without persistence middleware; a full reload creates new browser state.

## Implemented server caching

[`next.config.ts`](../../next.config.ts) enables `cacheComponents: true`. Persistent caches use `use cache`, `cacheLife`, `cacheTag`; do not introduce legacy segment `revalidate`, `fetchCache` or an alternate manual caching system. `react.cache` is only request-level deduplication. Cache lifetimes/tags are defined in [app-data.ts](../../lib/server/app-data.ts) and [recommendations.ts](../../lib/server/recommendations.ts); [stories.ts](../../lib/server/stories.ts) owns individual reads/search.

| Data/function | Current behavior | Tag |
|---|---|---|
| Reference lists | `cacheLife('hours')` | `reference` |
| Featured full stories | GET selection cached for hours | `featured` |
| Weekly story, nullable | GET cached with `cacheLife('weeks')` | `weekly` |
| Recommendations | GET cached for hours | `recommendations` |
| `getStory(id)` | `react.cache`, no persistent story cache | none |
| Search, user, mutations | no persistent shared cache | none |

Only public, session-independent GET data in the table may be cached. Never read cookies, headers, roles or user state inside a shared cache. Tags exist, but a webhook/invalidation endpoint is not implemented. Do not invent one in an example as if it were deployed.

## Featured and weekly routes

The root bundle contains full `Story[]` examples and `Story | null` weekly content. `/story/featured/[id]` resolves from that bundle, including the weekly story. The page resolves its `params` inside Suspense and passes a fixed story id to the client view; retained Activity trees must not use the destination URL's params for this lookup. A missing story renders an empty state. The weekly story link uses that route too. Its shareability is an open product question, not a license to redirect it during cleanup.

## Deferred work

Persistent single-story caching, sitemap caching, invalidation and weekly TTL changes require separate decisions and verification; see the [backlog](../planning/backlog.md).
