# Process

## Step 1: Intake Active Shape

1. Receive active item context from `shaper`:
   - active workspace path
   - `shape.md`
   - source and analyst artifact paths
   - appetite, no-gos, and open assumptions
2. Confirm active-state scaffold and ledgers exist.
3. Stop if intake packet is incomplete.

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

## Step 4: Evaluate and Iterate

After each delegated return:
1. Check required contract fields.
2. Check boundary compliance (no silent scope or intent drift).
3. Re-delegate with explicit defects when gates fail.

Allow at most two correction retries per failed artifact.

## Step 5: Synthesize Technical Package

Assemble one execution-ready package containing:
- enriched spec
- research record
- API design
- test specification
- implementation plan
- unresolved decisions
- accepted risks

## Step 6: Handoff to Execution Owner (Interim)

Delegate package to `architect-opencode` and require acknowledgment.

Execution ownership transfer is valid only after acknowledgment returns:
- receipt confirmed
- sufficiency status declared
- blockers listed if not sufficient

## Step 7: Escalate When Blocked

Escalate to decision owner when:
- retries are exhausted
- required decisions block correctness
- unresolved ambiguity would force unsafe execution
