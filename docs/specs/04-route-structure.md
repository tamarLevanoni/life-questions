# Route Structure Spec

## Goal
Define how a new route is created: folder shape, responsibility split, and when to extract components or hooks.

---

## Full Route Anatomy

```text
app/<route>/
├── page.tsx                          # Server Component, ideally <=30 lines
├── _components/
│   ├── <route>-view.tsx              # Client orchestrator
│   ├── use-<route>.ts                # State + logic
│   ├── use-<route>-form.ts           # Only when the route has a form
│   └── <feature>-section.tsx ...     # Child components
└── error.tsx / loading.tsx           # Only when needed
```

Responsibilities:

| File | Runtime | Responsibility |
|------|---------|----------------|
| `page.tsx` | Server | `generateMetadata`, RSC fetch, wrap in `<PageShell>` + `<StoreHydrator>`, render `<XView />` |
| `<route>-view.tsx` | Client | Calls `useX()`, composes child components, no internal business state |
| `use-<route>.ts` | Client | Reads stores, effects, handlers, transient state; never reads `initial*` props |
| `use-<route>-form.ts` | Client | `react-hook-form` + Zod setup and submit handler |
| `<feature>-section.tsx` | Usually client | Pure display for one section; props only |

---

## Hard Rules

1. **`page.tsx` is a Server Component.** Never add `'use client'`.
2. **120 lines is a hard limit** for files in `_components/`, page files, and hooks. Split before crossing it.
3. **Folders and files are English kebab-case.** Hebrew belongs only in JSX strings or label maps.
4. **File name matches export name.** `story-view.tsx` exports `StoryView`.
5. **One component per file.** If an internal component grows beyond 20 lines, extract it.
6. **Shared primitive names are reserved.** Do not define a local `SectionHeader` when `components/ui/section-header.tsx` exists.
7. **Do not duplicate `<AppHeader>` or `<main>`.** Page layout goes through `<PageShell>`.

---

## Typical Route Example

```tsx
// app/<route>/page.tsx
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getX } from '@/lib/server/x';
import { XView } from './_components/x-view';

export const metadata: Metadata = { title: 'Page | Life Questions' };

export default async function XPage() {
  const x = await getX();
  return (
    <PageShell maxWidth="2xl">
      <StoreHydrator x={x}>
        <XView />
      </StoreHydrator>
    </PageShell>
  );
}
```

```tsx
// _components/x-view.tsx
'use client';
import { useX } from './use-x';
import { HeaderSection } from './header-section';
import { BodySection } from './body-section';

export function XView() {
  const x = useX();
  if (x.loading) return <SkeletonLines count={4} />;
  if (x.error) return <EmptyState title="Error" subtitle={x.error} />;
  return (
    <>
      <HeaderSection x={x.x} />
      <BodySection items={x.items} onAction={x.handleAction} />
    </>
  );
}
```

```ts
// _components/use-x.ts
'use client';
import { useXStore } from '@/lib/stores/x-store';

export function useX() {
  const { x, items, loading, error, doAction } = useXStore();
  return { x, items, loading, error, handleAction: doAction };
}
```

---

## PageShell Rules

`<PageShell>` is always called from a Server Component, but its children may be client components.

| Page Type | Wrapper |
|-----------|---------|
| Main content: profile, story, contact | `<PageShell maxWidth="2xl/3xl/5xl">` |
| Landing / search | `<PageShell fullWidth>` |
| Auth / not-found / error | No PageShell; use a centered layout with `<GlassCard>` when needed |

---

## Forms

Always use `react-hook-form` + Zod:

```ts
// _components/use-contact-form.ts
'use client';
export function useContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ... },
  });

  const onSubmit = async (data) => {
    // ...
  };
  return { ...form, onSubmit };
}
```

In the view:

```tsx
<form onSubmit={form.handleSubmit(form.onSubmit)}>
  <FormField label="Full name" error={form.formState.errors.name?.message}>
    <Input {...form.register('name')} />
  </FormField>
</form>
```

Rules:
- Every input is wrapped in `<FormField label error>`. Do not hand-roll label/input/error rows.
- The schema lives in `lib/schemas.ts`; types are derived via `z.infer`.
- Submit handlers return `Promise`; the view uses `form.formState.isSubmitting`.

---

## Navigation And Links

- Use `<Link href="/...">`, not `<a>`, for internal navigation.
- Use `router.push()` only when logic must happen before navigation, such as validation or confirmation.
- Persist route state such as search query and filters in the URL through `useSearchParams()` + `router.replace(...)`, not in a global Zustand store.

---

## Route Protection

| Type | Mechanism |
|------|-----------|
| Soft-gate, partial content locked for guests | Client UI: `<ExpandableAnswerPanel isLocked />`. The page loads normally. |
| Hard-gate, entire route closed | `proxy.ts` with `config.matcher`, for example `['/profile/:path*']`. Do not add page-level auth redirects. |

The page itself does not perform auth redirects. Hard-gates live in `proxy.ts`, so protected pages do not render for guests.

---

## Required Primitives

| Primitive | Path | Purpose |
|-----------|------|---------|
| `<PageShell>` | `components/common/page-shell.tsx` | Page wrapper |
| `<StoreHydrator>` | `components/common/store-hydrator.tsx` | RSC-to-store hydration |
| `<GlassCard>` | `components/ui/glass-card.tsx` | Glass-style containers |
| `<SectionHeader>` | `components/ui/section-header.tsx` | Section title + subtitle |
| `<FormField>` | `components/ui/form-field.tsx` | Input row |
| `<MotionFadeIn>` | `components/common/motion-fade-in.tsx` | Motion primitive |
| `<EmptyState>` | `components/common/empty-state.tsx` | Empty and error states |
| `<SkeletonLines>` / `<SkeletonCardList>` | `components/common/loading-skeleton.tsx` | Loading states |

Rule: if a Tailwind pattern repeats three times, extract a primitive into `components/common/` or `components/ui/` before the fourth use.

---

## When To Use `<Suspense>`

- Use separate `<Suspense fallback={...}>` boundaries for page sections that have different loading times.
- With Next.js 16 Cache Components, `<Suspense>` defines dynamic holes inside a shell that can be rendered earlier.

---

## Route-Level `loading.tsx` / `error.tsx`

- **`loading.tsx`:** use when route-level RSC work takes more than about 300ms and a meaningful placeholder exists.
- **`error.tsx`:** use when the route needs a local recovery UI instead of the global error boundary, such as a story page with a link back to search.

---

## New Route Checklist

- [ ] `app/<route>/` exists.
- [ ] `page.tsx` is a Server Component, <=30 lines where practical, and owns metadata.
- [ ] `_components/<route>-view.tsx` and `use-<route>.ts` exist.
- [ ] Forms have a separate `use-<route>-form.ts`.
- [ ] Child components are <=120 lines each.
- [ ] Only `<PageShell>` wraps top-level page layout; no manual `<AppHeader>` or `<main>`.
- [ ] Empty and error states use `<EmptyState>`.
- [ ] Loading states use `<SkeletonLines>`, `<SkeletonCardList>`, or `<Suspense>`.
- [ ] No `app/api/` endpoint is added unless a real client action needs it.
- [ ] Protected routes update `proxy.ts` `matcher`.

---

## Non-Urgent Recommendations

1. **Route Groups (`(marketing)`, `(auth)`).** Add when more pages need grouped layouts.
2. **Parallel Routes.** Use `@modal/(.)login` if the login modal needs a shareable/deep-linkable URL.
3. **Intercepting Routes.** Open a story from search results as a modal while keeping a shareable full URL.
4. **`loading.tsx` for slow RSC routes.** Use when the fallback belongs at route level instead of component level.
5. **Storybook for `_components/`.** Add only when the team needs visual documentation.
6. **i18n routing.** Use `app/[locale]/...` with `next-intl` if another product language is added.
