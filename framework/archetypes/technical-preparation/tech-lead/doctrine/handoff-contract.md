# Handoff Contract

## Contract

This contract defines invocation from `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member-level specialist artifacts do not cross this boundary directly. They are aggregated by `tech-lead` first.

## Required Input Fields

1. item workspace path
2. package directory path
3. execution worktree path (code-change target)
4. handoff issuer role (`tech-lead` unless explicit decision-owner override)

## Path Semantics

- Package internals are resolved from package index/manifest inside the package directory.
- Execution worktree path is for code/test implementation activity.
- Do not rebase package internal locators into execution worktree unless explicitly instructed.

## Required Return

Execution owner returns one of:

1. `outcome`: `complete`
2. evidence demonstrating execution work occurred (e.g., files changed, verification commands executed, outcomes observed)

or, if blocked:

1. `outcome`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

## Invocation Rule

Execution ownership is transferred when input fields are complete and invocation is issued.

Validation-only results are not complete. A complete return includes evidence of execution work beyond input validation.

If blocked, `tech-lead` routes correction to the owning role, re-invokes execution when corrected, or escalates.

## Escalation Convention

If two re-invocations fail to clear blockers, escalate to decision owner with:
- blocked fields
- impact on appetite and delivery integrity
- recommended decision options
