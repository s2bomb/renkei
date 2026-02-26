# Log: Execution-Lead

Ledger of construction and maintenance decisions.

---

## 2026-02-26 -- Initial scaffold

- Created execution-stage leader archetype scaffold at `framework/archetypes/execution/execution-lead/`.
- Added foundational design artifacts:
  - `design/why.md`
  - `design/team-map.md`
  - `design/research/source-map.md`
- Declared initial team topology:
  - parent leader: `tech-lead`
  - member delegates: `test-implementer`, `implement-plan`, `validate-plan`

## 2026-02-26 -- Research pass

- Added execution-stage source grounding artifacts:
  - `design/research/shape-up-execution-review.md`
  - `design/research/architect-opencode-execution-split.md`
  - `design/research/analogs.md`
  - `design/research/naming.md`
- Added truth library:
  - `design/truths.md`

## 2026-02-26 -- Best-of-N and synthesis

- Ran independent best-of-N passes:
  - `design/best-of-n/2026-02-26-pass-a.md`
  - `design/best-of-n/2026-02-26-pass-b.md`
  - `design/best-of-n/2026-02-26-pass-c.md`
  - `design/best-of-n/2026-02-26-pass-d.md`
  - `design/best-of-n/2026-02-26-pass-e.md`
- Added convergence summary:
  - `design/best-of-n/2026-02-26-synthesis.md`
- Wrote v1 synthesis:
  - `design/synthesis.md`
- Locked decision: test implementation remains in execution stage.

## 2026-02-26 -- First assembly pass (v1)

- Added execution-lead manifest:
  - `archetype.yaml`
- Wrote truth, ethos, and doctrine article sets.
- Added execution references template.

## 2026-02-26 -- Adjacent boundary propagation

- Updated upstream/downstream stage contracts to use `execution-lead` as execution owner:
  - `framework/archetypes/technical-preparation/tech-lead/**`
  - `framework/archetypes/product/shaper/**`
- Updated member escalation wording in execution-facing development archetypes:
  - `framework/archetypes/development/test-implementer/doctrine/pipeline.md`
  - `framework/archetypes/development/implement-plan/**`

## 2026-02-26 -- Runtime behavior hardening (path and issuer ambiguity fix)

- Clarified execution intake path semantics in doctrine:
  - planning/package artifact paths are consumed as provided
  - execution worktree path is code-change target only
- Added explicit intake issuer requirement:
  - default issuer must be `tech-lead`
  - direct `shaper` intake requires explicit decision-owner override
- Updated contracts/templates accordingly:
  - `doctrine/process.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/output-contract.md`
  - `doctrine/pipeline.md`
  - `doctrine/team-contract.md`
  - `references/template.md`

## 2026-02-26 -- Event-ledger hardening

- Added explicit event-ledger duties for execution-lead stage actions:
  - intake events
  - stage outcome events
  - escalation events
- Updated:
  - `doctrine/process.md`
  - `doctrine/output-contract.md`
  - `references/template.md`

## 2026-02-26 -- Invocation semantics tightening

- Removed acknowledgment-style intake/transfer semantics from execution assembly artifacts.
- Locked rule: invocation with complete transfer fields means immediate stage execution; otherwise `blocked` with explicit blocker ownership.
- Updated:
  - `ethos/identity.md`
  - `ethos/tenets.md`
  - `doctrine/process.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/output-contract.md`

## 2026-02-26 -- Kickoff evidence hardening

- Fixed execution status-chat leak where intake/preflight pass could return `running` with no execution-phase evidence.
- Locked rule: after transfer, first non-blocked return must include concrete first-phase evidence (files changed + verification outcomes).
- Updated:
  - `doctrine/process.md`
  - `doctrine/orchestration.md`
  - `doctrine/handoff-contract.md`
  - `references/template.md`

## 2026-02-26 -- Inter-leader key semantics tightening

- Replaced intake-blocker return key from `status` to `outcome` in handoff contract.
- Updated:
  - `doctrine/handoff-contract.md`

## 2026-02-26 -- State redemption: function model alignment

- Full restructure of doctrine and ethos to eliminate stateful anti-patterns and align with function model.
- Root cause: named internal phases (intake, preflight) leaked into contracts as reportable milestones. "intake" was overloaded -- used for both input validation (fine) and a named state (anti-pattern). Template baked in status reporting (`running-with-evidence`, `If running:`). Safeguards patched symptoms, not causes.
- Changes across 9 files:
  - `ethos/tenets.md`: ROOT CHANGE -- "intake contract fields" -> "required input fields" (propagates verbatim to sub-agents).
  - `ethos/principles.md`: "cross-stage status" -> "cross-stage outcome".
  - `references/template.md`: full redesign -- eliminated `## Intake` section, `running-with-evidence`, `If running:` conditional. New 7-section structure: Metadata, Work Performed, Evidence Bundle, Issues, Scope, Outcome, Event Ledger.
  - `doctrine/process.md`: collapsed named steps to unnumbered preambles (Input Validation, Preconditions) + numbered work steps. Removed `handoff-received` ledger event. Added idempotency instruction.
  - `doctrine/orchestration.md`: "Intake Return Rule" -> "Return Contract" with positive whitelist replacing prohibition.
  - `doctrine/handoff-contract.md`: full invocation-interface rewrite -- "transfer" -> "invocation", removed all internal phase names, added cross-reference to output-contract.md.
  - `doctrine/output-contract.md`: removed "intake" from ledger entries and quality gates, added cross-reference to handoff-contract.md.
  - `doctrine/team-contract.md`: "intake" -> "input"/"invocation" vocabulary throughout.
  - `doctrine/pipeline.md`: "intake package" -> "input package".
- Grounding: AGENTS.md function model -- agents are stateless, terminal, composable. Named phases created a state machine; function model has input validation, work, and return.
- Decision: audit + best-of-5 perspectives documented in `design/best-of-n/2026-02-26-state-redemption/`.
