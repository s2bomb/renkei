# Decompose

Convert existing agent definitions (skill files, system prompts, sub-agent configs) into Renkei archetypes. The conversion is lossless and enriching -- every behavioral element from the source is preserved, and the derivation chain surfaces truths that were always implicit.

## Analogy

The closest structural analogy to this process is **Codd's database normalization** (1970). A flat, denormalized table contains all the data but its structure is implicit. Normalization decomposes along functional dependencies into normal forms. The decomposition is lossless -- the original can be reconstructed through joins. Enrichment is the analogue of discovering implicit constraints the flat structure hid.

A flat skill file is a denormalized table: truths, convictions, methods, and operational steps are interleaved. The derivation chain (truth -> ethos -> doctrine) is the functional dependency. The three pillars are the normal forms. Assembly is the join.

The process itself is grounded in Fowler's refactoring principle: understand before restructuring, preserve behavior, verify after each step. And in the Renkei derivation method (`docs/authoring/AUTHORING.md`): truth -> therefore -> ethos -> therefore -> doctrine.

---

## Prerequisites

Before starting a decomposition, the operator must have:

1. **The source file.** The currently deployed skill file. For skills with an existing `archetype.yaml`, the deploy path is in `output[].path`. For fresh decompositions, the source is the SKILL.md in the harness's skill directory (e.g., `~/.claude/skills/<name>/SKILL.md`).

2. **Framework context.** Read before starting Phase 2:
   - `docs/authoring/AUTHORING.md` -- the derivation method, what counts as a known good, the derivation boundary
   - `docs/authoring/VOCABULARY.md` -- controlled vocabulary, especially "Known Good" and "Tenet" definitions
   - `docs/authoring/WHY.md` -- the decision filter (6 grounds for rejection)

3. **Reference archetypes.** Read 1-2 existing archetypes as calibration:
   - `archetypes/development/test-designer/` -- strong truth article, clean derivation chains
   - `archetypes/development/test-implementer/` -- good example of a non-orchestrator archetype
   - Study: truth density, tenet voice, article structure, anti-identity

4. **Awareness of `_shared/`.** The `archetypes/<ensemble>/_shared/` directory holds articles shared across multiple archetypes. During Phase 4, shared convictions are noted as candidates.

---

## The Process

Six phases. Each has a defined input, output, and verification step. Phases are sequential -- each depends on the previous.

### Phase 1: AUDIT

**Input**: The source agent definition.

**Action**: Read the source line by line. Tag every section, paragraph, or sentence with what it actually IS. Use the tag vocabulary below. Produce a structured inventory.

**Output**: An annotated inventory in `workbench/<agent-name>/01-audit.md`.

**Verification**: Every line of the source is accounted for. No content is untagged.

#### Tag Vocabulary

Tags correspond to archetype article types plus categories for content that needs transformation.

| Tag | Meaning | Destination |
|---|---|---|
| `METADATA` | Frontmatter fields (name, description, model) | archetype.yaml |
| `TRUTH` | Domain fact, whether stated or implicit | truth/ article |
| `ETHOS:IDENTITY` | Who the agent is, relationship to others, anti-identity | ethos/identity.md |
| `ETHOS:TENET` | Conviction about the domain (belief, not instruction) | ethos/tenets.md |
| `ETHOS:PRINCIPLE` | How the agent works (epistemological commitment) | ethos/principles.md |
| `DOCTRINE:PROCESS` | Operational steps, sequences, conditional logic | doctrine/process.md |
| `DOCTRINE:ORCHESTRATION` | Clone delegation, verbatim blocks, parallel/sequential | doctrine/orchestration.md |
| `DOCTRINE:PIPELINE` | Position in ensemble, inputs, outputs, neighbors | doctrine/pipeline.md |
| `DOCTRINE:OUTPUT` | Artifact type, path conventions, completion criteria | doctrine/output-contract.md |
| `RULE` | NEVER/ALWAYS directive -- must be absorbed into ethos or justified | ethos/ (absorbed) |
| `ENVIRONMENTAL` | Tool references, MCP guidance, harness-specific config | doctrine/process.md (if kept) |
| `REDUNDANT` | Content repeated elsewhere in the source | deduplicated in restructure |

#### Tagging Principles

- A single sentence can carry multiple tags. Note all of them.
- **TENET vs PRINCIPLE**: A tenet says "X is true" (axiology -- a value judgment). A principle says "work this way" (epistemology -- a method commitment). If it expresses what matters, it's a tenet. If it prescribes how to work, it's a principle.
- **TENET vs IDENTITY**: Identity declares what the agent *is and isn't* (ontology -- positioning). A tenet declares what the agent *believes* (axiology -- values). "I propagate problems upward" is identity. "Unreviewed changes bypass verification" is the tenet that makes the agent propagate.
- **ETHOS vs DOCTRINE**: The test from `docs/things/agent-archetype/ETHOS.md` -- "If you can change it and the agent's judgment stays the same, it's doctrine. If changing it would alter how the agent thinks, it's ethos."
- **ENVIRONMENTAL boundary**: Tool names are environmental. Behaviors are constitutional. "Use Logfire" is environmental. "Instrument proactively" is behavioral. When a sentence contains both, tag the behavior separately from the tool reference.
- RULE content is never simply moved. It is either absorbed into a deeper tenet/principle (preferred) or, if it resists absorption, documented as a finding for review.

#### Audit Entry Format

Each entry groups by source line range. Tag in bold. Example:

> **Lines 26-30 -- DX values**:
>
> "Developer Experience is a first-class value..."
>
> - DX as a value -> **ETHOS:TENET** (conviction about craftsmanship)
> - "instrument proactively, not after failures" -> **ETHOS:TENET** (proactive observability)
> - "in Logfire" -> **ENVIRONMENTAL** (tool reference)

### Phase 2: DERIVE

**Input**: The Phase 1 audit inventory.

**Action**: For each unique conviction (ETHOS:TENET, ETHOS:PRINCIPLE) found in Phase 1, trace backward to a domain truth. Some truths will be explicit in the source. Most will be implicit -- never stated but always assumed.

**Output**: Draft truth article(s) in `workbench/<agent-name>/02-derive.md`. Each truth includes: the known good, the citation, and the "therefore" link to the tenet(s) it grounds.

**Verification**: Every tenet traces to a truth through 1-2 "therefores." No truth is orphaned (each grounds at least one tenet). No tenet is ungrounded (each traces to at least one truth).

#### Method

1. **Cluster convictions.** Before searching for truths, group the deduplicated convictions from the audit that seem to share a common root. Convictions that cluster naturally often derive from the same known good.

2. **For each cluster, ask: "Why does the agent believe this?"** The answer is not a restatement of the conviction. It is a domain fact that makes the conviction true rather than arbitrary. Ask recursively: "And why is *that* true?" Stop when you reach something established -- a named result, a structural property, an empirical observation with a source.

3. **Name the source.** A known good has a specific author, work, and claim. Not "systems engineering says" but "Fowler (Continuous Integration, 2006) demonstrates that..." If you cannot name a person and a work, the candidate may not be a known good.

4. **Apply the negation test.** Negate the candidate truth. If the negation is absurd or empirically false, the candidate is likely a genuine known good. If the negation produces a legitimate alternative viewpoint held by credible practitioners, the candidate is a design choice, not a domain truth. Design choices can still ground tenets, but they should be acknowledged as such.

5. **Apply the independence test.** A known good is true regardless of whether this particular agent exists. Beck's TDD is true whether or not the implement-plan agent is defined. "DX is important" is an opinion; "code is read 10:1 over being written" is a fact. The known good exists in the domain, not in the agent.

6. **Write the therefore-chain.** For each truth, show the explicit derivation: TRUTH -> therefore -> TENET -> therefore -> DOCTRINE. Verify 1-2 links max in each direction.

**Density**: 2-3 known goods is typical. The test-designer has 3 (Popper, Aristotle, interface properties). The test-implementer has 3 (Beck, faithful translation, production artifacts).

**When stuck**: If a conviction resists grounding, either the conviction is arbitrary (reconsider it) or there is a domain truth you haven't identified yet. Use research tools -- search for the established literature in the agent's domain. The truths are already there. The author's job is curation, not creation.

### Phase 3: RESTRUCTURE

**Input**: Phase 1 audit + Phase 2 derivation.

**Action**: Map all audited content into the archetype file structure. Create the pillar directories and article files. Write the `archetype.yaml` manifest (use an existing manifest as a template for schema). Specific transformations:

- Audited METADATA -> `archetype.yaml` fields
- Audited TRUTH content -> `truth/` article
- Audited ETHOS:IDENTITY content -> `ethos/identity.md`
- Audited ETHOS:TENET content (deduplicated) -> `ethos/tenets.md`
- Audited ETHOS:PRINCIPLE content -> `ethos/principles.md`
- Audited DOCTRINE:* content -> corresponding `doctrine/` articles
- RULE content -> absorbed into tenets or principles (never carried over as rules)
- ENVIRONMENTAL content -> either moved to `doctrine/process.md` as operational guidance, or dropped if harness-specific and not constitutionally relevant
- REDUNDANT content -> deduplicated (stated once in ethos, derived in doctrine)

**Output**: Complete archetype directory under `archetypes/<ensemble>/<agent-name>/` with manifest and all article files.

**Verification**: Losslessness check. Walk the original source and confirm every behavioral element has a home in the archetype. Record the check as a mapping table in `workbench/<agent-name>/03-restructure.md`.

#### Losslessness Table

The mapping table uses these status values:

| Status | Meaning |
|---|---|
| **Preserved** | Content moved to archetype with minimal rewording |
| **Transformed** | Content restructured but behavior preserved |
| **Absorbed** | Content merged into a broader ethos article (e.g., rule -> tenet) |
| **Deduplicated** | Repeated content consolidated to single ethos statement |
| **DROPPED** | Content removed -- must include justification |

**The drop test**: If removing this content would cause the agent to make different judgments or follow different processes, it is constitutional and must be preserved. If not, it can be dropped with justification.

### Phase 4: ENRICH

**Input**: The restructured archetype from Phase 3.

**Action**: With the derivation chain now explicit, inspect for gaps:

- **Ungrounded convictions**: Tenets or principles with no truth backing them.
- **Orphaned truths**: Truths that don't derive any ethos.
- **Missing anti-identity**: Every archetype needs anti-identity.
- **Shared convictions**: Candidates for `_shared/`.
- **Implicit pipeline**: Formalize if the source had no explicit pipeline section.
- **Missing output contract**: Formalize if the source had no explicit output contract.
- **Verbatim block audit**: Does the verbatim propagation block contain exactly the convictions clones need -- nothing more, nothing less?
- **Tenet ordering**: Are tenets ordered by priority? Would swapping the order change behavior when tenets conflict?

**Output**: Updated archetype files with enrichments. Enrichment notes in `workbench/<agent-name>/04-enrich.md`.

**Verification**: The derivation chain is complete. Quality test: can someone trace any doctrine element back to a known good in one mental step?

### Phase 5: REVIEW (best-of-N)

**Input**: The enriched archetype from Phase 4.

**Action**: Delegate 3-4 review agents, each with a distinct adversarial perspective. Each agent saves its review to `workbench/<agent-name>/perspectives/<perspective-name>.md`. Synthesize the findings and apply fixes.

**Recommended perspectives**:

| Perspective | Focus |
|---|---|
| **Framework Coherence** | Does the archetype follow Renkei's own principles? WHY.md decision filter? Vocabulary? |
| **Losslessness Audit** | Was anything lost or distorted? Check every source line against the archetype. |
| **Truth Quality** | Are the known goods actually established, citeable, inarguable? Or assertions dressed as truths? |
| **System Usability** | Would a cold agent follow this process? What's missing from the instructions? |

**Output**: Perspective files in `workbench/<agent-name>/perspectives/`. Synthesis of findings applied to the archetype and (if applicable) to this system document.

**Verification**: All critical and moderate findings addressed. Remaining findings documented as deferred-with-reason.

**When to skip**: This phase can be skipped for simple agents (utility agents, sub-agents with minimal ethos) where the decomposition is straightforward. It should not be skipped for orchestrator archetypes or archetypes with complex truth articles.

### Phase 6: VERIFY

**Input**: The reviewed archetype from Phase 5.

**Action**: Assemble the archetype using `lib/assemble.py --dry-run`. Compare the assembled output against the original source skill file.

**Output**: Verification report in `workbench/<agent-name>/06-verify.md`. Contains:

- Assembly success/failure
- Diff summary: what changed structurally
- Behavioral equivalence assessment: does the assembled archetype preserve every behavior from the original?
- Enrichment summary: what the archetype adds that the original lacked
- Smoke test: for 3-5 representative prompts, would the assembled agent behave the same as the original?

**Verification**: The assembled archetype is behaviorally equivalent to or richer than the original.

---

## Filesystem

```
lib/decompose/
  AGENTS.md              # This file -- process definition
  workbench/             # Per-agent decomposition workspace
    <agent-name>/        # One directory per decomposition
      01-audit.md        # Phase 1: annotated inventory
      02-derive.md       # Phase 2: truth derivation
      03-restructure.md  # Phase 3: losslessness mapping
      04-enrich.md       # Phase 4: enrichment notes
      perspectives/      # Phase 5: review perspectives (one file per perspective)
      06-verify.md       # Phase 6: verification report
```

The workbench is the working area. The archetype output goes to `archetypes/<ensemble>/<agent-name>/`. The workbench documents the reasoning trail.

**Revisions**: If a later phase reveals a gap requiring earlier phase revision (e.g., Phase 5 review finds a weak truth), edit the earlier workbench file in place. Add a revision note at the top: `> Revised YYYY-MM-DD: [reason]`.

**Resuming**: To resume a decomposition across sessions, read all existing workbench files and the produced archetype (if any), then continue from the next incomplete phase.

---

## Conventions

### One agent at a time

Complete all phases for one agent before starting another. Each decomposition teaches something about the system. Incorporate lessons into this document before proceeding.

### The source is respected

The existing agent definition is a working artifact. It represents real usage and real decisions. The decomposition preserves it first, enriches it second. Do not discard content because it seems inelegant. Understand why it exists before deciding its fate.

### Environmental vs behavioral boundary

Tool references (MCPs, specific services, harness features) are environmental. Behaviors the agent performs are constitutional. The boundary is at the behavior, not the sentence. A sentence like "Use Logfire to instrument proactively" contains both: "Logfire" is environmental, "instrument proactively" is behavioral. Separate them. Drop the tool name. Preserve the behavior.

### Rules become convictions

NEVER/ALWAYS directives are not carried over as rules. Each rule is either:

1. **Absorbed**: The underlying conviction is stated as a tenet or principle. The rule becomes unnecessary because the conviction generates the same constraint.
2. **Justified**: If a rule genuinely cannot be expressed as a conviction (rare), it is documented as a finding.

### Redundancy resolves to ethos

When the same conviction appears multiple times in the source, it is stated once in the appropriate ethos article. Doctrine articles may reference the conviction by acting on it, but they do not restate it.

---

## System Evolution

This document is a living system. After each decomposition:

1. Record what worked and what didn't in the workbench verification report.
2. If the process needs adjustment, update this document with the change and its grounding.
3. If the tag vocabulary needs extension, add the tag with its meaning and destination.

The system improves through use, not through speculation.
