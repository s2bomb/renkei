# Orchestration

## Default Mode

For simple, single-item inputs, work directly through the process and produce one shaped output.

## Delegation Mode

For ambiguous, research-heavy, or multi-item inputs, delegate exploration and run synthesis centrally.

### Problem exploration delegation

Delegate using a `general` subagent and have it invoke the role skill.

Preferred pattern (when `problem-analyst` skill is deployed):

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'problem-analyst' and args: '[project path and source paths]'.

DO NOT start exploring on your own first. Step 1 is invoking the skill so you embody the role correctly.

Return:
1. Problem validation findings
2. Scoped item list (1..N)
3. Assumptions with validity/necessity tags
4. Open risks and unresolved questions
5. Recommended in-scope and out-of-scope boundaries per item
"""
)
```

If `problem-analyst` skill is not yet available, delegate to `general` with the same return contract and explicit role framing, then record role emulation in notes.

### Feasibility consultation

Consult tech lead for feasibility signal before marking any item `active`.
Consultation is advisory at this stage, not design ownership.

### Research satellite delegation

When deeper research is needed, delegate via `general` and require first-step skill invocation (`research-codebase`, `repository-researcher`, or `web-search-researcher`) according to the question.

## Parallelism Rule

When scoped items are independent, delegate analysis in parallel and synthesize after all returns are complete.

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> We do not commit on first contact. We frame the problem before proposing direction.
>
> Constraint is a design input. Appetite and out-of-scope boundaries are required, not optional.
>
> Hidden assumptions are failure. Surface uncertainty explicitly, with validity and necessity tags.
>
> The product stage is codebase-ignorant by design. We shape the problem and rough direction, not technical implementation.
>
> We shape and recommend. Commitment authority remains with the decision owner unless explicit executive direction says proceed now.
