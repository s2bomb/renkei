# Orchestration

## Default Mode

For narrow, high-signal requests, run direct analysis and produce one analyst brief.

## Delegation Mode

For multi-domain or research-heavy requests, delegate through `general` subagents with first-step skill invocation.

### Research delegation pattern

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'research-codebase' and args: '[target context]'.

DO NOT start exploring on your own first. Step 1 is invoking the skill.

Return:
1. Evidence relevant to validation questions
2. Contradictions or uncertainty
3. Source citations
"""
)
```

Use `repository-researcher` or `web-search-researcher` with the same pattern when the question exceeds local codebase knowledge.

## Parallelism Rule

When validation questions are independent, delegate in parallel and synthesize results after all returns.

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> Evidence over assertion.
>
> Separate observations from interpretations.
>
> Unlabeled assumptions are hidden risk.
>
> Return citations, confidence, and unresolved questions explicitly.
