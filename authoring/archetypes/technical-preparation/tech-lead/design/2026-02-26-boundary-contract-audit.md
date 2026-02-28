# Boundary Contract Audit -- Cross-Stage Overreach Risk

Date: 2026-02-26  
Scope: research-only audit of shaper -> tech-lead -> execution-lead contract language.

## Sources Read

- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/product/shaper/doctrine/orchestration.md`
- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`
- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md`
- `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/process.md`

## 1) Upstream Return Demands: Safe vs Unsafe

### Safe demands (boundary-preserving)

1. Tech-preparation must return terminal stage outcome for its own stage (`complete` or `blocked`) to its upstream caller.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:7`

2. Upstream may demand explicit blocker ownership when tech-preparation cannot proceed.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:69` and `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:77`

3. Upstream may demand artifact pointers for the produced technical package.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:67`

### Unsafe demands (overreach-enabling)

1. Requiring `tech-lead` to return execution evidence to `shaper`.  
   - Why unsafe: upstream (`shaper`) is asking technical-preparation owner to report downstream execution outcomes, collapsing stage boundaries and creating semantic ownership creep.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/product/shaper/doctrine/orchestration.md:113`, `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:68`, `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:76`

2. Defining tech-preparation completion as package + execution evidence.  
   - Why unsafe: makes technical-preparation stage non-terminal until execution stage work exists, effectively merging two stage contracts.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:56` and `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:76`

3. Requiring validation-only prohibition language in cross-stage contracts instead of positive, typed return shape.  
   - Why unsafe: this is a symptom of weak output typing; it invites process micromanagement and status chatter.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md:43`

## 2) Should tech-lead return status labels or data payload only?

Conclusion: return data payload on success, discriminated error on failure. Avoid generic status labels as primary API.

- Keep one typed success envelope for tech-preparation handoff readiness (data-first).
- Keep one typed blocked envelope for defects/escalation.
- Avoid `complete/blocked/escalated` as free-form status labels across stage boundaries; those labels drift and encourage lifecycle ownership claims.
- If a status token is retained, it should be redundant (`kind`) and not the contract center.

Practical implication:

- `shaper <- tech-lead`: consume package-ready payload or blocked payload.
- `tech-lead <- execution-lead`: consume execution outcome payload or blocked payload (execution-owned), not recast as tech-preparation completion semantics.

## 3) File-name Coupling Crossing Stage Boundaries

Observed coupling points:

1. `shape.md` is named explicitly in tech-lead input contract.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:7`
   - Risk: fixed filename in cross-team interface couples all upstream shaping implementations to one internal filename.

2. Handoff requires both `technical package path` and specific child artifact paths (`plan path`, `test specification path(s)`).  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md:13` and `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md:15`
   - Risk: duplicates source of truth and forces path fan-out maintenance at boundary.

3. Execution process validates individual fields that should be derivable from package contract.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/process.md:8` and `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/process.md:10`
   - Risk: boundary schema sprawls and grows brittle under refactors.

Recommendation:

- Cross-stage contracts should name directories/manifests, not internal filenames.
- Required files should be validated against manifest schema inside package directory.

## 4) Minimal Boundary Contract if Package Directory Is the Contract

If `package_directory` is the interface, the minimum cross-stage contract is:

1. `item_workspace_path` -- identifies active item scope.
2. `package_directory` -- authoritative technical-preparation payload root.
3. `execution_worktree_path` -- code/test change target.
4. `issuer_role` -- expected handoff issuer for authorization checks.

Inside `package_directory`, one manifest file defines required internal artifacts and unresolved decisions/risks. Cross-boundary callers pass only the directory path, not child file paths.

Minimal manifest requirements (inside package, not cross-boundary fields):

- schema version
- shaped artifact locator
- implementation plan locator
- test specification locator(s)
- unresolved decisions
- accepted risks

## 5) Wording That Makes tech-lead Semantically Own Execution

High-risk wording:

1. Shaper declares tech-lead owns stage until returning `complete` or `blocked`, while return demands can include execution evidence.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/product/shaper/doctrine/orchestration.md:90` and `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/product/shaper/doctrine/orchestration.md:113`

2. Tech-lead stage return includes execution evidence or explicit execution blocked return.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:68`

3. Tech-lead process defines `complete` as package path plus execution evidence.  
   - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:76`

Interpretation:

- This language can make `tech-lead` appear execution-accountable rather than handoff-accountable.
- It weakens the intended ownership line stated by execution docs (`execution-lead owns all work from invocation to return`).  
  - Grounding: `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md:29`

## Proposed Boundary Shape (Concrete Minimal Fields)

### A) `shaper -> tech-lead` return/response shape

Use one success payload and one blocked payload.

```yaml
# Success: technical-preparation package ready
kind: technical_preparation_ready
item_workspace_path: <path>
package_directory: <path>
transfer:
  target_role: execution-lead
  issuer_role: tech-lead
```

```yaml
# Failure: technical-preparation blocked
kind: technical_preparation_blocked
item_workspace_path: <path>
blockers:
  - field: <name>
    owner: <role>
    detail: <text>
recommended_next_action: <text>
```

Notes:

- No execution evidence in this boundary.
- No child artifact paths in this boundary.
- Shaper remains consumer of stage outcome, not execution telemetry sink.

### B) `tech-lead -> execution-lead` handoff shape

```yaml
# Invocation payload
item_workspace_path: <path>
package_directory: <path>
execution_worktree_path: <path>
issuer_role: tech-lead
```

Execution return shape:

```yaml
# Success: execution complete
kind: execution_complete
item_workspace_path: <path>
evidence_bundle_path: <path>
```

```yaml
# Failure: execution blocked
kind: execution_blocked
item_workspace_path: <path>
blockers:
  - field: <name>
    owner: <role>
    detail: <text>
recommended_next_action: <text>
```

Notes:

- `package_directory` is the contract root; internal file map is manifest-defined.
- `tech-lead` owns package correctness and transfer completeness.
- `execution-lead` owns execution from invocation to terminal return.

## Bottom Line

The current language is partially coherent on ownership, but multiple clauses tie tech-preparation success to execution evidence. That coupling is the key overreach vector. The minimal fix is to make package-directory handoff the only success criterion for tech-preparation, and keep execution evidence exclusively in execution-stage returns.
