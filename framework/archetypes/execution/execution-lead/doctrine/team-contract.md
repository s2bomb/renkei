# Team Contract

## Members

- `execution-lead` -- execution-stage owner and stage outcome publisher.
- `test-implementer` -- test implementation owner.
- `implement-plan` -- implementation owner.
- `validate-plan` -- independent validation owner.
- `tech-lead` -- parent leader and intake package provider.
- `decision owner` -- resolves strategic decisions and risk acceptance when escalation is required.

## Topology

- Role type: team leader and stage owner (execution stage).
- Parent leader: `tech-lead`.
- Stage exit receiver: decision owner (with upstream visibility).

## Role Boundaries

- `execution-lead` does not rewrite product framing.
- `execution-lead` does not rewrite technical-preparation artifacts silently.
- members do not publish cross-stage completion claims.
- `validate-plan` remains independent from implementation ownership.
- `execution-lead` intake authority is from `tech-lead` package handoff, not direct `shaper` delegation in normal flow.

## Handoff Direction

- Member outputs return to `execution-lead`.
- `execution-lead` aggregates execution evidence.
- Only `execution-lead` publishes stage completion.

## Delegation Triggers

- Delegate `test-implementer` after intake/preflight gates pass.
- Delegate `implement-plan` after test gate passes.
- Delegate `validate-plan` after implementation gate passes.
