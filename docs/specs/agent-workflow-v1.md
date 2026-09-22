# Feature: Codex Agent Workflow v1

## Context

The repository needs a reliable Codex development workflow that reduces invented requirements, architectural drift, unverified changes, and excessive context growth while remaining lightweight for small tasks.

## Goals

- Give Codex accurate persistent project context and backend constraints.
- Require repository research before clarification or implementation.
- Persist requirements and plans for non-trivial work.
- Provide reusable clarification, specification, planning, and verification procedures.
- Provide read-only researcher and reviewer roles using native Codex configuration.
- Scale the workflow to task size instead of applying every stage mechanically.
- Preserve unrelated user work and report verification evidence honestly.

## Non-goals

- Building an AI feature in the application.
- Adding third-party orchestration frameworks, MCP servers, or plugins.
- Creating a custom agent for every development phase.
- Requiring formal specifications or independent review for trivial edits.
- Fixing existing application, lint, or test failures as part of workflow setup.
- Configuring Claude or global user-level Codex settings.

## Requirements

- Codex must load repository-wide guidance from a root `AGENTS.md`.
- Repository-specific reusable skills must live under `.agents/skills`.
- Researcher and reviewer profiles must live under `.codex/agents` and default to read-only operation.
- Requirements clarification must inspect the repository before asking the user.
- Material unresolved decisions must be asked rather than invented.
- Non-trivial specifications and plans must be stored under `docs/specs` and `docs/plans`.
- Verification must inspect the diff, run relevant available commands, distinguish baseline failures, and avoid unsupported success claims.
- Independent review must be used for non-trivial or high-risk changes, not automatically for every small task.
- Workflow configuration must avoid modifying the existing in-progress auth/session changes.

## Acceptance Criteria

- A future Codex session can discover the root instructions, four workflow skills, and two custom agents using documented native locations.
- The skill files pass the bundled Codex skill validator.
- The custom-agent TOML files parse successfully.
- The root instructions contain observed architecture, development constraints, supported verification commands, and proportional workflow rules.
- A small repository task completes a dry run through research, a written specification and plan, implementation, verification, and independent review.
- Existing baseline failures are documented and not misreported as workflow regressions.

## Open Questions

None for v1. The workflow should evolve only after real use reveals a repeated gap.
