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

## Required Transfer Outcome

Execution owner returns only if blocked at intake/preflight:

1. `status`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

## Transfer Rule

Execution ownership is transferred when payload fields are complete and transfer is issued.

After transfer, execution-lead immediately runs execution stage unless blocked by a contract defect.

If blocked, ownership returns to `tech-lead` for correction or escalation.

## Escalation Rule

If two correction cycles fail to clear transfer blockers, escalate to decision owner with:
- blocked fields
- impact on appetite and delivery integrity
- recommended decision options
