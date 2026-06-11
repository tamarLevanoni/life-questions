# Server Access Spec

## Goal
Define every allowed path from the application to the external Core API, who may call it, and where responses are validated and cached. Endpoint paths and JSON payloads are owned by [11-core-api-contract.md](11-core-api-contract.md).

---

## Flow Map

```text
                +-----------------------+
                |   Next.js app         |
                |                       |
   browser ----->  Client component     |
                |     `- apiCall --.    |
                |                  v    |       +------------+
                |  BFF route (app/api/*)|       |            |
                |     `- lib/server/* --+------>|  Core API  |
                |                       |       |  Node.js   |
   browser ----->  RSC page.tsx         |       |            |
                |     `- lib/server/* --+------>|            |
                +-----------------------+       +------------+
```

The app has two outbound server paths:
1. **RSC** -> `lib/server/*` -> `backendFetch` (server-to-server).
2. **Client** -> `apiCall` -> BFF route in `app/api/*` -> `lib/server/*` -> `backendFetch`.

Never call the core API directly from the browser. The browser never knows the core API URL or the internal secret.

---

## Relevant Folders

| Folder/File | Role | Allowed Callers |
|-------------|------|-----------------|
| `lib/server/*` | Server functions that read or mutate through the core API. Every file starts with `'server-only'`. | RSC, route handlers, `sitemap.ts`, Server Actions |
| `lib/server/client.ts` | Single HTTP wrapper to the core API (`serverClient`). Attaches `x-api-secret` and unwraps `StandardResponse`. | `lib/server/*` only |
| `lib/server/actions.ts` | `'use server'` — exposes server functions as RPC for client mutations. | Client stores/components |
| `lib/api-client.ts` | Client wrapper around `fetch` to the BFF. Throws `UnauthenticatedError` on 401, cleaned `Error` on other failures. | Zustand stores only |
| `app/api/*/route.ts` | BFF. Wraps handlers with `runRoute()` and delegates to `lib/server/*`. Only for client-initiated async reads. | Browser/client code |
| `lib/schemas/`, `lib/types.ts` | Zod schemas and TypeScript types | Everywhere |

Rules:
- Every file in `lib/server/*` imports `'server-only'`.
- Route handlers never call the core API directly; they call `lib/server/*`.
- Server Components never self-fetch their own BFF (`fetch('/api/...')`). That creates a double hop. They call `lib/server/*` directly.
- Mutations go through `lib/server/actions.ts` (`'use server'`), not BFF routes.

---

## Data Types And Access Paths

| Entity | Server Function | Loaded In RSC | BFF / Action |
|--------|-----------------|---------------|--------------|
| Single story | `lib/server/stories.ts → getStory` | `app/story/[id]/page.tsx` | No BFF — RSC only |
| Featured + app data | `lib/server/app-data.ts → getAppData` | Root layout (`app/layout.tsx`) | No BFF — RSC only |
| Story search | `lib/server/stories.ts → searchStories` | No | BFF: `app/api/stories/search` (POST) |
| User profile mutations | `lib/server/user.ts → updateCurrentUser, registerUser` | No | Server Action: `lib/server/actions.ts` |
| Contact submission | `lib/server/contact.ts → submitContact` | No | Server Action: `lib/server/actions.ts` |

App data (masechtot, topics, books, featured stories) is loaded once in the root layout RSC and hydrated into `useAppDataStore`. User data comes from the JWT via `SessionUserSync` — no RSC fetch for user profile.

---

## Request Types

### Outbound To The Core API
Use `backendFetch(path, init?)` only:

```ts
init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
```

Return shape:

```ts
{ data: T | null, ok: boolean, status: number, error?: string }
```

Code outside `backendFetch` never manually unwraps the core API envelope.

Cacheable reads must be GET. Complex non-cacheable search may use POST with a body. POST, PATCH, and DELETE mutations are never cached.

### Inbound From Client To BFF
Use `apiCall<T>(url, init?)`:

```ts
init: RequestInit // includes signal: AbortSignal
```

It returns unwrapped `data`. Any error is thrown as an `Error` with the original server message.

Rules:
- Stores never call `fetch` directly; they use `apiCall`.
- Live search and autocomplete pass an `AbortSignal` and cancel stale requests.
- Mutations catch errors and update store `error`; they do not throw all the way to the UI.

---

## Core API Response Contract

The core API wraps every response in `StandardResponse<T>`:

```ts
type StandardResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

`backendFetch` unwraps this for Next.js server code:
- `ok=true` means `data` exists and `error` is absent.
- `ok=false` means `data` is null and `error` + `status` are present.

`runRoute` wraps BFF responses again in `StandardResponse`. `apiCall` unwraps them on the client. Both directions use the same envelope.

Every `lib/server/*` call validates `data` with Zod (`.safeParse(data)`). Invalid upstream data throws `SchemaError`, which becomes a 502 response.

---

## Server Cache Strategy

| Type | Storage | TTL | Revalidation Trigger |
|------|---------|-----|----------------------|
| Reference data | Next data cache, tag `reference` | Long, via `cacheLife('hours')` | Core API webhook -> `revalidateTag('reference', 'max')` |
| Single story | Next data cache, tag `story:<id>` | Long | Story update webhook -> `revalidateTag('story:<id>', 'max')` |
| Featured entry selection | Next data cache, tag `featured`; full payload resolved through single-story cache | `revalidate: 3600` for selection | Time + `featured`; story updates invalidate `story:<id>` |
| Search results | Not cached | None | Fully dynamic |
| User profile | Not cached | None | Always fresh |
| Per-request dedup | `react.cache()` | One request | Automatic |

**Cache invalidation endpoint:**

```ts
// app/api/internal/revalidate/route.ts - protected by a secret
POST { type: 'story' | 'reference' | 'stories', id?: string }
```

The core API calls this endpoint after content updates. The route validates a secret, maps event types to stable tags, and calls `revalidateTag(tag, 'max')`.

---

## Typical Code

RSC/server read:

```ts
// lib/server/stories.ts
import 'server-only';
import { cache } from 'react';

export const getStory = cache(async (id: string) => {
  const { data, ok, status, error } = await backendFetch(
    `/api/stories/${id}`,
    { next: { tags: ['story', `story:${id}`] } }
  );
  if (!ok) throw new BackendError(status, error ?? 'Story not found');
  const parsed = storyWithNeighborsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
});
```

Client store request:

```ts
// lib/stores/stories-store.ts
search: async (params, signal) => {
  set({ loading: true, error: null });
  try {
    const data = await apiCall<PaginatedStoryCards>('/api/stories/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
    set({ stories: data.stories, total: data.total, loading: false });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
  }
};
```

---

## Non-Urgent Recommendations

1. **Server Actions for focused mutations.** Consider them only when they fully replace the BFF for a complete flow.
2. **Shareable GET search.** Add a canonical GET search path if query/filter state needs full URL sharing.
3. **OpenAPI / TypeBox contract.** Share a formal contract between the core API and the app instead of manually syncing schemas.
4. **Streaming search responses.** Use SSE or `ReadableStream` if AI search takes 3-5 seconds and partial results improve UX.
5. **BFF rate limiting.** Add `@upstash/ratelimit` or an equivalent for `/api/contact` and `/api/stories/search`.
