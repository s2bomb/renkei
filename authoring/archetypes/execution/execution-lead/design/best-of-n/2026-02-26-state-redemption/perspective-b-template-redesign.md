# Perspective B: Template Redesign

Date: 2026-02-26
Lens: The output template (`references/template.md`) as the critical fix point.

---

## 1. Current Template Problems

The template is the physical form of the function's return type. Every agent filling it out is structurally forced to produce whatever shape the template encodes. If the template encodes status reporting, every execution report will contain status reporting -- regardless of what the doctrine says. The template is the enforcement mechanism, not the doctrine articles.

Three specific anti-patterns:

### 1.1 `running-with-evidence` as a Transfer Outcome (line 15)

```
- Transfer outcome: running-with-evidence | blocked
```

This is the most severe defect. The foundation (AGENTS.md line 16) states: "Agents are non-deterministic functions. They are closer to computer functions than to humans -- stateless, terminal, composable." A function that has returned cannot be "running." The value `running-with-evidence` says: "I am currently executing and here is some evidence of progress." But the agent has finished -- it is producing this report *as its return value*. The report is terminal output, not a status update.

The field is also misplaced structurally. It lives in the `## Intake` section (lines 11-26), meaning it reports the outcome of receiving inputs, not the outcome of the work. The actual terminal outcome already exists at line 54: `complete | blocked | escalated`. So the template has *two* outcome fields -- one for "how did input receipt go?" (status) and one for "what was the result?" (terminal). The first is acknowledgment semantics. The second is the function return value. Only the second should exist.

### 1.2 `If running:` Conditional Branch (lines 20-26)

```
If running:
- files changed:
- verification commands:
- outcomes:
```

This encodes two return shapes in one template -- one for the "running" state and one for the "blocked" state. Under the function model, there is one return shape: the terminal result. The conditional means an agent filling out the template must first determine its "state" and then choose which branch to fill in. This is state-machine logic embedded in a return value.

The content under `If running:` (files changed, verification commands, outcomes) is *execution evidence*. It belongs unconditionally in the `## Evidence` section. Evidence is evidence whether the stage completed, blocked mid-way, or escalated. By gating it behind `If running:`, the template implies that blocked stages produce no evidence -- which is false. A stage that blocks after completing test implementation has evidence (test files, commits) even though the stage outcome is `blocked`.

### 1.3 `## Intake` Section (lines 11-26)

The entire section is acknowledgment semantics. It reports:
- Who sent the package (`Package source`)
- Who authorized the handoff (`Handoff issuer role`)
- Whether input receipt succeeded (`Transfer outcome`)
- What was wrong if it didn't (`Blocking gaps`)
- What to do about it (`Recommended next action`)

Under the function model: the caller already knows it called the function and what arguments it passed. Reporting "I received your package from tech-lead" in the return value is the function telling its caller "I received the arguments you gave me." This is noise.

The `## Intake` section also conflates two distinct failure modes: (1) input validation failure (bad arguments -- the function should return an error immediately) and (2) execution failure (good arguments, work failed partway through). By having a dedicated Intake section with its own outcome field, the template treats input validation as a *phase with reportable results* rather than a precondition that either passes silently or causes immediate error return.

---

## 2. The Replacement Template

### Design Principle

The template structures the output of a completed function call. The function was invoked with inputs (the handoff package), it did work (delegated to test-implementer, implement-plan, validate-plan), and it returned a result. The template is the shape of that result.

A function returns ONE of:
- **Success**: here is the evidence bundle, the work is done, here is the outcome.
- **Error**: here is what failed, what was tried, who owns the blocker.

There is no "running" state. There is no "I received your inputs" acknowledgment. There is no conditional branching based on internal state.

### The Replacement

```markdown
# Execution Stage Report

## Metadata

- Date: YYYY-MM-DD
- Item ID: item-###
- Active workspace: shaped-items/active/item-###/
- Execution worktree path:
- Report path: shaped-items/active/item-###/working/execution-report.md

## Work Performed

Summary of phases attempted and their results:

- Test implementation:
  - delegate: `test-implementer`
  - files changed:
  - commits:
  - verification result:
- Implementation:
  - delegate: `implement-plan`
  - files changed:
  - commits:
  - verification result:
- Validation:
  - delegate: `validate-plan`
  - validation report path:
  - coverage: full | partial
  - deviations:

Phases not attempted (if any) and reason:
-

## Evidence Bundle

- Plan path:
- Test spec path(s):
- Test implementation commits:
- Implementation commits:
- Validation report path:

## Issues

- Critical issues:
  -
- Unresolved decisions:
  -
- Upstream defects routed to owner:
  -

## Scope

- Must-have outcome:
- Nice-to-have deferrals:
  -
- Accepted risks:
  -

## Outcome

- Stage outcome: stage-complete | stage-blocked | stage-escalated
- Blocker ownership (if blocked/escalated):
- Recommended next action:

## Event Ledger

- Project event entries:
  -
- Item event entries:
  -
```

### What Changed and Why

1. **`## Intake` section eliminated.** Input metadata (who called, what was passed) is known to the caller. If provenance must be recorded, it is captured in the event ledger as part of the outcome event -- not as a separate acknowledgment section.

2. **`Transfer outcome` field eliminated.** No `running-with-evidence | blocked` binary. The single `Stage outcome` field in `## Outcome` is the one terminal result.

3. **`If running:` conditional eliminated.** Evidence of work done (files changed, verification commands, outcomes) is now in `## Work Performed` unconditionally. Whether the stage completed, blocked, or escalated, the work performed section captures what was actually done.

4. **`## Work Performed` added.** This is the narrative section: which phases were attempted, what each produced, and which phases were not attempted (with reason). This replaces both the `If running:` conditional content and the implicit assumption that blocked stages have no evidence.

5. **`## Evidence Bundle` is unconditional.** Evidence exists regardless of outcome. A stage that blocks after test implementation still has test commits. A stage that escalates after validation still has implementation evidence. The evidence section captures whatever was produced.

6. **`## Issues` consolidates defects.** Critical issues, unresolved decisions, and upstream defects are in one place. Previously, some of this lived in `## Intake` (blocking gaps), some in `## Coverage and Quality` (critical issues), and some in `## Scope and Risk` (unresolved decisions). The new structure separates what-went-wrong from what-was-deferred.

7. **`## Scope` is separated from issues.** Scope is about appetite management (must-haves, deferrals, accepted risks). Issues are about defects and blockers. These are different concerns and belong in different sections.

---

## 3. Outcome Vocabulary

The current template uses two outcome fields with overlapping vocabulary:

| Current field | Current values | Problem |
|---|---|---|
| Transfer outcome (line 15) | `running-with-evidence \| blocked` | Status value; "running" is not terminal |
| Execution outcome (line 54) | `complete \| blocked \| escalated` | Terminal; correct concept, wrong naming |

### Replacement Vocabulary

One outcome field. Three terminal values. Prefixed with `stage-` to make the scope unambiguous:

| Value | Meaning | When used |
|---|---|---|
| `stage-complete` | All required phases finished. Evidence bundle is complete. Validation passed. | Normal success path |
| `stage-blocked` | Cannot proceed. Explicit blocker with ownership. Partial evidence may exist. | Input validation failure, upstream defect, gate failure after retries |
| `stage-escalated` | Requires decision-owner judgment. Work may be partially complete. | Strategic scope tradeoffs, risk acceptance, ambiguity the execution team cannot resolve |

Why `stage-` prefix:
- The pipeline (pipeline.md) has multiple stages: shaper, tech-lead, execution-lead, decision owner. Each stage owns its outcome namespace. `complete` is ambiguous -- complete *what*? `stage-complete` is unambiguous -- the execution stage is done.
- The output-contract.md line 25 already uses `complete | blocked | escalated` without prefix. Adding the prefix aligns the template with pipeline-level vocabulary where multiple stages exist.

Why not `running-with-evidence`:
- "Running" describes an ongoing process. The report is a terminal artifact. These are contradictory.
- "With-evidence" is a qualifier on a status, not an outcome. Evidence is part of the return value structure, not part of the outcome label.

Why not `stage-partial`:
- Considered but rejected. "Partial" implies incomplete but not blocked -- which is a state, not an outcome. If some phases completed and the stage is blocked, the outcome is `stage-blocked` and the `## Work Performed` section shows which phases finished. If some phases completed and the stage can still continue, the function is not done yet and should not be returning. There is no legitimate case where a function returns "I did some work, I'm not blocked, but I'm stopping anyway."

---

## 4. Section Structure

### Current Structure (6 sections + conditional)

```
## Metadata          -- report identity
## Intake            -- acknowledgment of inputs + conditional branch
## Evidence          -- artifact paths
## Coverage/Quality  -- requirement coverage + critical issues
## Scope and Risk    -- must-haves, deferrals, decisions, risks
## Outcome           -- terminal result
## Event Ledger      -- ledger entries
```

Problems: Intake is acknowledgment. Coverage/Quality mixes evidence assessment with defect reporting. Scope and Risk mixes appetite management with unresolved issues. The conditional branch inside Intake creates two document shapes.

### Replacement Structure (7 sections, no conditionals)

```
## Metadata          -- report identity (who, when, where)
## Work Performed    -- what was attempted, per-phase results (unconditional)
## Evidence Bundle   -- artifact paths and commit references (unconditional)
## Issues            -- defects, blockers, upstream problems
## Scope             -- appetite management (must-haves, deferrals, accepted risks)
## Outcome           -- one terminal result + next action
## Event Ledger      -- ledger entries
```

### Design rationale per section

**Metadata**: Unchanged in purpose. Dropped `Execution report:` self-reference (the report knows its own path from context). Added explicit `Execution worktree path` since it is an operational reference the caller needs.

**Work Performed**: New. This is the core replacement for both the `If running:` conditional and the implicit evidence-only model. It answers: "What did you actually do?" For each delegation (test-implementer, implement-plan, validate-plan), it records the delegate, files changed, commits, and verification result. If a phase was not attempted, it says so and why. This section exists regardless of outcome -- a blocked stage still reports what phases were attempted before blocking.

**Evidence Bundle**: Unchanged in purpose. Made unconditional. Previously, some evidence was gated behind `If running:`. Now all produced evidence is listed here regardless of outcome. Empty fields are left empty (not omitted).

**Issues**: New consolidation. Combines: critical issues (from old Coverage/Quality), unresolved decisions (from old Scope/Risk), and upstream defects routed to owner (new -- previously implicit). This answers: "What went wrong or remains unresolved?"

**Scope**: Simplified from old Scope/Risk. Only appetite-management concerns: must-have outcome, deferrals, accepted risks. Unresolved decisions moved to Issues because they are blockers, not scope choices.

**Outcome**: Simplified. One field: `stage-complete | stage-blocked | stage-escalated`. Blocker ownership (required if blocked/escalated). Recommended next action. No conditional branching. No transfer outcome. No dual-outcome structure.

**Event Ledger**: Unchanged. Records project and item ledger entries. The intake event (`handoff-received`) should be removed per the audit -- the stage outcome event is sufficient. The ledger records outcomes, not acknowledgments.

---

## 5. The `If running:` Elimination

### What the conditional does now

The current template has this structure inside `## Intake`:

```
- Transfer outcome: running-with-evidence | blocked
- Blocking gaps (if blocked):
- Recommended next action (if blocked):

If running:
- files changed:
- verification commands:
- outcomes:
```

This creates two document shapes:
1. **Blocked shape**: fill in Transfer outcome as `blocked`, fill in Blocking gaps, fill in Recommended next action. Skip the `If running:` block.
2. **Running shape**: fill in Transfer outcome as `running-with-evidence`, skip Blocking gaps, fill in the `If running:` block with evidence.

The agent must choose a branch. This is control flow in a data structure.

### Why conditionals in templates are anti-patterns

1. **They encode state machines.** The template becomes a state-transition document: "if in state X, fill section A; if in state Y, fill section B." The foundation (AGENTS.md line 16) says agents are functions, not state machines.

2. **They make the return type polymorphic.** The function effectively returns `Result<RunningEvidence, BlockedReport>` -- a tagged union where the shape depends on the tag. But the tag (`running-with-evidence`) is itself a status value that contradicts the function model. A terminal return should have one shape with optional fields, not two shapes selected by a status flag.

3. **They hide evidence.** By gating evidence behind `If running:`, the template implies that blocked stages produce no files-changed, no verification commands, no outcomes. In practice, a stage can block after test-implementer succeeds -- there ARE files changed and verification outcomes. The conditional hides them.

### How the replacement works without conditionals

The replacement template has no conditional branching. Every section is filled unconditionally. The mechanism:

- **Work Performed** lists each phase attempted and its results. If a phase was not attempted, the reason is stated. If a phase produced evidence before the stage blocked, that evidence appears here. The section does not ask "are you running or blocked?" -- it asks "what did you do?"

- **Evidence Bundle** lists all artifact paths and commits produced. If test-implementer ran but implement-plan did not, the test evidence is present and implementation fields are empty. No conditional needed -- just fill in what exists.

- **Issues** lists everything that went wrong. If nothing went wrong, the fields say `none`. If the stage blocked, the blocker and its owner appear here. No need to gate this behind an outcome check.

- **Outcome** is one field with one value. The outcome does not change the document shape -- it classifies the result. A `stage-blocked` report has the same sections as a `stage-complete` report. The difference is in the content of those sections, not in which sections exist.

This is the same principle as honest function signatures (AGENTS.md Code Style: "The signature must tell the truth: what goes in, what comes out, what gets mutated"). The template is the return type signature. A return type that changes shape based on internal state is a dishonest signature.

---

## 6. Impact on Other Files

The template redesign forces corresponding changes:

### output-contract.md

- Remove "intake" from required ledger entries (line 27): change to "project/item event ledger entries for stage outcome and escalation (if any)"
- Remove "Intake contract fields are complete and stage started" quality gate (line 33): replace with "Required input fields are present"
- Update outcome values from `complete | blocked | escalated` to `stage-complete | stage-blocked | stage-escalated`

### process.md

- Remove `handoff-received` ledger event (line 16)
- The `If running:` evidence in the template corresponded to Step 3's "first return" language (line 55). With the template fixed, that line can be simplified to: "Return value must include concrete execution evidence (files changed and verification outcomes), or `stage-blocked` with explicit blocker ownership."

### handoff-contract.md

- "Required Transfer Outcome" section (lines 28-37): align with template's single outcome vocabulary (`stage-complete | stage-blocked | stage-escalated`)
- Remove "Transfer outcome" framing -- there is no transfer, there is a function return

### orchestration.md

- "Intake Return Rule" section (lines 25-32): rename to "Return Contract" and simplify. The content is correct (don't return validation-only results), but the naming reinforces intake as a concept. With the template fixed, the return contract simply says: "Return terminal outcomes only."

---

## Summary

The template is the enforcement mechanism. Doctrine articles can say "do not report status" all day, but if the template has a `running-with-evidence` field and an `If running:` branch, agents will report status. Fix the template, and the behavioral constraint is structural rather than instructional.

The replacement template:
1. Has one outcome field with three terminal values: `stage-complete`, `stage-blocked`, `stage-escalated`
2. Has no conditional branching
3. Has no acknowledgment section
4. Records work performed unconditionally
5. Lists evidence unconditionally
6. Separates issues from scope management
7. Treats the report as the return value of a completed function call
