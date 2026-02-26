# Output Contract

## Artifact

Produce one technical-preparation package per active item.

## Path Convention

- Item package: `shaped-items/active/item-###/working/technical-package.md`
- Optional matrix artifact: `shaped-items/active/item-###/working/traceability-matrix.md`

## Required Package Fields

1. active workspace path
2. shaped artifact path
3. enriched spec path
4. research artifact paths
5. API design artifact paths
6. test-spec artifact paths
7. plan artifact path
8. unresolved decisions (explicit `none` if empty)
9. accepted risks (explicit `none` if empty)
10. must-have and nice-to-have separation for execution planning
11. execution worktree path (when execution tree differs from planning tree)
12. transfer record status (`tech-lead -> execution-lead`: `running-with-evidence` | `blocked`)
13. project/item event ledger entries for intake, handoff, and escalation (if any)

## Quality Gates

No handoff when any gate fails:

- Required fields complete and readable
- Cross-artifact contradictions resolved or explicitly tagged
- Scope boundaries align with shaped no-gos
- Major claims are evidence-cited
- Unresolved uncertainty is explicit
- Must-have and nice-to-have separation is explicit
- Project and item event ledgers are updated for stage actions

## Completion Report

```
Technical preparation complete.

Item: item-###
Package: [path]
Status: ready-for-execution | blocked

Blockers (if any):
- [blocker]
```
