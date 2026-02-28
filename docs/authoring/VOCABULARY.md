# Vocabulary

Controlled vocabulary for Renkei documentation. One preferred term per concept, one definition per term.

When a document needs a term not listed here, add it here before using it. Do not define terms locally in individual documents.

Terms are constant across all domains. A term means the same thing in authoring docs, code comments, GUI labels, and conversation.

---

## Conceptual Model

**Archetype**

The complete definition of an agent. Decomposes into articles organized under three required pillars: Truth, Ethos, and Doctrine. An archetype is a design -- it defines who an agent is and what it does. It is not the running agent itself.

Scope: The archetype is the artifact Renkei authors and manages. It produces host-specific output (skill files, system prompts, agent configs) but is not itself that output.

Not to be confused with: skill file (a host-specific output assembled from an archetype).

**Pillar**

One of the three required top-level divisions of an archetype: Truth, Ethos, Doctrine. From Latin *pila* (stone barrier) -- a load-bearing structural support. The three pillars are locked and immutable. They mirror the derivation chain: Truth -> therefore -> Ethos -> therefore -> Doctrine. Each pillar contains one or more articles. All articles within a pillar are appended together during assembly.

Scope: Only three pillars exist. The term applies exclusively to Truth, Ethos, and Doctrine at the top level. Do not use "pillar" for sub-divisions.

Not to be confused with: article (a flexible, author-defined piece within a pillar).

**Ensemble**

A composed collection of archetypes working toward a shared goal. An ensemble defines which archetypes collaborate, how artifacts flow between them, and what topologies (sequential, parallel, fan-out, feedback) connect them.

Scope: An ensemble is the unit of collaboration. It may contain sub-ensembles (e.g., the test-writer and its perspective clones form a sub-ensemble within a development ensemble).

Not to be confused with: pipeline (one possible topology within an ensemble, not the ensemble itself).

**Team**

An operational grouping of archetypes with explicit role relationships. In Renkei practice, a team typically has one leader archetype and one or more member archetypes.

Scope: Team is the collaboration unit most authors reason with when defining handoffs, delegation, and ownership. A team is a practical expression of an ensemble slice.

Not to be confused with: ensemble (broader composition concept that can include multiple teams and topologies).

**Team Leader**

The archetype accountable for team-level synthesis, quality gates, and stage handoff. A team leader delegates specialist work to members, aggregates artifacts, and publishes the package that leaves the team boundary.

Scope: Leadership responsibility, not title prestige. A team leader may also be a stage owner when the team corresponds to a process stage.

**Team Member**

An archetype that produces bounded specialist artifacts for its parent leader. Team members do not own cross-member synthesis unless explicitly assigned.

Scope: Member outputs return to the parent leader by default.

**Stage**

A bounded segment of an organizational process with explicit entry criteria, ownership, and exit contract. A stage is often implemented by one leader-led team, but not every team maps one-to-one with a stage.

Scope: Stage defines process ownership and handoff contracts between teams.

Not to be confused with: pipeline as topology (structure of flow) or process steps (internal sequence inside a stage).

**Satellite Team**

A reusable support team that can be invoked by multiple other teams and is not anchored to a single stage boundary.

Scope: Satellites provide specialist artifacts on demand and return outputs to the requesting parent leader.

**Article**

A discrete, self-contained compositional piece within a pillar. From Latin *articulus* (small joint) -- a unit that is independent yet structurally connected to the larger body. Articles are the atomic authoring units: each is authored, reviewed, and maintained independently.

Scope: Articles live within pillars. Each pillar must contain at least one article. Article names and content are flexible -- the author decides what articles are needed based on the archetype's domain. Suggested patterns exist (Identity, Tenets, Principles under Ethos; Process, Orchestration, Pipeline, Output Contract under Doctrine) but are not mandatory.

Not to be confused with: pillar (the three fixed top-level divisions); element, component, facet (deprecated -- use "article" for all compositional pieces within pillars).

**Ethos**

The agent's character -- who it is, what it believes, and how it thinks. The pillar of *being*. From Greek *ethos* (character, guiding beliefs). Ethos is stable: you can rewrite every doctrine article and the agent's judgment holds if its ethos is solid.

Contains flexible articles. Suggested patterns: Identity (ontology), Tenets (axiology), Principles (epistemology).

Not to be confused with: doctrine (what the agent does -- the pillar of *doing*).

**Identity** (suggested Ethos pattern)

The agent's declaration of self and its boundaries. A relationship claim -- the agent's position relative to other agents and to truth. Includes anti-identity: what the agent is *not*, which prevents role drift.

Scope: Ontological -- what the agent *is*. A suggested article pattern under the Ethos pillar.

**Tenet** (suggested Ethos pattern; non-preferred: belief, value)

A conviction the agent holds about its domain. Tenets are not instructions -- they are beliefs. An instruction says "do X." A tenet says "X is true, and therefore..." The agent derives behavior from the belief. Tenets shape judgment when other articles are silent.

Scope: Axiological -- what the agent *values*. A suggested article pattern under the Ethos pillar.

Not to be confused with: principle (how the agent works, not what it believes).

**Principle** (suggested Ethos pattern)

How the agent operates and makes decisions. An epistemological commitment -- the methods and approaches the agent trusts. Principles guide behavior but allow interpretation.

Scope: Epistemological -- how the agent *knows*. A suggested article pattern under the Ethos pillar.

Not to be confused with: tenet (what the agent believes, not how it works).

**Doctrine**

The agent's work -- what it does, how it delegates, what it produces, and how it knows the work is done. The pillar of *doing*. From military tradition: the established body of procedures that units follow. Doctrine evolves as workflows, tools, and ensembles change. Ethos shapes how doctrine is executed.

Contains flexible articles. Suggested patterns: Process, Orchestration, Pipeline, Output Contract.

Not to be confused with: ethos (who the agent is -- the pillar of *being*).

**Process** (suggested Doctrine pattern)

The ordered steps the agent follows from input to output. The most concrete article -- answers "what does this agent actually do?"

Scope: A suggested article pattern under the Doctrine pillar.

Not to be confused with: workflow (deprecated as a term for this concept -- use "process").

**Orchestration** (suggested Doctrine pattern)

How the agent delegates work to sub-agents. Defines clone types, perspective sets, verbatim blocks, and quality gates.

Scope: A suggested article pattern under the Doctrine pillar. Relevant only for orchestrator archetypes.

**Pipeline** (as a suggested Doctrine pattern)

The agent's input/output binding -- what artifacts it receives, what it produces, what comes before and after. A declaration of the agent's interface, not its concrete position. Concrete position is determined when the archetype is placed into an ensemble.

Scope: Relational -- a property of the agent's relationship to the ensemble. A suggested article pattern under the Doctrine pillar.

Not to be confused with: pipeline as a topology (see below).

**Pipeline** (as a topology)

A sequential flow topology within an ensemble where output from one stage feeds input to the next. One possible topology among several (parallel, fan-out, feedback). The simplest case of ensemble structure.

Scope: Describes one topology option, not the ensemble itself.

Not to be confused with: ensemble (the broader concept that contains pipelines and other topologies); pipeline as a doctrine article (the agent's input/output binding).

**Output Contract** (suggested Doctrine pattern)

What the agent produces and in what form. Defines artifact type, path conventions, structure, and completion criteria. The interface between this agent and its consumers. Output contracts are what make ensembles composable.

Scope: A suggested article pattern under the Doctrine pillar.

**Truth** (non-preferred: known good, when referring to the article)

The domain-specific known goods from which an archetype's ethos derives. As an article within an archetype, TRUTH.md contains established, citeable, inarguable facts -- mathematical properties, physical constraints, proven patterns, empirical results, epistemological principles -- that ground the agent's convictions.

Scope: Required article. Every agent operates in a domain. Every domain has truths. If you cannot identify the known goods for an archetype, either the truths exist but haven't been found yet, or the archetype has no basis for existing. The derivation boundary applies: a simple agent's TRUTH article may be 2 sentences. It must exist so the author is forced to answer: *what truths ground this agent?*

Not to be confused with: known good (a specific established fact, see Method section); truth as a general concept.

---

## Method

**Known Good**

An established, citeable, inarguable fact within a domain. Mathematical properties, physical constraints, proven patterns, legal principles, empirical results, or epistemological frameworks established by prior human labor. Known goods are identified (curated), not invented (created). They are the axioms of the derivation chain -- accepted because they are evident, proven, or empirically established, not because they derive from something deeper.

Scope: The raw material from which ethos is derived. A known good belongs to the domain, not to the archetype. Multiple archetypes may derive from the same known good.

Not to be confused with: truth article (the archetype's collection of relevant known goods); tenet (a conviction derived from known goods, not the known good itself).

**Derivation**

The act of deriving ethos from known goods, and doctrine from ethos, through explicit "therefore" links. Each link is a logical consequence, not an arbitrary assertion. The derivation chain: KNOWN GOOD -> therefore -> ETHOS -> therefore -> DOCTRINE.

**Derivation Boundary**

The point where further derivation produces waste, not value. Upward: do not derive known goods from deeper known goods (Aristotle's regress -- first principles are grasped by *nous*, not demonstrated). Downward: do not over-derive doctrine from ethos (the analogue of abstraction mania -- if the ethos is deep enough, the agent derives the right action itself).

Practical limit: 1-2 "therefores" in each direction. If a doctrine element requires more than two "therefores" from a known good, either a missing ethos article would shorten the chain, or the element is over-specified.

**Therefore-chain**

The sequence of derivation links from known good through ethos to doctrine. A therefore-chain makes the reasoning visible: "X is true (known good), therefore the agent believes Y (tenet), therefore the agent does Z (process step)." The chain is the audit trail -- it answers "why does this agent do this?"

**Runtime Reasoning Structure**

The derivation chain (Truth -> Ethos -> Doctrine) functioning not just as an authoring method but as a structure the agent reasons through during execution. When doctrine conflicts or situations arise that doctrine did not anticipate, the agent traces back through ethos to truth and derives a resolution. The chain becomes the agent's reasoning scaffold at runtime -- not just the blueprint from which the document was built.

The distinction: as an *authoring structure*, the derivation chain tells the author how to build coherent agent definitions. As a *runtime reasoning structure*, the same chain gives the agent a way to navigate novel tensions by reasoning from first principles rather than breaking rules, hallucinating, or silently failing.

Scope: Emergent property of well-grounded archetypes. Not all archetypes will exhibit runtime reasoning -- it requires a truth layer deep enough to anchor novel derivations and an ethos layer that provides genuine conviction rather than restated instructions. Thin truth layers produce brittle agents that cannot self-heal at tension points.

Not to be confused with: the derivation chain as an authoring method (which describes how the document is written, not how the agent uses it); prompt engineering (which instructs behavior directly rather than grounding it in truth and conviction).

---

## System

**Engine**

The Renkei composition layer that bridges authoring and platform. The engine (`engine/`) loads archetypes, enforces orchestration policy, and composes domain behavior onto the platform runtime. It owns archetype loading, capability gating, and composition adapters -- but not the platform's session engine, transport, or interfaces.

Not to be confused with: platform (the host runtime the engine composes onto); authoring (which defines archetypes, not execution policy).

**Platform**

The host runtime that provides session execution, transport, tool registry, interfaces, and all infrastructure an agent needs to act in the world. OpenCode is the current platform. The platform is a dependency the engine composes onto -- Renkei does not own or maintain the platform.

Not to be confused with: engine (Renkei's composition layer on top of the platform); harness (deprecated term -- see Deprecated Terms).

**Harness** *(deprecated -- see Deprecated Terms)*

Previously referred to the agentic runtime that executes archetypes. The concept has been split: "engine" for Renkei's composition layer (`engine/`), "platform" for the host runtime (OpenCode). See Deprecated Terms table.

**Skill File**

A host-specific output artifact produced by assembling an archetype for a particular platform. For Claude Code: a SKILL.md file. For other platforms: their native config format. The skill file is a rendered view of the archetype, not the archetype itself.

Not to be confused with: archetype (the source definition from which skill files are assembled).

**Manifest**

The `archetype.yaml` file that declares an archetype's assembly order, shared article references, output targets, and metadata. The manifest controls how articles compose into output -- it is the recipe, not the ingredients.

**Assembly**

The process of composing an archetype's articles into a usable output artifact, guided by the manifest. Two phases: compose (produce intermediate assembled.md from articles in manifest order) then host-adapt (format for target platform). Assembly is include/compose, not compilation or template expansion -- articles are joined, not transformed.

Not to be confused with: compilation (transforms source into a different representation); rendering (transforms structure into presentation).

**Artifact**

Any document produced by an agent during ensemble execution. Research documents, design docs, test specs, implementation plans, validation reports, code. Artifacts flow between agents via the ensemble's topology.

Not to be confused with: article (a piece of an archetype definition); skill file (a harness-specific output of assembly).

---

## Cross-Cutting

**Verbatim Propagation**

The mechanism by which an orchestrator passes its ethos to sub-agents. The text is forwarded exactly -- no paraphrasing, no normalization, no transformation. Byte-identical transmission. Paraphrasing introduces drift; exact transmission eliminates it.

Scope: Applies only to orchestrator archetypes during delegation.

**Quality Gate**

An explicit pass/fail checkpoint between ensemble stages. Evaluates an artifact against concrete criteria, then proceeds or iterates. Quality gates are where ethos meets doctrine: the criteria reflect the agent's values (ethos) applied to concrete artifacts (doctrine).

Not to be confused with: a review (which is human judgment); a test (which is executable verification).

**Perspective Set**

A named collection of viewpoints for the best-of-N pattern. When an orchestrator fans out to N clone agents, each clone analyzes from a different perspective. Perspectives are part of the orchestrator's doctrine (what work to delegate), not its ethos (what to believe).

**Best-of-N**

A delegation pattern where N agents analyze independently from different perspectives, and an orchestrator synthesizes the strongest output. Grounded in the multiple witnesses principle (Deuteronomy 19:15, *testis unus testis nullus*) and ML ensemble theory (diversity as mechanism for error reduction).

Not to be confused with: parallel execution (running multiple agents simultaneously without perspective differentiation).

**Anti-Identity**

The second half of an identity declaration -- what the agent is *not*. Without anti-identity, LLMs drift toward doing everything. Anti-identity is the agent's immune system: it rejects behaviors that would corrupt its role.

Example: "You are an architect, not a researcher, not a planner, not an implementer."

---

## Practice

**Observation**

A structured record of something noticed during real use of an archetype or ensemble. Separates what happened (fact) from what it might mean (hypothesis). Observations are the feedback loop from practice back into the derivation chain -- they capture signal from the field that may warrant changes to archetypes, framework docs, or the method itself.

Scope: Working material. Observations accumulate into pattern recognition and feed into research, specs, or archetype revisions when validated. They are lightweight by design -- frequent capture matters more than exhaustive analysis.

Lifecycle: open (captured) -> validated (signal confirmed, feeds into research/spec/archetype change) or dismissed (evaluated and closed, kept for record).

Not to be confused with: issue (something broken); idea (a raw thought or proposal); research (a deep investigation). An observation is empirical -- it records what happened, not what should happen.

---

## Deprecated Terms

These terms have been superseded. Use the preferred term.

| Deprecated | Preferred | Reason |
|---|---|---|
| component | article | "Component" had no stable structural referent across documents |
| element | article | "Element" suggests irreducible primitives; archetype pieces are structured composites |
| workflow (as a noun for process) | process | "Workflow" was ambiguous -- used for both individual process steps and entire operational setups |
| pipeline (as a noun for ensemble) | ensemble | "Pipeline" describes one topology, not the general concept of archetypes working together |
| rule (as an ethos article) | (removed) | Rules are *nomos* (external law), not *ethos* (internal character). A constitutionally charged agent derives constraints from conviction, not from NEVER/ALWAYS directives. If rules are needed, the ethos isn't deep enough. |
| harness | engine + platform | "Harness" conflated two distinct concepts: Renkei's composition layer (now "engine", `engine/`) and the host runtime (now "platform", e.g. OpenCode). Splitting clarifies ownership boundaries. |
| framework (as directory name) | authoring | The `framework/` directory was renamed to `authoring/` to better describe its purpose: archetype authoring, not a general framework. |
