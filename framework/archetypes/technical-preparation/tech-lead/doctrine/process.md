# Process

## Step 1: Intake Active Shape

1. Receive active item context from `shaper`:
   - active workspace path
   - `shape.md`
   - source and analyst artifact paths
   - appetite, no-gos, and open assumptions
2. Confirm active-state scaffold and ledgers exist.
3. Append intake event to project and item ledgers (`handoff-received`, actor: `tech-lead`).
4. Stop if intake packet is incomplete.

## Step 2: Preflight Quality Gate

Verify shaped intent is execution-preparable:
- problem and boundaries are explicit
- appetite is explicit
- no-gos are explicit
- major uncertainties are visible

If product-framing defects are found, route to `shaper` with explicit defect notes.

## Step 3: Orchestrate Specialist Artifacts

Delegate technical preparation work to specialists:
- `spec-writer`
- `research-codebase`
- `api-designer`
- `test-designer`
- `create-plan`

Run independent work in parallel where possible. Serialize dependent stages.

All specialist outputs return to `tech-lead` for synthesis. Specialists do not hand off directly to downstream stage owners.

`tech-lead` does not author member-owned artifacts in normal operation. If member delegation is unavailable, escalate for explicit role-collapse authorization before proceeding.

## Step 4: Evaluate and Iterate

After each delegated return:
1. Check required contract fields.
2. Check boundary compliance (no silent scope or intent drift).
3. Re-delegate with explicit defects when gates fail.

Allow at most two correction retries per failed artifact.

If specialist outputs remain unavailable after retries, mark stage `blocked` and escalate rather than silently self-producing all artifacts.

## Step 5: Synthesize Technical Package

Assemble one execution-ready package containing:
- enriched spec
- research record
- API design
- test specification
- implementation plan
- unresolved decisions
- accepted risks

As stage owner, `tech-lead` is accountable for cross-artifact coherence and package completeness.

## Step 6: Transfer to Execution Owner

Delegate package to `execution-lead`.

Execution ownership transfer is valid when handoff payload fields are complete and transfer is issued.

Execution-lead behavior after invocation:
- proceed immediately with execution stage and attempt first execution phase work with evidence, or
- return `blocked` with explicit blocker ownership.

Do not return execution-start responsibility to `shaper` after package readiness. Cross-stage handoff is `tech-lead -> execution-lead`.

Append transfer events to project and item ledgers:
- `handoff-issued` (to `execution-lead`)
- `handoff-result` (`running-with-evidence` or `blocked`)

## Step 7: Escalate When Blocked

Escalate to decision owner when:
- retries are exhausted
- required decisions block correctness
- unresolved ambiguity would force unsafe execution

Record escalation events in project and item ledgers with blocker ownership.
