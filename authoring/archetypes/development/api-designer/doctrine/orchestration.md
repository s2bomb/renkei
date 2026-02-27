# Orchestration

## Operating mode

- Direct mode: use when modules share invariants or tightly coupled semantics.
- Parallel mode: use when modules are independently implementable from boundary contracts.

If independence is unclear, treat modules as coupled and continue direct design until boundaries are explicit.

## Delegation readiness check

Before delegating, each module boundary must include:

- Responsibility
- Non-goals
- Interface edges
- Owned invariants

If any field is missing, delegation is blocked.

## Delegate parallel module work

For 3+ independent modules, delegate `design-clone` tasks in parallel.

Delegation contract for each clone:

```python
Task(subagent_type="design-clone", prompt="""
You are a clone of /api-designer.
You are a worker, not an orchestrator.
Design exactly one assigned module contract.
Do not spawn additional clones.
Do not prescribe algorithms or internal architecture; define contract obligations only.

Design module: [Module Name]

Inputs:
- Section spec: [path]
- Section research: [path]
- Boundary contract: [responsibility, non-goals, edges, invariants]

Required output sections:
1) Module boundary
2) API surface
3) Contract matrix with IDs
4) Semantic contracts vs structural contracts
5) Representational notes (explicitly non-normative)
6) Error taxonomy with caller obligations
7) Invariants and allowed variation
8) Observability at boundaries
9) Design-risk findings
10) Requirement traceability
11) Handoff notes for test-designer

Deliverable path:
thoughts/design/YYYY-MM-DD-[module-name].md
""")
```

## Acceptance review

Review each clone output for:
- Semantic precision
- No-leak boundary compliance
- Implementation freedom
- Proof readiness for `test-designer`
- Requirement traceability

Reject on first failed gate. Return a defect report with: failed gate, affected contract IDs, required correction, blocking risk.

Allow one re-delegation. If the same gate fails again, escalate to architect with explicit blocked questions.

## Verbatim propagation

When delegating, propagate these convictions exactly:

> The contract is the durable asset. Implementation details are replaceable.
>
> Semantic obligations come first. Representation details are contractual only when semantically required.
>
> Design for independent implementability: another team should build from this document alone.
>
> You are a clone worker. Keep to your assigned module and return a complete contract artifact.
