# Refactor — `app/story/[id]/`

## Context

[`app/story/[id]/page.tsx`](../../app/story/[id]/page.tsx) is `'use client'` with 102 lines. Despite being within the limit, it breaks the server boundary: store reads, `useParams`, `useRouter`, `useSession`, 2× `useEffect` (one of which calls `loadAll` which is forbidden per CLAUDE.md), derived computations, and substantial JSX with `MotionFadeIn`. It needs to be aligned to the pattern.

## Changes

Under `app/story/[id]/_components/`:

### New Files

- **`use-story-detail.ts`** — hook:
  - `useParams<{ id: string }>()`, `useRouter()`, `useSession()`.
  - stores: `useStoryDetailStore`, `useReferenceStore`.
  - effect 1: `fetchStory(storyId)` + cleanup `clear()` — `[storyId]`.
  - **removes** the call to `loadAll` (per CLAUDE.md `ReferencePreloader` already loads it).
  - computed: `canViewExpansion = !!session`, `book = books.find(b => b.id === story?.bookId)`, `prevId`, `nextId`, `storyTitleEncoded`.
  - handler: `requestExpansionAccess = () => router.push('/api/auth/signin')`.
  - returns all required values.

- **`story-view.tsx`** (`'use client'`, ~60 lines) — calls `useStoryDetail()`, and composes the `loading`/`error`/`story` branches. Every block is wrapped in `MotionFadeIn`.

- **`story-back-link.tsx`** — `<Link href="/search"><ArrowRight />Back to search</Link>` inside `MotionFadeIn`. Pure component.

- **`story-question-cta.tsx`** — the CTA link to `/contact?category=story_question&storyId=...&storyTitle=...`. Receives `storyId`, `storyTitle`.

### Changes to Existing Files

- **`app/story/[id]/page.tsx`** — rewritten as a Server Component of ~10 lines:
  ```tsx
  import { PageShell } from '@/components/common/page-shell';
  import { StoryView } from './_components/story-view';

  export default function StoryPage() {
    return (
      <PageShell maxWidth="3xl">
        <StoryView />
      </PageShell>
    );
  }
  ```

### Unchanged

`story-article.tsx`, `story-breadcrumb.tsx`, `story-navigation.tsx`, `story-not-found.tsx`, `story-sources-list.tsx`, `ExpandableAnswerPanel`.

## Verification

- `bunx tsc --noEmit` + `bun lint`.
- `bun dev`, `/story/<id>`:
  - Loading: skeleton.
  - Error / non-existent id: `StoryNotFound`.
  - Valid: title + article + short answer + expansion (locked when unauthenticated) + CTA + navigation.
  - Clicking "expansion" when unauthenticated → navigates to signin.
  - Previous/next navigation works.
- `page.tsx` without `'use client'`.
- No more calls to `loadAll` from the page.
