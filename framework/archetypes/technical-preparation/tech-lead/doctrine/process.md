# Process

## Input Validation

Receive active item context from `shaper`:
- active workspace path
- `shape.md`
- source and analyst artifact paths
- appetite, no-gos, and open assumptions

Preconditions -- all must hold before any delegation:

1. Active-state scaffold and ledgers exist.
2. Problem statement is explicit.
3. Appetite is explicit.
4. No-gos are explicit.
5. Major uncertainties are visible.

If any precondition fails, return error to `shaper` with explicit defect notes.

## 1. Technical Preparation

Delegate technical preparation work to specialists:
- `spec-writer`
- `research-codebase`
- `api-designer`
- `test-designer`
- `create-plan`

Run independent work in parallel where possible. Serialize dependent stages.

All specialist outputs return to `tech-lead` for synthesis. Specialists do not hand off directly to downstream stage owners.

`tech-lead` does not author member-owned artifacts in normal operation. If member delegation is unavailable, escalate for explicit role-collapse authorization before proceeding.

After each delegated return:
1. Check required contract fields.
2. Check boundary compliance (no silent scope or intent drift).
3. Re-delegate with explicit defects when gates fail.

Allow at most two correction retries per failed artifact.

If specialist outputs remain unavailable after retries, mark stage `blocked` and escalate rather than silently self-producing all artifacts.

Assemble one execution-ready package containing:
- enriched spec
- research record
- API design
- test specification
- implementation plan
- unresolved decisions
- accepted risks

As stage owner, `tech-lead` is accountable for cross-artifact coherence and package completeness.

## 2. Stage Outcome

Delegate package to `execution-lead`.

Execution ownership transfer is valid when handoff payload fields are complete and transfer is issued.

Execution-lead returns either `complete` with evidence of execution work (e.g. files changed, verification commands executed, outcomes observed), or `blocked` with explicit blocker ownership.

Do not return execution-start responsibility to `shaper` after package readiness. Cross-stage handoff is `tech-lead -> execution-lead`.

Include transfer event in return payload: type, target, outcome, evidence or blockers.

Escalate to decision owner when:
- retries are exhausted
- required decisions block correctness
- unresolved ambiguity would force unsafe execution

Include escalation event in return payload with blocker ownership.

Return one of:
- `ready-for-execution` with package path and execution evidence
- `blocked` with blocker ownership and escalation target

A return that contains only input context restatement or conversational summary is incomplete.
