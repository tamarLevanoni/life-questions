# Spec Files Reset Plan

## Goal
Align code and documentation to a stable, neutral, long-lived specification. Files in `docs/specs/*` are not a temporary work plan; they are the project contract. Transitional state is documented here only.

## Why Now
The project is mid-way through a broad refactor. Some documents describe the architectural target, and some still preserve old MVP decisions. For the spec to remain useful throughout the project's lifetime, it must describe permanent principles and decisions only; implementation gaps, work order, and transitional deletions will stay in this document.

## Scope
- Add a permanent source-of-truth statement to the spec documents.
- Update spec documents to be neutral: no "currently", no "after we enable", no temporary debt lists.
- Move implementation gaps to the transition plan here.
- Delete old sources competing with `docs/specs/*`.

## Out of Scope
- No application code changes.
- No removing endpoints or stores.
- No migrating to Auth.js v5.
- No enabling `cacheComponents` in code yet.

## Implementation Gaps to Close Per Spec

| Domain | Transitional Gap | Desired Closure |
|--------|-----------------|-----------------|
| Cache Components | `next.config.ts` does not yet enable `cacheComponents`. | Enable after cache paths are ready, then migrate reference/story/featured to `use cache` + `cacheTag` + `cacheLife`. |
| `backendFetch` | Type accepts only `RequestInit`. | Extend to a type that allows `next: { revalidate, tags }` so every Core API call passes through a single wrapper. |
| Hydration | `StoreHydrator` still uses `useEffect`, so hooks hold a fallback to `useInitialData`. | Move hydration to synchronous during render with `useRef`, then remove fallbacks from hooks. |
| Reference store | `loadAll()` and calls to `app/api/reference/*` still exist. | Keep reference data as RSC-only and remove actions/endpoints not required for user-driven flow. |
| Story store | `storyCache: Map` still exists. | Keep only the current `story` and rely on Next cache + router cache. |
| Auth sync | `SessionUserSync` can overwrite a rich server-hydrated user. | Sync session only when the store is empty, or separate auth status from profile data. |
| Zod import | Code uses `zod/v4`, some documents required `zod`. | Decide in spec on `from 'zod'` for an app with `zod@4`, then align code later. |
| Legacy docs | `README.md` contains quick-start details only. | `docs/specs/*` remains the only source of truth for the spec. |

## Suggested Refactor Order
1. Harden server boundaries: `server-only`, `backendFetch`, `runRoute`, Zod validation.
2. Enable Cache Components and configure tags/profiles.
3. Move hydration to synchronous and remove `useInitialData` from hooks.
4. Clean up transitional Stores and BFF paths.
5. Fix Auth/session sync.
6. Add basic tests and CI.
