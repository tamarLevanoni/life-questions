# Server access

## Goal

Keep upstream access and secrets on the server, with explicit public entrypoints and validated data.

## Implemented access paths

| Caller | Entry point | Upstream path |
|---|---|---|
| RSC, metadata, sitemap | `lib/server/*` | `serverClient` |
| Browser search | `apiCall` -> `POST /api/stories/search` -> `searchStories` | `serverClient.post` |
| Profile/onboarding/contact | `lib/server/actions.ts` (`use server`) | delegated server function -> `serverClient` |
| NextAuth callbacks | server callback | `serverClient` |

[`serverClient.get/post/patch`](../../lib/server/client.ts) attaches `x-api-secret`, validates the `{ success, data/error }` envelope and returns data. Missing configuration returns a service error (503); connection failures become 502. Structured upstream errors retain their HTTP status. Non-JSON 5xx responses retain that status with a generic message; malformed success/error envelopes throw `SchemaError`. In particular, an HTML 404 does not mean an unregistered user. No `backendFetch` module exists. Do not add an alternative wrapper.

Implementation modules import `server-only`. The exception is the `use server` action entrypoint: client code may import its exported RPC functions, not the implementation modules. RSC never self-fetches the BFF. Reference data has no client-loading endpoint.

## Validation and errors

Server reads and user mutations validate returned data with schemas. Contact checks its input but assumes no specific success payload. Public mutation/search input is validated server-side even when a form has already validated it. Registration/profile schemas reuse their form field constraints; [Domain](07-domain-model.md) owns these rules. User mutation responses must also match the authenticated identity before reaching the store/session.

Search uses [`runRoute`](../../lib/server/errors.ts) for its response envelope. Backend failures preserve their status; messages for 5xx failures are generic. Schema failures return 502; unexpected failures return a generic 500 and log only the error type. [`apiCall`](../../lib/api-client.ts) unwraps the response and recognizes 401 as `UnauthenticatedError`. Keep HTTP/envelope handling in these wrappers and UI request state in the calling store.

Authenticate/authorize protected public entrypoints on the server. A UI lock or page redirect does not protect a separate Server Action/route handler. Internal callers such as sitemap must retain access to shared server read functions; put public-entrypoint checks at the correct boundary.

## Calls and caching

[State/cache](03-stores-and-cache.md) owns the actual cache policy. Cache Components functions surround cacheable GET reads. User-driven search is POST and is not persistently cached. Profile, session and mutations are never shared caches. The search store passes AbortSignal to the browser's BFF request and ignores obsolete successes and failures. The BFF does not forward that signal to the upstream request.

## Upstream contract

[Core API expectations](11-core-api-contract.md) lists the endpoints and schema owners observed in this frontend. No webhook/revalidation route or server retry/timeout framework is currently implemented. Track additions in the backlog instead of showing imaginary interfaces as usable APIs.
