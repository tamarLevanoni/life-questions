# Design System Spec

## Goal
Define one design language for colors, fonts, shadows, gradients, glassmorphism, motion, themes, RTL, accessibility, and component styling.

---

## Design Language

- **Glassmorphism:** translucent cards with backdrop blur, light borders, and soft shadows.
- **Brand palette:** teal, blue, and orange, with teal as the primary color.
- **Soft minimalism:** most color comes from content, accents, and restrained gradients rather than noisy backgrounds.
- **Subtle ambient glows:** soft section-level background lighting for hero and CTA areas, without decorative objects that steal focus.
- **RTL-first:** Hebrew product UI, right alignment, direction-aware icons, and logical spacing.
- **Light default, dark first-class:** both themes are complete and treated as product surfaces.

---

## Source Of Truth: `app/globals.css`

`app/globals.css` is the single source for tokens, themes, and utility classes. Global CSS variables are not defined elsewhere.

File structure:

```text
1.  @import "tailwindcss"
2.  @theme inline { ... }          # map CSS vars into Tailwind tokens
3.  :root { ... }                  # light-mode values
4.  .dark { ... }                  # dark-mode values
5.  @layer base                    # body and global defaults
6.  Glass utilities                # glass, glass-card, glass-panel, glass-light
7.  Shadows                        # shadow-glass, shadow-soft
8.  Glows                          # glow-teal, glow-blue, glow-orange
9.  Gradients                      # gradient-brand, gradient-card, ...
10. Text/background utilities      # text-brand-*, bg-brand-*
11. Hover effects and animations   # hover-lift, animate-float, ...
12. Scrollbar, selection, focus-visible
13. Mobile utilities               # safe-area, tap-target, container-mobile
14. RTL utilities                  # rtl-flip, logical spacing helpers
15. Hebrew typography              # font-hebrew
```

---

## Tokens

### Brand Colors

| Token | Hex | Role |
|-------|-----|------|
| `--color-brand-teal` | `#14B8A6` | Primary, focus rings, links, arrows |
| `--color-brand-blue` | `#00C2FF` | Secondary accents |
| `--color-brand-orange` | `#FF9100` | Accent, highlights |
| `--color-brand-dark` | `#1C1C1E` | Dark-mode base |
| `--color-brand-gray-100` | `#F2F2F7` | Light section background |

### Semantic Colors

Semantic colors are exposed through `@theme inline` and consumed via Tailwind utilities:
- `bg-background` / `text-foreground`
- `bg-card` / `text-card-foreground`
- `text-muted-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-accent` / `text-accent-foreground`
- `bg-destructive`
- `border-border`
- `ring-ring`

Rule: use tokens, not raw hex values. If a new shade is required, add it to `globals.css` instead of hardcoding it in `className`.

### Radii

| Token | Value | Use |
|-------|-------|-----|
| `rounded-sm` | radius minus 4px | Inputs, badges |
| `rounded-md` | radius minus 2px | Menus |
| `rounded-lg` | about 10px | Buttons |
| `rounded-xl` / `rounded-2xl` | up to 24px | Cards |
| `--radius-card` | 16px | `<GlassCard>` |
| `--radius-button` | 8px | `<Button>` |
| `--radius-pill` | 9999px | Badges, chips |

### Shadows

- `shadow-glass` / `shadow-soft` are the default soft shadows.
- Components do not define custom `box-shadow` values directly. Use existing utilities or add a tokenized utility to `globals.css`.

---

## Themes: Light And Dark

Themes are managed by `next-themes` in `<ThemeProvider>` from `app/providers.tsx`. The `.dark` class is applied to `<html>`.

Rules:
- Every component must work in both light and dark themes.
- Theme-specific tweaks use Tailwind `dark:` modifiers.
- Do not hardcode hex colors in component `className` values.
- `bg-white/60` and `bg-black/40` are allowed for glass overlays when exact opacity is part of the visual treatment.

Check every new component in both themes. Theme switching is exposed through `<ModeToggle>`.

---

## Glassmorphism

Glass utilities live in `globals.css`:

| Utility | Use |
|---------|-----|
| `.glass` | Navbar and large panels |
| `.glass-card` | Small cards |
| `.glass-panel` | Standard panels |
| `.glass-light` | Light backgrounds |

Prefer the `<GlassCard variant="light" | "dark">` component over raw glass utility classes. The component owns theme behavior.

Rule: glass utilities do not use `!important`. If specificity breaks, fix the primitive or CSS layer order instead of forcing overrides.

---

## Gradients

Built-in gradients:
- `.gradient-brand`: teal -> blue -> orange.
- `.gradient-card`: teal -> purple -> blue.
- `.gradient-brand-text`: brand gradient clipped to text.
- `.gradient-teal-purple`, `.gradient-blue-cyan`, `.gradient-orange-teal`, `.gradient-purple-blue`: themed card accents.

Rule: do not create inline gradients with ad hoc `bg-linear-to-*` classes. Add a named `.gradient-<name>` utility when a new gradient is truly needed.

---

## Ambient Glows

`.glow-teal`, `.glow-blue`, and `.glow-orange` are radial gradients with blur, used sparingly in hero and CTA sections.

Rules:
- Use only in large sections, behind content.
- Do not place glows on small cards.
- Do not create standalone bokeh/orb decoration.
- Background lighting must never compete with readability.

---

## Typography

### Fonts
Fonts are loaded through `next/font` in [layout.tsx](../../app/layout.tsx):
- **Heebo** (`--font-hebrew`): primary Hebrew UI font.
- **Geist Sans** (`--font-geist-sans`): fallback for Latin text, numbers, and general UI.
- **Geist Mono** (`--font-geist-mono`): code.

Rule: Hebrew text uses `font-hebrew` explicitly. The default body font is not assumed to be ideal for Hebrew.

### Hierarchy
- `<h1>`: `text-3xl md:text-4xl font-bold font-hebrew`
- `<h2>` through `<SectionHeader>`: `text-2xl md:text-3xl` for `size="md"` or `text-4xl md:text-5xl` for `size="lg"`
- Body: `text-base font-hebrew leading-relaxed`
- Subtitle: `text-muted-foreground font-hebrew text-sm md:text-base`

Do not hand-roll font size or weight when a primitive already owns that style.

---

## RTL

The app inherits `dir="rtl"` from `<html>`.

Rules:
- Icons follow RTL meaning. For example, "back" in RTL usually points right; "continue" usually points left.
- Use logical spacing: `ms-auto`, `me-auto`, `ps-4`, `pe-4` instead of `ml/mr/pl/pr`.
- LTR snippets inside RTL text, such as English, numbers, or code, use `dir="ltr"` or `.ltr`.
- Do not use `flex-row-reverse` unless the intended visual order is explicitly opposite to document direction.

---

## Mobile And Responsive

- Tap targets are at least 44 x 44px. Use `.tap-target`.
- Use safe-area helpers for iOS bottom insets where needed.
- Tailwind breakpoints are mobile-first: `sm:640`, `md:768`, `lg:1024`, `xl:1280`.
- Page width is controlled by `<PageShell maxWidth="...">`, not Tailwind `.container`.
- Do not introduce horizontal overflow.

---

## Accessibility

- Keep global `:focus-visible`; do not remove outlines without an accessible replacement.
- Normal text meets WCAG AA 4.5:1 contrast; large text meets 3:1.
- Icon-only buttons have Hebrew `aria-label` values.
- Use `<button>`, not clickable `<div>`, for actions.
- Modals rely on Radix behavior: body scroll lock, `Esc`, focus trap, and focus return.

---

## Motion

### `<MotionFadeIn>`
This is the only allowed motion primitive for fade/scroll reveal patterns.

Triggers:
- `trigger="view"`: reveal when the element enters the viewport.
- `trigger="mount"`: reveal immediately on mount.

```tsx
<MotionFadeIn delay={0.1} y={20}>
  <Card />
</MotionFadeIn>
```

Rules:
- Do not paste raw `<motion.div initial={...} whileInView={...}>` blocks.
- If a new animation is needed, extend `<MotionFadeIn>` or add a new primitive.
- Stagger delays stay small, for example `delay={index * 0.1}`.
- Respect `prefers-reduced-motion`.

### Utility Animations
- `.animate-float`: rare use for small decorative icons.
- `.animate-pulse-glow`: gentle glow opacity change.
- `.hover-lift`: clickable cards only.

Add a new animation utility only when it is needed in three or more places.

---

## Designing A New Component

Decision order:

1. **Existing primitive.** Use `<SectionHeader>`, `<GlassCard>`, `<FormField>`, `<MotionFadeIn>`, and other primitives first.
2. **Global utility.** Use `shadow-soft`, `.gradient-brand`, `.glass-card`, etc.
3. **Existing Tailwind tokens.** Compose with semantic tokens such as `bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-soft`.
4. **New primitive.** Add only when the pattern repeats or removes meaningful complexity.
5. **Never:** raw hex colors, manual box shadows, inline gradients, or manual font-family declarations in component code.

Example:

```tsx
<GlassCard variant="light" className="p-6">
  <h3 className="text-2xl font-bold font-hebrew text-primary mb-4">...</h3>
  <p className="text-muted-foreground font-hebrew">...</p>
</GlassCard>
```

---

## Rules Proven By Past Failures

1. Do not define a local component with the same name as a shared primitive.
2. Glass styles live in the primitive or an ordered utility layer, without `!important`.
3. Tailwind 4 native utilities such as `line-clamp-2` are not duplicated in `globals.css`.

---

## New Component Checklist

- [ ] Uses existing primitives before creating new layout/styling patterns.
- [ ] Uses semantic tokens, not raw colors.
- [ ] Hebrew text uses `font-hebrew`.
- [ ] Works in light and dark themes.
- [ ] Keeps focus-visible behavior.
- [ ] Interactive elements meet the 44 x 44px tap-target minimum.
- [ ] Works on mobile without horizontal scroll.
- [ ] Uses `<MotionFadeIn>` for fade/reveal motion.

---

## Non-Urgent Recommendations

1. **Split `globals.css`.** Keep base/tokens in `globals.css` and move utilities to `globals-utilities.css`.
2. **Typed glass variants.** Prefer explicit `<GlassCard>` variants over free-form class names.
3. **Line-clamp policy.** Use native Tailwind 4 utilities only.
4. **`<Typography>` primitive.** Wrap headings and body variants to reduce repeated classes.
5. **Spacing tokens.** Add section and card spacing tokens when repeated spacing decisions grow.
6. **Component preview page.** Add `/dev/components` for primitives and variants in development.
7. **Automated contrast audit.** Run Lighthouse on primary screens in CI.
8. **Heebo optimization.** Load only weights actually used.
9. **Palette extension.** Add new semantic tokens instead of inline color hierarchies.
10. **Theme preference persistence.** Store theme choice consistently to avoid flicker.
