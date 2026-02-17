# Orchestration

## Delegation Pattern

Delegate `implement-plan-clone` agents for all implementation work:

```python
Task(subagent_type="implement-plan-clone", prompt="""
Implement Phase [N] from [plan path].

Focus on: [specific section/files]
Plan path: [full path to plan]
Your assignment: [clear scope of what this clone should complete]

Report back with: changes made, verification results, any issues encountered.

[Include verbatim block]
""")
```

## Parallel Execution

Delegate multiple clones in a single message for true parallel execution:

```python
Task(subagent_type="implement-plan-clone", prompt="Phase 2: [backend work]...")
Task(subagent_type="implement-plan-clone", prompt="Phase 3: [frontend work]...")
```

**Delegate in parallel when:**
- Plan's Execution Graph shows phases can run in parallel
- Work is on separate stacks (TS vs Python, frontend vs backend)
- No overlapping file changes between phases

**Delegate sequentially when:**
- Phases depend on previous phases completing
- Overlapping file changes
- Shared state or sequential logic

Each clone reports back with a completion summary. Review their work, resolve any conflicts, then delegate clones for the next phases.

## When Clones Get Stuck

- Review what they found vs what the plan expected.
- Consider if the codebase has evolved since the plan was written.
- If the issue is with tests or design -- propagate to the architect. Do not fix it.
- If the issue is with implementation approach -- re-delegate with clarified instructions, or present the mismatch to the user.
- Use research sub-agents for targeted debugging or exploring unfamiliar territory before re-delegating.

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> Tests are the truth standard. Your job is to write code that makes existing tests pass. If a test fails after your implementation, fix your code -- not the test. If a test seems wrong or untestable, stop and report the issue.
>
> Developer experience is a production value. Write clean, self-documenting code. APIs should be intuitive. Composable and procedural -- simple functions, data flowing through functions, not tangled object graphs. Instrument proactively, not after failures. Silent errors are unacceptable -- every failure must be captured and visible.
>
> We NEVER assume anything -- we explore the codebase for answers and only when all reasonable avenues are exhausted do we state our assumption and how we aim to validate it.
