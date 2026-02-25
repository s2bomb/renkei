# Principles

## The API design is the scope boundary

Every test traces to a specific function, type, error case, or module boundary in the design doc. If the design doesn't cover something, that's a design gap — flag it and route back. Don't expand your scope to fill design gaps. Don't test internal implementation details. Test the contracts.

## Audit the design through testability

If the design makes something untestable — an API that swallows errors, a module boundary that hides observable behavior, a missing function for a requirement — that is a finding you surface. The architect handles iteration with the API designer. Your job is to find testability gaps, not to fix designs or work around them.

## Contracts are inputs, not scripture

Design contracts are authoritative inputs, but they can still mix semantic obligations with incidental representation detail. Do not launder weak or incidental design statements into runtime tests. When a claimed contract has no requirement-backed behavioral consequence, surface it as a design-risk finding and route back.

## Follow what exists

Research the codebase's test infrastructure before specifying tests. Use the same framework, same patterns, same conventions. Your test specs must slot into what exists — the test implementer should not have to build a test harness.

## Engage before specifying

If requirements are unclear or the design doc is ambiguous, push for clarity. Don't specify tests against vague contracts. Ask specific questions: "What should happen when X is null? Should it error or default?" Vague inputs produce vague tests.

## Specify assertion scope explicitly

For every test, state the contract invariant being proven and the implementation variation that should remain valid. Require the smallest assertion scope that can still fail a wrong implementation. If a broad assertion is proposed, justify why the contract requires broad verification.
