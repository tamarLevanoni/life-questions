# Environment And Deployment Spec

## Goal
Define required environment variables, where they are configured, how local/preview/production differ, and how deployment works.

---

## Environment Variables

### Required In Every Environment

| Variable | Role | Read By | Public? |
|----------|------|---------|---------|
| `BACKEND_API_URL` | Core Node.js API URL | `lib/backend-fetch.ts` | No |
| `INTERNAL_API_SECRET` | Secret attached as `x-api-secret` to core API calls | `lib/backend-fetch.ts` | No |
| `NEXTAUTH_SECRET` | JWT signing secret | NextAuth + `proxy.ts` | No |
| `NEXTAUTH_URL` | Canonical app URL for NextAuth | NextAuth | No |
| `GOOGLE_CLIENT_ID` | OAuth client id | NextAuth provider | No |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | NextAuth provider | No |
| `NEXT_PUBLIC_SITE_URL` | Public app base URL for sitemap/OG/canonical URLs | `app/sitemap.ts`, metadata | Yes |

### Variable Rules

1. `NEXT_PUBLIC_*` is the only prefix exposed to the browser. Secrets must never use this prefix.
2. Files that read `process.env.<X>!` at module scope, such as `lib/backend-fetch.ts`, must import `'server-only'` when they are server-only.
3. Client code reads environment only through `NEXT_PUBLIC_*`.
4. Required variables do not get magic fallbacks such as `process.env.X ?? 'default'`; fail early instead.

---

## `.env` Files

Recommended structure:

```text
.env.example          # committed; documents fields without real values
.env.local            # local development; real values; not committed
.env.development      # optional local overrides
.env.production       # only for self-hosting; Vercel uses dashboard env vars
```

Rule: when adding a variable, update `.env.example`, then local env, then Vercel env values.

Example `.env.example`:

```bash
# Backend
BACKEND_API_URL=https://api.dev.example.com
INTERNAL_API_SECRET=changeme

# Auth
NEXTAUTH_SECRET=run_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Environments

| Environment | URL | Branch | Variables |
|-------------|-----|--------|-----------|
| Local dev | `localhost:3000` | working branch | `.env.local` |
| Vercel preview | `<branch>.vercel.app` | any non-`main` branch | Vercel Preview env |
| Vercel production | production domain | `main` | Vercel Production env |

Rules:
- `BACKEND_API_URL` in preview may point to staging or production; the team must choose that policy explicitly.
- `NEXT_PUBLIC_SITE_URL` must match the environment for sitemap and canonical URLs.
- `INTERNAL_API_SECRET` may be shared across preview/prod only if the core API does not separate those environments.

---

## Security

1. Never write secrets in code, PR descriptions, commit messages, or tests.
2. Rotate `INTERNAL_API_SECRET` at least quarterly or after developer offboarding.
3. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`. Rotating it logs out existing sessions.
4. Rotate `GOOGLE_CLIENT_SECRET` only through Google Cloud Console. Redirect URIs must exist for every environment.
5. Ensure `backendFetch` never logs the internal secret.

---

## Build And Deploy

### Vercel

The app deploys to Vercel as a native Next.js project:
1. Connect the Vercel project to the GitHub repository.
2. Framework: Next.js auto-detected.
3. Build command: `bun run build`; install command: `bun install`.
4. Node version: latest LTS; Bun runtime: latest available.
5. Environment variables are configured through Vercel UI per Preview/Production.

### Build Artifacts
- Next.js build uses Turbopack, configured in [next.config.ts](../../next.config.ts).
- `cacheComponents: true` enables Cache Components and PPR.
- Static assets in `public/` are served through Vercel CDN.

### Deploy Lifecycle
1. Merge to `main` triggers production deployment according to Vercel project settings.
2. Any other branch creates a unique preview URL.
3. Rollback uses Vercel UI and restores a previous deployment.

---

## External Images And Links

[next.config.ts](../../next.config.ts) defines allowed `remotePatterns` for external media hosts:
- `media.licdn.com`
- `cdn.hailuoai.video`
- `www.youtube.com`

Rule: add any new image host to `remotePatterns` before using it with `next/image`.

---

## CI

Every PR runs a basic GitHub Actions workflow:

```yaml
- bun install
- bun lint
- bunx tsc --noEmit
- bun build
```

---

## Observability

Observability sits behind central APIs:
- **Sentry / Logfire** through `instrumentation.ts` for RSC and route handlers.
- **Vercel Analytics** for basic usage metrics.
- **Web Vitals** through `useReportWebVitals` and an internal analytics endpoint.

---

## DNS And Fonts

- Fonts are loaded through `next/font`, not external CDNs. See [01-architecture.md](01-architecture.md).
- Manual `<link rel="preconnect">` is not required for fonts handled by `next/font`.

---

## Pre-Deploy Checklist

- [ ] `.env.example` updated if a variable was added.
- [ ] Vercel preview passed.
- [ ] `bun build` runs locally without warnings.
- [ ] `bunx tsc --noEmit` is clean.
- [ ] `bun lint` is clean.
- [ ] New external image hosts are added to `remotePatterns`.
- [ ] Auth changes are reflected in Google OAuth redirect URIs.
- [ ] `NEXT_PUBLIC_SITE_URL` is correct per environment.

---

## Non-Urgent Recommendations

1. **`instrumentation.ts`.** Add Sentry/OTel integration.
2. **Vercel Edge Config.** Use for feature flags instead of redeploying.
3. **Story image CDN.** Move core-served images to Cloudinary/Imgix or similar if optimization is needed.
4. **Health check endpoint.** Add `app/api/health/route.ts` that verifies core API reachability.
5. **Protected staging branch.** Add a stable staging branch with isolated data.
6. **Vercel storage products.** Consider `@vercel/blob` or `@vercel/postgres` only if the project moves storage into Vercel.
7. **Deploy preview comments.** Add PR comments with screenshots of key pages through Vercel + Playwright.
