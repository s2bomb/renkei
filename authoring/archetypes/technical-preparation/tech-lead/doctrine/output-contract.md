# Output Contract

## Stage Return

Return one technical-preparation stage result per active item.

## Required Success Payload (`outcome: complete`)

1. item workspace path
2. package directory path
3. package index or manifest locator
4. delegation integrity entries for required artifact classes:
   - `artifact_class`
   - `artifact_locator`
   - `owner_role`
   - `delegate_outcome`
5. unresolved decisions (explicit `none` if empty)
6. accepted risks (explicit `none` if empty)
7. must-have and nice-to-have separation
8. execution worktree path
9. transfer record (`tech-lead -> execution-lead`: `issued`) with transfer evidence:
   - execution-lead child session id
   - delegation timestamp
   - delegation outcome
10. stage event log: technical-preparation, transfer, escalation (if escalated)

## Required Blocked Payload (`outcome: blocked`)

1. item workspace path
2. blockers with explicit ownership
3. blocked fields or artifact classes
4. recommended next action
5. escalation target (if escalated)
6. transfer record (`tech-lead -> execution-lead`: `blocked`) when transfer attempt failed
7. stage event log: technical-preparation, escalation

## Quality Gates

No handoff when any gate fails:

- Required fields complete and readable
- Cross-artifact contradictions resolved or explicitly tagged
- Scope boundaries align with shaped no-gos
- Major claims are evidence-cited
- Unresolved uncertainty is explicit
- Must-have and nice-to-have separation is explicit
- Required artifact classes have delegated ownership evidence
- Transfer record includes execution-lead delegation evidence (session id + timestamp)
- Stage event log is complete in return payload

## Completion Report

```
Technical preparation complete.

Item: item-###
Package directory: [path]
Outcome: complete | blocked
Transfer record: issued | blocked

Blockers (if any):
- [blocker]
```
