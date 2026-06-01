# Search Results Store Contract

## Context

The current code still uses `useStoriesStore`, which can be misread as a generic story collection store. That name is too broad for the refactor target because search relevance, filtering, sorting, and match interpretation must stay on the Core API side.

## Decision

The long-lived specs should describe the target store as `useSearchResultsStore`. Its responsibility is search result transport state only: server query parameters, request lifecycle, pagination, loading/error state, and the result list returned by the server.

## Required Documentation Changes

- Update the store naming in the durable specs.
- Keep any mention of the old `useStoriesStore` only as a transitional implementation name.
- Clarify that featured stories are not part of the search results store contract.
- Replace any "filter state and query building" wording with server-parameter wording.
- Add an explicit ban on client-side ranking, filtering, sorting, scoring, or match interpretation.

## Migration Note

When the store implementation is refactored, rename `useStoriesStore` to `useSearchResultsStore` or split it so featured stories do not share a broad "stories" store with search results.
