# Decisions

Decisions made through the initial framework exploration. Each decision traces to its grounding. This document is the authoritative record until these decisions are absorbed into their permanent homes (VOCABULARY.md, WHY.md, file system structure, etc.).

## The Derivation Method

**Decision**: Agent archetypes are built through a derivation chain, not through ad hoc authoring.

```
KNOWN GOOD / TRUTH
       |
    therefore
       |
     ETHOS  (conviction -- what the agent believes)
       |
    therefore
       |
   DOCTRINE  (action -- what the agent does)
```

**Grounding**: DERIVATION.md. The method itself is a known good, grounded in Aristotle's virtue ethics (character generates right action), the structure of durable cultural transmission systems (truth -> belief -> practice), Euclid (shared axioms produce coherent systems), and the empirical observation that LLMs respond to conviction-framing because the human corpus encodes conviction-action patterns.

**Derivation boundary**: 1-2 "therefores" in each direction. Upward: do not derive known goods (Aristotle's regress -- first principles are grasped by nous). Downward: do not over-derive doctrine (abstraction mania -- over-specifying doctrine signals insufficient trust in the ethos).

**Reference**: docs/DERIVATION.md

---

## Terminology

### Ensemble

**Decision**: A composed collection of agent archetypes working toward a shared goal is called an **ensemble**.

**Grounding**: The term honors both natures of agents simultaneously:
- Human-like: Musical ensembles have autonomous artistic judgment. Members interpret, push back, exercise conviction. Conductorless orchestras prove coordination without hierarchy through shared understanding.
- Computer-like: ML ensemble methods produce deterministic combined outputs from diverse inputs. Diversity is the mechanism (bias-variance-diversity trade-off).
- Connects to Renkei (連携): coordination where each element remains distinct yet moves in concert.

"Pipeline" becomes one possible *topology* within an ensemble, not the ensemble itself.

**Reference**: docs/research/01-grouping-term.md

### Article

**Decision**: The compositional pieces of an archetype are called **articles**.

**Grounding**: Latin *articulus* (small joint) -- a discrete, self-contained unit that articulates (joins) into a larger body. Precedent in Aquinas's Summa Theologiae (the atomic unit of theological analysis), the US Constitution (primary compositional units), and creedal tradition (twelve articles of faith).

**Reference**: docs/research/02-archetype-elements.md

### Term Consistency

**Decision**: Terms are **constant across all domains**. "Ensemble" means the same thing whether authoring archetypes in the GUI, writing code comments, or discussing architecture. Terms do not translate when crossing domain boundaries.

**Grounding**: The entire purpose of a controlled vocabulary is to prevent terminological drift. If terms translate across domains, you rebuild the problem the vocabulary was meant to solve.

---

## Archetype Structure

**Decision**: An archetype decomposes into articles organized under three required pillars: TRUTH, ETHOS, and DOCTRINE.

```
Archetype
  TRUTH             (pillar -- domain-specific known goods)
    [flexible articles]
  ETHOS             (pillar -- being, the agent's character)
    [flexible articles]
  DOCTRINE          (pillar -- doing, the agent's work)
    [flexible articles]
```

**Three pillars are locked**: TRUTH, ETHOS, DOCTRINE. Required, immutable top-level structure. The derivation chain flows through them: TRUTH -> therefore -> ETHOS -> therefore -> DOCTRINE.

**Articles within pillars are flexible**: Each pillar must contain at least one article. All articles within a pillar are appended together during assembly. The author decides what articles are needed based on the archetype's domain.

**Suggested article patterns** (keywords for authoring and auditing, not mandatory structure):

- Under ETHOS: Identity (ontology), Tenets (axiology), Principles (epistemology) -- or any articles that define who the agent is, what it believes, and how it thinks.
- Under DOCTRINE: Process, Orchestration, Pipeline, Output Contract -- or any articles that define what the agent does, how it delegates, where it connects, and what it produces.
- Under TRUTH: domain-specific known goods, however the author chooses to organize them.

Over time, consistent patterns may emerge that make certain articles standard under certain pillars. These patterns will be codified as they are observed, not prescribed in advance.

**Rules removed from Ethos**: Rules (NEVER/ALWAYS constraints) are *nomos* (external law), not *ethos* (internal character). Aristotle explicitly distinguishes acting from virtue (*hexis*) vs acting in accordance with law (*nomos*). If an agent's Identity, Tenets, and Principles are grounded deeply enough in TRUTH, the agent derives correct constraints from conviction. Rules are patches for missing ethos. A constitutionally charged agent does not need "NEVER steal" because its character will not allow it.

**Grounding**: The pillar structure maps to the derivation chain in DERIVATION.md. The flexibility of articles within pillars follows the derivation boundary principle -- do not over-specify structure that the author's judgment can handle.

**Reference**: docs/research/02-archetype-elements.md, docs/things/agent-archetype/

### TRUTH Article

**Decision**: TRUTH is a **separate, required article** that precedes ETHOS.

**Grounding**: Euclid (axioms precede propositions as a different kind of thing), Aristotle (archai are grasped by nous, not derived by demonstration -- they are a different kind of thing from what follows), Westminster Confession (epistemic foundation in Chapter I precedes all derived doctrine).

**Why TRUTH is not optional**: Every agent operates in a domain. Every domain has truths about how it works. If you cannot identify the known goods for an archetype, either:
1. The truths exist but you haven't found them yet -- a gap in understanding, not an absence of truth, or
2. There are genuinely no truths grounding the archetype, in which case the archetype has no basis for existing. It is arbitrary.

An archetype without TRUTH is an archetype without grounding. Its ethos becomes assertion rather than derivation. Its doctrine becomes instruction rather than consequence. The derivation chain (KNOWN GOOD -> ETHOS -> DOCTRINE) requires the first link to exist.

The derivation boundary still applies: a simple agent's TRUTH article may be 2 sentences. It does not need to be extensive. But it must exist so the author is forced to answer: *what truths ground this agent's existence?*

**Decision rationale**: During exploration, three tool-style agents (codebase-analyzer, codebase-locator, codebase-pattern-finder) were examined. All three implicitly serve a truth -- that inaccurate research compounds into errors in every downstream stage (hypothesis, design, implementation). Making this truth explicit would improve their judgment: they would be more careful about what they couldn't find, more honest about uncertainty, not because they were instructed to, but because they understood the stakes. The truth was always there. Making it explicit is the difference between an instructed agent and a constitutionally charged one.

### No PRIMITIVES/CAPABILITIES Article

**Decision**: Capabilities (tools, MCPs) are environmental, not constitutional. No separate article.

**Grounding**: Aristotle's dynamis (capacity) is given by nature, not part of hexis (character). Military DOTMLPF-P treats capabilities as emergent from doctrine+organization+training+materiel, not as a separate doctrinal element. A craftsman's identity doesn't change when he acquires a new saw.

**Where tool knowledge lives**: When a tool requires domain knowledge to wield effectively, that knowledge belongs in Doctrine articles -- typically Process ("When using tool X, do Y") or as a tenet/principle in Ethos if the knowledge shapes judgment. No separate article needed.

**Reference**: docs/research/02-archetype-elements.md

---

## File System Structure

**Decision**: Archetypes are organized by ensemble, with articles in separate files under the three pillar directories.

```
archetypes/
  <ensemble>/
    _shared/                  # Shared articles within this ensemble
      ethos/
        silence-is-failure.md
        truth-over-completion.md
        source-documents-ground-truth.md
      doctrine/
        ...
    <archetype>/
      archetype.yaml          # Manifest: assembly order, shared refs, output targets
      truth/
        [flexible articles]   # At least 1 required
      ethos/
        [flexible articles]   # At least 1 required
      doctrine/
        [flexible articles]   # At least 1 required
```

**Three pillar directories mirror the three pillars**: truth/, ethos/, doctrine/. The directory structure makes the derivation chain visible: truth/ -> ethos/ -> doctrine/.

**Articles within each pillar are flexible**: The author creates whatever .md files are needed. File names are descriptive of content (e.g., `identity.md`, `tenets.md`, `process.md`). No mandatory file names.

**Assembly**: All articles within truth/ are appended, then all within ethos/, then all within doctrine/, in manifest-declared order. The result is the full archetype prompt.

**_shared/ directory**: Contains articles shared across multiple archetypes in the same ensemble. Organized under the same pillar structure (ethos/, doctrine/). Each shared article is a complete, standalone file. Archetypes reference shared articles from their manifest. Change it once, all referencing archetypes get the update on next assembly.

**Depth limit**: 1 level below each pillar directory. No nesting within truth/, ethos/, or doctrine/.

**Grounding**: Ansible convention-based structure + DITA content/manifest separation. Liturgical proper/common pattern for shared elements.

**Reference**: docs/research/04-filesystem-assembly.md

---

## Assembly Mechanism

**Decision**: Include/compose with a two-phase output (compose -> host-adapt). Manifest-driven.

**Phase 1 (compose)**: Assembler reads archetype.yaml, resolves shared references, reads files in manifest order, produces intermediate `assembled.md` -- the canonical archetype document, human-readable, harness-independent.

**Phase 2 (host-adapt)**: Formats the composed document for the target harness (Claude Code SKILL.md, OpenCode config, etc.).

**Verbatim propagation**: Manifest declares which ethos articles to propagate verbatim. Assembler guarantees byte-identical copying. No transformation, no normalization.

**Grounding**: DITA map-driven topic composition, Knuth's TANGLE (pure textual concatenation), liturgical book compilation.

**Reference**: docs/research/04-filesystem-assembly.md

---

## Controlled Vocabulary

**Decision**: Create `docs/VOCABULARY.md` -- a flat controlled vocabulary, not a taxonomy or ontology.

**Grounding**: The current documents already have terminological drift ("pipeline" carries 3 distinct meanings, "component" has no stable referent). A controlled vocabulary (one preferred term per concept, one definition per term) solves this directly. A taxonomy is premature (concept set still developing). An ontology would be over-specification (the terminological equivalent of abstraction mania).

**Reference**: docs/research/03-taxonomy-coherence.md

---

## Project Mission

**Decision**: Codify in `WHY.md` at project root. Not a manifesto. Contains: WHY statement, reference to derivation chain, decision filter (React model), quality test.

Renkei exists to **define and audit agent archetypes from the most fundamental level, so that agents invoked with a prompt are constitutionally charged with conviction -- they do the right thing not because they're told, but because they are zealots for their beliefs.**

**Reference**: docs/research/05-roadmap-next-steps.md

---

## Harness Architecture: Composition Over Vanilla OpenCode

**Decision**: The harness is a pure composition layer over vanilla OpenCode. Zero fork. OpenCode is treated as an upstream dependency with no modifications.

**Date**: 2026-02-19

**Grounding**:
- The `openteams` branch (40+ commits, 2026-02-14 to 2026-02-18) prototyped team primitives directly inside OpenCode before Renkei existed as a separate repo. The M1/M2 research incorrectly derived "fork boundaries" by diffing the `openteams` branch against upstream (`git diff upstream/dev..openteams`), which described existing fork work rather than analyzing composition limitations. The fork was the evidence for needing a fork -- circular reasoning.
- The fork threshold table contained `diffPreview` fields that were literal excerpts from the `openteams` branch diff.
- Complexity compounds. Maintaining a fork creates an ongoing merge tax against upstream. Every upstream release becomes a conflict resolution exercise. This cost compounds with every feature added to either side.
- Composition preserves the option to propose upstream extension points if composition seams prove insufficient, without the sunk cost of fork maintenance.

**What this means**:
- OpenCode is a dependency, not a sibling on disk.
- If a composition seam is insufficient for future needs (e.g., teams), the approach is to propose an OpenCode extension point upstream, not maintain fork patches.
- The `openteams` branch is preserved as historical prototype work. It will be brought back as composition-layer work when the harness is stable and teams become active scope.
- Teams primitive is future scope, not current M1 scope.

**What was removed**: 6 runtime modules (fork-threshold, async-lifecycle, provenance, teammate-session, mode-selector, integration-depth-policy), 6 test files, all fork/teammate/provenance types from the type system. 29 unit tests remain (down from 49), all passing. Typecheck and lint clean.

---

## Stage Ownership Semantics

**Decision**: Stage-leader invocation implies immediate stage execution. There is no conversational waiting state.

When a leader delegates to a downstream stage leader, the downstream leader either:

1. runs immediately to stage outcome, or
2. returns `blocked` with explicit blocker ownership.

It does not return intake-status chat as a completion condition.

**Grounding**:
- Renkei system truth: agents behave more like stateless, non-deterministic functions than humans-in-chat; invocation is execution context, not optional invitation.
- Observed runtime failures (item-004/item-005 flows): receipt/plan return contracts produced handoff-only loops, stage-ownership leaks, and direct downstream delegation by the wrong leader.
- One-stage-owner principle from team topology: parent leader hands off ownership; downstream leader owns the stage until terminal outcome or blocked escalation.

**Operational consequences**:
- Parent-to-child contracts are terminal (`ready-for-execution` or `blocked`), not receipt-style.
- `shaper` does not directly delegate execution for active items once `tech-lead` handoff is issued (except explicit decision-owner override).
- `tech-lead` does not bypass member artifact ownership in normal operation.

**Reference**:
- `framework/archetypes/product/shaper/doctrine/orchestration.md`
- `framework/archetypes/technical-preparation/tech-lead/doctrine/process.md`
- `framework/archetypes/execution/execution-lead/doctrine/process.md`

### Leader Event-Ledger Duty

**Decision**: Team leaders append project and item ledger events for stage actions as part of their output contract.

Required stage actions to log:
- intake received
- handoff issued / transfer result
- stage outcome (`complete`/`blocked`/`escalated`)
- escalation records (with blocker ownership)

**Grounding**:
- State authority in this system is path + append-only events.
- Missing ledger writes make stage transitions non-auditable and break maintenance handoff.

**Reference**:
- `framework/archetypes/technical-preparation/tech-lead/doctrine/output-contract.md`
- `framework/archetypes/execution/execution-lead/doctrine/output-contract.md`

---

## Critical Path

Strict dependency order:

1. **Synthesize into VOCABULARY.md** -- controlled vocabulary from research papers
2. **Write WHY.md** -- project mission and decision filter
3. **Define file system structure** -- create the directory layout
4. **Decompose test-writer** -- proof of concept (hardest case first, per Popper)
5. **Write assembly script** -- reads manifest, composes articles, produces output
6. **Round-trip validation** -- diff assembled vs original SKILL.md
7. **Iterate taxonomy** -- based on round-trip findings
8. **Decompose all archetypes** -- ~16 skills + ~14 sub-agents
9. **Build GUI** -- authoring environment over validated component model
10. **Build conversion tools** -- import/export

Steps 1-3 are the immediate next work. Step 4 is the critical validation.

**Reference**: docs/research/05-roadmap-next-steps.md
