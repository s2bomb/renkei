# Output Contract

## Artifact

Produce one execution-stage report per active item.

## Path Convention

- stage report: `shaped-items/active/item-###/working/execution-report.md`
- validation report path: as produced by `validate-plan`

## Required Report Fields

1. active workspace path
2. plan path
3. test specification path(s)
4. execution worktree path
5. handoff issuer role
6. test implementation evidence (files + commits)
7. implementation evidence (phase commits + verification outputs)
8. validation report path
9. requirement coverage status (`full` | `partial`)
10. unresolved issues (explicit `none` if empty)
11. escalations (explicit `none` if empty)
12. execution outcome (`complete` | `blocked` | `escalated`)
13. recommended next decision
14. project/item event ledger entries for intake, stage outcome, and escalation (if any)

## Quality Gates

No stage-complete publication when any gate fails:

- Intake contract fields are complete and stage started
- test-first gate passed (unless explicit exception is declared)
- implementation evidence is complete and verifiable
- validation report exists and is consistent with evidence
- unresolved critical issues are absent or explicitly escalated
- project and item event ledgers are updated for stage actions

## Completion Report

```
Execution stage complete.

Item: item-###
Outcome: complete | blocked | escalated
Execution report: [path]

Open issues (if any):
- [issue]
```
