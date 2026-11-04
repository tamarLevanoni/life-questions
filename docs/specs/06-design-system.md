# UI principles and current appearance

## Goal

Keep the Hebrew interface accessible and consistent while allowing deliberate visual redesigns.

## Stable principles

- RTL-first: Hebrew labels, meaningful icon direction and logical spacing. The root has `lang="he" dir="rtl"`; use explicit LTR for email/code where appropriate.
- Keyboard support, visible focus, associated labels/errors, meaningful names for icon buttons and modal focus management.
- Readable contrast, touch-friendly controls, layouts that do not clip content or create horizontal page scroll.
- Use shared primitives/tokens where they own a repeated pattern. Fix shared behavior in the shared component; keep screen-specific layout local.
- Preserve loading, empty, error, disabled and authenticated/guest behavior during a visual change.
- Support light/dark themes; respect reduced-motion preferences.

## Sources in code

[`app/globals.css`](../../app/globals.css) owns theme tokens and shared visual utilities. [`app/layout.tsx`](../../app/layout.tsx) loads fonts. [`lib/config/category-colors.ts`](../../lib/config/category-colors.ts) owns category accents and fallback book icons. Component props/types own primitive interfaces. Read those sources instead of copying numeric values into documentation.

Prefer existing semantic tokens for shared colors. Introduce a shared token for a genuinely repeated new role; a single illustrative/brand-specific visual does not justify a global token or an architecture rewrite.

## Current appearance can change

The site currently combines teal/blue/orange brand accents, light/dark themes, translucent surfaces, gradients and section-specific illustrations/decorations. The layout loads Heebo and Secular One for Hebrew typography; CSS and components determine where each is used. A requested redesign may replace these visual choices.

`GlassCard`, `SectionHeader`, `PageShell` and `MotionFadeIn` are existing reuse points, not a mandate that every future card must look like glass or every heading have one size. Change the primitive when its shared design changes; avoid fighting it with repeated overrides.

## Acceptance for a UI change

Check desktop/mobile, both themes, RTL and keyboard use. Inspect applicable hover/focus/disabled/loading/error states. Use browser screenshots for visual review; do not make a changing page pass only by accepting an unexplained pixel snapshot. Functional tests should locate controls by accessible role/name, not Tailwind classes.

Read [Routes/forms](04-route-structure.md), [Interactions](08-modals-and-notifications.md) and [Quality](10-testing-and-quality.md). The local `life-questions-ui` skill routes design work to these sources without duplicating them.
