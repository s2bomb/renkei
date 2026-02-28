# Handoff Contract

## Contract

This contract defines the invocation interface for `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates first.

## Required Input Fields

1. active item workspace path
2. technical package directory path
3. execution worktree path (code-change target)
4. handoff issuer role (`tech-lead` unless explicit decision-owner override)

## Path Semantics

- Package internals are resolved from the package index/manifest inside the technical package directory.
- Execution worktree path is used for code and test implementation activity.
- Do not rebase package internal locators into execution worktree unless explicitly instructed.

## Return Contract

Execution-lead owns all work from invocation to return.

If input validation fails, return:

1. `outcome`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

Return execution evidence with verification results, or `blocked` with explicit blocker ownership.

For the return value on successful execution, see output-contract.md.

## Ownership

Execution-lead owns all work from invocation to return.

If input validation fails, the caller (`tech-lead`) retains ownership and decides whether to correct and reinvoke.

## Escalation Convention

If two correction cycles fail to clear input validation failures, escalate to decision owner with:

- blocked fields
- impact on appetite and delivery integrity
- recommended options
