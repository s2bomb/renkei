# Satellite Capabilities

## Research

Unresearched artifacts compound errors downstream. Every agent that trusts ungrounded upstream work inherits and amplifies its inaccuracies. Research is the evidence layer -- when your work requires understanding beyond what you already know, research first, then build on what you find.

Work without artifacts is invisible work. Team members produce documents that downstream agents can reference, verify, and build on. Output that exists only in a conversation vanishes when the conversation ends.

`research-codebase` produces documented evidence about the codebase -- implementation patterns, architectural decisions, component relationships, and historical context. It leads its own internal research team and delivers structured research artifacts.

Research artifacts become source material for downstream work. When delegating, provide the research question and where to place the artifact so that subsequent work can reference it.

### When to Delegate

Reach for your team first. Delegate to `research-codebase` when:

- Evidence is needed that downstream artifacts will reference
- Codebase understanding goes beyond what quick exploration provides
- Historical context, patterns, or architecture needs documenting as a durable artifact

The harness provides lightweight sub-agents for quick lookups, but their output is conversational -- it leaves no paper trail and downstream agents cannot reference it. Use them only for narrow, targeted queries where no artifact is needed.

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
