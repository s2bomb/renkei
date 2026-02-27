# Output Contract

Input fields and preconditions are defined in handoff-contract.md.

## Artifact

Produce one execution-stage report per active item.

## Path Convention

- stage report: written to the item's working directory
- member artifacts: written to the package workspace by each member

## Required Report Fields

1. active workspace path
2. execution worktree path
3. test implementation evidence (files + commits)
4. implementation evidence (phase commits + verification outputs)
5. validation evidence (report path + coverage status)
6. member delegation evidence:
   - test-implementer child session id + outcome
   - implement-plan child session id + outcome
   - validate-plan child session id + outcome
7. requirement coverage status (`full` | `partial`)
8. unresolved issues (explicit `none` if empty)
9. escalations (explicit `none` if empty)
10. execution outcome (`complete` | `blocked` | `escalated`)
11. recommended next decision
12. project/item event ledger entries for stage outcome and escalation (if any)

## Quality Gates

No stage-complete publication when any gate fails:

- Required input fields are present
- test-first gate passed (unless explicit exception is declared)
- implementation evidence is complete and verifiable
- validation report exists and is consistent with evidence
- all three member delegations are evidenced (session ids + outcomes)
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
