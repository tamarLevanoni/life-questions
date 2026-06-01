# Refactor — `app/profile/`

## Context

[`app/profile/page.tsx`](../../app/profile/page.tsx) is `'use client'` with 74 lines. It calls `redirect('/')` from the client during render (an anti-pattern in App Router — this should be in middleware at the edge), reads `useUserStore`, and invokes `useProfileForm`. Within the limit, but not compliant with the server boundary.

## Changes

### Infrastructure

- **New** `middleware.ts` at the project root:
  - matcher for `/profile/:path*`.
  - checks for a NextAuth session cookie (without decoding the JWT — existence only).
  - if no session → `NextResponse.redirect(new URL('/', req.url))`.
  - whether to open the onboarding modal on first arrival? No — that is handled by the client `useAuth` flow; middleware only handles the gate.
  - if `middleware.ts` already exists in the project, add the matcher to it instead of creating a new one.

### Under `app/profile/_components/`

- **New** `profile-view.tsx` (`'use client'`):
  - `useSession()`, `useUserStore`, compute `fullName`/`initials`.
  - if `status === 'loading'` or (`authenticated && !user`) → `<ProfileSkeleton />`.
  - otherwise: `useProfileForm(user)` and compose the sections — `ProfileHeroCard`, `PersonalInfoSection`, `OccupationsSection`, `PreferencesSection`, `AccountSection`.
  - **No `redirect()`** — that is handled by middleware.

### Changes to Existing Files

- **`app/profile/page.tsx`** — rewritten as a Server Component of ~8 lines:
  ```tsx
  import { PageShell } from '@/components/common/page-shell';
  import { ProfileView } from './_components/profile-view';

  export default function ProfilePage() {
    return (
      <PageShell maxWidth="2xl">
        <ProfileView />
      </PageShell>
    );
  }
  ```

### Unchanged

`use-profile-form.ts`, `profile-skeleton.tsx`, `profile-hero-card.tsx`, `personal-info-section.tsx`, `occupations-section.tsx`, `preferences-section.tsx`, `account-section.tsx`.

## Verification

- `bunx tsc --noEmit` + `bun lint`.
- `bun dev`:
  - `/profile` unauthenticated → middleware redirects to `/`. The modal itself is opened by the existing `useAuth` flow independently.
  - `/profile` authenticated → loading (skeleton), then all sections.
  - Edit: edit, change a field, save, toast.
- `page.tsx` without `'use client'`.
- `profile-view.tsx` < 120 lines.
