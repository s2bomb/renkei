# Doctrine

Doctrine is the agent's work -- what it does, how it delegates, what it produces, and how it knows the work is done. It is the domain of *doing*.

The word comes from military tradition, where doctrine is the fundamental set of principles that guide forces in action. It is not a plan for a specific operation -- it is the established body of procedures, tactics, and techniques that units follow. Doctrine is trained, drilled, and followed. The relationship to ethos is the same here: ethos is what the agent believes, doctrine is what the agent does because of those beliefs.

The pairing matters: ethos without doctrine is an agent that knows what it believes but doesn't do anything. Doctrine without ethos is an agent that follows steps but has no judgment. Beliefs without action are inert. Action without beliefs is mechanical.

## Why Doctrine Exists as a Grouping

Doctrine groups the operational content together -- everything about how the agent actually gets work done. This content has different characteristics from ethos content:

- **It changes more often.** Process steps get refined. Delegation patterns evolve as new sub-agents are added. Pipeline positions shift as the pipeline itself changes. Ethos rarely changes.

- **It's more concrete.** Ethos is "tests are specifications, not afterthoughts." Doctrine is "Step 1: Read all provided input FULLY. Step 2: Delegate research agents. Step 3: Delegate test-writer-clones in parallel."

- **It's more portable.** You can take a process from one agent and adapt it for another. You can't take tenets from the test-writer and give them to the researcher -- they have different axiologies.

## The Components

### Process

The ordered steps the agent follows from input to output.

Process is the most concrete part of an archetype. It answers the straightforward question: what does this agent actually do? Every agent has a process, from the simplest utility ("search for files matching X, return results grouped by category") to the most complex orchestrator ("read inputs, delegate N perspective clones, wait for all, synthesize, check quality gates, iterate or proceed").

Process steps are inherently prose. They contain contextual instructions, conditional logic, and domain-specific guidance that resists being reduced to structured fields. The step "If test-writer surfaces design/testability gaps, route back to /api-designer and iterate" is a process step that encodes a feedback loop -- it needs to be read and understood, not parsed by a machine.

### Orchestration

How the agent delegates work to sub-agents.

Orchestration only exists for orchestrator-type archetypes. It defines:

- **Clone types** -- Which sub-agent types this orchestrator spawns. The test-writer spawns test-writer-clones. The create-plan spawns planner-clones. The api-designer spawns design-clones.

- **Perspective sets** -- The named viewpoints for best-of-N delegation. When the spec-writer fans out to 5 clones, each gets a perspective: Technical Feasibility, UX/Workflow, Data Model, Integration, Edge Cases. The perspectives are part of the orchestrator's doctrine, not its ethos -- they define *what work to delegate*, not *what to believe*.

- **Verbatim blocks** -- What ethos content to propagate to clones. The verbatim block itself is ethos content. The act of propagating it is doctrine -- it's a delegation mechanism.

- **Quality gates** -- The criteria for evaluating sub-agent output. Quality gates are where ethos meets doctrine: the criteria reflect the agent's values (ethos) applied to concrete artifacts (doctrine). The architect's quality gate "Covers section source requirements? Concrete file:line evidence?" is an ethos value (source truth preservation) expressed as a doctrine checkpoint.

### Pipeline Position

Where the agent sits in the flow.

Pipeline position defines the agent's input/output contract relative to other agents:

- What artifacts it receives and from which upstream stage
- What artifacts it produces and for which downstream stage
- What stages come before and after

Pipeline position is a property of the agent's *relationship to the pipeline*, not of the agent itself. The same agent archetype could occupy different positions in different pipelines. The test-writer in a development pipeline receives design docs; in a review pipeline it might receive existing code.

### Output Contract

What the agent produces and in what form.

The output contract is the interface between this agent and whoever consumes its work. It defines:

- **Artifact type** -- research document, design doc, test spec, implementation plan, validation report, etc.
- **Path conventions** -- Where the artifact is written (e.g., `{project}/working/section-N-test-spec.md`)
- **Structure** -- What sections the artifact contains, what frontmatter fields are expected
- **Completion report** -- How the agent signals it is done and summarizes what it produced

Output contracts are what make pipelines composable. If the test-writer's output contract matches what the create-plan expects as input, the pipeline flows. If they diverge, the pipeline breaks silently.

## The Test

If you can change something about an agent and its *judgment* changes, that thing is ethos -- not doctrine. If changing it only affects *what work gets done* (not how the agent thinks about it), it's doctrine.
