# Implementation Plan: Codex Agent Workflow v1

## Existing Architecture Summary

The repository is a single NestJS backend with no existing agent instructions or repo-scoped Codex customization. Build, lint, Jest, e2e, and TypeORM migration commands already exist. The working tree contains unrelated in-progress auth/session changes that must remain untouched.

## Files to Add

### `AGENTS.md`

Record durable project context, backend rules, proportional workflow selection, documentation locations, verification commands, and review expectations.

### `.codex/agents/researcher.toml`

Define a read-only repository research role that returns concise evidence rather than editing code.

### `.codex/agents/reviewer.toml`

Define an independent read-only reviewer focused on specification compliance, correctness, security, persistence, and tests.

### `.agents/skills/*/SKILL.md`

Add four narrowly scoped skills:

- `clarify-requirements`;
- `write-spec`;
- `write-plan`;
- `verify-implementation`.

### `docs/research/agent-workflow-v1-audit.md`

Persist the repository audit and baseline verification results.

### `docs/specs/agent-workflow-v1.md`

Record the approved behavior of workflow v1.

### `docs/plans/agent-workflow-v1.md`

Record this implementation plan.

### `docs/specs/readme-project-overview.md`

Define the intentionally small README correction used to exercise the complete workflow.

### `docs/plans/readme-project-overview.md`

Record the bounded implementation and verification steps for the README dry run.

## File to Change

### `README.md`

Replace only the generic Description section with an accurate project overview as the workflow dry-run implementation.

## Implementation Steps

1. Audit repository structure, architecture, documentation, scripts, tests, existing agent files, and Git state.
2. Confirm native Codex locations for project instructions, repo skills, and project-scoped custom agents against official OpenAI documentation.
3. Record baseline build, lint, unit-test, and e2e behavior without modifying application files.
4. Add the root instructions, four skills, and two read-only agent profiles.
5. Validate skill frontmatter and custom-agent TOML syntax.
6. Perform a small README correction as a dry run, with a dedicated specification and plan.
7. Run relevant verification and obtain an independent read-only review.
8. Fix confirmed workflow or dry-run issues and repeat affected checks.

## Verification

- Parse both `.codex/agents/*.toml` files.
- Run the bundled `quick_validate.py` against each repo skill.
- Run `git diff --check`.
- Run `npm run build` to confirm application compilation remains intact.
- Inspect `git diff` and confirm no unrelated existing file was modified, except the intentional README dry run.
- Ask the independent reviewer to compare the result with this specification and plan.

## Risks

- Overly broad skill descriptions could trigger on unrelated requests; keep them discriminating.
- Excessive root instructions could consume context; keep project guidance concise and move procedures into skills.
- Automatic lint fixing could absorb unrelated formatting changes; use a non-mutating lint invocation during this setup.
- Current test and lint failures could be mistaken for regressions; preserve the baseline evidence in the audit.
