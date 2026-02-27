# Architect-Opencode Split Audit

**Date**: 2026-02-26
**Source**: `~/.claude/skills/architect-opencode/SKILL.md`

---

## Why This Audit Exists

`architect-opencode` currently spans the full chain from requirements through validated implementation. The target design now requires a dedicated technical-preparation leader role.

This audit identifies which responsibilities should move to the new archetype first.

## Current Responsibility Clusters

### Cluster A -- Intake and Preparation Orchestration

- section setup and source grounding
- spec enrichment orchestration
- research/design/test/plan orchestration
- quality-gate evaluation for preparation artifacts

Primary commands involved:

- `/spec-writer`
- `/research-codebase`
- `/api-designer`
- `/test-designer`
- `/create-plan`

### Cluster B -- Execution Orchestration

- test implementation and code implementation orchestration
- validation loop management
- phase-complete checks and issue loops

Primary commands involved:

- `/test-implementer`
- `/implement-plan`
- `/validate-plan`

### Cluster C -- Packaging and Runtime Controls

- branching strategy guidance
- optional PR packaging guidance
- escalation criteria and state tracking conventions

## Proposed Stage-1 Split Boundary

Move Cluster A ownership into new `tech-lead` archetype now.

Leave Cluster B and Cluster C in `architect-opencode` temporarily.

Rationale:

1. This aligns exactly with the requested product -> technical preparation -> execution stage split.
2. It minimizes migration risk by avoiding immediate changes to execution behavior.
3. It creates a clean handoff contract between preparation output and execution ownership.

## Draft Handoff Contract (`tech-lead` -> `architect-opencode`)

Required handoff payload:

1. Active shaped artifact path(s)
2. Enriched spec path
3. Research artifact path(s)
4. API design path(s)
5. Test specification path(s)
6. Implementation plan path
7. Unresolved decisions list (if non-empty)
8. Explicit statement of known risks accepted at handoff

Acknowledgment contract from execution owner:

1. Confirmation of artifact receipt
2. Confirmation that package is sufficient to begin execution
3. List of blockers that require upstream correction before coding

## Anti-Drift Guards for the New Archetype

1. Do not write implementation code.
2. Do not collapse into product framing.
3. Do not hand off incomplete packages without explicit unresolved-risk declaration.
4. Do not silently patch shaping defects -- route back to `shaper`.
