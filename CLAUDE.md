# CLAUDE.md

## Operational Copy Notice

This file is an operational copy for coding agents. The durable source of truth is [docs/specs](docs/specs). Any change to agent-facing architecture, data-flow, caching, routing, auth, store, or design guidance must either be mirrored in [AGENTS.md](AGENTS.md) or moved back into the relevant spec to avoid conflicting instructions.

## Commands

```bash
bun dev              # localhost:3000
bun build
bun lint
bunx tsc --noEmit
```

Always `bun` — never `npm`/`yarn`.

---

## Stack

Next.js 16 App Router with Cache Components · React 19 · TypeScript · Tailwind 4 · Zustand · NextAuth v4 (Google OAuth) · react-hook-form + zod 4 · Framer Motion · Shadcn/ui.

`next-auth@4` is still in `package.json`. Migrating to Auth.js v5 is on the roadmap; do not start mixing v5 APIs until a dedicated migration PR.

---

## Data Flow

```
layout.tsx ──► AppDataLoader (RSC) ──► lib/server/app-data.ts ──► core API
                     │                      [cached: 'hours']
                     ▼
             AppDataHydrator (CLIENT) ──► useAppDataStore
             { masechtot, shuSections, topics, books, featuredStories }

NextAuth session ──► SessionUserSync (CLIENT) ──► useUserStore { user, authStatus }
                         JWT has full UserData from login
                         updateSession() refreshes JWT after profile edits

RSC page.tsx ──► lib/server/* ──► core API
                      │
               StoryHydrator (CLIENT) ──► useStoriesStore        [story pages]

client store ──► /api/stories/search (BFF) ──► lib/server/stories.ts   [search]

client store ──► lib/server/actions.ts ('use server') ──► core API   [mutations]
```

| Data | When loaded | Where stored |
|------|-------------|-------------|
| Reference (masechtot, topics, books) + featured stories | Site entry, root layout | `useAppDataStore` |
| Authenticated user | On login, JWT → `SessionUserSync` | `useUserStore` |
| Story detail | Per story page, RSC + `StoryHydrator` | `useStoriesStore` (entity cache by ID) |
| Search results | On-demand, client-driven | `useStoriesStore` (`searchResults`) |
| Mutations (profile, register, contact) | Client → Server Actions | — |

`lib/server/client.ts` (`'server-only'`) is the single HTTP wrapper to the core API: attaches `x-api-secret` and unwraps the response. Every file in `lib/server/*` imports `'server-only'`.

`lib/server/actions.ts` (`'use server'`) exposes server-only functions as RPC to client stores. Use it for mutations — do not add BFF routes for mutations.

The only BFF routes are those that must be client-initiated async reads (e.g. `/api/stories/search`). Every BFF route uses `runRoute(() => …)` from `lib/server/errors.ts`.

---

## Caching

The project uses Next.js 16 Cache Components as the **single caching model**. `cacheComponents: true` is enabled in [next.config.ts](next.config.ts). All routes are dynamic by default. Persistent caching is opt-in only and must be declared close to the data access using `'use cache'` + `cacheLife` + `cacheTag`.

Caching is **whitelist-only**. See [docs/specs/03-stores-and-cache.md](docs/specs/03-stores-and-cache.md) — "Cache Safety Rules" and "Entity Strategy Table" — for the authoritative policy and the list of cacheable entities.

Do not introduce `export const revalidate`, `next: { revalidate }`, or `fetchCache` segment configs anywhere in the App Router; with Cache Components, those configs are replaced and mixing them is a known source of bugs.

**Cacheable requests must be GET.** If a backend read uses POST, add a GET variant before trying to cache it.

`react.cache()` is per-request dedup only — never a substitute for `'use cache'`. Don't add `Map`-based caches inside Zustand stores; the router cache and `'use cache'` cover it.

---

## Page Architecture

`page.tsx` is always a **Server Component** — no `'use client'`. Its job is: fetch via `lib/server/*`, set metadata, wrap in `<PageShell>`, render a single `<X>View />` from `_components/`.

Pages that need to hydrate a store place a `*Hydrator` client component alongside the view:

```tsx
// app/<route>/page.tsx  — page with store hydration
async function XContent({ params }) {
  const x = await getX(params.id);
  return (
    <>
      <XHydrator x={x} />   {/* CLIENT — writes to store synchronously during render */}
      <XView />              {/* CLIENT — reads from store */}
    </>
  );
}

export default function XPage({ params }) {
  return (
    <PageShell maxWidth="2xl">
      <Suspense fallback={<XSkeleton />}>
        <XContent params={params} />
      </Suspense>
    </PageShell>
  );
}
```

Pages whose data comes from global stores (profile, home) render the view directly — no hydration needed since the data is already in the store before the page renders.

Per route with state/auth:
- `_components/<route>-view.tsx` — `'use client'` orchestrator, calls `useX()`, composes sub-components.
- `_components/use-<route>.ts` — stores, effects, handlers. **Reads only from the store**, never from `useInitialData()` or `initial*` props.
- `_components/use-<route>-form.ts` — `react-hook-form` + `zod` setup, when there's a form.

`page.tsx` does not implement auth redirects. Hard-gated routes are handled in `proxy.ts`; page components render only after access is allowed. Never put `<AppHeader>` or `<main>` directly in a page — only via `<PageShell>`.

**Hard limit: 200 lines** for `page.tsx`, every `_components/*`, and every hook. Split when exceeded. Never define a local component with the same name as a shared primitive (shadowing hides the canonical version).

---

## Hydration

Hydrator components write to Zustand stores **synchronously during render** (guarded by a `useRef` flag) — never inside `useEffect`. This guarantees the first client paint sees a populated store.

| Hydrator | Location | Store | When |
|---------|----------|-------|------|
| `AppDataHydrator` | `components/providers/app-data-hydrator.tsx` | `useAppDataStore` | Root layout — once per session (global, affects all routes) |
| `StoryHydrator` | `app/story/[id]/_components/story-hydrator.tsx` | `useStoriesStore` | Story page — upserts `StoryWithNeighbors` by ID |
| `SessionUserSync` | `components/providers/session-user-sync.tsx` | `useUserStore` | Global — on session status change |

Rules:
- Hooks read **only from the store**, never from props or `initial*` params.
- `SessionUserSync` is the single source for user data. The JWT contains full `UserData` from login. After profile edits call `session.update()` so the JWT stays fresh.
- Never add a new hydrator without a matching store shape — the hydrator is just the bridge, the store owns the data.
- Loading states: `authStatus === 'idle'` while session loads → show skeleton. `story === null` before hydration → show skeleton. App data is synchronously hydrated, never null for consumers.

---

## Auth & Routing

Google OAuth only. HttpOnly cookie sessions. Expansion content is **soft-gated** (lock UI, no redirect).

Routes that require a logged-in user (e.g. `/profile`) are **hard-gated by [proxy.ts](proxy.ts)** before route rendering — the page must not call `redirect()`. In Next.js 16 `middleware.ts` is renamed to `proxy.ts`; it lives at the project root, exports a `proxy` function, and uses the same `config.matcher` API. Extend the matcher in `proxy.ts` when adding a gated route.

---

## Stores

| Store | File | Purpose | Loaded by |
|-------|------|---------|-----------|
| `useAppDataStore` | `lib/stores/app-data-store.ts` | masechtot, shuSections, topics, books, featuredStories | `AppDataHydrator` in root layout — once per session |
| `useUserStore` | `lib/stores/user-store.ts` | authenticated user + authStatus — single source of truth | `SessionUserSync` from JWT |
| `useStoriesStore` | `lib/stores/stories-store.ts` | entity cache (`Record<id, StoryWithNeighbors>`) + `searchResults: StoryCard[]` + pagination/loading/error | `StoryHydrator` (story page) + search actions |
| `useContactStore` | `lib/stores/contact-store.ts` | contact form submission state | Server Action |

Client → server requests go through `lib/api-client.ts → apiCall<T>(url, init)`. Stores never duplicate `fetch → res.json → error` logic. For repeated user-driven requests (typing in search), pass an `AbortSignal`.

Do not put featured stories in the search results store. Search hooks/stores may build server parameters and manage request state, but must not do client-side ranking, filtering, sorting, scoring, or match interpretation.

Featured stories on the home page come from `useAppDataStore.featuredStories` (loaded globally). The featured story route (`/story/featured/[id]`) looks up the story from the store — since these are randomly selected at runtime and the URL is never shared/bookmarked, a store-miss redirects to home.

`useStoriesStore` has two responsibilities: (1) entity cache `stories: Record<id, StoryWithNeighbors>` — `StoryHydrator` upserts when visiting a story page, the contact form reads by `storyId` from URL params; (2) `searchResults: StoryCard[]` — replaced by each search, appended on load-more. The two are separate: search results are partial (`StoryCard`), the entity cache holds full stories only.

All Zod schemas in `lib/schemas.ts`; form types via `z.infer`. Single Zod import path — `from 'zod'` only.

---

## Folder Conventions

- Page-specific components → `app/<route>/_components/`. Root page → `app/_components/`.
- Shared (2+ routes) → `components/<feature>/`, `components/ui/`, or `components/common/`.
- Client-only providers / global side-effects → `components/providers/`.
- File and folder names: English, **kebab-case**. Hebrew only inside JSX strings.

---

## Design Primitives (use, never reinvent)

| Primitive | Path |
|-----------|------|
| `<PageShell>` | `components/common/page-shell.tsx` |
| `<GlassCard>` | `components/ui/glass-card.tsx` |
| `<SectionHeader>` | `components/ui/section-header.tsx` |
| `<FormField>` | `components/ui/form-field.tsx` |
| `<MotionFadeIn>` | `components/common/motion-fade-in.tsx` |
| `<EmptyState>` | `components/common/empty-state.tsx` |
| `<SkeletonLines>` / `<SkeletonCardList>` | `components/common/loading-skeleton.tsx` |

`<MotionFadeIn trigger="view">` for scroll-triggered, `trigger="mount"` for immediate — never paste raw `motion.div` blocks.

Forms: `react-hook-form` + `zod`, every input wrapped in `<FormField label error>`.

Errors: never `} catch {}` silently — set `error` on the store and render via `<EmptyState>`. Loading states via `<SkeletonLines>` / `<SkeletonCardList>`.

---

## Git

Commit messages, detailed, explain what and why. Touching 2+ files? Write `docs/planning/<feature>.md` first.
