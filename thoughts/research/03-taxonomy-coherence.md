# Taxonomy and Terminological Coherence

Does Renkei need a taxonomy document before building out archetypes? If so, what form should it take, when should it be created, and how should it relate to the derivation method?

## The Question

As Renkei grows from concept documents to concrete archetype files, terms proliferate. "Pipeline" vs "workflow" vs "process." "Element" vs "component" vs "facet." "Known good" vs "truth" vs "axiom." Without a controlled vocabulary, documentation becomes incoherent -- the same concept gets different names in different places, or different concepts share a name.

The question is whether a taxonomy is needed now, and whether the answer can be grounded in known goods rather than preference.

## Finding 1: Yes, a Controlled Vocabulary Is Needed Now

This is not a matter of timing preference. It is a structural consequence of the project's current state.

### The Known Good: Semantic Drift Is Cumulative and Compounds

Semantic drift -- the gradual erosion of shared meaning across documents -- does not announce itself. It accumulates through small, locally rational variations. Each author uses a slightly different term for the same concept, or the same term for a slightly different concept, and the divergence compounds silently. By the time it becomes visible, remediation is significantly more expensive than prevention would have been.

This is established across multiple domains:

- **ISO standards development** formalizes vocabulary at the scope-definition stage, before technical committee drafts are developed. The Harmonised Structure (HLS) framework was created specifically because multiple ISO standards developed concurrent terminology without coordination, producing interoperability failures (ISO Harmonised Structure, Annex SL).

- **US military doctrine** maintains ADRP 1-02 (now ATP 1-02.1) as the authoritative terminology source for all Army publications. Definitions in ADRP 1-02 take precedence over definitions in subordinate publications. New terms are formally reviewed against existing DoD Dictionary entries before introduction (Chairman of the Joint Chiefs of Staff, DoD Terminology Program).

- **Legal codes** include dedicated definitions sections in initial statute sections, establishing precise term meaning before substantive provisions. Courts apply the "presumption of consistent usage" -- a term bears the same meaning throughout a statute unless the legislature explicitly signals departure (Georgetown Law, *A Guide to Reading, Interpreting and Applying Statutes*).

- **Software requirements engineering** establishes that ambiguous or undefined terminology during the requirements phase creates downstream interpretation problems that multiply through design, development, and testing. Correction costs increase the later ambiguity is discovered (Wiegers, *Software Requirements*; IEEE 830).

### The Evidence in Renkei's Own Documents

The current six documents already show terminological variation that, if left unaddressed, will compound as the project grows:

**"Pipeline" carries two distinct meanings.** In DOCTRINE.md, "Pipeline Position" refers to an archetype's slot in a flow (a property of an individual agent). In vision.md, "Pipeline" is defined as "a graph of stages backed by agent archetypes, with typed artifacts and quality gates at transitions" (a system-level concept). In chaos-to-order.md, "the pipeline" refers to the specific development pipeline (spec through validation). These are three different things sharing one name.

**"Process" and "workflow" overlap.** "Process" is a defined doctrine component (ordered steps from input to output). "Workflow" appears in the archetype tree diagram as a parenthetical gloss for Process -- `Process (steps, workflow)` -- suggesting equivalence. But "workflow" also appears independently: "stable across workflow changes," "a perfectly structured workflow with no ethos." In these uses, "workflow" means the entire operational setup, not the process steps alone.

**"Component" is overloaded.** Vision.md refers to "decomposable components" and "the component model." ETHOS.md and DOCTRINE.md describe Identity, Tenets, Principles, Rules, Process, Orchestration, Pipeline, and Output Contract. Are these "components"? Or are Ethos and Doctrine the components, with Identity, Tenets, etc. being sub-components? Or something else entirely? The documents use "components" without a stable definition of what structural level it refers to.

**"Known good," "truth," and "axiom" are used near-synonymously.** DERIVATION.md uses "known good" as its primary term, with "truth" appearing in the derivation chain diagram (`KNOWN GOOD / TRUTH`). But the slash suggests equivalence that may not hold. "Known good" implies an empirically verified claim. "Truth" implies correspondence to reality. "Axiom" (used once: "The known goods are the axioms") implies a formal starting point accepted without proof. These are epistemologically distinct categories collapsed into apparent synonyms. DERIVATION.md partially addresses this -- known goods "are accepted because they are evident, proven, or empirically established" -- but the term "truth" still floats freely across documents without this precision.

These are not hypothetical risks. They exist in the current document set. Each additional document written without resolving them deepens the inconsistency.

### The Timing Argument

Information architecture research identifies an optimal formalization window: after sufficient understanding is mature but before implementation decisions lock in (ANSI/NISO Z39.19; Hedden, *The Accidental Taxonomist*). Renkei is at exactly this point. The conceptual model is articulated. The structural decomposition (Archetype -> Ethos/Doctrine -> sub-elements) is established. But the project has not yet generated many concrete archetype files that would need retroactive correction.

Formalizing now is neither premature nor late. It is the window.

## Finding 2: The Right Form Is a Controlled Vocabulary, Not a Taxonomy or Ontology

The research distinguishes four levels of terminological formalization, each building on the previous (ANSI/NISO Z39.19-2005; Talisman, "A Practitioner's Guide to Taxonomies"):

1. **Controlled vocabulary** -- A flat list of defined terms with preferred forms and noted synonyms. Resolves ambiguity. Establishes what each word means in this project.

2. **Taxonomy** -- A hierarchical classification organizing terms into parent-child relationships. Establishes *is-a* and *part-of* structure.

3. **Thesaurus** -- Adds associative relationships (related terms, broader/narrower terms) and formal synonym management.

4. **Ontology** -- Defines concepts, properties, relationships, constraints, and axioms in machine-readable form. Supports automated reasoning.

Renkei needs level 1 now. Levels 2-4 are premature.

### Why a Controlled Vocabulary Is Sufficient

The current problem is ambiguity and inconsistency -- terms meaning different things in different places, or different terms meaning the same thing. A controlled vocabulary solves this directly by establishing one preferred term per concept and one definition per term.

The project's structural hierarchy (Archetype -> Ethos/Doctrine -> sub-elements) already provides implicit taxonomic structure. It does not need to be restated in a separate taxonomy document. The archetype decomposition *is* the taxonomy. What is missing is not the hierarchy but the vocabulary control -- the discipline of using terms consistently and defining them precisely.

### Why a Full Taxonomy Is Premature

A taxonomy requires that the full set of concepts be identified and their hierarchical relationships stabilized. Renkei's concept set is still developing. The archetype decomposition is solid, but pipeline-level concepts, cross-cutting concerns (verbatim propagation, quality gates, perspective sets), and system-level concepts (harness, skill file, host) are not yet fully articulated. Building a taxonomy over unstable ground produces a structure that must be torn down and rebuilt.

The Ontology Pipeline framework (Talisman, 2024) establishes that skipping stages produces unsatisfactory results. Moving from raw vocabulary to full taxonomy without first establishing a clean controlled vocabulary means ambiguity persists at the concept level, undermining any hierarchy built on top.

### Why an Ontology Is Wrong for This Project

DERIVATION.md already warns against over-specification: "Past a certain depth, the chain *obscures* the truth it was meant to transmit." An ontology formalizes relationships into machine-readable specifications with constraints and inference rules. This is the terminological equivalent of the abstraction mania DERIVATION.md identifies in software -- adding layers of formal structure that obscure rather than clarify.

Renkei's documents are prose. They are read by humans. The vocabulary control they need is human-readable definitions, not RDF triples.

## Finding 3: How Durable Systems Maintain Terminological Coherence

Three mechanisms recur across every system that maintains vocabulary across large document sets:

### Mechanism 1: A Single Authoritative Source

- **ISO**: ISO 9000:2015 serves as the vocabulary standard for the entire quality management family. Individual standards reference it rather than redefining terms.
- **US Army**: ATP 1-02.1 (formerly ADRP 1-02) is the single authoritative terminology source. Subordinate publication definitions yield to it.
- **Law**: Statutory definitions sections establish binding meaning. Courts interpret terms in light of these sections.
- **Euclid**: The *Elements* begins with definitions (23 in Book I) before any proposition. Every subsequent proof uses terms as defined.

The pattern: one document defines terms. All other documents use them as defined. If a document needs a term that does not exist in the vocabulary, the term is added to the vocabulary -- not defined locally.

### Mechanism 2: Scope Boundaries

ISO standards employ formal scope statements clarifying where terminology applies. Legal codes specify whether definitions apply to a section, chapter, or entire title. Military doctrine distinguishes between DoD-wide definitions, service-specific definitions, and publication-specific terms.

For Renkei, scope boundaries are natural: some terms are project-wide (archetype, ethos, doctrine), some are domain-specific to the archetype model (tenet, principle, rule, process, orchestration), some are system-level (pipeline, harness, skill file), and some are method-level (known good, derivation, therefore-chain).

### Mechanism 3: Change Control

All three systems treat vocabulary changes as formal events requiring review, not casual edits. ISO revises terminology through multi-year consensus processes. Military terms go through the DoD Terminology Program. Legal definitions change only through statutory amendment.

For Renkei at its current scale, heavy governance is unnecessary. But the principle matters: changing a term's definition should be a deliberate act, not an accidental drift. If the controlled vocabulary document says "pipeline" means X, then using "pipeline" to mean Y in another document is a defect to be fixed, not a natural evolution.

## Finding 4: Terms Should Be Grounded, Not Invented -- But Not Over-Derived

This is the question most native to Renkei's own philosophy: should the vocabulary itself follow the derivation pattern?

### The Case for Grounded Terms

DERIVATION.md establishes that "the author's job is curation, not creation." The ethos of an agent is not invented; it is derived from known goods in the domain. Should terms follow the same pattern?

Partially. The existing documents already do this well in places:

- **"Ethos"** is grounded in Greek rhetoric and military tradition. ETHOS.md opens with its etymology and explains why the classical meaning applies.
- **"Doctrine"** is grounded in military usage. DOCTRINE.md traces the word to its source and explains the relationship.
- **"Archetype"** carries Jungian and Platonic resonances (the original pattern from which copies are made) that align with how Renkei uses it.

These groundings are effective because they *explain the concept through the term*. The reader who knows what "ethos" means in Greek already has the right intuition about what it means in Renkei. The term is not arbitrary -- it is chosen because its established meaning maps to the concept.

### The Boundary: Do Not Over-Derive Terms

DERIVATION.md establishes the derivation boundary: "Do not derive the known goods." Aristotle's regress argument (*Posterior Analytics* II.19, 100b5-12) holds that first principles are grasped by *nous*, not by further demonstration. Attempting to derive them produces infinite regress.

The same boundary applies to terminology. Some terms can and should be grounded in established usage -- "ethos," "doctrine," "archetype," "pipeline." But attempting to derive *every* term from classical sources produces the same pathology DERIVATION.md warns about in doctrine: a chain so long it obscures rather than clarifies.

"Output Contract" does not need a Greek etymology. It is a well-understood software concept. "Quality Gate" does not need derivation from Aristotle. It is an engineering term with clear meaning. Grounding these would be the terminological equivalent of over-specifying doctrine -- adding derivation links that cost attention without adding understanding.

**The test**: Does grounding a term in an established tradition add understanding that the reader would not otherwise have? If yes, ground it. If the term is already clear from common technical usage, leave it ungrounded. The derivation boundary applies.

### Wittgenstein's Corrective

Wittgenstein's observation in *Philosophical Investigations* -- that meaning is use -- provides an important corrective to the impulse to ground every term philosophically. A term means what it means in the context where it is used. "Pipeline" in Renkei means what the Renkei documents use it to mean, regardless of its etymology. The controlled vocabulary's job is to make that *use* explicit and consistent, not to trace every term to first principles.

This aligns with DERIVATION.md's own method. Known goods are grasped by *nous*. They are evident. A term whose meaning is evident from its use does not need further derivation. The derivation is for terms where the established meaning *adds* understanding -- where the reader's grasp of the Greek word "ethos" or the military meaning of "doctrine" genuinely deepens their understanding of the Renkei concept.

## Finding 5: Adopt the Structure of Existing Standards, But Not the Standards Themselves

Three formal standards exist for controlled vocabulary construction:

- **ISO 25964** (thesauri and interoperability)
- **ANSI/NISO Z39.19** (controlled vocabulary construction)
- **W3C SKOS** (Simple Knowledge Organization System)

None of these should be formally adopted by Renkei. They are designed for information retrieval systems, library classification, and machine-readable knowledge organization. Renkei is a prose documentation project at a scale of dozens of documents, not thousands.

However, the *structural principles* these standards establish are applicable:

1. **One preferred term per concept.** If a concept has synonyms, designate one as preferred and note the others as non-preferred variants.

2. **One definition per term.** If a term carries multiple meanings, either split it into distinct terms or explicitly scope its usage.

3. **Scope notes.** Brief clarifications of when to use and when not to use a term.

4. **Relationship indicators.** Where relevant, note whether a term is broader than, narrower than, or related to another term.

These principles can be implemented in a simple markdown document without adopting the full apparatus of ISO 25964 or SKOS.

## Finding 6: Taxonomy Itself Faces the Diminishing Returns Boundary

DERIVATION.md identifies the boundary where further derivation produces waste, not value. The same boundary applies to vocabulary control:

### Over-specification of Terms

Defining every word used in the project is wasteful. Most words carry their common English meaning and do not need formal definition. The controlled vocabulary should include only terms that:

- Have a Renkei-specific meaning that differs from or narrows common usage
- Are ambiguous across documents (used with different meanings in different places)
- Are foundational to the conceptual model (the reader cannot understand the project without them)
- Are easily confused with each other (e.g., tenet vs. principle vs. rule)

### Over-hierarchicalization

Imposing deep hierarchical structure on the vocabulary creates the same problem DERIVATION.md identifies with deep derivation chains: the reader must traverse multiple levels to understand a term's place in the system. A flat or shallow vocabulary with clear definitions is more useful than a deep taxonomy with precise hierarchical relationships but high cognitive cost.

### The Meta-Risk

There is a specific risk for Renkei: the taxonomy itself becomes a project that consumes energy without producing archetype files. The vocabulary document is infrastructure. It exists to serve the archetype-building work, not to replace it. If the vocabulary becomes a subject of extended debate and revision before any archetypes are built, it has become the terminological equivalent of premature abstraction.

**The test** (from DERIVATION.md): Can someone reading a term's definition trace it back to the concept in one mental step? If yes, the definition is tight. If they need to traverse intermediate definitions or hierarchical relationships, the vocabulary is over-specified.

## Recommendation

Create a single document: `docs/VOCABULARY.md`.

### Structure

```
# Vocabulary

Terms used across Renkei documentation. One definition per term.
When a document needs a term not listed here, add it here before
using it. Do not define terms locally in individual documents.

## Conceptual Model

[Terms for the structural decomposition: archetype, ethos, doctrine,
and their sub-elements]

## Method

[Terms for the derivation method: known good, derivation,
therefore-chain, derivation boundary]

## System

[Terms for the runtime/tooling layer: pipeline, harness, skill file,
host, artifact]

## Cross-Cutting

[Terms that span multiple categories: verbatim propagation,
quality gate, perspective set, best-of-N]
```

### Format Per Entry

```
**Term** (non-preferred: synonym1, synonym2)

Definition in one to three sentences. What it is, not how it works.

Scope: Where this term applies and where it does not.

Not to be confused with: [related but distinct term].
```

### What to Include Immediately

The terms that are already ambiguous or overloaded in the current documents:

- **Pipeline** -- disambiguate the three current meanings
- **Process** vs **Workflow** -- establish preferred usage
- **Component** vs **Element** vs **Sub-element** -- establish what structural level each refers to
- **Known good** vs **Truth** vs **Axiom** -- establish the precise relationship
- **Archetype**, **Ethos**, **Doctrine** -- formalize the definitions already implicit in the docs
- **Identity**, **Tenet**, **Principle**, **Rule** -- the ethos sub-elements
- **Process**, **Orchestration**, **Pipeline Position**, **Output Contract** -- the doctrine sub-elements
- **Verbatim propagation**, **Quality gate**, **Perspective set** -- cross-cutting terms
- **Harness**, **Skill file**, **Host** -- system-level terms
- **Derivation**, **Therefore-chain**, **Derivation boundary** -- method terms

### What Not to Do

- Do not build a taxonomy hierarchy separate from the archetype decomposition. The archetype decomposition *is* the hierarchy.
- Do not adopt ISO 25964 or SKOS formally. Use their structural principles informally.
- Do not attempt to ground every term in classical sources. Ground terms where the etymology adds understanding; leave terms ungrounded where common usage is sufficient.
- Do not create the vocabulary as a blocking prerequisite that prevents other work. Create it as a living reference that grows with the project.

## Sources

### Standards and Frameworks
- ISO 25964-1:2011, *Thesauri and interoperability with other vocabularies -- Part 1: Thesauri for information retrieval*
- ISO 25964-2:2013, *Part 2: Interoperability with other vocabularies*
- ANSI/NISO Z39.19-2005 (R2010), *Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies*
- W3C SKOS (Simple Knowledge Organization System) Reference, 2009
- ISO Harmonised Structure (Annex SL), used across ISO management system standards
- ATP 1-02.1 / ADRP 1-02, *Terms and Military Symbols* (US Army)
- Chairman of the Joint Chiefs of Staff, DoD Terminology Program (https://www.jcs.mil/doctrine/dod-terminology-program/)
- Georgetown Law, *A Guide to Reading, Interpreting and Applying Statutes*

### Ontology and Knowledge Organization
- Talisman, J. "A Practitioner's Guide to Taxonomies." 2024. Substack.
- Nielsen Norman Group, "Taxonomy 101." (https://www.nngroup.com/articles/taxonomy-101/)
- Hedden, H. *The Accidental Taxonomist*. 2nd ed. Information Today, 2016.
- ModernData101, "The Ontology Pipeline." Substack.

### Philosophy of Language and Naming
- Aristotle, *Categories* (classification of beings; substance as primary)
- Aristotle, *Posterior Analytics* II.19, 100b5-12 (first principles grasped by *nous*)
- Wittgenstein, *Philosophical Investigations* (meaning as use)
- Frege, "On Sense and Reference" (1892) (sense/reference distinction for technical vocabulary)

### Semantic Drift
- Syntaxia, "Semantic Drift: Why Your Metrics No Longer Mean What You Think." 2024.

### Software Requirements
- Wiegers, K. *Software Requirements*. 3rd ed. Microsoft Press, 2013.
- IEEE 830-1998, *Recommended Practice for Software Requirements Specifications*
