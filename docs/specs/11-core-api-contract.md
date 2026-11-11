# Core API expectations

## Goal

Record the upstream endpoints consumed by this frontend and the executable shape owners. The frontend owns these expectations. On 2026-11-03, endpoint paths and validators were also compared with the local sibling `life-questions-server/src/modules/` source. Its source is not proof of what has been deployed. Seven public-content GET endpoints were checked against the configured service and passed frontend schema validation; no live mutation or Google OAuth flow was performed.

## Envelope and access

The server sends `x-api-secret` to `BACKEND_API_URL`. Expected responses are `{ success: true, data: T }` or `{ success: false, error: string }`; HTTP status also indicates failure. [`serverClient`](../../lib/server/client.ts) unwraps the envelope. Read/user functions validate returned data; contact assumes no particular success data shape. Search BFF uses the same envelope, while Server Actions use Next.js remote procedure calls (RPC).

## Implemented endpoint usage

| Method/path | Purpose | Expected data owner |
|---|---|---|
| GET /api/reference/masechtot | reference list with pages | masechetWithPagesSchema[] |
| GET /api/reference/shu-sections | sections with simanim | shuSectionWithSimanimSchema[] |
| GET /api/reference/topics | topic list | topicSchema[] |
| GET /api/reference/books | books, orderIndex, nullable coverUrl | bookSchema[] |
| GET /api/stories/featured | full example stories, not ids | storySchema[] |
| GET /api/stories/weekly | full weekly story or null | storySchema.nullable() |
| GET /api/stories/:id | story with previous/next | storyWithNeighborsSchema |
| POST /api/stories/search | user search and internal sitemap read | searchBodySchema -> paginatedStoryCardsSchema |
| GET /api/users/google/:googleId | lookup by verified Google identity | userDataSchema; 404 means not registered |
| POST /api/users | registration | registerUserSchema -> userDataSchema |
| PATCH /api/users/profile/:id | current user edit | updateUserSchema -> userDataSchema |
| POST /api/contact | validated contact submission | contactSchema; no richer response shape assumed |
| GET /api/recommendations | approbation images | list of name/url objects |

The exact schemas live in [story.ts](../../lib/schemas/story.ts), [reference.ts](../../lib/schemas/reference.ts), [search.ts](../../lib/schemas/search.ts) and [user.ts](../../lib/schemas/user.ts). [`recommendations.ts`](../../lib/server/recommendations.ts) owns its small response schema. Server callers live in [app-data.ts](../../lib/server/app-data.ts), [stories.ts](../../lib/server/stories.ts), [session-user.ts](../../lib/server/session-user.ts), [user.ts](../../lib/server/user.ts) and [contact.ts](../../lib/server/contact.ts). Keep fixtures consistent with these sources. Do not duplicate long JSON examples that can silently drift.

## Public frontend interfaces

- [`POST /api/stories/search`](../../app/api/stories/search/route.ts) requires a Google session, then delegates through `runRoute` to the server search function. Invalid JSON is passed as null to input validation and returns 400 for an authenticated caller.
- `/api/auth/[...nextauth]` is NextAuth's v4 handler.
- Profile, onboarding and contact use exported Server Actions from `lib/server/actions.ts`; REST `/api/user/*` and `/api/contact` handlers do not exist in this frontend.
- Reference/featured/weekly/story reads are server-side. The root bundle supplies home selections; every story page fetches by id, including examples and the weekly story. Story metadata uses the public view. The server passes `x-story-reader-id` from a verified registered session for the detailed view. Public responses carry `hasExpansion` with null expansion text.

## Validation limits

`searchBodySchema` requires positive integer `page`/`limit`, with a maximum limit of 50, matching the backend validator. Daf/seif values must be positive integers; a seif requires a siman. The UI requests ten results at a time and the sitemap requests pages of 50. The upstream also validates UUID filter ids; frontend types do not replace that validation. Registration/profile reuse the form constraints described in [Domain](07-domain-model.md).

On 2026-11-04, the correction was applied to the local sibling backend: registration and every profile update require an explicit literal `marketingConsent: true`; missing, false, null and string values return 422 before database access. Swagger and existing integration-test requests were updated, and isolated controller/service tests cover validation and persistence with a mocked database. Success responses no longer print their payloads to the console. No database migration or automatic change to existing users' consent is included. The [quality foundation record](../planning/done/project-quality-foundation.md) records local verification; the backend has not been deployed as part of this work.

## Compatibility

Change input/output schemas with callers and tests in the same change. Do not assume a successful mock test proves a live backend deployment conforms; verify the integration separately in staging. Rate limits, webhooks, admin interfaces and backend implementation details not present here remain unverified/deferred work.
