# Research: Compositional Elements of an Agent Archetype

## The Question

An agent archetype decomposes into parts. DERIVATION.md establishes the derivation chain:

```
KNOWN GOOD / TRUTH  -->  therefore  -->  ETHOS  -->  therefore  -->  DOCTRINE
```

The current decomposition within Ethos and Doctrine:

- **Ethos**: Identity, Tenets, Principles, Rules
- **Doctrine**: Process, Orchestration, Pipeline, Output Contract

This paper asks five questions:

1. What is the right generic term for the compositional pieces of an archetype?
2. Are the current sub-elements correct, redundant, or incomplete?
3. Should TRUTH / KNOWN GOODS be a separate element or embedded?
4. Is there a need for a PRIMITIVES / CAPABILITIES element?
5. What can we learn from how established systems structure their elements?

All claims are grounded in established usage and known goods, not preference.

---

## 1. The Right Generic Term

### Candidates Evaluated

| Term | Etymology | Primary Domain | Connotation |
|------|-----------|---------------|-------------|
| **Article** | Latin *articulus*, "small joint" | Constitutional law, scholastic theology | Discrete unit that articulates (joins) into a larger body |
| **Canon** | Greek *kanon*, "measuring rod" | Ecclesiastical law, literary authority | A standard or rule by which things are measured |
| **Element** | Latin *elementum*, possibly from "L, M, N" (alphabet) | Natural philosophy, mathematics | Irreducible building block; alphabetic primitive |
| **Component** | Latin *componere*, "to put together" | Engineering, systems theory | A part that is assembled into a whole |
| **Facet** | French *facette*, diminutive of *face* | Gem-cutting, analysis | One surface of a multi-sided whole; a perspective |
| **Pillar** | Latin *pila*, "stone barrier" | Architecture, Islam (Five Pillars) | Load-bearing support; foundational practice |
| **Precept** | Latin *praeceptum*, from *praecipio*, "to teach" | Moral philosophy, monastic rules | A teaching or command given in advance |
| **Tenet** | Latin *tenere*, "to hold" | Philosophy, creedal theology | A belief that is held as true |

Sources: etymonline.com entries for each term; Wiktionary Latin entries; Stanford Encyclopedia of Philosophy, "Categories."

### Analysis

**Article** is the strongest candidate. The rationale:

1. **Etymological fit.** *Articulus* means "small joint" -- the point at which separate parts connect and allow movement. An archetype's parts are not isolated; they are *articulated* into a functioning whole. The joint metaphor captures both the independence of each part and its structural role in connecting to other parts. (Etymology Online, "article," from Latin *articulus*, "a part, a member, a joint.")

2. **Precedent in constitutional documents.** The US Constitution uses "Articles" for its primary compositional units. The Articles of Confederation established this pattern in American constitutional law. The term connotes: a discrete, numbered, substantive unit of governance that can stand somewhat independently while functioning only as part of a larger system. (Constitution of the United States, 1787; Articles of Confederation, 1781.)

3. **Precedent in scholastic theology.** Aquinas's *Summa Theologiae* uses *articulus* as the fundamental unit of theological analysis. Each article is the smallest self-contained unit of inquiry, structured as question, objections, contrary position, response, and replies. Aquinas's choice was deliberate: the article is the indivisible "joint" of a theological body. The *Summa* hierarchy is Parts > Questions > Articles, where the article is the atomic unit. (Thomas Aquinas, *Summa Theologiae*, ca. 1265-1274; Cambridge Companion to the Summa Theologiae.)

4. **Precedent in creedal theology.** The Apostles' Creed and Nicene Creed are traditionally divided into twelve "articles of faith" -- each article being a distinct doctrinal assertion that can be examined independently but constitutes part of the whole confession. (Apostles' Creed, traditional twelve-article division; Nicene Creed, 325/381 AD.)

5. **Distinction from alternatives.** "Element" suggests irreducible primitives (Euclid's *Elements*, chemical elements) -- the archetype's parts are not irreducible in that sense; they are structured composites. "Component" is engineering-generic and carries no philosophical weight. "Facet" implies different views of the same thing, not different functional parts. "Pillar" implies equal load-bearing, which is wrong -- Ethos and Doctrine have different roles. "Canon" implies a rule or standard, which is too narrow. "Tenet" is already used within Ethos for a specific sub-element.

**The term "article" is the known-good choice for the compositional pieces of an archetype.** It is grounded in constitutional, scholastic, and creedal tradition. It carries the exact connotation needed: a discrete, self-contained unit that articulates into a larger body.

### What to Call the Collection

If each piece is an "article," the collection is "the articles of the archetype" -- analogous to "articles of faith," "articles of confederation," or "articles of incorporation." No additional container term is needed.

---

## 2. Evaluation of Current Sub-Elements

### Ethos: Identity, Tenets, Principles, Rules

These four sub-elements map cleanly to established philosophical categories:

| Sub-Element | Philosophical Category | Function | Established Precedent |
|-------------|----------------------|----------|----------------------|
| **Identity** | Ontology (what the agent *is*) | Declares self and anti-self; relationship to domain and other agents | Military identity statements (SEAL Ethos: "I am..." declarations); monastic rules (Rule of St. Benedict, Chapter 1: classification of monk types) |
| **Tenets** | Axiology (what the agent *values*) | Deepest convictions about the domain; shapes judgment when other elements are silent | Articles of faith in creedal theology; Aristotle's *hexis* as active holding of convictions |
| **Principles** | Epistemology (how the agent *knows*) | Methods and approaches the agent trusts; how it operates | Aristotle's *phronesis* as practical wisdom; scientific method as epistemological commitment |
| **Rules** | Deontology (what the agent *must/must not do*) | Hard constraints; NEVER/ALWAYS guardrails | Monastic rules (Rule of St. Benedict: specific prohibitions and requirements); constitutional amendments as absolute constraints |

**Assessment: The four are well-chosen.** Each maps to a distinct branch of philosophy. They are not redundant -- axiology (values) is genuinely different from epistemology (methods), and both are different from deontology (constraints). Identity is ontological -- it establishes what kind of thing the agent is before values, methods, or constraints apply.

**One concern: the gradient from Tenets to Principles to Rules.** The ETHOS.md document already identifies the distinction clearly (tenets = "what matters," principles = "how to work," rules = "hard constraints"). The risk is that in practice, authors conflate tenets and principles because both feel like "beliefs." The existing documentation handles this well through the tenet/principle comparison table, but this is a real authoring risk that the tooling should address through guidance or examples.

**No elements are missing from Ethos.** The four cover the ontological, axiological, epistemological, and deontological dimensions of character. Adding more would introduce redundancy.

### Doctrine: Process, Orchestration, Pipeline, Output Contract

| Sub-Element | Function | Established Precedent |
|-------------|----------|----------------------|
| **Process** | Ordered steps from input to output | Military FM/ATP procedural steps; Rule of St. Benedict operational chapters (8-42) |
| **Orchestration** | Delegation patterns, clone types, perspectives, quality gates | Military command structures; Aquinas's *quaestio* structure (managing sub-inquiries) |
| **Pipeline** | Position in flow; inputs, outputs, upstream/downstream | IEEE 42010 architecture views; systems theory (VSM System 1 operational units) |
| **Output Contract** | Artifact type, path, structure, completion criteria | Software interface contracts; legal output requirements in constitutional law |

**Assessment: Mostly correct, but with structural concerns.**

**Orchestration is not universal.** The existing documentation already notes that "only orchestrators have this." This means Orchestration is a conditional article -- it exists for some archetypes but not others. This is fine and mirrors constitutional practice (not all Articles apply to all branches of government). But the tooling should make this conditionality explicit rather than having empty Orchestration sections in non-orchestrator archetypes.

**Pipeline Position is relational, not intrinsic.** The DOCTRINE.md document already identifies this: "Pipeline position is a property of the agent's *relationship to the pipeline*, not of the agent itself." This raises a question about whether Pipeline belongs in the archetype at all, or whether it belongs in the pipeline definition that references the archetype. This is analogous to the distinction in IEEE 42010 between a viewpoint (which is reusable across systems) and a view (which is specific to a particular system). The archetype is the viewpoint; the pipeline instantiation is the view. **Pipeline Position should remain in Doctrine but be understood as a binding site -- a declaration of what the agent expects to receive and produce, not where it concretely sits.** The concrete pipeline position is determined when the archetype is placed into a specific pipeline.

**No elements are missing from Doctrine.** Process, Orchestration, Pipeline, and Output Contract cover: what the agent does (process), how it delegates (orchestration), where it connects (pipeline), and what it produces (output contract). These correspond to the four essential operational questions.

---

## 3. TRUTH / KNOWN GOODS: Separate Element or Embedded?

### The Case for Separate

DERIVATION.md establishes a three-level chain: TRUTH > ETHOS > DOCTRINE. If TRUTH is a distinct level in the derivation, it should be a distinct element in the archetype. Separating it:

- Makes the grounding explicit and auditable. A reader can inspect the TRUTH article independently and verify that the ethos derives from it.
- Follows the pattern of Euclid's *Elements*, where definitions and postulates (the axiomatic foundation) are separated from propositions (the derived results). The definitions are not embedded in Proposition 1; they precede all propositions.
- Follows the pattern of the Westminster Confession, where Chapter I (Of the Holy Scripture) establishes the epistemic foundation before any doctrine is derived.
- Follows Aristotle's *Posterior Analytics* II.19: first principles (*archai*) are grasped by *nous*, not derived by demonstration. They are a different *kind* of thing from what follows -- and different kinds of things should be separated.

### The Case for Embedded

- Not every agent needs heavy grounding in known goods. A utility agent that formats output has no deep epistemological grounding. Requiring a separate TRUTH file for every archetype creates overhead.
- The derivation chain is a *process* for authoring archetypes, not necessarily a structure the archetype must mirror. The author uses TRUTH to derive ETHOS, but the consumer of the archetype (the LLM) receives ETHOS as its starting point.

### Resolution: Separate, But Not Required for All Archetypes

The distinction maps to Aristotle's own distinction between sciences that have many *archai* (like geometry) and crafts that have few (like carpentry). An agent whose domain involves judgment (test-writer, architect, designer) has a rich truth foundation that warrants its own article. An agent whose domain is mechanical (file-searcher, formatter) has minimal or no truth foundation.

**TRUTH should be an optional article that precedes ETHOS when present.** When it exists, it contains the domain-specific known goods from which the ethos derives. When absent, the ethos is understood as self-grounding (its tenets are simple enough to be self-evident).

This matches the Euclid model: Books I-IV have extensive definitions and postulates because they establish the foundations of plane geometry. Later books sometimes add new definitions but can reference earlier foundations. Similarly, an archetype family might share a TRUTH article that individual archetypes reference rather than duplicate.

---

## 4. PRIMITIVES / CAPABILITIES: Is There a Need?

### What Capabilities Are in Established Systems

In military doctrine, capabilities are what a force *can do* -- they are generated by the interaction of doctrine, organization, training, materiel, leadership, personnel, facilities, and policy (the DOTMLPF-P framework). Capabilities are not a separate doctrinal element; they are an *emergent property* of all the other elements combined. (Joint Chiefs of Staff DOTMLPF-P framework; NDU Press, "Enhancing Security Cooperation Effectiveness.")

In Aristotle's metaphysics, *dynamis* (capacity/power) is the potential for action, *hexis* (character state) is the developed disposition, and *energeia* (activity) is the actualization. *Dynamis* precedes *hexis* in the developmental sequence: you must have the capacity for courage before you can develop the disposition of courage. But *dynamis* is given by nature, not taught. (Aristotle, *Nicomachean Ethics* II.1, 1103a26-b2; *Metaphysics* IX.)

In the agent context, "capabilities" or "primitives" would refer to: what tools the agent has access to, what actions it can perform, what files it can read/write. These are the *dynamis* -- the raw capacities that the ethos shapes into dispositions and doctrine directs into action.

### Analysis

**Capabilities are not an article of the archetype. They are a property of the execution environment.**

An archetype defines *who the agent is* (Ethos) and *what the agent does* (Doctrine). The tools available to the agent are not part of its character or its work -- they are the medium through which it works. This is the distinction between a craftsman's character and his tool chest. A master carpenter's identity, values, methods, and work process do not change when he acquires a new saw. The saw is part of the workshop, not part of the craftsman.

The harness (Claude Code, OpenCode, etc.) provides the tool set. The archetype assumes certain capabilities exist and references them in Doctrine (e.g., "delegate to /research-codebase" assumes the research-codebase skill exists). But the list of available tools is not an article of the archetype any more than a list of available materials is an article of the builder's character.

**Where capabilities DO appear:** In Doctrine's Process and Orchestration articles, tool usage is embedded naturally. "Step 3: Delegate research agents" references a capability. "NEVER write research documents -- delegate /research-codebase" (a Rule) references a capability. The capability is referenced where it is used, not catalogued separately.

**Exception: If Renkei needs to validate that an archetype's referenced capabilities exist in the target harness, it needs a capability manifest -- but that belongs in the harness configuration, not the archetype definition.** This is the distinction between the archetype (the design) and the deployment (the instantiation in a specific environment).

---

## 5. How Established Systems Structure Their Elements

### Pattern 1: Foundation Before Derivation (Euclid, Westminster, Aquinas)

Every durable system establishes its foundations before its derived content:

- **Euclid's *Elements***: Definitions > Postulates > Common Notions > Propositions. The foundations precede all proofs. (Euclid, *Elements* Book I, ca. 300 BC.)
- **Westminster Confession**: Scripture (Ch. I) > God's nature (Ch. II) > God's decree (Ch. III) > Creation, Providence, Fall > Covenant > Salvation > Church > Practice. Each chapter derives from what precedes it. (Westminster Assembly, 1646.)
- **Aquinas's *Summa***: *Prima Pars* (God, creation, human nature) > *Secunda Pars* (human action, virtue, vice, law, grace) > *Tertia Pars* (Christ, sacraments). The movement is from foundational theology to derived practice. (Thomas Aquinas, *Summa Theologiae*, ca. 1265-1274.)

**Implication for Renkei**: The derivation chain TRUTH > ETHOS > DOCTRINE already follows this pattern. The article ordering within an archetype should reflect this: TRUTH (if present) first, then ETHOS articles in order (Identity > Tenets > Principles > Rules), then DOCTRINE articles in order (Process > Orchestration > Pipeline > Output Contract). The ordering is not alphabetical; it is derivational.

### Pattern 2: Identity Before Rules (Rule of St. Benedict, Military Doctrine)

Systems that govern behavior establish *who the subject is* before specifying *what the subject does*:

- **Rule of St. Benedict**: Preface (spiritual orientation) > Chapter 1 (types of monks -- identity) > Chapters 2-7 (spiritual foundations -- character) > Chapters 8-73 (operational rules). (Rule of St. Benedict, ca. 530 AD.)
- **US Army ADP 1**: Army Values > Warrior Ethos > Doctrine Publications > Mission Command > Operations. Identity and values precede operational guidance. (ADP 1: The Army, 2019.)
- **SEAL Ethos**: First-person identity declarations ("I am...") precede operational commitments ("I will..."). (US Navy SEAL Ethos, 2005.)

**Implication for Renkei**: Identity is correctly placed as the first element of Ethos. This is not arbitrary; it is the universal pattern. You cannot hold tenets until you know who you are.

### Pattern 3: Character Fills the Gaps Doctrine Cannot (Aristotle, Military Ethos)

Every established system recognizes that rules and procedures cannot anticipate all situations:

- **Aristotle**: *Hexis* (character state) generates right action in situations that *phronesis* (practical wisdom) must navigate without explicit rules. This is why virtue is more reliable than instruction. (Aristotle, *Nicomachean Ethics* II.4, 1105a28-33.)
- **Military ethos**: "When the process breaks down, the ethos is what remains." The Warrior Ethos exists because doctrine fails under fog of war. (DERIVATION.md, citing military ethos tradition.)
- **Westminster Confession**: The Confession establishes principles precisely so that Christians can exercise judgment in situations the Confession does not address. The principles are more important than the specific applications.

**Implication for Renkei**: This validates the Ethos/Doctrine separation at the deepest level. Ethos is not "soft doctrine" -- it is what remains when doctrine fails. The distinction is not organizational convenience; it is structural necessity.

### Pattern 4: The Atomic Unit is Self-Contained (Aquinas's Article, Euclid's Proposition)

In every system that uses compositional units, the unit is self-contained -- it can be read and understood on its own:

- **Aquinas's article**: Contains question, objections, contrary, response, replies. A reader can engage with a single article without reading the entire *Summa*. (Aquinas, *Summa Theologiae*.)
- **Euclid's proposition**: Contains enunciation, specification, construction, proof, conclusion. Each proposition is a complete proof. (*Elements* Book I.)
- **Constitutional article**: Each article of the US Constitution addresses a complete branch or concern of governance. (US Constitution, 1787.)

**Implication for Renkei**: Each article of an archetype should be self-contained enough to be read, edited, and understood independently. This is already the case in the current design -- ETHOS.md and DOCTRINE.md are separate files. Carrying this through to the sub-element level means each sub-element (Identity, Tenets, Principles, Rules, Process, Orchestration, Pipeline, Output Contract) should be independently intelligible, even if it references other articles.

### Pattern 5: Conditional Elements Are Common (Constitutional Amendments, Orchestration)

Not every element applies to every instance:

- **Constitutional amendments**: Apply only to the concerns they address. The 13th Amendment (abolishing slavery) has no bearing on the 1st Amendment (free speech). Some are superseded (18th Amendment, Prohibition, repealed by 21st).
- **Orchestration**: Only applies to orchestrator archetypes.
- **Rule of St. Benedict**: Some chapters apply only to specific roles (e.g., Chapter 2 applies only to abbots; Chapter 31 to cellerers).

**Implication for Renkei**: The system should support optional articles. Not every archetype needs every article. The minimum viable archetype might be: Identity + Process + Output Contract. A rich archetype might include all articles plus TRUTH.

---

## Summary of Findings

### The Term

**Article** -- from Latin *articulus*, "small joint." Grounded in constitutional, scholastic, and creedal tradition. Carries the right connotation: a discrete, self-contained unit that articulates into a larger body.

### The Articles of an Archetype

```
Archetype
  |
  +-- [TRUTH]  (optional -- domain-specific known goods)
  |
  +-- ETHOS  (being -- the agent's character)
  |     +-- Identity      (ontology: what the agent is and is not)
  |     +-- Tenets         (axiology: what the agent believes/values)
  |     +-- Principles     (epistemology: how the agent knows/operates)
  |     +-- Rules          (deontology: hard NEVER/ALWAYS constraints)
  |
  +-- DOCTRINE  (doing -- the agent's work)
        +-- Process         (ordered steps from input to output)
        +-- Orchestration   (delegation patterns; orchestrators only)
        +-- Pipeline        (input/output binding; relational position)
        +-- Output Contract (artifact type, structure, completion)
```

### Key Decisions

| Question | Answer | Grounding |
|----------|--------|-----------|
| Generic term for pieces | **Article** | Aquinas, US Constitution, creedal tradition |
| Current sub-elements correct? | **Yes** -- no redundancy, no gaps | Philosophical category mapping (ontology, axiology, epistemology, deontology) |
| TRUTH separate or embedded? | **Separate when present, optional** | Euclid (axioms precede propositions), Aristotle (archai are a different kind of thing) |
| Need for PRIMITIVES/CAPABILITIES? | **No** -- capabilities are environmental, not constitutional | Aristotle (dynamis is given by nature, not part of hexis); military DOTMLPF-P (capabilities are emergent, not doctrinal) |
| Ordering of articles | **Derivational, not alphabetical** | Euclid, Westminster, Aquinas: foundations before derivations |

### What This Does NOT Address

- How articles are serialized into harness-specific output (e.g., SKILL.md assembly). That is an implementation concern, not a compositional one.
- How articles relate to each other across archetypes (e.g., shared TRUTH files, verbatim propagation). That is a pipeline/grouping concern.
- The inner structure of each article (e.g., should Tenets be numbered? Should Rules have enforcement levels?). That is a formatting concern best resolved through authoring experience, not pre-specification.

---

## Sources

### Primary Sources

- Aristotle, *Nicomachean Ethics*, Books I-II, VI (hexis, phronesis, habituation)
- Aristotle, *Posterior Analytics*, I.2 (71b9-23), II.19 (100b5-12) (first principles, nous, demonstration)
- Thomas Aquinas, *Summa Theologiae*, ca. 1265-1274 (article structure, parts/questions/articles hierarchy)
- Euclid, *Elements*, Book I (definitions, postulates, common notions, propositions)
- Constitution of the United States, 1787 (articles, sections, clauses)
- Articles of Confederation, 1781
- Westminster Confession of Faith, Westminster Assembly, 1646
- Rule of St. Benedict, ca. 530 AD (preface, 73 chapters)
- Nicene Creed, 325/381 AD (twelve articles of faith)
- US Navy SEAL Ethos, 2005
- US Army ADP 1: The Army

### Secondary Sources

- Cambridge Companion to the Summa Theologiae (on Aquinas's article structure)
- Catholic World Report, "Reading St. Thomas: A Beginner's Guide to the Articulus" (2025)
- Stanford Encyclopedia of Philosophy, "Categories" (Aristotle and Kant)
- Stanford Encyclopedia of Philosophy, "Literary Forms of Medieval Philosophy" (scholastic method)
- Etymology Online, entries for: article, canon, element, component, facet, pillar, precept, tenet
- NDU Press, "Enhancing Security Cooperation Effectiveness" (DOTMLPF-P framework)
- ISO/IEC/IEEE 42010:2022 (architecture description: stakeholders, concerns, viewpoints, views)
- Dijkstra, "On the role of scientific thought" (EWD447, 1974) (separation of concerns)
- Parnas, "On the Criteria to Be Used in Decomposing Systems into Modules" (1972) (information hiding)
