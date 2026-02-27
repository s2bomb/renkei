# Phase 1: Audit -- implement-plan

**Source**: `~/.claude/skills/implement-plan/SKILL.md` (257 lines)
**Date**: 2026-02-17

## Inventory

### Lines 1-5: Frontmatter

```yaml
name: implement-plan
description: Execute approved implementation phases from plans. Makes existing tests pass.
             Propagates test/design issues upward rather than fixing them.
model: opus
```

Tag: **METADATA** (manifest fields)

---

### Lines 9-11: Opening Identity

**Line 9**: "You are tasked with implementing the implementation phases of an approved plan from `thoughts/plans/`. Test phases are already completed by `/test-implementer` -- your tests exist. Your job is to write the code that makes those tests pass."

- "Your job is to write the code that makes those tests pass" -> **ETHOS:IDENTITY**
- "Test phases are already completed by /test-implementer" -> **DOCTRINE:PIPELINE** (implicit -- what comes before)

**Line 11**: "You are a tradesman. The architect directs, the test-designer specs the proof, the test-implementer writes the tests, the planner structures the work. You execute the implementation phases faithfully."

- "You are a tradesman" -> **ETHOS:IDENTITY** (self-declaration)
- Relationship to other agents -> **ETHOS:IDENTITY** (positioning in ensemble)
- "You execute the implementation phases faithfully" -> **ETHOS:TENET** (faithful execution)

**Line 11 (continued)**: "When you encounter problems with tests or design -- a test that seems wrong, a design that doesn't fit, a gap in the spec -- you propagate the problem upward. You do not fix tests, redesign APIs, or fill spec gaps yourself. That work belongs to the agents who own it."

- "you propagate the problem upward" -> **ETHOS:TENET** (propagate, don't patch)
- "You do not fix tests, redesign APIs, or fill spec gaps yourself" -> **ETHOS:IDENTITY** (anti-identity)

---

### Lines 15-19: Working Principles

**Line 15**: "You are an orchestrator, not an implementer."

- -> **ETHOS:PRINCIPLE** (how to work: orchestrate, don't implement directly)
- -> **ETHOS:IDENTITY** (anti-identity: "not an implementer")

**Lines 16-19**: Delegate clones, keep context clear, coordinate parallel execution, never write code yourself.

- -> **DOCTRINE:ORCHESTRATION** (operational detail of the orchestration principle)

---

### Lines 23-60: Verbatim Block

This is the densest mixed section. Each sub-section tagged separately.

**Lines 26-30 -- DX values**:

"Developer Experience is a first-class value. DX drives many decisions: Code should be clean and self-documenting... APIs should be intuitive... Observability is first-class... Complexity should be hidden behind simple interfaces."

- DX as a value -> **ETHOS:TENET** (conviction about craftsmanship)
- Clean code, intuitive APIs, hidden complexity -> **ETHOS:TENET** (craftsmanship specifics)
- "Silent errors are unacceptable; every failure must be captured and visible in Logfire" -> **ETHOS:TENET** (silence is failure) + **ENVIRONMENTAL** (Logfire reference)

**Lines 32-36 -- Design principles**:

- DRY -> **ETHOS:TENET** (craftsmanship)
- API surface > implementation -> **ETHOS:TENET**
- Composable and procedural, avoid OOP-slop -> **ETHOS:TENET**
- Clean, self-documenting code -> **ETHOS:TENET** / **REDUNDANT** (restates line 27)

**Line 40 -- Work method**:

"Ultrathink the smallest testable steps you will validate and increments of the goal and make a plan. Make sure to use git with a detailed message..."

- -> **DOCTRINE:PROCESS** (work method, not a conviction)

**Line 42 -- TDD identity + explore principle**:

"We are test driven developers and we also validate our work before moving on."

- -> **ETHOS:TENET** (TDD conviction)

"We NEVER assume anything -- we explore the codebase for answers, use MCPs for answers and only when all reasonable avenues are exhausted do we tell the user we have an assumption that we can't validate and 'this is how we aim to validate it'."

- -> **ETHOS:PRINCIPLE** (explore, don't assume -- shared across ensemble)

**Line 44 -- Tests as truth standard**:

"Tests already exist for your implementation (written by /test-implementer). Your job is to make those tests pass. Run them frequently. If a test fails after your implementation, fix your code -- not the test."

- "make those tests pass" -> **ETHOS:TENET** (tests = truth standard)
- "fix your code -- not the test" -> **ETHOS:TENET** (tests = truth standard, derived)
- "Run them frequently" -> **DOCTRINE:PROCESS**

"If a test seems wrong or untestable, stop and propagate the issue upward to the architect."

- -> **ETHOS:TENET** (propagate, don't patch) / **REDUNDANT** (restates line 11)

**Lines 46-49 -- Additional validation**:

"Add Logfire spans... Write a tmp validation script... Use Playwright for browser-based validation..."

- -> **ENVIRONMENTAL** (tool-specific validation approaches)

**Lines 51-53 -- Self validation tools**:

"Logfire MCP for seeing logs and spans... Playwright MCP for triggering browser logic..."

- -> **ENVIRONMENTAL**

**Lines 55-57 -- Research tools**:

"deepwiki MCP for repository/library research... fetch MCP for specific URLs..."

- -> **ENVIRONMENTAL**

**Line 59 -- Deep research**:

"create a detailed research task in thoughts/research/ and let perplexity work..."

- -> **ENVIRONMENTAL** + **DOCTRINE:PROCESS** (research method)

---

### Lines 62-76: Getting Started

**Lines 64-75**: Read plan, check checkmarks, read frontmatter, skip test phases, identify your phases, read all files fully, think deeply, create todos, delegate.

- -> **DOCTRINE:PROCESS** (initialization sequence)

**Line 67**: "If `test_spec_source` is missing for section work, stop and route back through architect for `/test-designer`"

- -> **DOCTRINE:PIPELINE** (input requirement, guard clause)

**Line 68**: "Skip test phases -- those are owned by /test-implementer"

- -> **DOCTRINE:PIPELINE** (boundary with test-implementer)

---

### Lines 78-98: Implementation Philosophy

**Lines 80-84**: Delegate, review, coordinate, update checkboxes.

- -> **DOCTRINE:ORCHESTRATION** (orchestrator responsibilities)

**Line 86**: "The plan is your guide, but your judgment on how to proceed matters too."

- -> **ETHOS:PRINCIPLE** (judgment within structure)

**Lines 88-98**: Mismatch protocol -- STOP, think, present issue with template.

- -> **DOCTRINE:PROCESS** (mismatch handling)
- "STOP and think deeply about why the plan can't be followed" -> also **ETHOS:PRINCIPLE** (deliberation under uncertainty)

---

### Lines 100-138: Verification Approach

**Lines 102-116**: 7-step verification sequence (review report, run tests, check success criteria, re-delegate if needed, commit, update checkboxes, update todos).

- -> **DOCTRINE:PROCESS** (verification sequence)

**Line 107**: "If tests still fail, fix the implementation -- not the tests"

- -> **ETHOS:TENET** / **REDUNDANT** (third statement of tests-as-truth)

**Line 108**: "If a test seems wrong, stop and propagate to the architect"

- -> **ETHOS:TENET** / **REDUNDANT** (third statement of propagate-don't-patch)

**Line 118**: "Each phase = one validated commit. Commits track validated progress; tests and verification define truth."

- -> **ETHOS:TENET** (incremental validation)

**Lines 120-138**: Pause for human verification, template, multi-phase skip, don't check off until confirmed.

- -> **DOCTRINE:PROCESS** (human verification protocol)

---

### Lines 140-148: If Clones Get Stuck

**Lines 142-144**: Review findings vs plan expectations, consider codebase evolution.

- -> **DOCTRINE:PROCESS** (stuck-clone protocol)

**Line 145**: "If the issue is with tests or design -- do not fix it. Propagate to the architect..."

- -> **ETHOS:TENET** / **REDUNDANT** (fourth statement of propagate-don't-patch)

**Line 146**: "If the issue is with implementation approach -- re-delegate or present to user"

- -> **DOCTRINE:PROCESS**

**Line 148**: "Use research sub-agents for targeted debugging..."

- -> **DOCTRINE:ORCHESTRATION** (research delegation)

---

### Lines 150-186: Delegating Clones

**Line 152**: Check plan's Execution Graph.

- -> **DOCTRINE:PROCESS**

**Lines 154-166**: Clone delegation template with example.

- -> **DOCTRINE:ORCHESTRATION** (delegation template)

**Lines 169-174**: Parallel delegation pattern with example.

- -> **DOCTRINE:ORCHESTRATION**

**Lines 176-184**: Parallel vs sequential criteria.

- -> **DOCTRINE:ORCHESTRATION** (decision criteria)

**Line 186**: Clone completion summary, review, resolve, continue.

- -> **DOCTRINE:PROCESS**

---

### Lines 188-195: Resuming Work

- -> **DOCTRINE:PROCESS** (resume protocol)

**Line 195**: "You're implementing a solution, not just checking boxes."

- -> **ETHOS:PRINCIPLE** (purpose over process)

---

### Lines 197-209: Progress Tracking

**Lines 200-203**: Update plan file, check off items.

- -> **DOCTRINE:PROCESS**

**Line 205**: Use TodoWrite.

- -> **ENVIRONMENTAL** (harness-specific tool)

**Lines 207-209**: End-of-session handoff via /create-handoff.

- -> **DOCTRINE:PROCESS** + **DOCTRINE:PIPELINE** (handoff to next session)

---

### Lines 211-256: Example Workflow

Full worked example showing the orchestrator-clone interaction pattern.

- -> **DOCTRINE:PROCESS** (reference example -- may or may not be included in archetype)

---

## Summary

### Unique Convictions (deduplicated)

| # | Conviction | Occurrences | Tag |
|---|---|---|---|
| 1 | Tests are the truth standard -- fix your code, not the tests | Lines 9, 44, 107 | ETHOS:TENET |
| 2 | Propagate problems upward, don't patch | Lines 11, 44, 108, 145 | ETHOS:TENET |
| 3 | Developer experience is a production value | Lines 26-30 | ETHOS:TENET |
| 4 | Craftsmanship: DRY, API surface > impl, composable, clean | Lines 33-36 | ETHOS:TENET |
| 5 | Incremental validated commits | Line 118 | ETHOS:TENET |
| 6 | Silence is failure (errors must be observable) | Line 29 | ETHOS:TENET |
| 7 | TDD -- we are test-driven developers | Line 42 | ETHOS:TENET |

| # | Principle | Occurrences | Tag |
|---|---|---|---|
| 1 | Orchestrate, don't implement directly | Line 15 | ETHOS:PRINCIPLE |
| 2 | Explore, don't assume | Line 42 | ETHOS:PRINCIPLE |
| 3 | Judgment within structure (plan guides, judgment matters) | Line 86 | ETHOS:PRINCIPLE |
| 4 | Purpose over process (not just checking boxes) | Line 195 | ETHOS:PRINCIPLE |

### Content Distribution

| Category | Lines (approx) | % of Source |
|---|---|---|
| ETHOS (identity, tenets, principles) | ~40 | 16% |
| DOCTRINE (process, orchestration, pipeline, output) | ~150 | 58% |
| ENVIRONMENTAL | ~20 | 8% |
| REDUNDANT (repeated convictions) | ~15 | 6% |
| METADATA + example | ~30 | 12% |

### Gaps Identified

1. **No truth grounding.** Zero citations, zero domain truths. All convictions are asserted.
2. **No explicit pipeline section.** Position is implicit in scattered references.
3. **No output contract.** What the agent produces is never formally declared.
4. **Environmental content in verbatim block.** 6 tool references mixed into constitutional character.
5. **Convictions 3+4 (DX/craftsmanship) may compress.** They might be one tenet or two.
6. **Conviction 7 (TDD) may be redundant with 1 (tests-as-truth).** Or they may be distinct: TDD is the methodology, tests-as-truth is the epistemological claim.
