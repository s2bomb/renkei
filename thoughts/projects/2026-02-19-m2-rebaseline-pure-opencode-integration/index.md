# Project: M2 Rebaseline -- Pure OpenCode Integration

## Purpose
Reset M2 on corrected foundations by integrating the Renkei harness with pure upstream OpenCode as an in-repo dependency/workspace component, while preserving composition-first behavior and baseline OpenCode workflow parity.

## Operator Direction
- This project is a kickoff scaffold only.
- Source requirements are preserved verbatim in `sources/requirements.md`.
- `spec.md` is intentionally not created here per process guardrail; spec authoring is a later `spec-writer` step.

## Required Outcomes
- A developer can run `renkei-dev` and use OpenCode through Renkei harness.
- Baseline OpenCode workflows work with no functional degradation.
- Unavailable Renkei-only capabilities fail explicitly and typed.

## Scope Envelope
- In scope: dependency topology/linkage of in-repo OpenCode, harness bootstrap and `renkei-dev` entrypoint path, composition integration with no-degradation validation, smoke-path validation, operator runbook.
- Out of scope: UI redesign, broad OpenCode refactors, tools-layer work.

## Execution Tracking
- Section 1 pipeline status:
  - `section-1-research.md` -- complete
  - `section-1-api-design.md` -- complete
  - `section-1-test-spec.md` -- complete
  - `section-1-implementation-plan.md` -- complete through TI-1/IP-1/TI-2/IP-2/TI-3/IP-3 and global gate
  - `section-1-implement.md` -- complete
- Section 2+ remain pending and are not part of this update.
