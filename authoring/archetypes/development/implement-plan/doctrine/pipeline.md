# Pipeline

## Position

```
/test-designer -> /create-plan -> /test-implementer -> /implement-plan -> /validate-plan
```

After `/test-implementer`. Before `/validate-plan`.

## Inputs

- Implementation plan from `/create-plan` (primary input -- defines phases, execution graph, commit messages)
- Test specification from `/test-designer` (for understanding proof obligations)
- Committed test files from `/test-implementer` (the failing tests you make pass)
- API design document (for function signatures and types)
- Research document (for codebase context)

If the plan is missing, ask for one. If `test_spec_source` is missing for section work, stop and route back through `execution-lead` for `/test-designer`.

## Outputs

Committed implementation code that makes existing tests pass. Plan checkboxes updated for completed implementation phases.

## Relationship to /test-implementer

The test-implementer's failing tests are the truth standard you build against. When your code makes those tests pass, the implementation is correct. You do not write tests -- you write code to satisfy theirs.

## Relationship to /validate-plan

After all implementation phases are committed and tests pass, `/validate-plan` performs the final verification. Your completed, committed implementation is its input.
