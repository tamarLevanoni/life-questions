# Routes and forms

## Goal

Keep content routes readable, with shared primitives and explicit interactive boundaries.

## Route structure

Content `page.tsx` files are Server Components, compose `PageShell` and define route-specific metadata where needed. Fetch server data through `lib/server/*`. Use Suspense around data-dependent content when streaming is useful. Do not enforce an imaginary generic `StoreHydrator`: use the existing app-data/story hydrators where relevant.

Interactive screens use a route-local view, child sections and hooks in `_components/`. Hooks own state/handlers and read stores; form hooks use react-hook-form + schemas from `lib/schemas/`. Static informational pages can compose server sections without a store or client view.

Auth signin/callback/error pages are existing Client Components for OAuth flow and feedback. Do not put auth redirects in content pages; route policy is in [Auth](05-auth.md).

Keep pages, route-local components and hooks at most 200 lines when adding/changing them. Extract by responsibility, not by arbitrary tiny fragments. After a change, reassess whether affected files still justify their separation: inline trivial wrappers that no longer own distinct behavior or meaningful reuse, while preserving useful boundaries and readable file sizes. Shared primitives must not be shadowed by local components of the same name.

## Primitives

- `PageShell`: header/main, width and page spacing. `className` applies to the width container normally and to `main` in full-width mode. Search uses natural main height so a short setup does not leave a viewport-sized gap before the footer.
- `GlassCard`, `SectionHeader`, `FormField`: existing presentation building blocks; visual treatment may evolve.
- `MotionFadeIn`: shared fade/reveal behavior; extend it when needed rather than copying motion blocks.
- `EmptyState`, `SkeletonLines`, `SkeletonCardList`: recovery and loading feedback.

## Forms and navigation

Wrap fields in [`FormField`](../../components/ui/form-field.tsx); it associates a label/error with one direct `Input`, `input`, `textarea` or `select` child. For grouped or nested custom controls, wire labels, descriptions and invalid state explicitly. Keep schema validation both in forms and at server boundaries; [Domain](07-domain-model.md) owns the shared constraints. Preserve entered values on request failure; prevent duplicate submissions while pending.

Clearing the optional institution field in profile editing sends `null`; omitting a PATCH field leaves its previous value intact. Registration omits an empty institution instead, matching the Core API's create contract.

Use `Link` for ordinary internal navigation. Use router methods when an interaction requires them. [`useSearch`](../../app/search/_components/use-search.ts) initializes `q` and a single `bookId` from the URL on mount. It keeps `draftFilters` and `submittedFilters` locally and does not serialize edits back to the URL. Initial automatic search waits for registered auth status and starts once per mount. Pagination uses the last submitted filters. Search setup and results are separate local views on `/search`; returning to setup preserves the draft and selected filter tab. Only one of the book/topic and source tabs is displayed at a time. Editing setup does not issue a request until submission. Removing an applied result tag immediately searches again, updates that same selection in the draft and retains unrelated draft edits. Removing a book also clears topics outside the remaining selected books. The results view also has a desktop free-text form, initialized with the current query; unsubmitted text does not affect pagination. Clearing all filters resets the draft, submitted filters and selected tab, returns to setup and does not issue a request. Setup has no return-to-results shortcut; submitting a search is the only way to enter results.

Story contact relies on a full story already in `useStoriesStore`. If a `storyId` is present but absent from the store, [`ContactPageContent`](../../app/contact/_components/contact-page-content.tsx) replaces the URL with `/contact`. A direct link or reload therefore falls back to general contact rather than fetching the story. The server independently requires valid story context and a Google session for `story_question` submissions.

Home examples and the weekly answer link to `/story/[id]`, which is public and fetches by id on the server. The former `/story/featured/[id]` route is removed without redirects. [StoryNavigation](../../app/story/[id]/_components/story-navigation.tsx) uses server-provided `neighbors`, independently of search results. Registered users get ordinary links; guests get identically labelled buttons that open the existing login modal, without a lock icon or explanatory text. While auth status is `idle`, those buttons are disabled; `registration-required` opens existing onboarding. Login/onboarding leaves the current URL and story in place; navigation requires another click. A missing neighbor omits that direction. This is an interaction rule; direct story URLs remain public.

Locked expansion clicks use the same login/onboarding modals and preserve the current story, rather than navigating to a separate sign-in page. While auth is pending, clicking the expansion does not start login. Once registered, another click opens the expansion.

Page-specific components remain local; patterns used by multiple routes belong in shared components. File names are English kebab-case. Visual and interactive acceptance criteria are in [UI](06-design-system.md) and [Quality](10-testing-and-quality.md).
