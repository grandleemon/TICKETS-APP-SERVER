---
name: verify-implementation
description: Verify completed changes in this ticketing backend with diff inspection, relevant build/lint/tests, and independent review when risk warrants it. Use before claiming a non-trivial implementation is complete or when the user asks for verification or review.
---

# Verify an Implementation

Read the applicable specification and plan, then inspect the actual diff and relevant surrounding code. Confirm that unrelated user changes remain untouched.

Run checks proportionate to the change:

1. targeted tests for changed behavior;
2. `npm run build` for TypeScript compilation;
3. a non-mutating lint check with `npx eslint "{src,apps,libs,test}/**/*.ts"`, or `npm run lint` when applying formatting is intended;
4. `npm test` when unit tests exist or were changed;
5. `npm run test:e2e` for API, guard, persistence, migration, or concurrency behavior when a safe test database is configured;
6. migration `run` and `revert` on an explicitly selected non-production database for schema changes.

For non-trivial or high-risk changes, delegate an independent read-only pass to the project `reviewer` agent. Give it the specification, plan, diff scope, and verification evidence; do not give it an intended verdict. Fix confirmed findings, then rerun affected checks.

Report:

- what was inspected;
- commands that passed;
- commands that failed, with concise causes;
- checks not run and why;
- independent review findings and their disposition;
- any pre-existing failures distinguished from regressions introduced by the change.

Never replace execution evidence with "should work."
