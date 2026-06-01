# General Architecture Spec

## Goal
Build a Torah-learning content platform based on stories, questions, short answers, and expansions, with AI-assisted search. The app is RSC-first, fast to load, indexable, and accessible.

---

## Stack

| Layer | Technology | Role |
|-------|------------|------|
| Framework | **Next.js 16** (App Router, Cache Components) | RSC, routing, cache, metadata |
| UI | **React 19** + Tailwind 4 + Shadcn/ui | Components and styling |
| Client state | **Zustand 5** | Stores after the RSC handoff |
| Validation | **Zod 4** (`from 'zod'` only) | Shared schemas for server and forms |
| Forms | **react-hook-form 7** + `@hookform/resolvers` | Controlled forms |
| Auth | **NextAuth v4** (Google OAuth, JWT) | Sessions; see `05-auth.md` |
| Animations | **Framer Motion 12** through `<MotionFadeIn>` | Consistent motion |
| Package manager | **bun** only | dev, build, lint |

Rule: every new library requires justification in a spec update. Do not add a second state library, a client ORM, or another charting library without a spec decision.

---

## Architectural Principles

1. **RSC-first.** Every `page.tsx` is a Server Component. Data loading starts in RSC, not in `useEffect`.
2. **Thin BFF.** `app/api/*` exposes client actions only: mutations and user-driven refetches. It is not used for page-load data.
3. **One source of truth.** Data flows from RSC into stores synchronously, and stores become the only source consumers read from on the client.
4. **Explicit caching.** Next.js 16 does not provide implicit fetch caching. Caching is an explicit decision per data type. See `03-stores-and-cache.md`.
5. **120-line boundaries.** `page.tsx`, route-local components, and hooks have a hard 120-line limit to force clean splits.

---

## Top-Level Folder Shape

```text
app/                          # routes, server-first
  _components/                # root page components only
  api/                        # BFF routes called from the client
  <route>/
    page.tsx                  # Server Component
    _components/              # route-local components and hooks
  layout.tsx . error.tsx . not-found.tsx . providers.tsx
  sitemap.ts . robots.ts
components/
  common/                     # shared primitives: PageShell, StoreHydrator, ...
  ui/                         # Shadcn primitives + project primitives
  layout/                     # AppHeader, Footer
  providers/                  # client providers and side-effect components
  story/ . auth/              # domain components
lib/
  server/                     # server-only code
  stores/                     # Zustand stores
  hooks/                      # shared hooks
  schemas.ts . types.ts       # canonical schemas and types
  api-client.ts . backend-fetch.ts
proxy.ts                      # protected-route gate, replaces middleware.ts in Next 16
```

---

## Error Handling

### Server Layer
`lib/server/errors.ts` defines two error classes:

```ts
class BackendError(status, message)   // core API error: 404, 401, ...
class SchemaError                     // core API returned data that failed Zod validation
```

Every route handler wraps its handler with `runRoute(() => handler())`, producing a consistent JSON response:

```json
{ "success": true,  "data": {} }
{ "success": false, "error": "..." }
```

`SchemaError` returns 502 Bad Gateway because it means the upstream contract is broken, not that the client sent a bad request.

### Client Layer
- `apiCall<T>()` in `lib/api-client.ts` throws an `Error` with the server message.
- Stores catch errors in `try/catch` and save `error: string | null`. Empty `catch {}` blocks are forbidden.
- Views render errors through `<EmptyState>` or inline messages, never `alert()`.

### Page Layer
- `app/error.tsx` is the global error boundary. Add route-local `error.tsx` only when the route needs custom recovery UI.
- `app/not-found.tsx` is the shared 404 UI, reached via `notFound()`.
- In Server Components, use `if (!entity) notFound()` rather than throwing arbitrary errors.

### Logging
Business code does not call `console.error` directly. Server logs go through `lib/server/logger.ts`, use JSON output, and never print secrets.

---

## Metadata And `<head>`

| Goal | Mechanism |
|------|-----------|
| Title, description, OG | `export const metadata` or `generateMetadata({ params })` in `page.tsx` |
| Favicons | `app/icon.png` / `app/apple-icon.png` file conventions; no manual `metadata.icons` |
| Robots | `app/robots.ts` file convention |
| Sitemap | `app/sitemap.ts` with `export const revalidate = 3600` |
| JSON-LD | Inline `<script type="application/ld+json">` inside `page.tsx`, after `<PageShell>` |
| Open Graph image | `app/opengraph-image.tsx` when a story needs a dynamic preview |

Rules:
- Page titles end with `| Life Questions`, except for the root page.
- Descriptions are short, at most 160 characters, and written for the page language.
- `generateMetadata` uses the same `lib/server/*` function as the page, optionally wrapped with `react.cache()`, to avoid duplicate fetches.
- Private pages set `robots: { index: false }`, for example `/profile`.

---

## Performance Checklist

- Reference data uses `'use cache'` + `cacheTag` + `cacheLife`.
- Single-story reads include `next: { tags: ['story:<id>'] }`.
- Home-page featured examples resolve the selected three ids through the same single-story `getStory(id)` path used by `/story/:id`.
- Images use `next/image`; external hosts are listed in `next.config.ts` `remotePatterns`.
- Fonts use `next/font`.
- Slow sections have `<Suspense>` boundaries.
- `page.tsx` never has `'use client'`; the client root starts at `<XView />`.

---

## Accessibility And i18n

- Root layout sets `<html lang="he" dir="rtl">` for the Hebrew product.
- Hebrew UI copy lives in JSX strings or label maps, not in file names.
- Every interactive component has a Hebrew `aria-label`, visible focus state, and keyboard support.
- Color combinations must pass WCAG AA contrast.

---

## Non-Urgent Recommendations

1. **Partial Prerendering (PPR).** Cache Components enables a static shell with dynamic holes. Add `<Suspense>` around dynamic sections such as search results and user info.
2. **Server Actions.** Consider moving contact submit and profile update from BFF routes to Server Actions when the replacement is complete for a whole flow.
3. **Dynamic Open Graph images.** Add `app/opengraph-image.tsx` for story title previews.
4. **Error tracking.** Add Sentry or Logfire after a central logger exists.
5. **Better Auth / Auth.js v5.** Consider migration only when additional providers or role-based access justify it.
6. **Web Vitals reporting.** Add `useReportWebVitals` and send metrics to an internal analytics endpoint.
7. **Full i18n.** If English is added as a product language, use `next-intl` or a similar routing-aware i18n library.
