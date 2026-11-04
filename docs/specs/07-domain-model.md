# Domain model

## Goal

Describe the app's domain and locate the executable contracts without duplicating every field definition.

## Content

A story contains a scenario (`storyBody`), legal question, short answer and optional expansion. It belongs to a book/topic and can carry Shas and Shulchan Aruch references, source text, image/video URLs and indexed/AI concepts.

- `StoryCard`: partial search result; it is not a full story.
- `Story`: full content used for examples/weekly stories.
- `StoryWithNeighbors`: full story plus nullable previous/next references.
- Search results carry `stories`, `total`, `page`, `limit`; preserve backend order.

The exact fields/nullable values are owned by [`lib/schemas/story.ts`](../../lib/schemas/story.ts). Do not assume search cards contain `storyBody` or expansion.

## Reference data

[`lib/schemas/reference.ts`](../../lib/schemas/reference.ts) owns books, topics, masechtot/pages and Shulchan Aruch sections/simanim. Books expose `orderIndex` and nullable `coverUrl`; no static frontend cover map is needed. Topics reference a book. Shas refs identify a page and contain the expanded page/masechet data. Shulchan Aruch refs contain a siman and seif.

[`AppDataBundle`](../../lib/types.ts) combines reference lists, full featured stories and nullable weekly story. The bundle is fetched server-side and passed to the browser, including any expansions in those public stories.

The weekly story from the Core API and `/weekly-question` are separate surfaces. The former opens through the featured route. The latter embeds a Google Form configured in [`weekly-question.ts`](../../lib/config/weekly-question.ts); it has no app-managed answer submission or grading flow.

## Search

[`lib/schemas/search.ts`](../../lib/schemas/search.ts) owns server request fields: optional free text, book/topic ids, Shas/Shulchan Aruch refs, concepts, page and limit. UI-only row ids live in `UiSearchFilters`, not the API body. The schema accepts `concepts`, but the current search UI does not expose that filter. Browser code builds parameters and manages requests; the backend ranks and interprets matches.

## Users and contact

[`lib/schemas/user.ts`](../../lib/schemas/user.ts) owns `UserData`, occupation values, registration/profile forms and contact schemas. Types derive from schemas. Registration and every profile save require explicit marketing consent, minimum name/phone lengths and at least one occupation. The onboarding checkbox starts unchecked. Both forms identify the required consent as updates and marketing content by email and show an associated validation error when it is unchecked.

The server uses `registerUserSchema` and `updateUserSchema`, derived from these form constraints. Both require an explicit boolean `marketingConsent: true`; missing, false, null and string values are rejected. Profile updates accept partial changes to other mutable fields. `institutionName: null` clears the stored institution; omitted optional fields are unchanged. Response validation uses the separate `userDataSchema`, which accepts either consent value so existing profiles remain readable. An existing profile without consent must approve it before saving changes; this rule does not independently change sign-in or read access.

A story-question contact requires story context; general contact does not. The contact UI includes an expansion only for a registered user. The normal story view locks expansion display for unregistered users; featured/weekly story views expose their available expansion publicly. Client locks do not remove content already sent to the browser. [Auth](05-auth.md) owns access rules, including server checks.

## Exports and upstream

Import shared types through `@/lib/schemas` or their owner when necessary. The index re-exports schemas; there is no `lib/schemas.ts` file. [Upstream expectations](11-core-api-contract.md) maps these models to endpoints; upstream behavior not observable here is not guaranteed by this repository.
