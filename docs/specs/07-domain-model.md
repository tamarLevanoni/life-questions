# Domain Model Spec

## Goal
Document the Torah-content and user entities represented in the app: relationships, canonical fields, and categorization.

Canonical code sources: [lib/types.ts](../../lib/types.ts), [lib/schemas.ts](../../lib/schemas.ts). This document is the narrative map.

---

## Main Tree

```text
Book ---------.
              |  (book_id)
              v
            Story --+-- shortAnswer (public)
                    +-- expansion   (auth-gated, nullable)
                    +-- topic       (1)
                    +-- shasRefs    (n) -> ShasPage -> Masechet
                    +-- shuRefs     (n) -> ShuSiman -> ShuSection
                    +-- conceptsAi[] + conceptsFromIndex[]
```

---

## Entities

### Story
The central content unit: a real-life halachic scenario that opens a learning path.

Main fields from `storySchema`:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | UUID from the core API |
| `bookId` | string | Link to `Book` |
| `storyOrder` | number | Order inside the book |
| `title` | string | Short title |
| `storyBody` | string | Story body |
| `legalQuestion` | string | Halachic question |
| `legalQuestionSource` | string | Source of the question |
| `shortAnswer` | string | Public short answer |
| `expansion` | string \| null | Auth-gated expansion; null means no expansion exists |
| `topic` | Topic | Content topic |
| `shasRefs` | ShasRef[] | Talmud references |
| `shuRefs` | ShuRef[] | Shulchan Aruch references |
| `centralShuSiman` | ShuSiman \| null | Main Shulchan Aruch siman |
| `conceptsAi` | string[] | AI-detected concepts |
| `conceptsFromIndex` | string[] | Manually indexed concepts |
| `videoUrl`, `imageUrl` | string \| null | Attached media |
| `sourceReferencesText` | string \| null | Free-text source references |
| `createdAt`, `updatedAt` | string | ISO timestamps |

Rules:
- `shortAnswer` is always public. Do not gate it.
- `expansion === null` means the expansion panel is not rendered.
- `expansion !== null` means the expansion panel is rendered; guests see it locked.
- `StoryCard` is the search/list subset and excludes `storyBody`, `shortAnswer`, and `expansion`.
- `StoryWithNeighbors` is loaded for the single story page and includes `neighbors.prev/next` with `{ id, title }` only.
- Featured home-page examples are entry stories, not search results. They should load as full `StoryWithNeighbors[]` for the selected three examples, while card UI may consume only the display subset.

---

### Book
Shape: `{ id, name }`.

A book is a top-level collection of stories, such as a content volume or themed collection.

Rules:
- Every story belongs to exactly one book.
- `storyOrder` is the sequence inside the book and powers previous/next navigation.

---

### Topic
Shape: `{ id, bookId, name, orderIndex }`.

A content topic inside a book.

Rules:
- Every story belongs to exactly one topic.
- Every topic belongs to exactly one book; there is no global topic.
- Editing UI filters available topics by the selected book.

---

## Seder HaShas: Masechet -> ShasPage -> ShasRef

### Masechet
Shape: `{ id, name, orderIndex }`.

Represents one tractate. `orderIndex` controls display order.

### MasechetWithPages
One `Masechet` plus its `MasechetPage[]`, loaded in `getReference()`.

### ShasPage
Shape: `{ id, daf: number, amud: 'a' | 'b', masechet }`.

A specific page and side in a tractate.

### ShasRef
Attached to a story:

```ts
{ shasPageId, sourceText: string | null, shasPage }
```

`sourceText` is the excerpt or reference text from that page.

### Search Body: `ShasRefBody`

```ts
{ masechetId, daf?: number }
```

Search can target a whole tractate or a specific daf.

---

## Shulchan Aruch: ShuSection -> ShuSiman -> ShuRef

### ShuSection
Shape: `{ id, name }`.

Represents one of the four Shulchan Aruch sections.

### ShuSiman
Shape: `{ id, siman: number, title: string | null, section }`.

A siman inside a section. Reference data loads `ShuSectionWithSimanim`.

### ShuRef
Attached to a story:

```ts
{ shuSimanId, seif: number, shuSiman }
```

Includes a specific seif.

`centralShuSiman` on `Story` is the main siman for display and filtering. It is nullable because not every story is centered on one Shulchan Aruch siman.

### Search Body: `ShuRefBody`

```ts
{ shuSectionId, simanId?, seif? }
```

Search can target a section, siman, or specific seif.

---

## Reference Bundle

`getReference()` returns:

```ts
{ masechtot, shuSections, topics, books }
```

It is loaded once in RSC and hydrated into `useReferenceStore` through `<StoreHydrator>`. See [03-stores-and-cache.md](03-stores-and-cache.md).

---

## User

Canonical source: `userDataSchema` in [lib/schemas.ts](../../lib/schemas.ts).

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | App user id, created after registration |
| `googleId` | string | Google `sub`; identity source |
| `email` | string | From Google |
| `firstName`, `lastName` | string | Minimum length 2 |
| `institutionName` | string \| undefined | Optional |
| `phone` | string | Minimum length 9 |
| `occupations` | Occupation[] | At least one |
| `marketingConsent` | boolean | Required true on registration, editable later |

### Occupation
Closed enum with Hebrew labels in [lib/constants/categories.ts](../../lib/constants/categories.ts):

| Key | Label Meaning |
|-----|---------------|
| `dayyan` | Dayyan |
| `rabbi` | Rabbi |
| `teacher` | Teacher |
| `student` | Student |
| `parent` | Parent |
| `learner` | Learner |

Rules:
- `occupationEnum` is the source of truth for values.
- Display labels come from one map, `OCCUPATION_LABELS`; do not type labels manually throughout JSX.
- Adding an occupation updates both the enum and the label map in the same change.

### Derived Schemas
- `userDataSchema`: full entity shape.
- `onboardingSchema`: initial registration form; requires `marketingConsent === true`.
- `profileEditSchema`: edit form; allows `marketingConsent === false`.

Changing `userDataSchema` must flow into derived schemas. Do not duplicate the shape.

---

## Contact

Canonical source: `contactFormSchema` + `contactSchema` in `lib/schemas.ts`.

| Field | Type |
|-------|------|
| `name`, `email`, `subject`, `message` | strings with validation |
| `category` | ContactCategory enum |
| `pageUrl` | string \| undefined |
| `story` | story payload, required only when `category === 'story_question'` |

### ContactCategory

| Key | Label Meaning |
|-----|---------------|
| `general` | General message |
| `bug` | Bug report |
| `collaboration` | Collaboration |
| `story_question` | Question about a story |

The UI displays the same canonical categories through a labels/icons list derived from `ContactCategory`. There is no separate `request/comment/enlightenment` value set.

Rules:
- `category === 'story_question'` requires `story`; enforced with `superRefine`.
- The route handler validates the API payload, and the UI must ensure story context exists before submitting a story-specific question.
- `story.expansion` is optional in contact payloads. Include it only when the expansion exists and is currently visible to the submitting user; omit locked expansion content.

---

## Search: `SearchBody`

```ts
{
  q?: string;               // free text / AI search
  bookIds?: string[];       // filter by books
  topicIds?: string[];      // filter by topics
  shasRefs?: ShasRefBody[]; // filter by Shas pages
  shuRefs?: ShuRefBody[];   // filter by Shulchan Aruch refs
  concepts?: string[];      // concepts
  page?: number;            // pagination
  limit?: number;
}
```

Rules:
- All fields are optional. Empty body means "all".
- `shasRefs`: only `masechetId` is required; `daf` is optional.
- `shuRefs`: only `shuSectionId` is required; `simanId` and `seif` narrow the filter.
- UI uses `UiShasRef` / `UiShuRef` with internal `id` fields for React keys before submit.

---

## Relationship Rules

- Every Story belongs to one Book and one Topic.
- Every Topic belongs to one Book.
- Every ShasPage belongs to one Masechet.
- Every ShuSiman belongs to one ShuSection.
- A Story may have zero or more Shas refs and zero or more Shulchan Aruch refs.

---

## Relationship Diagram

```text
            +------+
            | Book |<---- Topic <----> Story
            +------+                  |  |  |  |
                                      |  |  |  `--> conceptsAi[], conceptsFromIndex[]
                         ShasRef -----+  |  |
                         ShasPage -> Masechet
                                      |
                         ShuRef ------+
                         ShuSiman -> ShuSection

            +------+         +--------------------+
            | User |         | Contact submission |
            +------+         +--------------------+
```

---

## Non-Urgent Recommendations

1. **Derive `OCCUPATIONS` from the enum.** Use `occupationEnum.options` to reduce sync points.
2. **Hebrew label file.** If full i18n starts, collect non-JSX Hebrew labels in `lib/i18n/he.ts`.
3. **Limit `StoryCard.legalQuestion`.** Cap card text around 200 chars to reduce bandwidth.
4. **Clarify `conceptsAi` vs `conceptsFromIndex`.** Document whether AI/manual concepts are complementary or should merge.
5. **`amud` display labels.** Render display symbols through `lib/hebrew-numerals.ts`.
6. **Soft delete stories.** Add `deletedAt` and filter it out in `searchStories`.
