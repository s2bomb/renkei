# Perspective B: Return Value Redesign

**Date**: 2026-02-26
**Lens**: What should replace `running` / `running-with-evidence`? How should handoff and output contracts express terminal outcomes?

---

## 1. Why `running` / `running-with-evidence` Are Anti-Patterns

### The Core Violation

AGENTS.md states: "Agents are non-deterministic functions. They are closer to computer functions than to humans -- stateless, terminal, composable." And: "Return data, not promises. A pure function is done when it returns."

`running` violates both. A function that has returned cannot be running. The word describes the *current state* of a process, not the *terminal outcome* of a function. When tech-lead returns `running-with-evidence`, it is saying: "I called execution-lead and it is still going." But tech-lead has returned. Execution-lead has returned (agents are terminal). The only thing that exists is the data that came back.

This is not a minor naming issue. It reveals a mental model where agent invocation is process-launch rather than function-call. In the process-launch model, you start something and report its status. In the function-call model, you call something and return its result. These are incompatible models.

### What the Terms Imply

- **`running`** implies: execution-lead was invoked and is currently executing. Tech-lead is reporting on an ongoing process.
- **`running-with-evidence`** implies: execution-lead is currently executing and has produced some evidence along the way. Tech-lead is returning a progress snapshot.

Both describe **transient states of a downstream process**, not **terminal descriptions of what was produced**. They answer the question "what is happening?" rather than "what was produced?"

### Every Instance

| File | Line | Text | Problem |
|---|---|---|---|
| `doctrine/process.md` | 77 | `handoff-result (running-with-evidence or blocked)` | Ledger records a status, not an outcome |
| `doctrine/handoff-contract.md` | 30 | `outcome: running` | Contract defines a status as a valid return |
| `doctrine/pipeline.md` | 22 | `transfer record to execution owner (running or blocked)` | Pipeline output is a status report |
| `doctrine/output-contract.md` | 25 | `transfer record outcome (tech-lead -> execution-lead: running-with-evidence \| blocked)` | Output contract bakes status into the required fields |
| `references/template.md` | 48 | `Transfer result: running-with-evidence \| blocked` | Template propagates status into every output artifact |
| `references/template.md` | 53 | `If running:` | Conditional section header uses status label |

Six instances across four files plus the template. The contamination is consistent: every file that describes what tech-lead produces at the execution-lead boundary uses status language.

### The Internal Contradiction

The output-contract.md itself proves the problem. Line 25 uses `running-with-evidence | blocked`. Line 47 uses `ready-for-execution | blocked`. The same document uses two incompatible models:

- Line 25: what is happening (process status)
- Line 47: what was produced (terminal outcome)

Line 47 is correct. Line 25 is not.

---

## 2. Terminal Outcome Design

### The Function Signature

Viewed as a function, tech-lead has this signature:

```
tech-lead(shaped_artifact, workspace_context) -> TechLeadResult
```

The return type must describe what was produced, not what is happening. It must be terminal -- once returned, there is no further state change.

### Proposed Return Type

```
TechLeadResult =
  | { outcome: "ready-for-execution", package: TechnicalPackage, execution_evidence: ExecutionEvidence }
  | { outcome: "ready-for-execution", package: TechnicalPackage, execution_blocked: BlockerList }
  | { outcome: "blocked", blockers: BlockerList, escalation: EscalationTarget }
  | { outcome: "invalid-input", defects: DefectList, route_to: "shaper" }
```

Four terminal outcomes. Each describes a completed state of the world, not an ongoing process.

### Outcome Definitions

**`ready-for-execution` with `execution_evidence`** -- Tech-lead produced a complete technical package, delegated to execution-lead, and execution-lead returned successfully with first-phase evidence. This is the full success path. The evidence (files changed, verification commands, outcomes) is part of the return payload. It is data that was produced, not a status of something running.

**`ready-for-execution` with `execution_blocked`** -- Tech-lead produced a complete technical package, delegated to execution-lead, and execution-lead returned blocked. The package is ready; execution could not proceed. The blockers are part of the return payload.

**`blocked`** -- Tech-lead could not produce a complete technical package. Specialist artifacts failed quality gates after retries, or unresolvable decisions prevent correctness. Escalation target is included.

**`invalid-input`** -- The shaped artifact failed validation. Product-framing defects were found. Routed back to shaper with explicit defect notes. This is the equivalent of a function rejecting its arguments.

### Why Four, Not Two

The current model has two outcomes: `running-with-evidence | blocked`. This conflates three distinct situations:

1. Everything worked, including execution-lead's first phase.
2. Package was ready but execution-lead hit a blocker.
3. Package itself couldn't be completed.

These require different responses from the caller. Conflating (1) and (2) under `running` hides whether execution-lead succeeded or failed. Conflating (2) and (3) under `blocked` hides whether the blockage is in tech-lead's work or execution-lead's work.

### Why `invalid-input` Is Separate From `blocked`

`blocked` means tech-lead attempted its work and could not complete it. `invalid-input` means tech-lead rejected its input before doing substantive work. These have different ownership: `invalid-input` routes to shaper; `blocked` escalates to decision owner. Separating them makes the routing explicit in the return type rather than hidden in the error payload.

---

## 3. Handoff Contract Redesign

### Current Problem

The handoff-contract.md (lines 28-40) defines the transfer outcome as:

```
1. outcome: running
2. concrete first-phase progress evidence
```

or:

```
1. outcome: blocked
2. blockers[]: explicit blocker list
3. recommended_next_action
```

This is an acknowledgment protocol. Execution-lead receives the handoff and acknowledges with a status. The function model requires execution-lead to return a result.

### Proposed "Required Transfer Outcome" Section

Replace lines 26-50 of handoff-contract.md with:

**Current text (lines 26-50):**
```markdown
## Required Transfer Outcome

Execution owner returns one of:

1. `outcome`: `running`
2. concrete first-phase progress evidence:
   - files changed
   - verification commands run
   - outcomes

or, if blocked at intake/preflight:

1. `outcome`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`

## Transfer Rule

Execution ownership is transferred when payload fields are complete and transfer is issued.

After transfer, execution-lead immediately runs execution stage unless blocked by a contract defect.

Intake/preflight pass alone is not a terminal return for execution-lead in this handoff.

If blocked, ownership returns to `tech-lead` for correction or escalation.
```

**Proposed replacement:**
```markdown
## Required Execution-Lead Return

Execution-lead returns one of:

1. `outcome`: `complete-with-evidence`
   - files changed
   - verification commands run
   - outcomes

2. `outcome`: `blocked`
   - `blockers[]`: explicit blocker list with ownership
   - `recommended_next_action`

Execution-lead validates its input and attempts first-phase execution before returning. Validation alone is not a complete result -- the return must include either execution evidence or explicit blockers.

## Transfer Rule

Execution ownership transfers when handoff payload is complete. Execution-lead returns a terminal result.

If execution-lead returns `blocked`, tech-lead handles the error: correct and retry, or escalate.
```

### What Changed and Why

1. **Section renamed**: "Required Transfer Outcome" -> "Required Execution-Lead Return". "Transfer outcome" implies a transfer event with a status. "Execution-lead return" describes a function returning data.

2. **`running` -> `complete-with-evidence`**: Terminal description of what was produced. The evidence exists. The function returned. Nothing is "running."

3. **Removed "intake/preflight" references**: Lines 36 and 48 named execution-lead's internal phases. The contract now says "validation alone is not a complete result" -- same constraint, no internal-phase naming.

4. **Removed "ownership returns to tech-lead"**: Ownership transfer is state-machine language. Replaced with: execution-lead returned blocked, tech-lead handles the error. This is normal error handling, not an ownership transition.

5. **Removed "After transfer, execution-lead immediately runs"**: This describes what execution-lead does after being invoked -- process-launch language. In the function model, execution-lead was called and it returned. What it does internally is not tech-lead's concern.

---

## 4. Output Contract Changes

### Line 25: Transfer Record Outcome

**Current:**
```
12. transfer record outcome (`tech-lead -> execution-lead`: `running-with-evidence` | `blocked`)
```

**Proposed:**
```
12. transfer record outcome (`tech-lead -> execution-lead`: `complete-with-evidence` | `execution-blocked` | `not-attempted`)
```

**Why three values now:** The output contract records what happened at the execution-lead boundary. Three things can happen: (a) execution-lead returned with evidence, (b) execution-lead returned blocked, (c) tech-lead did not invoke execution-lead because the package itself was blocked. `running-with-evidence` conflated (a) with an ongoing status. The current `blocked` conflated (b) and (c). The proposed values distinguish all three terminal states.

`not-attempted` is only valid when the overall tech-lead outcome is `blocked` -- the package couldn't be completed, so execution-lead was never called.

### Line 26: Ledger Entries

**Current:**
```
13. project/item event ledger entries for intake, handoff, and escalation (if any)
```

**Proposed:**
```
13. project/item event ledger entries for handoff and escalation (if any)
```

**Why:** Remove "intake" from the required ledger categories. A function does not log that it received its arguments. The handoff event (to execution-lead) and escalation events are legitimate outputs -- they describe actions taken, not input received.

### Line 47: Completion Report (Already Correct)

```
Outcome: ready-for-execution | blocked
```

This line is already correct. It uses terminal outcomes. No change needed. The fix to line 25 resolves the internal contradiction.

---

## 5. Pipeline and Template Cascade

### pipeline.md Line 22

**Current:**
```
- transfer record to execution owner (`running` or `blocked`)
```

**Proposed:**
```
- transfer record to execution owner (`complete-with-evidence` | `execution-blocked` | `not-attempted`)
```

Same three-valued terminal outcome as the output contract. The pipeline defines what tech-lead produces. Its outputs must use terminal descriptions.

### template.md Lines 48-59

**Current:**
```markdown
- Transfer result: running-with-evidence | blocked
- Blocking gaps (if blocked):
  -
- Recommended next action (if blocked):

If running:
- files changed:
  -
- verification commands:
  -
- outcomes:
  -
```

**Proposed:**
```markdown
- Transfer result: complete-with-evidence | execution-blocked | not-attempted
- Blocking gaps (if execution-blocked or not-attempted):
  -
- Recommended next action (if execution-blocked or not-attempted):

If complete-with-evidence:
- files changed:
  -
- verification commands:
  -
- outcomes:
  -
```

**Changes:**
1. `running-with-evidence` -> `complete-with-evidence`
2. `blocked` -> `execution-blocked | not-attempted` (distinguishes execution-lead failure from package incompleteness)
3. `If running:` -> `If complete-with-evidence:` (conditional uses terminal label)

### template.md Line 11

**Current:**
```markdown
## Intake Summary
```

**Proposed:**
```markdown
## Shaped Context
```

**Why:** The section contains appetite, no-gos, and open assumptions -- the shaped artifact's constraints that were the function's input parameters. "Intake Summary" names a phase. "Shaped Context" names the data.

---

## 6. Process.md Cascade (Transfer Section Only)

This perspective focuses on return values, not the full process.md phase-naming problem (which is a structural concern for other perspectives). The return-value changes require updates to the transfer section.

### Lines 75-77

**Current:**
```markdown
Append transfer events to project and item ledgers:
- `handoff-issued` (to `execution-lead`)
- `handoff-result` (`running-with-evidence` or `blocked`)
```

**Proposed:**
```markdown
Record transfer outcome in technical package:
- execution-lead invocation result: `complete-with-evidence` | `execution-blocked` | `not-attempted`
```

**Changes:**
1. "Append transfer events to project and item ledgers" -> "Record transfer outcome in technical package". The outcome is part of the return value, not a side-effect append to external state.
2. Removed `handoff-issued` as a separate event. The invocation is implicit -- if there is a result, there was a call.
3. Replaced `running-with-evidence or blocked` with the three terminal values.

### Line 11

**Current:**
```markdown
3. Append intake event to project and item ledgers (`handoff-received`, actor: `tech-lead`).
```

**Proposed:** Delete this line.

**Why:** `handoff-received` is an acknowledgment. The function was called. That is the evidence of receipt. No ledger entry needed.

---

## 7. Orchestration.md and Team-Contract.md Cascade

### orchestration.md Line 25

**Current:**
```
- `spec-writer` and `research-codebase` may run in parallel when intake context is complete.
```

**Proposed:**
```
- `spec-writer` and `research-codebase` may run in parallel once input is validated.
```

**Why:** "Intake context is complete" names a phase transition. "Input is validated" describes a precondition. Same operational meaning, no phase naming.

### orchestration.md Line 7

**Current:**
```
When invoked from `shaper` for an active item, run technical preparation to stage outcome (`ready-for-execution` or `blocked`). Intake chat is not a completion state.
```

**Proposed:**
```
When invoked, run technical preparation to terminal outcome (`ready-for-execution` or `blocked`).
```

**Why:** "Intake chat is not a completion state" is a prohibition that only makes sense if "intake chat" is a recognized state. If the model is a function, there is no chat state to prohibit. Removing the prohibition and the intake-chat concept together.

### team-contract.md Line 36

**Current:**
```
- Delegate to specialists when intake packet passes preflight.
```

**Proposed:**
```
- Delegate to specialists after input validation passes.
```

**Why:** "Intake packet passes preflight" names two phases. "Input validation passes" names the precondition.

---

## 8. Summary: The Complete Return Value Vocabulary

### Before (Status Model)

| Value | Appears In | Type |
|---|---|---|
| `running` | handoff-contract:30, pipeline:22 | Process status |
| `running-with-evidence` | process:77, output-contract:25, template:48 | Process status + payload hint |
| `blocked` | handoff-contract:38, pipeline:22, output-contract:25, template:48 | Ambiguous (whose block?) |
| `handoff-received` | process:11 | Acknowledgment |
| `handoff-issued` | process:76 | Intermediate narration |
| `handoff-result` | process:77 | Status container |

### After (Return Value Model)

| Value | Meaning | Terminal? |
|---|---|---|
| `ready-for-execution` | Tech-lead's overall outcome: package is complete | Yes |
| `blocked` | Tech-lead's overall outcome: package could not be completed | Yes |
| `invalid-input` | Tech-lead's overall outcome: shaped artifact failed validation | Yes |
| `complete-with-evidence` | Execution-lead's return: first phase succeeded with evidence | Yes |
| `execution-blocked` | Execution-lead's return: could not proceed, explicit blockers | Yes |
| `not-attempted` | Execution-lead was not invoked (tech-lead blocked before transfer) | Yes |

Every value describes a completed state. No value describes an ongoing process. No value is an acknowledgment.

### The Two-Level Structure

The redesign reveals that tech-lead's return has two levels:

1. **Tech-lead's own outcome**: `ready-for-execution | blocked | invalid-input`
2. **Execution-lead's result** (nested, only present when tech-lead outcome is `ready-for-execution`): `complete-with-evidence | execution-blocked`

When tech-lead is `blocked`, the execution-lead result is `not-attempted`. This nesting is natural -- a function that calls another function returns its own result, which may include the sub-call's result.

The output-contract completion report (line 47) already uses level 1 correctly. The transfer record (line 25) should use level 2. These are complementary, not redundant.

---

## 9. Ledger Model Note

The audit identified intermediate ledger appends as side effects that make the function impure. This perspective's position: **ledger entries should be part of the return value, not appended during execution.**

The return payload can include an event list:
```
events: [
  { type: "transfer", target: "execution-lead", result: "complete-with-evidence" },
  { type: "escalation", target: "decision-owner", reason: "..." }
]
```

The caller (or the harness) decides what to do with these events. The function does not reach into external state to append records mid-execution. This aligns with AGENTS.md: "State is a value you pass around, not a property you hide inside an object and mutate through methods."

This does not mean events are eliminated. It means they are data in the return, not side effects during execution. The harness or the upstream caller writes them to whatever ledger exists. The function is pure.
