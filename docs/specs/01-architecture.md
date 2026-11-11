# Architecture

## Goal

Deliver Hebrew Torah-learning stories, questions, short answers and expansions with server-rendered content and user-driven search.

## Stack and boundaries

The versions in [package.json](../../package.json) and `bun.lock` are authoritative. The stack is Next.js App Router with Cache Components, React, TypeScript, Tailwind, Zustand, NextAuth v4 (Google/JWT), react-hook-form and Zod. Use Bun for project commands.

```text
RSC -> lib/server/* -> serverClient -> Core API
client search store -> /api/stories/search -> lib/server/* -> Core API
client mutation -> Server Action -> lib/server/* -> Core API
```

The browser never receives the internal API secret. Shared schemas live in `lib/schemas/`, exported through its index; import Zod from `zod`. The server HTTP wrapper is `lib/server/client.ts`, not `backendFetch`.

App-wide reference/featured/weekly data loads in `AppDataLoader` in the root layout. `AppDataHydrator` initializes a provider-scoped store. Story routes fetch server-side and prime `useStoriesStore` with `StoryHydrator`. Auth/user state is synchronized from NextAuth by `SessionUserSync`.

## Composition

Use Server Components for content pages and client views/hooks for interactions. Existing `/auth/signin`, `/auth/callback` and `/auth/error` pages are Client Components for OAuth flow and feedback. Use [PageShell](../../components/common/page-shell.tsx) for content layout; it owns the header and main element. Shared UI goes in `components/`; route-local UI goes in `_components/`.

Keep page files, route-local components and hooks at most 200 lines; split responsibilities when changing larger files. Do not perform an unrelated repository-wide component rewrite. English kebab-case file names; Hebrew UI copy.

## Errors and metadata

`BackendError`, `SchemaError` and `runRoute` live in `lib/server/errors.ts`. Search route errors use the standard response envelope. Server Actions propagate failures to callers, which show form/toast feedback. `app/error.tsx` and `app/not-found.tsx` provide recovery UI. Never silently discard unexpected failures or expose secrets in errors/logs.

Pages define route-specific metadata where implemented. All story links, including home examples and the weekly story, use `/story/[id]`. [Story metadata and content](../../app/story/[id]/page.tsx) share `getStory` with request-level deduplication. The [layout](../../app/layout.tsx) defines icons, fonts and site metadata. Dynamic Open Graph image generation, a logger service and an invalidation endpoint are not implemented.

[robots.ts](../../app/robots.ts) excludes API, profile and auth paths from crawling. [sitemap.ts](../../app/sitemap.ts) combines four static URLs with paginated story search, using the Core API maximum of 50 per page. It deduplicates story URLs and stops at the reported total, a short page or an empty page. If search fails, it returns only the static URLs. Story pages are public; further SEO/indexing policy remains a separate [product decision](../planning/backlog.md).

## Related contracts

Read [Server access](02-server-access.md), [State/cache](03-stores-and-cache.md), [Routes](04-route-structure.md) and [Auth](05-auth.md) for detailed responsibilities. Future work belongs in the [backlog](../planning/backlog.md).
