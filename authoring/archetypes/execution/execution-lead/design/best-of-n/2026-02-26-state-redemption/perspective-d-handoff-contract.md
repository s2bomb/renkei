# Perspective D: Handoff Contract Redesign

Analytical lens: the handoff contract as a function type signature.

---

## 1. Current Contract Problems

The audit (findings 12-16) identifies five problematic elements in `doctrine/handoff-contract.md`. I analyze each against the function model.

### Problem 1: "transfer" as state transition (Finding 12, line 5)

**Current**: `This contract governs transfer from 'tech-lead' (technical-preparation owner) to 'execution-lead' (execution owner).`

"Transfer" models two persistent entities passing a baton -- an observable event where ownership crosses a boundary. This is state-transition vocabulary. In the function model, there is no baton. `tech-lead` calls `execution-lead` with arguments. `execution-lead` does its work. `execution-lead` returns a value. Ownership is implicit in the call stack: the callee owns the work for the duration of its execution. No ceremony required.

The word "governs" is also problematic. A function signature does not "govern" anything -- it *defines* what goes in and what comes out. Governance implies ongoing supervision; a signature is a one-time declaration.

### Problem 2: "Intake/preflight pass is non-terminal" patch (Finding 13, line 31)

**Current**: `Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.`

This line exists solely because "Intake" and "Preflight" are named as steps in `process.md` (Steps 1 and 2). The named steps create the possibility of reporting their completion. This line patches that possibility by saying "don't do that." The patch is correct in intent but self-defeating in form: it reinforces the existence of the very concepts it is trying to suppress.

Under a function model, input validation and precondition checking are the first lines of the function body. They are not steps the function "passes through." A function either validates its inputs and proceeds, or fails fast and returns an error. There is no intermediate state to suppress because there is no intermediate state to name.

### Problem 3: "intake is blocked" treating intake as stateful (Finding 14, lines 43, 47)

**Current**: `If intake is blocked, ownership returns to 'tech-lead'.` and `If two correction cycles fail to clear intake blockers`

Two issues. First, "intake is blocked" treats intake as a thing that has states (blocked/unblocked). Under the function model, either input validation passed or it failed. "Blocked" is a return value, not a state of a named subprocess.

Second, "two correction cycles" implies the function remembers previous invocations. Functions are stateless. If the caller gets back an error, the caller decides whether to fix the inputs and call again. Retry policy belongs to the caller, not the callee. Embedding retry semantics in the callee's contract conflates the function's responsibility (validate and return) with the caller's responsibility (decide when to retry and when to escalate).

However, there is a nuance: the retry limit is operationally useful as a *convention* -- it tells `tech-lead` "if I return `blocked` twice, escalate rather than trying a third time." This belongs in the caller's contract (tech-lead's doctrine), not in execution-lead's handoff contract.

### Problem 4: "Required Intake Payload" naming (Finding 15, line 9)

**Current**: `## Required Intake Payload`

"Intake" names a process. "Payload" is fine but vague -- it could mean the data carried by a network packet, a message body, etc. In the function model, these are the function's required parameters. The section should be named for what it is: the list of arguments the caller must provide.

### Problem 5: "Execution ownership transfers" (Finding 16, line 41)

**Current**: `Execution ownership transfers when handoff payload fields are complete and invocation occurs.`

"Ownership transfers" is ceremony language. In the function model, the callee owns its work from the moment it is called until it returns. There is no transfer event -- ownership is an automatic consequence of invocation. You don't say "the function owns the computation when it is called." It just does.

---

## 2. The Function Signature Model

A handoff contract IS a function signature. The current document conflates the signature with process narrative, state transitions, and retry governance. Here is what the contract should express, and only what it should express:

### Parameters (Required Input Fields)

These are the arguments `tech-lead` must provide. The current "Required Intake Payload" section gets this right in substance (9 fields). The content stays; the framing changes.

```
execute_stage(
  active_item_workspace: Path,
  shaped_artifact: Path,
  technical_package: Path,
  plan: Path,
  test_specifications: Path[],
  unresolved_decisions: List,
  accepted_risks: List,
  execution_worktree: Path,
  handoff_issuer: Role = "tech-lead"
)
```

### Preconditions

What must be true for the function to proceed. These are not steps; they are assertions checked at the top of the function body.

1. All required parameters are present and non-empty.
2. `handoff_issuer` is `tech-lead` unless an explicit decision-owner override exists.
3. Member artifacts from technical-preparation specialists are aggregated by `tech-lead` -- no direct cross-team input.

### Return Type (Success)

What execution-lead returns when work completes:

```
StageOutcome {
  outcome: "complete" | "blocked" | "escalated",
  evidence: EvidenceBundle,
  unresolved_issues: List | "none",
  escalations: List | "none",
  recommended_next_decision: string,
  ledger_entries: LedgerEvent[]
}
```

This is defined in `output-contract.md`. The handoff contract should reference it, not duplicate it.

### Error Type (Validation Failure)

What execution-lead returns when input validation fails:

```
ValidationError {
  outcome: "blocked",
  blockers: Blocker[],
  recommended_next_action: string
}
```

This is the fast-fail path. The function checks its preconditions, finds them unsatisfied, and returns immediately with the specific missing fields.

### Path Semantics

How path arguments are interpreted. This section is clean in the current contract and carries over unchanged.

---

## 3. "Transfer" Elimination

"Transfer" appears in four places in handoff-contract.md:

| Line | Current | Problem |
|---|---|---|
| 5 | "governs transfer from" | State transition between persistent entities |
| 27 | "Required Transfer Outcome" | Names a transition event with its own outcome |
| 39 | "Transfer Rule" | Governance section for a state transition |
| 41 | "Execution ownership transfers" | Ceremony language for automatic consequence |

**Replacement vocabulary:**

| Anti-pattern | Function-model replacement |
|---|---|
| "transfer" (noun) | "invocation" |
| "transfer from X to Y" | "invocation of Y by X" |
| "transfer outcome" | "return value" or simply drop (the outcome IS the return) |
| "ownership transfers" | "execution-lead owns all work from invocation to return" |
| "governs transfer" | "defines the invocation interface" |

The key insight: "transfer" models a physical event (handing a package from one person to another). "Invocation" models what actually happens (one function calls another with arguments). The physical metaphor introduces state (the package exists independently and can be "in transit"), while invocation is instantaneous -- the callee has the arguments the moment it starts executing.

---

## 4. The "Required Intake Payload" Rename

Three candidates:

1. **"Required Parameters"** -- accurate, direct, uses function vocabulary. Slight downside: "parameters" is a programming term that may feel foreign in a doctrine article.
2. **"Invocation Arguments"** -- more precise technically (arguments are the values passed at the call site; parameters are the declared names). But the distinction is pedantic here.
3. **"Required Input Fields"** -- the audit's recommendation. Clear, accessible, no jargon. "Input" is universally understood. "Fields" matches the list format.

**Position: "Required Input Fields."**

Reasoning: The handoff contract is read by agents that are constitutionally charged, not by compilers. The function model is the conceptual frame; the vocabulary should be accessible. "Required Input Fields" says exactly what the section contains without requiring familiarity with programming terminology. It also matches the audit's recommended phrasing ("intake contract fields" -> "required input fields"), which means the replacement is consistent across all files.

---

## 5. Patch Language Removal

The patch at line 31 is: `Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.`

This patch exists because:
1. `process.md` names "Intake" (Step 1) and "Preflight" (Step 2) as titled steps.
2. Agents predictably try to return after completing named steps.
3. The patch says "don't do that."

In the redesigned contract, the patch becomes unnecessary because:

1. There are no named phases to complete. The contract defines *preconditions* (checked at the top of the function body) and a *return type* (the terminal outcome). There is nothing between them that has a name.
2. The "Required Return Value" section (replacing "Required Transfer Outcome") defines what the function returns. It includes two shapes: the success return (evidence + outcome) and the error return (blocked + blockers). Neither shape contains a "passed validation" intermediate.
3. The *only* valid returns are the terminal outcome or the validation error. The contract does not need to say "don't return X" because X has no name and no structural slot in the return type.

This is the structural fix the audit calls for: removing the names removes the need for the patch.

---

## 6. Relationship to output-contract.md

The handoff contract and output contract together form the complete function signature:

```
handoff-contract.md  = Parameters + Preconditions + Error Type
output-contract.md   = Return Type + Quality Gates + Output Format
```

### Current coupling problems

1. **Duplicated return definition.** Handoff-contract.md lines 33-37 define a blocked-return shape. Output-contract.md line 25 defines `execution outcome: complete | blocked | escalated`. These should not both define the return type independently.

2. **"Intake" in output-contract.md.** Line 27: `project/item event ledger entries for intake, stage outcome, and escalation (if any)`. Line 33: `Intake contract fields are complete and stage started`. Both reference intake as a named concept with reporting obligations. Per the audit (findings 7, 8), these need cleanup.

3. **No cross-reference.** Neither document references the other. A reader of handoff-contract.md has no idea that output-contract.md defines the success return shape. A reader of output-contract.md has no idea that handoff-contract.md defines the error return shape.

### Required changes to output-contract.md

1. **Remove "intake" from ledger entries requirement** (line 27). Change to: `project/item event ledger entries for stage outcome and escalation (if any)`.

2. **Remove "intake contract fields are complete and stage started" quality gate** (line 33). Change to: `Required input fields are present` -- drop "and stage started" entirely. If the function is producing output, it started.

3. **Add a reference to handoff-contract.md** at the top of output-contract.md. Something like: `Input fields and preconditions are defined in handoff-contract.md. This document defines the return value.`

4. **The handoff contract should reference output-contract.md** for the success return shape. The error return (blocked on validation) is defined in the handoff contract because it is part of the invocation interface -- the caller needs to know what a fast-fail looks like. The success return is defined in output-contract.md because it describes the full evidence bundle.

### The complete signature, split across two documents

```
handoff-contract.md:
  - Required input fields (parameters)
  - Preconditions
  - Path semantics (how path parameters are interpreted)
  - Validation failure return (error type)
  - Escalation convention (when validation fails repeatedly)

output-contract.md:
  - Success return type (execution-stage report)
  - Required report fields
  - Quality gates (postconditions)
  - Completion report format
```

This split is clean: handoff-contract owns the input side and the fast-fail error; output-contract owns the success output and its quality constraints. Neither duplicates the other.

---

## 7. Concrete Replacement Text

### Section-by-section replacement for handoff-contract.md

---

#### Section: Opening (line 1-7)

**Before:**
```markdown
# Handoff Contract

## Contract

This contract governs transfer from `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates first.
```

**After:**
```markdown
# Handoff Contract

## Invocation Interface

This contract defines the invocation interface for `execution-lead`. The caller is `tech-lead`.

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates before invocation.

For the return value on successful execution, see output-contract.md.
```

**Rationale:** "Governs transfer" -> "defines the invocation interface." Added cross-reference to output-contract.md. Preserved the aggregation rule (it is a real constraint, not state vocabulary).

---

#### Section: Required Intake Payload (lines 9-19)

**Before:**
```markdown
## Required Intake Payload

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list
8. execution worktree path (code-change target)
9. handoff issuer role (`tech-lead` unless explicit decision-owner override)
```

**After:**
```markdown
## Required Input Fields

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list
8. execution worktree path (code-change target)
9. handoff issuer role (`tech-lead` unless explicit decision-owner override)
```

**Rationale:** Only the heading changes. The field list is correct and complete. "Required Input Fields" names what the section contains without referencing a named process.

---

#### Section: Path Semantics (lines 21-25)

**Before:**
```markdown
## Path Semantics

- Planning/package artifacts are read from the paths supplied in the handoff payload.
- Execution worktree path is used for code and test implementation activity.
- Do not rebase planning artifact paths into execution worktree unless explicitly instructed.
```

**After:**
```markdown
## Path Semantics

- Planning and package artifacts are read from the paths supplied in the input fields.
- Execution worktree path is used for code and test implementation activity.
- Do not rebase planning artifact paths into execution worktree unless explicitly instructed.
```

**Rationale:** "handoff payload" -> "input fields." Minor vocabulary alignment. Content unchanged.

---

#### Section: Required Transfer Outcome (lines 27-37)

**Before:**
```markdown
## Required Transfer Outcome

Execution owner starts immediately when intake contract fields are complete.

Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.

If intake contract is incomplete, return:

1. `outcome`: `blocked`
2. `blockers[]`: explicit blocker list with ownership
3. `recommended_next_action`
```

**After:**
```markdown
## Return Contract

Execution starts immediately when required input fields are present.

On success, return the execution-stage report defined in output-contract.md.

If input validation fails, return:

1. `outcome`: `blocked`
2. `blockers[]`: explicit missing fields with ownership
3. `recommended_next_action`
```

**Rationale:** Three changes. First, the heading changes from "Required Transfer Outcome" to "Return Contract" -- no transfer, no named process, just the return definition. Second, "intake contract fields" -> "required input fields." Third, the patch line (`Intake/preflight pass is non-terminal...`) is removed entirely. It is unnecessary because there are no named phases to suppress. The two return shapes (success -> output-contract.md, validation failure -> blocked) cover all cases. There is no structural slot for "I passed validation" as a return value.

---

#### Section: Transfer Rule (lines 39-43)

**Before:**
```markdown
## Transfer Rule

Execution ownership transfers when handoff payload fields are complete and invocation occurs.

If intake is blocked, ownership returns to `tech-lead`.
```

**After:**
```markdown
## Ownership

Execution-lead owns all work from invocation to return.

If input validation fails, the caller (`tech-lead`) retains ownership and decides whether to correct and reinvoke.
```

**Rationale:** "Transfer Rule" -> "Ownership." The "transfer" event is eliminated; ownership is a consequence of invocation, not a separate event. "Intake is blocked" -> "input validation fails." Retry responsibility is explicitly assigned to the caller.

---

#### Section: Escalation Rule (lines 45-51)

**Before:**
```markdown
## Escalation Rule

If two correction cycles fail to clear intake blockers, escalate to decision owner with:

- blocked fields
- impact on appetite and delivery integrity
- recommended options
```

**After:**
```markdown
## Escalation Convention

If input validation fails after two invocation attempts, escalate to decision owner with:

- missing or invalid fields
- impact on appetite and delivery integrity
- recommended options
```

**Rationale:** "Escalation Rule" -> "Escalation Convention" (it is a convention, not a rule enforced by the callee). "Correction cycles" -> "invocation attempts" (the caller corrects and reinvokes; the callee does not track cycles). "Intake blockers" -> "input validation" language.

Note: One could argue this section should move entirely to tech-lead's contract, since retry policy is the caller's responsibility. I keep it here as a convention -- it tells both parties what the expected escalation threshold is. But it is framed as a convention, not as logic the callee executes.

---

### Complete replacement document

```markdown
# Handoff Contract

## Invocation Interface

This contract defines the invocation interface for `execution-lead`. The caller is `tech-lead`.

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates before invocation.

For the return value on successful execution, see output-contract.md.

## Required Input Fields

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list
8. execution worktree path (code-change target)
9. handoff issuer role (`tech-lead` unless explicit decision-owner override)

## Path Semantics

- Planning and package artifacts are read from the paths supplied in the input fields.
- Execution worktree path is used for code and test implementation activity.
- Do not rebase planning artifact paths into execution worktree unless explicitly instructed.

## Return Contract

Execution starts immediately when required input fields are present.

On success, return the execution-stage report defined in output-contract.md.

If input validation fails, return:

1. `outcome`: `blocked`
2. `blockers[]`: explicit missing fields with ownership
3. `recommended_next_action`

## Ownership

Execution-lead owns all work from invocation to return.

If input validation fails, the caller (`tech-lead`) retains ownership and decides whether to correct and reinvoke.

## Escalation Convention

If input validation fails after two invocation attempts, escalate to decision owner with:

- missing or invalid fields
- impact on appetite and delivery integrity
- recommended options
```

---

## Summary of Changes

| Element | Before | After | Why |
|---|---|---|---|
| Document frame | "governs transfer" | "defines invocation interface" | Function call, not state transition |
| Section: Required Intake Payload | Named process | "Required Input Fields" | Parameters, not a named subprocess |
| Section: Required Transfer Outcome | Transfer outcome with patch | "Return Contract" with two shapes | Eliminates named phases and the patch that suppresses them |
| Patch line | "Intake/preflight pass is non-terminal" | Removed | No named phases = no need to suppress them |
| Section: Transfer Rule | "Ownership transfers" | "Ownership" as consequence of invocation | Ownership is automatic, not ceremonial |
| Section: Escalation Rule | "Correction cycles clear intake blockers" | "Invocation attempts" + caller responsibility | Retry is caller logic; convention, not callee rule |
| Cross-reference | None | Points to output-contract.md for success return | The two documents are halves of one signature |
| "intake" occurrences | 6 in the file | 0 | Word eliminated; replaced with "input validation" or "input fields" |
| "transfer" occurrences | 4 in the file | 0 | Word eliminated; replaced with "invocation" or dropped |

### Cascade: Required output-contract.md changes

1. Line 27: `for intake, stage outcome` -> `for stage outcome` (remove intake ledger event)
2. Line 33: `Intake contract fields are complete and stage started` -> `Required input fields are present` (remove intake naming and "stage started" state language)
3. Add opening reference: `Input fields and preconditions are defined in handoff-contract.md.`
