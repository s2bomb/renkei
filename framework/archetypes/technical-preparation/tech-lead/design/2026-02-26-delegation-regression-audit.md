# Delegation Regression Audit (Tech-Lead)

Scope: line-level causes of tech-lead collapsing into producer/executor behavior.

## 1) Coupling to specific artifact filenames/content

### 1.1 Fixed package filenames create output-over-orchestration bias
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md:9-10`
- **Quote:** "- Item package: `shaped-items/active/item-###/working/technical-package.md`" and "- Optional matrix artifact: `shaped-items/active/item-###/working/traceability-matrix.md`"
- **Why it causes collapse:** Success is measured by concrete file emission at exact paths, which rewards direct production instead of proving delegated production + synthesis.
- **Subtractive fix direction:** Remove fixed filename requirements; replace with contract fields for artifact classes + provenance (owner role, source path).

### 1.2 Template hard-codes package artifact path and content skeleton
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/references/template.md:7-10,17-25`
- **Quote:** "- Package artifact: shaped-items/active/item-###/working/technical-package.md" plus required section scaffold under "## Artifact Paths".
- **Why it causes collapse:** The role is steered to fill a monolithic authored document instead of gating delegate-owned artifacts.
- **Subtractive fix direction:** Remove monolithic package template as primary artifact; replace with minimal synthesis index that references delegate outputs + checks.

### 1.3 Package content is specified as authored payload, not delegated references
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:45-53`
- **Quote:** "Assemble one execution-ready package containing: - enriched spec ... - implementation plan ... - accepted risks"
- **Why it causes collapse:** "containing" encourages assembling content into a produced artifact, blurring leader synthesis with authoring work.
- **Subtractive fix direction:** Replace "containing" language with "indexes delegate-owned artifacts + unresolved decisions/risks."

## 2) Soft language / loopholes

### 2.1 "Normal operation" loophole permits boundary bypass
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:34`
- **Quote:** "`tech-lead` does not author member-owned artifacts in normal operation."
- **Why it causes collapse:** "normal operation" leaves an implicit abnormal path where self-authoring is acceptable.
- **Subtractive fix direction:** Remove "in normal operation"; replace with unconditional prohibition plus explicit blocked/escalation return.

### 2.2 "By default" weakens product-boundary enforcement
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/team-contract.md:22`
- **Quote:** "`tech-lead` does not rewrite product framing by default."
- **Why it causes collapse:** "by default" implicitly allows reframing when pressured, creating role drift into shaping/producing behavior.
- **Subtractive fix direction:** Remove "by default" and make reframing a hard upstream defect route only.

### 2.3 Ownership boundary weakened by "normal operation" repetition
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:46`
- **Quote:** "It does not bypass member ownership in normal operation."
- **Why it causes collapse:** Repeated exception language trains model behavior toward justified bypasses.
- **Subtractive fix direction:** Replace with absolute ownership rule and explicit failure state when delegates unavailable.

## 3) Missing delegation enforcement / interruption checks

### 3.1 Validation gates run only after delegation, not before synthesis
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:36-40,45-53`
- **Quote:** "After each delegated return:" ... then "Assemble one execution-ready package containing..."
- **Why it causes collapse:** There is no explicit pre-assembly check that every required artifact was produced by the correct delegate; synthesis can proceed with self-produced substitutes.
- **Subtractive fix direction:** Add mandatory interruption check before assembly: if any artifact lacks delegate provenance, return `blocked`.

### 3.2 Output contract requires paths, not delegate provenance
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md:14-27`
- **Quote:** Required fields list paths and stage records, but no field for producing role/delegation record.
- **Why it causes collapse:** Path completeness can be satisfied by self-authored files; contract cannot distinguish orchestration from direct production.
- **Subtractive fix direction:** Replace some path-only fields with provenance fields (`owner_role`, `delegation_id`, `delegate_outcome`).

### 3.3 No required delegation-issued / delegation-return evidence at stage return
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:62-69`
- **Quote:** Stage return requires outcome, package path, execution evidence/blockers; no required specialist delegation evidence.
- **Why it causes collapse:** Upstream cannot audit whether the lead led specialists or did specialist work itself.
- **Subtractive fix direction:** Add required per-specialist delegation evidence in return payload; block completion if missing.

## 4) Return-contract incentives pulling tech-lead into execution work

### 4.1 Tech-lead success is tied to execution evidence collection
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:76`
- **Quote:** "`complete` with package path and execution evidence"
- **Why it causes collapse:** Completion of technical-preparation is conditioned on downstream execution signals, encouraging tech-lead to chase or perform execution work.
- **Subtractive fix direction:** Replace success contract with transfer-complete evidence only; execution evidence belongs to execution-lead stage outputs.

### 4.2 Orchestration contract imports execution-stage proof into tech-lead return
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/orchestration.md:68`
- **Quote:** "if complete: execution evidence (files changed, verification commands, outcomes) ..."
- **Why it causes collapse:** Technical-preparation return is judged by implementation/test activity, incentivizing cross-stage ownership bleed.
- **Subtractive fix direction:** Remove execution-proof requirement from tech-lead return; require only valid handoff payload + transfer outcome.

### 4.3 Template embeds execution outputs inside technical package
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/references/template.md:53-59`
- **Quote:** "If complete: - files changed ... - verification commands ... - outcomes"
- **Why it causes collapse:** Package author is prompted to include execution telemetry, nudging tech-lead to act as execution reporter/producer.
- **Subtractive fix direction:** Remove execution-result subsection from tech-preparation template; move to execution-lead artifact only.

### 4.4 Handoff contract makes tech-lead corrective actor on execution blockers
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/handoff-contract.md:45`
- **Quote:** "If blocked, tech-lead processes the blockers: correct and re-invoke, or escalate."
- **Why it causes collapse:** "correct" is underspecified and invites direct technical correction work by the lead instead of delegate routing.
- **Subtractive fix direction:** Replace "correct" with "route correction to owning role" and prohibit direct artifact/code correction by tech-lead.

## 5) Doctrine statements that make tech-lead act like producer instead of leader

### 5.1 Producer verb at contract root
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md:5`
- **Quote:** "Produce one technical-preparation package per active item."
- **Why it causes collapse:** Primary verb is production, not orchestration/gating; role identity drifts toward artifact maker.
- **Subtractive fix direction:** Replace "Produce" with "Return stage outcome with synthesized index of delegate-owned artifacts."

### 5.2 Process frames tech-lead as packager of full content, not gatekeeper
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/doctrine/process.md:45-53`
- **Quote:** "Assemble one execution-ready package containing..."
- **Why it causes collapse:** The role is defined by package construction deliverable, which structurally overlaps with specialist production work.
- **Subtractive fix direction:** Replace with gate/synthesis contract that references member-owned artifacts without re-authoring them.

### 5.3 Reference template prescribes authored sections across all specialist domains
- **Path + lines:** `/home/brad/Code/s2bomb/renkei/renkei-wt-1/framework/archetypes/technical-preparation/tech-lead/references/template.md:11-42`
- **Quote:** Sections include "Shaped Context," "Artifact Paths," "Unresolved Decisions," "Accepted Risks," "Scope Structure" with fillable bullets.
- **Why it causes collapse:** The lead is prompted to draft domain content directly instead of strictly validating and linking delegate artifacts.
- **Subtractive fix direction:** Remove content-authoring prompts; replace with checklist-style validation table keyed to delegate outputs.

## Net Regression Pattern

The collapse is driven by three stacked incentives: (1) fixed artifact/file production targets, (2) exception language that permits ownership bypass, and (3) return contracts that reward execution-stage evidence inside technical-preparation outputs.
