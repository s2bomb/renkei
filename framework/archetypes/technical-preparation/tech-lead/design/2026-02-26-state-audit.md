# State Anti-Pattern Audit: tech-lead

**Date**: 2026-02-26
**Scope**: All markdown files in `doctrine/`, `references/`, `ethos/` for the `tech-lead` archetype.
**Auditor**: Claude (research-only, no edits to source files)

---

## Summary

The tech-lead archetype has significant stateful anti-pattern contamination concentrated in its doctrine layer. The ethos layer is clean. The reference template propagates doctrine problems into the output artifact format.

**Severity by file:**

| File | Findings | Severity |
|---|---|---|
| `doctrine/process.md` | 8 | High -- "Intake" and "Preflight" are named reportable phases; status-like return values; acknowledgment semantics |
| `doctrine/handoff-contract.md` | 5 | High -- `running` as a return value; "intake/preflight" as named states of execution-lead |
| `doctrine/pipeline.md` | 1 | Medium -- `running` as an output category |
| `doctrine/output-contract.md` | 3 | Medium -- `running-with-evidence` as transfer outcome; intake/handoff ledger entries |
| `doctrine/orchestration.md` | 2 | Low-Medium -- "Intake chat" as a named concept; intake context dependency |
| `doctrine/team-contract.md` | 2 | Low-Medium -- "intake" and "preflight" as named delegation triggers |
| `references/template.md` | 2 | Medium -- "Intake Summary" section; `running-with-evidence` as transfer result |
| `ethos/identity.md` | 0 | Clean |
| `ethos/tenets.md` | 0 | Clean |
| `ethos/principles.md` | 0 | Clean |

**Total findings: 23**

---

## Per-File Findings

---

### `doctrine/process.md`

This file is the primary source of contamination. It structures the entire tech-lead workflow as a sequence of named, numbered phases -- each of which becomes an externally visible milestone.

#### Finding 1: "Intake" as a named phase
- **Lines**: 3, 5, 11, 12
- **Text**:
  - Line 3: `## Step 1: Intake Active Shape`
  - Line 5: `1. Receive active item context from shaper:`
  - Line 11: `3. Append intake event to project and item ledgers (handoff-received, actor: tech-lead).`
  - Line 12: `4. Stop if intake packet is incomplete.`
- **Anti-pattern**: #6 (Intake as named concept), #1 (Named phase as reportable state)
- **Problem**: "Intake" is parameter validation and context loading. Naming it "Step 1: Intake Active Shape" elevates it to a reportable milestone. The ledger append at line 11 makes it externally visible -- the function is reporting that it received its input.
- **Function model**: Parameter validation is invisible. The function either has valid input and proceeds, or it returns an error. No ledger entry for "I received my arguments."

#### Finding 2: "Preflight" as a named phase
- **Lines**: 14-22
- **Text**:
  - Line 14: `## Step 2: Preflight Quality Gate`
  - Line 16: `Verify shaped intent is execution-preparable:`
- **Anti-pattern**: #1 (Named phase as reportable state), #5 (State transition vocabulary)
- **Problem**: "Preflight" is input validation -- checking that the shaped artifact meets quality requirements. This is what happens inside a function before it does work. Naming it "Step 2" makes it a reportable milestone between "Intake" and "Orchestrate." The agent can now report "I'm in preflight" as a status.
- **Function model**: Input validation is part of parameter processing. It either passes (function proceeds) or fails (function returns error with defect details). It is not a named state.

#### Finding 3: Acknowledgment semantics via ledger events
- **Line**: 11
- **Text**: `Append intake event to project and item ledgers (handoff-received, actor: tech-lead).`
- **Anti-pattern**: #3 (Acknowledgment semantics)
- **Problem**: `handoff-received` is an acknowledgment. The function is saying "I received the handoff." Functions do not acknowledge receipt of their arguments. They process them and return results.
- **Function model**: No `handoff-received` event. The function was called; it will return a result or an error. The call itself is the evidence of receipt.

#### Finding 4: "Transfer" as a named phase
- **Lines**: 63-77
- **Text**:
  - Line 63: `## Step 6: Transfer to Execution Owner`
  - Line 75: `Append transfer events to project and item ledgers:`
  - Line 76: `- handoff-issued (to execution-lead)`
  - Line 77: `- handoff-result (running-with-evidence or blocked)`
- **Anti-pattern**: #1 (Named phase as reportable state), #2 (Status-like return values)
- **Problem**: "Transfer" is the function calling another function and returning the combined result. Making it "Step 6" creates a reportable state. The ledger entries `handoff-issued` and `handoff-result` are acknowledgment/status pairs -- the function is narrating its own execution rather than just returning.
- **Function model**: The function calls `execution-lead` as part of its work and returns the final outcome. No intermediate "I issued a handoff" event.

#### Finding 5: `running-with-evidence` as a return value
- **Line**: 77
- **Text**: `handoff-result (running-with-evidence or blocked)`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: `running-with-evidence` implies the execution-lead is still running. A function that has returned cannot be "running." This is a status report from an ongoing process, not a terminal return value.
- **Function model**: The return should be `ready-for-execution | blocked`. If execution-lead has started and produced evidence, that evidence is part of the return payload -- not a status label.

#### Finding 6: Named step sequence creates state machine
- **Lines**: 3, 14, 24, 39, 50, 63, 79
- **Text**: Steps 1-7 as named, numbered phases
- **Anti-pattern**: #5 (State transition vocabulary), #4 (Intermediate progress reporting)
- **Problem**: Seven named steps create seven externally reportable positions. An agent asked "where are you?" can answer with a step number and name. This is a state machine with named transitions, not a function.
- **Function model**: Internal work order is an implementation detail. The function's contract is: input (shaped artifact + context) -> output (technical package | error). The internal sequence is invisible to callers.

#### Finding 7: `blocked` as intermediate state
- **Line**: 48
- **Text**: `mark stage blocked and escalate`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: "Mark stage blocked" implies the function transitions to a `blocked` state and then does something else (escalate). In the function model, `blocked` is a terminal return value with blocker details, not a state to mark.
- **Function model**: Return `{ outcome: "blocked", blockers: [...], escalation: {...} }`. No marking. No state.

#### Finding 8: Ledger events as intermediate progress
- **Lines**: 11, 75-77, 86
- **Text**: Multiple ledger append instructions throughout the process
- **Anti-pattern**: #4 (Intermediate progress reporting)
- **Problem**: Ledger entries at intake, transfer, and escalation points create an externally visible trace of the function's internal progress. An observer can watch the ledger and know which "step" the function is in.
- **Function model**: A function may produce output that includes an event log as part of its return value. But it should not be appending to external state at intermediate points during execution.

---

### `doctrine/handoff-contract.md`

#### Finding 1: `running` as a transfer outcome
- **Line**: 30
- **Text**: `1. outcome: running`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: `running` is a status, not a terminal outcome. It says "execution-lead has started and is still going." A function that has returned is not "running." This is the core anti-pattern: treating agent invocation as launching a process rather than calling a function.
- **Function model**: The outcome should describe what was produced, not what is happening. `ready-for-execution` or `executing-with-evidence` (with the evidence included) are terminal descriptions. Or simply return the evidence payload directly.

#### Finding 2: "intake/preflight" as named states of execution-lead
- **Lines**: 36, 48
- **Text**:
  - Line 36: `or, if blocked at intake/preflight:`
  - Line 48: `Intake/preflight pass alone is not a terminal return for execution-lead in this handoff.`
- **Anti-pattern**: #6 (Intake as named concept), #1 (Named phases as reportable states)
- **Problem**: This contract tells execution-lead that it has named internal phases ("intake" and "preflight") and then governs what those phases mean as return values. The tech-lead is dictating the internal structure of execution-lead's function. Line 48 explicitly says "completing intake/preflight is not enough" -- which presupposes intake/preflight are observable states.
- **Function model**: The contract should say: "execution-lead must return either a complete result with evidence or a blocked status with blockers. Partial validation alone is not a complete result." No need to name execution-lead's internal phases.

#### Finding 3: Acknowledgment structure in transfer
- **Lines**: 28-40
- **Text**: The entire "Required Transfer Outcome" section
- **Anti-pattern**: #3 (Acknowledgment semantics)
- **Problem**: The structure is: tech-lead issues handoff -> execution-lead acknowledges with `running` or `blocked`. This is a request-acknowledgment pattern. The function model is: tech-lead calls execution-lead -> execution-lead returns result.
- **Function model**: execution-lead returns `{ outcome: "complete" | "blocked", evidence?: {...}, blockers?: [...] }`. No acknowledgment step.

#### Finding 4: `blocked` implies state transition
- **Line**: 50
- **Text**: `If blocked, ownership returns to tech-lead for correction or escalation.`
- **Anti-pattern**: #5 (State transition vocabulary)
- **Problem**: "Ownership returns" describes a state transition -- ownership was with execution-lead, now it transitions back. In the function model, execution-lead returned `blocked` and tech-lead processes that return value. There is no ownership to transfer back; the function returned.
- **Function model**: execution-lead returned an error result. tech-lead handles the error (retry, fix, escalate). No ownership semantics.

#### Finding 5: Correction cycles imply ongoing interaction
- **Lines**: 54-57
- **Text**: `If two correction cycles fail to clear transfer blockers, escalate`
- **Anti-pattern**: #4 (Intermediate progress reporting)
- **Problem**: "Correction cycles" implies a back-and-forth stateful interaction between tech-lead and execution-lead. In the function model, each call to execution-lead is an independent function call with potentially corrected inputs. This is retry logic, not cycles.
- **Note**: This is a mild instance. Retry logic is legitimate. The concern is that "correction cycles" implies a conversational state rather than independent retries. Borderline -- included for completeness.

---

### `doctrine/pipeline.md`

#### Finding 1: `running` as output category
- **Line**: 22
- **Text**: `transfer record to execution owner (running or blocked)`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: Same as handoff-contract finding 1. `running` is a status, not a terminal output. The pipeline document defines the tech-lead's outputs, and one of them is a status report saying the downstream agent is "running."
- **Function model**: The output should be the terminal result: `ready-for-execution | blocked`, or the result payload from execution-lead if it was invoked.

**Otherwise clean.** The pipeline position diagram and boundary rules are good function-model descriptions.

---

### `doctrine/output-contract.md`

#### Finding 1: `running-with-evidence` as transfer outcome
- **Line**: 25
- **Text**: `transfer record outcome (tech-lead -> execution-lead: running-with-evidence | blocked)`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: `running-with-evidence` is a status description of an ongoing process. It says "execution-lead is running and has produced some evidence." A terminal return value should describe what was produced, not what is currently happening.
- **Function model**: `complete-with-evidence | blocked`. Or simply include the evidence in the return payload without a status label.

#### Finding 2: Intake event in ledger entries
- **Line**: 26
- **Text**: `project/item event ledger entries for intake, handoff, and escalation (if any)`
- **Anti-pattern**: #6 (Intake as named concept), #3 (Acknowledgment semantics)
- **Problem**: "Intake" appears as a required ledger event category in the output contract. This means the function's output must include evidence that it acknowledged receipt of its input.
- **Function model**: The output includes what was produced and any events that matter to downstream consumers. "I received my input" is not one of those events.

#### Finding 3: `ready-for-execution | blocked` (correct pattern noted)
- **Line**: 47
- **Text**: `Outcome: ready-for-execution | blocked`
- **Note**: This is actually the correct pattern. The completion report uses proper terminal outcomes. This creates an inconsistency with line 25 which uses `running-with-evidence`.

---

### `doctrine/orchestration.md`

#### Finding 1: "Intake chat" as named concept
- **Line**: 7
- **Text**: `Intake chat is not a completion state.`
- **Anti-pattern**: #6 (Intake as named concept)
- **Problem**: "Intake chat" names an observable state -- the agent sitting in a conversational mode after receiving input but before doing work. The statement correctly says this is not a completion state, which is good intent. But the fact that "intake chat" has a name means it is a recognized, observable state.
- **Function model**: No need to prohibit "intake chat" if the function model is correct. A function cannot be in a chat state. It was called, it runs, it returns. The prohibition reveals that the underlying model still allows for conversational states.

#### Finding 2: "intake context" as dependency condition
- **Line**: 25
- **Text**: `spec-writer and research-codebase may run in parallel when intake context is complete.`
- **Anti-pattern**: #6 (Intake as named concept)
- **Problem**: "When intake context is complete" treats intake as a phase that completes at a knowable point, after which the next phase begins. This is state-transition language.
- **Function model**: "spec-writer and research-codebase may run in parallel" -- the dependency is on having valid input, not on a phase completing. The input is either valid when the function is called or it is not.
- **Note**: This is a mild instance. The intent (parallelism after validation) is correct. The language leaks the phase model.

**Partially clean.** The orchestration file's delegation protocol, specialist set, return contracts, and quality gate rules are solid function-model descriptions. The verbatim propagation section is excellent.

---

### `doctrine/team-contract.md`

#### Finding 1: "intake" as delegation trigger
- **Line**: 36
- **Text**: `Delegate to specialists when intake packet passes preflight.`
- **Anti-pattern**: #6 (Intake as named concept), #1 (Named phase as reportable state)
- **Problem**: "intake packet passes preflight" names two phases (intake, preflight) and a transition between them. Delegation happens after a state transition from intake to post-preflight.
- **Function model**: "Delegate to specialists after input validation passes." No named phases.

#### Finding 2: "preflight" as a named gate
- **Line**: 36
- **Text**: Same as above -- `passes preflight`
- **Anti-pattern**: #1 (Named phase as reportable state)
- **Problem**: "Preflight" is input validation. Naming it gives it identity as a reportable milestone.
- **Function model**: Input validation. Not named.

**Otherwise clean.** The topology, role boundaries, and handoff direction sections are good.

---

### `references/template.md`

#### Finding 1: "Intake Summary" as a named section
- **Line**: 11
- **Text**: `## Intake Summary`
- **Anti-pattern**: #6 (Intake as named concept)
- **Problem**: The output template includes a section called "Intake Summary" which captures appetite, no-gos, and open assumptions. This is the shaped context that was the function's input. Naming it "Intake Summary" in the output artifact perpetuates intake as a named concept.
- **Function model**: This section contains the input context. Call it "Input Context" or "Shaped Context" or "Source Constraints." The information is legitimate; the name propagates the anti-pattern.

#### Finding 2: `running-with-evidence` as transfer result
- **Line**: 48
- **Text**: `Transfer result: running-with-evidence | blocked`
- **Anti-pattern**: #2 (Status-like return values)
- **Problem**: Same as output-contract finding 1. The template bakes the status-like return value into the output format, ensuring every tech-lead invocation produces a document with a "running" status field.
- **Function model**: `Transfer result: complete-with-evidence | blocked` or simply structure the evidence inline.

**Otherwise clean.** The template structure (metadata, artifact paths, unresolved decisions, accepted risks, scope structure) is good functional output design.

---

### `ethos/identity.md`

**Clean.** No anti-patterns found. The identity description correctly frames the tech-lead as a converter (input -> output) that orchestrates, enforces coherence, and makes uncertainty explicit. No named phases, no status language, no acknowledgment semantics.

---

### `ethos/tenets.md`

**Clean.** No anti-patterns found. All five tenets are stated as convictions about quality, risk, integration, boundaries, and scope. None reference named phases or stateful behavior.

---

### `ethos/principles.md`

**Clean.** No anti-patterns found. All five principles describe function-compatible behaviors: gate by evidence, reject ambiguous handoffs, route defects upstream, preserve autonomy, require explicit risk declarations.

---

## Cross-File Pattern Analysis

### The "Intake -> Preflight -> Work -> Transfer" State Machine

The most significant finding is not any individual line but the emergent state machine across the doctrine files:

1. `process.md` defines seven named steps
2. `team-contract.md` references "intake" and "preflight" as delegation triggers
3. `orchestration.md` references "intake chat" and "intake context"
4. `handoff-contract.md` references "intake/preflight" as observable states of the downstream agent
5. `output-contract.md` requires ledger entries for "intake" events
6. `references/template.md` has an "Intake Summary" section

Together, these create a coherent state machine that an agent can navigate and report against. The agent can say "I am in intake," "I passed preflight," "I am orchestrating specialists," "I am transferring to execution." Each of these is a named, observable, reportable state -- exactly what the function model prohibits.

### The `running` / `running-with-evidence` Contamination

This value appears in four places:
- `process.md` line 77
- `pipeline.md` line 22
- `output-contract.md` line 25
- `references/template.md` line 48

It is the return value that most directly violates the function model. A function that has returned cannot be "running." This value exists because the mental model is: tech-lead launches execution-lead as a process and reports its status. The function model is: tech-lead calls execution-lead and returns the combined result.

### The Ethos/Doctrine Split

The ethos layer is entirely clean. The tenets and principles describe a conviction-driven agent that gates by evidence, rejects ambiguity, and preserves boundaries. None of these require named phases or status reporting.

The contamination is entirely in the doctrine layer, which means the anti-patterns are procedural accretions, not conviction failures. The ethos correctly grounds a function-like agent. The doctrine deviated from what the ethos implies.

This is encouraging: fixing the doctrine does not require rethinking the ethos.

---

## Recommended Corrections (Summary)

These are directional, not prescriptive. The actual changes belong in a separate spec.

1. **Eliminate named phase headings in process.md.** The internal work order can be documented as implementation guidance, but not as "Step 1: Intake," "Step 2: Preflight." Consider restructuring as: input validation, work, output.

2. **Replace `running` / `running-with-evidence` everywhere with terminal outcomes.** `complete-with-evidence | blocked` or simply include evidence in the return payload.

3. **Remove `handoff-received` ledger event.** A function does not acknowledge receipt. If a record of invocation is needed, the caller logs that it made the call.

4. **Remove "intake/preflight" references from handoff-contract.md.** The contract with execution-lead should specify what a complete return looks like, not name execution-lead's internal phases.

5. **Rename "Intake Summary" in template.md.** The content is fine; the name propagates the anti-pattern.

6. **Audit the ledger model.** Intermediate ledger appends during execution are side effects that make the function impure. Consider whether ledger entries should be part of the return value rather than appended during execution.
