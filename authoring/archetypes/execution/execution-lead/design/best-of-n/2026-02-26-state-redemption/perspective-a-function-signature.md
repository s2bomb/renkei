# Perspective A: Function Signature Analysis

Lens: What does execution-lead look like as a pure function?

---

## 1. The Function Signature

### Current implicit signature (reconstructed from files)

```
execution_lead(package) -> report | "blocked" | "escalated"
```

This is what the archetype *actually does* when you strip away the phase language. But the articles obscure it by layering named states (`intake`, `preflight`, `running-with-evidence`) over what is structurally a function call.

### Proposed explicit signature

```typescript
type ExecutionInput = {
  active_item_workspace: Path
  technical_package_path: Path
  plan_path: Path
  test_spec_paths: Path[]
  unresolved_decisions: Decision[]
  accepted_risks: Risk[]
  execution_worktree_path: Path
  handoff_issuer: "tech-lead" | ExplicitOverride
  shaped_artifact_path: Path
}

type ExecutionOutput =
  | { outcome: "complete", evidence: EvidenceBundle, ledger_entries: LedgerEntry[] }
  | { outcome: "blocked",  blockers: Blocker[], ledger_entries: LedgerEntry[] }
  | { outcome: "escalated", escalation: Escalation, ledger_entries: LedgerEntry[] }

type EvidenceBundle = {
  test_implementation: { files: Path[], commits: Hash[], traceability: Mapping }
  implementation: { phase_commits: Hash[], verification_outputs: string[] }
  validation: { report_path: Path, coverage: "full" | "partial", deviations: Deviation[] }
  scope: { must_have_outcome: string, nice_to_have_deferrals: string[], unresolved_decisions: Decision[], accepted_risks: Risk[] }
}

type Blocker = {
  field_or_gate: string
  owner: AgentRole
  recommended_action: string
}

type Escalation = {
  defect_owner: AgentRole
  impact: string
  options: string[]
  ledger_entries: LedgerEntry[]
}

function execution_lead(input: ExecutionInput): ExecutionOutput
```

### What this reveals

1. **The input type is already well-defined.** handoff-contract.md lines 11-19 list exactly 9 required fields. This is the parameter list. Calling it "Required Intake Payload" is the only problem -- it *is* just `ExecutionInput`.

2. **The output type has three variants.** pipeline.md lines 22-23 and process.md lines 85-87 both correctly name them: `complete | blocked | escalated`. The evidence bundle structure is reconstructable from output-contract.md lines 14-27 and template.md's Evidence/Coverage/Scope sections.

3. **There is no `running-with-evidence` in the output type.** A function that has returned cannot be "running." The template (template.md line 15) encodes a fourth variant that the output contract and process articles do not recognize. This is the critical inconsistency: the template's type system disagrees with the doctrine's type system.

4. **The `## Intake` section of the template is input echo, not output.** The template (lines 11-26) asks the agent to report back: "Package source: tech-lead, Handoff issuer role: X, Transfer outcome: running-with-evidence." This is the function returning `{ ...args, status: "I received your call" }`. The caller already knows what it passed. Input echo is acknowledgment semantics.

5. **Ledger entries are a side effect, not a state.** The output includes ledger entries (output-contract.md line 27). That is fine -- a function can return a list of events to be persisted by the caller. But the current articles confuse *recording* an event (legitimate return data) with *being in* a state (anti-pattern). `handoff-received` is an event that says "I entered the intake state." Under the function model, there is no such event to record. The only events are: `stage-complete`, `stage-blocked`, `stage-escalated`.

---

## 2. process.md Restructuring

### The structural problem

process.md has 7 named steps. Steps 1-2 are input validation. Steps 3-5 are the real computation. Steps 6-7 are output construction/escalation.

In a function model:

| Function region | Current steps | What it actually is |
|---|---|---|
| Parameter validation | Step 1 (Intake and Start) | Assert required fields exist. Fail-fast if missing. |
| Precondition checking | Step 2 (Preflight Execution Gate) | Assert plan is execution-usable. Fail-fast if not. |
| Computation | Steps 3-5 (Delegate Test/Impl/Validation) | The actual work. |
| Return construction | Step 6 (Publish Stage Outcome) | Build the return value. |
| Error handling | Step 7 (Escalate When Required) | Build the error return value. |

Parameter validation and precondition checking are not steps. They are the first lines of the function body. A function does not number `assert x is not None` as "Step 1." It validates, then does work.

### Proposed restructure

```markdown
# Process

## Input Validation

Verify required input fields exist:

- active item workspace
- technical package path
- plan path
- test specification path(s)
- unresolved decisions and accepted risks
- execution worktree path
- handoff issuer (`tech-lead` by default; explicit decision-owner override required otherwise)

If any required field is missing, return `blocked` with explicit blocker ownership.

If invocation comes from `shaper` without explicit decision-owner override, return `blocked` and route to `tech-lead`.

Path-resolution rule:

- Consume planning/package artifacts at the exact paths provided by `tech-lead`.
- Use execution worktree path for code/test implementation activity.
- Missing planning artifacts inside execution worktree is not, by itself, an input validation failure.

## Preconditions

Verify plan is execution-usable:

- test obligations are explicit
- implementation phases are explicit
- must-have and nice-to-have scope is explicit
- known risks and unresolved decisions are explicit
- execution worktree path exists and is usable for code changes

If preconditions fail, return defects to `tech-lead`.

Do not return validation-only results. Continue to Step 1 immediately.

## Step 1: Delegate Test Implementation

Delegate `test-implementer` first.

Require return evidence:

- implemented test files
- spec-to-test traceability
- compile/parse status
- test commit hashes

Block progression until test gate passes.

## Step 2: Delegate Implementation

Delegate `implement-plan` after test gate passes.

Require return evidence:

- phase completion status
- implementation commit hashes
- verification outputs
- plan checkbox updates

If implementation reveals upstream defects, route defects explicitly upstream.

## Step 3: Delegate Validation

Delegate `validate-plan` after implementation gate passes.

Require validation evidence:

- phase validation status
- source requirement coverage status
- deviation list and severity
- final validation recommendation

## Step 4: Publish Stage Outcome

Publish exactly one execution-stage outcome:

- `complete`
- `blocked`
- `escalated`

Include evidence bundle and unresolved issues.

Append stage outcome event to project and item ledgers (`stage-complete`, `stage-blocked`, or `stage-escalated`).

## Escalation

Escalate with explicit defect ownership when:

- input validation fails after retry attempts
- upstream package defects block safe execution
- validation fails on critical requirements
- strategic scope tradeoffs require decision-owner judgment

Record escalation events in project and item ledgers with blocker ownership and recommended options.
```

### Key structural changes

1. **"Intake and Start" becomes "Input Validation"** -- an unnumbered preamble section, not Step 1.
2. **"Preflight Execution Gate" becomes "Preconditions"** -- an unnumbered preamble section, not Step 2.
3. **Step numbering starts at the first real action** (Delegate Test Implementation is now Step 1).
4. **"Escalate When Required" becomes "Escalation"** -- unnumbered, because it's error-path return construction, not a sequential step after Step 4.
5. **The intake ledger event (`handoff-received`) is removed entirely.** The stage outcome event is the only ledger write.
6. **"intake blocker" becomes "input validation failure."** Same semantics, no named state.
7. **"First return to tech-lead after successful transfer" is removed.** The function returns once, with its terminal output. There is no "first return."
8. **The anti-pattern safeguard (line 40: "Do not return intake/preflight-only responses") becomes a natural consequence** of the structure: validation sections are preamble, not steps, so there is nothing to "return."

---

## 3. Phase-to-Function Model Mapping

| Current phase name | Function model equivalent | Why the rename matters |
|---|---|---|
| Intake | Parameter validation | "Intake" has a ledger event, a contract section, a template section, governance rules. "Parameter validation" is three lines of assertions. |
| Preflight | Precondition checking | "Preflight" implies a named pre-flight state you could report on. "Preconditions" are boolean assertions. |
| Execution (Steps 3-5) | Computation | No rename needed. These are already correctly structured as sequential delegations. |
| Publish Stage Outcome | Return construction | "Publish" implies an event that observers see. "Return" implies a value the caller receives. Both are true, but "return" is the function-model term. |
| Escalation | Error return | Escalation is the `Err` variant of the return type. It is not a phase that follows completion -- it's an alternative return path. |

### What does NOT change

Steps 3-5 (delegate test-implementer, implement-plan, validate-plan) are already correct. They are sequential function calls with quality gates between them. The dependency chain is right. The evidence requirements are right. The gate-then-proceed model is right.

The problem is *only* in the framing of Steps 1-2 and in the output template. The core computation is clean.

---

## 4. Concrete Changes to process.md

All line references to current process.md content:

| Location | Current text | Replacement | Rationale |
|---|---|---|---|
| Line 3 | `## Step 1: Intake and Start` | `## Input Validation` | Remove step number, remove "intake" |
| Line 6 | `Verify required intake fields exist:` | `Verify required input fields exist:` | s/intake/input/ |
| Line 14 | `Start execution stage immediately when intake fields are complete.` | Remove entirely | Implicit: if validation passes, computation proceeds |
| Line 16 | `Append intake event to project and item ledgers...` | Remove entirely | No intake ledger event |
| Line 18 | `If intake is incomplete, return...` | `If any required field is missing, return...` | s/intake is incomplete/any required field is missing/ |
| Line 26 | `...is not, by itself, an intake blocker.` | `...is not, by itself, an input validation failure.` | s/intake blocker/input validation failure/ |
| Line 28 | `## Step 2: Preflight Execution Gate` | `## Preconditions` | Remove step number, remove "preflight" and "gate" |
| Line 40 | `If preflight passes, continue immediately to Step 3...` | `Do not return validation-only results. Continue to Step 1 immediately.` | Step renumbered; "preflight" removed; safeguard becomes structural |
| Line 42 | `## Step 3: Delegate Test Implementation` | `## Step 1: Delegate Test Implementation` | Renumber |
| Line 55 | `First return to 'tech-lead' after successful transfer must include...` | `Return value must include concrete execution evidence (files changed and verification outcomes), or 'blocked' with explicit blocker ownership.` | Remove "first return" and "transfer" language |
| Line 57 | `## Step 4: Delegate Implementation` | `## Step 2: Delegate Implementation` | Renumber |
| Line 70 | `## Step 5: Delegate Validation` | `## Step 3: Delegate Validation` | Renumber |
| Line 81 | `## Step 6: Publish Stage Outcome` | `## Step 4: Publish Stage Outcome` | Renumber |
| Line 93 | `## Step 7: Escalate When Required` | `## Escalation` | Remove step number -- this is an error path, not a sequential step |
| Line 97 | `intake remains insufficient after retries` | `input validation fails after retry attempts` | s/intake/input validation/ |

---

## 5. Effects on orchestration.md

### The "Intake Return Rule" (lines 25-32)

Current:

```markdown
## Intake Return Rule

Do not return intake/preflight pass as a terminal response.

Return to parent leader only when:

1. first execution phase attempt produced concrete evidence (files changed + verification outcomes), or
2. execution is `blocked` with explicit blocker ownership and next action.
```

This section exists solely because "intake" and "preflight" are named steps that agents try to report completing. Once they are no longer named steps, the anti-pattern they guard against cannot occur.

**Replacement**: Rename to `## Return Contract` and simplify:

```markdown
## Return Contract

Return to parent leader only with terminal outcomes:

1. execution evidence with verification results, or
2. `blocked` with explicit blocker ownership and next action.

Input validation is not a terminal outcome.
```

The last line is now a definitional statement rather than a prohibition. It does not say "do not return X" (which implies X is possible and tempting). It says "X is not a member of the return type" (which makes it structurally impossible to get wrong).

### Verbatim Propagation (line 62)

Current:

```markdown
> Execution starts when intake contract fields are complete.
```

This propagates verbatim to sub-agents per framework rules. The fix must happen at the source tenet (ethos/tenets.md line 5). Proposed tenet rewording:

```markdown
Execution starts when required input fields are complete.
```

orchestration.md inherits the fix automatically. No separate edit needed in orchestration.md for this line -- it is a verbatim copy of the tenet.

### Other orchestration.md changes

- Line 45: `Do not advance stage steps when required fields are missing` -- clean, keep as-is.
- Lines 55-56: Retry and escalation rules -- clean, keep as-is.
- The rest of the file (delegation protocol, member delegation set, dependency rules, quality gate rule, required return contract) is already function-model aligned.

---

## 6. Cascade Effects on Other Files

### handoff-contract.md

| Line | Change |
|---|---|
| 5 | `transfer from` -> `invocation of execution-lead by tech-lead` |
| 9 | `## Required Intake Payload` -> `## Required Input Fields` |
| 29 | `when intake contract fields are complete` -> `when required input fields are complete` |
| 31 | `Intake/preflight pass is non-terminal. Return only after...` -> `Return execution evidence with verification results, or blocked with explicit blocker ownership.` |
| 41 | `Execution ownership transfers when handoff payload fields are complete and invocation occurs.` -> `Execution-lead owns all work from invocation to return.` |
| 43 | `If intake is blocked` -> `If input validation fails` |
| 47 | `intake blockers` -> `input validation failures` |

### output-contract.md

| Line | Change |
|---|---|
| 27 | `project/item event ledger entries for intake, stage outcome, and escalation` -> `project/item event ledger entries for stage outcome and escalation (if any)` |
| 33 | `Intake contract fields are complete and stage started` -> `Required input fields are present` |

### team-contract.md

| Line | Change |
|---|---|
| 9 | `intake package provider` -> `input package provider` |
| 24 | `intake authority is from tech-lead package handoff` -> `invocation authority is tech-lead, not direct shaper delegation in normal flow` |
| 34 | `after intake/preflight gates pass` -> `after input validation passes` |

### pipeline.md

| Line | Change |
|---|---|
| 13 | `intake package from tech-lead` -> `input package from tech-lead` |

### ethos/tenets.md

| Line | Change |
|---|---|
| 5 | `Execution starts when intake contract fields are complete.` -> `Execution starts when required input fields are complete.` |

### ethos/principles.md

| Line | Change |
|---|---|
| 5 | `One stage owner publishes cross-stage status.` -> `One stage owner publishes the stage outcome.` |

### references/template.md (most critical)

The template must reflect the function's return type. Three structural changes:

1. **Remove the `## Intake` section entirely** (lines 11-26). Replace with a minimal `## Input` section that records only provenance (package path, handoff issuer) without acknowledgment semantics or transfer outcomes.

2. **Remove `running-with-evidence` from the vocabulary.** It is not a member of `ExecutionOutput`.

3. **Remove the `If running:` conditional.** Evidence fields (files changed, verification commands, outcomes) belong unconditionally in `## Evidence`.

Proposed template replacement for lines 11-26:

```markdown
## Input

- Package source: `tech-lead`
- Handoff issuer role:
```

The "files changed / verification commands / outcomes" content currently gated behind `If running:` moves to the `## Evidence` section unconditionally.

---

## Summary

The execution-lead archetype is a function: `f(ExecutionInput) -> ExecutionOutput`. The input type is well-defined (9 fields from tech-lead). The output type has three variants (complete, blocked, escalated), each carrying an evidence bundle and ledger entries.

The anti-patterns come from framing the function's preamble (validation, precondition checking) as named phases with their own events, contract sections, and template fields. The fix is mechanical: rename phases to function-model equivalents, remove the intake ledger event, restructure the template to match the output type, and let the anti-pattern safeguards disappear because the structural conditions that required them no longer exist.

The core computation (Steps 3-5: delegate test-implementer, implement-plan, validate-plan) is already clean. The delegation chain, quality gates, and evidence requirements need no changes.
