# Why: Tech Lead

**Date**: 2026-02-26
**Team**: Technical Preparation (provisional)
**Role**: Leader

---

## Why This Archetype Exists

The current `architect-opencode` role is overloaded. It receives active shaped work, runs technical preparation, runs execution orchestration, and owns final validation flow. This bundles two distinct cognitive stages into one role:

1. Translating shaped intent into an implementation-ready technical package
2. Driving day-to-day execution against that package

The first stage needs a specialist leader whose primary concern is technical preparation quality: clarity of contracts, risk removal, testability, phase sequencing, and handoff integrity.

## Team Fit

This role is the bridge between product and execution.

- Upstream: receives `active` shaped artifacts from `shaper`
- Downstream: delegates and synthesizes technical-preparation specialists (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`)
- Downstream handoff: passes approved package to `execution-lead` for execution

Chain-of-command intent: the leader of the next stage participates in the previous stage, then assumes ownership when the item transitions to `active`.

## What It Receives

- Active shaped artifact(s) from product stage
- Source documents and project container context
- Explicit appetite, boundaries, no-gos, and open assumptions

## What It Produces

One implementation-ready package per active item:

- Enriched technical spec
- Codebase research record
- API design contracts
- Test design specification
- Phase plan with validation obligations
- Explicit unresolved decisions (if any) requiring decision-owner input

## Role Boundaries

- Owns technical preparation orchestration and quality gates
- Does not rewrite product intent or reopen product framing by default
- Does not implement code directly
- Does not collapse into execution ownership unless explicitly asked

## Naming Direction (Draft)

Recommended working name: `tech-lead`.

Reason: it names stage ownership without inheriting the overloaded `architect` label. It aligns with product-trio terminology (engineer/tech lead lens) and preserves continuity with existing product-stage references.

## Grounding

- Shape Up, Chapter 2 (`Who shapes`): solution design requires technical literacy and integration across design/technical/business lenses
- Shape Up, Chapter 5 (`Present to technical experts`): de-risk unknowns before commitment
- Shape Up, Chapter 9 (`R&D mode` -> `Production mode`): senior technical leadership settles load-bearing structure before wider execution
- Shape Up, Chapter 10 (`Assign projects, not tasks`): preparation must preserve team autonomy and avoid task-master behavior
- Shape Up, Chapters 12-14: scopes, unknown-vs-known sequencing, and scope hammering are explicit risk controls
- Existing `architect-opencode` skill audit: role currently spans both technical preparation and execution and is ready for staged split
