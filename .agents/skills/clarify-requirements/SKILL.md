---
name: clarify-requirements
description: Research and clarify ambiguous feature or behavior requests in this ticketing backend before implementation. Use when unresolved choices could affect product behavior, API contracts, persistence, authorization, security, or architecture; skip for trivial reversible edits already answered by repository conventions.
---

# Clarify Requirements

Inspect before asking. Read the relevant implementation, DTOs, entities, migrations, tests, documentation, and established patterns. For broad or noisy research, delegate a bounded read-only task to the project `researcher` agent and consume its concise report.

Classify each uncertainty as one of:

- answered by the repository;
- safely inferable from an established convention;
- trivial and reversible;
- material and requiring a user decision.

Continue without blocking for the first three categories. For a material unresolved choice, ask one focused question at a time and explain briefly what behavior it controls. Do not present a long questionnaire.

Once the behavior is sufficiently clear, summarize the confirmed goals, non-goals, constraints, and remaining open questions. For a non-trivial feature, persist them as a specification under `docs/specs/`; do not begin implementation while a material open question remains.
