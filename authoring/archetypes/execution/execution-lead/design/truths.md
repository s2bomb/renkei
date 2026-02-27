# Truths: Execution-Lead

**Date**: 2026-02-26
**Status**: Initial truth library

---

## T-01: Execution stage needs a single accountable owner

Truth statement: Once work crosses from preparation into build, one stage owner must hold execution accountability.

Evidence:
- Shape Up building model and ownership boundaries
- Current contract split (`tech-lead` handoff model)
- Team/stage vocabulary definitions

Negation test: If multiple owners can command execution simultaneously, defect ownership and closure signals become ambiguous.

Independence test: True across project delivery systems beyond this archetype.

Likely to ground:
- Identity: execution-stage owner
- Doctrine: only leader publishes stage completion

## T-02: Test-first execution preserves proof obligations

Truth statement: Execution quality improves when test obligations are implemented before code changes.

Evidence:
- `test-implementer` and `implement-plan` pipeline contracts
- Architect orchestration order (test-implement -> implement -> validate)

Negation test: If implementation starts before proof obligations are executable, behavior targets drift under coding pressure.

Independence test: True in disciplined TDD workflows generally.

Likely to ground:
- Tenet: red-before-green
- Doctrine: test-implementer runs before implement-plan

## T-03: Unknowns discovered during build must be surfaced, not hidden

Truth statement: Execution discovers late coupling and edge cases; hiding unknowns creates false progress.

Evidence:
- Shape Up uphill/downhill and scope-hammering sections
- Validation emphasis on real code and source coverage

Negation test: If unknowns are hidden, stage status becomes untrustworthy and risk is deferred to deadline.

Independence test: True across software delivery contexts.

Likely to ground:
- Tenet: visible uncertainty
- Doctrine: explicit retry/escalation gates

## T-04: Validation must be independent from implementation

Truth statement: Self-attested completion is weaker than independent validation against source requirements.

Evidence:
- `validate-plan` rules: verify code and sources, not checkboxes only

Negation test: If implementers are final validators, unnoticed requirement gaps are more likely to ship.

Independence test: True across quality-assurance disciplines.

Likely to ground:
- Tenet: completion means validated behavior
- Doctrine: validation gate required for stage exit

## T-05: Fixed time requires active scope tradeoffs during execution

Truth statement: Under fixed time, execution must continuously separate must-haves from deferrable work.

Evidence:
- Shape Up fixed-time and scope-hammering doctrine

Negation test: If all scope is treated as equally mandatory during execution, deadlines fail or quality collapses.

Independence test: True in time-bounded delivery contexts.

Likely to ground:
- Tenet: scope stewardship under pressure
- Doctrine: escalation when must-have delivery is threatened
