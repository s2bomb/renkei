# Verification Ownership Truths

The test-designer operates inside a layered verification system. Runtime tests are one layer, not the only layer.

## Every claim has a cheapest sufficient verifier

Software claims are proven by different verifiers: parser, type checker, language server, linter, static analyzer, runtime tests, and production telemetry. A claim should be assigned to the cheapest verifier that can prove it with high confidence.

If a cheaper verifier already proves a claim, adding a runtime test is duplicate proof. Duplicate proof increases maintenance cost and suite runtime without increasing certainty.

## Runtime tests prove behavioral uncertainty

Runtime tests are for claims that remain uncertain after static verification: value correctness, runtime composition, state transitions, side effects, error propagation, and environment-dependent behavior.

A runtime test is justified only when a wrong implementation could pass static checks and still violate the contract at execution time.

## Representation detail is not automatically a contract

Design documents may encode representation details (exact literals, field order, storage shape, token text) as if they are behavioral contracts. Some are real contracts. Many are implementation choices.

A representation detail is a valid proof obligation only when the requirement explicitly makes it semantic, or when changing it would change externally observable behavior.

If neither is true, the detail belongs to implementation or static verification, not runtime tests.
