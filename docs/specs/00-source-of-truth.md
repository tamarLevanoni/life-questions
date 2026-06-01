# Source Of Truth Spec

## Goal
Define how the project specs are read, updated, and implemented so they remain stable throughout the lifetime of the project.

---

## Document Hierarchy

| Document | Purpose | Authority |
|----------|---------|-----------|
| `docs/specs/*` | Long-lived architecture, domain, UX, and quality contract | Binding source of truth |
| `AGENTS.md`, `CLAUDE.md` | Operational summary for coding agents | Derived from the specs; not a replacement |
| `README.md` | Project onboarding and quick-start documentation | Useful documentation, not an architecture contract |
| `docs/planning/*` | Migration plans, PR decisions, temporary task lists | Temporary; not a long-lived source of truth |
When documents conflict, `docs/specs/*` wins. If code or another document requires an architectural change, update the relevant spec first, then update the implementation.

---

## How To Write Specs

A spec describes a stable decision, not a transition state. Therefore:
- Use binding, neutral language: "Every page is a Server Component", "Reference data is loaded in RSC".
- Do not write "currently", "for now", "after we enable", "TODO", or "remove later".
- Do not document refactor debt inside a spec. Debt, sequencing, and implementation gaps belong in `docs/planning/*`.
- Do not keep two legitimate ways to do the same thing. If a temporary alternative exists, it belongs only in a migration plan.

---

## How To Change Specs

A spec change is a product or architecture change, not a side note.

Process:
1. Define the stable decision in the relevant spec.
2. Update derived documents when needed (`AGENTS.md`, `CLAUDE.md`, `README.md`).
3. If implementation differs from the spec, document the migration in `docs/planning/<feature>.md`.
4. Implement code changes according to the spec, one step at a time.

---

## Decision Boundaries

| Area | Decision Owner |
|------|----------------|
| Architecture, RSC, SEO, errors | `01-architecture.md` |
| Core API access, BFF, response contracts | `02-server-access.md` |
| Stores, hydration, Cache Components | `03-stores-and-cache.md` |
| Route structure, page/view/hook split | `04-route-structure.md` |
| Auth, session, gating | `05-auth.md` |
| Design system, tokens, RTL, accessibility | `06-design-system.md` |
| Domain model and schemas | `07-domain-model.md` |
| Modals, toasts, interactions | `08-modals-and-notifications.md` |
| Environment, deploy, secrets | `09-environment-deployment.md` |
| Testing, CI, quality gates | `10-testing-and-quality.md` |
| Core API endpoints and payload contract | `11-core-api-contract.md` |

---

## Non-Urgent Recommendations

1. Add document ownership when the team grows.
2. Add a short changelog for major spec changes.
3. Add a CI check that warns when `AGENTS.md` and `CLAUDE.md` drift from each other.
