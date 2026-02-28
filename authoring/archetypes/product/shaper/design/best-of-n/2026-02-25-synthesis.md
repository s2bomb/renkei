# Best-of-N Synthesis (2026-02-25)

## Inputs

- `2026-02-25-review-a.md`
- `2026-02-25-review-b.md`
- `2026-02-25-review-c.md`

All reviews were produced independently with explicit no-cross-reading constraints.

## Convergent Findings

1. Assembled skill text leaked environment details (repo paths, host runtime mechanics).
2. Doctrine over-specified tool mechanics where role contracts should be primary.
3. State and output schema language had drift between synthesis and doctrine.
4. Truth statements needed to stay as domain facts, not role prescriptions.
5. Role purity should be stricter: shaper synthesizes and recommends; decision owner commits.

## Applied Decisions

1. Removed repo-local source-path anchors from assembled truth articles.
2. Rewrote orchestration and process language to host-neutral role contracts.
3. Normalized state vocabulary to `proposed-active | active | parked`.
4. Tightened output contract gates (evidence or uncertainty labeling, rabbit-hole consequence, decision-owner acknowledgment).
5. Updated template to include claim-evidence-confidence and explicit decision/handoff fields.
6. Kept conviction strength while removing runtime-specific enforcement language from ethos.

## Kept Intentionally

1. Shape Up core contract in shaped output (`Problem, Appetite, Solution, Rabbit Holes, No-Gos`).
2. Separation of roles: shaper (synthesis), problem-analyst (exploration), decision owner (commitment).
3. Verbatim propagation principle in orchestration.

## Remaining Follow-Up

1. Run live shaping trials and capture field observations.
2. Tune brevity of doctrine if repeated trial sessions show verbosity drag.
