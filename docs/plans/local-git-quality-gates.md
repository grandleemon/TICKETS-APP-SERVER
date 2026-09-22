# Implementation Plan: Local Git Quality Gates

## Existing Architecture Summary

The project uses npm scripts, ESLint, Prettier, Jest, and TypeScript. It has no Git hooks or local staged-file tooling. `npm run build` and a direct read-only TypeScript check pass. Full lint currently fails on pre-existing formatting/type-safety findings, `npm test` fails because no unit tests exist, and e2e tests have existing application-state failures.

## Files to Change

### `package.json`

Add local verification scripts and the Husky `prepare` lifecycle script. Add Husky and lint-staged as development dependencies without disturbing the existing auth/session dependency changes.

### `package-lock.json`

Record the exact dependency graph produced by npm for the two new development dependencies while preserving the current lockfile changes.

### `AGENTS.md`

Document the working local checks and the distinction between fast hooks and the currently red full-suite checks.

### `README.md`

Add a short local quality-gates section explaining when hooks run and how to run the same checks manually.

## New Files

### `lint-staged.config.mjs`

Map staged TypeScript files to ESLint/Prettier, workflow Markdown to Prettier, and supported configuration files to Prettier. Exclude the legacy root README from automatic whole-file formatting.

### `.husky/pre-commit`

Invoke lint-staged for staged-file checks.

### `.husky/pre-push`

Invoke the fast local verification gate.

### `.agents/skills/prepare-local-commit/SKILL.md`

Define safe branch, staging, verification, and local commit behavior. Explicitly exclude push and PR creation.

## Implementation Steps

1. Add the specification and this plan before changing tool configuration.
2. Install Husky and lint-staged as development dependencies.
3. Add read-only and fast verification scripts to `package.json`.
4. Add the staged-file configuration and both Git hooks.
5. Add the local commit-preparation skill and update persistent project instructions.
6. Document the local workflow in the README.
7. Validate configuration syntax and skill structure.
8. Run type-check, build, unit discovery, and the combined local gate.
9. Inspect the diff and obtain an independent read-only review.
10. Fix confirmed findings and repeat affected verification.

## Test Plan

- Confirm the Husky Git hooks path is installed.
- Import `lint-staged.config.mjs` and assert the intended glob keys and commands are present.
- Run the hook commands directly where doing so cannot alter the user's current staged files.
- Do not execute lint-staged against the current index because it contains pre-existing staged user work.
- Run `npm run typecheck`, `npm run build`, `npm run test:unit`, and `npm run check:local`.
- Run the bundled Codex validator for the new skill.
- Run formatting and whitespace checks for newly created workflow files.

## Verification

```powershell
npm run prepare
npm run typecheck
npm run build
npm run test:unit
npm run check:local
git config --get core.hooksPath
git diff --check
```

Repository-wide `npm run lint:check` and `npm run test:e2e` remain diagnostic commands until their documented baseline failures are addressed.

## Risks

- Running lint-staged during setup could rewrite currently staged user files; validate its configuration without executing it against the real index.
- A repository-wide lint hook would block all work on pre-existing findings; limit pre-commit to staged files.
- An e2e pre-push hook would currently block all pushes; defer it until the e2e baseline is green.
- Installing dependencies modifies already-dirty package files; inspect the resulting diff to ensure existing dependency changes remain intact.
