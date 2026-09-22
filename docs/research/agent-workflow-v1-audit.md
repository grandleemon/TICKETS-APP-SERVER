# Repository Audit: Agent Workflow v1

## Scope

This audit records the repository state used to design the first Codex-specific development workflow. It intentionally does not evaluate or rewrite the in-progress authentication/session work.

## Existing Agent Configuration

Before this setup, the repository had no root `AGENTS.md`, no repo-scoped `.agents/skills`, no `.codex/agents`, and no Claude-specific configuration. The handoff document `AI_AGENT_WORKFLOW_HANDOFF.md` was present as a user-provided root file that was not yet part of `HEAD`.

## Repository and Architecture

- The Git root is the backend directory itself.
- The project is a single NestJS 11 application using TypeScript, TypeORM, and PostgreSQL.
- Current modules cover auth, sessions, users, events, ticket types, and tickets.
- Several domain controllers and services are still scaffolds; auth and sessions contain the main implemented behavior.
- Entity timestamps use `timestamptz`; ticket prices use PostgreSQL `numeric` and are represented as strings.
- TypeORM synchronization is disabled in both runtime configuration and the migration data source.
- Database migrations live under `src/database/migrations`.
- Global request validation uses whitelist, rejection of non-whitelisted fields, and transformation.
- Authentication currently uses HTTP-only cookies, JWTs, and persisted session rows.

## Documentation

`README.md` was still the default NestJS starter README and did not describe the ticketing domain. There was no `docs/` directory before this workflow setup.

## Available Commands

Commands discovered from `package.json`:

- `npm run build`
- `npm run lint` (runs ESLint with `--fix`)
- `npm test`
- `npm run test:e2e`
- `npm run test:cov`
- `npm run migration:generate`
- `npm run migration:run`
- `npm run migration:show`
- `npm run migration:revert`

There is no dedicated `typecheck` script; `npm run build` is the current compile/type-check gate.

## Test Setup

- Jest unit-test discovery is rooted at `src` and matches `*.spec.ts`.
- No unit-test files currently exist.
- E2E tests live in `test/` and use `test/jest-e2e.json`.
- E2E setup requires `POSTGRES_TEST_DATABASE` and rejects using the development database as the test database.
- The current e2e suite covers test-database selection and concurrent registration uniqueness.

## Baseline Verification on 2026-09-22

- `npm run build`: passed.
- `npx tsc --noEmit --incremental false -p tsconfig.json`: passed as a read-only type-check.
- Non-mutating ESLint check: failed with 65 existing findings, mostly formatting in generated migrations and line-ending issues, plus unsafe access in the e2e database-name assertion and one floating-promise warning.
- `npm test`: failed because no unit tests were found.
- `npm run test:e2e`: ran against the configured test database but failed. Cleanup attempted to delete a user still referenced by a session, and the parallel-registration status assertion did not observe the expected `201` response.

These failures predate the workflow files and are recorded so future verification can distinguish baseline debt from regressions.

## Working Tree Constraint

At audit time, the repository already contained user changes in `package.json`, `package-lock.json`, auth/session source files, application configuration, and a new session migration. Workflow v1 must not overwrite, reformat, or otherwise absorb those unrelated changes.

## v1 Design Decision

Use native Codex mechanisms with the smallest useful structure:

- root `AGENTS.md` for durable repository context and proportional workflow rules;
- repo-scoped skills under `.agents/skills` for clarification, specifications, plans, and verification;
- project-scoped read-only custom agents under `.codex/agents` for research and independent review;
- `docs/specs`, `docs/plans`, and `docs/research` for durable task state;
- no custom implementer agent, MCP server, plugin, or global user configuration in v1.
