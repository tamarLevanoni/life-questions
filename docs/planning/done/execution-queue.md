# Planning Files — Execution Queue

Execution order with isolated agent prompts. Each step runs in its own worktree.

---

## Step 1 — agent-docs-sync (docs only, no worktree needed)
Add sync notices to AGENTS.md and CLAUDE.md.

**Files:** `AGENTS.md`, `CLAUDE.md`

**Action:**
- Add a top-level notice at the top of `AGENTS.md`: "This file is an operational copy for coding agents. The durable source of truth is `docs/specs/`. Any change to agent-facing architecture, data-flow, caching, routing, auth, store, or design guidance must either be mirrored here or moved back into the relevant spec."
- Verify `CLAUDE.md` already has the same notice (it does per current content). If not, add it.

---

## Step 2 — specs-foundation-refactor (docs only)
Align docs/specs/* to neutral, permanent specs.

**Files:** All files under `docs/specs/`

**Action:**
- Add "Source of Truth" statement to each spec file
- Remove transitional language ("currently", "after we enable")
- Move implementation gaps to a `docs/specs/transition-gaps.md` file with the table from `specs-foundation-refactor.md`
- Verify `README.md` points to `docs/specs/` as canonical reference

---

## Step 3 — search-results-store-contract (docs only)
Update store naming in specs.

**Files:** `docs/specs/*`, comments in `lib/stores/stories-store.ts`

**Action:**
- In all spec files: rename `useStoriesStore` → `useSearchResultsStore`
- Add comment to `lib/stores/stories-store.ts`: transitional name, will become `useSearchResultsStore`
- Add explicit note: featured stories are NOT part of this store
- Add ban: no client-side ranking/filtering/sorting/scoring/match interpretation

---

## Step 4 — claudemd-update (docs only)
Replace "Page Architecture Rules" in CLAUDE.md.

**Files:** `CLAUDE.md`

**Action:** Replace the Page Architecture section with the new template from `claudemd-update.md`:
- Server Component by default for page.tsx
- Pattern template (page → view → hook)
- Hard 120-line limit
- Allowed/forbidden lists
- Co-location and data layer rules

---

## Step 5 — story-refactor (code)
Convert story page to Server Component.

**Files:**
- `app/story/[id]/page.tsx` → Server Component (~10 lines)
- NEW `app/story/[id]/_components/use-story-detail.ts`
- NEW `app/story/[id]/_components/story-view.tsx`
- NEW `app/story/[id]/_components/story-back-link.tsx`
- NEW `app/story/[id]/_components/story-question-cta.tsx`

**Action:**
1. Create `use-story-detail.ts` hook with: useParams, useRouter, useSession, useStoryDetailStore, useReferenceStore, fetchStory effect with cleanup, computed canViewExpansion/book/prevId/nextId/storyTitleEncoded, requestExpansionAccess handler
2. Create `story-view.tsx` ('use client', ~60 lines): calls useStoryDetail(), renders loading/error/story in MotionFadeIn
3. Create `story-back-link.tsx`: link back to search
4. Create `story-question-cta.tsx`: CTA to /contact with query params
5. Rewrite `page.tsx` to ~10-line Server Component wrapping StoryView in PageShell maxWidth="3xl"
6. Remove loadAll() call (ReferencePreloader handles it)
7. Run: bunx tsc --noEmit && bun lint
8. Verify: loading skeleton, error state, valid story, expansion auth gate, prev/next nav, page.tsx has no 'use client'

---

## Step 6 — profile-refactor (code)
Move auth gate to middleware, convert profile page to Server Component.

**Files:**
- `proxy.ts` (root middleware) — add /profile matcher
- `app/profile/page.tsx` → Server Component (~8 lines)
- NEW `app/profile/_components/profile-view.tsx`

**Action:**
1. In `proxy.ts`: add `/profile/:path*` to the matcher; check NextAuth session cookie; redirect to `/` if missing
2. Create `profile-view.tsx` ('use client'): useSession, useUserStore, compute fullName/initials, render ProfileSkeleton while loading, otherwise compose sections with useProfileForm(user). NO redirect() here.
3. Rewrite `page.tsx` to ~8-line Server Component wrapping ProfileView in PageShell maxWidth="2xl"
4. Run: bunx tsc --noEmit && bun lint
5. Verify: unauthenticated → redirected by middleware; authenticated → loading then all sections; edit/save works; page.tsx has no 'use client'

---

## Step 7 — contact-expansion-visibility (code)
Guard expansion field in contact payload by auth + visibility.

**Files:** `app/contact/_components/use-contact-form.ts` (or equivalent form hook)

**Action:**
- In onSubmit: include `story.expansion` in payload ONLY when: user is authenticated AND story.expansion is non-null AND canViewExpansion is true
- Locked expansion must never be sent
- Run: bunx tsc --noEmit && bun lint
- Verify: guest contact omits expansion; authenticated user with visible expansion includes it

---

## Step 8 — contact-refactor (code)
Split 240-line contact-form.tsx into hook + view.

**Files:**
- `app/contact/_components/contact-form.tsx` → ~80-line view
- NEW `app/contact/_components/use-contact-form.ts`
- NEW `app/contact/_components/contact-categories.ts`
- NEW `app/contact/_components/contact-success-dialog.tsx`

**Action:**
1. Create `contact-categories.ts`: extract BASE_CATEGORIES, STORY_CATEGORY, CategoryItem type
2. Create `contact-success-dialog.tsx`: extract success dialog JSX
3. Create `use-contact-form.ts`: useForm with zodResolver, isSubmitting/successOpen state, useContactStore/useStoryDetailStore/useSession/useToast integrations, effect syncing storyId/storyTitle/category from query params + fetchStory if needed, onSubmit handler (submit → toast → dialog on success → clear). Apply expansion guard from step 7.
4. Rewrite `contact-form.tsx`: 'use client', ~80 lines, JSX only. Use FormField from @/components/ui/form-field. Call useContactForm({ storyId, storyTitle }).
5. Run: bunx tsc --noEmit && bun lint
6. Verify: submit flow, arriving with query params pre-fills form, field errors, contact-form.tsx < 120 lines

---

## Step 9 — search-refactor (code)
Split 182-line search-client.tsx into 6 components + hook.

**Files:**
- DELETE `app/search/_components/search-client.tsx`
- NEW `app/search/_components/use-search.ts`
- NEW `app/search/_components/search-view.tsx`
- NEW `app/search/_components/search-header.tsx`
- NEW `app/search/_components/search-filters-sidebar.tsx`
- NEW `app/search/_components/search-filters-drawer.tsx`
- NEW `app/search/_components/search-mobile-filter-button.tsx`
- NEW `app/search/_components/search-results-panel.tsx`
- MODIFY `app/search/page.tsx`: replace SearchClient → SearchView import

**Action:**
1. Create `use-search.ts`: useSearchResultsStore, useReferenceStore, useSession, useAuth, useRouter, login modal effect (once), state (query/filters/hasSearched/filterDrawerOpen), computed (activeFiltersCount/hasMore/isUnauthenticated), buildServerSearchParams(uiFilters), handlers (handleSearch/handleLoadMore/handleStoryClick/closeDrawerAndSearch). NO client-side filtering/ranking.
2. Create `search-header.tsx`: page title/subtitle
3. Create `search-filters-sidebar.tsx`: desktop aside with CategoryFilterBar
4. Create `search-filters-drawer.tsx`: Sheet with CategoryFilterBar
5. Create `search-mobile-filter-button.tsx`: button + badge
6. Create `search-results-panel.tsx`: SearchBar, filter button, ActiveFilterTags, SearchResultsList, AuthRequiredOverlay
7. Create `search-view.tsx` ('use client', ~40 lines): calls useSearch(), composes all panels
8. Update `page.tsx`: swap import
9. Delete `search-client.tsx`
10. Run: bunx tsc --noEmit && bun lint
11. Verify: desktop search/filter/pagination, mobile drawer, unauthenticated overlay, all files < 120 lines

---

## Step 10 — featured-entry-stories (code)
Load featured stories via RSC getStory + prime store on click.

**Files:**
- `app/page.tsx` (or `app/_components/featured-stories-section.tsx`)
- `lib/stores/story-detail-store.ts` — add narrow prime(story) action if missing

**Action:**
1. In home page RSC: fetch featured story IDs, resolve each via getStory(id) to warm cache
2. Pass full story data to featured-stories-section
3. In story card click handler: call useStoryDetailStore.prime(story) before router.push('/story/:id')
4. Ensure featured stories NOT stored in useSearchResultsStore
5. Run: bunx tsc --noEmit && bun lint
6. Verify: home page shows featured cards, clicking navigates to story with no extra loading flash

---

## Step 11 — page-architecture-server-boundary (verification pass)
Verify all pages comply with Server Component boundary rules.

**Action (read-only audit):**
- Check each page.tsx for 'use client' → must be absent
- Check line counts: page.tsx, all _components/* files < 120 lines
- Check proxy.ts has matchers for all gated routes
- Run: bunx tsc --noEmit && bun lint && bun build
- Report any remaining violations

---

## Step 12 — component-architecture-refactor Phase 4 (cleanup)
Final cleanup after all refactors.

**Action:**
- Check if `components/sections/insights-section.tsx` is unused → delete if so
- Replace any remaining raw `.glass-card` class usages with `<GlassCard>` component
- Verify `lib/api-client.ts` exists (created in earlier phase); if not, create it with apiCall<T>
- Run: bun build
- Final manual smoke test: home, search, story, profile, contact
