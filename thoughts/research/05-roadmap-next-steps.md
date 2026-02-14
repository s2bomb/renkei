# Research Paper 05: Project WHY, Codification, and Logical Next Steps

## Research Question

How should Renkei's mission be codified, what are the concrete next steps in dependency order, and what does "practice with real archetypes" look like before building a GUI?

---

## 1. Codifying the WHY

### The Mission (Stated)

Renkei exists to **define and audit agent archetypes from the most fundamental level, so that agents invoked with a prompt are constitutionally charged with conviction -- they do the right thing not because they're told, but because they are zealots for their beliefs.**

The framework: KNOWN GOOD / TRUTH -> therefore -> ETHOS -> therefore -> DOCTRINE (see DERIVATION.md).

### What Form Should the Mission Take?

Successful framework projects codify their mission in one of several forms. The evidence from established projects shows which forms survive and which are decorative.

**Design Principles Document (React model).** React publishes a design principles document that functions as constitutional law for framework evolution. The React team frames these as active decision-making tools: "we wrote this document so that you have a better idea of how we decide what React does and what React doesn't do." Principles are not aspirational -- they are filters. Contributions that violate them are rejected. This form is concise, actionable, and has a clear enforcement mechanism: decisions are measured against it.

**Doctrine (Rails model).** Ruby on Rails publishes a "Doctrine" -- a document that integrates philosophical commitments with technical choices. The Rails Doctrine explicitly embraces internal tension, describing Rails as "a quilt" rather than "a single, perfect cut of cloth." It answers both "why does Rails exist?" and "what tradeoffs does Rails accept?" The doctrine form is richer than pure design principles but longer. It works because Rails has a single strong author (DHH) who treats the doctrine as living law.

**Vision + Design Axioms (Rust model).** Rust uses a layered system: a vision document (refreshed through community input), design axioms, and project goals. The Rust vision document was informed by over 4,200 community responses. This form is appropriate for large, distributed projects where mission must be negotiated across many stakeholders. Renkei is not there yet.

**Charter / Founding Principles (HashiCorp model).** HashiCorp publishes organizational principles (integrity, pragmatism, vision, execution, communication) that flow into technical decisions. This form is appropriate when the project is also an organization.

### Recommendation: A Single WHY Document

Renkei's situation is specific: one author, a framework grounded in philosophical derivation, and existing documentation that already contains the mission in distributed form (DERIVATION.md, vision.md, chaos-to-order.md). The right form is:

**A single WHY.md at the project root** that contains:

1. **The WHY statement** (2-3 sentences). What Renkei exists to do and why it matters. This already exists in the mission statement above.
2. **The derivation chain** (the KNOWN GOOD -> ETHOS -> DOCTRINE structure). This is the framework's own known good. It is already documented in DERIVATION.md but should be referenced from WHY.md, not duplicated.
3. **The decision filter** (React model). A short list of principles that determine what Renkei does and does not do. These are not aspirational -- they are grounds for rejecting features. Examples from the existing docs:
   - Renkei decomposes and assembles; it does not execute.
   - Components must trace to known goods, not preferences.
   - Ethos and doctrine are separate concerns with different change frequencies.
   - The derivation chain has a natural depth limit (1-2 "therefores"). Over-derivation is a defect, not thoroughness.
4. **The test** (from DERIVATION.md). "Can someone reading this derivation trace it back to the known good in one mental step?" This is the quality gate for the framework's own content.

This form works because:
- It is short enough to read in full before making any decision.
- It has an enforcement mechanism (the decision filter).
- It traces to the project's own known goods (not invented, identified).
- It avoids the Rails Doctrine's length problem while preserving its philosophical depth.

The WHY.md should NOT be a manifesto. Manifestos are declarations of rebellion; Renkei is not rebelling against anything. It is a framework for building agents with conviction. The tone should be the same tone as DERIVATION.md: grounded, citeable, inarguable within its domain.

### Known Good: How Durable Systems Codify Mission

The pattern from DERIVATION.md applies here: durable systems transmit truths -> beliefs -> practices. The WHY.md is the project's own truth layer. The existing docs (ETHOS.md, DOCTRINE.md, etc.) are the belief layer. The tooling (assembly scripts, GUI, CLI) is the practice layer.

This is the project eating its own dogfood at the meta level: Renkei's mission is structured the same way Renkei structures agent archetypes.

---

## 2. The Critical Path: What Must Happen Before What

### Dependencies (Strict Ordering)

The following must happen in this order because each step depends on the outputs of the previous:

```
1. Finalize taxonomy and component model
   |
   +-- depends on: research papers 01-04 (terminology, elements, taxonomy, filesystem)
   |
2. Codify the WHY (WHY.md)
   |
   +-- depends on: taxonomy being settled (so the WHY references stable terms)
   |
3. Define the file system structure
   |
   +-- depends on: taxonomy (directory names = taxonomy terms)
   |
4. Decompose ONE real archetype as proof of concept
   |
   +-- depends on: file system structure (you need directories to put files in)
   |
5. Write the assembly script
   |
   +-- depends on: having decomposed components to assemble
   |
6. Validate round-trip fidelity (original skill file <-> assembled output)
   |
   +-- depends on: assembly script + decomposed components
   |
7. Iterate on taxonomy/structure based on round-trip findings
   |
   +-- depends on: round-trip results
   |
8. Decompose ALL real archetypes (~16 skills, ~14 sub-agents)
   |
   +-- depends on: validated taxonomy from proof-of-concept
   |
9. Build GUI
   |
   +-- depends on: stable component model proven against real archetypes
   |
10. Build conversion tools (import existing skills, export to harness formats)
    |
    +-- depends on: GUI + assembly mechanism being stable
```

### Steps 1-3: Foundation (Can Be Parallelized Partially)

Steps 1-3 are partially parallelizable. The taxonomy and component model (step 1) inform both the WHY document (step 2) and the file system structure (step 3). However, steps 2 and 3 can proceed concurrently once step 1 is done.

**Step 1: Finalize taxonomy.** The research papers (01-04) feed into this. The output is a single, authoritative taxonomy document that names every component, defines its boundaries, and establishes relationships.

**Step 2: Codify the WHY.** Write WHY.md per the recommendation above. This is a short task once the taxonomy is stable.

**Step 3: Define file system structure.** The directory layout where decomposed archetypes live. This depends on taxonomy because directory names must match component names.

### Step 4: The Proof of Concept (Critical)

This is the most important single step. It validates everything that came before and determines whether the taxonomy and file structure actually work.

**Which archetype to decompose first?** The test-writer skill. Reasons:

1. It is the most thoroughly documented archetype in the existing system (chaos-to-order.md contains a complete ethos/doctrine analysis).
2. It exercises the most components: identity, anti-identity, tenets, principles, rules, process, orchestration (clone delegation with perspectives), pipeline position, output contract, quality gates, and verbatim propagation.
3. It is already decomposed conceptually in the docs. The proof of concept would be making that decomposition physical -- actual files in actual directories.
4. If the taxonomy can handle the test-writer, it can handle simpler archetypes (research-codebase, create-project, etc.) without modification.

**Why not a simpler archetype?** A utility agent like research-codebase has no orchestration, no perspectives, no verbatim propagation. Decomposing it would not validate the hard parts of the taxonomy. The proof of concept must exercise the full component model to be meaningful. This follows Popper's falsifiability criterion from the project's own doctrine: the proof of concept must be capable of revealing problems, not just confirming the easy cases.

### Steps 5-7: Assembly and Round-Trip Validation

**Step 5: Assembly script.** A script (likely shell or Python) that reads the decomposed component files and produces a single SKILL.md in the format Claude Code expects. This is the first piece of actual tooling.

**Step 6: Round-trip validation.** The assembled SKILL.md is diffed against the original. The diff reveals:
- **Information loss**: Components present in the original that have no place in the taxonomy. These indicate missing taxonomy categories.
- **Information gain**: Content added by assembly that isn't in the original. These indicate the taxonomy is over-specified.
- **Ordering issues**: Content that appears in a different order. These indicate the assembly script's concatenation logic needs work.
- **Semantic equivalence**: Content that differs in wording but means the same thing. These are acceptable if the meaning is preserved.

The fidelity target is semantic equivalence, not byte-for-byte identity. The original SKILL.md was written as a flat document; the assembled output will be structured differently. What matters is that an agent invoked with either document would behave identically.

**Step 7: Iterate.** The round-trip results feed back into the taxonomy and file structure. This is expected -- no decomposition model is right on the first try. The iteration loop is: decompose -> assemble -> diff -> adjust taxonomy -> re-decompose -> re-assemble -> re-diff. The loop terminates when the diff contains only acceptable ordering/formatting differences.

### Step 8: Scale to All Archetypes

Once the proof of concept validates the taxonomy against the hardest case, decompose all ~16 skills and ~14 sub-agents. This step will surface:
- Components shared across multiple archetypes (shared tenets, shared rules).
- Inheritance patterns (sub-agent archetypes that derive from parent archetypes).
- Pipeline-level concerns that don't fit into individual archetype decomposition.

### Steps 9-10: GUI and Conversion Tools

These come last because they depend on a stable component model. Building the GUI before practicing with real archetypes risks encoding wrong assumptions into the interface. The user has correctly identified this: **practice first, GUI second.**

---

## 3. What "Practice With Real Archetypes" Looks Like Concretely

"Practice" means doing the decomposition-assembly cycle by hand, without a GUI, using real files from the existing development pipeline. Concretely:

### Phase A: Single Archetype Proof of Concept

1. **Select the test-writer skill** (the hardest case).
2. **Create the directory structure** per the file system design (from research paper 04).
3. **Manually decompose** the existing SKILL.md into component files:
   - `identity.md` -- identity + anti-identity
   - `tenets.md` -- axiological commitments
   - `principles.md` -- epistemological commitments
   - `rules.md` -- hard constraints
   - `process.md` -- ordered steps
   - `orchestration.md` -- delegation patterns, perspectives, verbatim blocks
   - `pipeline.md` -- position, inputs, outputs
   - `output-contract.md` -- artifacts, completion criteria
4. **Write a manifest file** (YAML or similar) that declares the archetype's metadata and references its components.
5. **Write the assembly script** that reads the manifest and component files and produces a SKILL.md.
6. **Diff** the assembled output against the original SKILL.md.
7. **Iterate** until semantic equivalence is achieved.

### Phase B: Second Archetype (Validation)

1. **Select a simpler archetype** (e.g., research-codebase -- a worker with no orchestration).
2. **Decompose it** using the same structure. Verify that components that don't apply (orchestration, perspectives) are cleanly absent, not awkwardly empty.
3. **Assemble and diff.** This validates that the taxonomy handles both complex and simple archetypes.

### Phase C: Shared Components

1. **Identify shared ethos components** across archetypes (e.g., tenets that multiple agents hold).
2. **Extract shared components** into a shared location.
3. **Update the manifest files** to reference shared components.
4. **Reassemble and diff** all affected archetypes to verify that sharing doesn't introduce drift.

### Phase D: Full Pipeline

1. **Decompose all ~16 skills and ~14 sub-agents.**
2. **Assemble all of them.**
3. **Run the actual development pipeline** using assembled SKILL.md files instead of the originals. This is the ultimate dogfood test: if the assembled skills produce the same pipeline behavior as the originals, the decomposition is faithful.

---

## 4. Risks and Failure Modes

### Risk 1: Taxonomy Doesn't Fit Real Archetypes

**Symptom:** During decomposition, content from the original skill file has no natural home in any component category. It gets forced into the wrong category or left out entirely.

**Mitigation:** The proof-of-concept step (step 4) exists specifically to catch this. Use the hardest archetype first (test-writer) to maximize the chance of surfacing taxonomy gaps early.

**Detection:** The round-trip diff shows information loss -- content present in the original that's missing from the assembled output.

### Risk 2: Over-Engineering the Taxonomy

**Symptom:** The taxonomy has more categories than any real archetype needs. Many component files are empty or trivially short. The decomposition feels like paperwork rather than illumination.

**Mitigation:** Apply the project's own derivation boundary principle: if a component requires more than two "therefores" to justify its existence as a separate thing, it should be merged. The test from DERIVATION.md applies: "Can someone reading this derivation trace it back to the known good in one mental step?"

**Detection:** Multiple archetypes have empty component files for the same category. This means the category is not universal and should either be optional or removed.

### Risk 3: Assembly Destroys Emergent Properties

**Symptom:** The assembled SKILL.md is semantically correct -- every component is present -- but an agent invoked with it behaves differently than one invoked with the original. The whole is not the sum of the parts.

**Root cause:** The original skill file has emergent properties that arise from the juxtaposition of components. For example, a tenet placed immediately before a process step might cause the LLM to apply the tenet specifically to that step. Decomposing them into separate files and reassembling in a fixed order loses this context.

**Mitigation:** During assembly, test different ordering strategies. Include the option for archetype authors to specify assembly order or insert bridging text. Monitor for behavioral differences, not just textual differences.

**Detection:** Phase D (running the pipeline with assembled skills). This is why full pipeline testing is necessary -- textual diff alone won't catch behavioral drift.

### Risk 4: Shared Components Create Invisible Coupling

**Symptom:** Updating a shared tenet (e.g., "silence is failure") to improve one archetype inadvertently changes the behavior of other archetypes that reference it.

**Mitigation:** Shared components should be versioned or pinned. An archetype references a specific version of a shared component, not the latest. Changes to shared components propagate only when the archetype author explicitly updates the reference.

**Detection:** Assembly-time warnings when shared component versions change. Diff-based audit showing which archetypes are affected by a shared component change.

### Risk 5: The Framework Becomes More Complex Than the Problem

**Symptom:** The decomposition framework requires more cognitive overhead to maintain than the original flat skill files. Authors prefer writing monolithic SKILL.md files because the framework adds structure without adding value.

**Root cause:** This is the "abstraction mania" pathology described in DERIVATION.md. The framework adds indirection without adding capability. The decomposition is formally correct but practically useless.

**Mitigation:** The value test for every component: does this decomposition make it easier to author, review, or maintain agent archetypes? If the answer is no for a given component, the component should not exist.

**Detection:** User resistance. If the framework author (the only user during practice phase) finds it burdensome, it will be worse for others. Honest self-assessment during the practice phase is the primary detector.

### Risk 6: Premature GUI Commitment

**Symptom:** Building the GUI before the component model is stable, then discovering that the GUI encodes wrong assumptions that are expensive to change.

**Mitigation:** The user has already identified this risk and decided: practice first, GUI second. The mitigation is to not deviate from this decision under pressure to "see something visual." The practice phase must produce a stable, validated component model before any GUI work begins.

**Detection:** The temptation itself. If there is pressure to build the GUI before all archetypes are decomposed and assembled successfully, that is the signal to resist.

---

## 5. How Other Frameworks Bootstrap (Dogfooding Patterns)

### Rails: Extract from Real Product

Ruby on Rails was not designed as an abstract framework. It was extracted from Basecamp, a working product. DHH built Basecamp, noticed reusable patterns, and extracted them into Rails. The bootstrap sequence: build a specific application -> notice patterns -> extract the framework -> release publicly.

**Renkei parallel:** The existing ~16 skills and ~14 sub-agents are Renkei's Basecamp. The framework should be extracted from the patterns in these real archetypes, not designed in the abstract and then imposed on them. The proof-of-concept decomposition is the extraction step.

### Rust: Schema-First Then Self-Hosting

Rust built a bootstrap compiler in OCaml, then used it to build the first self-hosting Rust compiler. The language's mission (memory safety without garbage collection) determined the bootstrap sequence -- the type system had to work before anything else.

**Renkei parallel:** The taxonomy (component model) is Renkei's type system. It must be correct before the assembly mechanism can work. Getting the taxonomy right is the equivalent of Rust getting its ownership model right -- everything downstream depends on it.

### React: Dogfooding as Design Principle

React explicitly codifies dogfooding: "we try our best to address the problems raised by the community. However we are likely to prioritize the issues that people are also experiencing internally at Facebook." Internal usage provides irreplaceable signal about what problems actually matter.

**Renkei parallel:** The practice phase IS the dogfooding. The framework author using their own archetypes as the test bed provides signal that abstract design cannot. If the decomposition doesn't work for the author's own skills, it won't work for anyone else's.

### The Hybrid Bootstrap (Recommended for Renkei)

The research on configuration decomposition systems recommends a hybrid approach:

1. **Minimal schema** capturing core abstractions (the taxonomy from research papers 01-04).
2. **Proof of concept** that tests the schema against one real case (test-writer decomposition).
3. **Schema refinement** based on what the proof of concept reveals.
4. **Full implementation** only after the schema is validated.

This avoids two failure modes:
- **Pure schema-first**: designing a perfect taxonomy in the abstract that doesn't fit real archetypes.
- **Pure implementation-first**: building tooling that encodes wrong assumptions because the model was never validated.

The hybrid approach is exactly what the user's stated progression achieves: framework docs (schema) -> practice with real archetypes (proof of concept) -> iterate -> GUI (full implementation).

---

## 6. Concrete Roadmap

### Milestone 1: Foundation (Now)

- [ ] Complete research papers 01-05
- [ ] Synthesize research into a single authoritative taxonomy document
- [ ] Write WHY.md

### Milestone 2: File System and Single Proof of Concept

- [ ] Define the directory structure for decomposed archetypes
- [ ] Manually decompose the test-writer skill into component files
- [ ] Write a manifest format (YAML or similar)
- [ ] Write an assembly script that produces SKILL.md from components
- [ ] Achieve semantic equivalence in round-trip diff

### Milestone 3: Validation and Iteration

- [ ] Decompose a second archetype (simpler case, e.g., research-codebase)
- [ ] Extract shared components where they exist
- [ ] Iterate on taxonomy based on findings from both archetypes
- [ ] Document lessons learned and taxonomy adjustments

### Milestone 4: Full Scale Practice

- [ ] Decompose all ~16 skills and ~14 sub-agents
- [ ] Assemble all archetypes
- [ ] Run the development pipeline using assembled skill files
- [ ] Validate behavioral equivalence (pipeline produces same results)

### Milestone 5: GUI

- [ ] Design the GUI based on the validated component model
- [ ] Build the authoring environment
- [ ] Build conversion tools (import/export)

### Milestone 6: Runtime Observability

- [ ] Pipeline tracking (stage progression, quality gate results)
- [ ] Iteration history
- [ ] Artifact production monitoring

---

## 7. The Meta-Observation

The roadmap itself follows the project's own derivation chain:

- **Known good**: Hybrid bootstrapping (schema + proof of concept) produces better results than either approach alone. This is established by the configuration decomposition literature and by the patterns of successful framework projects (Rails, Rust, React).
- **Therefore (ethos)**: Renkei should practice with real archetypes before building tooling. The taxonomy must be validated against the hardest case, not the easiest.
- **Therefore (doctrine)**: Decompose the test-writer first. Write the assembly script. Diff the output. Iterate. Then scale. Then GUI.

The project is eating its own dogfood from the very first step.

---

## Sources

### Framework Mission Codification
- React Design Principles: https://legacy.reactjs.org/docs/design-principles.html
- Rails Doctrine: https://rubyonrails.org/doctrine
- Rust Vision Document: https://blog.rust-lang.org/2025/12/03/lessons-learned-from-the-rust-vision-doc-process/
- HashiCorp Principles: https://www.hashicorp.com/en/our-principles
- Django Design Philosophies: https://docs.djangoproject.com/en/6.0/misc/design-philosophies/

### Decomposition and Assembly
- Cambridge: "Decomposition Strategies for Configuration Problems" (AI EDAM)
- HashiCorp: "How to Decompose Monolithic Terraform Configurations"
- Swagger: "Code First vs Design First API" https://swagger.io/blog/code-first-vs-design-first-api/
- ruamel.yaml round-trip preservation: https://pypi.org/project/ruamel.yaml/

### Dogfooding
- React (dogfooding as design principle): https://legacy.reactjs.org/docs/design-principles.html
- Rails (extracted from Basecamp): https://thehistoryoftheweb.com/ruby-on-rails/
- TestDevLab: "Dogfooding: A Quick Guide": https://www.testdevlab.com/blog/dogfooding-a-quick-guide-to-internal-beta-testing

### Project Internal Sources
- DERIVATION.md -- The derivation chain and its philosophical grounding
- vision.md -- Project scope and core concepts
- chaos-to-order.md -- Truth-seeking pipeline thesis and established truth frameworks
- ETHOS.md -- Ethos domain structure and rationale
- DOCTRINE.md -- Doctrine domain structure and rationale
