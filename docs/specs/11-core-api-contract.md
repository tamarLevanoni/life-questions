# Core API Contract Spec

## Goal
Define the stable contract between the Next.js application and the external Core API. This document owns endpoint paths, methods, request bodies, response envelopes, pagination, auth errors, and JSON examples.

This is not the BFF contract. `app/api/*` may expose convenience routes to the browser, but those routes must delegate to the Core API contract described here through `lib/server/*` and `backendFetch`.

---

## Base Rules

- Base URL comes from `BACKEND_API_URL`.
- Every request from Next.js to the Core API includes:

```http
x-api-secret: <INTERNAL_API_SECRET>
Content-Type: application/json
```

- All responses use `StandardResponse<T>`:

```ts
type StandardResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- Successful responses use `200` or `201` with `StandardResponse<T>`.
- Error responses use the same envelope with `success: false`.
- Dates are ISO 8601 strings.
- IDs are strings. UUID is preferred, but the app treats ids as opaque strings.
- Unknown fields may be ignored by the app; missing required fields fail Zod validation and become a 502 from the BFF.

---

## Error Contract

| Status | Meaning | Typical `error` |
|--------|---------|-----------------|
| `400` | Invalid request body or query | `Invalid request body` |
| `401` | Missing or invalid user/session context | `Unauthorized` |
| `403` | Authenticated but not allowed | `Forbidden` |
| `404` | Entity not found | `Story not found` |
| `409` | Conflict, usually duplicate user or stale write | `Conflict` |
| `422` | Semantically invalid data | `Validation failed` |
| `500` | Core API error | `Internal server error` |

Example:

```json
{
  "success": false,
  "error": "Story not found"
}
```

The Core API must never expose secrets, stack traces, database errors, or internal service names in `error`.

---

## Pagination Contract

Paginated list responses use:

```ts
type Paginated<T> = {
  stories: T[];
  total: number;
  page: number;
  limit: number;
};
```

Rules:
- `page` is 1-based.
- `limit` defaults to `20` unless the endpoint defines a smaller default.
- `limit` must be capped server-side.
- `total` is the total number of matching records, not just the current page length.
- The client computes `hasMore` as `(page * limit) < total`.

---

## Shared Data Shapes

### StoryCard

```json
{
  "id": "story_123",
  "bookId": "book_1",
  "storyOrder": 7,
  "topicId": "topic_1",
  "title": "Short display title",
  "legalQuestion": "Question shown in search results",
  "videoUrl": null,
  "shuRefs": [],
  "centralShuSiman": null
}
```

### Story

```json
{
  "id": "story_123",
  "bookId": "book_1",
  "storyOrder": 7,
  "title": "Short display title",
  "storyBody": "Full story text",
  "legalQuestion": "The halachic question",
  "legalQuestionSource": "Question source text",
  "shortAnswer": "Short public answer",
  "expansion": "Long explanation, or null when absent",
  "conceptsAi": ["lost-object"],
  "conceptsFromIndex": ["hashavat-aveidah"],
  "videoUrl": null,
  "imageUrl": null,
  "topic": {
    "id": "topic_1",
    "bookId": "book_1",
    "name": "Shabbat",
    "orderIndex": 1
  },
  "shasRefs": [],
  "shuRefs": [],
  "centralShuSiman": null,
  "sourceReferencesText": null,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### StoryWithNeighbors

```json
{
  "id": "story_123",
  "bookId": "book_1",
  "storyOrder": 7,
  "title": "Short display title",
  "storyBody": "Full story text",
  "legalQuestion": "The halachic question",
  "legalQuestionSource": "Question source text",
  "shortAnswer": "Short public answer",
  "expansion": null,
  "conceptsAi": [],
  "conceptsFromIndex": [],
  "videoUrl": null,
  "imageUrl": null,
  "topic": {
    "id": "topic_1",
    "bookId": "book_1",
    "name": "Shabbat",
    "orderIndex": 1
  },
  "shasRefs": [],
  "shuRefs": [],
  "centralShuSiman": null,
  "sourceReferencesText": null,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "neighbors": {
    "prev": { "id": "story_122", "title": "Previous story" },
    "next": { "id": "story_124", "title": "Next story" }
  }
}
```

### FeaturedStoryRef

```json
{
  "id": "story_123",
  "order": 1
}
```

### UserData

```json
{
  "id": "user_123",
  "googleId": "google-sub-123",
  "email": "user@example.com",
  "firstName": "First",
  "lastName": "Last",
  "institutionName": "Optional institution",
  "phone": "0500000000",
  "occupations": ["learner"],
  "marketingConsent": true
}
```

---

## Stories

### `GET /api/stories/:id`

Returns a full story with previous/next neighbors.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "story_123",
    "bookId": "book_1",
    "storyOrder": 7,
    "title": "Short display title",
    "storyBody": "Full story text",
    "legalQuestion": "The halachic question",
    "legalQuestionSource": "Question source text",
    "shortAnswer": "Short public answer",
    "expansion": null,
    "conceptsAi": [],
    "conceptsFromIndex": [],
    "videoUrl": null,
    "imageUrl": null,
    "topic": {
      "id": "topic_1",
      "bookId": "book_1",
      "name": "Shabbat",
      "orderIndex": 1
    },
    "shasRefs": [],
    "shuRefs": [],
    "centralShuSiman": null,
    "sourceReferencesText": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "neighbors": {
      "prev": null,
      "next": { "id": "story_124", "title": "Next story" }
    }
  }
}
```

#### Errors
- `404` when the story does not exist.

---

### `GET /api/stories/featured`

Returns the ordered featured/example story selection for the home page. This endpoint returns ids only. The Next.js app resolves each id through `GET /api/stories/:id` by calling `getStory(id)`, so the same single-story cache is warmed for immediate clicks from the home page.

#### Query Parameters

| Param | Type | Notes |
|-------|------|-------|
| `limit` | number | Optional. Defaults to `3`; capped at `3`. |

#### Response `200`

```json
{
  "success": true,
  "data": {
    "stories": [
      { "id": "story_123", "order": 1 },
      { "id": "story_124", "order": 2 },
      { "id": "story_125", "order": 3 }
    ]
  }
}
```

#### Errors
- `422` when the featured selection points to a disabled or missing story.

---

### `POST /api/stories/search`

Searches story cards by free text and filters. This endpoint is dynamic and not cached.

Sorting and ranking are fully owned by the Core API. The response order is authoritative. The Next.js app must render stories in the returned order.

#### Request Body

```json
{
  "q": "lost object",
  "bookIds": ["book_1"],
  "topicIds": ["topic_1"],
  "shasRefs": [
    { "masechetId": "masechet_1", "daf": 2 }
  ],
  "shuRefs": [
    { "shuSectionId": "shu_1", "simanId": "siman_1", "seif": 3 }
  ],
  "concepts": ["hashavat-aveidah"],
  "page": 1,
  "limit": 20
}
```

All fields are optional. Empty body means "all stories".

#### Response `200`

```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "story_123",
        "bookId": "book_1",
        "storyOrder": 7,
        "topicId": "topic_1",
        "title": "Short display title",
        "legalQuestion": "Question shown in search results",
        "videoUrl": null,
        "shuRefs": [],
        "centralShuSiman": null
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

#### Errors
- `400` for malformed body.
- `422` for invalid filter combinations.

---

## Reference Data

Reference endpoints are cacheable GET endpoints. They are called from RSC only.

### `GET /api/reference/masechtot`

Returns `MasechetWithPages[]`.

```json
{
  "success": true,
  "data": [
    {
      "id": "masechet_1",
      "name": "Berakhot",
      "orderIndex": 1,
      "pages": [
        { "id": "page_1", "daf": 2, "amud": "a" }
      ]
    }
  ]
}
```

### `GET /api/reference/shu-sections`

Returns `ShuSectionWithSimanim[]`.

```json
{
  "success": true,
  "data": [
    {
      "id": "shu_1",
      "name": "Orach Chaim",
      "simanim": [
        { "id": "siman_1", "siman": 1, "title": "Opening laws" }
      ]
    }
  ]
}
```

### `GET /api/reference/topics`

Returns `Topic[]`.

```json
{
  "success": true,
  "data": [
    {
      "id": "topic_1",
      "bookId": "book_1",
      "name": "Shabbat",
      "orderIndex": 1
    }
  ]
}
```

### `GET /api/reference/books`

Returns `Book[]`.

```json
{
  "success": true,
  "data": [
    { "id": "book_1", "name": "Collection A" }
  ]
}
```

---

## Users

### `GET /api/users/google/:googleId`

Returns the app user that belongs to a Google account id.

#### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "googleId": "google-sub-123",
    "email": "user@example.com",
    "firstName": "First",
    "lastName": "Last",
    "institutionName": "Optional institution",
    "phone": "0500000000",
    "occupations": ["learner"],
    "marketingConsent": true
  }
}
```

#### Errors
- `404` when the Google account has not completed registration.

---

### `POST /api/users`

Creates a new user after OAuth onboarding.

#### Request Body

```json
{
  "googleId": "google-sub-123",
  "email": "user@example.com",
  "firstName": "First",
  "lastName": "Last",
  "institutionName": "Optional institution",
  "phone": "0500000000",
  "occupations": ["learner"],
  "marketingConsent": true
}
```

#### Response `201`

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "googleId": "google-sub-123",
    "email": "user@example.com",
    "firstName": "First",
    "lastName": "Last",
    "institutionName": "Optional institution",
    "phone": "0500000000",
    "occupations": ["learner"],
    "marketingConsent": true
  }
}
```

#### Errors
- `400` for invalid body.
- `409` when a user already exists for the same `googleId` or email.

---

### `PATCH /api/users/profile/:id`

Updates mutable profile fields for an existing app user.

The BFF enforces session authentication before calling this endpoint. The Core API enforces ownership only if user identity is forwarded explicitly by the BFF.

#### Request Body

```json
{
  "firstName": "First",
  "lastName": "Updated",
  "institutionName": "Optional institution",
  "phone": "0500000000",
  "occupations": ["teacher", "learner"],
  "marketingConsent": false
}
```

`id`, `email`, and `googleId` are read-only from the app perspective.

#### Response `200`

Returns `UserData`.

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "googleId": "google-sub-123",
    "email": "user@example.com",
    "firstName": "First",
    "lastName": "Updated",
    "institutionName": "Optional institution",
    "phone": "0500000000",
    "occupations": ["teacher", "learner"],
    "marketingConsent": false
  }
}
```

#### Errors
- `400` for invalid body.
- `403` when the authenticated user cannot update this profile.
- `404` when the user does not exist.

---

## Contact

### `POST /api/contact`

Submits a contact form.

#### Request Body

```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "category": "story_question",
  "subject": "Question about a story",
  "message": "Long enough contact message",
  "pageUrl": "https://example.com/story/story_123",
  "story": {
    "id": "story_123",
    "title": "Short display title",
    "storyBody": "Full story text",
    "legalQuestion": "The halachic question",
    "shortAnswer": "Short public answer",
    "expansion": "Optional visible expansion"
  }
}
```

`story` is required when `category === "story_question"` and omitted otherwise.

`story.expansion` is optional context. The Next.js app may include it only when the story has an expansion and that expansion is visible to the submitting user according to the same gate used by the story page. Locked expansion content must be omitted even if the client has a full story object in memory.

#### Response `200`

The Core API may return a receipt object. The minimum accepted response is any JSON value inside `data`.

```json
{
  "success": true,
  "data": {
    "id": "contact_123",
    "receivedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### Errors
- `400` for malformed body.
- `422` when `story_question` is missing `story`.
- `429` when rate-limited.

---

## BFF Mapping

The browser calls BFF routes, not the Core API. BFF routes map to Core API endpoints as follows:

| BFF Route | Core API Endpoint |
|-----------|-------------------|
| `GET /api/stories/:id` | `GET /api/stories/:id` |
| Home-page RSC featured load | `GET /api/stories/featured`, then `GET /api/stories/:id` for each selected id |
| `POST /api/stories/search` | `POST /api/stories/search` |
| `GET /api/user/profile` | `GET /api/users/google/:googleId` through server session |
| `PATCH /api/user/profile` | `PATCH /api/users/profile/:id` through server session |
| `POST /api/user/register` | `POST /api/users` through Google session |
| `POST /api/contact` | `POST /api/contact` |
| Reference BFF routes | Not part of the stable client contract; reference data is RSC-only |

---

## Versioning And Compatibility

- Breaking changes to this contract require updating this spec and the Zod schemas in the same PR.
- Additive fields are allowed when the app can safely ignore them.
- Removing or renaming fields is breaking.
- Changing enum values is breaking.
- Changing pagination semantics is breaking.
- A Core API change is not complete until the Next.js Zod schema, server helper, and relevant tests are updated.

---

## Non-Urgent Recommendations

1. **OpenAPI export.** Generate an OpenAPI document from this contract or from shared schemas.
2. **Shared schema package.** Move Core API and Next app schemas into a shared package if both repos are TypeScript.
3. **Contract tests.** Add tests that replay the JSON examples against Zod schemas.
4. **Error codes.** Add machine-readable `code` fields in addition to human-readable `error` messages.
5. **Idempotency keys.** Add `Idempotency-Key` for contact and future payment/subscription mutations.
