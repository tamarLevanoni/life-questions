# Master Plan: Server/Client Boundary + Hook + Component Split

## Context

Per Next.js App Router convention, `page.tsx` should remain a Server Component when possible — smaller bundle, ability to load data server-side in the future (when moving from mock to API), and streaming/Suspense work as expected. Everything that requires client (`useSession`, Zustand, `useEffect`, state, handlers) is pushed deep into the tree.

Until now, the convention in CLAUDE.md instructed `page.tsx` to hold store reads + `useEffect` — which requires `'use client'` and breaks the server boundary. This document records the decision to align the project to the Next.js convention.

## Principles

1. `page.tsx` is a **Server Component** by default.
2. Forbidden in it: `'use client'`, `useState`, `useEffect`, `useSession`, store reads, handlers, form hooks, `redirect()` for auth.
3. Permitted content: `<PageShell>`, composing `<X>View />`, `<Suspense>`, and in the future `await fetch`.
4. Every orchestrator is `app/<route>/_components/<route>-view.tsx` (`'use client'`).
5. All state + logic in hook `app/<route>/_components/use-<route>.ts`.
6. JSX is split into focused `_components/` components.
7. Hard limit of 120 lines applies to every file — including the view and the hook.
8. Auth gates in `middleware.ts` at the edge, not `redirect()` in the client.

## Pre-Refactor Status Table

| Page | Main File | Lines | Notes |
|------|-----------|------:|-------|
| Home | `app/page.tsx` | 18 | ✅ Good |
| Search | `app/search/page.tsx` + `_components/search-client.tsx` | 10 / 182 | Mixes 3 layers |
| Contact | `app/contact/page.tsx` + `_components/contact-form.tsx` | 13 / 240 | form hook not separated |
| Story | `app/story/[id]/page.tsx` | 102 | `'use client'`, store + 2× useEffect |
| Profile | `app/profile/page.tsx` | 74 | `'use client'`, `redirect()` inside client |

## Per-Page Details

- [`docs/planning/search-refactor.md`](search-refactor.md)
- [`docs/planning/contact-refactor.md`](contact-refactor.md)
- [`docs/planning/story-refactor.md`](story-refactor.md)
- [`docs/planning/profile-refactor.md`](profile-refactor.md)
- [`docs/planning/claudemd-update.md`](claudemd-update.md)

## Execution Order

1. Update CLAUDE.md — first, so documentation is consistent.
2. `app/search/` — the biggest pain point.
3. `app/contact/` — extract form hook.
4. `app/story/[id]/` — change client/server boundary.
5. `app/profile/` — middleware + view.

Each chapter closes with a separate detailed Hebrew commit.

## Verification

For each chapter:
- `bunx tsc --noEmit`
- `bun lint`
- `bun dev` and manual testing (desktop + mobile, authenticated + unauthenticated)
- Line count — under 120 in every file
- Verify the relevant `page.tsx` does not contain `'use client'`

Finally:
- `bun build` passes
- DevTools: `page` itself not in the client bundle
