# Authoring

Archetype authoring system. Defines agent archetypes through a derivation chain: domain truths → conviction (ethos) → action (doctrine). Produces skill files that any engine can execute.

> See `docs/authoring/AUTHORING.md` for the full derivation method. See `docs/authoring/VOCABULARY.md` for the controlled vocabulary. See `docs/authoring/WHY.md` for the decision filter.

---

## Core Concepts

### The Derivation Chain

```
KNOWN GOOD / TRUTH  →therefore→  ETHOS  →therefore→  DOCTRINE
```

Each link is a derivation, not an assertion. Ethos is derived from established truths. Doctrine is the natural action of an agent that holds the ethos.

- **1-2 "therefores" max** in each direction. Over-derivation is a defect, not thoroughness.
- If a doctrine article needs 3+ links back to a known good, either a missing ethos article would shorten the chain, or the doctrine is over-specified.
- Known goods are **identified** (curated from the domain), not **invented**. The author's job is curation.

### Three Pillars (locked, immutable)

1. **Truth** -- domain-specific known goods. Required. Even a simple agent needs at least 2 sentences of grounding.
2. **Ethos** -- who the agent is, what it believes, how it thinks. The pillar of *being*. Stable across workflow changes.
3. **Doctrine** -- what the agent does, how it delegates, what it produces. The pillar of *doing*. Evolves as workflows change.

Rewrite every doctrine article -- if the ethos is solid, the agent's judgment holds.

### Ethos vs Rules

Rules (NEVER/ALWAYS) are *nomos* (external law), not *ethos* (internal character). A constitutionally charged agent derives constraints from conviction. If you need a NEVER directive, the ethos isn't deep enough. (Aristotle, *Nicomachean Ethics* II.4, 1105a28-33 -- acting *from* virtue vs acting *in accordance with* virtue.)

### Verbatim Propagation

Orchestrators pass ethos to sub-agents **byte-identical**. No paraphrasing, no normalization, no summarizing. Paraphrasing introduces drift. Exact transmission eliminates it.

---

## Archetype Structure

```
authoring/archetypes/<team>/<name>/
  archetype.yaml        # Manifest: assembly order, shared refs, output targets, metadata
  truth/                # At least 1 article required
    [flexible articles]
  ethos/                # At least 1 article required
    [flexible articles]
  doctrine/             # At least 1 article required
    [flexible articles]
  references/           # Optional: supporting material deployed alongside skill file
```

### Manifest (`archetype.yaml`)

Declares assembly order and metadata. Example:

```yaml
name: test-designer
description: >
  Design test specifications from API contracts.
model: opus
ensemble: development

truth:
  - verification.md

ethos:
  - identity.md
  - tenets.md
  - principles.md

doctrine:
  - process.md
  - orchestration.md
  - pipeline.md
  - output-contract.md

references:
  - template.md

output:
  - target: claude-code
    path: ~/.claude/skills/test-designer/SKILL.md
```

### Shared Articles (`_shared/`)

Articles shared across multiple archetypes in the same team. Organized under pillar subdirectories.

```
authoring/archetypes/<team>/
  _shared/
    ethos/
      silence-is-failure.md
      truth-over-completion.md
    doctrine/
      commit-discipline.md
```

Archetypes reference shared articles with a `_shared/` prefix in their manifest:

```yaml
ethos:
  - identity.md
  - _shared/silence-is-failure.md    # Resolves to ../_shared/ethos/silence-is-failure.md
```

Change a shared article once, all referencing archetypes get the update on next assembly.

### Suggested Article Patterns

Not mandatory. Observed patterns that may become standard as more archetypes are authored.

| Pillar | Suggested Articles | What They Cover |
|---|---|---|
| Truth | Domain-specific | The known goods that ground this agent's existence |
| Ethos | Identity, Tenets, Principles | Ontology (what it is), axiology (what it values), epistemology (how it thinks) |
| Doctrine | Process, Orchestration, Pipeline, Output Contract | What it does, how it delegates, where it connects, what it produces |

### Depth Limit

1 level below each pillar directory. No nesting within `truth/`, `ethos/`, or `doctrine/`.

---

## Assembly Tooling (`authoring/lib/assemble.py`)

Reads `archetype.yaml`, composes articles in pillar order (truth → ethos → doctrine), and produces a host-adapted SKILL.md for Claude Code. Every deploy is git-wrapped for rollback safety.

### Commands

```bash
# Preview assembled output (no file writes)
python authoring/lib/assemble.py authoring/archetypes/development/test-designer --dry-run

# Assemble to a specific output directory
python authoring/lib/assemble.py authoring/archetypes/development/test-designer -o output/

# Assemble all archetypes in a team
python authoring/lib/assemble.py --all authoring/archetypes/development/

# Deploy: assemble, diff, approve, write to target, git commit
python authoring/lib/assemble.py --push authoring/archetypes/development/test-designer

# Deploy all, skip interactive approval
python authoring/lib/assemble.py --push --force --all authoring/archetypes/development/
```

### What `--push` Does

1. Assembles the archetype into a SKILL.md string
2. Shows a diff against the currently deployed file
3. Prompts for approval (unless `--force`)
4. Commits the current deployed state as a pre-deploy snapshot (rollback point)
5. Writes the new SKILL.md and copies `references/` if present
6. Commits the new state as a deploy commit

### Dependencies

`pyyaml` only. No other third-party packages.

---

## Current Archetypes

| Archetype | Team | Role |
|---|---|---|
| `api-designer` | development | Design module boundaries and API contracts from section spec and research. |
| `test-designer` | development | Design test specifications from API contracts. Scope-bounded by API surface. |
| `test-implementer` | development | Write executable test code from test specs. TDD red phase only. |
| `implement-plan` | development | Execute approved plan phases. Make existing tests pass. Propagate issues upward. |

---

## Authoring Guidance

When creating a new archetype:

1. **Start with truth.** What domain facts ground this agent? If you cannot identify known goods, the archetype has no basis for existing.
2. **Derive ethos from truth.** What must this agent believe, given what is true? The derivation should be 1-2 "therefores."
3. **Derive doctrine from ethos.** What does this agent naturally do, given what it believes? Process, orchestration, pipeline position, output contract.
4. **Test the derivation.** Can someone trace each doctrine article back to a known good in one mental step? If not, compress.
5. **Assemble and validate.** Run `--dry-run` to preview. Run `--push` to deploy with diff review.

See `docs/authoring/AUTHORING.md` for the full grounding of why this method works.
