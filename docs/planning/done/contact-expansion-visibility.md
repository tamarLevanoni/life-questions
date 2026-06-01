# Contact Expansion Visibility

## Context

Story-specific contact submissions may include story context. The story payload currently allows `expansion`, but expansion content is soft-gated for guests.

## Decision

The contact payload may include `story.expansion` only when the expansion exists and the submitting user is allowed to view it. Locked expansion content must not be sent from the client as hidden context.

## Required Changes

- Update `use-contact-form.ts` so it includes `expansion` only for an authenticated session and a non-null story expansion.
- Update the Core API contract example and rules.
- Update the domain contact rules.

## Verification

- Story-specific contact from a guest omits `story.expansion`.
- Story-specific contact from an authenticated user includes `story.expansion` only when the story has one.
