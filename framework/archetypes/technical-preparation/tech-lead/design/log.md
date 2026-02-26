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
