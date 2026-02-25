# Orchestration

## Default Mode

For simple, single-item inputs, work directly through the process and produce one shaped output.

## Product Team Contract

Team members and ownership:
- `decision owner` -- commitment authority (`open/active/parked/done` transitions)
- `shaper` -- framing synthesis, bounded recommendation, activation packaging
- `problem-analyst` -- evidence gathering, validation, scope decomposition
- `tech lead` -- feasibility signal before activation
- `architect-opencode` -- technical preparation and downstream execution orchestration after activation

Delegation triggers:
- Delegate to `problem-analyst` when framing is ambiguous, evidence is weak, or scope appears multi-item.
- Consult `tech lead` when appetite or boundaries imply material feasibility risk.
- Delegate to `architect-opencode` immediately after an item is confirmed `active` and scaffold/ledger are complete.

## Delegation Mode

For ambiguous, research-heavy, or multi-item inputs, delegate exploration and run synthesis centrally.

### OpenCode Delegation Protocol (current runtime)

In the current OpenCode runtime, delegation is explicit and mandatory:
- Use `Task(subagent_type="general")`.
- Delegate's first action is Skill invocation for the target role.
- No pre-skill exploration.

### Problem exploration delegation

Delegate problem exploration to `problem-analyst` with strict return contract.

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'problem-analyst' and args: '[project path and source paths]'.

DO NOT start exploring on your own first. Step 1 is invoking the skill.

Return:
1. Problem validation findings
2. Scoped item list (1..N)
3. Assumptions with validity/necessity tags
4. Open risks and unresolved questions
5. Recommended in-scope and out-of-scope boundaries per item
"""
)
```

Required delegation inputs:
- source inputs
- shaping questions
- constraints and decision context

Required return contract:
1. Problem validation findings
2. Scoped item list (1..N)
3. Assumptions with validity/necessity tags
4. Open risks and unresolved questions
5. Recommended in-scope and out-of-scope boundaries per item

If the specialist role is unavailable, run role emulation and record that collapse explicitly.

### Feasibility consultation

Consult tech lead for feasibility signal before marking any item `active`.
Consultation is advisory at this stage, not design ownership.

### Research satellite delegation

When deeper research is needed, delegate through `general` and require first-step skill invocation for the appropriate capability class:
- internal context research
- repository/codebase research
- external domain research

Always require source-cited returns with confidence labels.

### Technical preparation delegation (post-decision)

When a shaped item is confirmed `active` by the decision owner, delegate execution ownership to `architect-opencode`.

This delegation is mandatory and immediate. Activation is incomplete until delegation is issued and acknowledgment is returned.

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'architect-opencode' and args: '[active shaped artifact path(s)]'.

DO NOT start planning or coding before Skill invocation.

Context:
- Decision owner confirmed these items as active.
- Shaped artifacts are the ground truth for product intent and boundaries.

Return:
1. Confirmation of received shaped artifacts
2. Initial execution orchestration plan
3. Any critical blockers requiring decision-owner clarification
"""
)
```

## Parallelism Rule

When scoped items are independent, delegate analysis in parallel and synthesize after all returns are complete.

## Retry Rule

If any delegated return misses contract fields, re-delegate with explicit defects and block synthesis until corrected.

Allow at most two correction retries per delegate. If contract-complete output is still missing, escalate to the decision owner with blocked fields and defect summary.

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
