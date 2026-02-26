# Archetypes

How agent archetypes are constructed, maintained, and organized. This is the top-level guide for the `framework/archetypes/` directory.

> For the derivation method (truth → ethos → doctrine), see `docs/framework/AUTHORING.md`.
> For the end-to-end creation workflow (chaos → order), see `docs/framework/ARCHETYPE_WORKFLOW.md`.
> For the decomposition process (converting existing skills into archetypes), see `framework/lib/decompose/AGENTS.md`.
> For assembly tooling, see `framework/lib/assemble.py` and `framework/AGENTS.md`.

---

## Two Layers Per Archetype

Every archetype has two layers:

### Assembly Layer

The articles that get compiled into the SKILL.md. This is what the agent *becomes*.

```
truth/        # Domain known goods
ethos/        # Identity, tenets, principles
doctrine/     # Process, orchestration, pipeline, output contract
references/   # Optional supporting material deployed alongside SKILL.md
archetype.yaml  # Manifest declaring assembly order and metadata
```

This layer is well-documented in `framework/AGENTS.md` and `docs/framework/AUTHORING.md`.

### Design Layer

The artifacts that explain *why* the archetype is the way it is. This is what you build upon when constructing or maintaining the assembly articles. It is not assembled into the SKILL.md. It is the reasoning trail.

```
design/
  why.md              # Why this archetype exists, team fit, separation rationale
  team-map.md         # Role topology: leader/member/satellite, parent/child handoffs
  research/           # Research documents
    analogs.md        # Real-world analogs -- people, biblical, historical, modern
    [other research]  # Domain research as needed
  truths.md           # Unfiltered truth candidates (library, not yet curated)
  log.md              # Ledger of decisions, changes, lessons learned
  synthesis.md        # Links everything together; powers article generation
```

The design layer is **required for every archetype**. Without it:
- Maintenance is blind (you don't know why things are the way they are)
- Verification is impossible (you can't check if the archetype is doing its job)
- The authoring process restarts from scratch every session

---

## Design Layer Files

### `why.md`

Why this archetype exists. How it fits in its team. The separation rationale.

Questions it answers:
- What problem does this archetype solve?
- What team does it belong to and what role does it play?
- Why is this a separate archetype (not combined with another)?
- What it receives and what it produces
- What known good grounds the existence of this role?

This is the first file written. Everything else builds on it.

### `team-map.md`

Operational topology contract for this archetype.

Questions it answers:
- Is this archetype a team leader, team member, or satellite specialist?
- Who is its parent leader?
- Who are its member delegates (if leader)?
- Where do member artifacts return by default?
- If it is a leader, what stage package leaves the team and who receives it?

Default rule:
- Team members hand outputs to their parent leader.
- Team leaders synthesize member outputs and hand stage packages downstream.
- Satellite teams return outputs to the requesting parent leader.

Leader invocation rule:
- Invocation triggers immediate stage execution.
- No waiting/conversational state. No named internal phases as reportable milestones.
- Leader returns only terminal stage outcome (`ready/complete` or `blocked/escalated`).
- Input validation is not a terminal outcome. A return that contains only input context restatement is incomplete.

Leader event rule:
- Stage leaders include project/item events for transfer, outcome, and escalation in their return payload.
- No acknowledgment events (e.g., no "handoff-received"). The invocation itself is evidence of receipt.

### `research/analogs.md`

Real-world analogs for this archetype. People -- historical, biblical, modern -- who genuinely embody this role. Not tokens. Genuine embodiments.

The purpose: find who has done this well, then ask what drove them. Their truths and convictions become the raw material for the archetype's truth and ethos articles.

Sources to search:
- **Biblical**: Proverbs, wisdom literature, figures who embody this archetype. If the archetype genuinely exists in scripture, that's a known good that has stood the test of time.
- **Historical**: People in history who were known for this type of work.
- **Modern**: Practitioners, authors, leaders who embody this role today.
- **Domain literature**: Books, frameworks, doctrines where this archetype's work is described.

### `research/source-map.md` (recommended)

A map of required source material for this archetype run.

Purpose:
- Make source scope explicit up front
- Remove "where should I look?" ambiguity for future runs
- Record which sources are mandatory versus optional

Include:
- required primary sources
- required framework docs
- related neighboring archetypes that must be read
- optional supporting sources

### `truths.md`

Unfiltered truth candidates gathered from analogs, domain research, scripture, and observation. This is the library -- the raw collection before curation.

Each candidate includes:
- The truth (stated plainly)
- The source (person, book, scripture, domain)
- Negation test: is the negation absurd?
- Independence test: is this true regardless of whether this agent exists?
- Which convictions/tenets it would ground

The truth/ articles in the assembly layer are the curated selection from this library.

#### Truth Extraction Protocol (required)

When populating `truths.md`, use a repeatable extraction method:

1. Build a claim pool from research sources.
2. Cluster equivalent claims.
3. Apply gates: convergence (2+ independent source families), actionability, non-tautology.
4. Apply tests: negation test, independence test.
5. Write truth cards with citations and likely ethos hooks.
6. Select 3-5 final truths for `truth/` articles based on convergence + leverage + low overlap.

Do not skip this. Truth quality determines everything downstream.

### `log.md`

Ledger of changes, decisions, and lessons learned. Maintained over time -- every significant change to the archetype gets an entry. This is how you avoid making the same mistakes twice.

### `synthesis.md`

The final document that links everything together. When complete, it is the specification that powers the generation of the actual archetype articles.

It synthesizes why.md + analogs + truths into:
- Which truths to select for truth/ articles
- What identity, tenets, and principles to derive for ethos/ articles
- What process, orchestration, pipeline, and output contract to derive for doctrine/ articles
- The therefore-chains connecting them

### `best-of-n/` (required for non-trivial archetypes)

Independent perspective passes used to pressure-test assumptions before first assembly pass.

Convention:
- `best-of-n/YYYY-MM-DD-pass-a.md` ... `pass-e.md`
- `best-of-n/YYYY-MM-DD-synthesis.md`

Rules:
- Each pass writes to disk.
- Passes must not read each other's output files.
- Synthesis records convergent decisions and contested choices.

---

## Construction: From Scratch

When building a brand new archetype:

1. **`why.md` first.** Define why this archetype exists and how it fits.
2. **Map sources.** Write `research/source-map.md` so future runs know exactly where to look.
3. **Research analogs and domain evidence.** Write `research/analogs.md` and supporting research files.
4. **Write team topology contract.** Add `team-map.md` with explicit parent/member handoffs.
5. **Gather truths.** Extract truth candidates into `truths.md` with negation and independence tests.
6. **Run best-of-N.** Create independent perspective passes under `best-of-n/` and a convergence synthesis.
7. **Synthesize direction.** Update `synthesis.md` with v1 decisions and therefore-chains.
8. **Write first assembly pass.** Create `archetype.yaml` and write v1 `truth/`, `ethos/`, `doctrine/` articles.
9. **Propagate interface updates.** Update neighboring archetypes if role boundaries changed.
10. **Assemble and verify.** Run `--dry-run` for new and affected archetypes.

Use `docs/framework/ARCHETYPE_WORKFLOW.md` as the canonical phase-by-phase runbook.

## Construction: From Decomposition

When converting an existing skill file into an archetype, follow the decompose process in `framework/lib/decompose/AGENTS.md`. The decompose workbench artifacts should be stored in `design/` (or `design/workbench/`) so the reasoning trail lives with the archetype.

Additionally, write `design/why.md` -- the decompose process does not produce this, but every archetype needs it.

---

## Organization

```
framework/archetypes/
  AGENTS.md               # This file
  development/            # Development team
    _shared/              # Shared articles across development archetypes
    api-designer/
    test-designer/
    test-implementer/
    implement-plan/
  product/                # Product team
    shaper/               # Team leader -- synthesis, scoping, output
    problem-analyst/      # Exploration, validation, research
  technical-preparation/  # Technical-preparation team
    tech-lead/            # Team leader -- active-shape intake and solution design orchestration
  execution/              # Execution team
    execution-lead/       # Team leader -- test-first implementation and validation orchestration
```

Each top-level directory is a team. Each subdirectory is an archetype within that team.

Team structure is operational, not cosmetic: leaders delegate to members, members return artifacts to parent leaders, and leaders own cross-team stage handoffs.
