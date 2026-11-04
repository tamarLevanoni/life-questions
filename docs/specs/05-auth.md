# Authentication and access

## Goal

Preserve the existing Google/JWT login and onboarding flow while enforcing trust at server entrypoints.

## Technology and flow

NextAuth **v4** with Google OAuth and HttpOnly JWT session cookies. Do not mix Auth.js v5 APIs into this project.

`LoginModal` opens `/auth/signin` in a popup; it starts Google login. `/api/auth/callback/google` completes OAuth. `/auth/callback` notifies the opener with a same-origin message and closes. `SessionUserSync` refreshes the session and synchronizes `useUserStore`. `AuthRuntime` hosts login/onboarding UI under Suspense.

The callback owns one explicit `getSession()` request and waits for it to finish before notifying the opener and closing. It reuses that request across development effect reconnections. On this route, `SessionProvider` starts with `session={null}` so it does not start a competing initial request that closing would abort. Other routes retain normal session loading. The notification only requests a session refresh; it does not authenticate the opener. Opening the callback without an opener reloads home so its provider initializes normally.

User-store auth states are `idle`, `unauthenticated`, `registration-required`, `authenticated`; these differ from NextAuth's session status. A Google session can exist before app registration is complete. New Google users complete the onboarding form through a Server Action. Profile edits also use a Server Action. Both flows call `useSession().update()` to refresh profile data from the backend.

## Route policy

| Surface | Current guest behavior |
|---|---|
| Home, about, weekly question, search screen | public |
| Search execution | UI requests login; BFF calls `requireGoogleSession()` and returns 401 without a Google session |
| `/story/[id]` | proxy redirects to home with auth-story alert |
| `/story/featured/[id]` | public example/weekly lookup, including the available expansion |
| `/profile` | proxy redirects to home with auth-profile alert |
| General contact | public |
| Contact with category=story_question | proxy redirects guest to general contact with auth-contact alert |

Content pages do not implement auth redirects. [`proxy.ts`](../../proxy.ts) checks the signed token's identity version for matched pages; it does not require completed registration. It does not match the search API, whose handler authenticates separately.

[`session.ts`](../../lib/server/session.ts) defines the server checks. Search BFF, registration and story-question contact require a Google session. Profile updates additionally require an app user id and completed registration. General contact stays public. The onboarding modal handles `registration-required` users; it does not replace these server checks.

## Identity and session trust

Identity originates in the verified Google provider account. Browser input to `useSession().update()` only triggers a server lookup and cannot replace JWT identity/profile fields. At sign-in and explicit update, [`lookupSessionUser`](../../lib/server/session-user.ts) validates the backend user and checks its Google id. A missing user clears app profile fields, retains the Google identity and existing token email, and requires onboarding. Ordinary session reads reuse the JWT fields without fetching the backend profile again.

Registration input and its returned user must match the session's Google id and email. Profile mutations target the session's app user id; their schema omits id, Google id and email from mutable fields. Their returned user must match all three identity fields before it is passed to client state.

The [callbacks](../../app/api/auth/[...nextauth]/auth-options.ts) and proxy enforce [`AUTH_IDENTITY_VERSION`](../../lib/auth-identity.ts), currently 1. Older cookies require a fresh sign-in. Internal search remains available to sitemap without a browser session. [Session tests](../../tests/unit/auth-session.test.ts) and [boundary tests](../../tests/unit/auth-boundaries.test.ts) cover these trust rules; the [quality foundation record](../planning/project-quality-foundation.md) records execution evidence.

## Failure behavior

Only a genuine upstream 404 means a new/unregistered user. Network errors, invalid upstream data and server failures must not silently turn an existing account into a new one. Never log tokens, cookies, Google secrets or profile payloads. Check session readiness before auth-dependent client interactions.

The test suite uses sessions signed with a dedicated local secret. There is no application login-bypass route. Real Google OAuth and popup/provider interaction still require a manual staging check.
