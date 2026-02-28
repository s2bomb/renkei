# Synthesis: State Redemption for tech-lead

**Date**: 2026-02-26
**Input**: 5 independent perspectives (A through E) analyzing the 23-finding state audit
**Purpose**: Convergent decisions and concrete change list for redeeming the tech-lead archetype from stateful anti-patterns

---

## 1. What All 5 Perspectives Agree On

These positions appeared in all 5 analyses independently. They are settled.

### 1.1 `running` / `running-with-evidence` must die

Every perspective identified this as the core violation. A function that has returned cannot be "running." All 5 propose replacing it with terminal vocabulary:
- **A**: `complete-with-evidence`
- **B**: `complete-with-evidence` (with `execution-blocked` and `not-attempted` as additional variants)
- **C**: `complete-with-evidence`
- **D**: `complete-with-evidence` (or `complete`)
- **E**: Confirms this is a "pure improvement" with zero guardrail risk

**Decision**: Replace `running-with-evidence` with `complete-with-evidence` and `running` with `complete` in all 6 locations. This is the safest change in the entire redemption.

### 1.2 `handoff-received` must be killed

All 5 agree. Functions do not acknowledge receipt of arguments. The call itself is evidence. C provides the strongest grounding: it creates orphan risk on crash, carries no non-derivable information, and violates honest-signatures.

**Decision**: Remove `handoff-received` from process.md:11, output-contract.md:26, and the template event ledger expectation.

### 1.3 Named phases ("Intake", "Preflight") must be removed as headings

All 5 agree these are the structural source of the state machine. A proposes collapsing 7 steps into 3 sections (Input Validation, Technical Preparation, Stage Outcome). E agrees but insists the replacement for Preflight must enumerate specific quality checks, not summarize as generic validation.

**Decision**: Collapse to 3 unnamed-milestone sections. The Input Validation section MUST enumerate the specific precondition checks individually (not as "validate input quality").

### 1.4 "Intake Summary" becomes "Shaped Context"

All perspectives that addressed the template (A, B, D) converge on this exact name. E confirms zero risk.

**Decision**: Rename the heading. Content unchanged.

### 1.5 Remove references to execution-lead's internal phases

All 5 agree that tech-lead's doctrine should not name "intake" or "preflight" as observable states of execution-lead. D provides the principle: "the tech-lead specifies what a valid return looks like; it does not specify what internal work produces that return."

**Decision**: Remove all "intake/preflight" references from handoff-contract.md and replace with outcome-based quality bars.

### 1.6 The ethos layer is clean

All 5 confirm. No changes needed to identity.md, tenets.md, or principles.md. The contamination is entirely doctrinal.

### 1.7 Ledger events should be return-value data, not side effects

A, B, and C converge independently: events accumulated during execution should be returned as structured data, not appended to external ledgers mid-execution. C provides two options (caller appends vs write-on-return) and recommends caller-appends. B concurs.

**Decision**: Events are part of the return payload. The caller (or harness) persists them. No intermediate ledger appends during execution.

---

## 2. Where They Disagree and Resolutions

### 2.1 Return type granularity

**A** proposes 3 return variants: `TechnicalPackage | BlockedResult | InputDefect`
**B** proposes 4 top-level outcomes: `ready-for-execution | blocked | invalid-input` with a nested execution-lead level (`complete-with-evidence | execution-blocked | not-attempted`)
**D** proposes 2 execution-lead outcomes: `Complete | Blocked` (opaque evidence)

**Tension**: How many return variants does the doctrine need to express?

**Resolution**: The doctrine files are markdown guidance, not type systems. Overspecifying the return type in doctrine creates rigidity. The doctrine needs to express:
1. Success with execution evidence
2. Success but execution-lead blocked
3. Tech-lead blocked (package couldn't be completed)
4. Invalid input (route to shaper)

These four are genuinely distinct -- they route differently. But the doctrine should express them as narrative branches, not as a formal type hierarchy. B's two-level structure (tech-lead outcome + nested execution-lead result) is the correct mental model, but the doctrine should describe it in prose, not pseudo-types.

**Decision**: Four distinct outcomes described in prose. tech-lead level: `ready-for-execution | blocked | invalid-input`. execution-lead level (nested when applicable): `complete-with-evidence | blocked`. The doctrine describes these as return branches in the Stage Outcome section, not as formal types.

### 2.2 Should the handoff contract prescribe evidence structure?

**D** says no: "Say 'evidence of execution work' instead of 'files changed, verification commands run, outcomes.' Execution-lead decides its evidence format."
**E** says yes for the evidence requirement: "first-phase files changed, verification commands run, outcomes observed" -- specificity is the guardrail against execution-lead returning only validation results.

**Tension**: Boundary preservation (don't dictate callee's internals) vs guardrail strength (vague evidence requirements let execution-lead rationalize minimal returns).

**Resolution**: E wins on specificity. The evidence requirement is the only mechanism governing a downstream agent's completeness. D's principle is correct in general -- the caller should not name the callee's internal phases -- but evidence structure is different from internal process. "Files changed, verification commands run, outcomes observed" describes *what evidence looks like*, not *how the callee organizes its work*. The phrasing should be: "evidence demonstrating execution work occurred (e.g., files changed, verification commands executed, outcomes observed)" -- the "e.g." makes it exemplary rather than prescriptive, but the specificity prevents rationalization.

**Decision**: Keep evidence examples in the handoff contract. Use "e.g." framing. Remove internal phase names.

### 2.3 `handoff-issued` verdict

**A** removes it as part of eliminating intermediate ledger appends.
**C** explicitly kills it: "implementation detail absorbed by the transfer event."
**B** removes it implicitly.

**No disagreement, but worth noting**: The `transfer` event (C's proposal) captures the meaningful information that `handoff-issued` + `handoff-result` currently capture. The two events collapse into one.

**Decision**: Kill `handoff-issued`. The `transfer` event in the return payload replaces both `handoff-issued` and `handoff-result`.

### 2.4 How to handle the "intake chat" prohibition

**A**: Replace with "Conversation without terminal output is not a completion state."
**B**: Remove it entirely -- "If the model is a function, there is no chat state to prohibit."
**E**: This is the second-highest risk. Must replace with equally forceful output requirement: "Return that contains only input context restatement is incomplete."

**Tension**: B says the function model makes the prohibition unnecessary. E says the function model is not self-enforcing on LLM agents.

**Resolution**: E is correct. LLM agents are not actual functions. The function model is an aspiration imposed by the doctrine, not an enforcement mechanism. The proven failure mode (agents stopping at intake chat) was observed in practice. Removing the prohibition without replacement is reckless. A's phrasing is good but generic. E's phrasing is more specific and testable.

**Decision**: Replace with E's output-requirement approach: "A terminal return contains `ready-for-execution | blocked` with full payload. A return that contains only input context restatement or conversational summary is incomplete." This is testable by examining the output.

### 2.5 Should the framework-level "Leader ledger rule" change?

**C** proposes updating AGENTS.md:90 to: "Stage leaders include project/item events for transfer, outcome, and escalation in their return payload." This drops "intake" and changes "append" to "include in return payload."

**No other perspective addressed this directly.**

**Resolution**: The framework-level rule governs all stage leaders, not just tech-lead. Changing it has broader implications. However, the change is consistent with the function model and applies universally. The word "append" implies side effects; "include in return payload" is function-compatible. Dropping "intake" removes acknowledgment semantics from the framework vocabulary.

**Decision**: Update the framework-level rule. This is a framework-wide correction, not a tech-lead-specific change. Note it as a separate, broader change.

### 2.6 Ethos additions

**E** proposes adding conviction statements to ethos to replace guardrails:
- "Weak preparation is delayed production failure."
- "Invocation demands outcome. Receiving a request and summarizing it back is not work -- it is echo."
- "Delegating on unvalidated input wastes specialist work and propagates defects."

**No other perspective proposed ethos changes (all confirmed ethos is clean).**

**Resolution**: E's proposal is correct in direction but has a structural problem. The audit found the ethos layer CLEAN -- it does not need to change. Adding guardrail-driven tenets to ethos because doctrine was wrong is backwards: you derive doctrine from ethos, not the other way around. The existing tenets already ground these behaviors:
- "Ship-ready means execution-ready" (already covers the "invocation demands outcome" conviction)
- "Uncertainty propagates" (already covers the "weak preparation" conviction)

The doctrine changes should express preconditions and output requirements that derive from the existing tenets. If the existing tenets are insufficient, that is a separate finding requiring ethos revision with proper derivation from truths.

**Decision**: No ethos changes in this round. The doctrine changes must be grounded in existing tenets. If observation shows the existing tenets are insufficient after the doctrine redemption, revisit the ethos layer separately with proper derivation.

---

## 3. Concrete Changes

### 3.1 `doctrine/process.md` -- Full restructure (HIGH priority)

**Current**: 7 named steps (Intake, Preflight, Orchestrate, Evaluate, Synthesize, Transfer, Escalate)
**Target**: 3 sections (Input Validation, Technical Preparation, Stage Outcome)

Specific changes:

| What | Current | Proposed |
|---|---|---|
| Structure | Steps 1-7 with named headings | 3 sections: `## Input Validation`, `## Technical Preparation`, `## Stage Outcome` |
| Steps 1-2 | "Step 1: Intake Active Shape" + "Step 2: Preflight Quality Gate" | Merged into "Input Validation" with enumerated preconditions (not generic validation) |
| Preconditions | Scattered across Steps 1-2 | Explicit list: (1) scaffold exists, (2) problem statement explicit, (3) appetite stated, (4) no-gos enumerated, (5) major uncertainties surfaced |
| Steps 3-5 | Three separate named steps | Merged into "Technical Preparation" as the delegation/evaluation/assembly loop |
| Steps 6-7 | "Transfer" and "Escalate" as separate steps | Merged into "Stage Outcome" as return branches |
| Line 11 | `Append intake event ... (handoff-received)` | **Delete** |
| Lines 69-71 | Prescribes execution-lead's internal behavior | Replace with: "Execution-lead returns either `complete` with evidence of execution work, or `blocked` with explicit blocker ownership." |
| Line 77 | `running-with-evidence` | `complete-with-evidence` |
| Lines 75-77 | `Append transfer events` (3 lines of side-effect appends) | Replace with: "Include transfer event in return payload: type, target, outcome, evidence or blockers." |
| Line 86 | `Record escalation events in project and item ledgers` | "Include escalation event in return payload." |

### 3.2 `doctrine/handoff-contract.md` -- Rewrite two sections (HIGH priority)

| What | Current | Proposed |
|---|---|---|
| Lines 26-40: Section name | "Required Transfer Outcome" | "Required Return" |
| Line 30 | `outcome: running` | `outcome: complete` |
| Lines 31-34 | "concrete first-phase progress evidence" (prescribes internal structure) | "evidence demonstrating execution work occurred (e.g., files changed, verification commands executed, outcomes observed)" |
| Line 36 | `or, if blocked at intake/preflight:` | `or, if blocked:` (no phase names) |
| Lines 42-50: Section name | "Transfer Rule" | "Invocation Rule" |
| Line 46 | "After transfer, execution-lead immediately runs execution stage" | **Delete** (prescribes internal behavior) |
| Line 48 | "Intake/preflight pass alone is not a terminal return" | "Validation-only results are not complete. A complete return includes evidence of execution work beyond input validation." |
| Line 50 | "ownership returns to tech-lead" | "tech-lead processes the blockers: correct and re-invoke, or escalate." |
| Line 54 | "correction cycles" | "re-invocations" |

### 3.3 `doctrine/output-contract.md` -- 3 line changes (MEDIUM priority)

| Line | Current | Proposed |
|---|---|---|
| 25 | `running-with-evidence \| blocked` | `complete-with-evidence \| blocked` |
| 26 | `project/item event ledger entries for intake, handoff, and escalation` | `stage event log: outcome, transfer (if execution-lead invoked), escalation (if escalated)` |
| 38 | `Project and item event ledgers are updated for stage actions` | `Stage event log is complete in return payload` |

### 3.4 `doctrine/pipeline.md` -- 1 line change (MEDIUM priority)

| Line | Current | Proposed |
|---|---|---|
| 22 | `transfer record to execution owner (running or blocked)` | `transfer record to execution owner (complete-with-evidence or blocked)` |

### 3.5 `doctrine/orchestration.md` -- 2 line changes (LOW-MEDIUM priority)

| Line | Current | Proposed |
|---|---|---|
| 7 | `Intake chat is not a completion state.` | `A terminal return contains ready-for-execution or blocked with full payload. A return that contains only input context restatement or conversational summary is incomplete.` |
| 25 | `spec-writer and research-codebase may run in parallel when intake context is complete.` | `spec-writer and research-codebase may run in parallel once input is validated.` |

### 3.6 `doctrine/team-contract.md` -- 1 line change (LOW-MEDIUM priority)

| Line | Current | Proposed |
|---|---|---|
| 36 | `Delegate to specialists when intake packet passes preflight.` | `Delegate to specialists after input validation passes.` |

### 3.7 `references/template.md` -- 3 changes (MEDIUM priority)

| Location | Current | Proposed |
|---|---|---|
| Line 11 | `## Intake Summary` | `## Shaped Context` |
| Line 48 | `Transfer result: running-with-evidence \| blocked` | `Transfer result: complete-with-evidence \| blocked` |
| Line 53 | `If running:` | `If complete:` |

### 3.8 `framework/archetypes/AGENTS.md` -- Framework-level rule update (SEPARATE scope)

| Line | Current | Proposed |
|---|---|---|
| 90 | `Stage leaders append project/item events for intake, transfer, outcome, and escalation.` | `Stage leaders include project/item events for transfer, outcome, and escalation in their return payload.` |

**Note**: This is a framework-wide change affecting all stage leaders, not just tech-lead. It should be tracked as a separate work item and validated against execution-lead's archetype as well.

---

## 4. Priority Order

1. **process.md full restructure** -- This is the root. Most other changes cascade from it.
2. **handoff-contract.md rewrite** -- The cross-boundary contract is the second-worst offender.
3. **output-contract.md line fixes** -- Resolves internal contradiction (line 25 vs line 47).
4. **template.md updates** -- Propagates terminal vocabulary to the output artifact format.
5. **pipeline.md line fix** -- Single-line cascade.
6. **orchestration.md line fixes** -- Replaces intake-chat prohibition with testable output requirement.
7. **team-contract.md line fix** -- Low-severity vocabulary cleanup.
8. **AGENTS.md framework rule** -- Separate scope, separate validation.

---

## 5. What Is NOT Changed

- **Ethos layer**: Clean. No changes.
- **Quality gate criteria**: All survive. They move from named steps to inline sections.
- **Specialist set and dependency rules**: Preserved. Only the phase-name framing changes.
- **Retry limits**: 2 retries preserved.
- **Escalation triggers and routing**: Preserved.
- **Role boundaries and member ownership prohibition**: Preserved.
- **Verbatim propagation**: Preserved.
- **Template field content**: All fields survive. Only section names and status labels change.
- **Required Handoff Payload section**: Already well-designed. No changes.
- **Path Semantics section**: Already correct. No changes.

---

## 6. Verification Criteria

The redemption is successful when:

1. No doctrine file contains the terms `running`, `running-with-evidence`, `handoff-received`, or `handoff-issued`.
2. No doctrine file contains numbered "Step N:" headings.
3. No doctrine file names execution-lead's internal phases ("intake", "preflight" as phases of execution-lead).
4. The term "intake" does not appear as a section heading, ledger event category, or named phase. (It may appear in prose describing what input validation checks, e.g., "validate the shaped artifact" -- but not as a named milestone.)
5. process.md Input Validation section enumerates at least 4 specific precondition checks (not generic "validate input").
6. orchestration.md contains a testable output-completeness requirement replacing the intake-chat prohibition.
7. All return values across all files are terminal (describe what was produced, not what is happening).
8. Ledger/event instructions use return-value language ("include in return payload") not side-effect language ("append to ledger").
