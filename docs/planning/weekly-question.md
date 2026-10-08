# Weekly question (שאלה שבועית)

New public route `/weekly-question` — a Google Form embedded as an iframe
where visitors answer a weekly halachic question. Correct answers enter a
raffle (run externally via the Form responses, no app-side logic). Static
content only: no fetch, no schema, no store, no auth gate.

Named `/weekly-question` (not `/story/weekly`) to avoid clashing with the
unrelated existing "weekly story" concept (`useAppDataStore.weeklyStory`,
`/story/featured/[id]`) — same word, different feature.

Added:
- `lib/config/weekly-question.ts` — `WEEKLY_QUESTION_FORM_URL` (Google Form
  embed URL), single source for the form link.
- `app/weekly-question/page.tsx` — Server Component, composed of named
  section imports (same pattern as `app/about/page.tsx`), wrapped in
  `<PageShell maxWidth="2xl">`.
- `app/weekly-question/_components/weekly-question-hero-section.tsx` —
  title + explanation of the raffle, built from `SectionHeader`.
- `app/weekly-question/_components/weekly-question-form-embed.tsx` — the
  iframe, wrapped in `<GlassCard>`.
- `app/_components/weekly-question-section.tsx` — home page CTA card
  linking to `/weekly-question` (same pattern as `HomeCTASection`).

Changed:
- `app/page.tsx` — renders `<WeeklyQuestionSection />` before
  `<WhatsAppSection />`.

Not changed: `proxy.ts` — `/weekly-question` is fully public, not added to
the auth matcher. No nav link added to `app-header.tsx` — only a home page
link was requested.
