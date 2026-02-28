# Semantics and Structure Truths

`Semantics` and `structure` are different truths and must be designed separately.

- `Semantics`: what must be true.
- `Structure`: how truth is encoded.

Confusing them creates contracts that are strict in irrelevant places and vague where behavior should be explicit.

## Semantic obligations are what downstream proves

A valid contract states semantic obligations directly: invariants, state transitions, error meaning, and observable outcomes.

Downstream implementation and test teams cannot prove intent. They can prove only stated obligations.

Representation details are contractual only when interoperability depends on them.

## Representation leakage creates false coupling

Storage engines, vendor APIs, transport choices, and runtime internals are implementation decisions.

When those decisions leak into public contract semantics without necessity, consumers are coupled to replaceable internals. Replaceability falls, test burden inflates, and future change becomes forced migration.
