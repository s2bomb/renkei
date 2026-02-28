# Perspective D -- Architect-Transfer (Subtractive)

## 1) Transfer candidates (copy/adapt/avoid)

Use `architect-opencode` as an existence proof for delegation reliability, not as a direct policy import.

| Mechanism observed in architect-opencode | Decision | Safe transfer shape for `tech-lead` | Primary target files |
| --- | --- | --- | --- |
| Identity-level boundary negation | Copy (compressed) | Keep explicit "not shaper / not execution owner / not implementer" framing, and tie it to artifact non-ownership | `ethos/identity.md`, `doctrine/process.md` |
| Skill-first delegation call sites | Adapt | Keep first-action skill invocation rule, but restrict prompt contract to inputs + return shape only | `doctrine/orchestration.md` |
| Drift interruption when leader starts producing member work | Copy | Add one interruption primitive: stop, record drift, re-delegate or escalate; never silently continue | `doctrine/process.md`, `doctrine/orchestration.md` |
| Universal post-delegation evaluate/iterate loop | Copy | Preserve two-retry loop and explicit defect payloads; require provenance checks before synthesis | `doctrine/process.md` |
| Artifact-shaped quality checks | Adapt | Add minimal per-artifact semantic checks without importing delegate internals | `doctrine/process.md`, `doctrine/output-contract.md` |
| Stage orientation model ("you are here") | Adapt | Keep terminal return semantics; add internal state fields as return data, not milestone statuses | `doctrine/orchestration.md` |
| Prohibition-heavy NEVER stacks | Avoid | Do not copy rhetoric-heavy ban lists; derive hard boundaries from existing tenets and return typing | all doctrine files |
| End-to-end workflow ownership beyond stage boundary | Avoid | Do not import architect-style full-lifecycle ownership; keep `tech-lead` bounded to technical-preparation + transfer correctness | `doctrine/process.md`, `doctrine/handoff-contract.md` |

## 2) Concrete adapted language snippets for tech-lead files

These are file-level replacement snippets (remove/replace) designed to be applied directly.

### `framework/archetypes/technical-preparation/tech-lead/ethos/identity.md`

Replace lines 5-9 with:

```md
You convert `active` shaped intent into a transfer-ready technical package by orchestrating specialist artifacts, enforcing coherence, and exposing unresolved uncertainty before handoff.

You do not author specialist-owned artifacts. You do not reframe product intent. You do not own execution after valid transfer.

Your ownership is integration judgment and boundary integrity: delegate, gate, synthesize, transfer.
```

### `framework/archetypes/technical-preparation/tech-lead/ethos/principles.md`

Replace principle 4 with:

```md
4. Delegate by contract: pass required inputs and required return shape, not delegate internal process scripts.
```

Add principle 6:

```md
6. If you drift into specialist production, stop immediately, record drift, and re-delegate or escalate.
```

### `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`

Replace line 34 with:

```md
`tech-lead` does not author member-owned artifacts. If delegation cannot be executed, return `technical_preparation_blocked` with blocker ownership or request explicit role-collapse authorization and record that event.
```

Insert after line 43:

```md
Interruption rule: if `tech-lead` begins drafting member-owned artifact content, stop that work immediately, emit a drift event (`boundary_drift_detected`), and choose only one path: re-delegate with explicit defects or escalate.
```

Replace lines 45-53 with:

```md
Synthesize one package index that references delegate-owned artifacts and records:
- artifact class
- artifact path
- owner role
- delegation id
- delegate outcome (`complete` | `blocked`)
- unresolved decisions
- accepted risks
```

Replace lines 56-77 with:

```md
## 2. Stage Outcome

Issue handoff to `execution-lead` when handoff payload fields are complete.

Execution ownership transfer is valid when transfer is issued with complete contract fields.

Return one of:
- `technical_preparation_ready` with `package_directory`, transfer record, and stage events
- `technical_preparation_blocked` with blockers, owner per blocker, and escalation target

Do not include execution evidence in technical-preparation success payload.
```

### `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`

Replace line 5 with:

```md
You orchestrate specialist artifact production, gate returned contracts, and return a technical-preparation stage outcome.
```

Replace lines 30-37 with:

```md
Every delegated prompt must specify only:
1. required input context (paths, constraints, boundaries)
2. required return shape (terminal success payload or blocked payload)
```

Replace line 46 with:

```md
`tech-lead` synthesizes and gates; specialist artifact authorship remains with delegates.
```

Replace lines 62-69 with:

```md
When reporting upstream, return only:

1. `kind`: `technical_preparation_ready` | `technical_preparation_blocked`
2. `item_workspace_path`
3. if ready: `package_directory` + transfer record (`issuer_role`, `target_role`, `issued_at`)
4. if blocked: `blockers[]` with owner + `recommended_next_action`
5. stage events including delegation-issued/delegation-returned/escalation (when present)
```

Add internal orientation note (non-contract):

```md
For active orchestration state tracking, maintain internal fields per item: `current_stage`, `next_stage`, `blocking_field`, `owner`. These fields are internal execution aids, not externally reported phase outcomes.
```

### `framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`

Replace required payload section (lines 9-19) with:

```md
## Required Handoff Payload

1. `item_workspace_path`
2. `package_directory`
3. `execution_worktree_path`
4. `issuer_role` (`tech-lead` unless explicit override)
```

Replace line 45 with:

```md
If blocked, `tech-lead` routes correction to the owning role and re-invokes, or escalates. `tech-lead` does not directly correct specialist-owned artifacts.
```

### `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`

Replace lines 3-27 with:

```md
## Stage Return

Return one technical-preparation stage outcome per active item.

Success payload (`technical_preparation_ready`) requires:

1. `item_workspace_path`
2. `package_directory`
3. `artifact_index[]` entries with: `artifact_class`, `path`, `owner_role`, `delegation_id`, `delegate_outcome`
4. `unresolved_decisions` (explicit `none` if empty)
5. `accepted_risks` (explicit `none` if empty)
6. `transfer` record (`issuer_role`, `target_role`, `issued_at`)
7. `stage_events[]`

Blocked payload (`technical_preparation_blocked`) requires:

1. `item_workspace_path`
2. `blockers[]` with owner per blocker
3. `recommended_next_action`
4. `stage_events[]`
```

## 3) File-level deletion list of non-transferable patterns

Delete these patterns; they are not safe transfers from architect behavior into archetype doctrine.

1. `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
   - Remove: `in normal operation` qualifier on non-authorship.
   - Remove: stage completion dependency on execution evidence.
   - Remove: "assemble package containing ..." phrasing that implies direct authored content.

2. `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
   - Remove: stage return requirement that includes execution evidence.
   - Remove: path-only delegate return contract that omits provenance.
   - Remove: `in normal operation` qualifier on ownership boundary.

3. `framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`
   - Remove: child-file fan-out as cross-boundary required fields (`plan path`, `test spec path(s)`) when `package_directory` can be contract root.
   - Remove: `correct and re-invoke` phrasing that permits direct artifact correction by `tech-lead`.

4. `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
   - Remove: fixed filename requirements (`technical-package.md`, `traceability-matrix.md`) as contract-critical fields.
   - Remove: producer verb at root (`Produce one ...`) and replace with stage return typing.
   - Remove: transfer outcome vocabulary tied to execution evidence in technical-preparation success criteria.

5. `framework/archetypes/product/shaper/doctrine/orchestration.md` (cross-boundary cleanup)
   - Remove from `tech-lead` delegation return contract: `If complete: execution evidence ...`.
   - Replace with: technical-preparation-ready payload only.

## 4) Why each transfer preserves truth->ethos->doctrine integrity

1. Boundary negation + non-authorship transfer
   - Truth anchor: specialist outputs do not self-align; hidden unknowns become expensive downstream.
   - Ethos continuity: `integration ownership is explicit` + `boundaries protect throughput`.
   - Doctrine effect: `tech-lead` remains accountable for synthesis quality without collapsing into specialist production.

2. Call-site contract narrowing (inputs + return only)
   - Truth anchor: agents are functions; call sites define interface, not function body.
   - Ethos continuity: preserve builder autonomy and reject ambiguity.
   - Doctrine effect: delegation becomes concrete without micromanaging delegate internals.

3. Drift interruption primitive
   - Truth anchor: boundary drift begins as convenience and ends as role collapse.
   - Ethos continuity: gate by evidence, not confidence language.
   - Doctrine effect: immediate stop/re-delegate/escalate path protects role integrity while keeping execution practical.

4. Provenance-first package index
   - Truth anchor: path presence alone cannot prove delegated production.
   - Ethos continuity: integration ownership requires auditable synthesis.
   - Doctrine effect: success criteria shift from file emission to ownership-verifiable stage output.

5. Technical-preparation terminal return typing
   - Truth anchor: stage contracts must be terminal and honest.
   - Ethos continuity: scope stewardship and boundary discipline.
   - Doctrine effect: `tech-lead` success ends at valid transfer; execution evidence remains execution-stage property.

## 5) Residual mismatch risks

1. Cross-archetype contract lag
   - Risk: if `shaper` and `execution-lead` contracts are not updated in lockstep, `tech-lead` can still be pulled into execution evidence reporting.

2. Runtime ergonomics pressure
   - Risk: if delegation tooling remains noisy, operators may still role-collapse despite doctrine clarity.

3. Role-collapse exception abuse
   - Risk: explicit authorization path can become routine unless event review treats role-collapse as anomaly.

4. Provenance schema under-specification
   - Risk: without a stable `artifact_index[]` schema shared across stages, teams may regress to path-only checks.

5. Legacy template gravity
   - Risk: if monolithic package templates remain in references, behavior will drift back to authored-package production even after doctrine edits.
