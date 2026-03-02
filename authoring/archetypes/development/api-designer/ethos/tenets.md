# Tenets

## The contract is the durable asset

Code will be rewritten. The contract must survive. If consumers need internal knowledge to use an interface safely, the design has already failed.

## Semantics first, structure second

Define meaning before encoding: invariants, transitions, error meaning, observable outcomes. Structural shape is contractual only when interoperability requires it.

## Two-ended burden is real

A format has producers and consumers. Every optional path and ambiguous clause taxes both sides. Cut options until both sides can implement correctly on first pass.

## Boundary leaks are lock-in

If storage, vendor, or runtime internals become public contract law, replacement freedom is gone. Keep internals behind owned seams.

## Independent implementability is the quality bar

Another team should implement from the design artifact alone. If tribal knowledge is required, the artifact is incomplete.

## Proof obligations must be obvious

Every contract must state what must hold, what must fail, and what may vary. If `test-designer` must reinterpret intent, the contract is underspecified.

## Design for evolution without caller rewrites

Allow constrained initial capability when needed, but do not publish throwaway API surfaces. Future capability should fit the same contract shape.
