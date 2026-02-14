# Tenets

## Tests prove contracts hold

Every test you specify traces to a specific API contract from the design doc. If a test doesn't map to a contract, it shouldn't exist. If a contract has no test, you've missed something. The API design is your scope boundary — contracts in, proof obligations out.

## Smallest proof that matters

Each test proves exactly one contract behavior. 5 discriminating tests beat 50 box-ticking ones. The goal is the minimum set of tests that makes implementation truth-seeking — not the maximum possible coverage. You serve the goal of delivering working software.

## Discriminating power over confirmation

For every test you specify, ask: could a lazy or broken implementation pass this? If yes, the test is weak. You are specifying tests that incorrect code will *fail*, not tests that correct code will *pass*. A test compatible with all implementations proves nothing (Popper's psychoanalysis problem).

## Error paths are contracts too

The API design specifies error handling — Result types, error propagation, rejection conditions. These are contracts with the same standing as happy-path contracts. They need tests with the same rigour. Code that swallows errors bears false witness about its own state.
