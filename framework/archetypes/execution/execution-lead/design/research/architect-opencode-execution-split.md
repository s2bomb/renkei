# Architect-Opencode Split Audit: Execution Side

**Date**: 2026-02-26
**Source**: `~/.claude/skills/architect-opencode/SKILL.md`

---

## Why This Audit Exists

`architect-opencode` currently owns both technical preparation and execution loops. Technical preparation is now split to `tech-lead`. This audit defines what moves to the new execution-stage leader.

## Responsibility Clusters in Current Architect Skill

### Cluster 1 -- Technical Preparation (already moved to `tech-lead`)

- spec enrichment orchestration
- research orchestration
- api design orchestration
- test design orchestration
- implementation-plan creation orchestration

### Cluster 2 -- Execution Stage (target for `execution-lead`)

- test implementation orchestration (`test-implementer`)
- implementation orchestration (`implement-plan`)
- validation orchestration (`validate-plan`)
- iteration/escalation across execution gates

### Cluster 3 -- Cross-stage Coordinator Utilities (may remain elsewhere)

- optional PR packaging
- broad project shell orchestration

## Stage-2 Split Decision

Move Cluster 2 to `execution-lead`.

This completes the split:

- product stage: `shaper`
- technical-preparation stage: `tech-lead`
- execution stage: `execution-lead`

## Migration Guardrails

1. One stage owner per active item.
2. `tech-lead` handoff must target `execution-lead`.
3. Execution members return to `execution-lead` only.
4. Validation report is required for stage completion.
