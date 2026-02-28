# Review

Self-healing loop for archetypes after real-world use.

This library is not decomposition. `decompose` converts an existing flat skill into archetype source. `review` evaluates an existing archetype against field evidence and feeds corrections back into truth, ethos, and doctrine.

## Status

Seed only. No implementation code yet.

Purpose of this seed: lock architectural intent before writing scripts.

## Core Problem

An archetype can look coherent on paper and still fail in daily use (verbosity, weak proofs, scope drift, poor refusal, brittle delegation). The framework needs a repeatable way to detect and correct these failures.

## Boundary

- `decompose`: migration and restructuring of legacy skill files
- `review`: post-deploy evaluation and correction planning
- `assemble`: deployment of updated archetype output

These are separate concerns.

## State Locality (Single Source of Truth)

Review **tooling** lives in `authoring/lib/review/`.

Review **state** lives with each archetype under:

`authoring/archetypes/<team>/<name>/review/`

Reason: evaluation context belongs to the archetype it judges. Tooling may change; archetype history and criteria must remain co-located with the archetype.

## Intended Archetype Review Shape

Per archetype, `review/` is expected to hold structured artifacts (shape to be finalized):

- `intent.md` -- why this archetype exists, what failure it prevents in the team
- `rubric.md` -- how good/bad behavior is scored
- `cases/` -- canonical eval scenarios and adversarial prompts
- `runs/` -- dated evaluation outputs
- `findings/` -- normalized findings mapped to truth/ethos/doctrine
- `decisions.md` -- accepted/rejected corrections and rationale

## Review Loop (Target)

1. Gather evidence from real sessions and planned eval cases.
2. Evaluate against archetype rubric (LLM-as-judge + deterministic checks where possible).
3. Classify failures by layer: `truth`, `ethos`, `doctrine`, `pipeline`, `output-contract`, `orchestration`.
4. Propose minimal corrective edits.
5. Verify behavior change on same cases.
6. Record decision and promote through normal assembly/deploy.

## Design Constraints

- No new pillar. Truth/ethos/doctrine remain immutable as the archetype core.
- Review outputs must be actionable at file level (which article to edit and why).
- Metrics are secondary to causality; every score must map to a concrete failure mode.
- Avoid split-brain state: canonical criteria and findings stay with the archetype.

## Near-Term Goal

Codify one practical review path for `test-designer` and `api-designer` first, then generalize.
