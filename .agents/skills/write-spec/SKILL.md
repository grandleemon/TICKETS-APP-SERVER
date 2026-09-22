---
name: write-spec
description: Create or update a durable feature specification under docs/specs for a non-trivial ticketing-backend change. Use after repository research and requirements clarification; do not use for one-line, purely mechanical, or easily reversible edits.
---

# Write a Feature Specification

Base the specification on observed repository behavior and explicit user decisions. Clearly distinguish current facts, approved behavior, and unresolved questions. Describe what must be true, not detailed implementation mechanics.

Use the smallest useful subset of this structure:

```markdown
# Feature: <name>

## Context

## Goals

## Non-goals

## Requirements

## Business Rules

## Authorization

## Data and Persistence

## API Behavior

## Edge Cases

## Acceptance Criteria

## Open Questions
```

Include authorization, persistence, API, concurrency, time, or money sections only when relevant. Acceptance criteria must be observable and testable. Record `None` for open questions only after confirming that no material decision remains.

Save the result as `docs/specs/<kebab-case-feature-name>.md` unless an existing related specification should be updated instead. Do not smuggle new product decisions into the document.
