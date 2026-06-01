# Specs

Long-lived project specifications. Each document stands on its own and defines architecture or product decisions that should remain valid throughout the project.

| # | Document | Topic |
|---|----------|-------|
| 00 | [Source of Truth](00-source-of-truth.md) | Document hierarchy, spec changes, decision ownership |
| 01 | [Architecture](01-architecture.md) | Stack, RSC-first architecture, error handling, head/SEO |
| 02 | [Server Access](02-server-access.md) | `lib/server/*`, BFF, `backendFetch`, response contracts |
| 03 | [Stores & Cache](03-stores-and-cache.md) | Zustand, synchronous hydration, Next 16 cache strategy |
| 04 | [Route Structure](04-route-structure.md) | Route shape, page/view/hook split, primitives |
| 05 | [Auth](05-auth.md) | NextAuth v4, Google OAuth, `proxy.ts`, onboarding |
| 06 | [Design System](06-design-system.md) | Tokens, themes, glassmorphism, RTL, animations |
| 07 | [Domain Model](07-domain-model.md) | Story / Question / Answer / Seder HaShas / Shulchan Aruch / User |
| 08 | [Modals & Notifications](08-modals-and-notifications.md) | Login/onboarding modals, toast UX |
| 09 | [Environment & Deployment](09-environment-deployment.md) | Environment variables, Vercel, build, security |
| 10 | [Testing & Quality](10-testing-and-quality.md) | Quality gates, tests, CI, release QA |
| 11 | [Core API Contract](11-core-api-contract.md) | Core API endpoints, request/response JSON, errors, pagination |

## Operating Rules

- Every spec starts with **Goal** and ends with **Non-Urgent Recommendations**.
- Any change that goes against a spec must update the relevant spec in the same PR.
- Specs describe the stable target, not the migration plan. Implementation gaps and temporary task lists belong in `docs/planning/*`.
- Specs are the source of truth. `AGENTS.md` and `CLAUDE.md` are operational summaries; when they conflict, the spec wins.
