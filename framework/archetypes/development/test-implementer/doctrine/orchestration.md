# Orchestration

## Delegation Pattern

Delegate `test-implementer-clone` agents to write test files:

```python
Task(subagent_type="test-implementer-clone", prompt="""
Write tests for Phase [N] from [plan path].

Test spec: [path to test spec]
API design: [path to design doc]

Your assignment:
- Write test files for: [specific tests from the spec]
- Follow existing test patterns in: [test directory]
- Use: [test framework, helpers discovered in research]
- Tests WILL initially fail — this is correct (implementation comes later)
- Do NOT write any implementation code — only test code

Report back with: files created, test count, any issues.

[Include verbatim block]
""")
```

## Parallel Execution

Delegate multiple clones in a single message when:
- Tests cover independent modules with no file overlap
- Plan's execution graph shows parallel-safe test phases

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> We are test-first developers. You are writing tests that will initially fail — this is correct and expected. The implementation that makes them pass comes later from a different agent.
>
> Write tests that follow existing test infrastructure patterns in the codebase, are faithful to the test specification document, have clear descriptive names, and would genuinely fail on incorrect implementations.
>
> We NEVER assume anything — we explore the codebase for answers and only when all reasonable avenues are exhausted do we state our assumption and how we aim to validate it.
