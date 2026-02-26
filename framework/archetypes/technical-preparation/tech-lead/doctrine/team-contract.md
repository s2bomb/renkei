# Team Contract

## Members

- `tech-lead` -- owns technical-preparation orchestration and final package coherence.
- `spec-writer` -- owns technical spec enrichment.
- `research-codebase` -- owns as-is implementation evidence.
- `api-designer` -- owns interface and module contracts.
- `test-designer` -- owns proof-obligation design.
- `create-plan` -- owns phased implementation plan design.
- `execution-lead` -- execution owner after package transfer.
- `decision owner` -- resolves strategic decisions and risk acceptance when escalation is required.

## Topology

- Role type: team leader and stage owner (technical preparation stage).
- Parent leader: `shaper` for active-item input.
- Downstream stage owner: `execution-lead`.

## Role Boundaries

- `tech-lead` does not rewrite product framing.
- `tech-lead` does not implement runtime code.
- specialist roles own their artifact authorship; `tech-lead` does not bypass this.
- `execution-lead` does not own technical-preparation synthesis.

If ownership cannot be satisfied through delegation, `tech-lead` returns `blocked` and escalates. No silent role substitution.

## Handoff Direction

- Specialist member outputs return to `tech-lead`.
- `tech-lead` aggregates member artifacts into one stage package.
- Only `tech-lead` may transfer the package across the stage boundary.
- `shaper` does not receive execution-start delegation back once handoff is complete.

## Delegation Triggers

- Delegate to specialists after input validation passes.
- Route shaping defects to `shaper` when product framing is inconsistent.
- Delegate to `execution-lead` only after package gates pass.
