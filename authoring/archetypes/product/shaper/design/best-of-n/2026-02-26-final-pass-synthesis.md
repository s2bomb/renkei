# Best-of-N Synthesis (2026-02-26 Final Pass)

## Inputs

- `2026-02-26-final-pass-a.md`
- `2026-02-26-final-pass-b.md`
- `2026-02-26-final-pass-c.md`

## Convergent Decisions

1. Activation must be explicit and deterministic, not implicit.
2. `architect-opencode` handoff should occur immediately after activation preconditions are met.
3. Team membership and delegation triggers must be explicitly codified.
4. Problem-analyst orchestration should use concrete skill routing, not placeholders.
5. Transition observability must be append-only and artifact-linked.

## Applied in this pass

1. Updated shaper process/pipeline/output contract for:
   - queue-based state transitions
   - activation scaffold requirements
   - project/item event ledger requirements
2. Added shaper `doctrine/team-contract.md` and wired manifest ordering.
3. Updated shaper orchestration with:
   - explicit team triggers
   - mandatory immediate `architect-opencode` delegation on activation
   - bounded retry + escalation rule
4. Updated problem-analyst doctrine with:
   - concrete skill routing (`research-codebase`, `repository-researcher`, `web-search-researcher`)
   - bounded retry + escalation
   - explicit satellite capability article
   - output schema alignment to shaper intake contract

## Deferred / Not Applied

1. `state.yaml` as state authority was not adopted in this pass.
   - Reason: current workflow already uses explicit queue paths and JSONL ledger, which meets single-source state intent with lower migration cost.

## Operational Definition of Done

- User can choose `open` item and explicitly promote it to `active`.
- Promotion generates required active item scaffold.
- Transition events are written to project and item ledgers.
- `architect-opencode` delegation runs immediately after activation preconditions are met.
