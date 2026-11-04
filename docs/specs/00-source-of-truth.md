# Documentation authority

## Goal

Keep one maintained source for each project decision and distinguish implemented behavior from future work.

## Authority and reading order

- `docs/specs/` owns project architecture, domain, UX and quality decisions. Its descriptions match the implementation; known unsafe behavior is tracked for correction, never endorsed as a best practice.
- `AGENTS.md` is a short operational entrypoint and task-to-spec map, not a second architecture manual.
- Framework API details come from the version-matched documentation in `node_modules/next/dist/docs/`. Consult the relevant guide before Next.js changes. Generic skills do not override project decisions or supported framework APIs.
- `README.md` covers setup, orientation and the solo development workflow. The [testing guide](../testing.md) covers checks, reports, Husky and CI.
- `docs/planning/` contains proposals and active work. `done/` is historical, not agent instruction. Open work is indexed in [Planning](../planning/README.md) and [Backlog](../planning/backlog.md).

## Maintaining decisions

Update the relevant spec with a behavior/architecture change, then update operational pointers only when necessary. Keep API shapes in schemas and visual values in CSS/config instead of copying them into multiple manuals. Mark unverified upstream assumptions explicitly. Do not claim a workflow, endpoint or test exists until it is implemented and checked.

A feature, structural change or design change spanning screens needs a plan before implementation. A small UI fix does not need a plan solely because it touches two files. Use one plan with progress for a related change rather than generating many tiny plans.

Branches and PRs are optional according to change size; small changes may go directly to main. Keep the archive available without maintaining a classification table for every historical plan.

## Ownership

The [spec index](README.md) maps each decision to its owning document. Link to that owner instead of duplicating its rules. Link implementation claims to the relevant source so they can be checked after code changes.

Do not silently resolve product questions through documentation cleanup. Record them in the backlog. Do not migrate Auth, rename stores or introduce an additional caching/state system as incidental cleanup.
