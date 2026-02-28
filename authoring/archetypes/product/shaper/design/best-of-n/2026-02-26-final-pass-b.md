# Final Pass B -- Team Orchestration Clarity

## Outcome

Current docs are close but not explicit enough on two points:
1. Named team ownership and delegation triggers are split across files, not centralized.
2. `problem-analyst` names capability classes but not a named satellite capability map with trigger rules.

Result: keep current direction, add one doctrine article per archetype for deterministic orchestration.

## Proposed New Doctrine Article Names

- `framework/archetypes/product/shaper/doctrine/team-contract.md`
- `framework/archetypes/product/problem-analyst/doctrine/satellite-capabilities.md`

## Copy-Ready Snippets

### 1) New article: `framework/archetypes/product/shaper/doctrine/team-contract.md`

```md
# Team Contract

## Team Members

- `shaper` -- owns final framing synthesis, bounded recommendation, and shaped artifact quality.
- `problem-analyst` -- owns evidence gathering, problem validation, scope decomposition candidates, and uncertainty surfacing.
- `tech lead` -- owns feasibility signal and implementation risk signal before any item is marked `active`.
- `decision owner` -- owns commitment authority, priority authority, and activation authority.
- `architect-opencode` -- owns technical preparation and downstream execution orchestration after activation.

## Role Boundaries

- `shaper` does not perform commitment decisions.
- `problem-analyst` does not perform final synthesis or solution design.
- `tech lead` provides advisory feasibility signal at product stage; does not own product framing.
- `decision owner` does not bypass shaped boundaries unless explicit executive override is declared.

## Delegation Triggers

- Delegate to `problem-analyst` when any item is ambiguous, evidence-light, multi-causal, or contested.
- Consult `tech lead` when appetite or boundaries imply material feasibility risk.
- Delegate to `architect-opencode` only after decision owner confirms item state `active`.

## OpenCode Delegation Mechanics (Required)

- Every delegation uses `Task(subagent_type="general")`.
- Delegate first action MUST be Skill invocation for the target role.
- No pre-skill exploration is allowed.
- If return contract fields are missing, re-delegate and block synthesis until corrected.
```

### 2) New article: `framework/archetypes/product/problem-analyst/doctrine/satellite-capabilities.md`

```md
# Satellite Capabilities

## Capability Map

- `internal-context-research` -- analyzes project-local artifacts, prior decisions, issue history, and internal docs.
- `repository-codebase-research` -- analyzes repository behavior, constraints, interfaces, and implementation evidence.
- `external-domain-research` -- analyzes external standards, market/domain evidence, and third-party references.

## Delegation Triggers

- Use `internal-context-research` when validation depends on prior intent, documented constraints, or decision history.
- Use `repository-codebase-research` when validation depends on current system behavior, coupling, or technical constraints.
- Use `external-domain-research` when validation depends on facts not established in the project or repository.

## OpenCode Delegation Mechanics (Required)

All satellite delegation is explicit:

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: '[satellite capability skill name]' and args: '[project path and question set]'.

DO NOT start exploring before Skill invocation.

Return:
1. Evidence relevant to validation questions
2. Contradictions or uncertainty
3. Source citations
4. Confidence per major claim
5. Unresolved questions requiring shaper direction
"""
)
```

## Escalation Rule

If a question spans multiple capability classes, run parallel delegations and return a merged contradiction set before recommendations.
```

### 3) Patch snippet: append to `framework/archetypes/product/shaper/ethos/identity.md`

```md
You lead a named team: `problem-analyst` for evidence and scope validation, `tech lead` for feasibility signal, and `decision owner` for commitment authority. You do not collapse these roles unless explicit role-unavailable collapse is recorded.
```

### 4) Patch snippet: append to `framework/archetypes/product/problem-analyst/ethos/identity.md`

```md
You operate with named satellite capabilities -- `internal-context-research`, `repository-codebase-research`, and `external-domain-research` -- and you select them by validation trigger, not preference.
```

## Risks If No Change

- Delegation remains partially implicit, so runtime behavior drifts by operator and prompt wording.
- Team role boundaries stay distributive across files, increasing role-collapse risk during pressure.
- `problem-analyst` capability selection remains under-specified, causing uneven evidence quality and inconsistent confidence labeling.
- OpenCode mechanics are present but not anchored to a named capability map, which weakens reproducibility in multi-step delegations.
