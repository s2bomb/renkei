# Process

## Input Validation

Receive active item context from `shaper`:
- active workspace path
- shaped intent artifact locator
- source and analyst artifact locators
- appetite, no-gos, and open assumptions

Preconditions -- all must hold before any delegation:

1. Active-state scaffold and ledgers exist.
2. Problem statement is explicit.
3. Appetite is explicit.
4. No-gos are explicit.
5. Major uncertainties are visible.

If any precondition fails, return `blocked` to `shaper` with explicit defect notes and ownership.

## 1. Delegate and Gate Specialist Artifacts

Delegate technical preparation work to specialists:
- `spec-writer`
- `research-codebase`
- `api-designer`
- `test-designer`
- `create-plan`

Run independent work in parallel where possible. Serialize dependent stages.

All specialist outputs return to `tech-lead` for synthesis. Specialists do not hand off directly to downstream stage owners.

`tech-lead` does not author specialist-owned artifacts.

If specialist delegation is unavailable, return `blocked` and escalate for explicit decision-owner role-collapse authorization. Do not silently substitute specialist authorship.

After each delegated return:
1. Check required contract fields.
2. Check boundary compliance (no silent scope or intent drift).
3. Re-delegate with explicit defects when gates fail.

Allow at most two correction retries per failed artifact.

If specialist outputs remain unavailable after retries, mark stage `blocked` and escalate rather than silently self-producing all artifacts.

Drift interruption rule:

- If you begin drafting specialist-owned artifacts, stop immediately.
- Re-delegate to owning specialist role with explicit defects.
- If delegation still cannot satisfy ownership, escalate and return `blocked`.

Delegation-integrity checkpoint (required before synthesis):

- For each required artifact class, verify delegated return includes:
  - `artifact_class`
  - `artifact_locator`
  - `owner_role`
  - unresolved questions or blockers
  - source citations for major claims

If any required class is missing delegated ownership evidence, return `blocked`.

## 2. Synthesize Package Directory

Synthesize one execution-ready package directory that indexes specialist-owned artifacts and records:

- unresolved decisions
- accepted risks
- must-have and nice-to-have scope partition
- transfer metadata

As stage owner, `tech-lead` is accountable for cross-artifact coherence and package completeness.

## 3. Stage Outcome

Delegate package directory to `execution-lead`.

Execution ownership transfer is valid when required handoff fields are complete and transfer is issued.

If `execution-lead` returns `blocked`, route correction to the owning role, re-invoke, or escalate.

Do not return execution-start responsibility to `shaper` after package readiness. Cross-stage handoff is `tech-lead -> execution-lead`.

Include transfer event in return payload: type, target, outcome, and blockers when blocked.

Escalate to decision owner when:
- retries are exhausted
- required decisions block correctness
- unresolved ambiguity would force unsafe execution

Include escalation event in return payload with blocker ownership.

Return one of:
- `complete` with item workspace path, package directory path, package index locator, and transfer record (`issued`)
- `blocked` with blocker ownership and escalation target

A return that contains only input context restatement or conversational summary is incomplete.
