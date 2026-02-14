# Vision

Renkei (collaboration) is a meta-layer for authoring, managing, and maintaining agent archetypes and their pipelines. It helps you build and edit the identity-driven agent definitions that power agentic harnesses like Claude Code, OpenCode, and others.

## The Problem

Agent orchestration systems are maintained through markdown files. A single skill definition conflates identity, beliefs, principles, rules, delegation patterns, quality gates, and process steps into one document. At scale this breaks down: you can't see the separation of concerns, you can't create new agents with consistent structure, shared values drift across files, and there is no observability into how your agents behave at runtime.

## The Thesis

Agent archetypes have fundamental, decomposable components. If we identify and structure these components correctly -- making them easy to author, extend, and maintain -- we can build infrastructure on top that manages the full lifecycle: from creating an agent's identity to composing pipelines to monitoring execution.

## What Renkei Is

A GUI-driven authoring environment and meta-layer that:

1. **Helps you create and maintain agent archetypes** through structured editing that understands the separation of concerns (identity, tenets, principles, rules, process, delegation, quality gates). You edit components individually. Renkei assembles them into the skill files your harness expects.

2. **Generates host-specific output.** The final artifact is a standard skill directory (e.g., a `SKILL.md` for Claude Code, an agent config for OpenCode). Renkei writes to and updates these files based on edits you make in the GUI. It is a source-of-truth that syncs to your harness's filesystem.

3. **Models pipelines as first-class concepts.** Agents don't exist in isolation -- they form pipelines with typed inputs and outputs, quality gates at transitions, and feedback loops. Renkei makes these relationships visible and editable.

4. **Provides runtime observability.** When pipelines execute, Renkei tracks stage progression, quality gate results, iteration history, and artifact production -- giving you visibility into what your agents are actually doing.

## What Renkei Is Not

- **Not a harness.** It does not replace Claude Code, OpenCode, or any agentic runtime. It drives them by maintaining the configurations they consume.
- **Not a framework.** You don't write code against a Renkei API. Renkei manages the definitions that plug into existing frameworks and tools.

## Core Concepts

### Agent Archetype ([detailed docs](./things/agent-archetype/))

The complete definition of an agent. An archetype decomposes into two domains -- **[Ethos](./things/agent-archetype/ETHOS.md)** and **[Doctrine](./things/agent-archetype/DOCTRINE.md)** -- that can be edited independently and assembled into the skill files a harness expects.

```
Archetype
  ├── Ethos (who you are -- being)
  │     ├── Identity
  │     ├── Tenets (axiology -- values, beliefs)
  │     ├── Principles (epistemology -- method, decisions)
  │     └── Rules (behavioral law -- hard constraints)
  │
  └── Doctrine (what you do -- doing)
        ├── Process (steps, workflow)
        ├── Orchestration (delegation, verbatim, quality gates)
        ├── Pipeline (position, inputs, outputs)
        └── Output Contract (artifacts, completion)
```

**Ethos** is the agent's character -- stable across workflow changes. If you rewrote every process step and the agent's judgment didn't change, that's because its ethos held.

- **Identity** -- Who the agent is and is not. Its relationship to truth and to other agents. ("You are the architect. You are not a researcher, not a planner, not an implementer.")
- **Tenets** -- What the agent believes about its domain. Shapes judgment when principles and rules are silent. ("Tests are specifications, not afterthoughts." "Silence is failure.")
- **Principles** -- How the agent operates and makes decisions. ("Agentic, not scripted." "Quality gates, not vibes.")
- **Rules** -- Hard NEVER/ALWAYS constraints. Guardrails that prevent drift. ("NEVER write research documents -- delegate /research-codebase.")

**Doctrine** is the agent's work -- changes when workflows, tools, or pipelines evolve. Ethos shapes how doctrine is executed, but doctrine can be rewritten without changing the agent's character.

- **Process** -- Ordered steps from input to output.
- **Orchestration** -- How the agent delegates: clone types, perspectives, verbatim blocks, quality gates. Only orchestrators have this.
- **Pipeline** -- Where the agent sits in the flow. What it receives, what it produces, what comes before and after.
- **Output Contract** -- What the agent produces and in what form. The interface between this agent and its consumers.

### Cross-Cutting Concepts

**Verbatim Propagation** -- The mechanism by which an orchestrator passes its ethos to sub-agents. Defined once, injected exactly into every delegation. No drift, no paraphrasing.

**Quality Gate** -- An explicit pass/fail checkpoint between pipeline stages. Evaluate artifact against criteria, then proceed or iterate.

**Pipeline** -- A graph of stages backed by agent archetypes, with typed artifacts and quality gates at transitions. Supports sequential flow, parallel fan-out, and feedback loops.

**Perspective Set** -- A named collection of viewpoints for the best-of-N pattern, where N clone agents analyze from different angles and an orchestrator synthesizes the strongest output.

## Starting Point

The first concrete implementation uses the existing development pipeline (spec, project, research, design, test-spec, plan, implement, validate) running on Claude Code as the primary example. This pipeline and its ~16 skills and ~14 sub-agents are the test bed for getting the core components right.

## Where This Goes

Once the component model is solid and the authoring experience works, Renkei becomes the place where you design, version, and deploy agent teams -- regardless of which harness executes them.
