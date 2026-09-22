---
name: prepare-local-commit
description: Prepare a safe local feature commit in this repository when the user explicitly asks to commit completed work. Inspect the branch and diff, preserve unrelated changes, verify, stage only task files, and commit locally; never push or create a pull request.
---

# Prepare a Local Commit

Use this procedure only after explicit user intent to create a commit.

1. Inspect `git status`, the relevant diff, and recent commit-message style. Identify which files belong to the completed task and which are unrelated user work.
2. If the current branch is `main`, create or switch to a focused `codex/<feature-slug>` branch when the feature is unambiguous. If a safe branch name cannot be inferred, ask for it before committing.
3. Read the applicable specification and plan when they exist. Run the relevant targeted checks and `npm run check:local`. Run broader lint or e2e checks when the task needs them and their prerequisites are available.
4. Stage only task-owned paths. Never use `git add .`, and do not absorb unrelated staged or unstaged changes.
5. Inspect the staged diff. Abort the commit if it contains secrets, generated build output, unrelated changes, or work that contradicts the specification.
6. Create one concise local commit that reflects the actual change and follows the repository's existing message style. Do not introduce a new commit convention unless the user requests it.
7. Report the commit hash, message, verification evidence, and any remaining working-tree changes.

Do not push, create a pull request, merge, rebase, amend, or rewrite history unless the user separately and explicitly requests that operation.
