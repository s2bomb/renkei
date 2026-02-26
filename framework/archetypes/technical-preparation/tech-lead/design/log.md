# Log: Tech Lead (Technical Preparation)

Ledger of construction and maintenance decisions.

---

## 2026-02-26 -- Initial scaffold and source pass

- Created draft archetype scaffold at `framework/archetypes/technical-preparation/tech-lead/`.
- Added required design-layer foundation:
  - `design/why.md`
  - `design/team-map.md`
  - `design/truths.md`
  - `design/synthesis.md`
  - `design/log.md`
  - `design/research/analogs.md`
  - `design/research/naming.md`
  - `design/research/shape-up-book-review.md`
  - `design/research/architect-opencode-split.md`
  - `design/research/source-map.md`
- Reviewed full Shape Up corpus (foreword, chapters 1-15, conclusion, appendices 1-3, glossary) and extracted stage-specific implications for technical preparation leadership.
- Set working role name to `tech-lead` pending later naming review.
- Chose staged split strategy: move technical preparation orchestration first; keep execution orchestration in `architect-opencode` temporarily.

## 2026-02-26 -- Best-of-N review and synthesis

- Ran independent best-of-N design passes:
  - `design/best-of-n/2026-02-26-pass-a.md`
  - `design/best-of-n/2026-02-26-pass-b.md`
  - `design/best-of-n/2026-02-26-pass-c.md`
  - `design/best-of-n/2026-02-26-pass-d.md`
  - `design/best-of-n/2026-02-26-pass-e.md`
- Added convergence synthesis:
  - `design/best-of-n/2026-02-26-synthesis.md`
- Locked v1 naming decision to `tech-lead`.

## 2026-02-26 -- Topology clarification pass

- Made leader/member topology explicit in doctrine and design.
- Added `design/team-map.md` defining parent, child members, stage entry/exit, and handoff direction defaults.
- Updated doctrine to codify member outputs returning to parent leader before cross-stage handoff:
  - `doctrine/process.md`
  - `doctrine/team-contract.md`
  - `doctrine/handoff-contract.md`

## 2026-02-26 -- First assembly pass (v1)

- Wrote first assembly manifest:
  - `archetype.yaml`
- Wrote truth articles:
  - `truth/stage-boundaries-are-risk-controls.md`
  - `truth/unresolved-unknowns-expand-cost.md`
  - `truth/integration-needs-one-owner.md`
  - `truth/design-and-build-authority-are-distinct.md`
  - `truth/fixed-time-requires-scope-tradeoffs.md`
- Wrote ethos articles:
  - `ethos/identity.md`
  - `ethos/tenets.md`
  - `ethos/principles.md`
- Wrote doctrine articles:
  - `doctrine/process.md`
  - `doctrine/orchestration.md`
  - `doctrine/team-contract.md`
  - `doctrine/pipeline.md`
  - `doctrine/output-contract.md`
  - `doctrine/handoff-contract.md`
- Added references template:
  - `references/template.md`

## 2026-02-26 -- Execution-stage owner propagation

- Updated downstream execution owner references from `architect-opencode` to `execution-lead`:
  - `ethos/identity.md`
  - `doctrine/process.md`
  - `doctrine/pipeline.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/team-contract.md`
  - `doctrine/output-contract.md`
  - `references/template.md`
- Updated design-layer topology references:
  - `design/synthesis.md`
  - `design/team-map.md`
  - `design/research/source-map.md`

## 2026-02-26 -- Runtime behavior hardening (handoff-only loop fix)

- Hardened doctrine to prevent intake-only completion behavior:
  - `doctrine/orchestration.md` now requires run-to-outcome (`ready-for-execution` or `blocked`) for active-item delegation.
  - Added stage return contract with package path + execution transfer summary.
- Enforced member authorship boundaries:
  - `doctrine/process.md` and `doctrine/team-contract.md` now forbid normal-mode bypass of specialist artifact ownership.
- Clarified cross-stage handoff semantics:
  - `doctrine/handoff-contract.md`, `doctrine/output-contract.md`, and `references/template.md` now encode execution worktree path and path-resolution rules.

## 2026-02-26 -- Terminal outcome + ledger hardening

- Updated stage return semantics to outcome-only reporting (removed intake status-chat as required upstream return field).
- Added event-ledger requirements for team-lead stage actions in doctrine and templates:
  - `doctrine/process.md`
  - `doctrine/output-contract.md`
  - `references/template.md`
- Replaced acknowledgment-style transfer semantics with invocation/transfer semantics in assembly artifacts:
  - `ethos/identity.md`
  - `doctrine/process.md`
  - `doctrine/orchestration.md`
  - `doctrine/pipeline.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/team-contract.md`

## 2026-02-26 -- Execution kickoff evidence hardening

- Tightened downstream transfer contract so execution return cannot be intake/preflight pass-only.
- Required first execution-phase evidence when transfer result is running.
- Updated:
  - `doctrine/process.md`
  - `doctrine/orchestration.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/output-contract.md`
  - `references/template.md`

## 2026-02-26 -- Inter-leader key semantics tightening

- Replaced `status` with `outcome` in leader-to-leader transfer/return fields to reduce false "still running" interpretation.
- Updated:
  - `doctrine/orchestration.md`
  - `doctrine/handoff-contract.md`
  - `doctrine/output-contract.md`

## 2026-02-26 -- State redemption: function model alignment

- Full restructure of doctrine to eliminate stateful anti-patterns and align with function model.
- Root cause: named internal phases (intake, preflight, transfer) leaked into contracts as reportable milestones. Agents reported completing these milestones as progress, but returning terminates invocation -- so "running" was always a lie.
- Changes across 7 files:
  - `doctrine/process.md`: collapsed 7 named steps to 3 sections (Input Validation preamble, Technical Preparation, Stage Outcome). Removed `handoff-received` ledger event. Replaced all ledger "append" with "include in return payload". Enumerated specific preconditions.
  - `doctrine/handoff-contract.md`: replaced `running` with `complete`, removed execution-lead internal phase names, renamed sections to function-model vocabulary (Transfer -> Invocation, Escalation Rule -> Escalation Convention).
  - `doctrine/output-contract.md`: `running-with-evidence` -> `complete-with-evidence`, removed intake from ledger entries.
  - `doctrine/pipeline.md`: `running` -> `complete-with-evidence`.
  - `doctrine/orchestration.md`: replaced "intake chat" prohibition with testable output-completeness requirement.
  - `doctrine/team-contract.md`: `intake` -> `input`, `preflight` -> `input validation`.
  - `references/template.md`: "Intake Summary" -> "Shaped Context", `running-with-evidence` -> `complete-with-evidence`.
- Grounding: AGENTS.md function model -- agents are stateless, terminal, composable. Named phases created a state machine; function model has input validation, work, and return.
- Decision: audit + best-of-5 perspectives documented in `design/best-of-n/2026-02-26-state-redemption/`.
