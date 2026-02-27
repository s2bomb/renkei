# Framework Coherence Review -- Decomposition System + implement-plan Archetype

**Verdict**: The decomposition system is structurally sound and follows Renkei's principles with unusual discipline, but it contains one grounding weakness (the Codd analogy is load-bearing decoration), one vocabulary violation, one questionable truth article, and a placement problem that contradicts the repo's own decision tree.

---

## 1. WHY.md Decision Filter (6 grounds for rejection)

### 1.1 "Derive, don't invent" -- PASS

The system derives its process from Codd's normalization and Fowler's refactoring principle. The produced archetype's therefore-chains are explicit and traceable. The workbench artifacts document every derivation step.

### 1.2 "Renkei decomposes and assembles. It does not execute." -- PASS

The decomposition system produces archetype definitions. It does not execute them. The Phase 5 verify step uses `assemble.py --dry-run` to confirm the output can be assembled -- it stays within Renkei's scope.

### 1.3 "Ethos and doctrine are separate concerns" -- PASS

The tagging vocabulary explicitly separates ETHOS:TENET from DOCTRINE:PROCESS. The audit phase forces this separation line-by-line. The produced archetype maintains clean pillar separation. The "If you can change it and the agent's judgment stays the same, it's doctrine" test from `docs/things/agent-archetype/ETHOS.md` is cited and applied.

### 1.4 "The derivation chain has a depth limit" -- PASS

Every therefore-chain in 02-derive.md is exactly 2 links. The verification in 04-enrich.md confirms each doctrine element traces to a known good in one mental step. The system respects the boundary.

### 1.5 "Known goods are identified, not created" -- MOSTLY PASS (see Section 4)

Beck, Fowler, Martin, and systems engineering are all citeable. But see Section 4 for whether Truth #2 is really a "known good" or a derived observation.

### 1.6 "No rules. Ethos." -- PASS

The system has an explicit "Rules become convictions" convention. The RULE tag's destination is "ethos/ (absorbed)." The audit identifies RULE content and the restructure phase absorbs it into tenets. No NEVER/ALWAYS directives survive into the archetype's ethos articles -- the "NEVER assume" phrasing appears only in the verbatim propagation block (doctrine), which is appropriate since it's operational text delegated to clones.

---

## 2. Controlled Vocabulary

### 2.1 Correct usage

The system uses "archetype," "pillar," "article," "ensemble," "harness," "assembly," "skill file," "manifest," "known good," "derivation," and "therefore-chain" correctly throughout. The tag vocabulary maps to article types from VOCABULARY.md.

### 2.2 Violation: "component" in ETHOS.md reference

The `docs/things/agent-archetype/ETHOS.md` file uses the heading "## The Components" (line 18). "Component" is a deprecated term per VOCABULARY.md -- the preferred term is "article." This is not the decomposition system's fault (the reference document predates the vocabulary), but the decomposition AGENTS.md cites this document without noting the terminology conflict. A minor issue, but the system claims to operate within the controlled vocabulary while referencing a document that violates it.

### 2.3 Borderline: "workbench"

"Workbench" is not defined in VOCABULARY.md. The system introduces it as a local concept (`workbench/` directory for per-agent decomposition workspace). Per VOCABULARY.md rules: "When a document needs a term not listed here, add it here before using it." This was not done. Whether "workbench" rises to the level of a vocabulary term is debatable -- it's a directory name, not a framework concept -- but the system treats it as a concept ("The workbench documents the reasoning trail") which suggests it should be registered.

---

## 3. The Codd Analogy

The decomposition AGENTS.md grounds its process in Codd's database normalization (1970). The analogy maps:

- Flat skill file = denormalized table
- Derivation chain = functional dependency
- Three pillars = normal forms
- Assembly = join
- Enrichment = discovering implicit constraints

### Strength

The analogy is structurally precise. Normalization decomposes along functional dependencies into forms that eliminate anomalies. The derivation chain (truth -> ethos -> doctrine) is a dependency structure. Redundancy in the source (same conviction stated 4 times) is literally an update anomaly. Assembly does reconstruct the output. This is not a metaphor -- it maps at the structural level.

### Weakness: Load-bearing decoration

The analogy is stated in the "Grounding" section but never used operationally. No phase references it. No decision appeals to it. The tag vocabulary doesn't derive from it. The process would be identical without it. A grounding that does no work in the system it grounds is decoration.

Compare with how AUTHORING.md uses its grounding: Aristotle's virtue ethics directly generates the conviction-over-instruction principle. Euclid's postulates directly justify the shared-root coherence claim. The grounding does work -- it produces the method.

Codd's normalization is invoked and then abandoned. The 5-phase process is not derived from normal forms. Phase 1 (audit/tag) is not "identify functional dependencies." Phase 3 (restructure) is not "decompose to BCNF." The analogy explains what the process achieves but not how or why the specific phases are what they are.

If this analogy were doing real work, you'd expect: "Phase 1 identifies the functional dependencies (which convictions determine which behaviors), therefore Phase 2 decomposes along those dependencies..." Instead, the phases are justified by Fowler's refactoring principle ("understand before restructuring, preserve behavior, verify after each step") which is a separate, weaker grounding.

**Assessment**: The Codd analogy is genuine (not surface-level) but inert. It explains the nature of the transformation without generating the process. The process is actually grounded in Fowler's refactoring + Renkei's own derivation method, and would be more honest if it said so.

---

## 4. The Produced Archetype's Derivation Chains

### 4.1 Truth #1: Green phase satisfies proof obligations (Beck)

Valid known good. Citeable, established, inarguable within TDD. The therefore-chain to "tests are the truth standard" is clean and direct.

### 4.2 Truth #2: Unreviewed execution-layer changes bypass the verification chain

This is the weakest truth. It is not cited to a specific source. The document says "established in systems engineering (configuration management)" and "military doctrine" but names no author, no publication, no specific principle. Compare with the other truths: Beck (TDD, 2003), Fowler (CI, 2006), Martin (Clean Code, 2008) -- all have named, citeable sources.

"Configuration management requires change control for baselined artifacts" is a real principle, but as stated here it reads as a derived observation rather than an axiomatic known good. It is closer to an ethos tenet ("I believe unreviewed changes are dangerous") than to a truth ("it is an established fact that..."). The military doctrine reference is vague -- which doctrine? What publication?

The known good criterion from VOCABULARY.md: "An established, citeable, inarguable fact within a domain." This truth is arguable (some agile practitioners would contest that implementers should never touch tests) and imprecisely cited.

**Recommendation**: Either find the actual citation (e.g., MIL-STD-973 for configuration management, or a specific systems engineering reference like INCOSE SE Handbook on baseline integrity) or acknowledge that this is derived from the combination of Truths #1 and #3 and compress the chain. "Unreviewed changes bypass verification" follows from "tests are the truth standard" + "code is a communication artifact" -- if tests define correctness and code communicates, then ad-hoc changes that bypass the test layer are communication failures. This would reduce the truth count to 3 and make the derivation tighter.

### 4.3 Truth #3: Incremental validated integration localizes failure (Fowler)

Valid known good. The 02-derive.md document explicitly deliberates whether this should be standalone or derived from Truth #1. The decision to keep it standalone is well-reasoned: it grounds a distinct behavior (commit-per-phase discipline) that Truth #1 alone doesn't generate.

However, the derivation document says "three truths is the right count here -- same as both existing archetypes" and then produces four. The open question was whether to add this as a fourth; the decision says "keep as standalone truth" which makes it the third. But Truth #2 (unreviewed changes) is also present, making the actual count four. The document's own accounting is inconsistent.

### 4.4 Truth #4: Code is a communication artifact (Martin)

Valid known good. The extension to "silent errors are communication failures" is a tight derivation within the truth article itself, which is appropriate -- it's drawing out an implication, not adding a link.

### 4.5 Overall chain quality

The therefore-chains are well-constructed. Each is 2 links. Each is traceable in one mental step. The 04-enrich.md quality test confirms this. The chains are the best part of the produced archetype.

---

## 5. Is 4 Known Goods One Too Many?

The derivation document (02-derive.md) explicitly debates this and decides on 3, but the actual truth article contains 4. The existing archetypes (test-designer, test-implementer) each have exactly 3.

The question is whether 4 is a problem. AUTHORING.md does not specify a maximum number of known goods. The derivation boundary constrains chain depth (1-2 therefores), not breadth (number of truths). Three is an observed pattern, not a rule.

However, the pattern holds for a reason: each truth must ground at least one tenet (per the verification in Phase 4), and an archetype with too many truths risks becoming a philosophy seminar rather than a character definition. Four truths generating four tenets is not excessive. The concern is whether Truth #2 earns its place as an independent known good (see Section 4.2 above).

**Assessment**: 4 known goods is not inherently problematic. The issue is that Truth #2 is the weakest -- if it were compressed or properly cited, the count would be either 3 (consistent with existing archetypes) or a well-justified 4.

---

## 6. Principles the System Violates or Ignores

### 6.1 Placement violation: `lib/decompose/AGENTS.md` should not exist

The repo's decision tree (AGENTS.md, "Where Things Live") says:

- **Lib**: "Python tooling. No archetype content. Independently testable. Operates on archetypes but is not one."
- **Root**: "Repo metadata only. `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore`."

`lib/decompose/AGENTS.md` is a process definition document -- it defines how decomposition works. It is not Python code. Walking the decision tree:

```
Is it Python code?
  No (it's markdown)
    Is this a stable, synthesized reference?
      Debatable. It's a method document. It's closer to AUTHORING.md than to a working draft.
    Is this working material?
      No -- it defines a stable process, not an idea or draft.
```

The document is a method definition, analogous to `docs/framework/AUTHORING.md`. It should live in `docs/framework/` (as something like `DECOMPOSITION.md`) or, if it's considered still evolving, in `thoughts/specs/`.

Placing it in `lib/` violates the rule: "No archetype content" and the broader principle that lib contains Python tooling. The AGENTS.md filename specifically is reserved for repo root metadata. Having a second `AGENTS.md` inside `lib/decompose/` creates naming confusion.

The workbench directory (`lib/decompose/workbench/`) is working material, which the decision tree says belongs in `thoughts/`. It is historical record of reasoning during decomposition -- that is exactly what `thoughts/` is for.

**This is the most significant structural violation.** The decomposition system is well-designed but lives in the wrong place.

### 6.2 The system does not apply its own framework to itself

Renkei's meta-claim (AUTHORING.md, "The Meta-Claim") is that the truth -> ethos -> doctrine structure is itself a known good. The decomposition system defines a 5-phase process but does not derive that process from truths through conviction. It asserts the phases.

This is not necessarily wrong -- not everything in the repo needs to be an archetype. But the system defines itself as a "living system" with conventions like "the source is respected" and "rules become convictions." These read like tenets, not process documentation. The document is halfway to being an archetype and doesn't seem to realize it.

If the decomposition system were subjected to its own decomposition process, several sections would be tagged ETHOS:TENET ("the source is respected," "environmental content is not constitutional," "rules become convictions," "redundancy resolves to ethos"). This is not a fatal problem, but it is ironic: a system for surfacing implicit structure has implicit structure of its own.

### 6.3 "One file = one concept" applied inconsistently

The decomposition AGENTS.md contains: grounding, process definition (5 phases), tag vocabulary, filesystem layout, and conventions. These are at least 3 distinct concepts. The repo's own file organization doctrine says "one file = one concept" and the split trigger is "distinct concepts -- two ideas a person thinks about separately."

The tag vocabulary is a concept you think about separately from the 5-phase process. The conventions ("the source is respected," "rules become convictions") are a concept you think about separately from the filesystem layout. This file owns too much, by Renkei's own standard.

### 6.4 No decision record

`docs/personal-notes/decisions.md` is described as "the authoritative record" for all decisions with grounding and references. The decomposition system introduces several decisions:

- The Codd analogy as grounding
- The 5-phase sequential structure
- The tag vocabulary and its categories
- The workbench concept
- The "one agent at a time" convention

None of these are recorded in decisions.md. This is a process gap, not a content problem, but the repo's own conventions require it.

---

## 7. Strengths

### 7.1 The audit phase is genuinely valuable

Phase 1 (audit) forces line-by-line understanding before any restructuring. This is the most Renkei-coherent part of the system. It embodies "listen" (when the code resists or the document fights you, stop and reorganize) and "the source is respected." The audit is what makes the decomposition lossless rather than lossy.

### 7.2 The produced archetype is high quality

The implement-plan archetype is well-constructed. The identity article is clear and specific. The anti-identity is sharp. The tenets read as convictions, not instructions. The principles are epistemological, not operational. The doctrine articles are concrete and actionable. The pipeline and output-contract articles fill genuine gaps in the original.

### 7.3 The workbench audit trail is thorough

The 5-phase documentation creates a complete reasoning trail. Every decision is visible. Every drop is justified. Every deduplication is noted. This is the kind of audit trail the framework values -- "the therefore-chain is the audit trail."

### 7.4 Environmental content handling is precise

The distinction between constitutional and environmental content is well-drawn. Tool references are dropped with explicit justification. The principle "A craftsman's identity doesn't change when he acquires a new saw" is well-phrased and grounded.

---

## 8. Recommendations

1. **Move the process definition** from `lib/decompose/AGENTS.md` to `docs/framework/DECOMPOSITION.md` (or `thoughts/specs/` if it's still evolving). Move the workbench to `thoughts/decomposition/` or similar. The current placement violates the decision tree.

2. **Strengthen or compress Truth #2.** Either cite a specific source (MIL-STD-973, INCOSE SE Handbook, or similar) or derive it from Truths #1 and #3, reducing the count to 3. The current state is an uncited assertion presented as a known good.

3. **Make the Codd analogy operational or demote it.** Either show how the analogy generates the phases (not just explains the goal), or acknowledge it as an explanatory metaphor rather than a grounding. Currently it claims to be a known good but does no work in the system.

4. **Register "workbench" in VOCABULARY.md** if it's a framework concept, or stop treating it as one.

5. **Record the decomposition system's decisions** in `docs/personal-notes/decisions.md`.

6. **Split the AGENTS.md** into at least: process definition, tag vocabulary, and conventions. Or accept the violation and document why one file is appropriate here.
