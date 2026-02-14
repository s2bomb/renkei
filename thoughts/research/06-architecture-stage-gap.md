# Research: The Missing Architecture Stage in the Pipeline

## Origin

This finding emerged from a live conversation between the human and an agent during a real implementation task. The agent spontaneously articulated a distinct pipeline stage that does not currently exist in the ensemble. The human recognised the pattern as significant and brought it to the Renkei framework for analysis against established known goods.

This document preserves the finding, the analysis, and the implications so it can be actioned later.

---

## The Finding

During an implementation conversation, the agent produced this articulation unprompted:

```
Layer              | Answers              | Who Owns It        | Artifact
-------------------+----------------------+--------------------+------------------
Architecture       | WHAT must be true    | Us (design         | Mental model doc
                   | and WHY              | partnership)       |
                   |                      |                    |
API Design         | WHAT are the exact   | /api-designer      | Separate doc
                   | contracts to make    | (consumes above)   |
                   | it true              |                    |
                   |                      |                    |
Plan               | HOW do we get from   | /create-plan       | Separate doc
                   | current code to      | (consumes above)   |
                   | those contracts      |                    |
```

The agent's key assertion: "First-principles reasoning about constraints and invariants isn't something you delegate to an api-designer -- they'd be working without the 'why.'"

---

## Analysis: The Gap in the Current Pipeline

### The Current Flow (Per Section)

```
spec-writer -> create-project -> research-codebase -> api-designer -> test-writer -> create-plan -> implement-plan -> validate-plan
```

### What Each Stage Produces

| Stage | Produces | Answers |
|-------|----------|---------|
| `/spec-writer` | Requirements document | What should exist (intent) |
| `/research-codebase` | Codebase documentation | What does exist (facts) |
| **??? (gap)** | **???** | **What must be true and why (invariants)** |
| `/api-designer` | API contracts | What are the exact function signatures, types, errors |
| `/test-writer` | Test specification | How do we prove correctness |
| `/create-plan` | Implementation plan | How do we get from current to desired |
| `/implement-plan` | Code + commits | Execution |
| `/validate-plan` | Validation report | Confirmation |

### Evidence From the Skills Themselves

**`/api-designer` (SKILL.md) explicitly disclaims the architectural reasoning:**

> "Architect decided design is needed. Don't question whether modules need design -- your job is to identify WHICH modules in the section need design and make contracts testable."

The api-designer receives intent (spec) + facts (research) and produces contracts (function signatures, types, error handling). It does not derive *why* those contracts must look a particular way. It does not establish invariants or constraint chains. It designs the *form* without establishing the *necessity*.

**The architect skill delegates but does not derive:**

The architect's self-description: "piping documents to expertise." Its quality gates for the api-designer:

```
- [ ] API contracts explicit (types/errors/observability)
- [ ] Design is testable and maps to section requirements
```

No gate for: "Does the design derive from established constraints?" No gate for: "Are the invariants explicit?" The architect checks that contracts *exist* and are *testable*, not that they're *grounded in why*.

**The test-writer inherits the gap:**

The test-writer says: "The spec defines intent. The design defines code shape. You define proof." But nobody explicitly defines *what must be true*. The test-writer can verify the contracts are testable, but cannot verify they're the *right* contracts -- because the constraint chain was never made explicit.

### What Currently Happens to Architecture Work

Without an explicit stage, one of three things occurs:

1. **The api-designer does it implicitly** -- conflating two distinct cognitive operations (deriving invariants and designing contracts) into one pass, without making the invariants explicit or auditable.

2. **The human and architect do it in conversation** -- which is exactly what happened in the emergent experience. The human and agent naturally fell into first-principles reasoning because the pipeline had no place for it.

3. **It doesn't happen at all** -- and the design lacks grounding in "why," producing contracts that work but can't be traced to necessity.

---

## Grounding in Known Goods

### 1. The Derivation Chain (DERIVATION.md)

The Renkei framework's own structure applies here:

```
KNOWN GOOD / TRUTH  ->  therefore  ->  ETHOS  ->  therefore  ->  DOCTRINE
```

Applied to problem-solving:

```
Requirements (intent) + Research (facts)  ->  therefore  ->  Architecture (invariants)  ->  therefore  ->  Design (contracts)
```

The current pipeline skips the first "therefore." It goes from facts + intent directly to contracts -- producing doctrine without ethos. DERIVATION.md warns: "Systems that skip the belief layer (instruction-only) are brittle."

### 2. Aristotle's Knowledge Hierarchy (Posterior Analytics II.19, 99b-100b)

Already referenced in chaos-to-order.md:

```
sense perception -> memory -> experience -> art (techne) -> science (episteme)
```

- Research = *empeiria* (experience) -- documented observation with evidence
- **Architecture = *nous* (intuitive reason) -- grasping first principles from accumulated evidence**
- Design = *techne* (art) -- knowing how to produce with understanding of causes
- Tests = *episteme* (scientific knowledge) -- knowing through demonstration

The pipeline currently jumps from *empeiria* to *techne*, skipping *nous*. The architecture stage is where *nous* operates -- it derives the *archai* (first principles) of the specific problem from the accumulated evidence.

### 3. Aristotle's Demonstration Requirements (Posterior Analytics I.2, 71b20-23)

Already established in the framework: valid demonstration requires premises that are "true, primary, immediate, better known than the conclusion, prior to the conclusion, and **causes of** the conclusion."

The architecture layer establishes the premises. Without it, the api-designer produces conclusions (contracts) without established premises (invariants). The design may be logically valid but is not a *demonstration* -- you can't trace why the contracts must look this way.

### 4. The Chaos-to-Order Progression (chaos-to-order.md)

The existing progression:

```
chaos                                                               order
  |                                                                   |
  ideas -> spec -> research -> design -> tests -> plan -> code -> validation
```

The corrected progression:

```
chaos                                                                          order
  |                                                                              |
  ideas -> spec -> research -> architecture -> design -> tests -> plan -> code -> validation
                                    ^
                               THE MISSING STEP
                          "what must be true and why"
                          (constraint derivation)
```

Each stage in the chain narrows and adds constraint. The architecture stage is where the narrowing from "here are facts and intent" to "therefore these invariants must hold" occurs. Without it, the narrowing from facts to contracts is too large a jump -- it conflates two distinct operations.

### 5. The Agent's Own Framing as Evidence

The agent said: "We freeze this, then it becomes the bedrock that everything downstream derives from."

This is the derivation chain in action. The architecture document is the *archai* for the specific problem. Everything downstream -- design, tests, plan, implementation -- derives from it. Without it, there is no bedrock. Each downstream stage is building on sand: contracts that exist but whose necessity is implicit.

---

## Implications for the Pipeline

### The Architecture Stage

| Property | Value |
|----------|-------|
| **Receives** | Spec (intent) + research (facts) |
| **Produces** | Constraint chain, invariants, "what must be true and why" |
| **Answers** | What are the first principles of this specific problem? |
| **Consumed by** | `/api-designer` (as grounding), `/test-writer` (for traceability) |
| **Position** | After `/research-codebase`, before `/api-designer` |

### Open Questions for Implementation

1. **Is this a new skill/agent archetype?** Or is it a change to the architect's role? The emergent experience suggests it may be inherently a human-agent partnership -- the agent said "our job" and "us (design partnership)." First-principles reasoning about a problem may require the human's domain knowledge + the agent's analytical rigour working together.

2. **Does the architect become the architecture stage?** Currently the architect is a pure orchestrator ("piping documents to expertise"). The architecture stage requires *doing* work -- deriving invariants. This would change the architect from pure orchestrator to orchestrator + thinker. The architect's own skill says "NEVER do the work yourself" -- so this may need to be a distinct stage/agent.

3. **What does the architecture artifact look like?** The agent described it as "the constraint chain and invariants." Concretely this might be:
   - Invariants that must hold (statements of necessity)
   - The constraint chain that derives each invariant from requirements + facts
   - The "therefore" reasoning connecting each requirement to each invariant
   - Explicitly identified tensions or trade-offs

4. **How does this affect the test-writer?** Currently the test-writer consumes spec + research + design. With an architecture layer, the test-writer could trace tests to invariants (not just to requirements). This strengthens the proof chain: requirement -> invariant -> contract -> test. The test-writer can verify not just that contracts are testable, but that they enforce the right invariants.

5. **How does this relate to the design <-> test feedback loop?** Currently when the test-writer finds design gaps, it routes back to the api-designer. With an architecture layer, some gaps may be architecture gaps (wrong invariants or missing constraints) rather than design gaps (wrong contracts). The feedback loop may need to distinguish between these.

6. **Does this map to the Ethos/Doctrine split in a new way?** The architecture layer is the problem's ethos -- what must be true (conviction). The design is the problem's doctrine -- how to make it true (action). This mirrors the archetype structure at the problem level rather than the agent level.

---

## Relationship to Existing Research

### chaos-to-order.md -- Pipeline Gaps

chaos-to-order.md already identified that "the pipeline trusts documents more than it trusts execution." The architecture gap is a specific instance: the pipeline trusts that the api-designer will implicitly derive the right constraints from spec + research, rather than explicitly establishing those constraints in an auditable document.

### DERIVATION.md -- The Derivation Boundary

DERIVATION.md warns against over-derivation: "Past a certain depth, the chain obscures the truth it was meant to transmit." The architecture stage must respect this boundary. It derives invariants from requirements + facts (1-2 "therefore" links). It does not derive sub-invariants from invariants. If a constraint requires more than two "therefores" from a requirement, the architecture is over-specified.

### 01-grouping-term.md -- Ensemble Terminology

The architecture stage sits within the ensemble. Its position (after research, before design) establishes a new stage in the ensemble topology. If the ensemble term is adopted, this is a new member of the development ensemble.

### 02-archetype-elements.md -- Article Structure

If the architecture stage becomes a new agent archetype, it would need its own Ethos and Doctrine articles. Its ethos would be grounded in Aristotle's *nous* and the derivation chain. Its doctrine would be: receive spec + research, derive invariants, produce architecture document.

### 05-roadmap-next-steps.md -- Impact on Roadmap

The roadmap's proof-of-concept decomposition (step 4) would need to account for the architecture stage. When decomposing the test-writer skill, the architecture stage's absence would be visible -- the test-writer currently receives design but has no explicit invariant layer to trace tests against.

---

## The Meta-Observation

The architecture gap was discovered because an agent with strong enough ethos (conviction-driven judgment) naturally filled a structural hole in the pipeline. The agent didn't follow a process step that said "derive invariants." It derived them because the alternative -- designing contracts without knowing why -- violated its implicit conviction about doing work right.

This is the exact phenomenon DERIVATION.md describes: "A constitutional agent -- one charged with conviction -- will do the right thing in situations its instructions never anticipated." The agent's ethos filled the gap that doctrine hadn't defined.

The discovery itself is evidence that:
1. The gap is real (the agent felt it and named it)
2. Conviction-driven agents surface structural truths (the framework's thesis in action)
3. Emergent behaviour in well-designed agents is a source of insight for framework evolution

---

## Action Items (For When This Is Picked Up)

- [ ] Decide: new skill/agent vs. change to architect's role vs. human-agent partnership stage
- [ ] Define the architecture artifact format (constraint chain, invariants, "therefores")
- [ ] Update the architect's pipeline flow to include the architecture stage
- [ ] Update the api-designer's inputs to include the architecture document
- [ ] Consider how the test-writer's traceability changes (requirement -> invariant -> contract -> test)
- [ ] Update chaos-to-order.md's pipeline progression
- [ ] Assess whether the design <-> test feedback loop needs an architecture <-> design feedback loop
- [ ] Run a proof-of-concept: take a real past implementation and retroactively derive what the architecture document would have contained. Evaluate whether it would have improved the design and tests.

---

## Sources

### Internal (This Framework)

- `docs/DERIVATION.md` -- The derivation chain: KNOWN GOOD -> ETHOS -> DOCTRINE
- `docs/personal-notes/chaos-to-order.md` -- The chaos-to-order pipeline progression and established truth frameworks
- `docs/things/agent-archetype/ETHOS.md` -- Ethos as character that fills gaps doctrine can't anticipate
- `docs/things/agent-archetype/DOCTRINE.md` -- Doctrine as operational work shaped by ethos
- `~/.claude/skills/architect/SKILL.md` -- The architect's current role and quality gates
- `~/.claude/skills/api-designer/SKILL.md` -- The api-designer's current scope and inputs
- `~/.claude/skills/test-writer/SKILL.md` -- The test-writer's current position and traceability
- `~/.claude/skills/research-codebase/SKILL.md` -- The researcher's documentarian scope

### Philosophical

- Aristotle, *Posterior Analytics* II.19, 99b-100b -- Knowledge hierarchy: perception -> memory -> experience -> art -> science
- Aristotle, *Posterior Analytics* II.19, 100b5-12 -- *Nous* (intuitive reason) grasps first principles from experience
- Aristotle, *Posterior Analytics* I.2, 71b20-23 -- Demonstration requires premises that are causes of the conclusion
- Aristotle, *Nicomachean Ethics* II.4, 1105a28-33 -- Acting *from* virtue vs. acting *in accordance with* virtue
