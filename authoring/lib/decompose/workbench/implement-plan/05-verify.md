# ~~Phase 5: Verify~~ -- SUPERSEDED

> **This file is outdated.** It was written as Phase 5 (verify) before the best-of-N review was added as Phase 5 (REVIEW). Verification is now Phase 6. The current verification report is `06-verify.md`. This file is retained as historical record only.

**Date**: 2026-02-17 (pre-review)

## Assembly

`python lib/assemble.py archetypes/development/implement-plan --dry-run` -- **SUCCESS**

Assembled output: ~340 lines (vs original 257 lines).

## Structural Changes

The assembled output is structurally different from the original:

1. **Truth section added** (~30 lines). Entirely new. Four domain truths with citations that were implicit in the original.
2. **Convictions deduplicated**. "Fix code not tests" stated once in tenets (was in 2 places). "Propagate upward" stated once (was in 4 places).
3. **Pipeline section added** (~25 lines). Position, inputs, outputs, relationships formalized.
4. **Output contract added** (~30 lines). Artifact, commit convention, completion criteria, report template formalized.
5. **Verbatim block cleaned**. Reduced from 38 lines (mixed convictions + tools) to 3 paragraphs (convictions only).
6. **Environmental content dropped**. Logfire, Playwright, deepwiki, fetch, perplexity references removed (~15 lines).
7. **Example workflow dropped**. Illustrative example removed (~45 lines). Behavior fully specified by process + orchestration.

## Behavioral Equivalence Assessment

| Original Behavior | Preserved? | Notes |
|---|---|---|
| Makes existing tests pass | Yes | Identity + tenet + process Step 3 |
| Propagates test/design issues upward | Yes | Identity + tenet + process Step 3, 5 |
| Delegates implement-plan-clone agents | Yes | Orchestration |
| Follows plan's Execution Graph | Yes | Process Step 2 + orchestration |
| One commit per validated phase | Yes | Tenet + process Step 3 + output contract |
| Pauses for human verification | Yes | Process Step 4 |
| Handles mismatches by presenting to user | Yes | Process Step 5 |
| Resumes from checkmarks | Yes | Process Step 6 |
| DX values (clean, composable, observable) | Yes | Tenet + verbatim block |
| "NEVER assume -- explore" | Yes | Principle + verbatim block |
| Skip test phases | Yes | Process Step 1 |
| Route back if test_spec missing | Yes | Pipeline + process Step 1 |
| Research sub-agents for debugging | Yes | Orchestration "when clones get stuck" |
| Handoff via /create-handoff | Yes | Process Step 6 |

**All original behaviors preserved.**

## Behavioral Enrichments

| New Behavior | Source |
|---|---|
| Truth grounding -- agent understands WHY it does what it does | Truth article |
| Explicit anti-identity preventing scope creep | Identity article |
| Formal pipeline position with relationship declarations | Pipeline article |
| Formal output contract with completion criteria | Output contract article |
| Quality test: every doctrine traces to truth in one step | Derivation chain |

## Losses

| Dropped Content | Justification |
|---|---|
| Logfire MCP references | Environmental. Tool availability varies by project. |
| Playwright MCP references | Environmental. |
| deepwiki, fetch MCP references | Environmental. |
| Perplexity research method | Environmental. |
| "Ultrathink" phrasing | Harness-specific prompt technique. Underlying behavior preserved in process structure. |
| Example workflow | Illustrative, not constitutional. Process + orchestration fully specify the behavior. |

**Assessment**: All losses are environmental or illustrative. No constitutional content was dropped. The archetype is behaviorally equivalent and structurally richer than the original.

## System Observations (for AGENTS.md improvement)

1. **The audit phase is the most valuable phase.** It forces you to understand every line before touching anything. Without it, the restructuring would have been lossy.
2. **Environmental content is easy to identify but requires explicit justification for dropping.** The losslessness table in Phase 3 makes this visible.
3. **Redundancy is signal, not noise.** The 4x repetition of "propagate don't patch" in the original shows it's the most important conviction. In the archetype it's stated once but its importance is preserved by being the second tenet.
4. **The truth phase (Phase 2) is the hardest but most enriching.** Finding the implicit truths required domain research. The result is an agent that understands its own foundations.
5. **The example workflow question.** The original had a 45-line example. Dropping it is defensible (not constitutional) but the example did serve a communication purpose. Future consideration: should archetypes support a "references/examples/" section for non-template reference material?
