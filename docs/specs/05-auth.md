# Auth Spec

## Goal
Define the auth flow end to end: login, session, registration onboarding, content gating, and protected routes.

---

## Base Requirements

- Provider: **Google OAuth only.**
- Session: **JWT** stored in an HttpOnly cookie. No database session.
- Registration: after first OAuth login, an onboarding modal collects profile details: name, phone, optional institution, occupations, and marketing consent.
- Two protection modes:
  - **Soft-gate:** story expansion content is locked, but the story page loads and remains indexable.
  - **Hard-gate:** `/profile` and similar routes are unavailable to guests.

---

## Technology

- `next-auth@4.24.x`, `next-auth/jwt`, and `next-themes`.
- Auth.js v5 migration is a separate, non-urgent migration. Do not mix v5 APIs into v4 code.

---

## Files Involved

| File | Role |
|------|------|
| `app/api/auth/[...nextauth]/auth-options.ts` | `authOptions`: providers and callbacks |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth handler |
| `app/providers.tsx` | `<SessionProvider>` + `<AuthProvider>` + `<SessionUserSync>` |
| `lib/auth-context.tsx` | Login/onboarding modal state |
| `components/providers/session-user-sync.tsx` | Session-to-`useUserStore` sync |
| `lib/server/user.ts` | `getCurrentUser`, `requireSessionUser`, `requireGoogleSession`, `registerUser`, `updateCurrentUser` |
| `proxy.ts` | Hard-gate for `/profile` |
| `types/next-auth.d.ts` | Extended Session/User types |
| `components/auth/login-modal.tsx` | Login modal UI |
| `components/auth/onboarding-modal.tsx` | Registration completion modal UI |

---

## Session Contract

```ts
// types/next-auth.d.ts
interface Session.user {
  id: string;                        // app user id, available after registration
  googleId: string;                  // Google provider account id / sub
  email: string;
  name: string;
  image?: string;
  isRegistrationComplete: boolean;   // false until onboarding is complete
}
```

Rules:
- Code that needs `id` must check `isRegistrationComplete` or use `googleId`.
- Do not rely on session fields outside this contract.
- Adding a session field requires updating both `types/next-auth.d.ts` and `callbacks.session` in `auth-options.ts`.

---

## First Login Flow

```text
1. User clicks "Sign in"
   -> AuthContext.openLoginModal()
   -> LoginModal shows Google button
2. signIn('google') redirects to Google
3. Google returns to /api/auth/callback/google
4. callbacks.jwt creates a token with googleId and isRegistrationComplete=false
5. callbacks.session copies token fields into session.user
6. User returns to / or callbackUrl
7. AuthProvider sees isRegistrationComplete=false and opens OnboardingModal
8. User submits onboarding form
   -> POST /api/user/register
   -> core API creates user
9. Response returns { id, isRegistrationComplete: true }
10. useUserStore.setUser runs and the modal closes
11. The JWT is updated with the completed user fields
```

Rules:
- `LoginModal` and `OnboardingModal` are mounted only once in `app/providers.tsx`.
- `AuthContext` controls modal open/closed state. Components request opening through context.
- Use `useAuth().openLoginModal()` from components that need login.

---

## Guest Story Flow

```text
1. /story/[id] RSC calls getStory() and returns the public story
2. <ExpandableAnswerPanel isLocked={!canViewExpansion} />
3. Guest requests expansion access
   -> onRequestAccess
   -> login flow
4. After login, the user returns to the story and isLocked=false
```

Story body, legal question, and short answer are public. This is required for SEO and guest value.

---

## `/profile` Flow

```text
1. Request /profile
2. proxy.ts calls getToken()
   -> no token redirects to /
3. With token, the page loads
4. page.tsx (RSC) calls getCurrentUser()
5. <StoreHydrator user={user}> hydrates useUserStore
6. ProfileView reads useUserStore
```

`/profile/page.tsx` does not perform auth redirects. Protection is handled in `proxy.ts`.

---

## `proxy.ts`

```ts
// proxy.ts at project root
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/profile/:path*'] };
```

To add a protected route, add it to `matcher`. Do not add page-level auth redirects.

---

## Server Auth Helpers

```ts
// lib/server/user.ts
requireSessionUser()    // throws 401 when there is no app user id; use for mutations
requireGoogleSession()  // throws 401 when there is no googleId; use for registration
getCurrentUser()        // returns null when there is no session; use in RSC pages
```

Server-side auth checks always live in `lib/server/*`, not in route handlers. Routes only invoke server helpers and wrap responses.

---

## Session And Store Sync

`<SessionUserSync>` connects auth status to `useUserStore`:

```ts
useEffect(() => {
  if (status === 'authenticated' && session?.user?.id && !useUserStore.getState().user) {
    setUser(session.user as UserData);
  } else if (status === 'unauthenticated') {
    clearUser();
  }
}, [session, status]);
```

Rule: session is an auth-status signal, not always the richest profile source. If `getCurrentUser()` hydrated a full user through `<StoreHydrator>`, `SessionUserSync` must not overwrite it with a partial session object.

---

## Auth Error Handling

| Situation | Handling |
|-----------|----------|
| `/profile` without session | `proxy.ts` redirects to `/` |
| Mutation without session | `runRoute` returns 401 and store renders an error |
| Google OAuth failure | Redirect to `/auth/error?error=...` |
| Invalid JWT | NextAuth clears/ignores the cookie and client status becomes `unauthenticated` |
| Core API returns 404 for `/api/users/google/<id>` | `getCurrentUser()` returns null, meaning registration is incomplete |

---

## Design Decisions

- JWT-only sessions avoid a DB call on every access check.
- Login and onboarding modals are mounted at provider level to avoid duplicated UI.
- Soft-gate and hard-gate are separate code paths.
- NextAuth v4 has no universal `auth()` helper, so server code uses `getServerSession(authOptions)`.
- Google refresh-token flow is not needed because the app does not call Google APIs after login.

---

## Checklist For Adding A Protected Route

- [ ] Add the route to `proxy.ts` `matcher`.
- [ ] The page calls `getCurrentUser()` or `requireSessionUser()` as appropriate.
- [ ] Client components read `useUserStore`, not `useSession` directly, except for `status`.
- [ ] Mutations go through BFF; server helpers call `requireSessionUser()`.
- [ ] Private pages set `robots: { index: false }` when they should not be indexed.

---

## Non-Urgent Recommendations

1. **Auth.js v5 migration.** Do in a dedicated PR when auth work already justifies it, such as adding another provider.
2. **`AuthContext` to store.** Modal open/closed state can live in a small Zustand UI store.
3. **Role-based access.** Add `role` to the JWT and route checks in `proxy.ts` when admin routes exist.
4. **Rate limit login attempts.** Relevant if email/password auth is added.
5. **Better Auth.** Do not replace a working NextAuth setup unless a real project need appears.
6. **Email magic link.** NextAuth v4 supports it if the product needs non-Google users.
