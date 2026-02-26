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
4. test implementation evidence (files + commits)
5. implementation evidence (phase commits + verification outputs)
6. validation report path
7. requirement coverage status (`full` | `partial`)
8. unresolved issues (explicit `none` if empty)
9. escalations (explicit `none` if empty)
10. execution status (`complete` | `blocked` | `escalated`)
11. recommended next decision

## Quality Gates

No stage-complete publication when any gate fails:

- Intake acknowledged as sufficient
- test-first gate passed (unless explicit exception is declared)
- implementation evidence is complete and verifiable
- validation report exists and is consistent with evidence
- unresolved critical issues are absent or explicitly escalated

## Completion Report

```
Execution stage complete.

Item: item-###
Status: complete | blocked | escalated
Execution report: [path]

Open issues (if any):
- [issue]
```
