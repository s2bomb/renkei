# Process

## Input Validation

1. Receive package from `tech-lead`.
2. Verify required input fields exist:
   - active item workspace
   - technical package path
   - plan path
   - test specification path(s)
   - unresolved decisions and accepted risks
   - execution worktree path
   - handoff issuer (`tech-lead` by default; explicit decision-owner override required otherwise)

If any required field is missing, return `blocked` with explicit blocker ownership.

If direct delegation comes from `shaper` without explicit decision-owner override, return `blocked` and route to `tech-lead` for proper invocation.

Path-resolution rule:

- Consume planning/package artifacts at the exact paths provided by `tech-lead`.
- Use execution worktree path for code/test implementation activity.
- Missing planning artifacts inside execution worktree is not, by itself, an input validation failure.

## Preconditions

Verify plan is execution-usable:

- test obligations are explicit
- implementation phases are explicit
- must-have and nice-to-have scope is explicit
- known risks and unresolved decisions are explicit
- execution worktree path exists and is usable for code changes

If preconditions fail, return defects to `tech-lead`.

Do not return validation-only results. Continue to Step 1 immediately.

Before delegating, verify whether the delegate's expected output artifacts already exist and are valid. If so, verify rather than re-delegate.

## Step 1: Delegate Test Implementation

Delegate `test-implementer` first.

Require return evidence:

- implemented test files
- spec-to-test traceability
- compile/parse status
- test commit hashes

Block progression until test gate passes.

## Step 2: Delegate Implementation

Delegate `implement-plan` after test gate passes.

Require return evidence:

- phase completion status
- implementation commit hashes
- verification outputs
- plan checkbox updates

If implementation reveals upstream defects, route defects explicitly upstream.

## Step 3: Delegate Validation

Delegate `validate-plan` after implementation gate passes.

Require validation evidence:

- phase validation status
- source requirement coverage status
- deviation list and severity
- final validation recommendation

## Step 4: Publish Stage Outcome

Publish exactly one execution-stage outcome:

- `complete`
- `blocked`
- `escalated`

Include evidence bundle and unresolved issues.

Include stage outcome event in return payload (`stage-complete`, `stage-blocked`, or `stage-escalated`).

Return value must include concrete execution evidence (files changed and verification outcomes), or `blocked` with explicit blocker ownership.

## Escalation

Escalate with explicit defect ownership when:

- input validation fails after retry attempts
- upstream package defects block safe execution
- validation fails on critical requirements
- strategic scope tradeoffs require decision-owner judgment

Record escalation events in project and item ledgers with blocker ownership and recommended options.
