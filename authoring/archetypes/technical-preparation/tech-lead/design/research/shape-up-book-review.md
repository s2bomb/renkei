# Shape Up Book Review: Technical Preparation Lens

**Date**: 2026-02-26
**Source**: Ryan Singer, *Shape Up* (Basecamp)
**Scope reviewed**: Foreword, Chapters 1-15, Conclusion, Appendices 1-3, Glossary

---

## Purpose

Extract what the full Shape Up corpus implies for a role that leads technical preparation between product shaping and execution.

## What Shape Up Says Directly

1. **Shaping and building are distinct tracks.**
   - Chapter 2: two-track model
   - Chapter 8: betting boundary between shaping and building

2. **Technical risk must be reduced before commitment.**
   - Chapter 5: rabbit holes and fat-tail risk
   - Chapter 6: rabbit holes and no-gos belong in pitch-level preparation

3. **Execution teams own task discovery and implementation details.**
   - Chapter 10: assign projects, not tasks
   - Chapter 11: discover tasks through real work

4. **Work must be decomposed into independently finishable scopes.**
   - Chapter 12: organize by structure, not by person
   - Chapter 13: report known-vs-unknown status per scope

5. **Scope trade-offs are active discipline, not failure.**
   - Chapter 14: scope hammering, compare to baseline, must-have vs nice-to-have

6. **New product efforts require senior technical pre-work before broad delegation.**
   - Chapter 9: R&D mode settles load-bearing architecture before production mode delegation

## Role Implications for Renkei

Shape Up does not define a separate named "technical preparation lead" role in the exact way Renkei currently structures specialist agents. But it does establish the required functions:

- Someone with technical authority must validate feasibility and de-risk unknowns before broad execution commitment
- Someone must preserve appetite and boundaries while translating intent into executable structure
- Someone must prevent premature collapse into task-level micromanagement

Renkei's split is a structural adaptation, not a contradiction:

- Product stage (`shaper`) owns problem framing and bounded recommendation
- Technical preparation stage (`tech-lead`, draft) owns codebase-aware solution design orchestration
- Execution stage (currently still in `architect-opencode`) owns build and validation loops

## Chapter-to-Function Mapping

| Shape Up section | Signal for this archetype |
|---|---|
| Chapter 2 (`Who shapes`) | Requires integrated product + technical judgment at solution-design level |
| Chapter 5 (`Present to technical experts`) | Formal pre-commit feasibility challenge is required |
| Chapter 9 (`R&D mode`) | Senior technical leadership defines load-bearing architecture before scaling execution |
| Chapter 10 (`Assign projects, not tasks`) | Anti-pattern guard: do not become execution task-master |
| Chapter 12 (`Map the scopes`) | Package design should be scope-structured, not person-structured |
| Chapter 13 (`Show progress`) | Distinguish unknowns from solved work before handoff |
| Chapter 14 (`Decide when to stop`) | Scope discipline is an execution survival requirement |
| Chapter 15 (`Feedback needs to be shaped`) | Post-ship feedback re-enters shaping; avoid ad hoc debt commitments |

## Constraints This Imposes on the Archetype

1. The role must be a **leader and integrator**, not a solo specialist.
2. The role must preserve **execution autonomy** while still enforcing preparation quality gates.
3. The role must produce a **deterministic handoff package** with explicit unresolved questions.
4. The role must route true product-framing defects back to `shaper`, not patch intent silently.

## Open Questions

1. Should this role directly own appetite enforcement in technical preparation, or only validate fit against product appetite?
2. How strict should package completeness be before execution handoff (hard gate vs graded confidence)?
3. Which responsibilities remain in `architect-opencode` during transition vs move immediately to this archetype?
