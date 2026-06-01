# Life Questions

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Bun](https://img.shields.io/badge/Bun-Runtime-orange?style=for-the-badge&logo=bun)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Torah-learning content through real-life stories, questions, short answers, and source-based expansions.

</div>

---

## Source Of Truth

The long-lived project specifications live in [docs/specs](docs/specs). This README is only a quick-start and orientation document. If anything here conflicts with the specs, the specs win.

Migration and refactor plans live in [docs/planning](docs/planning).

---

## Product Model

Each story follows this content hierarchy:

- **Story**: a short real-life scenario.
- **Legal question**: the halachic question raised by the story.
- **Short answer**: public, concise answer.
- **Expansion**: deeper explanation and sources, gated for authenticated users when present.

Content can be organized by:

- **Seder HaShas**: masechet, daf, amud.
- **Shulchan Aruch**: section, siman, seif.
- **Concepts**: indexed or AI-assisted concepts.
- **Books and topics**: product-level content organization.

---

## Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 App Router with Cache Components |
| UI | React 19, Tailwind CSS 4, Shadcn/ui |
| State | Zustand 5 |
| Auth | NextAuth v4, Google OAuth, JWT session |
| Forms | react-hook-form + Zod 4 |
| Motion | Framer Motion through project primitives |
| Runtime/package manager | Bun only |

Do not use npm or yarn for project commands.

---

## Architecture At A Glance

```text
RSC page.tsx -> lib/server/* -> backendFetch -> Core API
                                                    ^
client store -> app/api/* BFF -> lib/server/* ------+
```

Key rules:

- `page.tsx` stays a Server Component.
- Page data loads through `lib/server/*`, not through client `useEffect`.
- Client stores call BFF routes through `lib/api-client.ts`.
- The BFF exists for client mutations and user-driven refetches only.
- Core API endpoints and payloads are defined in [docs/specs/11-core-api-contract.md](docs/specs/11-core-api-contract.md).

---

## Getting Started

```bash
git clone <repository-url>
cd life-questions
bun install
cp .env.example .env.local
bun dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).

---

## Environment

Required local variables are documented in [.env.example](.env.example):

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_API_URL=http://localhost:4000
INTERNAL_API_SECRET=your-internal-api-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

For Google OAuth, add this redirect URI in Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

---

## Scripts

```bash
bun dev              # local dev server
bun build            # production build
bun start            # production server
bun lint             # ESLint
bunx tsc --noEmit    # TypeScript check
```

---

## Project Structure

```text
app/
  api/                        # BFF route handlers
  <route>/page.tsx            # Server Component pages
  <route>/_components/        # route-local views, hooks, sections
  layout.tsx
  providers.tsx
  sitemap.ts
  robots.ts
components/
  common/                     # PageShell, StoreHydrator, MotionFadeIn, skeletons
  ui/                         # Shadcn primitives and project UI primitives
  layout/                     # AppHeader, Footer
  providers/                  # global client side-effects
  story/
  auth/
lib/
  server/                     # server-only Core API access
  stores/                     # Zustand stores
  schemas.ts
  types.ts
  api-client.ts
  backend-fetch.ts
docs/specs/                   # long-lived source of truth
docs/planning/                # temporary migration/refactor plans
proxy.ts                      # protected-route gate
public/
```

---

## Documentation Map

- [Architecture](docs/specs/01-architecture.md)
- [Server Access](docs/specs/02-server-access.md)
- [Stores & Cache](docs/specs/03-stores-and-cache.md)
- [Route Structure](docs/specs/04-route-structure.md)
- [Auth](docs/specs/05-auth.md)
- [Design System](docs/specs/06-design-system.md)
- [Domain Model](docs/specs/07-domain-model.md)
- [Core API Contract](docs/specs/11-core-api-contract.md)

---

## License

MIT License. See [LICENSE](LICENSE).
