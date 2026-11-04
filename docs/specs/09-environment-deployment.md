# Environment and deployment

## Goal

Keep local/test/deployed environments explicit and secrets server-side.

## Variables

[.env.example](../../.env.example) documents `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_API_URL`, `INTERNAL_API_SECRET` and `NEXT_PUBLIC_SITE_URL`. Copy it to `.env.local` for local setup and supply real local/staging credentials outside Git.

`BACKEND_API_URL` points to the Core API origin; its local server defaults to port 3001. The frontend's `INTERNAL_API_SECRET` must equal the backend's `API_SECRET`. The names differ by service; the HTTP header is `x-api-secret` on both sides. Browser-to-Next requests use the site's own origin and session cookie; the browser does not send this backend credential.

The `NEXT_PUBLIC_` prefix exposes a variable to browser code. Server data passed as client props or returned through API/actions also becomes browser-visible. Never serialize backend/internal secrets or place them in public configuration, logs, fixtures or reports. Do not print `.env.local` while debugging. The Core API secret is attached server-side as `x-api-secret`.

Set `NEXT_PUBLIC_SITE_URL` to the deployed site's canonical origin. Without it, robots/sitemap use the placeholder `https://life-questions.example`. Keep `NEXTAUTH_URL` consistent with the environment's OAuth callback origin.

## Local and production

Use `bun install --frozen-lockfile` for reproducible installs, `bun dev` for development and `bun run build` / `bun start` for production builds. Do not run builds into the same output directory as an active development server. Remote hosts for Next image optimization are listed in [`next.config.ts`](../../next.config.ts); this list does not constrain raw `<img>` elements or external iframes.

Fonts are loaded by next/font; builds may need network access to their provider. Deploy configuration/secrets belong to the hosting environment, not committed env files. This repository's implementation does not prove a hosting dashboard, staging instance, monitoring service or branch protection is configured.

## Automated tests

[`tests/support/environment.ts`](../../tests/support/environment.ts) sets dedicated localhost frontend/backend ports and fake credentials, overriding inherited connection/auth values. [`prepare-app.ts`](../../tests/support/prepare-app.ts) sets these values before starting Next. `QUALITY_TEST=1` selects `.next-e2e` and a separate generated TypeScript config; reserve it for the isolated test environment. The mock Core API receives server-to-server requests as well as action/BFF flows. The app must contain no test-only authentication bypass endpoint.

Browser reports, sessions and screenshots are generated artifacts ignored by Git. Use only fictional users in automated reports. Google Form/YouTube/shop/WhatsApp/widget behavior is external and needs separate manual checks when changed.

## Operational boundaries

Updating repo CI files does not enable branch protection or deploy a site. Deployment, account settings, Auth migration and external monitoring require their own scoped work. [Quality](10-testing-and-quality.md) owns the actual checks; [backlog](../planning/backlog.md) owns future operational improvements.
