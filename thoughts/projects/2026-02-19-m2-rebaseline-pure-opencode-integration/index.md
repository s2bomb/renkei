# Project: M2 Rebaseline -- Pure OpenCode Integration

## Purpose
Reset M2 on corrected foundations by integrating the Renkei harness with pure upstream OpenCode as an in-repo dependency/workspace component, while preserving composition-first behavior and baseline OpenCode workflow parity.

## Status

**COMPLETE.** All four sections validated and passing. Quality gates green (141 unit tests, typecheck, lint).

## Operator Direction
- Source requirements are preserved verbatim in `sources/requirements.md`.
- Spec authored by `spec-writer` at `spec.md`.

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
  - `section-1-implement.md` -- complete (corrective closure added: vendored upstream OpenCode materialized at `vendor/opencode`)
  - `section-1-validate.md` -- complete (verdict: PASS; linkage contract now matches live vendored path)
- Section 2 pipeline status:
  - `section-2-research.md` -- complete
  - `section-2-api-design.md` -- complete
  - `section-2-test-spec.md` -- complete
  - `section-2-implementation-plan.md` -- complete through TI-1/IP-1/TI-2/IP-2/TI-3/IP-3/IP-4 and global gate
  - `section-2-implement.md` -- complete
  - `section-2-validate.md` -- complete (verdict: PASS)
- Section 3 pipeline status:
  - `section-3-research.md` -- complete
  - `section-3-api-design.md` -- complete
  - `section-3-test-spec.md` -- complete
  - `section-3-implementation-plan.md` -- complete through TI-0/TI-1/IP-1/TI-2/IP-2/TI-3/IP-3/TI-4/IP-4 and global gate
  - `section-3-implement.md` -- complete (live pass-path evidence recorded)
  - `section-3-validate.md` -- complete (verdict: PASS)
- Section 4 pipeline status:
  - `section-4-research.md` -- complete
  - `section-4-api-design.md` -- complete
  - `section-4-test-spec.md` -- complete
  - `section-4-implementation-plan.md` -- complete
  - `section-4-validate.md` -- complete (verdict: PASS; prior default resolver-path coverage blocker resolved)

## Project Closure

All sections PASS. Acceptance criteria from spec.md:
- [x] Running `renkei-dev` from the harness path works against pure upstream OpenCode with no sibling-path assumptions.
- [x] Baseline OpenCode workflows pass the agreed no-degradation gate in this repository.
- [x] Unavailable Renkei-only capabilities fail explicitly with typed outcomes rather than implicit fallthrough.
- [x] Operator smoke path and runbook are documented and executable from a clean checkout.

Quality gates at closure:
- `bun run typecheck` -- clean
- `bun run lint` -- clean
- `bun run test:unit` -- 141 pass, 0 fail
