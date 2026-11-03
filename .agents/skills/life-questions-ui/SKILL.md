---
name: life-questions-ui
description: Change or review the Life Questions interface using its existing components and data boundaries. Use for page layout, visual styling, mobile, RTL, themes, forms and accessibility work in this repository.
---

# Life Questions UI

Start from the requested screen and inspect its page/view, shared primitives and relevant hooks. Preserve existing behavior unless the task explicitly changes it.

## Read for the task

- [UI principles](../../../docs/specs/06-design-system.md): stable accessibility/RTL/reuse principles versus changeable visual choices.
- [Routes and forms](../../../docs/specs/04-route-structure.md): PageShell, route-local composition and shared form controls.
- [Interactions](../../../docs/specs/08-modals-and-notifications.md): modal ownership, focus and submission feedback.
- [Quality](../../../docs/specs/10-testing-and-quality.md): meaningful browser checks and manual verification limits.
- For state/auth behavior, read specs 03/05 before changing a hook. For framework APIs, read the matching installed Next.js documentation.

## Work with the code

Inspect `app/globals.css`, `app/layout.tsx`, category color config and existing primitive props before adding tokens, fonts or variants. Change the shared primitive for a shared pattern; keep screen-only layout local. Do not copy token values into this skill.

The current glass effects, brand palette and layout are changeable. General frontend-design guidance is useful for a requested redesign, not a reason to replace the site's identity during a small fix. Do not introduce a state/cache library, change API contracts, rename stores or migrate Auth as a visual adjustment.

## Verify the outcome

Check desktop and narrow mobile layouts, light/dark, RTL, keyboard focus, associated labels/errors and applicable loading/empty/error/disabled states. Use Playwright's existing fictional backend/session setup when testing locally; never submit test data to production.

For a visual change, capture screenshots and inspect them. Functional tests should follow accessible roles/names rather than CSS classes. Do not update pixel baselines merely to hide a regression. Significant behavior changes/bugs get focused tests; static composition does not need tests mirroring its JSX.

Report the result, the checks actually run and any remaining manual verification, especially real Google OAuth and physical-device behavior.
