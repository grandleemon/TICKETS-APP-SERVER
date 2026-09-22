# AI Agent Development Workflow — Handoff Specification

## Purpose

This document is a handoff specification for configuring an **agentic development workflow** inside this repository.

The immediate goal is **not** to build an AI agent as a product feature. The goal is to configure the coding environment so future development follows a reliable workflow:

```text
User request
  ↓
Clarify requirements if needed
  ↓
Research existing codebase
  ↓
Create/update specification
  ↓
Create implementation plan
  ↓
Implement
  ↓
Self-verify
  ↓
Independent review
  ↓
Fix issues if necessary
  ↓
Final verification
```

The main coding agent should act primarily as an **orchestrator**, delegating focused work to specialized subagents when that provides a real benefit.

The workflow should reduce hallucinated requirements, unnecessary rewrites, architectural drift, context pollution, unverified implementations, and silent product decisions made by the model.

The workflow should favor explicit requirements, repository-aware research, written specs, small implementation steps, automated verification, independent review, and asking the user when an important product or technical decision is ambiguous.

---

# Project Context

This repository is a personal full-stack ticketing application used both as a portfolio project and as a learning project.

## Backend

Current / intended stack:

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- ConfigModule
- JWT authentication
- roles such as `USER`, `ORGANIZER`, `ADMIN`

Main domain entities currently planned / implemented include:

- `User`
- `Event`
- `TicketType`
- `Ticket`
- `Reservation` and/or `Purchase`

Expected relationships include roughly:

```text
User 1 ---- N Event
Event 1 --- N TicketType
TicketType 1 --- N Ticket
User 1 ---- N Ticket
```

Reservation logic is expected to include a TTL / expiration mechanism to avoid ticket overselling.

Important backend concerns:

- transaction safety;
- inventory consistency;
- preventing overselling;
- authorization and role checks;
- DTO validation;
- clean separation between controller and business logic;
- persistence correctness.

## Frontend

The developer is primarily a frontend developer with strong experience in React, Next.js, TypeScript, Zustand, Redux Toolkit, TanStack Query, React Hook Form, Mantine UI, Tailwind and SCSS.

The exact frontend stack in this repository should be **researched from the repository instead of assumed**.

---

# Main Goal for the Coding Agent

Configure this repository so future development can be driven by a workflow similar to:

```text
MAIN ORCHESTRATOR
      │
      ├── Requirements / Brainstorming
      ├── Researcher
      ├── Planner
      ├── Implementer
      └── Reviewer
```

The main coding agent should not immediately start editing files whenever the user asks for a feature. It should first determine which stages are actually necessary.

Example request:

```text
Add reservation expiration.
```

Desired behavior:

```text
1. Inspect repository and current reservation logic.
2. Identify missing product decisions.
3. Ask the user only for decisions that cannot safely be inferred.
4. Write/update a feature specification.
5. Produce an implementation plan.
6. Implement in small steps.
7. Run relevant tests / typecheck / lint.
8. Run an independent review against the specification.
9. Fix confirmed issues.
10. Re-run verification.
```

---

# Core Principle: Do Not Invent Requirements

If a missing piece of information materially affects product behavior, architecture, persistence, security, authorization, or API contracts, ask the user instead of silently choosing.

Bad example:

```text
User: Add event cancellation.

Agent silently decides:
- tickets are automatically refunded;
- events cannot be restored;
- cancelled events disappear from search.
```

Good example:

```text
User: Add event cancellation.

Agent researches current code and asks:
"What should happen to already purchased tickets when an organizer cancels an event?"

After the answer:
"Should a cancelled event remain visible in the organizer dashboard and be restorable?"
```

Questions should normally be focused, one at a time, and only about decisions that matter.

Before asking the user anything, inspect the repository first. Do not ask questions whose answers can be obtained from existing code, tests, documentation, configuration, or established project conventions.

---

# Suggested Repository Structure

Inspect the repository first and adapt paths if necessary.

A possible structure is:

```text
/
├── CLAUDE.md
├── AGENTS.md                    # optional, if useful for Codex / other agents
│
├── docs/
│   ├── specs/
│   ├── plans/
│   └── research/
│
└── .claude/
    ├── agents/
    │   ├── researcher.md
    │   ├── implementer.md       # optional
    │   └── reviewer.md
    │
    └── skills/
        ├── clarify-requirements/
        ├── write-spec/
        ├── write-plan/
        └── verify-implementation/
```

Do **not** mechanically create every file above if the current coding environment uses different supported conventions.

First inspect:

- existing agent instructions;
- existing `CLAUDE.md`;
- existing `AGENTS.md`;
- `.claude/`;
- `.codex/`;
- repository documentation;
- package scripts;
- test setup.

Prefer the conventions supported by the actual environment.

---

# Global Project Instructions

Create or improve the project-level instruction file. Its job is to contain information that should be available for almost every task.

It should contain:

## Project overview

- what the application does;
- major applications / packages;
- frontend/backend boundaries;
- important domain concepts.

## Architecture

Document the architecture that is actually found in the repository. Do not guess.

Possible example, only if true:

```text
Backend:
- NestJS
- TypeORM
- PostgreSQL

Business logic:
- services

Transport:
- controllers

Validation:
- DTO + class-validator
```

## Project rules

Possible rules, if consistent with the existing codebase:

```text
- Do not use `any` unless unavoidable and justified.
- Do not place business logic in controllers.
- Reuse existing patterns before introducing abstractions.
- Do not add dependencies without explaining why.
- Preserve public API compatibility unless the specification explicitly changes it.
- Prefer small focused changes.
- Avoid unrelated refactors during feature work.
```

## Verification commands

Discover these from `package.json` and repository tooling. Do not invent commands.

Examples:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

Document which commands should run for backend, frontend, shared-code and database changes.

---

# Requirements / Brainstorming Skill

Create a reusable skill inspired by mature brainstorming / requirements-analysis workflows.

Its purpose:

```text
vague request
  ↓
inspect relevant project context
  ↓
identify ambiguity
  ↓
ask focused question(s)
  ↓
understand constraints
  ↓
propose solution direction
  ↓
produce an approved specification
```

## Required behavior

Before asking the user anything:

1. Inspect existing implementation.
2. Inspect related entities, services, controllers, tests, schemas, APIs and documentation.
3. Determine whether the repository already answers the question.

Ask the user only when an unresolved decision materially affects implementation.

## Question style

Prefer:

```text
What should happen to existing reservations when an event is cancelled?
```

Avoid:

```text
Please answer these 14 questions before I can continue...
```

Normally ask **one important question at a time**.

## When clarification is not needed

Do not block on clarification when:

- there is a clear existing project convention;
- behavior is directly implied by current code;
- the decision is trivial and reversible;
- the user already provided the answer earlier in the task.

## Output

Once requirements are sufficiently clear, create or update:

```text
docs/specs/<feature-name>.md
```

or the repository's equivalent specification location.

---

# Specification Format

Feature specifications should describe **what must be true**, not detailed implementation steps.

Suggested format:

```md
# Feature: Reservation Expiration

## Context
Why this feature exists.

## Goals
- ...

## Non-goals
- ...

## Requirements
- ...

## Business Rules
- ...

## Authorization
- ...

## Data / Persistence Requirements
- ...

## API Behavior
- ...

## Edge Cases
- ...

## Acceptance Criteria
- ...

## Open Questions
- ...
```

Example acceptance criteria:

```text
- A reservation expires after the configured TTL.
- Expired reservations no longer reduce available inventory.
- Two concurrent users cannot reserve inventory beyond available quantity.
- Expiration state survives application restart.
- Relevant automated tests cover expiration and concurrency behavior.
```

The spec should be understandable without reading the implementation plan.

---

# Researcher Subagent

Create a read-only research-focused subagent.

The researcher should normally **not edit code**.

Its purpose is to inspect the repository without polluting the main agent's context with every file it reads.

Suggested instructions:

```text
You are the repository research agent.

Your task is to understand how the requested area currently works.

Do not modify files.

Inspect only the code relevant to the research question.

Return a concise structured report containing:

1. Relevant files
2. Existing architecture
3. Current data flow
4. Existing conventions and reusable patterns
5. Tests covering this area
6. Constraints / risks
7. Potential integration points
8. Unanswered questions that cannot be resolved from the repository

Do not propose large rewrites unless the current architecture makes the requested change impossible.
Distinguish observed facts from recommendations.
```

Example request:

```text
Research how ticket availability and reservations currently work.
Focus on entities, services, transactions, inventory calculations, authorization and tests.
Do not modify files.
```

The main agent should use the research report instead of reproducing all discovered repository context.

---

# Planning Stage

After the specification is sufficiently clear, produce an implementation plan.

Suggested location:

```text
docs/plans/<feature-name>.md
```

The plan should describe **how to implement the approved specification in this repository**.

Suggested format:

```md
# Implementation Plan: Reservation Expiration

## Existing Architecture Summary
...

## Files to Change
### `src/...`
Reason:
- ...
Changes:
- ...

## New Files
...

## Database Changes
...

## API Changes
...

## Implementation Steps
1. ...
2. ...
3. ...

## Test Plan
- unit:
- integration:
- e2e:

## Verification
```bash
...
```

## Risks
- ...
```

Plans should prefer small independently verifiable steps and avoid unrelated refactors.

---

# Implementer

Implementation may be handled by the main agent or a dedicated implementer subagent.

If a dedicated implementer is created, it should receive:

- the approved specification;
- the implementation plan;
- relevant researcher findings;
- global project instructions.

It should **not** receive unnecessary unrelated repository context.

Suggested behavior:

```text
Implement only the assigned task.

Before editing:
- read the relevant spec;
- read the relevant plan section;
- inspect the existing files involved.

During implementation:
- follow existing architecture;
- avoid unrelated refactors;
- add or update tests;
- preserve type safety;
- keep changes focused.

Before reporting completion:
- inspect the diff;
- run relevant verification commands;
- report what changed and what verification passed.
```

---

# Testing Philosophy

Do not create a separate testing agent for every small task by default.

The implementer is responsible for first-line verification:

```text
implement
  ↓
run test / lint / typecheck
  ↓
inspect failures
  ↓
fix
  ↓
repeat
```

A specialized testing / QA subagent can be used when:

- the feature is large;
- concurrency is involved;
- security-sensitive behavior changed;
- regression risk is high;
- test coverage is unclear;
- the user explicitly asks for deeper testing.

Do not claim success without actually running available verification tools unless tooling cannot be executed. If something cannot be run, say exactly what was not verified.

---

# Reviewer Subagent

Create an independent reviewer.

The reviewer should normally **not edit code initially**.

Its job is to compare the completed implementation against:

1. the approved feature specification;
2. the implementation plan;
3. project architecture and conventions;
4. type safety;
5. test coverage;
6. security / authorization concerns;
7. persistence / transaction correctness where relevant.

Suggested instructions:

```text
You are an independent code reviewer.

Do not modify files.

Review the current changes against:
- the approved specification;
- the implementation plan;
- existing project architecture;
- tests and verification requirements.

Inspect the actual diff and relevant surrounding code.

Report only actionable findings.

For every finding include:
- severity;
- file / area;
- problem;
- why it matters;
- suggested correction.

Severity:
- BLOCKER
- HIGH
- MEDIUM
- LOW

Do not invent issues just to produce a review.
If the implementation is correct, say so.

Separate:
- specification violations;
- correctness bugs;
- security / data integrity concerns;
- maintainability issues;
- missing tests.
```

The reviewer should not reject implementation based purely on personal style preferences.

---

# Orchestrator Behavior

The main coding agent should act as an orchestrator and decide whether each stage is necessary.

Not every task requires every stage.

## Small task

Example:

```text
Rename a button label.
```

Possible workflow:

```text
inspect file → edit → verify
```

No research subagent or formal specification required.

## Medium feature

Example:

```text
Add organizer event cancellation.
```

Possible workflow:

```text
research → clarification → spec → plan → implementation → tests → review
```

## Large / risky feature

Example:

```text
Add reservation TTL with concurrency protection.
```

Possible workflow:

```text
research
→ clarification
→ spec
→ architecture check
→ detailed plan
→ implementation in multiple tasks
→ unit/integration tests
→ concurrency verification
→ independent review
→ fixes
→ final verification
```

Avoid ceremonial agent calls. Use subagents when they provide context isolation, independent verification, parallelizable research, or specialized reasoning.

---

# Context Management Rules

A major goal is to keep the main context clean.

Prefer:

```text
large repository research
  ↓
researcher
  ↓
short structured report
  ↓
main agent
```

rather than:

```text
main agent reads 70 files
  ↓
context fills with irrelevant implementation details
```

Persist important state to files:

```text
docs/specs/
docs/plans/
docs/research/
```

Do not rely on the model remembering every decision across long sessions.

Important product decisions should be written into the relevant specification.

Important architectural discoveries should be written into global instructions or architecture documentation only when they are likely to be reused.

---

# Verification Loop

Preferred loop:

```text
PLAN
 ↓
IMPLEMENT
 ↓
DIFF
 ↓
LINT
 ↓
TYPECHECK
 ↓
TEST
 ↓
REVIEW
 ↓
FIX
 ↓
VERIFY AGAIN
```

The environment, not the model's confidence, should determine correctness.

Use feedback from compiler, TypeScript, ESLint, tests, database errors, runtime errors and framework tooling.

Do not treat "this should work" as verification.

---

# Keep Instructions, Skills, Specs and Plans Separate

## Global instruction file

Examples:

```text
CLAUDE.md
AGENTS.md
```

Contains:

> What should the agent know almost all the time?

Examples:

- architecture;
- commands;
- conventions;
- repository structure;
- general coding rules.

## Skill

Contains:

> How should the agent perform a recurring type of task?

Examples:

- clarify requirements;
- investigate bugs;
- write migration;
- perform code review;
- create implementation plan.

## Specification

Contains:

> What should this particular feature do?

Example:

```text
docs/specs/reservation-expiration.md
```

## Implementation plan

Contains:

> How should this approved feature be implemented in this repository?

Example:

```text
docs/plans/reservation-expiration.md
```

Do not put temporary feature details into global instructions.

---

# Suggested Initial Skills

Do not install or create dozens of skills immediately.

Start small:

```text
clarify-requirements
write-spec
write-plan
verify-implementation
```

Possible later additions:

```text
debug-systematically
database-change
nestjs-feature
frontend-feature
security-review
api-review
```

Only create a new skill when a procedure repeats often enough to justify reusable instructions.

---

# Inspiration: Superpowers Workflow

The desired workflow is conceptually similar to ideas popularized by agentic coding setups such as `obra/superpowers`, especially:

- brainstorming before implementation;
- writing explicit plans;
- subagent-driven development;
- verification;
- independent code review.

Do not blindly copy a framework. Use its ideas where they fit this repository.

A particularly useful behavior to preserve:

> When requirements are ambiguous, inspect the project first, then ask the user focused questions instead of silently inventing requirements.

---

# First Task for Codex

Before implementing more application features, configure **version 1 of the agentic development environment**.

## Step 1 — Repository Audit

Inspect:

- repository structure;
- existing documentation;
- package scripts;
- test setup;
- lint / typecheck setup;
- `.claude`;
- `.codex`;
- `CLAUDE.md`;
- `AGENTS.md`;
- existing agent / skill files.

Report what already exists.

Do not overwrite useful instructions blindly.

## Step 2 — Propose the Agentic Setup

Based on the actual repository and supported Codex / Claude conventions, propose the smallest useful structure for:

- global project context;
- requirements clarification;
- research;
- specification;
- planning;
- implementation;
- verification;
- independent review.

Prefer native supported mechanisms over custom machinery.

## Step 3 — Ask for Missing Decisions

If configuration decisions require user preference, ask.

Examples:

- whether specs should live under `docs/specs`;
- whether strict TDD is desired;
- whether reviewer should run after every task or only non-trivial tasks.

Do not ask questions that can be answered from repository conventions.

## Step 4 — Create v1

After requirements are sufficiently clear, create the agreed files.

At minimum, the final setup should provide:

```text
global project instructions
requirements clarification behavior
researcher role
planning workflow
reviewer role
verification rules
```

## Step 5 — Test the Workflow

Use one small real task from the repository as a dry run.

The dry run should demonstrate:

```text
request
→ repository research
→ clarification if needed
→ plan
→ implementation
→ verification
→ review
```

Do not choose a major unfinished architecture feature for the first test.

---

# Desired End State

A future prompt should be able to look as simple as:

```text
Add organizer event cancellation.
```

And the environment should make the coding agent naturally behave approximately like:

```text
1. I inspected the current Event / Ticket / Reservation implementation.

2. One product decision is still unclear:
   What should happen to already purchased tickets when an event is cancelled?

3. After clarification, I created:
   docs/specs/event-cancellation.md

4. I created an implementation plan:
   docs/plans/event-cancellation.md

5. I implemented the feature following existing project conventions.

6. Verification:
   - typecheck: passed
   - lint: passed
   - tests: passed

7. Independent review found one issue:
   cancellation authorization did not verify event ownership.

8. I fixed the issue and re-ran verification.
```

That is the desired workflow.

---

# Important Constraints

Do not overengineer version 1.

Avoid:

- five agents for trivial tasks;
- agent teams without a clear benefit;
- massive instruction files;
- blindly copying generic skill packs;
- adding frameworks that are not needed;
- requiring formal specs for one-line changes;
- asking the user questions that repository research can answer.

Optimize for:

```text
clarity
→ correctness
→ repeatability
→ verification
→ low friction
```

The workflow should make development more reliable, not slower because of ceremony.

---

# Final Instruction to Codex

Start by auditing this repository.

Do **not** immediately generate all proposed files from this document.

Treat this document as the target behavior, not as proof that the proposed file structure exactly fits the current repository.

First inspect the actual repository and the capabilities of the current coding-agent environment.

Then:

1. summarize the current state;
2. propose the minimal v1 setup;
3. identify any decisions that genuinely require user input;
4. implement the workflow;
5. run a small dry test;
6. explain how the user should invoke and evolve the workflow going forward.

The central principle is:

> Research first, ask when necessary, make requirements explicit, implement in small verified steps, and independently review meaningful changes.
