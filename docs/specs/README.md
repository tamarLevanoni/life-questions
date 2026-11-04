# Maintained project specs

Start with the owner of the task; do not load the whole documentation set for every edit. Framework APIs are documented by the installed Next.js package, while these specs own project choices.

These reference documents serve developers and coding agents. Read [Documentation authority](00-source-of-truth.md), then the relevant owner below and its related contracts. Descriptive sections record implemented behavior; instructions define requirements for changes. When implementation falls short, record the gap in the [backlog](../planning/backlog.md) rather than treating it as an approved pattern.

| # | Owner | Subject |
|---|---|---|
| 00 | [Authority](00-source-of-truth.md) | Sources, maintenance, plans and history |
| 01 | [Architecture](01-architecture.md) | Runtime boundaries, layout, errors and SEO |
| 02 | [Server access](02-server-access.md) | Core API wrapper, BFF and actions |
| 03 | [State/cache](03-stores-and-cache.md) | Existing stores, hydration and actual cache policy |
| 04 | [Routes/forms](04-route-structure.md) | Composition, primitives, validation and navigation |
| 05 | [Auth](05-auth.md) | Google, NextAuth v4, session trust and access policy |
| 06 | [UI](06-design-system.md) | Stable principles and changeable appearance |
| 07 | [Domain](07-domain-model.md) | Entities and executable schema owners |
| 08 | [Interactions](08-modals-and-notifications.md) | Modals, feedback and ownership |
| 09 | [Environment](09-environment-deployment.md) | Secrets, build and operational boundaries |
| 10 | [Quality](10-testing-and-quality.md) | Verification tools and acceptance |
| 11 | [Core API expectations](11-core-api-contract.md) | Observed upstream endpoints and compatibility |

[Planning](../planning/README.md) owns proposals, implementation sequencing and outstanding tasks; it is not a second source of architecture rules. Historical documents can describe removed code and must not be used as current instructions.

## Terms used across the specs

- React Server Components (RSC) render content on the server; Client Components handle browser interactions and may also render during server-side rendering (SSR).
- Backend for frontend (BFF) refers to this Next.js app's browser-facing API handlers. The Core API is the separate upstream service.
- Cache Components is the enabled Next.js caching model. A persistent cache can reuse data across requests; request deduplication cannot.
- Right-to-left (RTL) describes the Hebrew reading and layout direction. JSON Web Tokens (JWT) carry session identity.
