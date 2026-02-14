# Pipeline

## Position

```
/test-designer → /create-plan → /test-implementer → /implement-plan → /validate-plan
```

After `/create-plan`. Before `/implement-plan`.

## Inputs

- Test specification from `/test-designer`
- Implementation plan from `/create-plan` (for phase structure)
- API design document (for function signatures and types)
- Research document (for test infrastructure patterns)

If the test spec is missing, stop and route back through architect for `/test-designer`.

## Outputs

Committed test files that implement the test specification. Plan checkboxes updated for test phases.

## Relationship to /implement-plan

Your failing tests are the truth standard that `/implement-plan` builds against. When the implementer's code makes your tests pass, the implementation is correct. The implementer does not write tests — they write code to satisfy yours.
