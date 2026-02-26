# ARCHETYPE WORKFLOW: Chaos -> Order

This document codifies the repeatable workflow for creating a new archetype from ambiguous intent.

`AUTHORING.md` defines the derivation method (`truth -> ethos -> doctrine`).
This document defines the execution workflow that gets you from first-contact ambiguity to a validated v1 archetype.

---

## Outcome

A successful run produces:

1. A complete design layer (`why`, `research`, `truths`, `synthesis`, `log`)
2. A complete first assembly layer (`truth/`, `ethos/`, `doctrine/`, `archetype.yaml`, optional `references/`)
3. Explicit upstream/downstream interface updates where role boundaries changed
4. Explicit team topology contract (leader, members, parent/child handoffs)
5. Dry-run assembly proof for changed archetypes

If any one of these is missing, the workflow is incomplete.

---

## Phase 0: Intake and Boundary Declaration

### Purpose

Convert raw request into an explicit role boundary and research scope.

### Required actions

1. Name the role candidate and stage position.
2. State what this role owns and what it explicitly does not own.
3. Identify upstream/downstream contracts likely to change.
4. Classify role type: `team-leader`, `team-member`, or `satellite-team` member.
5. Declare parent/child handoff direction.
6. Create the archetype directory and `design/` scaffold.

### Required artifact

- `design/why.md`
- `design/team-map.md`

`why.md` must answer:
- why this role exists
- why this role is separate (not merged)
- what it receives
- what it produces
- who it hands off to

`team-map.md` must answer:
- Is this archetype a team leader, team member, or satellite specialist?
- Who is the parent leader?
- Who are the member delegates (if leader)?
- Default handoff rule for produced artifacts
- Stage ownership and next-stage handoff target (if leader)

Default handoff rule:
- Team members hand outputs to their parent leader.
- Team leaders hand stage packages to the next-stage owner.
- Satellite teams hand outputs back to the requesting parent leader.

Invocation rule:
- Leader invocation is a trigger to execute stage responsibilities immediately.
- No waiting or conversational intake mode.
- Leader returns only terminal stage outcome (`complete`/`ready` or `blocked`/`escalated`).

---

## Phase 1: Source Mapping and Research

### Purpose

Ground the role in established truths before writing ethos.

### Required actions

1. Build a source map for this archetype's domain evidence.
2. Read source material completely (not excerpts only).
3. Record durable analogs (biblical, historical, modern, domain).
4. Audit neighboring runtime roles that this split will affect.
5. Audit parent and child contracts that this role must interoperate with.

### Required artifacts

- `design/research/source-map.md` (recommended)
- `design/research/analogs.md`
- role-specific research files (book review, split audit, domain notes)
- parent/child contract audit notes (recommended)

### Rule

Do not derive tenets until source grounding is captured in files.

---

## Phase 2: Truth Library (Unfiltered)

### Purpose

Create the candidate truth pool that will ground ethos.

### Required actions

1. Write candidate truth cards.
2. For each candidate, include:
   - truth statement
   - source grounding
   - negation test
   - independence test
   - likely ethos/doctrine hooks

### Required artifact

- `design/truths.md`

### Rule

If a claim fails negation or independence tests, it is not a truth.

---

## Phase 3: Best-of-N Independent Perspectives

### Purpose

Pressure-test weak assumptions and identify convergence before writing assembly articles.

### Recommended default

5 independent passes (`N=5`) for non-trivial archetypes.

### Execution protocol

1. Create `design/best-of-n/`.
2. Run each pass independently (parallel is preferred).
3. Each pass writes its own file.
4. Passes must not read each other's output files.
5. Each pass must be source-grounded and opinionated.

### Required artifacts

- `design/best-of-n/YYYY-MM-DD-pass-a.md` ... `pass-e.md`
- `design/best-of-n/YYYY-MM-DD-synthesis.md`

### Recommended pass lenses

- A: full-stack recommendation
- B: role boundary and anti-overlap rigor
- C: truth quality and derivation integrity
- D: runtime orchestration mechanics
- E: adversarial red-team stress test

### Rule

Best-of-N is not vote counting. It is convergence detection plus edge-case discovery.

---

## Phase 4: Convergence Synthesis

### Purpose

Collapse multiple perspectives into one v1 decision set.

### Required actions

1. Identify convergent decisions (non-negotiables).
2. Identify contested decisions and choose one with rationale.
3. Record anti-drift controls.
4. Record required adjacent updates (other archetypes/contracts).
5. Record team topology decisions (parent, members, stage handoff).

### Required artifacts

- `design/synthesis.md` (updated to final v1 direction)
- `design/log.md` (decision entries)

---

## Phase 5: First Assembly Pass (v1)

### Purpose

Materialize v1 archetype from design synthesis.

### Required actions

1. Write `archetype.yaml`.
2. Write selected `truth/` articles.
3. Derive and write `ethos/identity.md`, `ethos/tenets.md`, `ethos/principles.md`.
4. Derive and write doctrine articles (process + orchestration + pipeline + output contract at minimum).
5. Add `references/` artifacts where useful.
6. Ensure doctrine encodes leader/member handoff semantics.

### Required output minimum

- `truth/` (>= 1 file)
- `ethos/` (>= 1 file)
- `doctrine/` (>= 1 file)
- `archetype.yaml`

### Rule

Doctrine must be specific enough to execute and minimal enough to trace back to ethos in one mental step.

---

## Phase 6: Interface Propagation (Upstream/Downstream)

### Purpose

Keep the system coherent when a role boundary changes.

### Required actions

1. Update upstream handoff targets and contracts.
2. Update downstream ownership expectations.
3. Update templates and team-contract references.
4. Log interface changes in relevant design logs.
5. Verify team member outputs now route to the intended parent leader.

### Rule

A new archetype is incomplete if neighboring archetypes still route to obsolete boundaries.

---

## Phase 7: Validation and Readiness

### Required checks

1. Dry-run assembly for new archetype.
2. Dry-run assembly for any archetype modified due to interface propagation.
3. Confirm directory doctrine and file doctrine compliance.
4. Confirm design log records key decisions.

### Completion condition

All changed archetypes assemble cleanly with `--dry-run`.

---

## Quality Gates (Cross-Phase)

1. **Grounding gate**: claims are source-grounded.
2. **Derivation gate**: truth -> ethos -> doctrine links are explicit.
3. **Boundary gate**: ownership and non-ownership are explicit.
4. **Contract gate**: handoff payload and transfer semantics are explicit.
5. **Coherence gate**: adjacent archetypes reflect the new boundary.
6. **Topology gate**: team leader/member/satellite relationships are explicit and consistent.
7. **Outcome gate**: stage-owner delegation contracts require run-to-outcome, not intake acknowledgment only.

Failure at any gate blocks progression.

---

## Anti-Patterns

1. Writing ethos before truth grounding.
2. Treating best-of-N as popularity voting.
3. Leaving neighboring archetypes unmodified after boundary split.
4. Over-specifying doctrine due to weak ethos.
5. Under-specifying handoff contracts ("just delegate") with no transfer rule.
6. Leaving member handoff direction implicit.
7. Delegation prompts that request only receipt + initial plan, which creates handoff-only loops and no downstream artifact production.

---

## Minimal vs Full Mode

### Minimal mode (small archetype update)

- update `why.md`
- update `truths.md`
- 3-pass best-of-N
- targeted article updates
- dry-run assembly

### Full mode (new archetype or major split)

- all phases in this workflow
- 5-pass best-of-N
- explicit interface propagation to neighboring archetypes

---

## Deliverable Checklist

Before handing off, verify:

- [ ] design layer complete and current
- [ ] best-of-N passes + synthesis on disk
- [ ] v1 assembly articles written
- [ ] interface updates applied to neighboring archetypes
- [ ] team topology contract written (`design/team-map.md`)
- [ ] dry-run assembly clean for changed archetypes
- [ ] design logs updated with decisions

---

## Future Harness Integration Note

Today, team topology is authored in markdown (`design/team-map.md`, team contracts, pipeline docs).

Planned evolution: promote topology to machine-readable structured data so harnesses can enforce delegation boundaries deterministically:

- team leaders can delegate only to declared team members
- team members return artifacts to declared parent leaders
- satellite teams remain globally invocable support units

Until that structured format exists, keep topology contracts explicit and consistent in markdown artifacts.
