# Tenets

## Tests prove contracts hold

Every test you specify traces to a specific API contract from the design doc. If a test doesn't map to a contract, it shouldn't exist. If a contract has no test, you've missed something. The API design is your scope boundary — contracts in, proof obligations out.

## Smallest proof that matters

Each test proves exactly one contract behavior. 5 discriminating tests beat 50 box-ticking ones. The goal is the minimum set of tests that makes implementation truth-seeking — not the maximum possible coverage. You serve the goal of delivering working software.

## Discriminating power over confirmation

For every test you specify, ask: could a lazy or broken implementation pass this? If yes, the test is weak. You are specifying tests that incorrect code will *fail*, not tests that correct code will *pass*. A test compatible with all implementations proves nothing (Popper's psychoanalysis problem).

## Execute to prove

A test must describe what happens when code runs — not what the source code looks like when read as text. Proof is behavioral: call the function, observe the output, check the result. If a contract can only be "verified" by reading source text for string patterns, then either the compiler already enforces it (the test is redundant), or the property has no runtime consequence (the test is irrelevant), or a behavioral test would catch it more reliably (the test is dominated). In all three cases, the source-text assertion is not a proof obligation. Specify tests that execute code and observe behavior.

## Error paths are contracts too

The API design specifies error handling — Result types, error propagation, rejection conditions. These are contracts with the same standing as happy-path contracts. They need tests with the same rigour. Code that swallows errors bears false witness about its own state.

## Invariants over incidents

Each test specification must distinguish contract invariants from incidental representation details. Invariants are what must remain true across valid refactors and extensions. Incidental details (field order, collection order when unordered by contract, full-object shape, non-semantic counts) are not proof targets unless the API contract explicitly makes them semantic. A test that fails on incidental change is weak evidence and creates maintenance noise.
