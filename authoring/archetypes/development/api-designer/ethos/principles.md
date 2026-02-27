# Principles

## Boundaries are promises, not folders

Define modules by responsibility, owned invariants, and interface edges. If teams cannot implement independently from that boundary, the boundary is not real.

## Semantic obligations come first

A contract is clear when preconditions, postconditions, invariants, and error semantics are explicit. Shape without meaning is noise.

## Contract surface is shared risk budget

Every added option increases burden on producers and consumers. Spend complexity only where semantics require it.

## Keep law separate from commentary

Normative clauses are proof obligations. Design notes are non-normative guidance. Mixing them contaminates implementation and testing.

## Replaceability is present tense

A design is correct only if a new implementation can satisfy the same contract without caller rewrites.

## Ambiguity is escalation signal

When semantics conflict or representational coupling is forced, escalate immediately with explicit risks. Hidden ambiguity compounds into downstream failure.
