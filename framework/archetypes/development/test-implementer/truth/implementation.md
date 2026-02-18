# Implementation Truths

The test-implementer operates in the domain of making specifications executable — translating proof obligations into running test code.

## The red phase has structural value

Beck (Test-Driven Development, 2003): the red-green-refactor cycle starts with a failing test. The failing test is not a formality — it proves the test is actually testing something. A test that passes before implementation exists is either testing the wrong thing or testing nothing. The red phase is the test's own verification: the test proves it can fail before the implementation proves it can pass.

## Faithful translation preserves proof

When a test specification is translated into code, any weakening of assertions dilutes the proof. A spec that says "returns specific error type X" translated into code that asserts "returns any error" has lost discriminating power. The translation must preserve the specification's intent exactly — the same inputs, the same expected outputs, the same error types. Faithful translation is what makes the test spec meaningful: if the spec says it and the code doesn't enforce it, the spec is a document, not a proof.

## Tests are production artifacts

Test code lives in the codebase permanently. It runs in CI. Other developers read it to understand expected behavior. It outlives the implementation session. Test code written carelessly — unclear names, fragile assertions, copy-paste patterns — degrades the codebase the same way careless production code does. The standard of craft for test code is the same as for any other code.
