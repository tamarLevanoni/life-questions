# CLAUDE.md Update — Page Architecture Rules

## Context

The current "Page Architecture Rules" section in [CLAUDE.md](../../CLAUDE.md) instructs `page.tsx` to hold store reads, `useEffect`, and an auth gate (`useSession` + `redirect`). This requires `'use client'` and breaks the server boundary of the Next.js App Router. Updating the section to align with Next.js convention.

## Replacing the "Page Architecture Rules" Section

New full wording:

```markdown
## Page Architecture Rules

Every `page.tsx` is a **Server Component** by default. Never include `'use client'` unless there is no way to render the page in the server context at all.

### ✅ Allowed in `page.tsx`
| Category | Example |
|----------|---------|
| `<PageShell>` wrapper | `<PageShell maxWidth="2xl">` |
| Compose a single `<X>View />` from `_components/` | `<ProfileView />` |
| `<Suspense>` boundary | `<Suspense fallback={...}><ContactPageContent /></Suspense>` |
| Future RSC data fetch | `const data = await fetchStory(id)` |

### ❌ Not allowed in `page.tsx` — extract instead
| What | Where it goes |
|------|--------------|
| `'use client'` | `_components/<route>-view.tsx` |
| `useState`, `useEffect`, `useSession` | `_components/use-<route>.ts` hook |
| Store reads (`useSearchResultsStore`, `useUserStore`, ...) | hook |
| Handlers (`handleSubmit`, `handleClick`, ...) | hook |
| Form hooks (`useForm`, `useFieldArray`) | `_components/use-<route>-form.ts` hook |
| `redirect()` for auth gate | `middleware.ts` (edge) |
| Raw JSX visual blocks | `_components/` component |

### Page pattern (mini-template)

```tsx
// app/<route>/page.tsx — Server Component
import { PageShell } from '@/components/common/page-shell';
import { XView } from './_components/x-view';

export default function XPage() {
  return (
    <PageShell maxWidth="2xl">
      <XView />
    </PageShell>
  );
}
```

```tsx
// app/<route>/_components/x-view.tsx — Client orchestrator
'use client';
import { useX } from './use-x';

export function XView() {
  const x = useX();
  return (/* compose sub-components using x */);
}
```

```ts
// app/<route>/_components/use-x.ts — State + logic
'use client';
export function useX() {
  // stores, effects, state, handlers
  return { /* ... */ };
}
```

**Hard limit: 120 lines.** Applies to `page.tsx`, `<X>View.tsx`, every component in `_components/`, and every hook. If exceeded, split.

### PageShell variants
`<PageShell>` is always called from a Server Component; its children may be client components.

| Page type | Pattern |
|-----------|---------|
| Content pages (profile, story, contact) | `<PageShell maxWidth="2xl/3xl/5xl">` |
| Landing / full-width (home, search) | `<PageShell fullWidth>` |
| Error / auth pages (not-found, auth/error) | `<div className="min-h-screen flex items-center justify-center"><GlassCard>` — no PageShell |
```

## Updating "Co-location Rules"

Add a line following the existing table:

> Every route that needs state/effects/auth has `_components/<route>-view.tsx` (client orchestrator) + `_components/use-<route>.ts` (hook). `page.tsx` stays a thin server wrapper.

## Updating "Data Layer"

Addition at the end of the section:

> Store reads (`useSearchResultsStore`, `useReferenceStore`, `useUserStore`, ...) happen inside the route's `use-<route>.ts` hook, never in `page.tsx`. The page must remain a Server Component.

## Updating "Forms"

The existing wording (`Extract the hook to _components/use-X-form.ts`) remains valid. Clarify in place: `useForm` is always consumed through a dedicated hook, never directly in the view or page.

## Verification

- Re-read CLAUDE.md after the update — no internal contradictions.
- Examples in the file match the pattern implemented in `app/search/`, `app/contact/`, `app/story/[id]/`, `app/profile/`.
