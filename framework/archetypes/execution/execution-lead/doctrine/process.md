# Process

## Step 1: Intake and Start

1. Receive package from `tech-lead`.
2. Verify required intake fields exist:
   - active item workspace
   - technical package path
   - plan path
   - test specification path(s)
   - unresolved decisions and accepted risks
   - execution worktree path
   - handoff issuer (`tech-lead` by default; explicit decision-owner override required otherwise)
3. Start execution stage immediately when intake fields are complete.

Append intake event to project and item ledgers (`handoff-received`, actor: `execution-lead`).

If intake is incomplete, return `blocked` with explicit blocker ownership.

If direct delegation comes from `shaper` without explicit decision-owner override, return `blocked` and route to `tech-lead` for proper handoff.

Path-resolution rule:

- Consume planning/package artifacts at the exact paths provided by `tech-lead`.
- Use execution worktree path for code/test implementation activity.
- Missing planning artifacts inside execution worktree is not, by itself, an intake blocker.

## Step 2: Preflight Execution Gate

Verify plan is execution-usable:

- test obligations are explicit
- implementation phases are explicit
- must-have and nice-to-have scope is explicit
- known risks and unresolved decisions are explicit
- execution worktree path exists and is usable for code changes

If preflight fails, return defects to `tech-lead`.

If preflight passes, continue immediately to Step 3 in this invocation. Do not return intake/preflight-only responses.

## Step 3: Delegate Test Implementation

Delegate `test-implementer` first.

Require return evidence:

- implemented test files
- spec-to-test traceability
- compile/parse status
- test commit hashes

Block progression until test gate passes.

First return to `tech-lead` after successful transfer must include concrete execution evidence from this step (files changed and verification outcomes), or `blocked` if this step cannot proceed.

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

Append stage outcome event to project and item ledgers (`stage-complete`, `stage-blocked`, or `stage-escalated`).

## Step 7: Escalate When Required

Escalate with explicit defect ownership when:

- intake remains insufficient after retries
- upstream package defects block safe execution
- validation fails on critical requirements
- strategic scope tradeoffs require decision-owner judgment

Record escalation events in project and item ledgers with blocker ownership and recommended options.
