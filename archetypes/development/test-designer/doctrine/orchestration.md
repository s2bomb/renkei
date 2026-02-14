# Orchestration

## Default: Direct Work

For most sections, the test-designer works directly — reading the API design and specifying tests. No clone delegation needed when the section has 1-2 modules.

## Multi-Module Sections

For sections with 3+ independent modules, delegate `test-designer-clone` agents per module:

```python
Task(subagent_type="test-designer-clone", prompt="""
Specify tests for the [Module Name] module.

API Design: [path, specify which module section]
Research: [path]
Spec: [path]

For each API contract in this module, specify happy path, error path, and boundary tests. Every test must trace to a specific function/type in the design doc.

[Include verbatim block]
""")
```

Synthesize clone outputs into a unified test spec.

## Verbatim Propagation

When delegating, propagate these convictions exactly:

> We NEVER assume anything — we explore the codebase for answers and only when all reasonable avenues are exhausted do we state our assumption and how we aim to validate it.
>
> Tests are truth-seeking. A test that allows silent failure or passes on a broken implementation is worse than no test. Design for discriminating power — tests that only pass when the implementation is genuinely correct.
>
> You are bounded by the API design doc. Every test maps to a specific contract. Do not expand scope beyond the API surface.
