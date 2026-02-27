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

## Contract Design Rules

Agents are functions. Their contracts -- how they receive input, how they return output, how they communicate errors -- must follow the function model. This section codifies lessons learned from observed failures.

> For the full grounding, see `AGENTS.md` root: "Agents are non-deterministic functions -- stateless, terminal, composable."

### Agents are functions, not services

An agent is invoked, does work, and returns. It is not a server waiting for requests. It is not a process with observable internal state. Returning a message terminates the invocation.

This means:
- There is no "running" state. If the agent returned, it is done.
- There is no "intake" phase. Input validation is the first lines of the function body -- invisible to callers.
- There is no "preflight" phase. Precondition checking is input validation -- invisible to callers.
- There is no "acknowledgment." The invocation itself is evidence of receipt.

An agent either returns its result (success) or returns an error (blocked). There is no third option.

### Do not name internal phases in contracts

When internal process steps get names ("intake", "preflight", "transfer"), agents treat them as reportable milestones and return after completing a milestone as if that is progress. But returning terminates the invocation, so reporting an internal milestone is indistinguishable from failing to complete the work.

Rules:
- **Input validation is unnamed.** It either passes (function proceeds) or fails (error return with specific defects).
- **Internal work steps are implementation, not milestones.** A process.md may describe steps for the agent's own guidance, but these steps should not appear in output contracts, handoff contracts, or delegation prompts as externally visible states.
- **Return values describe what was produced, not where the agent stopped.** `complete-with-evidence` (done, here's proof) not `running-with-evidence` (I'm partway through). `blocked` (cannot proceed, here's why) not `intake-blocked` (I stopped at a named internal phase).

### Delegation prompts are call sites, not function bodies

When one agent delegates to another, the delegation prompt specifies:
1. **Skill invocation**: which skill the delegate loads
2. **Input arguments**: what the delegate receives (paths, context, constraints)

The delegation prompt does NOT specify:
- The callee's return contract (the callee's own skill defines what it returns)
- How the delegate should traverse its internal process
- Which internal phases to complete
- What to do at intermediate checkpoints
- What NOT to return (prohibition-style guardrails)
- Behavioral instructions ("do not implement code", "return only acknowledgment")

The callee's own archetype governs its internal behavior, its delegation to its own members, and its return type. The caller specifies what goes in. That is all.

**Grounding -- call-site primacy**: The call-site prompt has cognitive primacy over the loaded skill file. The skill loads second. The agent has already internalized the call-site before the skill arrives. The less the call-site says, the more the skill governs. Return contracts, execution requirements, and behavioral instructions at the call-site displace the callee's own identity and suppress its internal delegation. This is observable across all delegation boundaries -- callers that add return contracts produce callees that comply with the call-site instead of their own skill.

**Bad**: "Produce technical-preparation package. Return: `ready-for-execution` | `blocked`."
**Good**: Skill invocation + input argument values only. The callee's skill defines its return type.

### Return values are terminal and honest

Every return value must be:
- **Terminal**: describes a completed state, not an ongoing process
- **Honest**: if the agent returned, it is done -- the return value cannot claim otherwise
- **Discriminated**: success and error are distinct shapes, not status fields on the same shape

Positive return contracts (whitelist what to return) are stronger than prohibition contracts (list what not to return). If the return type is well-specified, no prohibition is needed.

### Events are return data, not side effects

Agents do not append to external ledgers during execution. Events accumulated during work are returned as structured data in the return payload. The caller (or harness) persists them. This keeps the function pure and avoids orphaned intermediate events on failure.

---

## Project Context and Observability

Every agent operates within a project. The project provides the shared context, event ledger, and artifact structure that makes agent work observable.

### Project structure

When an agent is invoked, it must know which project (and sub-project/item) it is working within. The project structure provides:

```
project/
  index.md              # Project control plane
  sources/              # Input evidence
  working/              # Execution artifacts
  events.jsonl          # Append-only project-level event ledger
  shaped-items/
    active/item-###/
      shape.md          # Shaped artifact
      index.md          # Item control plane
      sources/          # Item evidence
      working/          # Item execution artifacts
      events.jsonl      # Append-only item-level event ledger
```

### Event ledger (`events.jsonl`)

The event ledger is the observability backbone. Every significant action by any agent within the project should produce an event entry. Between the event ledger and atomic commits, you get a complete timeline of what happened, when, and by whom.

Required event fields:
- `ts` -- ISO 8601 timestamp
- `actor` -- which agent/role produced the event
- `type` -- what happened (e.g., `stage-complete`, `delegation-issued`, `artifact-produced`, `error-returned`)
- `item` -- which item this relates to (if applicable)
- `detail` -- structured payload specific to the event type

Events are accumulated during execution and included in the agent's return payload. The caller persists them to the appropriate `events.jsonl` file(s).

### Atomic commits

Any agent that produces committed code changes must use atomic commits:
- Each commit represents one logical unit of work
- Commit messages describe what changed and why
- The combination of commits + event ledger entries creates a complete audit trail

### What this means for archetype construction

When building an archetype:

1. **Doctrine must specify event production.** The output contract should list which event types this agent produces. The process should describe when events are generated (as return data, not side effects).

2. **Delegation prompts must pass project context.** When delegating, include:
   - Project path
   - Item path (if item-scoped)
   - Event ledger path(s)
   - Execution worktree path

3. **Every archetype contributes to observability.** Whether it's a leader orchestrating stages or a member writing tests, every agent's return includes events that the caller persists. No agent is exempt.

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
    tech-lead/            # Team leader -- active-shape input and solution design orchestration
  execution/              # Execution team
    execution-lead/       # Team leader -- test-first implementation and validation orchestration
```

Each top-level directory is a team. Each subdirectory is an archetype within that team.

Team structure is operational, not cosmetic: leaders delegate to members, members return artifacts to parent leaders, and leaders own cross-team stage handoffs.
