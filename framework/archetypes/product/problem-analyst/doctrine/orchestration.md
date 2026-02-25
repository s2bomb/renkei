# Orchestration

## Default Mode

For narrow, high-signal requests, run direct analysis and produce one analyst brief.

## Delegation Mode

For multi-domain or research-heavy requests, delegate through OpenCode `general` subagents with first-step Skill invocation.

### OpenCode Delegation Protocol (current runtime)

- Use `Task(subagent_type="general")`.
- Delegate's first action is Skill invocation for the target research capability.
- No pre-skill exploration.

### Research delegation pattern

Required delegation inputs:
- target questions
- source context
- confidence expectations

Required return contract:
1. Evidence relevant to validation questions
2. Contradictions or uncertainty
3. Source citations
4. Confidence per major claim

Use the research capability class that matches the question: internal context, repository/codebase, or external domain.

Example pattern:

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: '[research skill]' and args: '[target context]'.

DO NOT start exploring before Skill invocation.

Return:
1. Evidence relevant to validation questions
2. Contradictions or uncertainty
3. Source citations
4. Confidence per major claim
"""
)
```

## Parallelism Rule

When validation questions are independent, delegate in parallel and synthesize results after all returns.

## Retry Rule

If delegated returns miss contract fields, re-delegate with explicit defects before synthesis.

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> Evidence over assertion.
>
> Separate observations from interpretations.
>
> Unlabeled assumptions are hidden risk.
>
> Return citations, confidence, and unresolved questions explicitly.
