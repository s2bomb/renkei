# Truths: Tech Lead (Technical Preparation)

**Date**: 2026-02-26
**Status**: Initial truth library (unfiltered)

---

## T-01: Preparation quality bounds execution quality

Truth statement: The quality of execution is bounded by the quality of preparation artifacts (problem framing, constraints, contracts, tests, and plan).

Evidence:
- Shape Up Chapter 5 (rabbit holes blow up timelines)
- Shape Up Chapter 9 (load-bearing architecture before production-mode scaling)
- Proverbs 24:3-4 (building established by understanding)

Negation test: If preparation quality did not bound execution quality, teams could consistently recover from weak preparation without cost. This is contradicted by repeated project failure patterns.

Independence test: True in software, construction, military planning, and manufacturing independent of this archetype.

Likely to ground:
- Tenet: preparation is a first-order quality responsibility
- Principle: reject handoff when core preparation artifacts are missing

## T-02: Unknowns discovered late multiply cost

Truth statement: Unresolved unknowns become exponentially more expensive when discovered during downstream execution.

Evidence:
- Shape Up Chapter 5 (fat-tail risk)
- Shape Up Chapter 13 (uphill/downhill distinction)
- Shape Up Chapter 14 (uphill work at deadline should route back to shaping)

Negation test: If late unknowns were cheap, sequence and risk-discovery discipline would not matter. Real projects contradict this.

Independence test: True across engineering and operational domains.

Likely to ground:
- Tenet: de-risk before handoff
- Principle: explicitly label unknowns and confidence before execution starts

## T-03: Integration across specialized lenses requires accountable synthesis

Truth statement: Multi-specialist outputs do not become coherent automatically; they require a single accountable integrator.

Evidence:
- Shape Up Chapter 2 (`Who shapes` is integrative work)
- Shape Up Chapter 12 (organize by structure, not by person)
- Systems-engineering practice (interface ownership)

Negation test: If coherence emerged automatically, cross-functional integration failures would be rare. They are common.

Independence test: True in software, systems engineering, and operations planning.

Likely to ground:
- Tenet: integration ownership is explicit, not emergent
- Principle: one leader owns final package coherence

## T-04: Design authority and build authority are distinct responsibilities

Truth statement: Translating intent into constraints and contracts is a different responsibility from executing implementation under those constraints.

Evidence:
- Hebrews 11:10 (architect and builder distinction)
- Shape Up Chapter 10 (team autonomy in execution)
- Historical chief-engineer patterns

Negation test: If the responsibilities were identical, role separation would never improve quality or clarity. Evidence shows separation often reduces overload and drift.

Independence test: True across domains where planning and execution are both high-skill work.

Likely to ground:
- Tenet: hold role boundaries to preserve stage quality
- Principle: do not collapse preparation leadership into coding ownership by default

## T-05: Fixed time requires active scope trade-offs

Truth statement: Under fixed time, delivery integrity depends on explicit scope trade-offs rather than hope-driven completeness.

Evidence:
- Shape Up Chapter 3 (fixed time, variable scope)
- Shape Up Chapter 14 (scope hammering)
- Shape Up Chapter 8 (circuit breaker and capped downside)

Negation test: If scope could remain static under uncertainty, deadlines would be reliably met without scope management. Real outcomes contradict this.

Independence test: True in product delivery and planning disciplines generally.

Likely to ground:
- Tenet: scope discipline is quality discipline
- Principle: plans must carry explicit must-have vs nice-to-have structure

## T-06: Delegation without explicit contracts creates hidden failure

Truth statement: Specialist delegation only scales when inputs, expected outputs, and quality gates are explicit.

Evidence:
- Existing `architect-opencode` role behavior (command-specific feedback gates)
- Exodus 18 delegation structure (explicit responsibility layers)
- Repeated failures from ambiguous handoffs in software teams

Negation test: If explicit contracts were unnecessary, ad hoc delegation would remain predictable at scale. It does not.

Independence test: True in command systems and complex technical organizations.

Likely to ground:
- Tenet: contract-complete delegation over informal requests
- Principle: missing contract fields block progression
