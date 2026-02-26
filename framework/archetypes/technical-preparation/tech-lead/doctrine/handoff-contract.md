# Handoff Contract

## Contract

This contract governs transfer from `tech-lead` (technical preparation owner) to `execution-lead` (execution owner).

Member-level specialist artifacts do not cross this boundary directly. They are aggregated by `tech-lead` first.

## Required Handoff Payload

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list
8. execution worktree path (code-change target)

## Path Semantics

- Planning/package artifacts are consumed at the paths provided in handoff payload.
- Execution worktree path is for code/test implementation activity.
- Do not rebase planning artifact paths into execution worktree unless explicitly instructed.

## Required Return

Execution owner returns one of:

1. `outcome`: `complete`
2. evidence demonstrating execution work occurred (e.g., files changed, verification commands executed, outcomes observed)

or, if blocked:

1. `outcome`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

## Invocation Rule

Execution ownership is transferred when payload fields are complete and transfer is issued.

Validation-only results are not complete. A complete return includes evidence of execution work beyond input validation.

If blocked, tech-lead processes the blockers: correct and re-invoke, or escalate.

## Escalation Convention

If two re-invocations fail to clear blockers, escalate to decision owner with:
- blocked fields
- impact on appetite and delivery integrity
- recommended decision options
