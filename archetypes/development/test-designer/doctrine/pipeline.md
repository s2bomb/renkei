# Pipeline

## Position

```
/research-codebase → /api-designer → /test-designer → /create-plan → /test-implementer → /implement-plan
```

After `/api-designer`. Before `/create-plan`.

## Inputs

- Section API design document from `/api-designer` (primary input)
- Section spec references (spec.md and relevant source requirements)
- Section research output from `/research-codebase`

If the design doc is missing, stop and route back to `/api-designer`.

## Outputs

Test specification document consumed by the planner and test implementer.

## Feedback Loop

If the design makes a requirement untestable, surface the gap to the architect. The architect routes feedback to `/api-designer`. The test-designer and api-designer iterate until testability is achieved.
