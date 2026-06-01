# Refactor — `app/contact/`

## Context

[`app/contact/_components/contact-form.tsx`](../../app/contact/_components/contact-form.tsx) is 240 lines containing: `useForm` + zod, local state (`isSubmitting`, `successOpen`), `useSession`, `useToast`, `useContactStore`, `useStoryDetailStore`, `useEffect` for query param sync, a static category list, a duplicated helper `FormField` (already available in [`components/ui/form-field.tsx`](../../components/ui/form-field.tsx)), and heavy JSX. Significantly violates the 120-line limit.

`app/contact/page.tsx` (server, 13 lines) and `contact-page-content.tsx` (29 lines) remain unchanged.

## Changes

Under `app/contact/_components/`:

### New Files

- **`use-contact-form.ts`** — hook unifying all logic:
  - `useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) })`.
  - state: `isSubmitting`, `successOpen`.
  - integrations: `useContactStore`, `useStoryDetailStore`, `useSession`, `useToast`.
  - `useEffect` that syncs `storyId/storyTitle/category` from query params and calls `fetchStory` if there is a `storyId` and no story is loaded.
  - `onSubmit(values)` — submits, shows toast, opens dialog on success, clears form.
  - `story.expansion` is sent only if the expansion exists and is visible to the submitting user; locked expansion is not sent even if the full story object is in memory.
  - receives `storyId`, `storyTitle` from props (passed from `contact-page-content.tsx`).

- **`contact-categories.ts`** — pure data module: `BASE_CATEGORIES` + `STORY_CATEGORY` + `CategoryItem` type.

- **`contact-success-dialog.tsx`** — extracts the success dialog JSX (if one currently exists in `contact-form.tsx`).

### Changes to Existing Files

- **`contact-form.tsx`** — `'use client'`, ~80 lines:
  - Removes the internal `FormField` helper, uses `<FormField>` from `@/components/ui/form-field`.
  - Removes all state/effect/store calls — calls `useContactForm({ storyId, storyTitle })`.
  - JSX only, consuming hook values.

- **`contact-page-content.tsx`** — stays as-is (29 lines), continues passing `storyId/storyTitle` from `useSearchParams` to `<ContactForm>`. Alternative: move `useSearchParams` inside the hook — not doing this now to avoid breaking the existing split.

- **`app/contact/page.tsx`** — no changes. Stays server.

### Unchanged

`contact-sidebar.tsx`.

## Verification

- `bunx tsc --noEmit` + `bun lint`.
- `bun dev`, `/contact`:
  - Fill out the form, submit, success toast, dialog opens, fields cleared.
  - Arriving from `/contact?category=story_question&storyId=...&storyTitle=...`: category is selected, story is displayed.
  - Field error: error shown below the field.
- `contact-form.tsx` < 120 lines.
