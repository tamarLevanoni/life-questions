# Featured Entry Stories

## Context

The home page shows three featured/example stories. They are not just decorative cards: many users are expected to click one immediately after landing on the home page.

## Decision

Treat featured examples as entry stories. The home page should load the three selected examples as full story payloads through the same single-story server path used by `/story/:id`, so the story cache is already warm when the user clicks.

## Rules

- Featured examples are not search results.
- Do not store featured examples in `useSearchResultsStore`.
- Do not turn `useStoryDetailStore` into a general story cache or `Map`.
- `useStoryDetailStore` may expose a narrow `prime(story)` or `hydrate(story)` handoff for the single story selected before navigation.
- The story route remains authoritative and still loads through RSC `getStory(id)`.

## Implementation Target

1. Fetch the ordered featured selection from the Core API.
2. Resolve each selected id through `getStory(id)`.
3. Render the home cards from the full story data.
4. On card click, optionally prime `useStoryDetailStore` with the selected story before `router.push('/story/:id')`.
5. Rely on Next's server cache for the actual duplicate Core API avoidance.
