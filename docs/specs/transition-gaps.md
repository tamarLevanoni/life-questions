# Transition Gaps

| Domain | Transitional Gap | Closure |
|--------|-----------------|---------|
| Cache Components | next.config.ts does not enable cacheComponents | Enable after cache paths ready, migrate to 'use cache' + cacheTag + cacheLife |
| backendFetch | Type accepts only RequestInit | Extend to allow next: { revalidate, tags } |
| Hydration | StoreHydrator uses useEffect | Move to synchronous during render with useRef |
| Reference store | loadAll() and app/api/reference/* still exist | Keep RSC-only, remove actions/endpoints |
| Story store | storyCache: Map still exists | Keep only current story, rely on Next cache |
| Auth sync | SessionUserSync can overwrite server-hydrated user | Sync only when store empty or separate auth/profile |
| Zod import | Uses zod/v4 but docs required zod | Decide on from 'zod' spec then align code |
| Legacy docs | README.md has quick-start only | docs/specs/* is single source of truth |
