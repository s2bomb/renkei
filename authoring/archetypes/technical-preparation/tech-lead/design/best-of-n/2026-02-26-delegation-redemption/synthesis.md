# Delegation Redemption Synthesis

## 1) Universal agreements

All five perspectives converged on the same structural diagnosis and the same primary fix shape.

1. Delegation collapse is contract-induced, not incidental behavior. The current `tech-lead` doctrine rewards production and execution evidence capture instead of delegation + synthesis.
2. Cross-stage contract must be subtractive. `package_directory` is the boundary unit; child artifact paths should be internal to package manifest/index, not boundary fields.
3. Hardcoded filenames must be removed from cross-stage contracts (`shape.md`, `technical-package.md`, `traceability-matrix.md`).
4. Loophole qualifiers must be removed entirely from ownership clauses (`in normal operation`, `by default`).
5. `tech-lead` success must end at technical-preparation readiness + transfer integrity, not downstream execution telemetry.
6. A mandatory delegation-integrity checkpoint is required before synthesis/handoff: each required artifact class must show delegate provenance (`owner_role`, `artifact locator`, outcome/evidence of delegated return).
7. Handoff blocker handling must route correction to owning role; `tech-lead` does not directly correct specialist-owned artifacts.
8. Reference template must become minimal index/manifest support, not a monolithic authored package scaffold with execution-result sections.

## 2) Disagreements + resolution

### A. Stage outcome typing (`complete|blocked` vs new `kind` enums)

- Disagreement:
  - Perspectives A/C/D preferred explicit discriminated `kind` payloads (`technical_preparation_ready`, `technical_preparation_blocked`).
  - Perspective E preferred minimal compatibility churn, preserving `complete|blocked` semantics across neighboring contracts.
- Resolution:
  - Keep compatibility-first external token: `outcome: complete | blocked`.
  - Add explicit payload shape constraints in `output-contract.md` and `orchestration.md` so return bodies are discriminated by required fields (data-first) even if token remains unchanged.
  - This preserves subtractive compatibility while still preventing ambiguous narrative returns.

### B. Role-collapse exception handling

- Disagreement:
  - Some proposals pushed near-absolute prohibition with only blocked return.
  - Others kept explicit decision-owner-authorized role-collapse as emergency path.
- Resolution:
  - Keep emergency role-collapse path only as explicit, auditable exception: requires decision-owner authorization and event evidence.
  - Remove all implicit exceptions. No qualifier language in baseline ownership clauses.

### C. Scope of upstream/downstream edits

- Disagreement:
  - Perspectives A/C recommended structural schema updates in `shaper` and `execution-lead` now.
  - Perspective E recommended minimal edits only where misaligned language creates relapse pressure.
- Resolution:
  - Apply minimal required cross-boundary edits now:
    - `shaper` removes execution-evidence demand from `tech-lead` return.
    - `execution-lead` handoff contract removes child-path fan-out requirement and treats package internals as resolved from package directory/manifest.
  - No broader vocabulary/token migration in this pass.

## 3) Exact file-level patch plan (ordered)

1. `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
   - Replace filename-coupled input (`shape.md`) with shaped intent locator.
   - Replace ownership loophole sentence with unconditional non-authorship clause plus explicit blocked/escalation exception path.
   - Replace "assemble package containing..." authored-content block with package-index/manifest synthesis language.
   - Insert mandatory pre-synthesis delegation-integrity checkpoint.
   - Remove execution-evidence dependency from stage completion; return stage-bounded outcome + transfer integrity only.

2. `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
   - Reframe default behavior from package production to delegated orchestration + stage outcome return.
   - Update delegate return minimum from path-only to provenance-aware fields (`artifact_class`, `artifact_locator`, `owner_role`, unresolveds/blockers, citations).
   - Remove loophole qualifier in member ownership rule.
   - Replace stage return section to exclude execution telemetry and require transfer evidence or blockers with ownership.

3. `framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`
   - Replace required payload with minimal boundary fields:
     - `item_workspace_path`
     - `package_directory`
     - `execution_worktree_path`
     - `issuer_role`
   - Remove child artifact fan-out requirements.
   - Replace "correct and re-invoke" with routing to owning role + re-invoke/escalate.

4. `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
   - Replace root verb "Produce..." with stage-return contract language.
   - Remove fixed path conventions and file-name requirements.
   - Define required success payload fields around package directory + manifest/index + transfer record.
   - Remove `complete-with-evidence` transfer token and execution-proof coupling.
   - Keep top-level `outcome: complete|blocked` for compatibility; enforce data-shape discriminants.

5. `framework/archetypes/technical-preparation/tech-lead/doctrine/pipeline.md`
   - Remove filename coupling in input description.
   - Replace output wording that binds technical-preparation success to execution evidence.

6. `framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md`
   - Remove `by default` and `in normal operation` ownership qualifiers.
   - Update boundary language to explicit routing/escalation when ownership cannot be satisfied.

7. `framework/archetypes/technical-preparation/tech-lead/ethos/identity.md`
   - Strengthen positive delegation identity: leadership by composition, synthesis, and boundary integrity.
   - Keep explicit non-identity boundaries (not shaper / not execution owner / not implementer) without loophole phrasing.

8. `framework/archetypes/technical-preparation/tech-lead/ethos/tenets.md`
   - Strengthen integration tenet to explicit composition conviction (delegated specialist authorship + leader synthesis).
   - Keep boundary tenet, reword toward trust/speed via stage integrity.

9. `framework/archetypes/technical-preparation/tech-lead/ethos/principles.md`
   - Add explicit delegation-first principle (ownership assignment by role).
   - Keep evidence gating and boundary routing.
   - Add drift interruption principle (if leader begins specialist production, stop/redelegate/escalate).

10. `framework/archetypes/technical-preparation/tech-lead/references/template.md`
    - Replace monolithic authored template with minimal package manifest/index template:
      - artifact entries with provenance
      - unresolved decisions
      - accepted risks
      - scope partition
      - transfer record
    - Remove execution telemetry section entirely.

11. `framework/archetypes/product/shaper/doctrine/orchestration.md` (required upstream sync)
    - Remove demand for execution evidence in `tech-lead` return contract.
    - Require stage-bounded technical-preparation return fields only.

12. `framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md` (required downstream sync)
    - Remove child-path fan-out as required fields where package directory contract root is sufficient.
    - Clarify execution resolves internal artifact locators via package manifest/index.

## 4) Explicit deletions (lines/concepts) and why

Delete these concepts in this pass:

1. Ownership loophole phrases:
   - `in normal operation`
   - `by default`
   - Why: creates implicit exception channels that caused observed role collapse.

2. Fixed cross-stage filename coupling:
   - `shape.md` as required boundary filename
   - `technical-package.md`, `traceability-matrix.md` as required output filenames
   - Why: boundary contracts should survive internal naming refactors.

3. Execution telemetry requirements inside technical-preparation completion:
   - `files changed`, `verification commands`, `outcomes` as `tech-lead` success proof
   - `complete-with-evidence` transfer semantics in tech-preparation output
   - Why: this semantically makes `tech-lead` execution-accountable and drives cross-stage overreach.

4. Child artifact path fan-out as handoff boundary requirements:
   - explicit required `plan path`, `test specification path(s)`, and similar per-file fields at cross-stage boundary
   - Why: duplicates source of truth and causes contract drift; package directory + manifest is sufficient.

5. Producer-centric doctrine wording:
   - `Produce one technical-preparation package...`
   - `Assemble one execution-ready package containing...` (as authored-content expectation)
   - Why: incentivizes self-production instead of delegated synthesis.

6. Handoff wording that licenses direct correction by `tech-lead`:
   - `correct and re-invoke`
   - Why: creates direct path for leader to do member-owned work.

7. Reference template execution-results section:
   - `If complete: files changed / verification commands / outcomes`
   - Why: reintroduces execution ownership bleed via template gravity.

Bottom line: the redesign is a subtractive boundary hardening pass. It removes filename and telemetry coupling, upgrades delegation to identity-level conviction, and restores strict stage ownership: `tech-lead` delegates and synthesizes; `execution-lead` executes.
