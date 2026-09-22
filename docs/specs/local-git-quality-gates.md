# Feature: Local Git Quality Gates

## Context

The repository needs repeatable local checks before commits and pushes, without adding GitHub Actions, pull-request automation, deployment, or preview environments. Existing application work is currently uncommitted on `main`, and the repository has known full-lint and e2e baseline failures.

## Goals

- Provide named, reusable local verification scripts.
- Run formatting and lint fixes only for files staged for a commit.
- Run reliable non-mutating checks before a push.
- Install hooks automatically after `npm install`.
- Give Codex a safe reusable procedure for preparing a local feature commit.
- Preserve unrelated work in a dirty working tree.

## Non-goals

- GitHub Actions or any other hosted CI configuration.
- Push automation, pull-request creation, PR templates, or branch protection.
- Production, preview, or other deployment automation.
- Enforcing Conventional Commits or another new commit-message convention.
- Fixing the existing repository-wide lint or e2e baseline in this task.
- Committing the current working tree as part of setup.

## Requirements

- Add explicit scripts for read-only type-checking, read-only linting, formatting checks, unit tests, and a fast local verification gate.
- The unit-test command must succeed when no unit tests exist, while still failing when discovered tests fail.
- Configure Husky through the npm `prepare` lifecycle.
- The pre-commit hook must use lint-staged and operate only on staged TypeScript and supported documentation/configuration files.
- TypeScript staged files under `src` and `test` must be linted with fixes and formatted.
- Staged workflow Markdown under `AGENTS.md`, `docs`, and `.agents`, plus staged JSON, YAML, and YML files, must be formatted without attempting to process unsupported formats.
- The pre-push hook must run the fast local verification gate: type-check, build, and unit tests.
- Repository-wide lint and e2e commands must remain available for manual verification but must not block pre-push until their existing failures are resolved.
- No hook may silently stage unrelated unstaged files.
- Add a repo-scoped Codex skill for preparing a local commit only after explicit user intent.

## Local Commit Behavior

- Inspect the branch, status, and diff before staging.
- Do not commit feature work directly on `main`; create or switch to a focused `codex/<feature-slug>` branch when the task context identifies the feature.
- Stage only files belonging to the completed task; never use `git add .`.
- Preserve unrelated staged and unstaged user changes.
- Run the relevant verification and allow hooks to enforce their gates.
- Create a concise commit message consistent with the existing repository style.
- Report the commit and remaining changes.
- Never push or create a pull request as part of the local-commit procedure.

## Acceptance Criteria

- A clean install activates the Husky hooks through `npm run prepare`.
- `npm run typecheck`, `npm run build`, and the unit-test script pass on the current codebase.
- `npm run check:local` executes the pre-push gate successfully.
- The lint-staged configuration loads and targets only the intended file groups.
- Hook files invoke the expected npm commands.
- The new commit-preparation skill passes the Codex skill validator.
- No `.github` files, remote branches, commits, pushes, or pull requests are created.

## Open Questions

None. Repository-wide lint and e2e enforcement can be added to pre-push after their baseline failures are fixed.
