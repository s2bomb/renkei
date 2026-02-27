# Source Impact: First Live Usage Conversation (2026-02-26)

## Why this matters to problem-analyst

Live shaper usage identified orchestration clarity gaps that affect analyst quality and handoff determinism.

## Extracted Requirements

1. Analyst delegation triggers must be explicit and role-based.
2. Satellite capability selection must use concrete skill names for OpenCode runtime.
3. Analyst output fields must align with shaper intake schema to avoid translation loss.
4. Analyst artifacts should fit active-item workspace conventions used by shaper activation.

## Doctrine Impact Targets

- `doctrine/orchestration.md`: concrete skill routing + bounded retry/escalation.
- `doctrine/output-contract.md`: exact field names expected by shaper.
- `references/template.md`: item-id keyed decomposition and citation/confidence summary.
