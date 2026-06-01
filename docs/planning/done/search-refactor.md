# Refactor — `app/search/`

## Context

[`app/search/_components/search-client.tsx`](../../app/search/_components/search-client.tsx) is 182 lines mixing 3 layers: orchestration/auth/state, handlers, and JSX layout (sidebar + drawer + results). It violates the 120-line limit in CLAUDE.md and makes it hard to read and modify. The page itself ([`app/search/page.tsx`](../../app/search/page.tsx)) stays a clean server component, which is desirable.

## Changes

Under `app/search/_components/`:

### New Files

- **`use-search.ts`** — a single hook centralizing everything:
  - stores: `useSearchResultsStore`, `useReferenceStore`.
  - auth: `useSession`, `useAuth`.
  - navigation: `useRouter`.
  - effect: open login modal when `status === 'unauthenticated'` (once).
  - state: `query`, `filters`, `hasSearched`, `filterDrawerOpen`.
  - computed: `activeFiltersCount`, `hasMore`, `isUnauthenticated`.
  - internal: `buildServerSearchParams(uiFilters: UiSearchFilters): SearchBody`.
  - search responsibility: URL/search parameter state, debouncing, request cancellation, and loading/error state.
  - no client-side ranking, filtering, sorting, scoring, or match interpretation.
  - handlers: `handleSearch`, `handleLoadMore`, `handleStoryClick(id)`, `closeDrawerAndSearch`.
  - returns a single object providing everything the components need (including reference data for `CategoryFilterBar`).
  - analogous to: [`app/profile/_components/use-profile-form.ts`](../../app/profile/_components/use-profile-form.ts).

- **`search-view.tsx`** (`'use client'`, ~40 lines) — calls `useSearch()` and composes:
  ```
  <SearchHeader />
  <div className="flex gap-6 items-start" dir="rtl">
    <SearchFiltersSidebar ... />
    <SearchFiltersDrawer ... />
    <SearchResultsPanel ... />
  </div>
  ```
  This is the only orchestrator that knows about all its children.

- **`search-header.tsx`** — page title and subtitle. Pure component.

- **`search-filters-sidebar.tsx`** — the desktop `<aside>` wrapping `CategoryFilterBar` (including card border + sticky). Receives reference data + `filters/onFiltersChange/onSearch`.

- **`search-filters-drawer.tsx`** — `<Sheet>` with `CategoryFilterBar` inside, receives `open / onOpenChange` + reference data + filters.

- **`search-mobile-filter-button.tsx`** — filter button + badge. Receives `onClick` and `activeFiltersCount`.

- **`search-results-panel.tsx`** — contains: `SearchBar`, `<SearchMobileFilterButton>`, `ActiveFilterTags`, `SearchResultsList`, `AuthRequiredOverlay`. `relative` stays.

### Changes to Existing Files

- **`app/search/page.tsx`** — replace `import { SearchClient }` with `import { SearchView }`. Still server, no `'use client'`. ~10 lines.

### Deleted

- **`search-client.tsx`** — deleted entirely.

### Unchanged

`search-bar.tsx`, `category-filter-bar.tsx`, `category-sub-filters.tsx`, `search-combobox.tsx`, `active-filter-tags.tsx`, `search-results-list.tsx`, `auth-required-overlay.tsx`.

## Verification

- `bunx tsc --noEmit` + `bun lint`.
- `bun dev`, `/search`:
  - Desktop: sidebar displayed, search, `load more`, clicking a result navigates to `/story/:id`, tags update.
  - Mobile (DevTools responsive): filter button + badge working, drawer opens, filtering + search closes drawer.
  - Unauthenticated: `AuthRequiredOverlay` above results, login modal opens automatically once.
- Every file in `_components/` < 120 lines.
- `page.tsx` without `'use client'`.
