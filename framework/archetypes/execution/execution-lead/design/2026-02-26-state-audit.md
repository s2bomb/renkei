# State Anti-Pattern Audit: execution-lead

Date: 2026-02-26

## Summary

Audited 10 markdown files across `doctrine/`, `references/`, and `ethos/` for the execution-lead archetype. Checked for: named phases as reportable states, status-like return values, acknowledgment semantics, intermediate progress reporting, state transition vocabulary, and "intake" as a named concept.

### Severity Overview

| Severity | Count |
|---|---|
| Critical (violates function model in output/contract) | 3 |
| Moderate (named-phase language leaking into external interfaces) | 8 |
| Low (borderline -- internal validation described with phase names, but behavior is correct) | 6 |
| Clean files (no findings or negligible) | 3 |

### Key Findings

1. **`references/template.md` is the worst offender.** It defines `running-with-evidence` as a transfer outcome value and uses `If running:` as a conditional branch. This is the template agents fill out -- it bakes status-reporting into the output artifact itself.

2. **`doctrine/process.md` names "Intake" and "Preflight" as titled steps (Step 1, Step 2) but then correctly instructs agents not to return them as terminal responses.** The problem is structural: naming them as steps gives them reportable identity even though the text says not to report them. The safeguard is brittle.

3. **"intake" is pervasive (17+ occurrences across files).** In most cases it is used as a synonym for "parameter validation" or "input verification" -- which is legitimate. But it is *also* used as a named concept with its own ledger event (`handoff-received`), its own contract section, and its own gate language. This dual use is the root cause: the same word means both "validate inputs" (fine) and "enter the intake state" (anti-pattern).

4. **The ethos layer is mostly clean.** The tenets and principles use functional language. One tenet says "Execution starts when intake contract fields are complete" -- this is fine as a precondition statement, not a state.

---

## Per-File Findings

---

### `doctrine/process.md`

#### Finding 1 -- Named phase as titled step

- **Lines 3, 28**: `## Step 1: Intake and Start`, `## Step 2: Preflight Execution Gate`
- **Anti-pattern**: #1 (Named phases as reportable states), #6 ("Intake" as named concept)
- **Analysis**: "Intake" and "Preflight" are parameter validation and precondition checking. Under the function model, these are the first few lines of the function body -- they validate inputs and fail-fast if inputs are bad. Giving them named step headings (`Step 1`, `Step 2`) elevates them to externally referenceable milestones. Other files then reference "intake/preflight gates" by name (team-contract.md line 34, orchestration.md line 27), creating a vocabulary of named internal states.
- **What it should be**: Validation logic described as preconditions or input guards, not as numbered steps with names. The step numbering should start at the first real action (delegate test-implementer). Input validation is a preamble, not a step.

#### Finding 2 -- Intake as a ledger event

- **Line 16**: `Append intake event to project and item ledgers ('handoff-received', actor: 'execution-lead').`
- **Anti-pattern**: #6 ("Intake" as named concept), #4 (intermediate progress reporting)
- **Analysis**: Recording a ledger event for receiving input is acknowledgment semantics. A function does not log "I received my arguments." The ledger event `handoff-received` is an intermediate progress report -- it says "I have started" rather than "I have finished." The function model says: return your result, or return an error. The caller already knows it called you.
- **What it should be**: Remove the intake ledger event entirely. The stage outcome event (`stage-complete`, `stage-blocked`, `stage-escalated` at line 91) is sufficient. If provenance is needed, the outcome event can include which package was consumed.

#### Finding 3 -- "intake blocker" as a concept

- **Line 26**: `Missing planning artifacts inside execution worktree is not, by itself, an intake blocker.`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: "Intake blocker" treats intake as a named gate with its own blocking semantics. Under the function model, this is just: "missing X is not a validation error." The concept is correct but the vocabulary creates a named state.
- **What it should be**: "Missing planning artifacts inside execution worktree is not, by itself, an input validation failure."

#### Finding 4 -- "First return to tech-lead after successful transfer"

- **Line 55**: `First return to 'tech-lead' after successful transfer must include concrete execution evidence from this step (files changed and verification outcomes), or 'blocked' if this step cannot proceed.`
- **Anti-pattern**: #5 (state transition vocabulary)
- **Analysis**: "After successful transfer" implies a state transition occurred -- from "transferred" to "executing." Under the function model, there is no transfer event. The function was called, it does its work, it returns. The phrase "first return" also implies there will be subsequent returns, which is intermediate progress reporting.
- **What it should be**: "Return value must include concrete execution evidence (files changed and verification outcomes), or `blocked` with explicit blocker ownership."

#### Finding 5 -- Correct safeguard (not a finding, noting for completeness)

- **Line 40**: `If preflight passes, continue immediately to Step 3 in this invocation. Do not return intake/preflight-only responses.`
- **Analysis**: This line correctly prevents the anti-pattern. It says: do not return a partial result showing only that validation passed. This is the right instruction. However, it is a patch over the structural problem (naming the phases as steps in the first place). If intake and preflight were not named steps, this safeguard would be unnecessary.

#### Finding 6 -- "intake remains insufficient after retries"

- **Line 97**: `intake remains insufficient after retries`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: Treats intake as a persistent condition that can be retried. Under the function model: "input validation failed after N retry attempts." Minor -- the meaning is the same, but the word "intake" as a noun reinforces its identity as a named state.
- **What it should be**: "Input validation fails after retry attempts"

---

### `doctrine/output-contract.md`

#### Finding 7 -- "Intake contract fields" in quality gates

- **Line 33**: `Intake contract fields are complete and stage started`
- **Anti-pattern**: #6 ("Intake" as named concept), #5 (state transition -- "stage started")
- **Analysis**: Two issues. First, "intake contract fields" names intake as a concept with its own contract. Second, "stage started" is state-transition language -- it implies an observable transition from "not started" to "started." Under the function model, the function was called and is executing. There is no "started" event.
- **What it should be**: "Required input fields are present" (drop "and stage started" entirely -- if the function is producing output, it started).

#### Finding 8 -- "intake" in ledger entries field

- **Line 27**: `project/item event ledger entries for intake, stage outcome, and escalation (if any)`
- **Anti-pattern**: #6 ("Intake" as named concept), #4 (intermediate progress reporting)
- **Analysis**: Requiring an "intake" ledger entry in the output means the function must report that it received its inputs as a distinct event in its return value. This is acknowledgment semantics embedded in the output contract.
- **What it should be**: "project/item event ledger entries for stage outcome and escalation (if any)" -- remove intake as a reportable event.

---

### `doctrine/pipeline.md`

#### Finding 9 -- "intake package"

- **Line 13**: `intake package from 'tech-lead'`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: Borderline. "Intake package" is used here as a label for the input payload. This is closer to naming the parameter than naming a state. The term "package" or "input payload" would be more aligned with the function model, but this is low severity.
- **What it should be**: "Input package from `tech-lead`" or simply "package from `tech-lead`"

#### No other findings. The rest of pipeline.md is clean -- it describes position, inputs, outputs, and boundaries in functional terms.

---

### `doctrine/orchestration.md`

#### Finding 10 -- "Intake Return Rule" as a named section

- **Lines 26-32**: The entire section titled `## Intake Return Rule`
- **Anti-pattern**: #1 (named phase as reportable state), #6 ("Intake" as named concept)
- **Analysis**: The *content* of this section is correct -- it says "do not return intake/preflight pass as a terminal response." But naming it "Intake Return Rule" gives intake its own named governance section, reinforcing it as a concept with rules of its own. The rule itself is a patch: if intake were not a named phase, you would not need a rule saying "don't report it."
- **What it should be**: This section's content should be folded into a general return contract. Something like "## Return Contract" with: "Return only terminal outcomes: execution evidence with verification results, or `blocked` with explicit blocker ownership. Input validation is not a terminal outcome."

#### Finding 11 -- "Execution starts when intake contract fields are complete" (verbatim propagation)

- **Line 62**: `> Execution starts when intake contract fields are complete.`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: This is a verbatim propagation of a tenet (ethos/tenets.md line 5). It treats intake as a precondition gate, which is conceptually correct -- "don't start until inputs are validated." But the word "intake" propagated byte-identical to sub-agents gives them the vocabulary to name intake as a state. Since verbatim propagation is a framework rule, the fix must happen at the tenet level (ethos/tenets.md), and this line changes automatically.
- **What it should be**: If the tenet is reworded (e.g., "Execution starts when required input fields are complete"), this propagation inherits the fix.

---

### `doctrine/handoff-contract.md`

#### Finding 12 -- "transfer" as a named event

- **Line 5**: `This contract governs transfer from 'tech-lead' (technical-preparation owner) to 'execution-lead' (execution owner).`
- **Anti-pattern**: #5 (state transition vocabulary)
- **Analysis**: "Transfer" implies a state transition -- ownership moves from one entity to another as an observable event. Under the function model, tech-lead calls execution-lead as a function. There is no "transfer" -- there is a function call. However, this is a cross-team boundary document, and some notion of "who owns what" is operationally necessary. Borderline.
- **What it should be**: "This contract governs invocation of `execution-lead` by `tech-lead`." Ownership semantics can be expressed as: "execution-lead owns all work from invocation to return."

#### Finding 13 -- "Intake/preflight pass is non-terminal"

- **Line 31**: `Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.`
- **Anti-pattern**: #1 (named phases as reportable states)
- **Analysis**: Again, the instruction is correct (don't return a partial result), but it names intake and preflight as things that *could* be returned and must be suppressed. Under the function model, this instruction is unnecessary because there is no concept of returning a validation-only result.
- **What it should be**: "Return execution evidence with verification results, or `blocked` with explicit blocker ownership."

#### Finding 14 -- "intake is blocked" / "intake blockers"

- **Lines 43, 47**: `If intake is blocked, ownership returns to 'tech-lead'.` / `If two correction cycles fail to clear intake blockers`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: "Intake is blocked" treats intake as a thing that has states (blocked/unblocked). Under the function model: "If input validation fails, return error to caller." The retry semantics (line 47) are also stateful -- they imply the function is called repeatedly and remembers previous attempts.
- **What it should be**: "If input validation fails, return `blocked` with explicit missing fields to `tech-lead`." Retry semantics belong to the caller, not the callee.

#### Finding 15 -- "Required Intake Payload" section

- **Line 9**: `## Required Intake Payload`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: Low severity. This is essentially a function signature -- "here are the required parameters." The word "intake" labels it as a named process rather than a parameter list. The content is correct.
- **What it should be**: `## Required Input Fields` or `## Required Parameters`

#### Finding 16 -- "Execution ownership transfers"

- **Line 41**: `Execution ownership transfers when handoff payload fields are complete and invocation occurs.`
- **Anti-pattern**: #5 (state transition vocabulary)
- **Analysis**: "Ownership transfers" is state-transition language. Under the function model: "execution-lead owns all work for the duration of its invocation."
- **What it should be**: "Execution-lead owns all work from invocation to return."

---

### `doctrine/team-contract.md`

#### Finding 17 -- "intake package provider"

- **Line 9**: `'tech-lead' -- parent leader and intake package provider.`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: Low severity. Labels tech-lead's role using intake vocabulary. "Input provider" or "invocation source" would be more function-aligned.
- **What it should be**: "`tech-lead` -- parent leader and input package provider."

#### Finding 18 -- "intake authority"

- **Line 24**: `'execution-lead' intake authority is from 'tech-lead' package handoff, not direct 'shaper' delegation in normal flow.`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: "Intake authority" treats intake as a governed process with authorization rules. The operational meaning is clear and correct: only tech-lead can invoke execution-lead. But the language frames it as "who is authorized to send intake" rather than "who is authorized to invoke."
- **What it should be**: "`execution-lead` invocation authority is `tech-lead`, not direct `shaper` delegation in normal flow."

#### Finding 19 -- "after intake/preflight gates pass"

- **Line 34**: `Delegate 'test-implementer' after intake/preflight gates pass.`
- **Anti-pattern**: #1 (named phases as reportable states)
- **Analysis**: References intake and preflight as named gates with pass/fail states. Under the function model: "Delegate `test-implementer` after input validation." The gate language makes these internal validation steps externally referenceable milestones.
- **What it should be**: "Delegate `test-implementer` after input validation passes."

---

### `references/template.md`

This is the **most problematic file** because it is the actual output template -- it defines what the agent *returns*. Every anti-pattern here becomes a structural part of the function's return value.

#### Finding 20 -- CRITICAL: "Transfer outcome: running-with-evidence | blocked"

- **Line 15**: `- Transfer outcome: running-with-evidence | blocked`
- **Anti-pattern**: #2 (status-like return value), #5 (state transition vocabulary)
- **Analysis**: `running-with-evidence` is a status value, not a terminal outcome. A function that has returned cannot be "running." It is done. The value says "I am currently executing and here is some evidence of progress" -- this is intermediate state reporting. The fact that it appears as a field in the output template means every execution report structurally contains a status-like value.
- **What it should be**: Remove this field entirely. The `## Outcome` section (line 52-55) already captures the terminal outcome: `complete | blocked | escalated`. That is the function's return value. "Transfer outcome" is a named internal checkpoint masquerading as output.

#### Finding 21 -- CRITICAL: "If running:"

- **Lines 20-26**: `If running:` followed by files changed, verification commands, outcomes
- **Anti-pattern**: #2 (status-like return value), #4 (intermediate progress reporting)
- **Analysis**: A conditional branch in the output template predicated on the agent being in a "running" state. This means the template encodes two possible return shapes: one for "running" (with evidence) and one for "blocked." Under the function model, there should be one return shape: the terminal result. Evidence of work done belongs in the `## Evidence` section unconditionally, not gated behind a "running" status check.
- **What it should be**: Remove the `If running:` conditional. Move "files changed", "verification commands", and "outcomes" into the Evidence section unconditionally.

#### Finding 22 -- CRITICAL: "## Intake" section in output template

- **Lines 11-26**: The entire `## Intake` section
- **Anti-pattern**: #6 ("Intake" as named concept), #3 (acknowledgment semantics), #4 (intermediate progress reporting)
- **Analysis**: The output template has a dedicated section for reporting intake status. This means every execution report structurally acknowledges receipt of the input package, reports who sent it, and reports whether intake succeeded. Under the function model: the function was called with arguments, it either succeeded or failed. The caller knows what arguments it passed. Reporting "I received your package from tech-lead and the handoff issuer role was X" is acknowledgment semantics.
- **What it should be**: Remove the `## Intake` section from the output template. Package source and handoff issuer are input metadata that the caller already knows. If provenance must be recorded, it belongs in the Metadata section as a simple field, not as a named intake report with its own outcome values.

---

### `ethos/tenets.md`

#### Finding 23 -- "intake contract fields"

- **Line 5**: `Execution starts when intake contract fields are complete.`
- **Anti-pattern**: #6 ("Intake" as named concept)
- **Analysis**: This tenet is the *source* from which many downstream uses of "intake" derive. The operational meaning is correct: validate inputs before doing work. But naming it "intake contract" in a tenet means the word propagates verbatim to all sub-agents (per verbatim propagation rules). This is the root of the vocabulary problem.
- **What it should be**: "Execution starts when required input fields are complete." Same meaning, no named phase.

#### Finding 24 -- "progress language" (positive finding)

- **Line 13**: `We surface uncertainty and defects explicitly; we do not hide them inside progress language.`
- **Analysis**: This tenet is **good** -- it actively works against the status-reporting anti-pattern. It says: don't hide problems behind words like "in progress" or "running." This tenet should be preserved and strengthened.

#### No other findings. The other tenets are clean and functional.

---

### `ethos/principles.md`

#### Finding 25 -- "cross-stage status"

- **Line 5**: `One stage owner publishes cross-stage status.`
- **Anti-pattern**: #2 (status-like return value)
- **Analysis**: Borderline. "Status" here means "the outcome of the stage" rather than "intermediate progress." The intent is: only one agent publishes the final result, preventing conflicting claims. However, the word "status" is ambiguous -- it could mean a terminal outcome or an ongoing state. Under the function model: "One stage owner publishes the stage outcome."
- **What it should be**: "One stage owner publishes the stage outcome."

#### No other findings. The remaining principles are clean.

---

### `ethos/identity.md`

**Clean.** No findings. The identity description uses functional language: "receive," "own," "delegate," "publish one authoritative execution-stage outcome." All terminal.

---

## Root Cause Analysis

The findings cluster around three root causes:

### 1. "Intake" is overloaded

"Intake" is used for two distinct things:
- **Input validation** (checking that required fields exist) -- this is a legitimate function preamble
- **A named phase** with its own ledger events, contract sections, return values, and governance rules -- this is the anti-pattern

The fix is to split the concept: use "input validation" or "precondition check" for the first meaning, and eliminate the second meaning entirely.

### 2. The template bakes in status reporting

`references/template.md` defines the output structure, and it contains `running-with-evidence` as a return value and `If running:` as a conditional. This means the function's return type *structurally encodes* intermediate state. Every agent that fills out this template is forced to report status rather than outcomes.

### 3. Safeguards patch the symptom, not the cause

Multiple files contain correct instructions: "do not return intake/preflight-only responses" (process.md line 40), "do not return intake/preflight pass as a terminal response" (orchestration.md line 27). These are patches. They exist because the steps are named, and agents predictably try to report completing named steps. Removing the names removes the need for the patches.

## Recommended Priority

1. **Fix `references/template.md` first.** It is the output contract's physical form. Remove `running-with-evidence`, remove `If running:`, remove the `## Intake` section. This eliminates the status-reporting structure from the return value.
2. **Rename "intake" to "input validation" in `ethos/tenets.md`.** This propagates automatically via verbatim propagation.
3. **Restructure `doctrine/process.md` Steps 1-2.** Make input validation and precondition checking a preamble, not numbered steps. Start step numbering at the first real action (delegate test-implementer).
4. **Clean up remaining "intake" vocabulary** across handoff-contract.md, team-contract.md, orchestration.md, output-contract.md, and pipeline.md.
5. **Remove the intake ledger event** from process.md and output-contract.md. The stage outcome event is sufficient.
