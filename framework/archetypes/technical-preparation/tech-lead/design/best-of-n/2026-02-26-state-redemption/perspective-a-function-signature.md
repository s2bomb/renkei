# Perspective A: Function Signature

**Lens**: What should the tech-lead look like as a pure function? Parameters, return type, error shape. How should `process.md` restructure from a 7-step state machine to a function body?

---

## 1. The Tech-Lead as a Function Signature

### Pseudo-Type Signature

```
prepare_technical_package(
    workspace_path:    Path,
    shaped_artifact:   ShapedArtifact,       # shape.md contents
    source_artifacts:  list[ArtifactPath],    # source and analyst evidence
    constraints:       ShapeConstraints,      # appetite, no-gos, open assumptions
    delegate:          DelegateProtocol,      # how to invoke specialists
) -> TechnicalPackage | BlockedResult | InputDefect
```

### Parameter Analysis

The current `process.md` Step 1 ("Intake Active Shape") lists five input categories:
- active workspace path
- `shape.md`
- source and analyst artifact paths
- appetite, no-gos, and open assumptions
- scaffold/ledger existence

These are the function's parameters. The fifth item (scaffold/ledger existence) is a precondition -- it fails fast if the environment is malformed. It does not need to be a named parameter; it is an assertion at the top of the function body.

The `delegate` parameter is implicit in the current design. The orchestration file specifies `Task(subagent_type="general")` as the mechanism. Making it an explicit parameter in the conceptual signature enforces honest signatures -- the function's dependency on external specialist invocation is visible.

### Return Type

The function returns one of three things:

**1. `TechnicalPackage`** -- the success case. Contains:
- enriched spec path
- research artifact paths
- API design artifact paths
- test-spec artifact paths
- implementation plan path
- unresolved decisions (explicit `none` if empty)
- accepted risks (explicit `none` if empty)
- must-have / nice-to-have separation
- execution worktree path
- execution evidence (files changed, verification commands, outcomes from execution-lead's first-phase work)

**2. `BlockedResult`** -- the function cannot complete. Contains:
- blocker list with ownership
- retry history (what was attempted, what failed)
- escalation target
- impact on appetite and delivery integrity

**3. `InputDefect`** -- the shaped input is not execution-preparable. Contains:
- defect list (which product-framing elements are missing or contradictory)
- routing target (`shaper`)

### What This Replaces

The current doctrine uses these return-value-like terms:
- `running-with-evidence` (process.md:77, pipeline.md:22, output-contract.md:25, template.md:48)
- `blocked` (process.md:48, 77, handoff-contract.md:38)
- `ready-for-execution` (output-contract.md:47, orchestration.md:66)
- `handoff-received` (process.md:11)

`running-with-evidence` is the core violation. It describes a status of an ongoing process. The function model replaces it: when tech-lead invokes execution-lead and execution-lead produces first-phase evidence, that evidence is part of the `TechnicalPackage` return payload. The tech-lead function has returned; the execution-lead function has also returned. Neither is "running."

`ready-for-execution` (used in the completion report at output-contract.md:47 and orchestration.md:66) is actually the closest to correct -- it's a terminal description of the output. But it should be the success variant of the return type, not a label on a status field.

`handoff-received` is an acknowledgment that has no place in the function model. The function was called -- that is the receipt.

### The Three-Variant Return as a Design Decision

Why three return types instead of two (`success | error`)?

`InputDefect` is structurally different from `BlockedResult`. An input defect routes upstream to `shaper` -- it means the function's preconditions were not met. A blocked result means the function attempted work but encountered an irresolvable obstacle. The routing and the caller's response are different for each:

- `InputDefect` -> caller routes to `shaper` for correction
- `BlockedResult` -> caller escalates to decision owner
- `TechnicalPackage` -> caller proceeds to downstream consumption

This maps to the current process.md's three outcomes: route to shaper (Step 2 failure), escalate (Step 7), or succeed (Step 6 success). The difference is that these outcomes are return values from a function, not exit points from named phases.

---

## 2. Restructuring process.md: From State Machine to Function Body

### Current Structure (7 named steps)

```
Step 1: Intake Active Shape        <- parameter validation + context loading
Step 2: Preflight Quality Gate     <- input quality assertion
Step 3: Orchestrate Specialists    <- core work: delegation
Step 4: Evaluate and Iterate       <- core work: quality checking delegated outputs
Step 5: Synthesize Technical Package  <- core work: assembly
Step 6: Transfer to Execution Owner   <- delegation to downstream + return
Step 7: Escalate When Blocked      <- error handling
```

### Proposed Structure (3 sections, no named milestones)

The function body has three natural sections, which correspond to what every well-structured function does: validate input, do work, return result.

```markdown
# Process

## Input Validation

[What is currently Steps 1 and 2, merged and de-named]

## Technical Preparation

[What is currently Steps 3, 4, and 5, merged as the core work section]

## Stage Outcome

[What is currently Steps 6 and 7, merged as the return section]
```

### Why These Three Sections

**Input Validation** collapses Intake + Preflight. Both are about ensuring the function has what it needs. The distinction between "did I receive the right files?" (Intake) and "are the files good enough?" (Preflight) is an implementation detail, not a structural boundary. A function validates its arguments -- period. No phase boundary between "receiving" and "checking."

**Technical Preparation** is the core work. It collapses Orchestrate + Evaluate + Synthesize. These are not three separate phases -- they are the iterative body of the function. You delegate, check, re-delegate, and when everything passes, you assemble. This is a loop with a quality gate, not three discrete steps.

**Stage Outcome** collapses Transfer + Escalate. Both are about returning results. If the package is ready, invoke execution-lead and return the combined result. If blocked, return the blocked result with escalation details. These are branches of the return statement, not separate phases.

### Proposed process.md Content

```markdown
# Process

## Input Validation

Validate the shaped artifact and workspace context:
1. Confirm active-state scaffold exists at workspace path.
2. Verify shaped artifact contains:
   - explicit problem and boundaries
   - explicit appetite
   - explicit no-gos
   - visible major uncertainties
3. Verify source and analyst artifact paths are accessible.

If the workspace scaffold is malformed or the shaped artifact is missing required
fields, return with defect details routed to `shaper`.

Do not proceed past validation with known product-framing defects.

## Technical Preparation

Delegate artifact production to specialists:
- `spec-writer`: enriches specification with technical context.
- `research-codebase`: documents as-is implementation realities.
- `api-designer`: defines module and interface contracts.
- `test-designer`: defines proof obligations from contracts.
- `create-plan`: sequences implementation with validation obligations.

Run independent work in parallel where dependencies allow. `spec-writer` and
`research-codebase` have no dependencies on each other. `api-designer` depends on
enriched spec and research. `test-designer` depends on API design, spec, and
research. `create-plan` depends on all prior artifacts.

After each delegated return, check:
1. Required contract fields are present.
2. Boundary compliance -- no silent scope or intent drift.
3. Source citations for major claims.

Re-delegate with explicit defect notes when gates fail. Allow at most two
correction retries per artifact.

If artifacts remain incomplete after retries, return blocked with retry history
and impact summary. Do not silently self-produce artifacts that belong to
specialists.

All specialist outputs return to `tech-lead` for synthesis. Specialists do not
hand off directly to downstream stage owners. `tech-lead` does not author
member-owned artifacts in normal operation. If member delegation is unavailable,
escalate for explicit role-collapse authorization.

Assemble the execution-ready package:
- enriched spec
- research record
- API design
- test specification
- implementation plan
- unresolved decisions (explicit `none` if empty)
- accepted risks (explicit `none` if empty)
- must-have and nice-to-have separation

Cross-artifact coherence and package completeness are `tech-lead` accountability.

## Stage Outcome

When the package passes all quality gates, delegate to `execution-lead` with:
- active item workspace path
- shaped artifact path
- technical package path
- plan path
- test specification path(s)
- unresolved decisions list
- accepted risks list
- execution worktree path

Execution-lead returns one of:
- complete result with first-phase evidence (files changed, verification
  commands, outcomes), or
- blocked with explicit blocker ownership.

Return the combined result: the technical package and execution-lead's outcome.

If blocked at any point after retries are exhausted, or if required decisions
block correctness, or if unresolved ambiguity would force unsafe execution:
return blocked with blocker ownership, impact on appetite and delivery
integrity, and recommended decision options for escalation.
```

### What Changed and Why

| Current | Proposed | Rationale |
|---|---|---|
| "Step 1: Intake Active Shape" | Merged into "Input Validation" | Parameter validation is not a named milestone |
| "Step 2: Preflight Quality Gate" | Merged into "Input Validation" | Input quality checking is parameter validation |
| "Step 3: Orchestrate Specialist Artifacts" | Merged into "Technical Preparation" | Core work section, not a named phase |
| "Step 4: Evaluate and Iterate" | Merged into "Technical Preparation" | Quality checking is part of the delegation loop |
| "Step 5: Synthesize Technical Package" | Merged into "Technical Preparation" | Assembly is the final act of the core work |
| "Step 6: Transfer to Execution Owner" | Merged into "Stage Outcome" | Delegation to downstream is part of return |
| "Step 7: Escalate When Blocked" | Merged into "Stage Outcome" | Error return is part of return |
| `handoff-received` ledger event | Removed | Functions do not acknowledge receipt |
| `running-with-evidence` | Replaced with execution-lead's return payload | Terminal description, not ongoing status |
| `handoff-issued` / `handoff-result` ledger events | Removed as intermediate appends | Return value contains the outcome |

### What Is Preserved

The actual guidance content survives almost entirely. The specialist list, dependency rules, retry limits, quality gate criteria, escalation triggers, role-collapse prohibition -- all remain. What changes is the organizational frame: named steps become sections of a function body. The agent receives the same guidance but without externally reportable milestone names.

---

## 3. What Replaces Named Phases

The audit correctly identifies that each named phase maps to a function-body concern:

| Named Phase | Function Concern | Expression in process.md |
|---|---|---|
| Intake | Parameter binding | First lines of "Input Validation" -- load the arguments |
| Preflight | Parameter assertion | Remainder of "Input Validation" -- assert quality |
| Orchestrate | Core work loop body | "Technical Preparation" delegation paragraphs |
| Evaluate | Loop guard / quality check | "After each delegated return, check:" |
| Synthesize | Compute return value payload | "Assemble the execution-ready package" |
| Transfer | Return (success branch) | "Stage Outcome" success path |
| Escalate | Return (error branch) | "Stage Outcome" blocked path |

The key principle: **none of these are named as externally visible milestones.** They are paragraphs within sections. An agent following this process cannot report "I am in Intake" because Intake does not exist as a named concept. It can only report "I am working" or return a terminal result.

The section headings ("Input Validation," "Technical Preparation," "Stage Outcome") are structural aids for the reader, not reportable phases. They describe what the function does at each point, not where the agent "is." The distinction matters: "Input Validation" is a description of what this code block does. "Step 1: Intake Active Shape" is a named milestone with a number.

---

## 4. Impact on Other Files

### handoff-contract.md

**Current problems**:
- `outcome: running` (line 30) -- status, not terminal
- "intake/preflight" as named states of execution-lead (lines 36, 48)
- Acknowledgment structure in transfer (lines 28-40)
- "ownership returns" state-transition language (line 50)

**Proposed changes**:

Line 30: Replace `outcome: running` with a terminal description.
```
# Current
1. outcome: running

# Proposed
1. outcome: complete
```

Lines 36, 48: Remove references to execution-lead's internal phases.
```
# Current (line 36)
or, if blocked at intake/preflight:

# Proposed
or, if blocked:
```

```
# Current (line 48)
Intake/preflight pass alone is not a terminal return for execution-lead in this handoff.

# Proposed
Validation alone is not a terminal return for execution-lead. The return must include
first-phase execution evidence or an explicit blocked result.
```

Line 50: Remove ownership-transfer language.
```
# Current
If blocked, ownership returns to tech-lead for correction or escalation.

# Proposed
If execution-lead returns blocked, tech-lead processes the blocker list:
correct and retry, or escalate.
```

### pipeline.md

**Current problem**: Line 22 uses `running` as output category.

**Proposed change**:
```
# Current
- transfer record to execution owner (running or blocked)

# Proposed
- execution outcome from downstream stage (complete-with-evidence or blocked)
```

### output-contract.md

**Current problems**:
- `running-with-evidence` at line 25
- "intake" ledger events at line 26

**Proposed changes**:

Line 25:
```
# Current
12. transfer record outcome (tech-lead -> execution-lead: running-with-evidence | blocked)

# Proposed
12. execution outcome (tech-lead -> execution-lead: complete-with-evidence | blocked)
```

Line 26:
```
# Current
13. project/item event ledger entries for intake, handoff, and escalation (if any)

# Proposed
13. project/item event ledger entries for stage outcome and escalation (if any)
```

Line 38: Remove "Project and item event ledgers are updated for stage actions" from quality gates, or rephrase to "Stage outcome is recorded" without implying intermediate ledger writes.

### orchestration.md

**Current problems**:
- "Intake chat is not a completion state" (line 7)
- "when intake context is complete" (line 25)

**Proposed changes**:

Line 7:
```
# Current
When invoked from shaper for an active item, run technical preparation to stage
outcome (ready-for-execution or blocked). Intake chat is not a completion state.

# Proposed
When invoked, run technical preparation to stage outcome (ready-for-execution or
blocked). Conversation without terminal output is not a completion state.
```

This preserves the critical prohibition (don't just chat -- produce an outcome) without naming "intake chat" as a recognized state.

Line 25:
```
# Current
spec-writer and research-codebase may run in parallel when intake context is complete.

# Proposed
spec-writer and research-codebase may run in parallel. They have no dependency on each other.
```

The dependency rule is about the relationship between specialists, not about a phase completing. The parallelism condition is: these two specialists don't depend on each other's output.

### team-contract.md

**Current problem**: Line 36 references "intake packet passes preflight."

**Proposed change**:
```
# Current
Delegate to specialists when intake packet passes preflight.

# Proposed
Delegate to specialists after input validation passes.
```

### references/template.md

**Current problems**:
- "Intake Summary" section name (line 11)
- `running-with-evidence` as transfer result (line 48)

**Proposed changes**:

Line 11:
```
# Current
## Intake Summary

# Proposed
## Shaped Context
```

The content (appetite, no-gos, open assumptions) is the shaped input that constrains the work. "Shaped Context" describes what it is. "Intake Summary" describes when it was captured.

Line 48:
```
# Current
- Transfer result: running-with-evidence | blocked

# Proposed
- Execution outcome: complete-with-evidence | blocked
```

Lines 53-59: Change "If running:" to "If complete:"
```
# Current
If running:

# Proposed
If complete:
```

### Ledger Model

The audit raises a structural question about intermediate ledger appends. Current process.md appends ledger events at three points during execution: intake (line 11), transfer (lines 75-77), and escalation (line 86).

The function model says: side effects during execution make the function impure. But ledger events have a legitimate role -- they record what happened for downstream consumers and for the historical record.

**Proposal**: The return value includes an `events` field. The ledger is not written to during execution; it is part of the returned payload. The caller (or the harness infrastructure) is responsible for persisting events after the function returns.

```
# In the return type
events: list[StageEvent]  # recorded during execution, persisted by caller

# Example events (all terminal, not intermediate)
- stage-outcome: ready-for-execution | blocked
- escalation: {target, blockers, impact}  # only if blocked
```

This eliminates the `handoff-received` acknowledgment entirely. It replaces intermediate `handoff-issued` / `handoff-result` pairs with a single `stage-outcome` event in the return payload.

---

## 5. Summary of Concrete Proposals

| # | File | Change | Severity |
|---|---|---|---|
| 1 | process.md | Restructure from 7 named steps to 3 unnamed sections (Input Validation, Technical Preparation, Stage Outcome) | High -- this is the primary fix |
| 2 | process.md | Remove all ledger-append instructions from the body; include events in the return value | High |
| 3 | process.md | Replace `running-with-evidence` with execution-lead's terminal return payload | High |
| 4 | handoff-contract.md | Replace `outcome: running` with `outcome: complete` | High |
| 5 | handoff-contract.md | Remove "intake/preflight" references to execution-lead's internal phases | High |
| 6 | handoff-contract.md | Replace "ownership returns" with "tech-lead processes the return value" | Medium |
| 7 | pipeline.md | Replace `running` with `complete-with-evidence` in outputs | Medium |
| 8 | output-contract.md | Replace `running-with-evidence` with `complete-with-evidence` | Medium |
| 9 | output-contract.md | Replace "intake" ledger category with "stage outcome" | Medium |
| 10 | orchestration.md | Replace "Intake chat" with generic prohibition on non-terminal conversation | Low-Medium |
| 11 | orchestration.md | Replace "when intake context is complete" with dependency-based parallelism rule | Low |
| 12 | team-contract.md | Replace "intake packet passes preflight" with "input validation passes" | Low-Medium |
| 13 | template.md | Rename "Intake Summary" to "Shaped Context" | Medium |
| 14 | template.md | Replace `running-with-evidence` with `complete-with-evidence` | Medium |
| 15 | template.md | Replace "If running:" with "If complete:" | Low |

### Guiding Principle

Every change follows from one rule stated in the AGENTS.md Foundation:

> **Agents are non-deterministic functions.** They are closer to computer functions than to humans -- stateless, terminal, composable.

A function has parameters, a body, and a return type. It does not have named milestones, acknowledgment semantics, or status-reporting obligations. The tech-lead's doctrine should read like a function body -- top to bottom, validate then work then return -- not like a state machine with numbered transitions.

### What This Does NOT Change

- **Ethos layer**: Clean. No changes needed. The tenets and principles already describe a function-compatible agent.
- **Orchestration specialist set and dependency rules**: The actual delegation logic is sound. Only the phase-name contamination in the framing language changes.
- **Quality gate criteria**: All gate conditions survive. They move from "Step 4" to inline paragraphs in "Technical Preparation."
- **Retry limits and escalation triggers**: Preserved exactly. Two retries, then escalate.
- **Role boundaries and member ownership**: Preserved exactly.
- **Verbatim propagation section**: Preserved exactly.
- **The content of the template**: All fields survive. Only section names and status labels change.
