# Process

## Step 1: Intake and Acknowledge

1. Receive package from `tech-lead`.
2. Verify required intake fields exist:
   - active item workspace
   - technical package path
   - plan path
   - test specification path(s)
   - unresolved decisions and accepted risks
3. Return acknowledgment:
   - `receipt_confirmed`
   - `sufficiency_for_execution`
   - `blocking_gaps[]`
   - `first_execution_step`

Do not start execution when sufficiency is false.

## Step 2: Preflight Execution Gate

Verify plan is execution-usable:

- test obligations are explicit
- implementation phases are explicit
- must-have and nice-to-have scope is explicit
- known risks and unresolved decisions are explicit

If preflight fails, return defects to `tech-lead`.

## Step 3: Delegate Test Implementation

Delegate `test-implementer` first.

Require return evidence:

- implemented test files
- spec-to-test traceability
- compile/parse status
- test commit hashes

Block progression until test gate passes.

## Step 4: Delegate Implementation

Delegate `implement-plan` after test gate passes.

Require return evidence:

- phase completion status
- implementation commit hashes
- verification outputs
- plan checkbox updates

If implementation reveals upstream defects, route defects explicitly upstream.

## Step 5: Delegate Validation

Delegate `validate-plan` after implementation gate passes.

Require validation evidence:

- phase validation status
- source requirement coverage status
- deviation list and severity
- final validation recommendation

## Step 6: Publish Stage Outcome

Publish exactly one execution-stage outcome:

- `complete`
- `blocked`
- `escalated`

Include evidence bundle and unresolved issues.

## Step 7: Escalate When Required

Escalate with explicit defect ownership when:

- intake remains insufficient after retries
- upstream package defects block safe execution
- validation fails on critical requirements
- strategic scope tradeoffs require decision-owner judgment
