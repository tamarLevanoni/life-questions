Technology Stack & Architecture
• Framework: Next.js 16 (App Router) using React Server Components for optimized performance.
• Runtime: Bun is mandatory for all operations to ensure 30x faster package management and native TypeScript support.
• Architecture: BFF (Backend-for-Frontend). The Next.js server acts as a middleware, attaching an API Secret for communication with the Node.js core server.
• Data Source: Currently using Mock Data (located in lib/ or local JSON) to facilitate rapid MVP development. Final integration will point to the Node.js API as the "Single Source of Truth".
Logic & Content Structure (MVP Phase)
• Core Model: Every content piece must follow the hierarchy: Story 
→
 Question 
→
 Short Answer (Initially Hidden) 
→
 Expansion (Hidden).
• Categorization: Content must be taggable by Seder HaShas (Masechet, Perek, Daf), Shulchan Aruch (Chelek, Siman, Se'if), and Concepts (Subject, Concept).
• Search Engine: Implement Debounced search with Virtualized lists for the UI to handle large result sets efficiently.
AI Workflow & Git Rules
• Plan Before Action: Always use Plan Mode (Shift + Tab in Claude Code) to research and describe changes before implementation.
• Mandatory Backups: For every code change or feature implementation, perform a Git backup.
• Detailed Commits: Commit messages MUST be detailed and written in Hebrew, explaining exactly what was changed and why.
UI & Design Guidelines
• Style: Glassmorphism with backdrop blur effects, clean and elegant aesthetics on a white background.
• Styling Engine: Tailwind CSS 4 with OKLch color support.
• Components: Utilize Shadcn/ui and Lucide Icons for consistent and accessible interface elements.
Authentication & Security
• Provider: NextAuth.js using Google OAuth only.
• Sessions: Use Cookie-based sessions (HttpOnly). Do not store tokens in localStorage.
• Protection: Implement protected routes for "User Profiles" and specific content "Expansions" based on permissions

Component Architecture Principles (must be followed for all new code)
• File names: ALL file and folder names in English, kebab-case (e.g. `story-article.tsx`, not Hebrew or PascalCase files). Hebrew is allowed only inside strings/JSX content.
• Page files are thin orchestrators: any `app/**/page.tsx` should stay under ~120 lines. If a page grows beyond that, extract semantic sections into sub-components before adding more.
• Co-location rule:
  - Components reusable across multiple pages → `components/<feature>/` (e.g. `components/story/`, `components/search/`) or `components/ui/` for design primitives, `components/common/` for layout/animation/state primitives.
  - Components specific to a single page → `app/<route>/_components/` (following the existing `app/contact/_components/` pattern).
• Single source of truth for design primitives:
  - Use the existing `<GlassCard>`, `<Button>`, `<Badge>`, `<SectionHeader>`, `<FormField>`, `<EmptyState>`, `<PageShell>`, `<MotionFadeIn>`, `<LoadingSkeleton>` instead of repeating raw Tailwind class strings. If a new repeated pattern appears 3+ times, extract a primitive before duplicating a fourth time.
  - Never inline `glass-card p-X rounded-2xl ...` raw classes when `<GlassCard>` exists. Same for badges, section headers, motion wrappers.
• Animations: wrap whileInView/fade-in motion with `<MotionFadeIn delay={...}>` — do not paste `motion.div initial={{...}} whileInView={{...}}` blocks repeatedly.
• Page shell: every top-level page renders inside `<PageShell>` (which provides `<AppHeader/>`, `dir="rtl"`, `min-h-screen`, top padding, max-width container). Do not hand-roll this wrapper in each page.
• Data layer:
  - All client-side API calls go through `lib/api-client.ts` (`apiCall<T>(url, init)`). Stores must not duplicate `fetch → res.json → success/error` logic.
  - Never silently swallow store errors (`} catch {}`). Set an error field on the store and surface a fallback in the UI.
  - Default new pages to RSC. Use `'use client'` only on the smallest leaf that actually needs interactivity/store/hook access.
  - Reference data (`useReferenceStore.loadAll`) loads once via `ReferencePreloader`. Do not re-trigger it from individual pages.
• Forms: use `react-hook-form` + `zod` (existing pattern in profile/contact). Wrap every input row in `<FormField label error>` — do not hand-roll Label + Input + error paragraph.
• Empty / loading / error states: always render via `<EmptyState>` and `<LoadingSkeleton>` primitives, not ad-hoc JSX.
• Plan-before-edit: for any feature touching more than ~2 files or introducing a new pattern, draft a short plan under `planning/<feature>.md` before writing code (in English). Reference `planning/component-architecture-refactor.md` as the canonical example.