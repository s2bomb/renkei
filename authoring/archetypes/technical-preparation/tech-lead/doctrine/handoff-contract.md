# Handoff Contract

## Contract

This contract defines invocation from `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member-level specialist artifacts do not cross this boundary directly. They are aggregated by `tech-lead` first.

## Required Input Fields

1. item workspace path
2. package directory path
3. execution worktree path (code-change target)
4. handoff issuer role (`tech-lead` unless explicit decision-owner override)

## Path Semantics

- Package internals are resolved from package index/manifest inside the package directory.
- Execution worktree path is for code/test implementation activity.
- Do not rebase package internal locators into execution worktree unless explicitly instructed.

## Delegation

The delegation prompt provides arguments only. The execution-lead's own skill file governs what it does, how it delegates, and what it returns. The tech-lead does not restate any of that at the call site.

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'execution-lead'.

Technical preparation is complete. The package has everything you need for execution.

Item workspace: [path]
Package: [path]
Execution worktree: [path]
Handoff issuer: tech-lead

Let me know the outcome when you're done. If you hit blockers, get back to me and I'll help resolve them.
"""
)
```

## Ownership Transfer

Execution ownership is transferred when invocation is issued with complete input fields and transfer evidence is recorded (execution-lead child session id + delegation timestamp).

If `execution-lead` returns `blocked`, `tech-lead` routes correction to the owning role, re-invokes, or escalates.

## Escalation Convention

If two re-invocations fail to clear blockers, escalate to decision owner with:
- blocked fields
- impact on appetite and delivery integrity
- recommended decision options
