# Weekly story: intentionally non-shareable link (spec deviation)

## Status: implemented, spec update pending

## What changed

`VideoSection`'s CTA ("מעבר לתשובה") now links to `/story/featured/${weeklyStory.id}`
instead of `/story/${weeklyStory.id}`. `FeaturedStoryView` was extended to also
resolve `useAppDataStore.weeklyStory` (in addition to `featuredStories`) by ID,
falling back to a home redirect via `<EmptyState>` when not found.

Files touched:
- [app/_components/video-section.tsx](../../app/_components/video-section.tsx)
- [app/story/featured/[id]/_components/featured-story-view.tsx](../../app/story/featured/%5Bid%5D/_components/featured-story-view.tsx)

## Why

Requirement: the weekly story shown on the home page must render from the
client store (`useAppDataStore.weeklyStory`, already hydrated globally) and be
viewable with no login — reusing the existing `/story/featured/[id]`
store-lookup route rather than introducing a near-duplicate page.

## Known conflict with documented architecture

[docs/specs/03-stores-and-cache.md](../specs/03-stores-and-cache.md) (Weekly Story
section, currently line ~63) states:

> Unlike featured stories, the weekly story is a real, permanent backend
> entity — its CTA links directly to `/story/[id]`, not through a store-lookup
> route.

That statement is now **stale**: the weekly story is deliberately routed
through the store-lookup path, same as featured stories, which means it is
**no longer bookmarkable/shareable** — a store miss (e.g. fresh tab, no
hydration yet) redirects home instead of resolving the real story server-side.
This was a conscious tradeoff on this task, not an oversight.

## Follow-up TODO

- [ ] Decide if non-shareability is acceptable long-term for the weekly story
      (product call — the home page "story of the week" card is arguably worth
      sharing, unlike the fully-random featured picks).
- [ ] Update `docs/specs/03-stores-and-cache.md` Weekly Story section to match
      whatever is decided (either document the new store-lookup behavior, or
      revert the link back to `/story/[id]` if shareability is required).
- [ ] Mirror the same correction into `AGENTS.md` per the CLAUDE.md
      operational-copy rule if the spec changes.
