# AGENTS.md

## Operational Copy Notice

This file is an operational copy for coding agents. The durable source of truth is [docs/specs](docs/specs). Any change to agent-facing architecture, data-flow, caching, routing, auth, store, or design guidance must either be mirrored in [CLAUDE.md](CLAUDE.md) or moved back into the relevant spec to avoid conflicting instructions.

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

Next.js 16 (App Router, `cacheComponents`) · React 19 · TypeScript · Tailwind 4 · Zustand · NextAuth v4 (Google OAuth) · react-hook-form + zod 4 · Framer Motion · Shadcn/ui.

`next-auth@4` is still in `package.json`. Migrating to Auth.js v5 is on the roadmap; do not start mixing v5 APIs until a dedicated migration PR.

---

## Data Flow

```
RSC page.tsx ──► lib/server/* ──► backendFetch ──► core API
                                                       ▲
client store ──► /api/* (BFF) ──► lib/server/* ────────┘
```

| Read | Where |
|------|-------|
| Above-the-fold page data | RSC `page.tsx` → `lib/server/*` → `<StoreHydrator>` |
| User-driven re-fetch / pagination | client store → BFF → `lib/server/*` |
| Mutations (forms, profile update) | client store → BFF → `lib/server/*` |
| Static reference (masechtot, topics, books) | RSC only. **No client fetch path.** |

The BFF (`app/api/*`) exists only for client mutations and user-driven re-fetches. Never add a BFF endpoint just so a store can self-load on mount.

`lib/backend-fetch.ts` (`'server-only'`) is the single fetch wrapper: attaches `INTERNAL_API_SECRET`, unwraps `StandardResponse`, and accepts `next: { revalidate, tags }`. Every file in `lib/server/*` imports `'server-only'`.

Every BFF route uses `runRoute(() => …)` from `lib/server/errors.ts`.

---

## Caching (Next 16)

Next 16 has **no implicit caching** — every fetch is dynamic unless you opt in. Project requires `cacheComponents: true` in `next.config.ts` for `'use cache'` to work; without it the directive is a no-op.

| Data | Strategy |
|------|----------|
| Reference lists (masechtot/topics/books) | `'use cache'` + `cacheTag('reference')` + `cacheLife('hours')` |
| Single story | `backendFetch(url, { next: { tags: ['story', \`story:${id}\`] } })`; invalidate via `revalidateTag` from an admin/webhook route |
| Featured entry stories | load the featured selection, then resolve the three ids through `getStory(id)` to warm the single-story cache |
| Sitemap lists | `next: { revalidate: 3600, tags: ['stories'] }` |
| User profile, search results, anything per-session | no caching |

**Cacheable requests must be GET.** POST/PATCH/DELETE are never cached. If a backend read uses POST, add a GET variant before trying to cache it.

`react.cache()` is per-request dedup only (e.g. `getStory` called from both `generateMetadata` and the page). Pair it with `'use cache'` / `revalidate` for real persistence. Don't add `Map`-based caches inside Zustand stores — the router cache and `'use cache'` cover it.

---

## Page Architecture

`page.tsx` is always a **Server Component** — no `'use client'`. Its job is: fetch via `lib/server/*`, set metadata, wrap in `<PageShell>` + `<StoreHydrator>`, render a single `<X>View />` from `_components/`.

```tsx
// app/<route>/page.tsx
export default async function XPage() {
  const x = await getX();
  return (
    <PageShell maxWidth="2xl">
      <StoreHydrator x={x}><XView /></StoreHydrator>
    </PageShell>
  );
}
```

Per route with state/auth:
- `_components/<route>-view.tsx` — `'use client'` orchestrator, calls `useX()`, composes sub-components.
- `_components/use-<route>.ts` — stores, effects, handlers. **Reads only from the store**, never from `useInitialData()` or `initial*` props.
- `_components/use-<route>-form.ts` — `react-hook-form` + `zod` setup, when there's a form.

`page.tsx` does not implement auth redirects. Hard-gated routes are handled in `proxy.ts`; page components render only after access is allowed. Never put `<AppHeader>` or `<main>` directly in a page — only via `<PageShell>`.

**Hard limit: 120 lines** for `page.tsx`, every `_components/*`, and every hook. Split when exceeded. Never define a local component with the same name as a shared primitive (shadowing hides the canonical version).

---

## Hydration

`<StoreHydrator>` hydrates Zustand stores **synchronously during render** (guarded by a `useRef` first-run flag) — never inside `useEffect`. This guarantees the first client paint sees a populated store, so consumers never need a `store.loaded ? store.x : initial.x` fallback.

Corollaries:
- Hooks read only from the store.
- `use-<route>.ts` effects that fetch must check the store first — if the entity is hydrated, skip the fetch (no double-RTT after RSC).
- `SessionUserSync` may set `useUserStore` from the session, but must not overwrite a richer object hydrated from `getCurrentUser`. Treat the session as the auth-status signal; the store-hydrated user as data.

---

## Auth & Routing

Google OAuth only. HttpOnly cookie sessions. Expansion content is **soft-gated** (lock UI, no redirect).

Routes that require a logged-in user (e.g. `/profile`) are **hard-gated by [proxy.ts](proxy.ts)** before route rendering — the page must not call `redirect()`. In Next.js 16 `middleware.ts` is renamed to `proxy.ts`; it lives at the project root, exports a `proxy` function, and uses the same `config.matcher` API. Extend the matcher in `proxy.ts` when adding a gated route.

---

## Stores

| Store | Purpose |
|-------|---------|
| `useSearchResultsStore` | search results returned by the server; URL/search params, pagination, loading/error only |
| `useStoryDetailStore` | current story only; may be primed with one clicked featured story, no manual Map/list cache |
| `useReferenceStore` | masechtot/shu-sections/topics/books — hydrated from RSC, no client loader |
| `useUserStore` | authenticated user — single source of truth |
| `useContactStore` | contact form submission |

Client → server requests go through `lib/api-client.ts → apiCall<T>(url, init)`. Stores never duplicate `fetch → res.json → error` logic. For repeated user-driven requests (typing in search), pass an `AbortSignal`.

The old `useStoriesStore` name is transitional only. Do not put featured stories in the search results store. Search hooks/stores may build server parameters and manage request state, but must not do client-side ranking, filtering, sorting, scoring, or match interpretation.

Featured examples on the home page are high-click entry stories. Load the selected three as full stories through the same `getStory(id)` path used by `/story/:id`; optionally prime only the clicked story before navigation.

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

Commit messages in **Hebrew**, detailed, explain what and why. Touching 2+ files? Write `docs/planning/<feature>.md` first.
