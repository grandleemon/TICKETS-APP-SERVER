---
name: write-plan
description: Produce a repository-grounded implementation plan under docs/plans for an approved non-trivial feature specification. Use before coding when changes span behavior, persistence, APIs, authorization, or multiple files; skip for tiny mechanical edits.
---

# Write an Implementation Plan

Read the approved specification and inspect the current code paths named by it. Stop and request clarification if a material specification question is still open.

The plan must explain how the approved behavior fits this repository. Include:

```markdown
# Implementation Plan: <name>

## Existing Architecture Summary

## Files to Change

## New Files

## Database Changes

## API Changes

## Implementation Steps

## Test Plan

## Verification

## Risks
```

Omit empty sections that provide no value. For every file, state why it changes and the intended responsibility of the change. Prefer small ordered steps that can be verified independently. Include migration rollback, authorization, concurrency, and failure recovery when relevant. Avoid unrelated refactors and speculative future work.

Use only verification commands supported by the repository. Save the plan as `docs/plans/<kebab-case-feature-name>.md`.
