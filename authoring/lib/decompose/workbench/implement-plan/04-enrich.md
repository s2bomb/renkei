# Phase 4: Enrich -- implement-plan

**Date**: 2026-02-17

## Derivation Chain Completeness

| Truth | Therefore | Tenet | Therefore | Doctrine |
|---|---|---|---|---|
| Green phase satisfies proof obligations (Beck) | -> | Tests are the truth standard | -> | Run tests after each phase; tests transition from failing to passing (process Step 3) |
| Unreviewed changes bypass verification chain | -> | Propagate, don't patch | -> | If test seems wrong, propagate to architect (process Step 3, Step 5) |
| Incremental validated integration localizes failure (Fowler) | -> | Each phase is a validated checkpoint | -> | Commit after verification; one commit per phase (process Step 3, output-contract) |
| Code is a communication artifact (Martin) | -> | DX is a production value | -> | Clean, composable, observable code (verbatim block to clones) |

All truths ground at least one tenet. All tenets trace to at least one truth. All doctrine steps trace to an ethos article. No orphans.

## Enrichments Made

### 1. Truth article added (entirely new)

The source skill had zero domain truths stated. Four known goods were identified as implicit:
- Beck (TDD green phase)
- Systems engineering (verification chain integrity)
- Fowler (continuous integration)
- Martin (code as communication)

These truths were always operative in the skill's convictions but never made explicit. Making them explicit is the primary enrichment.

### 2. Anti-identity formalized

The source had scattered anti-identity statements. The archetype consolidates them into a single paragraph in identity.md:
- Not the test designer
- Not the test implementer
- Not the planner
- Not the architect
- Propagate problems upward

### 3. Pipeline formalized

The source had no pipeline section. Position in the ensemble was scattered across lines 9, 67, and 68. The archetype adds an explicit pipeline.md with:
- Position diagram
- Input/output declarations
- Relationship to test-implementer and validate-plan

### 4. Output contract formalized

The source had no output contract. What the agent produces was implicit in the verification steps. The archetype adds an explicit output-contract.md with:
- Artifact type (committed code)
- Commit convention
- Completion criteria
- Completion report template

### 5. Verbatim block cleaned

The source verbatim block (38 lines) mixed convictions, work methods, and tool references. The archetype verbatim block (3 paragraphs) contains only convictions:
- Tests as truth standard
- DX as production value
- Explore, don't assume

Tool references and work methods moved to doctrine or dropped as environmental.

## Shared Conviction Candidates

These convictions appear in multiple archetypes across the development ensemble:

| Conviction | implement-plan | test-implementer | test-designer |
|---|---|---|---|
| "We NEVER assume anything -- we explore the codebase for answers..." | ethos/principles + verbatim | ethos/principles + verbatim | verbatim |
| Tests as truth-seeking / discriminating power | ethos/tenets | ethos/tenets | ethos/tenets |

The "NEVER assume" principle is the strongest candidate for `_shared/ethos/`. It appears verbatim (or near-verbatim) in all three archetypes. Not extracted in this decomposition -- noted for future `_shared/` population.

## Quality Test

Can someone trace any doctrine element back to a known good in one mental step?

- "Run tests after each phase" -> tests are the truth standard -> green phase satisfies proof obligations. **Yes, one step.**
- "If test seems wrong, propagate" -> propagate, don't patch -> unreviewed changes bypass verification. **Yes, one step.**
- "Commit after verification" -> each phase is a validated checkpoint -> incremental integration localizes failure. **Yes, one step.**
- "Clean, self-documenting code" -> DX is a production value -> code is read more than written. **Yes, one step.**

All pass.
