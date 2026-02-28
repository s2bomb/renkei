# Perspective C -- Doctrine Mechanics (Delegation Redemption)

## 1) Minimal mechanics model (flow)

Goal: make `tech-lead` a strict stage function, not a producer.

```text
Input (active item package from shaper)
  -> validate required boundary fields
  -> delegate to required specialists by dependency order
  -> for each delegate return: contract gate + ownership gate
  -> if any gate fails: redelegate with explicit defects (bounded retries)
  -> checkpoint: prove delegate provenance for every required artifact class
  -> if provenance complete: synthesize index/manifest (references only)
  -> transfer to execution-lead (boundary payload only)
  -> terminal return to shaper:
       technical_preparation_ready | technical_preparation_blocked
```

Function-contract shape (data-first, terminal):

```yaml
# success
kind: technical_preparation_ready
item_workspace_path: <path>
package_directory: <path>
artifact_index_path: <path>
transfer:
  issuer_role: tech-lead
  target_role: execution-lead
  outcome: transfer_issued | transfer_blocked
delegation_evidence:
  - artifact_class: <enriched_spec|research|api_design|test_spec|implementation_plan>
    owner_role: <specialist role>
    delegation_id: <id>
    delegate_outcome: complete
events: [ ... ]
```

```yaml
# blocked
kind: technical_preparation_blocked
item_workspace_path: <path>
blockers:
  - field: <contract field or artifact class>
    owner_role: <role>
    reason: <why blocked>
    retry_count: <0..2>
    route: redelegate | escalate_upstream | escalate_decision_owner
events: [ ... ]
```

Design note: this removes completion dependence on execution evidence and keeps stage terminality honest.

## 2) Interruption/checkpoint mechanism text to add

Add the following doctrine text (verbatim) into `doctrine/process.md` and mirror the contract summary in `doctrine/orchestration.md`.

```markdown
### Delegation Integrity Checkpoint (mandatory before synthesis)

Before package synthesis, run one checkpoint over required artifact classes:

1. `enriched_spec`
2. `research_record`
3. `api_design`
4. `test_specification`
5. `implementation_plan`

For each class, require all fields:
- `owner_role` (must be the assigned specialist role)
- `delegation_id`
- `delegate_outcome` (`complete`)
- `artifact_path`

If any class is missing provenance or shows `owner_role = tech-lead`, interrupt immediately.

Interruption action:
- stop synthesis
- emit `delegation_drift_detected` event with offending artifact classes
- route by retry contract (`redelegate` or `escalate`)

`tech-lead` does not continue by self-authoring missing specialist artifacts.
```

Why this is the minimum: it catches ownership drift at the only point where drift can be hidden (right before synthesis/transfer).

## 3) Retry/redelegate/escalate routing contract

Add one shared routing contract across `process.md`, `orchestration.md`, and `handoff-contract.md`.

```yaml
retry_policy:
  max_correction_retries_per_artifact: 2
  retry_trigger:
    - missing_required_fields
    - boundary_violation
    - unresolved_contradiction
    - missing_provenance
  redelegate_payload:
    delegation_id: <new id>
    prior_delegation_id: <id>
    failed_fields: [ ... ]
    defect_notes: [ ... ]
    required_corrections: [ ... ]
routing:
  if_retry_budget_remaining: redelegate_to_owner_role
  if_retry_budget_exhausted: escalate_decision_owner
  if_blocker_owner_is_shaper: escalate_upstream_to_shaper
  if_execution_handoff_rejected_for_input_defect: route_to_owning_specialist_then_retransfer
forbidden_route:
  - tech-lead_self_authors_member_artifact
```

Replacement text for `handoff-contract.md` critical line:

- Replace: "If blocked, tech-lead processes the blockers: correct and re-invoke, or escalate."
- With: "If blocked, `tech-lead` routes each blocker to the owning role for correction and re-invokes. If two correction cycles fail, `tech-lead` escalates with blocker ownership and decision options."

This preserves adaptability but removes the loophole that allows leader-as-implementer behavior.

## 4) Exact file-level patch list with removals

Subtractive plan only; remove coupling and status chatter first.

1. `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
- Remove qualifier language: "in normal operation".
- Remove package-as-content wording: "Assemble one execution-ready package containing ...".
- Remove completion definition that depends on execution evidence.
- Replace with: delegation loop -> integrity checkpoint -> package index synthesis -> transfer -> terminal ready/blocked return.

2. `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
- Remove "single technical package" producer framing.
- Remove "in normal operation" ownership loophole.
- Remove stage return requirement for execution evidence.
- Replace stage return section with discriminated payloads:
  - `technical_preparation_ready`
  - `technical_preparation_blocked`
  each including required delegation evidence.

3. `framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`
- Remove child-path fan-out from required handoff payload (`plan path`, `test specification path(s)`) once package manifest is authoritative.
- Remove validation-only prohibition sentence and replace with positive typed return requirements.
- Replace "correct and re-invoke" with "route correction to owning role and re-invoke".

4. `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
- Remove producer root verb: "Produce one technical-preparation package ...".
- Remove fixed filename requirements (`technical-package.md`, `traceability-matrix.md`).
- Remove transfer outcome type that mixes execution evidence into tech-preparation success.
- Replace with output as stage return envelope + artifact index manifest + delegation provenance table.

5. `framework/archetypes/technical-preparation/tech-lead/doctrine/pipeline.md`
- Remove output bullet that encodes `complete-with-evidence` at tech-preparation boundary.
- Replace with: transfer-issued evidence only; execution evidence belongs to execution stage.

6. `framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md`
- Remove "by default" and "in normal operation" qualifiers from boundary rules.
- Replace with unconditional ownership boundaries plus explicit blocked/escalation route when owner unavailable.

7. `framework/archetypes/technical-preparation/tech-lead/references/template.md`
- Remove monolithic authored package scaffold sections that invite leader authoring (`Shaped Context`, fill-in domain sections).
- Remove execution telemetry subsection (`files changed`, `verification commands`, `outcomes`).
- Replace with minimal template:
  - metadata
  - artifact index (delegate-owned pointers)
  - provenance table
  - unresolved decisions / accepted risks
  - transfer record
  - event bundle pointers

8. Cross-boundary alignment edits (required to prevent relapse)
- `framework/archetypes/product/shaper/doctrine/orchestration.md`
  - remove demand for execution evidence in `tech-lead` return contract.
  - replace with ready/blocked technical-preparation payload only.
- `framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md`
  - align input to package-directory-as-contract-root (optional derived child paths, not required boundary fields).

## 5) Failure-mode coverage matrix (brief)

| Failure mode | Detection point | Route | Terminal return |
| --- | --- | --- | --- |
| Missing specialist artifact | delegate gate | redelegate (<=2) then escalate | `technical_preparation_blocked` |
| Tech-lead self-authors member artifact | integrity checkpoint | interrupt + redelegate or escalate | `technical_preparation_blocked` |
| Product intent drift in specialist output | boundary gate | redelegate; if framing defect, escalate to `shaper` | `technical_preparation_blocked` |
| Cross-artifact contradiction unresolved | synthesis gate | redelegate owning specialist(s) | `technical_preparation_blocked` if unresolved |
| Execution handoff rejected for input defects | transfer response | route defects to owning specialist, retransfer | ready if cleared, blocked if retries exhausted |
| Retry budget exhausted | routing contract | escalate decision owner with options | `technical_preparation_blocked` |

Net effect: delegation mechanics become auditable and terminal without adding phase chatter or OOP-style state semantics.
