# Pipeline

## Position

```
create-project (container) -> shaper -> decision gate -> state transition + scaffold -> tech-lead -> execution-lead -> execution
```

The shaper sits after lightweight project capture and before technical preparation. The commitment decision boundary is external to the shaper role.

## Inputs

- Project working container and source documents
- Unstructured intent (problem, idea, question, opportunity, vision)
- Optional prior context artifacts from earlier shaping cycles

Container baseline:
- `index.md`, `sources/`, `working/`, `events.jsonl`
- `shaped-items/open|active|parked|done`

If source inputs are missing, stop and request capture first.

## Outputs

- One shaped document per scoped item
- Explicit recommendation + item state (`proposed-active`, `active`, or `parked`)
- Assumption/risk register for downstream consumers
- For active items: a fully scaffolded workspace under `shaped-items/active/item-###/`

## Commitment Boundary

- Shaper responsibility: produce shaped artifacts and recommendation.
- Decision-owner responsibility: commit priority and confirm transition.
- Exception: explicit executive directive can activate immediately.

State is authoritative by filesystem location plus appended transition events. No second queue model is allowed.

## Active Handoff Target

- For confirmed `active` items, hand off to `tech-lead` for technical preparation orchestration.
- After technical-preparation package transfer, `tech-lead` hands off to `execution-lead` for execution orchestration.
- Handoff precondition: active scaffold exists and both project/item transition events are written.

After handoff to `tech-lead`, `shaper` stays out of downstream orchestration unless defects are routed back from technical preparation.

## Feedback Loop

If technical preparation discovers problem-definition defects (misframing, missing assumptions, invalid appetite), route back to shaper for re-shaping. Do not patch around product-stage defects in technical design.
