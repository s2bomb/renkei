# Satellite Capabilities

## Research

Unresearched artifacts compound errors downstream. Every agent that trusts ungrounded upstream work inherits and amplifies its inaccuracies. Research is the evidence layer -- when your work requires understanding beyond what you already know, research first, then build on what you find.

`research-codebase` produces documented evidence about the codebase -- implementation patterns, architectural decisions, component relationships, and historical context. It leads its own internal research team and delivers structured research artifacts.

Research artifacts become source material for downstream work. When delegating, provide the research question and where to place the artifact so that subsequent work can reference it.

### When to Delegate

- Evidence is needed that downstream artifacts will reference
- Codebase understanding goes beyond what quick exploration provides
- Historical context, patterns, or architecture needs documenting as a durable artifact

For quick, targeted lookups that don't need a research artifact, lightweight sub-agents (`explore`, `codebase-analyzer`) remain available.

### Delegation

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'research-codebase'.

[Research question or area of investigation.]

Write your research to: [output path]
"""
)
```
