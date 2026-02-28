# Perspective A -- Subtractive Contract Redesign

## 1) Contract surface minimization decisions

1. Make `package_directory` the only cross-stage artifact boundary for technical preparation output.
2. Remove all cross-stage child artifact path fields (`plan path`, `test spec path(s)`, `enriched spec path`, etc.).
3. Remove all fixed filename requirements at boundary level (`shape.md`, `technical-package.md`, `traceability-matrix.md`).
4. Collapse stage outcomes to discriminated payloads (`technical_preparation_ready` or `technical_preparation_blocked`), with data-first fields instead of prose status choreography.
5. Remove execution evidence from `tech-lead` success criteria; execution evidence belongs only to execution-stage returns.
6. Keep delegation evidence minimal but mandatory: per required specialist artifact class, include owner role + source path + delegate outcome in package manifest.
7. Replace exception-softening language (`in normal operation`, `by default`) with unconditional boundary statements and explicit blocked/escalation path.
8. Keep doctrine function-shaped: no named internal milestone returns; only terminal success or blocked payloads.

## 2) Exact deletions/replacements by file

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/ethos/identity.md`

- Delete: `Execution ownership transfers to execution-lead when package transfer is issued with complete contract fields.`
- Replace with: `Execution ownership starts at accepted handoff from tech-lead to execution-lead.`
- Add sentence after boundary statement: `Tech-lead governs package integrity and transfer integrity, not execution outcomes.`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/ethos/tenets.md`

- Keep all tenets.
- Replace section heading `Integration ownership is explicit` with `Integration ownership is boundary ownership`.
- Replace line `Specialist outputs do not self-align. Coherence requires one accountable synthesizer.` with `Specialist outputs do not self-align. Coherence requires one accountable gatekeeper of package integrity and handoff integrity.`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/ethos/principles.md`

- Delete principle 2: `Reject ambiguous handoffs; missing fields block progression.`
- Replace with: `Reject ambiguous boundaries; if package directory contract is incomplete, return blocked with explicit ownership.`
- Add principle: `Do not claim downstream-stage evidence as proof of this stage.`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`

- Delete input field requirement: `shape.md`.
- Replace input list with directory- and contract-level inputs:
  - `item_workspace_path`
  - shaped intent locator (no filename constraint)
  - source/analysis inputs
  - appetite/no-gos/open assumptions
- Delete sentence: `tech-lead does not author member-owned artifacts in normal operation.`
- Replace with: `Tech-lead does not author member-owned artifacts. If delegation cannot satisfy required artifact classes, return blocked or escalate explicit role-collapse authorization.`
- Delete section block `Assemble one execution-ready package containing:` and its seven child bullets.
- Replace with: `Assemble one package directory index that references delegate-owned artifacts by class, provenance, and unresolved decisions/risks.`
- Delete lines requiring execution evidence in tech-lead stage return:
  - `Execution-lead returns either complete with evidence...`
  - `Return one of: complete with package path and execution evidence...`
- Replace stage return with:
  - `technical_preparation_ready` + `item_workspace_path` + `package_directory` + transfer envelope
  - `technical_preparation_blocked` + blockers[] + owner + recommended_next_action

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`

- Delete sentence: `You orchestrate specialist artifact production and synthesize a single technical package.`
- Replace with: `You orchestrate specialist artifact production and return a package-directory handoff payload.`
- Delete `Required Return Contract (All Delegates)` field `output artifact path` as sole required item.
- Replace delegate return minimum with:
  1. `artifact_class`
  2. `artifact_locator` (relative or absolute path, no fixed filename)
  3. `owner_role`
  4. `delegate_outcome` (`complete` | `blocked`)
  5. `blockers_or_questions`
  6. `major_claim_citations`
- Delete sentence: `It does not bypass member ownership in normal operation.`
- Replace with: `It does not bypass member ownership.`
- Delete stage return requirement item 3 (execution evidence).
- Replace stage return block with exactly:
  1. `kind`: `technical_preparation_ready` | `technical_preparation_blocked`
  2. if ready: `item_workspace_path`, `package_directory`, `transfer.target_role`, `transfer.issuer_role`
  3. if blocked: `item_workspace_path`, `blockers[]`, `recommended_next_action`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`

- Delete entire `Required Handoff Payload` list (items 1-8).
- Replace with four fields only:
  1. `item_workspace_path`
  2. `package_directory`
  3. `execution_worktree_path`
  4. `issuer_role`
- Delete path fan-out requirements (`shaped artifact path`, `plan path`, `test specification path(s)`, explicit unresolved/risks lists).
- Delete `Validation-only results are not complete...` sentence.
- Replace required return with discriminated execution-owned payloads:
  - `execution_complete` with `item_workspace_path` and `evidence_bundle_path`
  - `execution_blocked` with `item_workspace_path`, `blockers[]`, `recommended_next_action`
- Replace `correct and re-invoke` with `route correction to owning role and re-invoke, or escalate`.

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`

- Delete section `Path Convention` entirely.
- Delete fixed paths:
  - `shaped-items/active/item-###/working/technical-package.md`
  - `shaped-items/active/item-###/working/traceability-matrix.md`
- Replace root artifact statement `Produce one technical-preparation package per active item.` with `Return one package-directory boundary payload per active item.`
- Replace `Required Package Fields` list with minimal boundary + manifest contract:
  1. `item_workspace_path`
  2. `package_directory`
  3. `transfer` (`target_role`, `issuer_role`)
  4. `package_manifest` with:
     - `schema_version`
     - `artifacts[]` entries (`artifact_class`, `artifact_locator`, `owner_role`, `delegate_outcome`)
     - `unresolved_decisions[]`
     - `accepted_risks[]`
     - `must_haves[]`
     - `nice_to_haves[]`
- Delete required field: `transfer record outcome (tech-lead -> execution-lead: complete-with-evidence | blocked)`.
- Replace with `transfer status` values: `issued` | `not_issued`.
- Delete completion report block text that centers `complete | blocked` free-form labels.
- Replace with two explicit payload examples keyed by `kind`.

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/pipeline.md`

- Delete input filename coupling: `active shaped artifact (shape.md)`.
- Replace with: `active shaped intent locator (filename-agnostic)`.
- Delete output line `transfer record to execution owner (complete-with-evidence or blocked)`.
- Replace with: `transfer envelope to execution owner (issued or not_issued).`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md`

- Delete `by default` qualifier in role boundaries.
- Delete `in normal operation` qualifier in role boundaries.
- Replace handoff direction sentence `tech-lead aggregates member artifacts into one stage package.` with `tech-lead publishes one package directory manifest that indexes member-owned artifacts.`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/references/template.md`

- Delete entire current template.
- Replace with a minimal `Package Directory Manifest Template` only (no authored content sections):
  - `schema_version`
  - `item_workspace_path`
  - `artifacts[]` (`artifact_class`, `artifact_locator`, `owner_role`, `delegate_outcome`)
  - `unresolved_decisions[]` (`id`, `owner`, `impact`)
  - `accepted_risks[]` (`risk`, `owner`, `mitigation`)
  - `scope_partition` (`must_haves[]`, `nice_to_haves[]`)
  - `transfer` (`target_role`, `issuer_role`, `status`)
- Explicitly omit any execution evidence sections from this template.

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/product/shaper/doctrine/orchestration.md`

- In technical preparation delegation prompt, delete return item 3 (`If complete: execution evidence...`).
- Replace return block with:
  1. `kind`: `technical_preparation_ready` | `technical_preparation_blocked`
  2. if ready: `item_workspace_path`, `package_directory`
  3. if blocked: blockers requiring shaper or decision-owner clarification
- Replace sentence `tech-lead owns the stage until it returns complete or blocked` with `tech-lead owns technical-preparation until it returns a terminal package-ready or blocked payload.`

### `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md`

- Delete required input fields 2, 4, 5, 6, 7 (all child artifact fan-out).
- Keep only:
  1. `item_workspace_path`
  2. `package_directory`
  3. `execution_worktree_path`
  4. `handoff issuer role`
- Replace `Planning/package artifacts are read from the paths supplied in input fields.` with `Execution resolves internal artifact locators from package manifest inside package_directory.`

## 3) Proposed minimal cross-stage payload shapes

### `shaper -> tech-lead` invocation context (minimum)

```yaml
item_workspace_path: <path>
shaped_intent_locator: <path>
source_inputs: <list-or-path>
constraints:
  appetite: <text>
  no_gos: <list>
  open_assumptions: <list>
```

### `tech-lead -> shaper` terminal return

```yaml
# success
kind: technical_preparation_ready
item_workspace_path: <path>
package_directory: <path>
transfer:
  target_role: execution-lead
  issuer_role: tech-lead
  status: issued
```

```yaml
# blocked
kind: technical_preparation_blocked
item_workspace_path: <path>
blockers:
  - field: <field-or-contract-area>
    owner: <role>
    detail: <text>
recommended_next_action: <text>
```

### `tech-lead -> execution-lead` handoff (minimum)

```yaml
item_workspace_path: <path>
package_directory: <path>
execution_worktree_path: <path>
issuer_role: tech-lead
```

### Package-internal manifest (inside `package_directory`)

```yaml
schema_version: 1
artifacts:
  - artifact_class: enriched_spec
    artifact_locator: <path>
    owner_role: spec-writer
    delegate_outcome: complete
  - artifact_class: codebase_research
    artifact_locator: <path>
    owner_role: research-codebase
    delegate_outcome: complete
  - artifact_class: api_design
    artifact_locator: <path>
    owner_role: api-designer
    delegate_outcome: complete
  - artifact_class: test_spec
    artifact_locator: <path>
    owner_role: test-designer
    delegate_outcome: complete
  - artifact_class: implementation_plan
    artifact_locator: <path>
    owner_role: create-plan
    delegate_outcome: complete
unresolved_decisions: []
accepted_risks: []
scope_partition:
  must_haves: []
  nice_to_haves: []
```

### `execution-lead -> tech-lead` terminal return (execution-owned)

```yaml
# success
kind: execution_complete
item_workspace_path: <path>
evidence_bundle_path: <path>
```

```yaml
# blocked
kind: execution_blocked
item_workspace_path: <path>
blockers:
  - field: <field-or-contract-area>
    owner: <role>
    detail: <text>
recommended_next_action: <text>
```

## 4) What to delete entirely (concepts/sections) and why

1. Delete `Path Convention` sections that prescribe exact filenames.
   - Why: boundary contracts should survive internal file renames and packaging refactors.

2. Delete execution-evidence requirements from all tech-lead doctrine sections.
   - Why: this couples technical-preparation completion to downstream execution ownership.

3. Delete qualifier language (`in normal operation`, `by default`) around ownership boundaries.
   - Why: these clauses create silent exception channels and encourage role collapse.

4. Delete path fan-out handoff payloads that duplicate package internals.
   - Why: duplicated boundary fields drift and create brittle cross-stage synchronization work.

5. Delete monolithic authored package template sections (`Shaped Context`, long fillable authored narrative blocks, execution telemetry blocks).
   - Why: this incentivizes tech-lead content production instead of delegated artifact gating.

6. Delete free-form completion report as the contract center.
   - Why: contracts should be typed payloads first, narrative summary second.

## 5) Tradeoffs and residual risks

- Tradeoff: package-directory boundary reduces coupling, but shifts rigor to manifest quality and validator discipline.
- Tradeoff: fewer cross-stage fields improve stability, but can reduce immediate human readability unless tooling renders manifest summaries.
- Residual risk: without a required manifest validation step, `package_directory` can become a loose folder and recreate ambiguity.
- Residual risk: removing filename coupling may introduce lookup inconsistency if artifact locators are not normalized.
- Residual risk: strict anti-bypass language can stall progress under role unavailability; explicit role-collapse authorization path must stay available and auditable.
- Residual risk: upstream callers may still ask for execution telemetry unless shaper and execution contracts are updated in the same pass.
