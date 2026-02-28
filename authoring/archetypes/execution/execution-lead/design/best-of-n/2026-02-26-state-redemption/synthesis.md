# Synthesis: Execution-Lead State Redemption

Date: 2026-02-26
Input: 5 independent perspective analyses (A-E)

---

## 1. Universal Agreement (all 5 perspectives converge)

### The function model is correct and sufficient as the framing

All perspectives agree: execution-lead is a function `f(input) -> output | error`. The current named-phase model (intake, preflight, execution) is the root cause of the anti-patterns. The fix is structural, not cosmetic.

### The tenet is the intervention point

Perspective C traced 24 downstream instances to one tenet (`ethos/tenets.md:5`). All perspectives agree: fix the tenet, and downstream changes follow mechanically.

- **Current**: `Execution starts when intake contract fields are complete.`
- **Replacement**: `Execution starts when required input fields are complete.`

### "intake" must be fully eliminated from operational files

All perspectives agree: the word "intake" should not survive as a phase name, section heading, ledger event, or state label. Perspectives A, C, and D converge on "input" as the replacement vocabulary. Perspective C explicitly argues against keeping "intake" even as a verb -- the verbatim propagation rule would broadcast the tenet's vocabulary to sub-agents, and any surviving "intake" in doctrine creates a vocabulary mismatch.

### `running-with-evidence` must be eliminated

Perspectives A, B, and E converge: `running-with-evidence` violates the function model ("a function that has returned cannot be running"). Perspective A identified it as a fourth variant the doctrine's own type system doesn't recognize. Perspective B identified it as making the template polymorphic. There is no disagreement.

### The `If running:` conditional must be eliminated

Perspectives A, B, and E converge: conditional branching based on internal state makes the return type dishonest. The template must have one shape regardless of outcome.

### The `## Intake` section must be eliminated

All perspectives that address the template (A, B, C) agree: the section is acknowledgment semantics. The caller knows what it passed. Input echo is noise.

### The `handoff-received` ledger event must be removed

Perspectives A and C explicitly call for its removal. Perspective D's redesigned handoff contract has no acknowledgment event. A function does not log "I received my arguments."

### Three terminal outcomes

All perspectives converge on three terminal outcome values: `complete`, `blocked`, `escalated`.

### "transfer" must be replaced with "invocation"

Perspectives A, C, and D converge: "transfer" is state-transition vocabulary. "Invocation" is the function-model term.

### `principles.md` fix: "status" -> "outcome"

Perspectives A and C both identify this. No disagreement.

### Steps 3-5 (delegation chain) are already clean

Perspectives A and B explicitly note that the core computation -- delegate test-implementer, implement-plan, validate-plan -- needs no changes. The problem is only in the framing of validation (Steps 1-2) and output (template).

---

## 2. Points of Divergence and Resolution

### 2.1 Outcome prefix: `stage-` or not?

**Perspective A**: Uses bare values (`complete`, `blocked`, `escalated`).
**Perspective B**: Uses prefixed values (`stage-complete`, `stage-blocked`, `stage-escalated`) with explicit reasoning -- the pipeline has multiple stages, and the prefix disambiguates.
**Perspective D**: Uses bare values.

**Resolution: Use bare values (`complete`, `blocked`, `escalated`).** The output-contract.md already uses these bare values. The execution-stage report is inherently scoped to the execution stage (it's literally called "Execution Stage Report"). The `stage-` prefix adds noise without disambiguation value within a single agent's output. If pipeline-level disambiguation is needed later, it belongs in the pipeline layer, not in the template vocabulary.

### 2.2 process.md restructuring: Renumber steps or use unnumbered preambles?

**Perspective A**: Input Validation and Preconditions become unnumbered preamble sections. Step numbering starts at 1 = Delegate Test Implementation. Escalation becomes unnumbered (not a sequential step).
**Perspective C**: Keeps step numbers but renames ("Step 1: Validate Inputs and Start").

**Resolution: Use Perspective A's unnumbered preamble approach.** The whole point is that validation is not a step -- it's the first lines of the function body. Numbering it as a step (even renamed) preserves the structural incentive to treat it as a completable milestone. Unnumbered preambles eliminate that incentive. Escalation also becomes unnumbered -- it is an alternative return path, not a step after the last numbered step.

### 2.3 Template section structure

**Perspective A**: Minimal -- proposes a small `## Input` section with provenance (package source, handoff issuer).
**Perspective B**: Detailed 7-section template (Metadata, Work Performed, Evidence Bundle, Issues, Scope, Outcome, Event Ledger). No Input section at all. Provenance goes to Event Ledger if needed.

**Resolution: Use Perspective B's 7-section template.** It is more complete, separates concerns cleanly (issues vs. scope), and the "Work Performed" section solves a real problem -- it records which phases were attempted regardless of outcome. Provenance (package source, handoff issuer) should be in Metadata if recorded at all, not in a separate section. Two lines in Metadata is sufficient:
```
- Input source: `tech-lead`
- Handoff issuer:
```

### 2.4 Safeguard replacement: Remove entirely or replace with function-model-native guardrails?

**Perspective A**: Safeguards become unnecessary because validation is preamble, not a step. The "Intake Return Rule" becomes a "Return Contract" with a definitional statement.
**Perspective C**: Consolidate three safeguards into one positive return contract. Keep a redundant safety net in process.md.
**Perspective E**: The function model alone is NOT sufficient. Proposes three new guardrails: (1) terminal-only return rule (whitelist), (2) structured error return shape, (3) idempotency check before delegation.

**Resolution: Adopt Perspective E's Guardrail 1 (terminal-only return rule), framed as Perspective A's "Return Contract" with Perspective C's positive language.** The consolidated statement:

```
## Return Contract

Return to parent leader only with terminal outcomes:

1. execution evidence with verification results, or
2. `blocked` with explicit blocker ownership and next action.

Input validation is not a terminal outcome.
```

This is one whitelist-style rule that replaces three scattered prohibitions. It lives in orchestration.md (which sub-agents read during delegation).

**Guardrail 2 (structured error shape)**: Adopt the concept but keep it lightweight. The current blocker return shape in handoff-contract.md (outcome + blockers[] + recommended_next_action) is adequate. Perspective E's four-field categories (blocker_category, blocker_detail, blocker_owner, recommended_action) are useful but should be a natural part of the blocker description, not a mandated schema. Overly rigid error schemas become their own maintenance burden.

**Guardrail 3 (idempotency check)**: Adopt. Add a brief instruction in process.md's preamble or before delegation steps: "Before delegating, verify whether the delegate's expected output artifacts already exist on disk and are valid. If so, verify rather than re-delegate." This handles multi-session re-invocation without stateful resumption.

### 2.5 Retry/escalation semantics: Caller or callee responsibility?

**Perspective D**: Retry policy belongs to the caller (tech-lead), not the callee (execution-lead). Keeps the escalation convention in handoff-contract.md as a convention, not a rule.
**Perspective E**: Acknowledges "two correction cycles" implies cross-invocation memory, which violates statelessness.

**Resolution: Keep the escalation convention in handoff-contract.md, framed as Perspective D proposes -- a convention, not callee logic.** The function does not count its invocations. The convention tells both parties what the expected threshold is. Rename "Escalation Rule" to "Escalation Convention" per Perspective D.

### 2.6 Cross-reference between handoff-contract.md and output-contract.md

**Perspective D**: The two documents are halves of one function signature. They should reference each other.
**No other perspective addresses this.**

**Resolution: Adopt.** Add a reference line at the top of output-contract.md pointing to handoff-contract.md for input fields, and a reference line in handoff-contract.md pointing to output-contract.md for the success return type. This is a small, high-value change.

---

## 3. Concrete Changes

### File 1: `ethos/tenets.md`

| Line | Current | Replacement |
|---|---|---|
| 5 | `Execution starts when intake contract fields are complete.` | `Execution starts when required input fields are complete.` |

**ROOT CHANGE.** Everything below propagates from this.

### File 2: `ethos/principles.md`

| Line | Current | Replacement |
|---|---|---|
| 5 | `One stage owner publishes cross-stage status.` | `One stage owner publishes cross-stage outcome.` |

### File 3: `doctrine/process.md`

| Location | Current | Replacement |
|---|---|---|
| Step 1 heading | `## Step 1: Intake and Start` | `## Input Validation` (unnumbered preamble) |
| Line 6 | `Verify required intake fields exist:` | `Verify required input fields exist:` |
| Line 14 | `Start execution stage immediately when intake fields are complete.` | Remove. Implicit: if validation passes, proceed. |
| Line 16 | `Append intake event to project and item ledgers ('handoff-received', actor: 'execution-lead').` | Remove entirely. |
| Line 18 | `If intake is incomplete, return 'blocked'...` | `If any required field is missing, return 'blocked'...` |
| Line 26 | `...an intake blocker.` | `...an input validation failure.` |
| Step 2 heading | `## Step 2: Preflight Execution Gate` | `## Preconditions` (unnumbered preamble) |
| Line 40 | `If preflight passes, continue immediately to Step 3 in this invocation. Do not return intake/preflight-only responses.` | `Do not return validation-only results. Continue to Step 1 immediately.` |
| Steps 3-5 | `## Step 3/4/5` | Renumber to `## Step 1/2/3` |
| Step 6 | `## Step 6: Publish Stage Outcome` | `## Step 4: Publish Stage Outcome` |
| Line 55 | `First return to 'tech-lead' after successful transfer must include...` | Remove "first return" and "transfer" language. Replace with: `Return value must include concrete execution evidence (files changed and verification outcomes), or 'blocked' with explicit blocker ownership.` |
| Step 7 | `## Step 7: Escalate When Required` | `## Escalation` (unnumbered -- alternative return path) |
| Line 97 | `intake remains insufficient after retries` | `input validation fails after retry attempts` |
| New | (none) | Add idempotency instruction before delegation steps: `Before delegating, verify whether the delegate's expected output artifacts already exist and are valid. If so, verify rather than re-delegate.` |

### File 4: `doctrine/orchestration.md`

| Location | Current | Replacement |
|---|---|---|
| Section heading | `## Intake Return Rule` | `## Return Contract` |
| Lines 27-32 | "Do not return intake/preflight pass..." (prohibition) | Whitelist: "Return to parent leader only with terminal outcomes: (1) execution evidence with verification results, or (2) `blocked` with explicit blocker ownership and next action. Input validation is not a terminal outcome." |
| Line 62 | `> Execution starts when intake contract fields are complete.` | `> Execution starts when required input fields are complete.` (inherits tenet fix via verbatim propagation) |

### File 5: `doctrine/handoff-contract.md`

Full replacement per Perspective D's concrete document:

| Section | Current | Replacement |
|---|---|---|
| Opening | "governs transfer from" | "defines the invocation interface for" |
| Section heading | `## Required Intake Payload` | `## Required Input Fields` |
| Field list | (unchanged) | (unchanged -- the 9 fields are correct) |
| Path semantics | "handoff payload" | "input fields" |
| Section heading | `## Required Transfer Outcome` | `## Return Contract` |
| Line 29 | "when intake contract fields are complete" | "when required input fields are present" |
| Line 31 | "Intake/preflight pass is non-terminal..." | Remove. The return contract's two shapes (success -> output-contract.md, validation error -> blocked) leave no structural slot for "I passed validation." |
| Line 33 | "If intake contract is incomplete" | "If input validation fails" |
| Section heading | `## Transfer Rule` | `## Ownership` |
| Line 41 | "Execution ownership transfers when..." | "Execution-lead owns all work from invocation to return." |
| Line 43 | "If intake is blocked, ownership returns to 'tech-lead'." | "If input validation fails, the caller ('tech-lead') retains ownership and decides whether to correct and reinvoke." |
| Section heading | `## Escalation Rule` | `## Escalation Convention` |
| Line 47 | "intake blockers" | "input validation failures" |
| New | (none) | Add cross-reference: "For the return value on successful execution, see output-contract.md." |

### File 6: `doctrine/output-contract.md`

| Line | Current | Replacement |
|---|---|---|
| 27 | `project/item event ledger entries for intake, stage outcome, and escalation (if any)` | `project/item event ledger entries for stage outcome and escalation (if any)` |
| 33 | `Intake contract fields are complete and stage started` | `Required input fields are present` |
| New | (none) | Add opening reference: "Input fields and preconditions are defined in handoff-contract.md." |

### File 7: `doctrine/team-contract.md`

| Line | Current | Replacement |
|---|---|---|
| 9 | `intake package provider` | `input provider` |
| 24 | `intake authority is from tech-lead package handoff` | `invocation authority is tech-lead, not direct shaper delegation in normal flow` |
| 34 | `after intake/preflight gates pass` | `after input validation passes` |

### File 8: `doctrine/pipeline.md`

| Line | Current | Replacement |
|---|---|---|
| 13 | `intake package from 'tech-lead'` | `input package from 'tech-lead'` |

### File 9: `references/template.md`

**Full redesign.** Replace the current template with Perspective B's 7-section structure:

1. **Metadata** -- date, item ID, workspace, worktree path, report path. Add two provenance lines: input source (`tech-lead`), handoff issuer.
2. **Work Performed** -- per-phase record (test implementation, implementation, validation) with delegate, files changed, commits, verification result. Phases not attempted listed with reason. Unconditional.
3. **Evidence Bundle** -- artifact paths and commit references. Unconditional.
4. **Issues** -- critical issues, unresolved decisions, upstream defects routed to owner.
5. **Scope** -- must-have outcome, nice-to-have deferrals, accepted risks.
6. **Outcome** -- single field: `complete | blocked | escalated`. Blocker ownership (if blocked/escalated). Recommended next action.
7. **Event Ledger** -- project and item event entries. No `handoff-received` event.

**Eliminated**: `## Intake` section, `running-with-evidence` value, `If running:` conditional, `Transfer outcome` field.

---

## 4. Change Order

The changes have a dependency order. The tenet must change first because verbatim propagation broadcasts it.

1. `ethos/tenets.md` -- root change
2. `ethos/principles.md` -- independent, can parallel with 1
3. `references/template.md` -- highest behavioral impact (the template is the enforcement mechanism)
4. `doctrine/process.md` -- restructure steps, add idempotency instruction
5. `doctrine/orchestration.md` -- return contract, verbatim propagation update
6. `doctrine/handoff-contract.md` -- full invocation-interface rewrite
7. `doctrine/output-contract.md` -- ledger/quality-gate cleanup, cross-reference
8. `doctrine/team-contract.md` -- vocabulary cleanup
9. `doctrine/pipeline.md` -- vocabulary cleanup

After all changes: `--dry-run` assembly to verify the SKILL.md output is coherent. Then `--push` to deploy.

---

## 5. Verification Criteria

The redemption is complete when:

1. The word "intake" appears zero times in operational files (truth/, ethos/, doctrine/, references/).
2. The word "transfer" (as state transition) appears zero times. "Transfer" as in "knowledge transfer" is fine if it appears; "transfer from X to Y" as ownership transition is not.
3. The template has one outcome field with three values and zero conditional branches.
4. The `handoff-received` ledger event does not exist.
5. `running-with-evidence` does not appear anywhere.
6. process.md has unnumbered validation preambles and numbered computation steps starting at 1.
7. orchestration.md has a positive "Return Contract" replacing the prohibition-style "Intake Return Rule."
8. handoff-contract.md and output-contract.md cross-reference each other as halves of the function signature.
