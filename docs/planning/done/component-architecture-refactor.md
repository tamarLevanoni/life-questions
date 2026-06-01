# Plan: Proper Component Split + Shared Infrastructure

## Context

The project is based on Next.js 16 App Router with Tailwind CSS 4, shadcn/ui, and Zustand. A review surfaced three main problems:

1. **Fat pages** – `app/profile/page.tsx` (452 lines), `app/story/[id]/page.tsx` (320), `app/page.tsx` (272). Each contains numerous inline "sections" that are not testable or reusable.
2. **Graphical duplication** – `motion.div` animations with identical props repeated 8+ times; section headings repeated 5+ times; badges/chips repeated 5+ times; a PageShell pattern of `<AppHeader/> + main rtl + pt-24` repeated on every page; a "form-field frame" (Label + Input + error) embedded in both contact and profile.
3. **Fragile data layer** – `app/page.tsx` and `app/story/[id]/page.tsx` are client components that fetch in `useEffect` instead of RSC; `ReferencePreloader` runs in parallel and creates potential noise; every store duplicates the same `fetch → res.json → success/error` logic; errors in `stories-store.loadFeaturedStories` are silently swallowed.

The goal: an architecture where every page is a thin orchestrator composing semantic sections, shared primitives handle repeated styling, and the data layer is reliable and predictable.

Per the user's instructions: components with potential for future reuse go to `components/`; components unique to a specific page go in `app/<route>/_components/` following the existing pattern in `app/contact/_components/`.

---

## Phase 1 – New Shared Primitives under `components/ui/` and `components/common/`

New files:

### `components/ui/section-header.tsx`
Replaces the `<div className="text-center mb-12"><h2>...</h2><p>...</p></div>` pattern repeated in `app/page.tsx:151-163, 196-208`, `components/sections/about-section.tsx:66-73`, and `components/sections/cta-section.tsx`.
```ts
type Props = { title: string; subtitle?: string; align?: 'center' | 'start'; size?: 'sm' | 'md' | 'lg' };
```

### `components/ui/badge.tsx`
A single Badge primitive with variants (`primary`, `muted`, `outline`, `teal`, `source-shas`, `source-shu`, `concept`) that replaces:
- source badges in `app/story/[id]/page.tsx:169-184`
- filter chips in `components/search/search-client.tsx:108-122`
- chips in `search-combobox.tsx:69-80`
- occupation chips in `app/profile/page.tsx:357-362`
- badge in `components/story/scenario-card.tsx:62`

Optionally accepts `onRemove` and renders `<X/>` (replacing the "filter tag with remove button" pattern).

### `components/common/motion-fade-in.tsx`
Wraps `motion.div` with `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` and `transition={{ delay }}`. Replaces 8+ identical occurrences in `app/page.tsx`, `components/sections/*`, and `app/story/[id]/page.tsx:235-265`.
```ts
type Props = { children: ReactNode; delay?: number; y?: number; as?: 'div' | 'article' | 'section' };
```

### `components/common/page-shell.tsx`
Replaces `<main className="min-h-screen bg-background" dir="rtl"><AppHeader/>...<div className="pt-24 pb-12 px-4">...` repeated on every page.
```ts
type Props = { children: ReactNode; maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '6xl' };
```

### `components/common/empty-state.tsx`
React component around the existing `.empty-state` class (`app/globals.css:768`). Replaces the JSX in `components/search/search-results-list.tsx:31-38` and the error screen in `app/story/[id]/page.tsx:61-83`.
```ts
type Props = { icon?: LucideIcon; title: string; description?: string; action?: ReactNode };
```

### `components/common/loading-skeleton.tsx`
Two exports: `<SkeletonLines count rows />` for simple skeletons (shared by `search-results-list.tsx:20-28` and `app/story/[id]/page.tsx:46-58`), and `<SkeletonCardList count />` for lists with GlassCard skeletons (shared with the internal `ProfileSkeleton` in `app/profile/page.tsx:46-70`).

### `components/ui/form-field.tsx`
Unifies the Label + Input + error pattern already inlined in `app/contact/_components/contact-form.tsx:29-44` (already abstracted there, just promoted to project level) and in every personal-details section in `app/profile/page.tsx:225-316`.
```ts
type Props = { label: string; error?: string; hint?: string; locked?: boolean; children: ReactNode };
```
Used as: `<FormField label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></FormField>`.

### `components/ui/branded-button.tsx` (if not already under `button-primary`)
After checking: `components/ui/button-primary.tsx` exists at 44 lines. Verify it covers all CTAs (`Link` with class `inline-flex items-center gap-2 px-8 py-4 bg-primary...`) repeated 6+ times. If not – extend variants rather than create a new file. **Do not create a duplicate.**

---

## Phase 2 – Splitting Large Pages

### `app/page.tsx` (272 → ~50 lines)
Five separate sections under `app/_components/home/` (low reuse potential – unique to landing):
- `hero-section.tsx` – glow orbs + title + CTAs (currently lines 40-109)
- `features-section.tsx` – the 3 features (112-146)
- `how-it-works-section.tsx` – 4 steps (149-191)
- `featured-stories-section.tsx` – loads from store, displays cards (194-244)
- `cta-section.tsx` – if the existing CTA in `components/sections/` is not used here, delete the unused one; if used – import it directly.

`app/page.tsx` becomes an orchestrator component importing and arranging the five sections. Most sections can be RSC (except Featured which depends on the store – see Phase 3).

### `app/profile/page.tsx` (452 → ~80 lines)
Split under `app/profile/_components/` (page-specific):
- `profile-skeleton.tsx` – extracted from the existing `ProfileSkeleton` (46-70)
- `profile-hero-card.tsx` – Avatar + name + edit/save/cancel buttons (163-214)
- `personal-info-section.tsx` – name/email/phone/institution fields with react-hook-form (217-317) – uses the new `FormField`
- `occupations-section.tsx` – occupations grid (320-370) – uses the new `Badge` for view mode
- `preferences-section.tsx` – marketingConsent checkbox (373-416)
- `account-section.tsx` – Google + logout (419-446)

The `useForm` and submit handling stay in the page itself and are passed to children via props (not deep prop-drilling – flat structure).

### `app/story/[id]/page.tsx` (320 → ~70 lines)
Split under `app/story/[id]/_components/`:
- `story-breadcrumb.tsx` – the breadcrumb (121-138)
- `story-article.tsx` – story + question + sources + concepts + video (114-232)
- `story-sources-list.tsx` – internal component of `story-article` that renders shasRefs+shuRefs+sourceReferencesText in one place using the new `Badge`
- `story-navigation.tsx` – prev/next (285-315)
- `story-not-found.tsx` – error screen (61-83) – uses `EmptyState`

`app/story/[id]/page.tsx` will replace the three outer `motion.div` wrappers with `MotionFadeIn delay={...}`.

### `components/search/search-client.tsx` (307 → ~150 lines)
- The internal `ActiveFilterTags` (26-125) → moved to a separate file `components/search/active-filter-tags.tsx` using `Badge` with `onRemove`.
- The "unauthenticated block" (289-301) → `components/search/auth-required-overlay.tsx`.

---

## Phase 3 – Data Layer

### 3a. `lib/api-client.ts` (new)
A single function centralizing the pattern duplicated across every store:
```ts
export async function apiCall<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.error ?? 'Unknown error');
  return body.data as T;
}
```
All stores (`stories-store`, `reference-store`, `user-store`, `story-detail-store`, `contact-store`) will be updated to call through it. This reduces ~5×8 lines and makes error handling consistent.

### 3b. Fix `stories-store.loadFeaturedStories`
Replace `} catch {}` with a `featuredError` set and add state to display a fallback in `featured-stories-section.tsx`. This is the only issue that hides failures from the user.

### 3c. Remove double `useEffect(loadAll)` call
`ReferencePreloader` already runs in providers; the duplicate call in `app/story/[id]/page.tsx:37-39` is unnecessary (a `loaded` flag already exists). Remove it.

### 3d. Home page – partial move to RSC
`app/page.tsx` is currently `'use client'` only because it accesses the legacy `useStoriesStore` for `featuredStories`. The solution:
- `app/page.tsx` ← RSC that composes the static sections (Hero/Features/HowItWorks/CTA).
- Only `featured-stories-section.tsx` is marked `'use client'` with the store.
- The `motion.div` animations in `MotionFadeIn` will require `'use client'` in the wrapper component, but the component itself can be imported from an RSC page (Next.js permits this as long as `'use client'` is in the wrapper file).

For `app/story/[id]/page.tsx`: it is possible to convert to RSC with server-side `backendFetch` instead of a store. **Requires investigation** of the implications for the view cache in `story-detail-store` – keeping the store as a prefetch fallback may be more complex than it's worth. **Plan conclusion: keep the story page as a client component at this stage**, only extract sections. RSC migration deferred to a separate feature.

---

## Phase 4 – Cleanup and Verification

- Delete `components/sections/insights-section.tsx` if it is not used anywhere (per the investigation report – not imported). Verify with grep before deleting.
- Verify that old class wrappers (`glass-card p-X rounded-2xl`) using the existing `<GlassCard>` are updated to use the component instead of raw class strings, especially in `app/page.tsx:126, 250` and `app/story/[id]/page.tsx:115`.

### Manual verification (per user instructions – no automated tests)
After the refactor, run `bun dev` and manually verify the flows:
1. Home page – Hero, Features, HowItWorks, Featured stories (server load), CTA. Verify `whileInView` animations still trigger.
2. Search – typing, filtering by book/topic/shas/shulchan aruch, removing filter tags, pagination, unauthenticated state.
3. Story page – loading, breadcrumb, sources (shas+shu), concepts, video, expandable panels, prev/next.
4. Profile – loading, view mode, switch to edit, save changes, cancel, occupation selection, preferences checkbox, logout.
5. Contact – form submission.
6. Modals – login, onboarding.

**If a visual regression is discovered** – document the location and the original pattern, and restore the specific class instead of relying on a variant.

---

## Files with Significant Changes (Summary)

**Main:**
- `app/page.tsx` (large split)
- `app/profile/page.tsx` (large split)
- `app/story/[id]/page.tsx` (medium split)
- `components/search/search-client.tsx` (light split)

**stores:**
- `lib/stores/stories-store.ts`, `lib/stores/reference-store.ts`, `lib/stores/user-store.ts`, `lib/stores/story-detail-store.ts`, `lib/stores/contact-store.ts` (replace fetch with `apiCall`)

**New (primitives):**
- `components/ui/section-header.tsx`
- `components/ui/badge.tsx`
- `components/ui/form-field.tsx`
- `components/common/motion-fade-in.tsx`
- `components/common/page-shell.tsx`
- `components/common/empty-state.tsx`
- `components/common/loading-skeleton.tsx`
- `lib/api-client.ts`

**New (page-specific):**
- `app/_components/home/{hero,features,how-it-works,featured-stories}-section.tsx`
- `app/profile/_components/{profile-skeleton,profile-hero-card,personal-info-section,occupations-section,preferences-section,account-section}.tsx`
- `app/story/[id]/_components/{story-breadcrumb,story-article,story-navigation,story-not-found}.tsx`
- `components/search/active-filter-tags.tsx`
- `components/search/auth-required-overlay.tsx`

## Recommended Execution Order
1. Primitives (Phase 1) – no usage changes; easy to verify each primitive stands alone.
2. `apiCall` and store changes (Phase 3a-c) – isolated change that does not touch UI.
3. search-client split (Phase 2 partial) – the smallest.
4. story/[id] split – medium.
5. profile split – large.
6. home split + RSC migration (Phase 2 + 3d) – most significant, last.

At each step: `bun dev` + verify the relevant screen before moving to the next step, and a separate Hebrew commit per project rules.
