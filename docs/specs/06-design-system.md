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

The site currently combines teal/blue/orange brand accents, light/dark themes, translucent surfaces, gradients and section-specific illustrations/decorations. The layout loads Heebo and Secular One for Hebrew typography; CSS and components determine where each is used. The route-local [`SearchHeader`](../../app/search/_components/search-header.tsx) loads Noto Serif Hebrew through `next/font/google` for its centered editorial heading; it inherits the page background and uses a lighter teal in dark mode for contrast. A requested redesign may replace these visual choices.

`GlassCard`, `SectionHeader`, `PageShell` and `MotionFadeIn` are existing reuse points, not a mandate that every future card must look like glass or every heading have one size. Change the primitive when its shared design changes; avoid fighting it with repeated overrides.

## Search presentation

The search route uses the Stitch references for search controls and result cards while retaining the site's header, footer, background and fonts. Setup and results are separate views. The selected-filter summary is displayed only in results. Setup has two RTL Radix tabs: book/topic and sources; inactive groups are hidden and selections are retained. Cards use opaque theme surfaces, subtle borders/shadows and existing UI primitives. The free-text query is the visual priority: a primary-tinted container, primary border/ring and solid primary submit button contrast with quiet neutral filter cards and a softly tinted active tab. Filter tabs, headings and rows have no decorative icons; add/remove/clear actions use text. Checkbox indicators remain functional controls. The results loading variant of `SkeletonCardList` mirrors search cards without a profile avatar and respects reduced motion.

Setup sizes cards to their content instead of stretching them to fill the viewport. Compact controls, 26–40px field heights, small vertical gaps and a 28px mobile/32px desktop heading with 12px top/bottom breathing room on mobile and 16px on desktop keep ordinary search controls visible without page scrolling at tested sizes, including 360×640 and 1280×600. Desktop page padding is 96px at the top (including fixed-header clearance) and 48px before the footer. Mobile uses 20px side gutters, a 14px free-text input and 11px filter labels. Books occupy full-width rows above topics on mobile; desktop keeps the two columns. Mobile list height grows with the available viewport (up to 400px combined), allowing about five book and topic rows on a regular phone while keeping the search action visible on shorter screens. Book names use at most two visual lines, with their complete text retained in the accessible label and title. Viewport-based maximum heights bound long selection lists and additional source rows; tags scroll horizontally. Very short viewports and text enlargement may require page scrolling to preserve reachable content. Scrollable checkbox rows establish a local positioning context for their hidden form inputs; even long reference lists must not extend the document past the footer. Results use normal page scrolling.

Search components own their final visual values; the route CSS module owns viewport height calculations and layout classes, without restyling descendants by their DOM position. Removing a result tag keeps keyboard focus on a surviving tag or returns it to the search controls when none remain. Removing a source row focuses the adjacent removal control, or the add-source button when the group becomes empty. Clearing a query or source selection returns focus to its input or trigger. Loading and result counts share one stable status region; skeletons are decorative.

Result counts come from the submitted API response. The current card contract has no thumbnail URL and search has no video-only or sort parameters; these reference-only features are omitted. Video badges still reflect `videoUrl`, and pagination remains “load more”.

## Acceptance for a UI change

Check desktop/mobile, both themes, RTL and keyboard use. Inspect applicable hover/focus/disabled/loading/error states. Use browser screenshots for visual review; do not make a changing page pass only by accepting an unexplained pixel snapshot. Functional tests should locate controls by accessible role/name, not Tailwind classes.

Read [Routes/forms](04-route-structure.md), [Interactions](08-modals-and-notifications.md) and [Quality](10-testing-and-quality.md). The local `life-questions-ui` skill routes design work to these sources without duplicating them.
