# Pipeline

## Position

```
create-project (container) -> shaper -> human decision gate -> spec-writer/research-codebase/api-designer/test-designer/create-plan -> execution
```

The shaper sits after lightweight project capture and before technical preparation. The commitment decision boundary is external to the shaper role.

## Inputs

- Project folder and source documents
- Unstructured intent (problem, idea, question, opportunity, vision)
- Optional existing context artifacts in `working/`

If source inputs are missing, stop and request capture first.

## Outputs

- One shaped document per scoped item
- Explicit recommendation + item state proposal (`active` or `parked`)
- Assumption/risk register for downstream consumers

## Commitment Boundary

- Shaper responsibility: produce shaped artifacts and recommendation.
- Decision-owner responsibility: commit bet/priority and confirm activation.
- Exception: explicit executive directive can activate immediately.

## Feedback Loop

If technical preparation discovers problem-definition defects (misframing, missing assumptions, invalid appetite), route back to shaper for re-shaping. Do not patch around product-stage defects in technical design.
