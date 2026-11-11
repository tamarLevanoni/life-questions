# Testing and quality

## Goal

Verify behavior with fast feedback and explain failures clearly to a first-time testing-tool user.

## Commands and evidence

[`bun run check`](../../package.json) runs lint, TypeScript, active-document local links and Bun tests. `test:unit`, `test:ui`, `test:e2e`, `test:report` and `test:release` are implemented. Read the [Hebrew testing guide](../testing.md) for setup, investigation and CI. The [archived quality foundation record](../planning/done/project-quality-foundation.md) preserves past test evidence; the [backlog](../planning/backlog.md) tracks remaining external verification.

[`check:docs`](../../scripts/check-docs.ts) checks local Markdown target paths in active documentation; it excludes historical plans. It does not check heading anchors, external URLs or whether prose matches code. Review those separately when changing a spec.

## Tools and responsibilities

- Bun Test: schemas, server/auth boundaries, store request lifecycle and the existing SSR hydration regressions.
- Playwright Test: real browser user flows against a local app and mock Core API, with fictional signed sessions. Test RSC/action flows at the server boundary, not only browser request mocks.
- axe: focused automated accessibility checks alongside manual keyboard/mobile review.
- TypeScript/ESLint: static correctness; they do not prove runtime or visual behavior.

Keep unit-test discovery separate from Playwright files. Use meaningful behavioral assertions and isolated state; no arbitrary coverage percentage or tests mirroring implementation. Add a regression for a significant bug. Do not test server ranking/relevance in frontend tests.

## Initial browser acceptance

The [browser suite](../../tests/e2e) covers home -> featured story; guest login prompts and protected routes; authenticated search/filter/URL initialization/pagination; obsolete requests; empty/error/loading states; story navigation/missing story; contact validation/success/failure; profile cancel/save/refresh; onboarding. [Accessibility checks](../../tests/e2e/accessibility.spec.ts) cover selected main-content and onboarding states, both themes, viewport overflow and keyboard/dialog paths. Header/footer and external embeds are outside the axe scan.

Use accessible roles/names, condition-based waits and stable fictional data. Screenshots are review artifacts while design evolves, not blanket pixel-snapshot merge gates. [`playwright.config.ts`](../../playwright.config.ts) runs Chromium desktop/mobile by default. `test:ui` uses an isolated development server; `test:e2e` uses a production build. Release mode adds only `@smoke` flows in Firefox/WebKit, not the entire suite. The [release runner](../../scripts/test-release.ts) rejects unsupported local macOS/WebKit combinations with an explanation. Real Google OAuth, a physical device and the real upstream backend require manual staging verification.

## Automation policy

`check` runs the fast suite. The [Husky hook](../../scripts/check-staged.ts) runs only lint and local documentation-link checks against staged content. It neither changes files nor runs the whole suite after every edit. The [Quality workflow](../../.github/workflows/quality.yml) runs checks, dependency audit and isolated browser builds/tests on pushes to main, PRs and manual dispatch. Its first remote run must still be verified after an authorized push. CI fails on flaky tests, allows one retry and retains browser diagnostics for seven days. Branches and PRs are optional for this solo project; branch protection is not a completion requirement.

The [pre-commit entrypoint](../../.husky/pre-commit) respects Bun on PATH and otherwise searches `${BUN_INSTALL:-$HOME/.bun}/bin`, `/opt/homebrew/bin` and `/usr/local/bin` for GUI Git clients with a minimal environment. If Bun is unavailable, it fails with setup guidance rather than skipping checks. Custom locations can be configured through Husky's user initialization file; see the [testing guide](../testing.md).

A feature, structural change or cross-screen redesign needs a plan; a small multi-file fix does not automatically need one. Commit messages are detailed Hebrew. Never claim a CI run or manual check occurred without evidence.
