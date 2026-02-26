# Perspective E: Risk/Regression Analysis

**Lens**: What guardrails do the named phases currently provide? What replaces them? Could the state redemption cause agents to skip validation entirely?

---

## 1. Guardrails Inventory

Every named phase, numbered step, or explicit prohibition in the current doctrine that prevents the agent from doing something wrong.

### G1: "Step 1: Intake Active Shape" (process.md:3)

- **What it prevents**: Agent skipping input collection. Without a named intake step, the agent might proceed with partial context -- missing the shaped artifact, workspace path, or appetite constraints.
- **Criticality**: High. If the agent starts orchestrating specialists without the shaped artifact, every downstream artifact is built on sand.
- **Could the agent skip this without the named phase?** Unlikely in isolation -- the downstream work literally requires these inputs. But the *completeness check* at line 12 ("Stop if intake packet is incomplete") is the real guardrail. The name "Intake" is not what prevents the skip; the explicit stop instruction is. However, the name makes the stop instruction discoverable. An unnamed validation buried mid-paragraph is easier to overlook than one under a heading.

### G2: "Step 2: Preflight Quality Gate" (process.md:14)

- **What it prevents**: Agent proceeding with a shaped artifact that has product-framing defects -- missing problem definition, missing appetite, missing no-gos, hidden uncertainties.
- **Criticality**: Critical. This is the "garbage in, garbage out" gate. Without it, the tech-lead produces a technical package from an ill-defined shape, which the execution-lead then attempts to implement. The failure mode is not a crash -- it is a plausible-looking but wrong package.
- **Could the agent skip this without the named phase?** Yes. This is the highest-risk guardrail. Unlike input collection (G1), where missing data causes obvious downstream failure, *quality validation* of present-but-defective data requires active judgment. If validation is not a named mandatory step, a conviction-driven agent under pressure to produce output may treat "all fields present" as sufficient and skip the "are the fields actually good?" check. The audit itself notes (Finding 2) that this was clearly elevated to a named step because it needs to be a hard gate.

### G3: "Intake chat is not a completion state" (orchestration.md:7)

- **What it prevents**: Agent stopping after receiving input and engaging in conversation with the user instead of running the full preparation pipeline to a terminal outcome.
- **Criticality**: Critical. This prohibition exists because the failure mode was observed in practice. Agents *did* stop at intake chat. The prohibition is a patch for a real behavioral failure.
- **Could the agent skip the prohibition without the name?** The prohibition depends on the name. "Intake chat is not a completion state" only works if "intake chat" is a recognizable concept the agent can identify and reject. Remove the name, and you must replace the prohibition with something equally forceful. A function-model agent that genuinely treats itself as a function cannot "chat" -- but whether a real LLM agent holds that self-model consistently under all conditions is the open question.

### G4: Numbered step ordering (process.md:3-86, Steps 1-7)

- **What it prevents**: Out-of-order execution. Specifically: delegating before validating (Steps 1-2 before 3), transferring before synthesizing (Step 5 before 6), escalating before retrying (Step 4 before 7).
- **Criticality**: High for the validate-before-delegate constraint. Medium for the rest -- most ordering is natural (you cannot synthesize what does not exist).
- **Could the agent reorder without numbered steps?** For natural dependencies (can't synthesize nonexistent artifacts), no. For the validate-before-delegate constraint, yes. An eager agent might delegate to spec-writer and research-codebase before verifying the shape quality, relying on the specialists to surface problems. This would waste specialist work and potentially produce artifacts from a defective shape.

### G5: "Stop if intake packet is incomplete" (process.md:12)

- **What it prevents**: Proceeding with partial input.
- **Criticality**: High but naturally enforced -- missing paths and missing artifacts cause hard failures downstream.
- **Could the agent skip this?** In theory, but downstream failures would catch it. This is a "fail fast" guardrail more than a "prevent silent error" guardrail.

### G6: "Intake/preflight pass alone is not a terminal return for execution-lead" (handoff-contract.md:48)

- **What it prevents**: Execution-lead returning "I validated the package and it looks good" as if that were a complete result. The contract demands substantive first-phase work evidence.
- **Criticality**: Critical. Without this, execution-lead can claim success by confirming the package is readable, without ever attempting to execute.
- **Could the agent skip this?** Absolutely. Without the explicit prohibition, an execution-lead that encounters difficulty could rationalize that validation alone constitutes a successful return.

### G7: Two correction retry limit (process.md:46, handoff-contract.md:54)

- **What it prevents**: Infinite retry loops. Without a limit, the agent could re-delegate to a failing specialist indefinitely.
- **Criticality**: Medium. Infinite loops waste time but do not produce wrong output. The real risk is the agent abandoning retry discipline entirely and self-producing artifacts (which the next guardrail addresses).
- **Could the agent lose this without named steps?** The retry limit is not tied to named phases -- it is a policy. It can survive the phase removal intact.

### G8: "Escalate rather than silently self-producing" (process.md:48)

- **What it prevents**: The tech-lead writing specialist artifacts itself when specialists fail, bypassing the member ownership boundary.
- **Criticality**: High. Silent self-production violates the team contract and produces artifacts without specialist expertise.
- **Could the agent skip this?** Yes. This is a behavioral temptation guardrail -- the agent can "solve the problem" by doing the work itself. The prohibition needs to survive in any model.

### G9: "Do not return execution-start responsibility to shaper" (process.md:73)

- **What it prevents**: The tech-lead routing the completed package back upstream instead of downstream to execution-lead.
- **Criticality**: Medium. Unlikely failure mode but the prohibition suggests it was considered.
- **Could the agent skip this?** Unlikely without the prohibition specifically because the pipeline position (pipeline.md) clearly defines the flow direction.

### G10: Quality gates in output-contract.md (lines 30-38)

- **What they prevent**: Handoff of an incomplete or contradictory package.
- **Criticality**: Critical. These are the final gates before the package leaves the tech-lead's control.
- **Could the agent skip these?** These are not tied to named phases -- they are output requirements. They survive phase removal naturally.

---

## 2. The "Intake Chat" Guardrail

orchestration.md:7 -- "Intake chat is not a completion state."

### Why this exists

This is a scar from observed failure. Agents were stopping after receiving the shaped artifact and engaging in conversation. The prohibition is a direct response: "I saw you do this. Stop doing it."

### What removing the name removes

The prohibition has three components:
1. **The name** "intake chat" -- identifies the failure mode
2. **The negation** "is not a completion state" -- rejects the failure mode
3. **The implicit assertion** that the only completion state is a terminal stage outcome

Remove component 1, and components 2-3 have no referent. You cannot say "X is not a completion state" without naming X.

### What replaces it in the function model

The function model's replacement is structural: a function cannot chat because a function runs and returns. But this structural argument only holds if the agent's self-model is actually functional. In practice, LLM agents operate in a conversational context. The function model is a *metaphor imposed on the doctrine*, not an enforcement mechanism.

**Proposed replacement**: Express the prohibition as an output requirement rather than a phase prohibition:

> Invocation demands a terminal outcome. Return `ready-for-execution | blocked` with full payload. Returning only the input context summary is an incomplete result.

This works because:
- It does not name an internal phase
- It defines what a complete output looks like
- It makes the failure mode (returning only a summary) identifiable by examining the output
- It is testable: does the return contain a terminal outcome or just a restatement of input?

### Risk rating: **HIGH**

This guardrail addresses a proven failure mode. The replacement must be at least as forceful as the original. I assess the proposed output-requirement approach as *adequate but requires explicit phrasing* -- it cannot be vague.

---

## 3. The "Preflight" Guardrail

process.md:14-22 -- "Step 2: Preflight Quality Gate"

### Why this exists

Input validation of the shaped artifact's content quality -- not just presence but adequacy. The checks are:
- Problem and boundaries explicit
- Appetite explicit
- No-gos explicit
- Major uncertainties visible

### The skip risk

Removing the "Preflight" name and folding this into generic input validation is the single most dangerous proposed change. Here is why:

**Presence validation is cheap and automatic.** "Is there a shape.md file at the given path?" is trivially checked. An agent will naturally do this because missing files cause immediate errors.

**Quality validation is expensive and requires judgment.** "Is the problem statement in shape.md actually explicit enough to derive a technical specification?" requires reading the document, evaluating its content, and making a quality judgment. This is the step an agent skips under pressure.

The named step "Preflight Quality Gate" serves as a *cognitive forcing function*. It says: "You MUST stop here and evaluate quality. This is not optional. This is Step 2. You cannot proceed to Step 3 without completing Step 2." Without the name and the number, the instruction becomes: "Validate that the input is good." This is weaker because:

1. It has no checkpoint identity -- the agent cannot self-audit "did I do preflight?"
2. It blends with trivial presence checks -- "I confirmed the files exist" may satisfy a generic validation instruction
3. It has no escalation path tied to its name -- "route to shaper with explicit defect notes" currently triggers at the preflight gate

### What replaces it

The function model says: "Input validation is part of parameter processing. It either passes or returns an error." This is correct in principle. The question is whether the *content of the validation* survives the name removal.

**Proposed replacement**: Express quality validation as a precondition on the function signature, not a named step:

> **Preconditions (hard rejection on failure)**:
> 1. Shaped artifact is present and readable
> 2. Problem statement is explicit (not implied, not vague)
> 3. Appetite is stated with concrete constraint
> 4. No-gos are enumerated
> 5. Major uncertainties are surfaced
>
> Failure: return `{ outcome: "rejected", defects: [...], route: "shaper" }` without proceeding.

This preserves the validation content while removing the phase name. The key: the preconditions must be listed *explicitly* and *individually*, not summarized as "validate input quality." Summarization is where the guardrail leaks.

### Risk rating: **CRITICAL**

This is the highest-risk change in the redemption. The replacement MUST enumerate the specific quality checks. A generic "validate input" instruction is insufficient.

---

## 4. The Numbered Steps Guardrail

process.md Steps 1-7 force a specific execution order.

### Which ordering constraints actually matter

| Constraint | Source | Matters? |
|---|---|---|
| Validate before delegate | Steps 1-2 before Step 3 | Yes -- prevents wasted specialist work |
| Delegate before evaluate | Step 3 before Step 4 | Naturally enforced -- nothing to evaluate without delegated output |
| Evaluate before synthesize | Step 4 before Step 5 | Naturally enforced -- cannot synthesize unchecked artifacts |
| Synthesize before transfer | Step 5 before Step 6 | Naturally enforced -- nothing to transfer without synthesis |
| Retry before escalate | Step 4 before Step 7 | Yes -- prevents premature escalation |

Only two constraints are not naturally enforced by data dependencies: validate-before-delegate and retry-before-escalate. The rest follow from the work itself.

### How to express mandatory ordering without named states

**Option A: Dependency declarations.** Instead of numbered steps, declare what each action requires:

> Specialist delegation requires: validated input with all preconditions met.
> Escalation requires: exhaustion of correction retries (max 2 per artifact).

This is function-model-compatible. Each action has preconditions, not a position in a sequence.

**Option B: If/then conviction statements.** Express ordering as beliefs:

> You do not delegate on unvalidated input -- it wastes specialist work.
> You do not escalate before retrying -- premature escalation signals lack of ownership.

This is ethos-compatible. The ordering comes from conviction, not from step numbers.

**Recommendation**: Use both. Dependency declarations in doctrine, conviction statements in ethos. The conviction provides resilience when the doctrine is ambiguous.

### Risk rating: **MEDIUM**

Most ordering is naturally enforced. The two non-natural constraints (validate-before-delegate, retry-before-escalate) need explicit expression in the replacement model.

---

## 5. Risk Assessment of Audit's Recommended Corrections

### Correction 1: Eliminate named phase headings in process.md

- **Guardrail removed**: Named phases as cognitive forcing functions (G1, G2, G4)
- **Worst-case regression**: Agent skips quality validation (G2) because there is no named checkpoint forcing it. Agent delegates before validating (G4) because there is no step ordering.
- **Function model protection**: Explicit enumerated preconditions replace named checkpoints. Dependency declarations replace step ordering. The preconditions must be specific and individual, not summarized.
- **Risk**: High for G2 (preflight), medium for G1 and G4.

### Correction 2: Replace `running` / `running-with-evidence` with terminal outcomes

- **Guardrail removed**: None. This is removing a defective concept, not a guardrail.
- **Worst-case regression**: Minimal. The current `running` return value is itself a problem -- it implies the function has not finished. Replacing it with `complete-with-evidence` is strictly more correct.
- **Function model protection**: Terminal outcomes are the natural function model. No additional protection needed.
- **Risk**: Low. This is a pure improvement.

### Correction 3: Remove `handoff-received` ledger event

- **Guardrail removed**: Acknowledgment of input receipt (G1 indirectly).
- **Worst-case regression**: No record that the tech-lead was invoked if it crashes before producing output. In practice, the caller knows it invoked the function.
- **Function model protection**: The function call itself is evidence of invocation. If observability is needed, the harness (not the agent) provides it.
- **Risk**: Low. The caller logs its own calls.

### Correction 4: Remove "intake/preflight" references from handoff-contract.md

- **Guardrail removed**: G6 -- the prohibition on execution-lead returning only a validation check.
- **Worst-case regression**: Execution-lead returns "package validated, looks good" as a terminal result without doing any execution work. This is the exact failure the prohibition was designed to prevent.
- **Function model protection**: The handoff contract must specify what a complete return looks like: evidence of first-phase execution work (files changed, tests run, outcomes observed). The prohibition must be restated without naming execution-lead's internal phases.
- **Risk**: High. The replacement phrasing must be precise.

### Correction 5: Rename "Intake Summary" in template.md

- **Guardrail removed**: None. The section content (appetite, no-gos, assumptions) is preserved; only the heading changes.
- **Worst-case regression**: Negligible. "Source Constraints" or "Shaped Context" conveys the same information.
- **Function model protection**: Not needed -- this is cosmetic.
- **Risk**: None.

### Correction 6: Audit the ledger model

- **Guardrail removed**: Intermediate progress visibility (G8 indirectly -- ledger entries make self-production detectable).
- **Worst-case regression**: If ledger entries move from intermediate appends to return-value inclusion, observers lose real-time visibility into what the agent is doing. This matters for long-running orchestration.
- **Function model protection**: The function returns a complete event log as part of its output. Observability becomes retrospective rather than real-time. This is a legitimate tradeoff.
- **Risk**: Medium. The observability loss is real but may be acceptable if the harness provides execution tracing independently.

---

## 6. Proposed Replacement Guardrails

For each high-risk item, a function-model-compatible guardrail.

### R1: Replace "Preflight Quality Gate" (for G2)

**Conviction-based** (ethos addition):

> Weak preparation is delayed production failure. An unexamined input propagates its defects to every downstream artifact.

**Output-requirement-based** (doctrine):

> **Preconditions (rejection on failure):**
> - Problem statement is explicit and bounded
> - Appetite is stated with concrete constraint
> - No-gos are enumerated
> - Major uncertainties are surfaced
>
> Precondition failure returns `{ outcome: "rejected", defects: [specific items], route: "shaper" }` without proceeding to delegation.

**Testable**: Examine the output. If the output contains specialist artifacts but the input shape has vague problem boundaries, the precondition was skipped.

### R2: Replace "Intake chat is not a completion state" (for G3)

**Conviction-based** (ethos addition):

> Invocation demands outcome. Receiving a request and summarizing it back is not work -- it is echo.

**Output-requirement-based** (doctrine):

> A complete return contains a terminal stage outcome (`ready-for-execution | blocked`) with full payload per the output contract. A return that contains only input context restatement or a conversational summary is incomplete.

**Testable**: Examine the output. Does it contain a terminal outcome with artifact paths, or does it restate the input?

### R3: Replace "Intake/preflight pass alone is not a terminal return for execution-lead" (for G6)

**Conviction-based** (handoff-contract reformulation):

> A return must demonstrate execution, not merely readiness assessment.

**Output-requirement-based** (handoff-contract):

> Execution-lead returns one of:
> 1. `complete-with-evidence`: first-phase files changed, verification commands run, outcomes observed.
> 2. `blocked`: explicit blocker list with ownership and recommended next action.
>
> A return that contains only package validation results (e.g., "all fields present, package is coherent") is not a complete result.

**Testable**: Examine the return. Does it include changed files and verification outcomes, or only validation statements?

### R4: Replace numbered step ordering (for G4)

**Conviction-based** (ethos):

> Delegating on unvalidated input wastes specialist work and propagates defects.

**Dependency-based** (doctrine):

> Specialist delegation requires all preconditions met.
> Package transfer requires all specialist artifacts evaluated and synthesized.
> Escalation requires exhaustion of correction retries (max 2 per artifact).

**Testable**: Examine whether specialist artifacts were produced from a validated shape. Examine whether escalation happened after retry exhaustion.

### R5: Replace "escalate rather than silently self-produce" (for G8)

**Conviction-based** (ethos):

> Specialist outputs do not self-align. Coherence requires one accountable synthesizer. Synthesis is the leader's role; artifact authorship is the specialist's role.

**Output-requirement-based** (doctrine):

> When specialist delegation fails after retries, return `blocked` with escalation details. Producing specialist-owned artifacts without specialist invocation requires explicit role-collapse authorization from the decision owner.

**Testable**: Examine artifact authorship metadata. Were specialist artifacts produced by specialist invocations or by the tech-lead directly?

---

## 7. The Execution-Lead Completeness Guardrail

handoff-contract.md:48 -- "Intake/preflight pass alone is not a terminal return for execution-lead in this handoff."

### The core problem

This prohibition governs a *downstream agent's behavior*. The tech-lead's handoff contract tells execution-lead what counts as a complete return. Removing the named phases ("intake/preflight") from this prohibition removes the specific failure modes it addresses.

### Why this is harder than the tech-lead's own guardrails

The tech-lead's guardrails govern its own behavior. The execution-lead completeness guardrail governs another agent's behavior *through a contract*. The contract is the only mechanism. If the contract is vague, execution-lead has no constraint.

### Replacement strategy

The contract must define completeness positively (what a complete result contains) rather than negatively (what an incomplete result looks like). The current phrasing is negative: "intake/preflight alone is NOT terminal." The replacement should be positive:

> A complete execution-lead return includes:
> 1. First-phase execution evidence: files changed, verification commands executed, outcomes recorded.
> 2. OR explicit blockers with ownership, recommended action, and impact assessment.
>
> Returns that contain only input validation results (confirmation that the package is readable and complete) are not terminal.

The last sentence preserves the prohibition's force without naming phases. It describes the *content* of an insufficient return rather than the *phase* that produced it.

### Risk rating: **HIGH**

This is the only guardrail that governs a different agent's behavior. The replacement must be at least as specific as the original. The positive-completeness-definition approach is stronger than the negative-phase-prohibition approach because it survives changes to execution-lead's internal structure.

---

## 8. Overall Risk Verdict

### Is the state redemption net-positive?

**Yes, with conditions.** The current stateful model creates real problems:
- Agents can report intermediate progress as if it were output
- `running` as a return value is fundamentally broken -- a returned function is not running
- Named phases invite state-machine thinking, which conflicts with the framework's foundational truth that agents are non-deterministic functions
- The intake-chat failure mode is a *symptom* of the state model, not a cause

The function model resolves these structurally. The risk is in the transition -- specifically, in losing guardrails that address proven failure modes.

### Non-negotiable replacement guardrails (must have)

| ID | Guardrail | Why non-negotiable |
|---|---|---|
| R1 | Enumerated preconditions replacing Preflight | Proven failure mode: agents skip quality validation when it is not a named gate. Generic "validate input" is insufficient. Individual checks must be listed. |
| R2 | Terminal-outcome requirement replacing "intake chat is not a completion state" | Proven failure mode: agents stop at input summary. The replacement must be equally explicit about what constitutes incomplete output. |
| R3 | Execution evidence requirement replacing "intake/preflight pass alone is not terminal" | Governs a downstream agent through a contract. Without specificity, execution-lead can rationalize minimal returns. |
| R5 | Escalate-not-self-produce prohibition | Behavioral temptation guardrail. The agent can always "solve the problem" by violating member ownership. Must survive in any model. |

### Important but not blocking (should have)

| ID | Guardrail | Why important |
|---|---|---|
| R4 | Dependency declarations replacing numbered steps | Most ordering is naturally enforced. Validate-before-delegate is the main risk. |
| Retry limit | Two correction retries per artifact | Policy that is independent of phase naming. Should persist but is not endangered by the redemption. |

### Low risk (nice to have)

| ID | Guardrail | Why low risk |
|---|---|---|
| Correction 2 | Replace `running` with terminal outcomes | Pure improvement. No guardrail is lost. |
| Correction 3 | Remove `handoff-received` ledger event | No guardrail function. Caller observability. |
| Correction 5 | Rename "Intake Summary" | Cosmetic. Zero regression risk. |

### The structural risk

The deepest risk is not any individual guardrail but the *belief that the function model is self-enforcing*. The audit states: "No need to prohibit 'intake chat' if the function model is correct. A function cannot be in a chat state."

This is true of actual functions. LLM agents are not actual functions. They are non-deterministic processes that the framework *models as* functions. The function model is an aspiration, not an enforcement mechanism. Every guardrail replacement must account for the gap between the model and the reality.

The ethos/conviction layer is the bridge across that gap. A conviction ("invocation demands outcome, not echo") narrows the behavioral distribution toward the function model even when the agent's actual execution environment permits conversational states. This is the framework's own foundational truth: "Conviction drives behavior more reliably than instruction."

The replacement guardrails proposed above are therefore grounded in conviction (ethos-level) backed by specific output requirements (doctrine-level). This two-layer approach -- belief + specification -- is the safest path.

---

## Summary

The state redemption is justified and net-positive. The stateful anti-patterns are real, and the function model is the correct target. But four guardrails address proven failure modes and must be replaced with equivalent-force alternatives:

1. **Preflight quality validation** must survive as enumerated preconditions, not generic validation.
2. **"Intake chat" prohibition** must survive as a terminal-outcome output requirement.
3. **Execution-lead completeness** must survive as a positive evidence-of-execution requirement.
4. **Escalate-not-self-produce** must survive as an ownership boundary with authorization gate.

The conviction layer (ethos) is the primary enforcement mechanism. Output requirements (doctrine) are the secondary mechanism. Named phases were a tertiary mechanism that leaked state -- removing them is correct, but only after the primary and secondary mechanisms are strengthened.
