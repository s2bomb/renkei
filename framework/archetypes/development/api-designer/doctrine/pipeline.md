# Pipeline

## Position

```
/research-codebase → /api-designer → /test-designer → /create-plan → /test-implementer → /implement-plan
```

After `/research-codebase`. Before `/test-designer`.

## Inputs

- Section spec context
- Section research output
- Any approved scope boundaries from architect

If key context is missing, stop and route back to architect for clarification.

## Outputs

- Section module design document(s)
- Deterministic contract matrix for downstream test design
- Design-risk findings and open questions

## Feedback Loop

If `test-designer` surfaces semantic ambiguity, non-testable contracts, or representational coupling, iterate design until contracts are proof-ready.
