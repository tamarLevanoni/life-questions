# About page

New public route `/about` ("אודות") explaining the "שאלות מהחיים" book/project
by Rabbi Eitan Shnerb — book focus, target audience, features, and how to get
involved. Static content only: no fetch, no schema, no store, no auth gate.

Added:
- `app/about/page.tsx` — Server Component, composed of named section imports
  (same pattern as `app/page.tsx`), wrapped in `<PageShell maxWidth="4xl">`.
- `app/about/_components/about-hero-section.tsx`,
  `about-book-section.tsx`, `about-audience-section.tsx`,
  `about-features-section.tsx`, `about-contact-section.tsx` — all static,
  built from `SectionHeader` / `GlassCard` / `MotionFadeIn`.
- Reuses `<WhatsAppSection />` from `app/_components/whatsapp-section.tsx`
  unmodified for the WhatsApp CTA (no new WhatsApp component).

Changed:
- `app/contact/_components/contact-sidebar.tsx` — `CONTACT_INFO` is now
  exported so `about-contact-section.tsx` can reuse the single canonical
  source of contact details instead of duplicating them.
- `components/layout/app-header.tsx`, `components/layout/footer.tsx` — added
  an "אודות" nav link, placed first (right after the logo/home link).

Not changed: `proxy.ts` — `/about` is fully public, not added to the auth
matcher.
