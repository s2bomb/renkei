# Final Pass A -- Shaper + Problem-Analyst Production Review

## Top 7 changes (ranked)

1. **Codify activation promotion as an explicit, deterministic state transition**
   - Why: Current shaper doctrine names states but does not define the exact promotion mechanics from shaped artifact to active item workspace.
   - Exact file edits recommended:
     - `framework/archetypes/product/shaper/doctrine/process.md`
       - Replace current Step 7 section with:

```md
## Step 7: Promote Shaped Item to Active Workspace

For each shaped item, set explicit state:
- `proposed-active`: recommended for immediate activation, pending decision-owner confirmation
- `active`: confirmed for immediate technical preparation
- `parked`: qualified but not proceeding now

Promotion protocol (required for every `active` item):
1. Record activation authority (`decision-owner` or explicit executive directive) with timestamp.
2. Create or confirm an active item workspace using the active environment's convention.
3. Place the shaped artifact in that active workspace (or link it there if the environment uses references).
4. Attach unresolved assumptions, risk register, and analyst evidence paths to the workspace.
5. Mark the item as `active` only after steps 1-4 are complete.

The shaper prepares and recommends. Commitment authority remains external unless explicit executive direction says proceed now.
```

2. **Make architect-opencode delegation mandatory and immediate on activation**
   - Why: Delegation exists, but production behavior still allows interpretation drift around timing and required payload.
   - Exact file edits recommended:
     - `framework/archetypes/product/shaper/doctrine/orchestration.md`
       - In "Technical preparation delegation (post-decision)", add this sentence after line 72-equivalent:

```md
This delegation is mandatory and immediate: once an item is `active`, the shaper delegates to `architect-opencode` in the same execution pass.
```

     - `framework/archetypes/product/shaper/doctrine/pipeline.md`
       - Under "Active Handoff Target", append:

```md
Activation is not complete until `architect-opencode` acknowledges receipt of the active workspace and shaped artifact.
```

     - `framework/archetypes/product/shaper/doctrine/output-contract.md`
       - Under "Downstream Contract", append:

```md
Required activation handoff payload:
- active workspace path
- shaped artifact path
- analyst brief/evidence paths
- unresolved assumptions and open risks
```

3. **Add explicit product-team member list and delegation guidance in shaper orchestration**
   - Why: Team members and "when to delegate" rules are currently implicit; production operation needs explicit role routing.
   - Exact file edits recommended:
     - `framework/archetypes/product/shaper/doctrine/orchestration.md`
       - Add a new section after "Default Mode":

```md
## Product Team Members and Delegation Triggers

Core members:
- `decision-owner`: commitment authority
- `shaper`: framing, synthesis, state recommendation
- `problem-analyst`: validation and scope decomposition
- `tech-lead`: feasibility signal (advisory, non-design)
- `architect-opencode`: technical preparation and execution orchestration after activation

Delegate when:
- Ambiguous problem framing, weak evidence, or multi-item scope -> `problem-analyst`
- Feasibility uncertainty or boundary risk before activation -> `tech-lead`
- Item is confirmed `active` -> `architect-opencode`
```

4. **Fix state-model inconsistency across shaper outputs**
   - Why: `pipeline.md` outputs list only `proposed-active` and `parked`, while process/output contract also include `active`.
   - Exact file edits recommended:
     - `framework/archetypes/product/shaper/doctrine/pipeline.md`
       - Replace output bullet at line 22-equivalent with:

```md
- Explicit recommendation + item state (`proposed-active`, `active`, or `parked`)
```

     - `framework/archetypes/product/shaper/doctrine/output-contract.md`
       - Keep state list unchanged, and add required metadata line:

```md
- Activation record for `active` items (authority + timestamp + workspace path)
```

5. **Replace placeholder research-skill invocation in problem-analyst orchestration with concrete capability routing**
   - Why: `[research skill]` is not production-safe; it creates ambiguity and weakens reproducibility.
   - Exact file edits recommended:
     - `framework/archetypes/product/problem-analyst/doctrine/orchestration.md`
       - Replace the placeholder sentence in the example block:

```md
Your FIRST action MUST be to call the Skill tool for exactly one of:
- `research-codebase` for local/project context discovery
- `repository-researcher` for repository + official docs research
- `web-search-researcher` for external domain research

Choose the skill that matches the validation question. Do not invoke multiple research skills in one delegation pass unless explicitly requested.
```

6. **Tighten problem-analyst return contract to exactly match shaper intake needs**
   - Why: Structures are close but not exact; explicit field alignment reduces synthesis-time transformation and dropped context.
   - Exact file edits recommended:
     - `framework/archetypes/product/problem-analyst/doctrine/output-contract.md`
       - Replace "Required Structure" list with exact keys:

```md
1. Intake summary
2. Problem validation findings
3. Scoped item list (1..N)
4. Assumptions register (validity + necessity)
5. Open risks and unresolved questions
6. Recommended boundaries per scoped item (`in` / `out`)
7. Source citations and confidence per major claim
```

     - `framework/archetypes/product/problem-analyst/doctrine/process.md`
       - In Step 6, append:

```md
Use the output-contract field names exactly so shaper can consume the brief without schema translation.
```

7. **Add bounded retry + escalation rule for delegation failures (both roles)**
   - Why: Current retry rule exists but lacks termination/escalation behavior; production orchestration needs a clear stop condition.
   - Exact file edits recommended:
     - `framework/archetypes/product/shaper/doctrine/orchestration.md`
       - Extend "Retry Rule" with:

```md
Allow at most two correction retries per delegate.
If contract-complete output is still missing after two retries, escalate to decision-owner with defect summary and blocked fields.
```

     - `framework/archetypes/product/problem-analyst/doctrine/orchestration.md`
       - Add matching retry bound + escalation sentence under "Retry Rule".

## Done definition checklist

- Shaper doctrine defines a required, stepwise promotion protocol from shaped item to active workspace.
- Activation path requires immediate delegation to `architect-opencode` with explicit handoff payload.
- Shaper orchestration includes explicit product-team member list and role-based delegation triggers.
- Shaper state model is consistent across `process`, `pipeline`, and `output-contract` (`proposed-active`/`active`/`parked`).
- Problem-analyst orchestration uses concrete research skill routing (no placeholders).
- Problem-analyst output contract fields match shaper intake contract exactly.
- Both archetypes define bounded retry count and escalation behavior for contract failures.
- Assembled skill files read as deterministic for activation and delegation with no ambiguous transition steps.
