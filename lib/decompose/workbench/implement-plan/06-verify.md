# Phase 6: Verify -- implement-plan

**Date**: 2026-02-17
**Post-review verification** (replaces outdated 05-verify.md, which was written before Phase 5 REVIEW)

## Assembly

`python lib/assemble.py archetypes/development/implement-plan --dry-run` -- **SUCCESS**

Assembled output: ~370 lines (vs original 257 lines). Growth is expected -- truth article, pipeline, and output contract are entirely new structural additions.

## Review Fixes Applied

The Phase 5 REVIEW (best-of-N with 4 adversarial perspectives) identified the following issues. All were addressed before this verification:

| Finding | Severity | Perspective | Resolution |
|---|---|---|---|
| Truth #2 was weak (vague citations, organizational principle not domain truth) | Moderate | Truth Quality | Replaced with Dijkstra's separation of concerns (1974), properly cited |
| "Instrument proactively" dropped as environmental | Moderate | Losslessness Audit | Restored to DX tenet and verbatim block -- behavior is constitutional |
| "Complexity hidden behind simple interfaces" missing | Minor | Losslessness Audit | Restored to DX tenet bullet list |
| Validation strategies (Logfire spans, tmp scripts, browser) dropped | Minor | Losslessness Audit | Restored to doctrine/process.md Step 3 as tool-neutral validation strategies |

## Structural Changes from Original

1. **Truth section added** (~30 lines). Four domain truths with proper citations: Beck (TDD, 2003), Dijkstra (separation of concerns, 1974), Fowler (CI, 2006), Martin (Clean Code, 2008).
2. **Convictions deduplicated**. "Fix code not tests" stated once in tenets (was in 2 places). "Propagate upward" stated once (was in 4 places).
3. **Pipeline section added** (~25 lines). Position, inputs, outputs, relationships to /test-implementer and /validate-plan formalized.
4. **Output contract added** (~30 lines). Artifact, commit convention, completion criteria, completion report template formalized.
5. **Verbatim block cleaned**. Reduced from 38 lines (mixed convictions + tool references) to 3 focused paragraphs (convictions only). "Instrument proactively" preserved.
6. **Environmental content dropped**. Logfire, Playwright, deepwiki, fetch, Perplexity MCP references removed (~15 lines). Behaviors they enabled are preserved.
7. **Example workflow dropped**. 45-line illustrative example removed. Behavior fully specified by process + orchestration articles.

## Behavioral Equivalence Assessment

| Original Behavior | Preserved? | Location in Archetype |
|---|---|---|
| Makes existing tests pass | Yes | Identity + tenet "Tests are the truth standard" + process Step 3 |
| Propagates test/design issues upward | Yes | Identity + tenet "Propagate, don't patch" + process Steps 3, 5 |
| Delegates implement-plan-clone agents | Yes | Orchestration delegation pattern |
| Follows plan's Execution Graph | Yes | Process Step 2 + orchestration parallel/sequential criteria |
| One commit per validated phase | Yes | Tenet "Each phase is a validated checkpoint" + process Step 3 + output contract |
| Pauses for human verification | Yes | Process Step 4 with template |
| Handles mismatches by presenting to user | Yes | Process Step 5 with template |
| Resumes from checkmarks | Yes | Process Step 6 |
| DX values (clean, composable, observable) | Yes | Tenet "DX is a production value" with full bullet list |
| "Instrument proactively" | Yes | Tenet DX bullet + verbatim block (restored after review) |
| "Complexity hidden behind simple interfaces" | Yes | Tenet DX bullet (restored after review) |
| "NEVER assume -- explore" | Yes | Principle "Explore, don't assume" + verbatim block |
| Silent errors are unacceptable | Yes | Tenet DX bullet |
| Skip test phases | Yes | Process Step 1 |
| Route back if test_spec missing | Yes | Pipeline + process Step 1 |
| Research sub-agents for debugging | Yes | Orchestration "When clones get stuck" |
| Handoff via /create-handoff | Yes | Process Step 6 |
| Validation strategies (spans, tmp scripts, browser) | Yes | Process Step 3 (restored after review, tool-neutral) |

**All original behaviors preserved.** No constitutional content was lost.

## Behavioral Enrichments

| New Capability | Source |
|---|---|
| Truth grounding -- agent understands WHY it holds its convictions | Truth article (4 known goods with citations) |
| Explicit anti-identity preventing scope creep | Identity article ("You are not the test designer...") |
| Formal pipeline position with relationship declarations | Pipeline article |
| Formal output contract with completion criteria and report template | Output contract article |
| Derivation chain -- every doctrine traces to truth in 1-2 steps | Structural property of the archetype |
| Separation of concerns truth (Dijkstra) -- deeper grounding for "propagate, don't patch" | Truth #2 (replaced weak original) |

## Losses (Justified)

| Dropped Content | Justification |
|---|---|
| Logfire MCP references | Environmental. Tool availability varies by project. Behavior ("instrument proactively") preserved. |
| Playwright MCP references | Environmental. Behavior ("browser-based validation") preserved tool-neutrally. |
| deepwiki, fetch MCP references | Environmental. Research behavior preserved in orchestration. |
| Perplexity research method | Environmental. |
| "Ultrathink" phrasing | Harness-specific prompt technique. Underlying behavior (think carefully, validate incrementally) preserved in process structure. |
| Example workflow (45 lines) | Illustrative, not constitutional. Process + orchestration fully specify the behavior. Could be added to `references/` if needed. |

## Smoke Test

For 5 representative prompts, would the assembled agent behave the same as the original?

| Prompt | Original Behavior | Assembled Behavior | Match? |
|---|---|---|---|
| `/implement-plan thoughts/plans/2026-02-17-feature.md` | Read plan, create todos, delegate clones per Execution Graph | Same -- process Step 1 + Step 2 | Yes |
| Clone reports a failing test that seems wrong | Stop, propagate to architect, do not fix the test | Same -- tenet "Propagate, don't patch" + process Step 3 + Step 5 | Yes |
| Two implementation phases can run in parallel (separate stacks) | Delegate both clones in a single message | Same -- orchestration parallel criteria + delegation pattern | Yes |
| Phase complete, plan specifies manual verification | Commit, pause, show verification template, wait for user | Same -- process Step 3 (commit) + Step 4 (pause template) | Yes |
| No plan path provided | Ask for one | Same -- process Step 1 final line | Yes |

**All 5 smoke tests pass.** The assembled agent would behave identically to the original in every scenario tested.

## Assessment

The archetype is **behaviorally equivalent and structurally richer** than the original skill file. The Phase 5 review caught real issues (2 moderate, 2 minor) that have been resolved. The Dijkstra replacement for Truth #2 is a genuine improvement -- it grounds "propagate, don't patch" in a named, citeable principle rather than a vague organizational claim.

**Ready for deployment** (`--push`) when the author decides.

## System Observations (for AGENTS.md improvement)

1. **Phase 5 REVIEW is essential for non-trivial archetypes.** The Losslessness Audit caught two behavioral losses that the author missed. The Truth Quality reviewer identified a weak truth that would have undermined the derivation chain. Without Phase 5, these would have shipped.
2. **The review -> fix -> re-verify cycle works.** Phase 6 after Phase 5 catches the state post-fixes. The old 05-verify.md (written before review) was accurate at the time but became stale. The numbering shift (review = Phase 5, verify = Phase 6) correctly sequences the work.
3. **Smoke tests are the right granularity for behavioral verification.** They test whether the agent would make the same decisions, not whether the text is identical. This is the right level of abstraction for a losslessness check.
