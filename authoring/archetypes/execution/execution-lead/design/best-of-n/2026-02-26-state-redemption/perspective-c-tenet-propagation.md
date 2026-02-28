# Perspective C: Tenet/Propagation Analysis

Date: 2026-02-26
Lens: How the tenet "Execution starts when intake contract fields are complete" propagates through the archetype, and the exact changes needed to stop that propagation.

---

## 1. The Propagation Chain

The tenet at `ethos/tenets.md:5` is the root source. Here is the exact propagation path, traced file by file.

### Source: ethos/tenets.md line 5

```
Execution starts when intake contract fields are complete.
```

This is the origin. The framework's verbatim propagation rule (framework/AGENTS.md: "Orchestrators pass ethos to sub-agents **byte-identical**") guarantees this exact string reaches every sub-agent. The word "intake" in a tenet is not a local vocabulary choice -- it is a seed planted in every downstream agent's operating context.

### Propagation Level 1: Verbatim copy in doctrine

**orchestration.md line 62** -- byte-identical propagation block:

```
> Execution starts when intake contract fields are complete.
```

This is the verbatim propagation section. The tenet is copied exactly as written, as required by framework rules. This is the primary transmission vector to sub-agents (`test-implementer`, `implement-plan`, `validate-plan`).

### Propagation Level 2: Doctrine files that derive phrasing from the tenet

Each of these uses "intake" as a noun/concept because the tenet established it as one.

| File | Line | Phrase | Derivation |
|---|---|---|---|
| process.md | 3 | "Step 1: Intake and Start" | Named step derived from tenet's "intake contract fields" |
| process.md | 6 | "Verify required intake fields exist" | Parameter list heading derived from "intake contract fields" |
| process.md | 14 | "Start execution stage immediately when intake fields are complete" | Near-verbatim restatement of the tenet |
| process.md | 16 | "Append intake event to project and item ledgers" | Ledger event named after the tenet concept |
| process.md | 18 | "If intake is incomplete" | Condition using intake as a stateful noun |
| process.md | 26 | "an intake blocker" | Compound noun derived from tenet concept |
| process.md | 40 | "Do not return intake/preflight-only responses" | Safeguard patch referencing the named phase |
| process.md | 97 | "intake remains insufficient after retries" | Intake as a persistent condition |
| handoff-contract.md | 9 | "Required Intake Payload" | Section heading naming the concept |
| handoff-contract.md | 29 | "when intake contract fields are complete" | Verbatim tenet echo in doctrine |
| handoff-contract.md | 31 | "Intake/preflight pass is non-terminal" | Intake as a named gate with pass/fail |
| handoff-contract.md | 33 | "If intake contract is incomplete" | Intake as stateful condition |
| handoff-contract.md | 43 | "If intake is blocked" | Intake with blocked/unblocked states |
| handoff-contract.md | 47 | "intake blockers" | Compound noun |
| orchestration.md | 25 | "Intake Return Rule" | Named governance section for the concept |
| orchestration.md | 27 | "Do not return intake/preflight pass" | Safeguard patch |
| output-contract.md | 27 | "ledger entries for intake" | Intake as a reportable event category |
| output-contract.md | 33 | "Intake contract fields are complete and stage started" | Quality gate echoing the tenet |
| team-contract.md | 9 | "intake package provider" | Role label derived from concept |
| team-contract.md | 24 | "intake authority" | Authorization rule named after concept |
| team-contract.md | 34 | "after intake/preflight gates pass" | Delegation trigger using named phase |
| pipeline.md | 13 | "intake package from `tech-lead`" | Input labeled with the concept |
| template.md | 11 | "## Intake" | Output section named after the concept |
| template.md | 15 | "Transfer outcome: running-with-evidence \| blocked" | Status value under the Intake section |

**Total: 24 downstream instances traced to one tenet.**

### The Propagation Mechanism

The chain works in three stages:

1. **Tenet establishes vocabulary.** The tenet says "intake contract fields." This makes "intake" an authorized concept in the archetype's vocabulary.

2. **Doctrine authors use the vocabulary.** When writing process.md, the author naturally used "intake" to name the validation step because the tenet used "intake" to describe the precondition. The tenet does not command "name a step Intake" -- but it provides the word, and authors fill structure with available words.

3. **Verbatim propagation broadcasts it to sub-agents.** The orchestration.md propagation block sends the exact tenet to sub-agents, giving them the same word. Sub-agents then expect "intake" to mean something, look for intake-shaped structures, and reinforce the concept.

This is a vocabulary contagion pattern. The fix must happen at stage 1. Changing the tenet changes the available word. Downstream files then have no tenet-authorized basis for the term.

---

## 2. The Tenet Rewrite

### Current

```
Execution starts when intake contract fields are complete.
```

### Problems

1. "intake contract fields" names "intake" as a concept with its own contract. This propagates the vocabulary.
2. "intake contract" is a compound noun that implies intake is a governed process, not input validation.
3. The word "fields" correctly identifies what must be checked. The word "intake" incorrectly names the checking process.

### Proposed Replacement

```
Execution starts when required input fields are complete.
```

### Why This Wording

- **"required input fields"** is the function-model equivalent. A function checks its parameters. "Required input fields" describes what a function signature declares.
- **"Execution starts when"** is preserved. The precondition semantics are correct -- execution-lead should not proceed without complete inputs. The tenet heading "Acceptance before action" remains valid.
- **No phase is named.** "Input fields" is a property of the invocation, not a state the agent enters.
- **Propagation effect**: When this tenet propagates verbatim to sub-agents, they receive "required input fields" -- a concept that maps to parameter validation, not to a named phase.

### Alternative Considered and Rejected

"Execution requires a complete parameter set" -- too computer-science. The current archetype uses "fields" consistently (handoff-contract.md lists numbered fields). "Required input fields" matches the existing field-list vocabulary without introducing jargon.

---

## 3. The principles.md Fix

### Current (line 5)

```
One stage owner publishes cross-stage status.
```

### Replacement

```
One stage owner publishes cross-stage outcome.
```

### Why

"Status" is ambiguous. It can mean:
- A terminal result (outcome) -- which is what the principle intends
- An intermediate progress report -- which is the anti-pattern

The principle's purpose is clear from context: prevent multiple agents from claiming stage completion. The identity article confirms this: execution-lead's job is to "publish one authoritative execution-stage outcome." The word "outcome" appears in identity.md, in the output-contract.md terminal values (`complete | blocked | escalated`), and in process.md step 6. The word "status" appears only here and in the output-contract quality gate (which the audit also flags).

Replacing "status" with "outcome" aligns the principle with every other file's vocabulary and eliminates the ambiguity.

---

## 4. Downstream Propagation Changes

Each change below is necessitated by the tenet rewrite. The column "Why" traces the necessity back to the tenet.

### 4.1 orchestration.md

**Line 62: Verbatim propagation block**

- Current: `> Execution starts when intake contract fields are complete.`
- Replacement: `> Execution starts when required input fields are complete.`
- Why: Verbatim propagation of the rewritten tenet. This is automatic -- the propagation block must match the tenet exactly.

**Lines 25-32: "Intake Return Rule" section heading and content**

- Current:
  ```
  ## Intake Return Rule

  Do not return intake/preflight pass as a terminal response.

  Return to parent leader only when:

  1. first execution phase attempt produced concrete evidence (files changed + verification outcomes), or
  2. execution is `blocked` with explicit blocker ownership and next action.
  ```
- Replacement:
  ```
  ## Return Contract

  Return to parent leader only when:

  1. first execution phase attempt produced concrete evidence (files changed + verification outcomes), or
  2. execution is `blocked` with explicit blocker ownership and next action.

  Input validation is not a terminal outcome.
  ```
- Why: "Intake Return Rule" names intake as a concept with its own governance. The rule's content is valid but should be stated as a general return contract. The safeguard sentence becomes a clarification at the end rather than the section's raison d'etre.

### 4.2 process.md

**Line 3: Step 1 heading**

- Current: `## Step 1: Intake and Start`
- Replacement: `## Step 1: Validate Inputs and Start`
- Why: Removes "Intake" as a named phase. "Validate inputs" describes the action without naming a state.

**Line 6: Field verification instruction**

- Current: `Verify required intake fields exist:`
- Replacement: `Verify required input fields exist:`
- Why: Direct echo of the tenet's vocabulary. Must change when the tenet changes.

**Line 14: Start condition**

- Current: `Start execution stage immediately when intake fields are complete.`
- Replacement: `Start execution stage immediately when required input fields are complete.`
- Why: Near-verbatim restatement of the tenet. Inherits the tenet fix.

**Line 16: Ledger event**

- Current: `Append intake event to project and item ledgers ('handoff-received', actor: 'execution-lead').`
- Replacement: Remove entirely.
- Why: The intake ledger event is acknowledgment semantics. A function does not log "I received my arguments." The stage outcome event at line 91 is sufficient. This is not a vocabulary fix -- it is a structural fix that becomes obvious once the named phase is removed.

**Line 18: Incomplete condition**

- Current: `If intake is incomplete, return 'blocked' with explicit blocker ownership.`
- Replacement: `If required input fields are incomplete, return 'blocked' with explicit blocker ownership.`
- Why: "Intake is incomplete" uses intake as a stateful noun. "Required input fields are incomplete" describes a validation failure.

**Line 26: Intake blocker**

- Current: `Missing planning artifacts inside execution worktree is not, by itself, an intake blocker.`
- Replacement: `Missing planning artifacts inside execution worktree is not, by itself, an input validation failure.`
- Why: "Intake blocker" is a compound noun treating intake as a named gate. "Input validation failure" describes the same thing without naming a phase.

**Line 40: Safeguard instruction**

- Current: `If preflight passes, continue immediately to Step 3 in this invocation. Do not return intake/preflight-only responses.`
- Replacement: `If preflight passes, continue immediately to Step 3 in this invocation. Do not return validation-only responses.`
- Why: "intake/preflight-only" names the phases. "Validation-only" describes the anti-pattern without naming them. (See section 6 for whether this safeguard survives.)

**Line 97: Escalation condition**

- Current: `intake remains insufficient after retries`
- Replacement: `input validation fails after retries`
- Why: "Intake remains insufficient" treats intake as a persistent condition. "Input validation fails" describes a function that returned an error.

### 4.3 handoff-contract.md

**Line 5: Contract scope**

- Current: `This contract governs transfer from 'tech-lead' (technical-preparation owner) to 'execution-lead' (execution owner).`
- Replacement: `This contract governs invocation of 'execution-lead' by 'tech-lead' (technical-preparation owner).`
- Why: "Transfer" implies a state transition. "Invocation" is the function-model term.

**Line 9: Section heading**

- Current: `## Required Intake Payload`
- Replacement: `## Required Input Fields`
- Why: "Intake Payload" names the concept. "Input Fields" describes the function's parameters.

**Line 29: Start condition**

- Current: `Execution owner starts immediately when intake contract fields are complete.`
- Replacement: `Execution owner starts immediately when required input fields are complete.`
- Why: Echo of the tenet. Inherits the fix.

**Line 31: Non-terminal instruction**

- Current: `Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.`
- Replacement: `Input validation is not a terminal outcome. Return only after first execution phase attempt with evidence, or blocked.`
- Why: Names intake as a thing that can "pass." Replace with a general statement.

**Line 33: Incomplete condition**

- Current: `If intake contract is incomplete, return:`
- Replacement: `If required input fields are incomplete, return:`
- Why: "Intake contract" names the concept. "Required input fields" describes parameters.

**Line 39: Section heading**

- Current: `## Transfer Rule`
- Replacement: `## Ownership Rule`
- Why: "Transfer" is state-transition vocabulary. The section's content is about who owns work and when.

**Line 41: Ownership statement**

- Current: `Execution ownership transfers when handoff payload fields are complete and invocation occurs.`
- Replacement: `Execution-lead owns all work from invocation to return.`
- Why: "Transfers" implies a state transition. The replacement states the invariant directly.

**Line 43: Blocked condition**

- Current: `If intake is blocked, ownership returns to 'tech-lead'.`
- Replacement: `If input validation fails, return 'blocked' to 'tech-lead'.`
- Why: "Intake is blocked" treats intake as stateful. "Input validation fails" is a function returning an error.

**Line 47: Escalation condition**

- Current: `If two correction cycles fail to clear intake blockers, escalate to decision owner with:`
- Replacement: `If two correction cycles fail to resolve input validation failures, escalate to decision owner with:`
- Why: "Intake blockers" is a compound noun. "Input validation failures" describes the same thing.

### 4.4 output-contract.md

**Line 27: Ledger entries field**

- Current: `project/item event ledger entries for intake, stage outcome, and escalation (if any)`
- Replacement: `project/item event ledger entries for stage outcome and escalation (if any)`
- Why: Remove "intake" as a reportable event category. The intake ledger event itself is removed from process.md; the output contract must stop requiring it.

**Line 33: Quality gate**

- Current: `Intake contract fields are complete and stage started`
- Replacement: `Required input fields are present`
- Why: Two fixes. "Intake contract fields" inherits the tenet vocabulary fix. "And stage started" is state-transition language -- if the function is producing output, it started. Drop it.

### 4.5 team-contract.md

**Line 9: Role description**

- Current: `'tech-lead' -- parent leader and intake package provider.`
- Replacement: `'tech-lead' -- parent leader and input provider.`
- Why: "Intake package provider" labels the role using the tenet's vocabulary.

**Line 24: Authority rule**

- Current: `'execution-lead' intake authority is from 'tech-lead' package handoff, not direct 'shaper' delegation in normal flow.`
- Replacement: `'execution-lead' invocation authority is 'tech-lead', not direct 'shaper' delegation in normal flow.`
- Why: "Intake authority" treats intake as a governed process with authorization rules. "Invocation authority" uses the function model.

**Line 34: Delegation trigger**

- Current: `Delegate 'test-implementer' after intake/preflight gates pass.`
- Replacement: `Delegate 'test-implementer' after input validation passes.`
- Why: "Intake/preflight gates" names two phases as external milestones. "Input validation" describes the precondition without naming phases.

### 4.6 pipeline.md

**Line 13: Input label**

- Current: `intake package from 'tech-lead'`
- Replacement: `input package from 'tech-lead'`
- Why: "Intake package" uses the tenet vocabulary. "Input package" is the function-model term.

### 4.7 template.md

**Lines 11-26: Entire "## Intake" section**

- Current:
  ```
  ## Intake

  - Package source (`tech-lead`):
  - Handoff issuer role:
  - Transfer outcome: running-with-evidence | blocked
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
- Replacement: Remove the entire section.
- Why: Three compounding problems. (1) The section heading "## Intake" names the concept as an output category. (2) "Transfer outcome: running-with-evidence | blocked" is a status value -- `running-with-evidence` means "I am currently executing," which a returned function cannot be. (3) "If running:" is a conditional branch predicated on intermediate state. Package source and handoff issuer are caller-known metadata; if provenance is needed, move two lines to Metadata:
  ```
  - Package source: `tech-lead`
  - Handoff issuer role:
  ```
  The "files changed / verification commands / outcomes" content under "If running:" should move unconditionally to Evidence, which already has the right structure.

---

## 5. What "Intake" CAN Still Mean

**Position: "Intake" should be fully eliminated from this archetype.**

The argument for keeping "intake" as a verb ("intake the package," meaning "validate the inputs") is theoretically coherent but practically dangerous. Here is why:

1. **The tenet is the vocabulary source.** Agents read the tenet. If any downstream file uses "intake" -- even as a verb -- agents will connect it to the tenet and reconstruct the named-phase interpretation. The verbatim propagation rule guarantees the tenet reaches sub-agents byte-identical. If the tenet no longer says "intake," but a doctrine file does, agents encounter a vocabulary mismatch that invites reinterpretation.

2. **"Input validation" is universally understood.** Every developer, every agent, every framework understands "validate inputs" or "check required fields." There is no communicative value that "intake" provides over "input validation." It is a synonym with baggage.

3. **Partial elimination creates ambiguity debt.** If "intake" survives in one file as a verb but is eliminated as a noun everywhere else, future authors will ask: "Is 'intake' a term in our vocabulary or not?" That question should have a clear answer. The clear answer is: no.

4. **The VOCABULARY.md standard demands one term per concept.** "Input validation" and "intake" cannot both mean "check that required fields exist." One must be preferred. "Input validation" is the function-model term. "Intake" is the phase-model term. Choose function.

**Exception**: The word "intake" may appear in the `design/` layer (this analysis, the audit, design notes) because those files describe the *history* of the archetype, not its *operation*. Historical references to "the intake problem" or "the old intake phase" are documentary, not operational.

---

## 6. Safeguard Analysis: "Do not return intake/preflight-only responses"

### Where the safeguards appear

1. **process.md line 40**: "Do not return intake/preflight-only responses."
2. **orchestration.md line 27**: "Do not return intake/preflight pass as a terminal response."
3. **handoff-contract.md line 31**: "Intake/preflight pass is non-terminal."

### Why they exist

These safeguards exist because Steps 1 and 2 in process.md are named phases. When a phase has a name, an agent can report completing it. Agents are non-deterministic; given a named milestone, some percentage of invocations will return after reaching it, treating it as a natural stopping point. The safeguards compensate for this tendency.

### Do we still need them after removing named phases?

**Partially yes, but in a different form.**

The safeguard addresses a real behavior pattern: agents returning after validation succeeds but before doing real work. Removing named phases reduces the probability of this behavior (no named milestone to stop at), but does not eliminate it. Validation is still the first thing the agent does. An agent could still return after validation with "all inputs present, ready to proceed" even without a phase name.

### What replaces them

The three safeguards should be consolidated into a single, positive return contract in orchestration.md (proposed in section 4.1 above):

```
## Return Contract

Return to parent leader only when:

1. first execution phase attempt produced concrete evidence (files changed + verification outcomes), or
2. execution is `blocked` with explicit blocker ownership and next action.

Input validation is not a terminal outcome.
```

This is better than the current safeguards because:

- **It is positive, not negative.** It says what TO return rather than what NOT to return. Positive constraints are more robust than prohibitions because they define the complete valid set.
- **It is general.** It covers any non-terminal intermediate step, not just intake and preflight specifically.
- **It does not reference named phases.** "Input validation is not a terminal outcome" does not give the validation step a name -- it states a property of a class of actions.
- **It is one statement, not three.** The current three safeguards in three files create maintenance surface. A single return contract in orchestration.md (which sub-agents read during delegation) is sufficient.

The process.md line 40 safeguard ("Do not return validation-only responses") should still survive in its local context as a reinforcement, because process.md is the step-by-step procedure and agents may reach that line without having internalized the orchestration return contract. But it becomes a redundant safety net, not the primary defense.

---

## Summary of All Changes

| File | Changes | Root Cause |
|---|---|---|
| ethos/tenets.md | Rewrite line 5: "intake contract fields" -> "required input fields" | ROOT SOURCE |
| ethos/principles.md | Rewrite line 5: "cross-stage status" -> "cross-stage outcome" | Ambiguous vocabulary |
| doctrine/orchestration.md | Rewrite propagation block (inherits tenet fix), rename section, consolidate safeguard | Verbatim propagation + named phase |
| doctrine/process.md | 7 line-level changes, 1 line removal | Tenet vocabulary propagation |
| doctrine/handoff-contract.md | 8 line-level changes | Tenet vocabulary propagation |
| doctrine/output-contract.md | 2 line-level changes | Tenet vocabulary + ledger event removal |
| doctrine/team-contract.md | 3 line-level changes | Tenet vocabulary propagation |
| doctrine/pipeline.md | 1 line-level change | Tenet vocabulary propagation |
| references/template.md | Remove entire ## Intake section, relocate 2 fields to Metadata | Tenet vocabulary + status reporting |

**Total: 1 root tenet change producing 22+ downstream changes across 9 files.**

The ratio (1:22) demonstrates why the tenet is the correct intervention point. Fixing downstream files without fixing the tenet would be patching symptoms -- the verbatim propagation rule would continue broadcasting the old vocabulary to every sub-agent on every invocation.
