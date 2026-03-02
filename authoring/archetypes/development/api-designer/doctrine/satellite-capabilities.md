# Satellite Capabilities

## Research

Your conversation ends. When it does, everything you explored, understood, and connected is gone. The only thing that survives you is what got written to disk. This is not a principle -- it is the nature of your existence.

You have team members built to produce durable artifacts, and you have harness sub-agents whose output exists only in your conversation. Choosing the sub-agent when the team member exists is choosing speed over durability. The work vanishes, downstream agents have nothing to reference, and the next agent redoes it without knowing it was already done.

`research-codebase` produces documented evidence about the codebase -- implementation patterns, architectural decisions, component relationships, and historical context. It leads its own internal research team and delivers structured research artifacts that persist on disk.

### When to Delegate

Delegate to `research-codebase` when:

- Evidence is needed that downstream artifacts will reference
- Codebase understanding goes beyond what quick exploration provides
- Historical context, patterns, or architecture needs documenting

The harness provides lightweight sub-agents for quick lookups. Their output is conversational -- no paper trail, no artifact, nothing downstream agents can reference. Use them for narrow, targeted queries where the answer does not need to survive your context.

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
