---
date: 2026-02-19T00:00:00Z
author: brad
status: draft
input_source: parent-agent-message
estimated_sections: 4
---

# Project: M2 First Runnable Renkei Harness

## Purpose

Create a harness-only project workspace that drives a first runnable `renkei-dev` flow.
The target is a daily-usable developer entrypoint that launches OpenCode through Renkei composition.
Normal OpenCode usability must remain intact, and unavailable Renkei-only behavior must fail explicitly.

## Source of Truth

- `spec.md` - Canonical requirements and section definition
- `sources/requirements.md` - Verbatim original requirements
- `sources/brief.md` - Derived planning brief from requirements payload

## Section Execution Order

1. Bootstrap command/runtime wiring
2. Composition integration
3. Smoke-path validation
4. Runbook

## Stage Status

1. Bootstrap command/runtime wiring - research: complete, api-design: complete, test-spec: complete, plan: complete, implement: complete (phases 1-6 complete; live OpenCode success check complete), validate: complete
2. Composition integration - research: complete, api-design: complete, test-spec: complete, plan: complete, implement: complete (phases 1-5 complete; T2-01..T2-17 green with unit/typecheck/lint gates), validate: complete
3. Smoke-path validation - research: pending, api-design: pending, test-spec: pending, plan: pending, implement: pending, validate: pending
4. Runbook - research: pending, api-design: pending, test-spec: pending, plan: pending, implement: pending, validate: pending

## Artifact Links

1. Bootstrap command/runtime wiring
- Research: `working/section-1-research.md`
- API design: `working/section-1-api-design.md`
- Test spec: `working/section-1-test-spec.md`
- Plan: `working/section-1-plan.md`
- Implementation notes: `working/section-1-implement.md`
- Validation: `working/section-1-validate.md`

2. Composition integration
- Research: `working/section-2-research.md`
- API design: `working/section-2-api-design.md`
- Test spec: `working/section-2-test-spec.md`
- Plan: `working/section-2-plan.md`
- Implementation notes: `working/section-2-implement.md`
- Validation: `working/section-2-validate.md`

3. Smoke-path validation
- Research: `working/section-3-research.md`
- API design: `working/section-3-api-design.md`
- Test spec: `working/section-3-test-spec.md`
- Plan: `working/section-3-plan.md`
- Implementation notes: `working/section-3-implement.md`
- Validation: `working/section-3-validate.md`

4. Runbook
- Research: `working/section-4-research.md`
- API design: `working/section-4-api-design.md`
- Test spec: `working/section-4-test-spec.md`
- Plan: `working/section-4-plan.md`
- Implementation notes: `working/section-4-implement.md`
- Validation: `working/section-4-validate.md`

## Traceability

- Requirement baseline: `sources/requirements.md`
- Derived planning brief: `sources/brief.md`
- Section contract: `spec.md`
