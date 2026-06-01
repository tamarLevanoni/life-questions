# Agent Docs Sync

## Context

`AGENTS.md` and `CLAUDE.md` intentionally duplicate most of the same operational guidance for coding agents. This is useful for tool compatibility, but it creates a maintenance risk if one file changes and the other does not.

## Decision

Keep both files for now, but mark each one as an operational copy. The long-lived source of truth remains `docs/specs/`.

## Required Change

- Add a top-level notice to `AGENTS.md`.
- Add the same top-level notice to `CLAUDE.md`.
- The notice must say that changes must be mirrored in the matching agent file or moved back into `docs/specs/`.

## Migration Note

During future refactors, prefer reducing detailed duplicated guidance in these files and linking to the relevant spec instead when the instruction does not need to be repeated inline for agent behavior.
