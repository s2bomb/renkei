# Shaper State Audit -- 2026-02-26

## Scope

All markdown files in the shaper archetype's `doctrine/`, `references/`, and `ethos/` directories. Audited against the function model stated in `AGENTS.md`:

- Agents are non-deterministic functions -- stateless, terminal, composable.
- Return data, not promises.
- Honest signatures.

## Anti-Pattern Key

1. Named phases as reportable states
2. Status-like return values
3. Acknowledgment semantics
4. Intermediate progress reporting
5. State transition vocabulary (between named internal states)
6. "Intake" as a named concept

## Summary

The shaper archetype is **largely clean**. It does not exhibit the worst patterns seen in stage-leader archetypes (no "status: running", no "receipt" or "acknowledged" semantics, no intermediate progress reporting as an output concern). The shaper models itself as a sequential process (Steps 1-9) that produces terminal output, which is consistent with the function model.

However, there are a small number of genuine findings -- mostly concentrated in `orchestration.md` -- where language from other archetypes (particularly tech-lead) leaks in through delegation prompts, and where one internal concept ("intake") appears as a named external state to avoid.

**Findings by severity:**

- **2 genuine anti-pattern instances** (in `orchestration.md`)
- **1 borderline instance** (in `orchestration.md`)
- **7 files clean or essentially clean**

---

## Per-File Findings

---

### `doctrine/orchestration.md`

**Finding 1 -- Anti-pattern #6 (intake as named concept) + #4 (intermediate progress reporting)**

- **Lines 107-108:**
  ```
  - Do not stop at intake-only chat.
  ```
- **Anti-pattern:** This line tells the delegated tech-lead "do not stop at intake-only chat." The phrase "intake-only chat" treats intake as a named, recognizable, stoppable state -- an intermediate checkpoint that the delegate might report back from. Under the function model, there is no "intake" to stop at. The delegate either returns a terminal result or fails. Telling it "don't stop at intake" implies intake is a valid stopping point that must be overridden.
- **What it should be:** Remove the line entirely. The return contract (lines 111-115) already specifies terminal outcomes (`ready-for-execution | blocked`). If the delegate returns anything other than those outcomes, it has failed its contract. The instruction to "not stop at intake" is redundant if the contract is enforced, and harmful because it legitimizes intake as a named intermediate state.

**Finding 2 -- Anti-pattern #2 (status-like return values) + #5 (state transition vocabulary)**

- **Lines 90, 111-115:**
  ```
  `tech-lead` owns the stage until it returns `ready-for-execution` or `blocked`.
  ```
  and:
  ```
  Return only when stage outcome is reached:
  1. Technical-preparation outcome: `ready-for-execution` | `blocked`
  ```
- **Assessment:** This is **borderline, leaning clean**. The values `ready-for-execution` and `blocked` are used as terminal return values of a delegated function call, not as intermediate status reports. This is consistent with the function model -- a function returns success or error. The phrasing "Return only when stage outcome is reached" does hint at the possibility of returning *before* the outcome (which would be an intermediate report), but the intent is clearly "your return value must be terminal."
- **Recommendation:** Minor tightening. Instead of "Return only when stage outcome is reached," say "Return:" -- the qualification implies there's a temptation to return early, which shouldn't exist.

**Finding 3 -- Anti-pattern #1 (named phases as reportable states)**

- **Lines 106-109:**
  ```
  Execution requirement:
  - Continue through technical-preparation process to stage outcome.
  - Do not stop at intake-only chat.
  - Delegate required members (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`) and synthesize package.
  ```
- **Anti-pattern:** The phrase "Continue through technical-preparation process to stage outcome" treats the tech-lead's internal process as having a visible trajectory that the shaper can describe and that the delegate might stop partway through. Under the function model, the shaper calls the tech-lead function and receives a return value. The shaper should not need to narrate the delegate's internal execution path.
- **What it should be:** Replace with contract-only language: "Produce technical-preparation package. Delegate members as needed." The shaper should specify *what* it wants back, not *how* the delegate should traverse its internal process.

---

### `doctrine/process.md`

**Clean with one observation.**

- **Lines 1-14 (Step 1: "Capture Intent and Establish Container"):** This is parameter validation and workspace setup -- ensuring inputs exist before processing. This is the function equivalent of validating arguments and initializing return buffers. It is NOT a named "intake" phase that reports its own completion. The step is invisible to callers; it's just the first thing the function does internally. **Clean.**

- **Lines 68-101 (Step 7: "State Transition and Activation"):** The state transitions here (`open -> active -> parked -> done`) describe the lifecycle of *shaped items* (work products), not the lifecycle of the shaper agent itself. This is data modeling, not agent state. The shaper function takes input and produces items in one of these states. The states are properties of the output data, not intermediate checkpoints of the agent. **Clean.**

- **Line 118 (Step 9: "Keep the Slate Clean"):** References the "state machine" but for `shaped-items/` -- the work queue, not agent execution state. **Clean.**

- **Observation (not a finding):** The process is written as Steps 1-9, which is a sequential recipe. This is compatible with the function model -- a function body has sequential steps. The steps are not externally reportable milestones; they're the function's implementation. However, if a future change were to make these steps individually reportable (e.g., "Step 1 complete, moving to Step 2"), that would be an anti-pattern. As written, they are fine.

---

### `doctrine/pipeline.md`

**Clean.**

- The pipeline describes the shaper's position in a larger flow (`create-project -> shaper -> decision gate -> ...`). This is pipeline topology, not internal agent state.
- Inputs and outputs are clearly defined (lines 12-28). This is the function signature.
- Line 26 references `proposed-active`, `active`, or `parked` -- these are properties of the output shaped items, not agent states.
- Line 36: "State is authoritative by filesystem location plus appended transition events." This is about data (item state), not agent state.

No findings.

---

### `doctrine/output-contract.md`

**Clean.**

- Lines 1-60 define the output structure and metadata. This is the return type specification. Clean.
- Lines 62-75 define quality gates. These are preconditions for a valid return -- the function validates its own output before returning. Clean.
- Lines 77-87 define the downstream handoff payload. This is the function's return value documentation. Clean.
- Lines 89-103 (Completion Report): This is the terminal output format -- what the function returns when done. It contains counts and paths, not intermediate progress. Clean.

No findings.

---

### `doctrine/team-contract.md`

**Clean.**

- Lines 1-23 define role boundaries and delegation triggers. This is team topology documentation.
- Line 8: "owns commitment authority for state transitions" -- refers to item state transitions (work products), not agent state. Clean.
- Line 16: "after technical-preparation transfer" -- refers to handoff of work products between roles, not agent state transitions. Clean.

No findings.

---

### `references/template.md`

**Clean.**

- This is a template for shaped item documents (the output data structure).
- Line 9: "Decision State: proposed-active | active | parked" -- this is a property of the output artifact. It is item state, not agent state. Clean.
- Lines 55-60 (Transition Record): Records item state transitions. This is audit data about the work product, not agent lifecycle. Clean.

No findings.

---

### `ethos/identity.md`

**Clean.** No anti-patterns. The identity describes what the shaper is and what it does in declarative terms. No reference to phases, statuses, acknowledgments, or internal state reporting.

---

### `ethos/tenets.md`

**Clean.** No anti-patterns. Pure value statements. No procedural or stateful language.

---

### `ethos/principles.md`

**Clean.** No anti-patterns. Principles describe how the shaper thinks and what constraints it applies. No stateful vocabulary.

---

## Consolidated Findings

| # | File | Lines | Anti-Pattern | Severity | Text |
|---|---|---|---|---|---|
| 1 | `doctrine/orchestration.md` | 107-108 | #6, #4 | Medium | `Do not stop at intake-only chat.` |
| 2 | `doctrine/orchestration.md` | 106-109 | #1 | Medium | `Continue through technical-preparation process to stage outcome.` |
| 3 | `doctrine/orchestration.md` | 111 | #2 (borderline) | Low | `Return only when stage outcome is reached:` |

## Observations

1. **The shaper is fundamentally function-shaped.** It takes unstructured intent, processes it through a sequential pipeline, and returns shaped items. The output contract is a return type. The quality gates are output validation. The process steps are implementation, not externally visible milestones. This is healthy.

2. **The contamination is in the delegation prompt, not the shaper's own contract.** Findings 1 and 2 are both inside the `Task()` prompt sent to `tech-lead` (lines 92-117). The shaper's own process (Steps 1-9 in `process.md`) and its own output contract are clean. The problem is that when delegating to `tech-lead`, the shaper narrates the delegate's expected internal process rather than simply stating the return contract.

3. **Item state vs agent state is properly separated.** The shaper correctly models `open/active/parked/done` as properties of work products (shaped items), not as states of the shaper agent. The filesystem-as-state-authority pattern (items live in directories named after their state) is a clean data model, not an agent lifecycle.

4. **The term "intake" appears exactly once** (line 108) and it refers to the tech-lead's behavior, not the shaper's. The shaper itself never names an "intake" phase for its own execution.

## Recommendations

1. **Rewrite the tech-lead delegation prompt (lines 92-117) to be contract-only.** Remove process narration ("Continue through...", "Do not stop at..."). Specify: what the delegate receives, what it must return, and the terminal outcome enum. Let the tech-lead's own archetype govern its internal execution.

2. **Change "Return only when stage outcome is reached:" to just "Return:"** on line 111. The qualification implies early return is a possibility to guard against. If the contract is well-specified, no guard is needed.

3. **No changes needed to:** `process.md`, `pipeline.md`, `output-contract.md`, `team-contract.md`, `template.md`, `identity.md`, `tenets.md`, `principles.md`.
