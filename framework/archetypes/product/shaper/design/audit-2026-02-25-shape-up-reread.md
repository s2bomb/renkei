# Audit: Shape Up Re-Read vs Shaper v1

**Date**: 2026-02-25
**Scope**: Re-read Shape Up non-appendix chapters (`0.1` through `3.7`) and audit current shaper assembly artifacts.

---

## Source Re-Read Completed

Re-read source files:
- `thoughts/research/Shape-Up-Book/markdown/pages/002-0.1-foreword.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/003-0.2-acknowledgements.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/004-0.3-chapter-01.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/005-1.1-chapter-02.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/006-1.2-chapter-03.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/007-1.3-chapter-04.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/008-1.4-chapter-05.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/009-1.5-chapter-06.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/010-2.1-chapter-07.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/011-2.2-chapter-08.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/012-2.3-chapter-09.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/013-3.1-chapter-10.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/014-3.2-chapter-11.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/015-3.3-chapter-12.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/016-3.4-chapter-13.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/017-3.5-chapter-14.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/018-3.6-chapter-15.md`
- `thoughts/research/Shape-Up-Book/markdown/pages/019-3.7-conclusion.md`

---

## What Landed Correctly in Shaper v1

1. Framing before commitment is represented.
2. Appetite as fixed-time/variable-scope is represented.
3. Rough/solved/bounded shaping quality is represented.
4. Rabbit-hole and risk surfacing is represented.
5. Multi-lens synthesis is represented.

These are present in:
- `truth/*.md`
- `ethos/tenets.md`
- `doctrine/process.md`

---

## Material Gaps / Misalignments

1. **Pitch contract drift**
   - Shape Up core pitch contract is explicit: Problem, Appetite, Solution, Rabbit holes, No-gos.
   - Current template and output contract use a Renkei-expanded 6-part schema and do not explicitly keep "Rabbit holes" as a named required section.

2. **Betting-table boundary needed explicit externalization**
   - Shape Up requires leadership decision before commitment.
   - For Renkei now, this boundary is intentionally human-in-the-loop outside the shaper team.

3. **Shaper authority needed narrowing**
   - Shaper should shape and recommend; commitment authority remains with decision owner unless explicit executive directive.

4. **Source-grounding density is too thin in assembly truth articles**
   - Truth articles are concise but not as citation-dense as development archetype truth articles.
   - Given trust concerns, explicit grounding should be stronger in final truth text.

5. **Operational details from Shape Up are not explicitly captured in doctrine**
   - Default first-contact stance ("interesting, maybe some day")
   - Closed-door shaping posture before commitment
   - No-backlog/only-revived-pitches discipline

6. **Potential runtime mismatch in orchestration example**
   - `problem-analyst` delegation is referenced before that archetype exists as an implemented runtime role.

---

## Judgment

Current shaper v1 is directionally aligned and usable for early trials, but it is **not yet a faithful enough Shape Up-grounded expression** to call finished.

Primary reason: the output contract and delegation semantics needed tightening to Shape Up core structure and current OpenCode runtime constraints.

---

## Remediation Direction

1. Tighten output contract to preserve Shape Up five-part language explicitly.
2. Explicitly place commitment boundary outside shaper team (human decision gate).
3. Narrow shaper authority to shaping + recommendation, not commitment.
4. Increase source-grounding specificity inside truth articles.
5. Add explicit doctrine language for first-contact posture and backlog discipline.
6. Encode OpenCode delegation semantics: `general` subagent + first-step Skill invocation.

---

## Remediation Applied (same-day)

Implemented in:
- `doctrine/process.md`
- `doctrine/orchestration.md`
- `doctrine/pipeline.md`
- `doctrine/output-contract.md`
- `references/template.md`
- `ethos/identity.md`
- `ethos/tenets.md`
- `ethos/principles.md`

Remaining intentional follow-up:
- Increase citation density in final truth articles before declaring production-ready.
