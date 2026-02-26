# Handoff Contract

## Contract

This contract governs transfer from `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates first.

## Required Intake Payload

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list
8. execution worktree path (code-change target)
9. handoff issuer role (`tech-lead` unless explicit decision-owner override)

## Path Semantics

- Planning/package artifacts are read from the paths supplied in the handoff payload.
- Execution worktree path is used for code and test implementation activity.
- Do not rebase planning artifact paths into execution worktree unless explicitly instructed.

## Required Transfer Outcome

Execution owner starts immediately when intake contract fields are complete.

Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.

If intake contract is incomplete, return:

1. `status`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

## Transfer Rule

Execution ownership transfers when handoff payload fields are complete and invocation occurs.

If intake is blocked, ownership returns to `tech-lead`.

## Escalation Rule

If two correction cycles fail to clear intake blockers, escalate to decision owner with:

- blocked fields
- impact on appetite and delivery integrity
- recommended options
