# Testing And Quality Spec

## Goal
Define the minimum project quality layer: what must pass before merge, what tests are required per change type, and how regressions are kept low.

---

## Required Quality Layers

| Layer | Requirement |
|-------|-------------|
| Lint | Required: `bun lint` |
| Type check | Required: `bunx tsc --noEmit` |
| Schema validation | Required at runtime for every API boundary |
| Unit tests | Required for schemas and server functions with logic |
| Component tests | Required for components/hooks with meaningful state |
| E2E tests | Required for critical flows |
| CI | Required for every PR |
| Visual regression | Recommended for primary screens once UI stabilizes |

Every change is judged by risk. A text-only change does not require E2E. Auth, search, and story-flow changes require broader verification.

---

## Testing Principles

1. **Testing pyramid:** many unit/schema tests, fewer component tests, a small number of E2E tests.
2. **Tests are documentation.** Test names describe behavior clearly in English.
3. **Avoid mocks in the middle of the server stack.** Prefer real checks against a Next dev server for integration behavior.
4. **Fast tests are mandatory.** Tests that do not run quickly will not be used consistently in CI.

---

## Layer 1: Type And Lint

Rules:
- No `any` without an ESLint disable and explanation.
- Avoid `as unknown as X`; it usually means the type should be refined.
- Exported public functions declare explicit return types.
- `bunx tsc --noEmit` is clean before merge.

---

## Layer 2: Schema Tests

Zod schemas in [lib/schemas.ts](../../lib/schemas.ts) and [lib/types.ts](../../lib/types.ts) are the boundary between the core API and the app. Unit tests for schemas are fast and catch silent contract regressions.

```ts
// lib/__tests__/schemas.test.ts
import { describe, test, expect } from 'bun:test';
import { onboardingSchema } from '../schemas';

describe('onboardingSchema', () => {
  test('accepts valid input', () => {
    expect(onboardingSchema.safeParse(validInput).success).toBe(true);
  });

  test('rejects marketingConsent=false', () => {
    expect(onboardingSchema.safeParse({ ...validInput, marketingConsent: false }).success).toBe(false);
  });
});
```

Rules:
- Every main schema in `lib/schemas.ts` has tests.
- Minimum tests: valid input passes, missing/invalid field fails.
- Schema changes update tests in the same PR.
- Use **`bun:test`** for schema tests.

---

## Layer 3: Server Function Tests

For `lib/server/*` functions with logic beyond wrapping `backendFetch`:
- Mock `backendFetch` at module level.
- Verify status-code translation.
- Verify `SchemaError` when upstream data has the wrong shape.
- Verify `getFeaturedEntryStories()` resolves the featured selection through `getStory(id)`, preserves the configured order, caps the result at three stories, and returns full story payloads.

```ts
import { mock } from 'bun:test';
mock.module('@/lib/backend-fetch', () => ({
  backendFetch: async () => ({ data: null, ok: false, status: 404 }),
}));
```

---

## Layer 4: Component Tests

Use Vitest + Testing Library for components or hooks with internal logic.

Use component tests for:
- `use-profile-form.ts`: validation, dirty tracking, submit success/failure.
- `use-search.ts`: URL/search parameter state, debouncing, request cancellation, and loading/error state.
- `<ExpandableAnswerPanel>`: locked/unlocked behavior.

`use-search.ts` must not contain client-side ranking, filtering, sorting, scoring, or match interpretation. Tests should verify server parameter construction and request lifecycle behavior, not search-result relevance.

Do not spend component-test effort on:
- Display-only components.
- Pages/views that mostly compose child components; E2E is usually better.

---

## Layer 5: E2E

Use Playwright for critical user flows:

1. Guest opens a story, sees the short answer, sees locked expansion, and requests login.
2. Google login, onboarding, submit, then profile view.
3. Home page featured example click opens the full story without a client-side search request.
4. Search, filter by masechet, open a story.
5. Contact form submission with and without story context. Guest story contact omits locked `story.expansion`; authenticated/unlocked story contact may include it when it exists.
6. Profile edit, save, refresh, and persistence check.

Rules:
- Run against staging or a mock backend, never production.
- Each auth test creates its own user and cleans up after itself.
- Capture screenshots on failure.

---

## CI

Minimal `.github/workflows/ci.yml`:

```yaml
name: CI
on: pull_request
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun lint
      - run: bunx tsc --noEmit
      - run: bun test
      - run: bun build
```

Rules:
- Every PR passes CI before merge.
- `main` uses branch protection with required checks.

---

## Additional Quality Gates

### Pre-Commit Hooks
Use **husky + lint-staged** to run quick checks on changed files.

### PR Checks
- PR title follows Conventional Commits (`feat:`, `fix:`, `refactor:`).
- PR description explains what changed and why.
- A `docs/planning/*.md` file exists when a change touches two or more files or introduces a new pattern.

### Code Review
- At least one reviewer.
- Schema changes require review from someone with core API context.
- Core API contract changes require schema and contract-example updates in the same PR.
- `proxy.ts` or auth changes require two reviewers.

---

## Performance Budgets

Targets are monitored, not always merge-blocking:

| Metric | Target |
|--------|--------|
| LCP, mobile | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Bundle size, `/` | < 200KB gzipped JS |
| Time to Interactive | < 3s |

Tools: Lighthouse CI or WebPageTest.

---

## Manual QA Checklist Before Major Releases

- [ ] Login -> onboarding -> profile works.
- [ ] Search returns results with no filters.
- [ ] Search works with filters: masechet, Shulchan Aruch, topic, book.
- [ ] Story page opens and previous/next navigation works.
- [ ] Expansion is locked for guests and open for signed-in users.
- [ ] Contact form submits with and without story context.
- [ ] Profile edits persist after refresh.
- [ ] Light and dark themes work in primary browsers.
- [ ] Mobile viewport has no horizontal scroll and tap targets work.
- [ ] RTL layout works for arrows, breadcrumbs, and dropdowns.

---

## Non-Urgent Recommendations

1. **husky + lint-staged** pre-commit checks.
2. **Lighthouse CI** for budget tracking in PRs.
3. **Visual regression** with Chromatic or Percy when the team grows.
4. **Mutation testing** only if domain logic becomes significantly more complex.
5. **Conventional Commits + auto-changelog** if release notes need semver-style automation.
