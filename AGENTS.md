# Working on Life Questions

## Read only what the task needs

[Project specs](docs/specs/README.md) are the maintained project decisions. Before Next.js code changes, read the relevant **installed-version** guide in `node_modules/next/dist/docs/`. Skills supplement these sources; they do not authorize unrelated libraries, state/caching layers, redesigns or Auth migrations.

| Task | Read |
|---|---|
| Server/API/schema | specs 01, 02, 07, 11 |
| State, hydration, caching | spec 03 |
| Route, form, auth | specs 04, 05 |
| UI, mobile, accessibility | specs 06, 08; local life-questions-ui skill |
| Tests, dependencies, CI | specs 09, 10; docs/testing.md |

## Commands

Use **Bun only**, never npm/yarn. The scripts in package.json are authoritative. Use `bun run check` for lint, types, docs and unit tests; `bun run test:e2e` for isolated production-build Chromium desktop/mobile flows; `bun run test:release` adds core Firefox/WebKit flows. `bun run test:ui` opens the visual runner and `bun run test:report` opens the latest report. Do not claim an unrun check passed.

## Working rules

- Read affected code first and preserve product behavior unless the task changes it.
- Server Core API access uses `serverClient`; browser search uses apiCall/BFF; mutations use Server Actions. Keep secrets server-side and authenticate public protected entrypoints.
- Cache Components is the caching model. Never share user/session/search/mutation data through a persistent cache. Do not add a parallel manual cache.
- Existing stores are useAppDataStore, useStoriesStore, useUserStore and useContactStore. Do not rename/split them as incidental cleanup. App-data store initialization is provider-scoped.
- Content pages are Server Components using PageShell. Use existing primitives, do not shadow them. English kebab-case files; Hebrew UI copy. Pages, route-local components and hooks stay within 200 lines when changed.
- Schemas live in lib/schemas/, types derive from them, and Zod imports use `zod`.
- NextAuth **v4**, Google only; no v5 APIs. Test sessions must not create an application auth bypass.
- UI principles stay stable; current colors/effects/layout may change intentionally. Test behavior, mobile, RTL, themes and keyboard use.
- Plan features, structural changes and cross-screen redesigns before editing. Small multi-file fixes do not need a plan merely because of file count.
- This is a solo project. Branches and PRs are optional according to change size; small changes may use main. If creating an agent branch, use codex/. Follow the workflow in README.md and use the relevant checks.
- Update the owning spec when a decision changes. Proposals/backlog/history are not binding implementation instructions.
- Keep user changes, worktrees, local settings and secrets intact. No automatic deployment or commit. If committing is requested, write a detailed Hebrew message explaining what and why.

[Active quality work](docs/planning/project-quality-foundation.md) records task status, verification and remaining limitations.
