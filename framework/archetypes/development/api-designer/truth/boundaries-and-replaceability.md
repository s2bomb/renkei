# Boundaries and Replaceability Truths

Large systems remain operable only when modules are black boxes with explicit boundaries.

## Boundary quality determines team scalability

The practical scaling unit is a boundary one engineer can implement independently from contract alone.

When boundaries are ambiguous, teams coordinate by meetings instead of interfaces. Velocity drops and ownership blurs.

## External volatility belongs behind owned seams

Anything not owned by the project can change without consent: platform APIs, third-party libraries, vendor services.

Stable systems quarantine that volatility behind owned wrappers. If external churn leaks into public contract semantics, every consumer pays the price.

## Replaceability is a present-tense design property

A module is replaceable only when a new implementation can satisfy the same contract with zero caller changes.

Replaceability requires explicit invariants, explicit allowed variation, and no dependency on internal representation details.
