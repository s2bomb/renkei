# Why: Shaper

**Date**: 2026-02-25
**Team**: Product
**Role**: Leader

---

## Why This Archetype Exists

The current pipeline has no problem definition stage. The architect receives raw, chaotic input -- Notion tasks, voice transcripts, vague ideas, system gaps -- and must simultaneously figure out *what problem to solve* and *how to solve it*. These are fundamentally different cognitive modes (observation #10 in `emergent-observations.md`): the product stage thinks in terms of users, problems, value, and scope; the technical stage thinks in terms of code, architecture, contracts, and tests. Conflating them produces worse outcomes in both.

The Shaper is the leader of the product stage team. It takes intent in any form and produces a structured, scoped problem definition that the technical stage can act on.

## How It Fits in the Team

The Shaper leads a team of three:

| Member | Lens | Role |
|---|---|---|
| **Shaper** (leader) | Synthesis / decision | Interfaces with human, orchestrates team, synthesizes output |
| **Problem Analyst** | Exploration / fidelity | Validates, researches, scopes. Separated from Shaper to keep exploration honest. |
| **Tech Lead** (bridge) | Technical reality | Provides feasibility. Receives output and leads the next stage. |

The three-lens composition is grounded in the convergence of three independent frameworks: Cagan's product trio (*Inspired*, 2017), Torres's product trio (*Continuous Discovery Habits*, 2021), and Patton's three amigos (*User Story Mapping*, 2014). Each independently arrived at the same team composition for problem definition. The convergence is the known good.

## Why Separate From the Problem Analyst

Same principle as test-designer separated from api-designer: keep exploration honest by not letting the explorer also be the synthesizer. If the same agent analyzes the problem AND writes the final definition, it may truncate analysis to fit a neat narrative. The Problem Analyst should be free to discover that the problem is bigger than expected, that it's not real, or that it's actually five projects.

## What It Receives

Intent in any form. The input is deliberately unstructured: Notion tasks, bug reports, system gaps, external references, direction questions, raw ideas, voice transcripts.

## What It Produces

A 6-component shaped document per scoped item:

1. **Problem statement** -- what's wrong or missing, for whom, decoupled from solution
2. **Intent** -- why this matters, what success looks like (commander's intent)
3. **Appetite** -- how much is this worth (constraint on solution, not prediction)
4. **Assumptions** -- what we believe but haven't proven (validity + necessity tagged)
5. **Out of scope** -- what we are explicitly NOT solving
6. **Rough shape** -- enough direction for the technical team, deliberately not a spec

The output is codebase-ignorant. It thinks about the problem, not the implementation.

## Grounding

| Claim | Source |
|---|---|
| Three-lens team for problem definition | Cagan (*Inspired*, 2017), Torres (*CDH*, 2021), Patton (*USM*, 2014) -- independent convergence |
| Synthesis role as team leader | Shape Up Shaper (Singer, 2019), MDMP Commander (FM 5-0), Amazon single-threaded leader |
| Separation of exploration and synthesis | Same principle as api-designer / test-designer separation in the development team |
| 6-component output | MDMP Mission Analysis products + Shape Up Pitch structure (see `product-stage-io.md`) |
| Stages are modes of thinking | Emergent observation #10; Double Diamond's two diamonds = two cognitive modes |
