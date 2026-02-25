# Log: Shaper

Ledger of changes, decisions, and lessons learned during construction and maintenance of this archetype.

---

## 2026-02-25 -- Initial scaffold

- Created archetype directory at `framework/archetypes/product/shaper/`
- Established `design/` layer with: why.md, research/analogs.md, truths.md, log.md, synthesis.md
- Assembly directories created but empty: truth/, ethos/, doctrine/
- Grounding: product-stage-team.md (v1), product-stage-io.md (v2), product-stage-research.md
- Construction approach: bottom-up (truths first, then ethos, then doctrine). Analog research drives truth discovery.

## 2026-02-25 -- Research and truth extraction v1

- Added Shape Up source research:
  - `design/research/shape-up-shaping.md` (analysis)
  - `design/research/shape-up-chapters-raw.md` (curated direct excerpts)
- Added deep research artifacts:
  - `design/research/biblical-wisdom-shaper.md`
  - `design/research/historical-modern-analogs.md`
- Added repeatable extraction method: `design/truth-extraction-method.md`
- Populated `design/truths.md` with 7 initial truth candidates (T-01..T-07) including evidence, tests, and likely ethos hooks.

## 2026-02-25 -- Shape Up source map

- Added explicit traceability map: `design/research/shape-up-source-map.md`
- Mapped T-01..T-07 truth candidates to foreword-through-conclusion chapter evidence.
- Added Shape Up -> Renkei stage translation notes (shaping track, betting gate, build team).

## 2026-02-25 -- Synthesis + assembly articles v1

- Completed `design/synthesis.md` with:
  - selected truth set (5 final truths)
  - explicit compression decisions (T-01+T-04, T-02+T-06)
  - ethos and doctrine derivation directions
  - truth -> ethos -> doctrine therefore chains
- Updated `design/research/analogs.md` from placeholder to index of completed research corpus.
- Wrote assembly-layer articles for shaper:
  - `truth/` (5 files)
  - `ethos/` (identity, tenets, principles)
  - `doctrine/` (process, orchestration, pipeline, output-contract)
- Added `references/template.md` for shaped output artifact generation.
- Added `archetype.yaml` manifest for shaper assembly and deployment target.

## 2026-02-25 -- Post-compaction audit against full Shape Up reread

- Re-read Shape Up non-appendix chapters (`0.1` through `3.7`) from local markdown corpus.
- Added explicit self-audit document:
  - `design/audit-2026-02-25-shape-up-reread.md`
- Audit judgment: shaper v1 is directionally usable but not yet faithful enough to Shape Up commitment/output semantics.
- Identified concrete remediation targets:
  - tighten pitch/output contract language
  - encode betting-gate boundary explicitly
  - narrow shaper authority to shaping/recommendation before commitment
  - strengthen citation density in truth articles

## 2026-02-25 -- Role-boundary and delegation semantics correction

- Applied role-boundary correction: commitment authority is external to shaper team (human decision gate).
- Updated doctrine pipeline/process/output contract to reflect:
  - shaper produces recommendation + artifacts
  - decision owner confirms activation unless explicit executive directive
- Re-aligned output schema to Shape Up core contract terms:
  - Problem, Appetite, Solution, Rabbit Holes, No-Gos
  - optional Intent as Renkei extension
- Updated orchestration semantics for vanilla OpenCode runtime:
  - delegate via `general` subagent
  - require first-step Skill invocation for role embodiment (e.g., problem-analyst)

## 2026-02-25 -- Best-of-N critique pass and portability cleanup

- Ran three independent critiques under `design/best-of-n/` with explicit non-contamination instructions:
  - `2026-02-25-review-a.md`
  - `2026-02-25-review-b.md`
  - `2026-02-25-review-c.md`
- Added aggregation record: `design/best-of-n/2026-02-25-synthesis.md`.
- Applied convergent fixes:
  - removed repo-path/source-file anchors from assembled truth articles
  - converted host-specific delegation language to host-neutral role contracts
  - normalized decision state vocabulary to `proposed-active | active | parked`
  - tightened output quality gates and template fields for evidence + decision clarity

## 2026-02-26 -- Runtime-specific delegation reinstated (OpenCode)

- User clarified that delegation mechanics must remain explicit for current runtime.
- Reinstated OpenCode-specific orchestration semantics in assembled doctrine:
  - `Task(subagent_type="general")`
  - first-step Skill invocation requirement
  - explicit delegation to `problem-analyst` for exploration
  - explicit post-decision delegation to `architect-opencode` for active items
- Kept portability fixes that removed repo-local source-path leakage from assembled truth text.

## 2026-02-26 -- Final production pass (state machine + team clarity)

- Added live-usage source artifact:
  - `design/research/2026-02-26-first-live-usage-conversation.md`
- Ran independent best-of-n final-pass reviews:
  - `design/best-of-n/2026-02-26-final-pass-a.md`
  - `design/best-of-n/2026-02-26-final-pass-b.md`
  - `design/best-of-n/2026-02-26-final-pass-c.md`
- Updated shaper doctrine with single-queue activation workflow (`shaped-items`), required active scaffold, and transition-ledger requirements.
- Added explicit team contract doctrine article for deterministic delegation boundaries.
- Strengthened orchestration with mandatory immediate `architect-opencode` delegation after activation and bounded retry escalation.

## 2026-02-26 -- Finalization pass: state machine + team contract + activation handoff

- Added live-usage source capture:
  - `design/research/2026-02-26-first-live-usage-conversation.md`
- Ran independent best-of-n final-pass reviews:
  - `design/best-of-n/2026-02-26-final-pass-a.md`
  - `design/best-of-n/2026-02-26-final-pass-b.md`
  - `design/best-of-n/2026-02-26-final-pass-c.md`
- Updated doctrine for explicit single-queue state transitions and activation scaffolding:
  - `doctrine/process.md`
  - `doctrine/pipeline.md`
  - `doctrine/output-contract.md`
- Added explicit product-team role contract:
  - `doctrine/team-contract.md`
- Strengthened orchestration determinism:
  - mandatory immediate `architect-opencode` delegation on activation
  - bounded retry + escalation rule
