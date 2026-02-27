# Perspective E -- Risk and Compatibility Pass

## 1) Compatibility constraints (shaper/tech-lead/execution-lead)

1. `shaper -> tech-lead` must remain a stage-boundary call: `tech-lead` returns technical-preparation terminal outcome only (`complete` or `blocked`) plus package locator(s), never execution telemetry.
2. `tech-lead -> execution-lead` ownership boundary must remain unchanged: execution owns all work from invocation to return; technical-preparation owns package correctness and transfer completeness.
3. Keep current cross-stage payload field set unless removal is necessary to stop delegation collapse. Additive schema churn is a regression risk for neighboring archetypes.
4. Member ownership stays explicit and auditable: `spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan` remain artifact authors; `tech-lead` remains synthesizer/gatekeeper.
5. Delegation prompts stay call-site contracts (inputs + return shape), not callee process scripts, per framework contract rules.

Compatibility implication: use subtractive edits to remove execution-stage requirements from `tech-lead` returns while preserving existing outcome tokens and handoff field names where possible.

## 2) Regression risk list with severity and trigger

1. **Severity: Critical** -- Stage boundary collapse reintroduced.
   - Trigger: any `tech-lead` success criteria requiring execution evidence (`files changed`, `verification commands`, `outcomes`).
2. **Severity: High** -- Silent self-production drift.
   - Trigger: qualifier loopholes such as `in normal operation` or `by default` on ownership boundaries.
3. **Severity: High** -- Cross-archetype contract mismatch with `shaper`.
   - Trigger: `shaper` delegation prompt still requiring execution evidence from `tech-lead` return.
4. **Severity: High** -- Handoff authority ambiguity with `execution-lead`.
   - Trigger: `tech-lead` handoff language that implies direct correction work instead of routing correction to owning role or escalation.
5. **Severity: Medium** -- Contract drift from duplicated path contracts.
   - Trigger: parallel requirements for package-level path plus many child artifact fields without clear authoritative source.
6. **Severity: Medium** -- Legacy template nudges producer behavior.
   - Trigger: template sections that ask `tech-lead` to fill execution results or author specialist content blocks.
7. **Severity: Low** -- Unnecessary enum/schema churn.
   - Trigger: renaming core outcome tokens (`complete`/`blocked`) across multiple archetypes without functional need.

## 3) Minimum upstream/downstream edits required

This is the minimum patch set that fixes delegation collapse and preserves compatibility.

### A. Core edits (tech-lead)

1. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
   - Delete execution-evidence dependency at stage outcome:
     - Remove: `Execution-lead returns either complete with evidence of execution work ...`
     - Replace return clause:
       - From: `complete with package path and execution evidence`
       - To: `complete with package path and transfer outcome to execution-lead`
   - Tighten ownership language:
     - Replace: `does not author member-owned artifacts in normal operation`
     - With: `does not author member-owned artifacts; if delegation is unavailable, return blocked/escalated for role-collapse authorization`

2. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
   - Stage return contract edit:
     - Remove execution evidence requirement from item 3.
     - Keep return shape stage-bounded: outcome + technical package path + transfer outcome, or blockers + escalation target.
   - Tighten ownership language:
     - Replace: `does not bypass member ownership in normal operation`
     - With unconditional boundary + blocked/escalation path.

3. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md`
   - Remove `Validation-only results are not complete...` clause (execution-stage validation semantics belong to execution contract).
   - Replace: `tech-lead processes the blockers: correct and re-invoke, or escalate`
   - With: `tech-lead routes correction to owning role and re-invokes, or escalates`.

4. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
   - Change contract root verb:
     - From: `Produce one technical-preparation package...`
     - To: `Return technical-preparation stage outcome with package index...`
   - Remove fixed filename requirements under `Path Convention`.
   - Remove transfer outcome token `complete-with-evidence`; use stage-bounded transfer result (`issued` or `blocked`) while retaining top-level outcome `complete|blocked`.

5. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/pipeline.md`
   - Output clause update only:
     - Replace `transfer record ... complete-with-evidence or blocked`
     - With transfer-issued vs blocked language (no execution telemetry).

6. File: `framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md`
   - Remove qualifier loopholes:
     - `by default`
     - `in normal operation`

7. File: `framework/archetypes/technical-preparation/tech-lead/references/template.md`
   - Delete execution telemetry subsection (`If complete: files changed / verification commands / outcomes`).
   - Replace hard-coded package file path with package artifact locator field (path decided by process/output contract).
   - Keep template as index/checklist, not authored specialist-content scaffold.

### B. Upstream touch point (required)

1. File: `framework/archetypes/product/shaper/doctrine/orchestration.md`
   - In `Technical preparation delegation (post-decision)` return contract, remove:
     - `If complete: execution evidence (files changed, verification outcomes)`
   - Replace with:
     - `If complete: technical package artifact path(s) and transfer outcome to execution owner`

### C. Downstream touch point (minimum sync)

1. File: `framework/archetypes/execution/execution-lead/doctrine/handoff-contract.md`
   - No structural schema change required.
   - Optional one-line clarification (recommended for drift prevention):
     - Add statement that execution evidence is produced in execution return and is not a prerequisite field in `tech-lead` stage return to upstream.

## 4) Exact patch order and rollback checks

1. Patch `tech-lead/doctrine/process.md` and `tech-lead/doctrine/orchestration.md` first.
   - Rollback check: verify no remaining `execution evidence` requirement in `tech-lead` stage return clauses.
2. Patch `tech-lead/doctrine/handoff-contract.md`, `tech-lead/doctrine/output-contract.md`, `tech-lead/doctrine/pipeline.md`, `tech-lead/doctrine/team-contract.md`.
   - Rollback check: verify no `in normal operation` / `by default` qualifiers remain on ownership boundaries.
3. Patch `tech-lead/references/template.md`.
   - Rollback check: verify template contains no execution telemetry section and no fixed package filename mandate.
4. Patch upstream boundary in `product/shaper/doctrine/orchestration.md`.
   - Rollback check: shaper delegation return contract no longer demands execution evidence from `tech-lead`.
5. Patch downstream sync line in `execution/execution-lead/doctrine/handoff-contract.md` (if applied).
   - Rollback check: execution ownership language remains intact; no required input field churn introduced.
6. Run assembly previews for affected archetypes:
   - `python framework/lib/assemble.py framework/archetypes/technical-preparation/tech-lead --dry-run`
   - `python framework/lib/assemble.py framework/archetypes/product/shaper --dry-run`
   - `python framework/lib/assemble.py framework/archetypes/execution/execution-lead --dry-run`
7. Contract regression scan (string checks):
   - Confirm absent in affected files: `complete-with-evidence`, `files changed`, `verification commands`, `in normal operation`, `by default` (ownership clauses only).

## 5) Deletions required to prevent contract drift

Delete these exact phrases/requirements:

1. `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
   - `Execution-lead returns either complete with evidence of execution work ...`
   - `complete with package path and execution evidence`
   - qualifier phrase `in normal operation` in artifact ownership sentence.

2. `framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md`
   - Stage return requirement: `if complete: execution evidence (files changed, verification commands, outcomes) ...`
   - qualifier phrase `in normal operation` in member-ownership rule.

3. `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
   - `Produce one technical-preparation package per active item.`
   - fixed path lines for `technical-package.md` and `traceability-matrix.md`.
   - transfer token `complete-with-evidence`.

4. `framework/archetypes/technical-preparation/tech-lead/doctrine/pipeline.md`
   - output token pair `complete-with-evidence or blocked`.

5. `framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md`
   - `by default` (product framing boundary).
   - `in normal operation` (specialist ownership boundary).

6. `framework/archetypes/technical-preparation/tech-lead/references/template.md`
   - Entire `If complete:` execution telemetry subsection.
   - fixed `Package artifact: .../technical-package.md` requirement.

7. `framework/archetypes/product/shaper/doctrine/orchestration.md`
   - return-contract line requiring `execution evidence (files changed, verification outcomes)` from `tech-lead`.

Net effect: delegation collapse is removed by subtraction, while shaper and execution-lead interfaces remain compatible with minimal edits and no unnecessary schema churn.
