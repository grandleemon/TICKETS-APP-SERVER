# Ticket Sales Backend — Codex Instructions

## Project overview

This repository is the NestJS backend for a ticket sales application. It is also a portfolio and learning project, so changes should be correct, focused, and easy to understand.

Current application areas:

- authentication and persisted sessions;
- users with `USER`, `ORGANIZER`, and `ADMIN` roles;
- events owned by users;
- ticket types with price and inventory counters;
- issued tickets.

Reservation and purchase workflows are planned but are not yet represented by a complete domain implementation. Inspect the repository before assuming that a planned concept already exists.

## Observed architecture

- Runtime: Node.js, TypeScript, NestJS 11.
- Persistence: TypeORM with PostgreSQL; `synchronize` is disabled.
- Configuration: `ConfigModule` and environment variables.
- Transport: controllers under `src/<area>`.
- Business logic: injectable services under `src/<area>`.
- Validation: DTOs with `class-validator`; a global `ValidationPipe` enables `whitelist`, `forbidNonWhitelisted`, and `transform`.
- Authentication: JWT access/refresh tokens, HTTP-only cookies, and persisted session records.
- Schema changes: TypeORM migrations under `src/database/migrations`.
- Tests: Jest; e2e configuration is under `test/` and requires a separate PostgreSQL test database.

The root API prefix is `/api/v1` because the application uses the global `api` prefix and URI versioning with version `1`.

## Working agreement

1. Inspect the relevant implementation, tests, migrations, and documentation before proposing a change.
2. Do not invent requirements. Ask a focused question only when an unresolved choice materially affects product behavior, API contracts, persistence, authorization, security, or an expensive architectural direction.
3. Do not ask for information that can be learned from the repository.
4. Check `git status` and the relevant diff before editing. Treat unfamiliar existing changes as user work, preserve them, and avoid broad formatting over a dirty tree.
5. Do not add a production dependency without explaining why it is needed.
6. Do not expose secrets or copy values from `.env` into documentation, tests, logs, or source control.

## Choose the workflow proportionally

- Small, reversible task: inspect, edit, and verify. A formal specification, plan, or subagent is normally unnecessary.
- Non-trivial feature or behavior change: research, clarify if needed, write or update a specification, write a plan, implement in small steps, verify, and request independent review.
- High-risk change involving authentication, authorization, money, migrations, inventory, concurrency, or external side effects: use the full workflow and an independent reviewer. Add focused integration or e2e coverage where practical.

Use subagents only when they provide useful context isolation, parallel research, or independent review. Prefer the project-scoped `researcher` agent for read-heavy repository investigation and the `reviewer` agent for an independent final pass. Do not create agent ceremony for trivial edits, and avoid parallel writers touching overlapping files.

## Specifications and plans

- Store durable feature requirements in `docs/specs/<feature-name>.md`.
- Store implementation plans in `docs/plans/<feature-name>.md`.
- Store reusable research findings in `docs/research/` only when they are likely to help future work.
- A specification describes what must be true, including business rules, authorization, persistence, API behavior, edge cases, and acceptance criteria. It should not prescribe detailed implementation steps.
- A plan describes how the approved specification fits this repository: files, ordered changes, database/API impact, tests, verification, and risks.
- Do not put temporary feature details into this file.

## Backend rules

- Keep controllers focused on transport: validated input, route data, authenticated principals, status codes, and response shaping.
- Put business rules and transaction orchestration in services. Keep persistence details in repositories or focused data-access helpers.
- Validate external input with DTOs at runtime. Do not mass-assign request bodies into entities.
- Enforce roles and resource ownership at every relevant server-side entry point.
- Treat authentication as session-backed JWT authentication. Verify token purpose and claims, require a valid persisted session where the flow calls for it, and never expose password or token hashes.
- Keep `synchronize: false`. Make schema changes through reversible TypeORM migrations and inspect both `up` and `down` behavior.
- Preserve ticket inventory invariants: `0 <= reservedNumber <= maxNumber`, and never reduce `maxNumber` below already reserved inventory.
- Make reservation or purchase inventory changes atomic in PostgreSQL. Avoid unlocked read-then-write flows that can oversell.
- Keep network and payment calls outside database lock windows. Use replay-safe idempotency for purchase commands and provider webhooks when those features are introduced.
- Treat PostgreSQL `numeric` monetary values as exact decimal strings or minor units; do not use JavaScript floating-point arithmetic for prices or totals.
- Store instants as `timestamptz` and serialize them with an explicit offset. Require an IANA time zone when local civil time matters.

## Local Git workflow

- Work on a focused feature branch rather than committing feature work directly to `main`. Use the `codex/<feature-slug>` prefix for branches created by Codex.
- Do not create a commit unless the user explicitly asks for one. Before committing, inspect the branch, status, complete diff, and staged diff.
- Stage only task-owned paths; never use `git add .` in a dirty working tree.
- Do not push, create a pull request, merge, rebase, amend, or rewrite history without a separate explicit request.
- `npm install` runs the `prepare` script and activates the project Husky hooks.
- Pre-commit runs lint-staged: it lints/formats staged TypeScript under `src` and `test`, and formats supported staged documentation/configuration files.
- Pre-push runs `npm run check:local` (type-check, build, and unit tests). Repository-wide lint and formatting run in GitHub Actions when a pull request has the `run-checks` label. E2E remains manual and requires a separate test database.
- Use the `prepare-local-commit` skill when the user asks Codex to create a local commit.

## Verification

Run the smallest relevant set first, then broaden for risky changes.

- Fast local gate: `npm run check:local`
- Read-only type-check: `npm run typecheck`
- Compile/build: `npm run build`
- Lint and auto-format TypeScript: `npm run lint` (this command includes `--fix`; inspect its diff)
- Check lint without modifying files: `npm run lint:check`
- Check formatting without modifying files: `npm run format:check`
- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`
- Database migrations: `npm run migration:show`, `npm run migration:run`, and `npm run migration:revert` against an explicitly selected non-production database when the task requires them.

E2E tests require `POSTGRES_TEST_DATABASE`, and it must differ from `POSTGRES_DATABASE`. Never run destructive database verification against an unconfirmed production database.

Report commands that passed, commands that failed, and anything not run. Distinguish failures introduced by the current change from confirmed pre-existing failures. Do not claim success based on confidence alone.

## Review expectations

Review the actual diff and relevant surrounding code against the approved specification and plan. Prioritize correctness, authorization, data integrity, transaction safety, API compatibility, and missing tests. Report actionable findings with severity and file references; do not manufacture findings or block on personal style preferences.
