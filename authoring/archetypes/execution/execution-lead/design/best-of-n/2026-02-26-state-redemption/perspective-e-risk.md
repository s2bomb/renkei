# Perspective E: Risk/Regression Analysis

## Analytical Lens

What are the risks of removing the "do not return intake/preflight-only" safeguards and relying on the function model alone? Is the function model sufficient? What new guardrails replace the old ones? What could go wrong?

---

## 1. What the Safeguards Currently Protect Against

The current archetype contains three explicit safeguard instances that prevent the agent from returning without doing real work:

**Safeguard A** -- process.md line 40: `If preflight passes, continue immediately to Step 3 in this invocation. Do not return intake/preflight-only responses.`

**Safeguard B** -- orchestration.md lines 26-32: The entire "Intake Return Rule" section, which says: `Do not return intake/preflight pass as a terminal response. Return to parent leader only when: (1) first execution phase attempt produced concrete evidence, or (2) execution is blocked.`

**Safeguard C** -- handoff-contract.md line 31: `Intake/preflight pass is non-terminal. Return only after first execution phase attempt with evidence, or blocked.`

These three safeguards protect against one specific behavior: **the agent validating inputs, confirming they look good, and then returning "intake passed" as if that were a useful result.** This is the most common failure mode for LLM-based agents with named phases -- they interpret completing a named phase as completing a unit of work, and they return to report it.

The behavior these safeguards prevent:
1. Agent receives package, validates fields, returns "intake successful" with no execution evidence.
2. Agent runs preflight checks, confirms plan is usable, returns "preflight passed" with no test files written.
3. Agent treats validation as a billable milestone -- consuming an invocation cycle while producing nothing the caller didn't already know.

These are real behaviors. Non-deterministic agents, especially under token pressure or ambiguous instructions, will find the path of least resistance. Named phases with completion semantics create an attractive stopping point: the agent "did something" (validated inputs), it has a name for what it did ("intake"), and it has a return value to report ("passed"). All three conditions for premature return are met.

---

## 2. Why the Safeguards Are Symptomatic

The audit document (Finding 5, Finding 10, Finding 13) correctly identifies that these safeguards are patches. The structural argument:

1. Process.md names "Intake" as Step 1 and "Preflight" as Step 2.
2. Named steps have completion semantics -- they can be "done."
3. An agent that completes a named step naturally wants to report it.
4. The safeguards say "don't report it" -- suppressing the behavior that the naming created.

In a function model, this dynamic does not arise. A function has:
- **Input validation** -- the first few lines of the function body. Not a phase. Not reportable.
- **Work** -- the body of the function. Produces artifacts.
- **Return** -- the terminal result. Either evidence of work done, or an error explaining why no work was possible.

There is no concept of "I validated my inputs and I'm returning to tell you about it." The function either produces its result or it errors. Input validation that passes is not observable to the caller -- it is a non-event, like a successful type check at compile time.

This is correct and sound. The function model eliminates the *structural incentive* to return from validation. The safeguards are treating a symptom (premature return from named phases) while the function model eliminates the cause (naming the phases).

---

## 3. Risk: The Function Model Alone May Not Be Sufficient

The audit's thesis is: remove the named phases, and the safeguards become unnecessary. This is largely true but not completely true. Here is the gap:

**Scenario: Post-validation blocker.** The agent validates inputs (all fields present), starts preflight (plan is readable), then discovers the plan has no explicit test obligations. Under the current model, this is "preflight failed" and the agent returns defects to tech-lead (process.md line 38). Under the function model, what is this?

It is an **error return with structured defect information.** The function validated its inputs (fields exist), began work, discovered a semantic defect in the input data (plan lacks required content), and returned an error. This is clean. The function model handles this naturally -- it's analogous to a function that validates a file path exists (input validation) but then discovers the file's contents are malformed (semantic error during execution).

**Scenario: Ambiguous stopping point.** The agent validates inputs, begins delegating test-implementer, test-implementer returns with evidence, and then the agent decides it has "enough evidence for a first return." Without the explicit safeguard saying "continue to Step 4," does the function model prevent this?

This is the real risk. The safeguard in process.md line 55 says: `First return to tech-lead after successful transfer must include concrete execution evidence from this step.` This instruction exists because agents *will* stop at attractive milestones if not told otherwise. The function model helps -- there are no named milestones to stop at -- but the underlying incentive remains: **the agent has produced some evidence, and returning is always cheaper than continuing.**

The function model narrows the stopping-point space but does not eliminate it. Named phases created 5+ stopping points (intake passed, preflight passed, transfer complete, first delegation returned, etc.). The function model reduces this to one: "I have some evidence, should I return or continue?" That's a significant improvement, but it is not zero.

**Scenario: Token/context exhaustion.** An agent running out of context window may be forced to return mid-execution. Under named phases, it might return "preflight passed, blocked on context." Under the function model, what does it return? This is actually identical in both models -- the agent returns whatever partial evidence it has with a `blocked` status. The function model is not worse here.

**Assessment: The function model is sufficient for eliminating phase-based premature returns. It is NOT sufficient for eliminating all premature returns.** A small, targeted guardrail is still needed -- but it should be function-model-native, not a patch on named phases.

---

## 4. Risk: Loss of Diagnostic Information

The phase names "intake" and "preflight" currently provide diagnostic signal:

- "Blocked at intake" means: input fields are missing. The fix is with tech-lead (provide missing fields).
- "Blocked at preflight" means: input fields exist but the plan/specs have semantic defects. The fix is with tech-lead (repair the plan).
- "Blocked at test-implementer" means: inputs were good, plan was usable, but test implementation hit an issue.

Removing the phase names risks collapsing these into a single "blocked" return with less diagnostic precision. If the agent returns `blocked` with `blocker: "test obligations are not explicit in the plan"`, the caller (tech-lead) can still diagnose the issue -- but it requires reading the blocker description rather than checking a phase label.

**How severe is this?** Moderate. The diagnostic information is not lost -- it shifts from structured phase labels to structured blocker descriptions. The blocker descriptions are more informative than phase labels anyway. "Blocked at preflight" tells you *where* it failed; the blocker description tells you *what* failed and *who owns the fix*. The latter is strictly more useful.

**What should replace the phase labels?** The function model's error return should include:
1. **Blocker category**: `input-missing` | `input-defective` | `execution-blocked` | `upstream-defect`
2. **Blocker detail**: specific missing/defective fields or conditions
3. **Blocker owner**: who must act to resolve it
4. **Recommended action**: what the owner should do

This is richer than "blocked at intake" and does not require named phases. The categories above map to the same diagnostic space:
- `input-missing` ≈ "blocked at intake"
- `input-defective` ≈ "blocked at preflight"
- `execution-blocked` ≈ "blocked during work"
- `upstream-defect` ≈ "blocked by something tech-lead produced"

---

## 5. Risk: Regression in Multi-Session Scenarios

The orchestration.md "Intake Return Rule" (lines 26-32) exists because of a real operational pattern: tech-lead invokes execution-lead, execution-lead discovers a blocker, returns `blocked`, tech-lead fixes the issue, and re-invokes execution-lead. This is multi-session execution.

The current model handles this through the handoff-contract.md "Escalation Rule" (line 47): `If two correction cycles fail to clear intake blockers, escalate to decision owner.` This implies the function can be called multiple times with corrected inputs.

**Does the function model handle re-invocation?** Yes, naturally. A function that returns an error can be called again with corrected inputs. There is no stateful resumption needed -- the function starts fresh, validates inputs (which now pass), and proceeds. This is exactly how retry logic works in any system.

**What about partial progress across sessions?** If execution-lead delegates test-implementer successfully (producing test files on disk), then encounters a blocker during implement-plan, it returns `blocked` with the test evidence and the blocker. When re-invoked, it must:
1. Validate inputs (still valid)
2. Check whether test files already exist (they do -- on disk)
3. Skip re-delegating test-implementer (or verify the existing work is still valid)
4. Resume from implement-plan

This is where the function model has a genuine gap. A pure function is stateless -- it does not remember previous invocations. But execution-lead operates on the filesystem, which IS the state. Test files on disk are the evidence that a previous invocation completed that phase. The function model handles this not through internal state but through **external state on the filesystem.**

**What guardrail is needed?** The process description should explicitly instruct the agent to check for existing artifacts before re-delegating. Something like: "Before delegating, check whether the delegate's expected output artifacts already exist and are valid. If so, verify rather than re-delegate." This is idempotency -- a property of well-designed functions -- not a named phase.

**Assessment: The multi-session risk is real but manageable.** The filesystem provides the state. The function model needs an explicit idempotency instruction, not a named resumption phase.

---

## 6. Proposed Replacement Guardrails

The following guardrails are function-model-native and replace the three safeguards identified in section 1:

### Guardrail 1: Terminal-Only Return Rule

**Replaces**: Safeguards A, B, C (the "do not return intake/preflight-only" instructions).

**Statement**: "Return only terminal outcomes. A terminal outcome is either (a) execution evidence with verification results for at least one delegated phase, or (b) a structured error with blocker category, detail, owner, and recommended action. Input validation that passes is not a return event."

**Why it works**: It defines what CAN be returned, rather than listing what CANNOT. The old safeguards were blacklists ("don't return intake-only"). This is a whitelist ("return only these shapes"). Whitelists are structurally safer -- they fail closed.

### Guardrail 2: Structured Error Return Shape

**Replaces**: The diagnostic signal currently provided by phase names.

**Statement**: "Error returns include: `blocker_category` (`input-missing` | `input-defective` | `execution-blocked` | `upstream-defect`), `blocker_detail` (specific fields/conditions), `blocker_owner` (who must act), `recommended_action` (what they should do)."

**Why it works**: It provides equal or better diagnostic precision without requiring named phases. The categories are properties of the error, not properties of the agent's internal execution state.

### Guardrail 3: Idempotency Check Before Delegation

**Replaces**: Nothing directly -- this is new, addressing the multi-session gap exposed by removing stateful phase tracking.

**Statement**: "Before delegating to a member, verify whether the member's expected output artifacts already exist on disk and are valid. If valid artifacts exist, verify them rather than re-delegating. If invalid or absent, delegate normally."

**Why it works**: It makes re-invocation safe without requiring the function to remember previous invocations. The filesystem is the state store. This is standard idempotent function design.

---

## 7. The "Minimum Evidence" Question

**Position: An error return with structured blocker information IS sufficient. Minimum evidence in the return value should NOT be required for error cases.**

Reasoning:

The old safeguards conflated two concerns: (1) don't return without doing work (correct), and (2) always include execution evidence (over-constrained). There are legitimate cases where the function cannot produce any execution evidence:

- All input fields are present but the plan path points to a corrupted or empty file. No delegation is possible. The correct return is `{blocker_category: "input-defective", blocker_detail: "plan file at [path] is empty", blocker_owner: "tech-lead"}`. Requiring minimum evidence here would force the agent to fabricate or pad its return.

- The execution worktree path does not exist and cannot be created. No code changes are possible. The correct return is an error with the specific filesystem issue.

For **success cases**, minimum evidence should be required. The terminal-only return rule (Guardrail 1) already handles this: a successful return must include "execution evidence with verification results for at least one delegated phase." You cannot return `complete` without evidence.

For **error cases**, the structured error shape (Guardrail 2) is sufficient. The blocker category, detail, and owner ARE the evidence -- they prove the agent investigated and identified a specific problem rather than bailing out generically.

**The line is**: success returns require evidence of work done. Error returns require evidence of investigation done. Both are evidence, but of different kinds.

---

## 8. Risk Matrix

| # | Risk | Likelihood | Impact | Acceptable? | Mitigation |
|---|---|---|---|---|---|
| R1 | Agent returns after validation without doing work (the exact behavior safeguards prevent) | **Low** | **High** | No -- must mitigate | Guardrail 1 (terminal-only return rule with whitelist shape) |
| R2 | Agent stops at first delegation return instead of continuing through full pipeline | **Medium** | **High** | No -- must mitigate | Guardrail 1 explicitly requires "at least one delegated phase" evidence for success returns; process description defines the full pipeline as the work scope, not any single delegation |
| R3 | Loss of diagnostic precision in blocked returns | **Medium** | **Medium** | Acceptable with mitigation | Guardrail 2 (structured error return with blocker categories) |
| R4 | Multi-session re-invocation re-does work that was already completed | **Medium** | **Low** | Acceptable with mitigation | Guardrail 3 (idempotency check before delegation) |
| R5 | Agents reference "intake" vocabulary despite removal from archetype (vocabulary echo from training data or neighboring archetypes) | **High** | **Low** | Acceptable | Vocabulary cleanup across all files; tenet rewording propagates via verbatim propagation; residual echo is cosmetic, not behavioral |
| R6 | New guardrails are insufficient and agent discovers novel premature return paths | **Low** | **Medium** | Acceptable | The whitelist approach (Guardrail 1) fails closed -- novel return shapes that don't match the whitelist are by definition non-terminal, and the instruction is "return only terminal outcomes" |
| R7 | Template changes (removing Intake section, running-with-evidence) break downstream consumers that parse the old format | **Medium** | **Medium** | No -- must mitigate | Version the template change; update any harness/tooling that parses execution reports; ensure tech-lead's handoff expectations align with new output shape |

### Summary by severity

**Must mitigate (High impact, not acceptable):**
- R1: Premature validation-only return. Mitigated by Guardrail 1.
- R2: Premature partial-evidence return. Mitigated by Guardrail 1 plus explicit pipeline scope in process description.
- R7: Template breaking change. Mitigated by coordinated update across consuming archetypes.

**Should mitigate (Medium impact, acceptable with guardrails):**
- R3: Diagnostic precision loss. Mitigated by Guardrail 2.
- R4: Re-invocation redundancy. Mitigated by Guardrail 3.
- R6: Novel return paths. Mitigated by whitelist structure of Guardrail 1.

**Accept (Low impact):**
- R5: Vocabulary echo. Cosmetic. Fades as vocabulary is cleaned.

---

## Conclusions

1. **The function model is structurally superior to the current named-phase model.** It eliminates the root cause (named phases with completion semantics) rather than patching the symptom (safeguards saying "don't report named phases"). The audit's diagnosis is correct.

2. **The function model alone is not sufficient.** Removing the safeguards without replacement creates a regression risk (R1, R2). Three targeted, function-model-native guardrails are needed: terminal-only return rule, structured error return shape, and idempotency check.

3. **The net guardrail count decreases.** Three scattered safeguards across three files (process.md, orchestration.md, handoff-contract.md) are replaced by one whitelist return rule (Guardrail 1) in the return contract. This is simpler, more precise, and fails closed.

4. **Diagnostic information improves, not degrades.** Structured blocker categories with owner and recommended action provide more diagnostic signal than phase labels. The risk of diagnostic loss (R3) is a misconception -- the replacement is richer than the original.

5. **Multi-session scenarios are handled by filesystem idempotency, not internal state.** This is consistent with the foundation principle "compute, don't remember" (AGENTS.md). The filesystem is the truth; the function checks it on every invocation.

6. **The highest unaddressed risk is R7 -- template breaking change.** The template.md changes (removing `## Intake`, `running-with-evidence`, `If running:`) change the output artifact structure. Any downstream consumer (tech-lead's parsing expectations, decision-owner report format) must be updated in the same change. This is a coordination risk, not a model risk.
