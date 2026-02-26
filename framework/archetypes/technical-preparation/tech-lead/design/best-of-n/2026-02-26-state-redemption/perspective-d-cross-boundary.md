# Perspective D: Cross-Boundary Contract Analysis

**Lens**: How should the handoff-contract.md express the invocation contract without naming execution-lead's internal phases?

**Date**: 2026-02-26

---

## 1. Current Cross-Boundary Violations

Every instance where the tech-lead's doctrine names, governs, or presupposes the internal structure of execution-lead:

### handoff-contract.md

| Line | Text | Violation |
|---|---|---|
| 30 | `outcome: running` | Names execution-lead's runtime state. A returned function is not "running." |
| 31-34 | `concrete first-phase progress evidence: files changed, verification commands run, outcomes` | Dictates what execution-lead's first internal phase produces. Names "first-phase" as a concept. |
| 36 | `or, if blocked at intake/preflight:` | Names two of execution-lead's internal phases ("intake" and "preflight") as observable states. |
| 46 | `execution-lead immediately runs execution stage unless blocked by a contract defect` | Prescribes when execution-lead acts internally. |
| 48 | `Intake/preflight pass alone is not a terminal return for execution-lead in this handoff.` | Governs what execution-lead's internal phases mean as return values. Presupposes "intake" and "preflight" are observable, nameable states. |
| 50 | `If blocked, ownership returns to tech-lead for correction or escalation.` | "Ownership returns" -- state-transition language. The function returned; there is nothing to transfer back. |

### process.md

| Line | Text | Violation |
|---|---|---|
| 69-71 | `Execution-lead behavior after invocation: proceed immediately with execution stage and attempt first execution phase work with evidence, or return blocked with explicit blocker ownership.` | Tech-lead's doctrine dictates execution-lead's internal behavior after invocation. Names "first execution phase" as an expected unit of work. |
| 77 | `handoff-result (running-with-evidence or blocked)` | `running-with-evidence` describes execution-lead's ongoing state. |

### pipeline.md

| Line | Text | Violation |
|---|---|---|
| 22 | `transfer record to execution owner (running or blocked)` | `running` as an output category names execution-lead's runtime state. |

### output-contract.md

| Line | Text | Violation |
|---|---|---|
| 25 | `transfer record outcome (tech-lead -> execution-lead: running-with-evidence \| blocked)` | `running-with-evidence` describes execution-lead's ongoing state as part of tech-lead's output format. |
| 26 | `project/item event ledger entries for intake, handoff, and escalation (if any)` | "intake" as a ledger event category -- but this one names tech-lead's own phase, not execution-lead's. Cross-boundary only in that it propagates the "intake" vocabulary into the shared artifact format. |

### team-contract.md

| Line | Text | Violation |
|---|---|---|
| 36 | `Delegate to specialists when intake packet passes preflight.` | Names tech-lead's own internal phases ("intake" and "preflight") as observable triggers for delegation. Not cross-boundary with execution-lead, but establishes the vocabulary that then leaks across the boundary in handoff-contract.md. |

### references/template.md

| Line | Text | Violation |
|---|---|---|
| 48 | `Transfer result: running-with-evidence \| blocked` | Bakes the status-like return value into the output artifact format. |
| 53-59 | `If running: files changed: ..., verification commands: ..., outcomes: ...` | Prescribes the structure of execution-lead's internal progress evidence as a section in tech-lead's output document. |

### orchestration.md

| Line | Text | Violation |
|---|---|---|
| 68 | `if ready: execution kickoff evidence summary (files changed, verification commands, outcomes) or explicit blocked return from execution-lead` | Prescribes what execution-lead's return must contain in terms of its internal work products. |

**Total cross-boundary violations: 14 instances across 6 files.**

---

## 2. The Function Call Analogy

When tech-lead invokes execution-lead, it is a function call:

```
result = execution_lead(technical_package)
```

The tech-lead provides arguments. Execution-lead returns a result. The call is synchronous from the contract's perspective -- when execution-lead returns, the interaction is over.

**What the caller (tech-lead) is entitled to know:**
- The argument type (what the handoff payload must contain)
- The return type (what execution-lead gives back)
- The error type (what a failure return looks like)

**What the caller is NOT entitled to know:**
- How execution-lead validates the payload internally
- What execution-lead calls its internal phases
- What order execution-lead does its work in
- What intermediate products execution-lead creates
- Whether execution-lead has an "intake" or "preflight" step

The current handoff-contract.md violates this in two fundamental ways:

**Violation A: Naming internal phases.** Lines 36 and 48 name "intake/preflight" as phases of execution-lead. This is the caller inspecting the callee's stack frames. The contract should specify what a valid return looks like, not what the callee does between invocation and return.

**Violation B: Requiring specific intermediate evidence.** Lines 31-34 require "first-phase progress evidence" including "files changed, verification commands run, outcomes." This dictates that execution-lead's first unit of work must produce file changes and verification results -- prescribing internal implementation. The tech-lead should specify what a successful return contains, not what specific internal work products must exist.

The distinction matters because it preserves execution-lead's autonomy. If execution-lead restructures its internal process (merges phases, reorders work, adds new validation steps), the handoff contract should not break. Currently it would, because the contract names specific internal phases.

---

## 3. Invocation Contract Design

The handoff is a function call. Here is the contract expressed as types:

### Arguments (what tech-lead provides)

```
HandoffPayload {
  active_item_workspace: path
  shaped_artifact: path
  technical_package: path
  plan: path
  test_specifications: path[]
  unresolved_decisions: decision[] | "none"
  accepted_risks: risk[] | "none"
  execution_worktree: path
}
```

This is the current "Required Handoff Payload" section (lines 9-18) and is already well-designed. No changes needed. It describes what tech-lead provides, not what execution-lead does with it.

### Return Type (what execution-lead gives back)

```
HandoffReturn =
  | Complete { evidence: ExecutionEvidence }
  | Blocked  { blockers: Blocker[], recommended_action: string }
```

Where `ExecutionEvidence` is opaque to tech-lead -- it is whatever execution-lead considers sufficient proof that real work occurred. Tech-lead does not prescribe its structure.

The key change: **no `running` state.** When execution-lead returns, it is done returning. The result is either `complete` (with evidence that work happened) or `blocked` (with structured blockers).

### What constitutes an error return

A `Blocked` return is an error. It contains:
- `blockers[]` -- each with ownership (who must fix it) and description
- `recommended_action` -- what execution-lead thinks should happen next

This is already close to what lines 38-40 describe. The fix is removing the "at intake/preflight" framing.

### What tech-lead does with each variant

**On `Complete`:**
- Tech-lead records the evidence in its technical package artifact
- Tech-lead returns `ready-for-execution` to its upstream caller
- The stage is done

**On `Blocked`:**
- Tech-lead examines blocker ownership
- If blockers are in tech-lead's domain (package defects): correct and re-invoke
- If blockers are in shaper's domain (product-framing defects): escalate upstream
- If blockers are in decision-owner's domain (strategic decisions): escalate

**On second `Blocked` for same invocation:**
- Escalate to decision owner with: blocked fields, impact on appetite, recommended options

### Retry semantics

- Maximum 2 re-invocations per handoff attempt
- Each re-invocation is an independent function call with corrected arguments (not a "correction cycle" within an ongoing interaction)
- After 2 failed re-invocations, escalate rather than retry

This is the content of the current "Escalation Rule" section (lines 52-57), which is already close. The change is framing: "re-invocations" not "correction cycles."

---

## 4. Handoff-Contract.md Rewrite Direction

### Sections that stay (with modification)

**"Required Handoff Payload" (lines 9-18):** Stays as-is. This correctly describes the arguments without naming execution-lead's internals.

**"Path Semantics" (lines 20-24):** Stays as-is. Correctly constrains how paths are interpreted without prescribing internal behavior.

**"Escalation Rule" (lines 52-57):** Stays with reframing. Replace "correction cycles" with "re-invocations."

### Sections that must be rewritten

**"Required Transfer Outcome" (lines 26-40):** This is the core violation. Complete rewrite.

Current:
```
Execution owner returns one of:

1. outcome: running
2. concrete first-phase progress evidence:
   - files changed
   - verification commands run
   - outcomes

or, if blocked at intake/preflight:

1. outcome: blocked
2. blockers[]: explicit blocker list with ownership
3. recommended_next_action
```

Proposed:
```
## Required Return

Execution-lead returns one of:

1. outcome: complete
   - evidence: structured proof that execution work occurred
   
2. outcome: blocked
   - blockers[]: explicit list with ownership per blocker
   - recommended_action: what should happen next

Validation-only returns are not complete. A complete return includes
evidence of execution work beyond input validation.
```

This says the same thing ("intake/preflight pass alone is not a terminal return") without naming execution-lead's internal phases. "Validation-only returns are not complete" sets the quality bar without prescribing how execution-lead organizes its validation.

**"Transfer Rule" (lines 42-50):** Rewrite to remove internal-phase references.

Current:
```
Execution ownership is transferred when payload fields are complete
and transfer is issued.

After transfer, execution-lead immediately runs execution stage unless
blocked by a contract defect.

Intake/preflight pass alone is not a terminal return for execution-lead
in this handoff.

If blocked, ownership returns to tech-lead for correction or escalation.
```

Proposed:
```
## Invocation Rule

Invocation is valid when all payload fields are complete.

Execution-lead returns a terminal result. A terminal result is either
complete-with-evidence or blocked-with-ownership. Validation-only
results are not terminal.

On a blocked return, tech-lead processes the blockers: correct the
payload and re-invoke, or escalate.
```

Changes:
- "Transfer" -> "Invocation" -- function-call language
- "ownership returns to tech-lead" -> "tech-lead processes the blockers" -- no ownership semantics
- "Intake/preflight pass alone" -> "Validation-only results" -- no internal phase names
- "immediately runs execution stage" removed -- prescribes internal behavior

### Section to rename

**"Contract" (lines 3-7):** The opening paragraph is fine. But consider renaming the file concept from "Handoff Contract" to "Invocation Contract" to reinforce the function-call model. The file itself can keep the name `handoff-contract.md` for continuity, but the `# Handoff Contract` heading could become `# Execution Invocation Contract`.

---

## 5. Boundary Preservation Principle

The core question: how do you express the quality bar without naming internal phases?

### The pattern

Replace phase names with outcome descriptions:

| Current (names phases) | Proposed (describes outcomes) |
|---|---|
| "Intake/preflight pass alone is not a terminal return" | "Validation-only results are not terminal" |
| "if blocked at intake/preflight" | "if blocked" (no need to say where) |
| "first-phase progress evidence" | "evidence of execution work" |
| "immediately runs execution stage" | (remove -- internal behavior) |
| `running-with-evidence` | `complete-with-evidence` |

### The principle stated

> The tech-lead specifies what a valid return looks like. It does not specify what internal work produces that return.

This is the same principle as honest function signatures from AGENTS.md: "A function's parameters tell you what it needs. Its return type tells you what it produces." The signature does not include the function's internal variables.

Concretely:
- **Allowed**: "A complete return includes evidence of execution work beyond input validation."
- **Not allowed**: "Intake/preflight pass alone is not a terminal return."
- **Allowed**: "Evidence must demonstrate that implementation-level work occurred (e.g., files modified, tests run)."
- **Not allowed**: "Concrete first-phase progress evidence: files changed, verification commands run, outcomes."

The first version of each pair describes the return's quality bar. The second version names the callee's internal structure.

The "e.g." in the allowed example is important: it gives examples of what evidence might look like without requiring specific internal products. Execution-lead decides how to structure its evidence.

---

## 6. Team-Contract.md Impact

### Line 36: delegation trigger

Current:
```
Delegate to specialists when intake packet passes preflight.
```

This names two of tech-lead's own internal phases. While this is not a cross-boundary violation (it's tech-lead describing its own internals), it establishes vocabulary that then leaks across the boundary. The audit found this same vocabulary appearing in handoff-contract.md applied to execution-lead.

Proposed:
```
Delegate to specialists after input validation passes.
```

Same meaning. No named phases. "Input validation" is a generic description of what happens, not a named milestone.

### Line 11: execution-lead as team member

Current:
```
execution-lead -- execution owner after package transfer.
```

This is fine. It names the role and the boundary. No internal-phase language.

### Line 38: delegation to execution-lead

Current:
```
Delegate to execution-lead only after package gates pass.
```

This is fine. "Package gates" describes the quality bar, not an internal phase.

---

## 7. Concrete Proposals

### Proposal A: handoff-contract.md "Required Transfer Outcome" rewrite

**File**: `doctrine/handoff-contract.md`
**Lines**: 26-40

**Current**:
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
```

**Proposed**:
```markdown
## Required Return

Execution-lead returns one of:

1. `outcome`: `complete`
   - `evidence`: structured proof that execution work occurred

2. `outcome`: `blocked`
   - `blockers[]`: explicit list with ownership per blocker
   - `recommended_action`: what should happen next

Validation-only returns are not complete. A complete return includes
evidence of execution work beyond input validation.
```

### Proposal B: handoff-contract.md "Transfer Rule" rewrite

**File**: `doctrine/handoff-contract.md`
**Lines**: 42-50

**Current**:
```markdown
## Transfer Rule

Execution ownership is transferred when payload fields are complete and transfer is issued.

After transfer, execution-lead immediately runs execution stage unless blocked by a contract defect.

Intake/preflight pass alone is not a terminal return for execution-lead in this handoff.

If blocked, ownership returns to `tech-lead` for correction or escalation.
```

**Proposed**:
```markdown
## Invocation Rule

Invocation is valid when all payload fields are complete.

Execution-lead returns a terminal result. A terminal result is either complete-with-evidence or blocked-with-ownership. Validation-only results are not terminal.

On a blocked return, tech-lead processes the blockers: correct the payload and re-invoke, or escalate.
```

### Proposal C: handoff-contract.md "Escalation Rule" reframe

**File**: `doctrine/handoff-contract.md`
**Lines**: 52-57

**Current**:
```markdown
## Escalation Rule

If two correction cycles fail to clear transfer blockers, escalate to decision owner with:
```

**Proposed**:
```markdown
## Escalation Rule

If two re-invocations fail to clear blockers, escalate to decision owner with:
```

Remainder of section stays as-is.

### Proposal D: process.md lines 69-71 -- remove internal behavior prescription

**File**: `doctrine/process.md`
**Lines**: 69-71

**Current**:
```markdown
Execution-lead behavior after invocation:
- proceed immediately with execution stage and attempt first execution phase work with evidence, or
- return `blocked` with explicit blocker ownership.
```

**Proposed**:
```markdown
Execution-lead returns either:
- `complete` with evidence of execution work, or
- `blocked` with explicit blocker ownership.
```

### Proposal E: process.md line 77 -- replace `running-with-evidence`

**File**: `doctrine/process.md`
**Line**: 77

**Current**:
```markdown
- `handoff-result` (`running-with-evidence` or `blocked`)
```

**Proposed**:
```markdown
- `handoff-result` (`complete-with-evidence` or `blocked`)
```

### Proposal F: pipeline.md line 22 -- replace `running`

**File**: `doctrine/pipeline.md`
**Line**: 22

**Current**:
```markdown
- transfer record to execution owner (`running` or `blocked`)
```

**Proposed**:
```markdown
- transfer record to execution owner (`complete` or `blocked`)
```

### Proposal G: output-contract.md line 25 -- replace `running-with-evidence`

**File**: `doctrine/output-contract.md`
**Line**: 25

**Current**:
```markdown
12. transfer record outcome (`tech-lead -> execution-lead`: `running-with-evidence` | `blocked`)
```

**Proposed**:
```markdown
12. transfer record outcome (`tech-lead -> execution-lead`: `complete-with-evidence` | `blocked`)
```

### Proposal H: output-contract.md line 26 -- remove "intake" from ledger categories

**File**: `doctrine/output-contract.md`
**Line**: 26

**Current**:
```markdown
13. project/item event ledger entries for intake, handoff, and escalation (if any)
```

**Proposed**:
```markdown
13. project/item event ledger entries for handoff and escalation (if any)
```

### Proposal I: orchestration.md line 68 -- remove evidence structure prescription

**File**: `doctrine/orchestration.md`
**Line**: 68

**Current**:
```markdown
3. if ready: execution kickoff evidence summary (files changed, verification commands, outcomes) or explicit `blocked` return from execution-lead
```

**Proposed**:
```markdown
3. if ready: execution evidence summary from execution-lead, or explicit `blocked` return with blocker ownership
```

### Proposal J: team-contract.md line 36 -- remove phase names

**File**: `doctrine/team-contract.md`
**Line**: 36

**Current**:
```markdown
- Delegate to specialists when intake packet passes preflight.
```

**Proposed**:
```markdown
- Delegate to specialists after input validation passes.
```

### Proposal K: references/template.md -- rewrite handoff section

**File**: `references/template.md`
**Lines**: 44-59

**Current**:
```markdown
## Handoff

- Target execution owner: execution-lead
- Execution worktree path:
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

**Proposed**:
```markdown
## Handoff

- Target execution owner: execution-lead
- Execution worktree path:
- Result: complete-with-evidence | blocked

If complete:
- Evidence summary:
  -

If blocked:
- Blockers:
  -
- Recommended next action:
```

### Proposal L: references/template.md line 11 -- rename section

**File**: `references/template.md`
**Line**: 11

**Current**:
```markdown
## Intake Summary
```

**Proposed**:
```markdown
## Shaped Context
```

The contents (appetite, no-gos, open assumptions) stay the same. Only the heading changes.

---

## Summary of Key Proposals

1. **Replace `running` / `running-with-evidence` with `complete` / `complete-with-evidence` everywhere** (6 locations). A returned function is not "running."

2. **Remove all references to execution-lead's internal phases** ("intake," "preflight," "first-phase") from tech-lead's doctrine (3 locations in handoff-contract.md, 1 in process.md).

3. **Express the quality bar as outcome requirements, not phase requirements.** "Validation-only returns are not complete" instead of "intake/preflight pass alone is not a terminal return." Same constraint, no internal-phase leakage.

4. **Replace "correction cycles" with "re-invocations"** to frame retries as independent function calls, not stateful back-and-forth.

5. **Stop prescribing execution-lead's evidence structure.** Say "evidence of execution work" instead of "files changed, verification commands run, outcomes." Execution-lead decides its evidence format.

6. **Rename "Intake Summary" to "Shaped Context"** in the output template. The content is the same; the name stops propagating the "intake" vocabulary.

7. **Replace "Transfer Rule" with "Invocation Rule"** in handoff-contract.md. Function-call framing, not ownership-transfer framing.
