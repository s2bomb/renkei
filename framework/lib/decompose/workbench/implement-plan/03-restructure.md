# Phase 3: Restructure -- implement-plan

**Date**: 2026-02-17

> Revised 2026-02-17: Phase 5 Losslessness Audit identified two behavioral losses in original restructure. (1) "Instrument proactively" was incorrectly dropped as environmental -- it is behavioral, only "in Logfire" is environmental. Restored to ethos/tenets.md DX bullet and verbatim block. (2) "Complexity hidden behind simple interfaces" was missing from the tenet bullet list. Restored. (3) Validation strategies (Logfire spans, tmp scripts, browser validation) were dropped entirely -- the tool names are environmental but the validation behaviors are constitutional. Restored to doctrine/process.md Step 3 in tool-neutral form. See `perspectives/losslessness-audit.md` for full findings.

## Losslessness Mapping

Every behavioral element from the source mapped to its archetype location.

| Source (SKILL.md) | Lines | Archetype Location | Status |
|---|---|---|---|
| Frontmatter (name, description, model) | 1-5 | archetype.yaml | Preserved |
| "Your job is to write the code that makes those tests pass" | 9 | ethos/identity.md | Preserved |
| "You are a tradesman" | 11 | ethos/identity.md | Preserved |
| Relationship to other agents | 11 | ethos/identity.md | Preserved |
| "You propagate the problem upward" | 11 | ethos/tenets.md "Propagate, don't patch" | Preserved |
| Anti-identity (don't fix tests, redesign APIs, fill gaps) | 11 | ethos/identity.md | Preserved |
| "You are an orchestrator, not an implementer" | 15 | ethos/principles.md "Orchestrate, don't implement" | Preserved |
| Delegate clones, keep context, coordinate | 16-19 | doctrine/orchestration.md | Preserved |
| DX values (clean, intuitive, observable, simple) | 26-30 | ethos/tenets.md "DX is a production value" | Preserved |
| "Silent errors are unacceptable" | 29 | ethos/tenets.md (within DX tenet) | Preserved |
| DRY, API surface > impl, composable, clean | 33-36 | ethos/tenets.md (within DX tenet) | Preserved |
| "Ultrathink smallest testable steps... git..." | 40 | doctrine/process.md (absorbed into step structure) | Transformed |
| "We are test driven developers" | 42 | ethos/tenets.md "Tests are the truth standard" | Absorbed |
| "We NEVER assume anything -- we explore..." | 42 | ethos/principles.md "Explore, don't assume" | Preserved |
| "Make those tests pass. Fix your code not the test" | 44 | ethos/tenets.md "Tests are the truth standard" | Preserved |
| "If a test seems wrong, propagate" | 44 | ethos/tenets.md "Propagate, don't patch" | Deduplicated |
| Logfire spans for validation | 47 | doctrine/process.md Step 3 (tool-neutral) | Transformed |
| Tmp validation scripts | 48 | doctrine/process.md Step 3 | Preserved |
| Playwright for browser validation | 49 | doctrine/process.md Step 3 (tool-neutral) | Transformed |
| Logfire MCP, Playwright MCP | 51-53 | **DROPPED** (environmental) | Noted below |
| deepwiki MCP, fetch MCP | 55-57 | **DROPPED** (environmental) | Noted below |
| Perplexity research method | 59 | **DROPPED** (environmental) | Noted below |
| Read plan, check checkmarks, read frontmatter | 64-66 | doctrine/process.md Step 1 | Preserved |
| Route back if test_spec missing | 67 | doctrine/pipeline.md + process.md Step 1 | Preserved |
| Skip test phases | 68 | doctrine/process.md Step 1 | Preserved |
| Identify your phases, read files fully | 69-71 | doctrine/process.md Step 1 | Preserved |
| Think deeply, create todos, delegate | 72-74 | doctrine/process.md Step 1 | Preserved |
| Ask for plan path if not provided | 76 | doctrine/process.md Step 1 | Preserved |
| Orchestrator role: delegate, review, coordinate | 80-84 | doctrine/orchestration.md | Preserved |
| "Plan guides, judgment matters too" | 86 | ethos/principles.md "Judgment within structure" | Preserved |
| Mismatch protocol (STOP, think, present) | 88-98 | doctrine/process.md Step 5 | Preserved |
| 7-step verification sequence | 102-116 | doctrine/process.md Step 3 | Preserved |
| "Fix implementation not tests" | 107 | Deduplicated (ethos/tenets.md) | Deduplicated |
| "Propagate to architect" | 108 | Deduplicated (ethos/tenets.md) | Deduplicated |
| "Each phase = one validated commit" | 118 | ethos/tenets.md "Each phase is a validated checkpoint" | Preserved |
| Pause for human verification + template | 120-138 | doctrine/process.md Step 4 | Preserved |
| Stuck-clone protocol | 140-148 | doctrine/orchestration.md "When clones get stuck" | Preserved |
| "Issue with tests/design -- propagate" | 145 | Deduplicated (ethos/tenets.md) | Deduplicated |
| Research sub-agents for debugging | 148 | doctrine/orchestration.md | Preserved |
| Clone delegation template | 154-166 | doctrine/orchestration.md | Preserved |
| Parallel delegation pattern | 169-174 | doctrine/orchestration.md | Preserved |
| Parallel vs sequential criteria | 176-184 | doctrine/orchestration.md | Preserved |
| Resume protocol | 188-195 | doctrine/process.md Step 6 | Preserved |
| "Not just checking boxes" | 195 | ethos/principles.md "Purpose over process" | Preserved |
| Progress tracking (plan, todos, handoff) | 200-209 | doctrine/process.md Step 6 | Preserved |
| Example workflow | 211-256 | **DROPPED** (reference example) | Noted below |

## Dropped Content

### Environmental (tool references)

The following tool-specific content was dropped from the archetype. These are harness-environment features, not constitutional character. They can be reintroduced in the host-adaptation phase or as a separate operational guide if needed.

- Logfire MCP for validation spans and logs (lines 47, 51-52)
- Playwright MCP for browser validation (lines 49, 53)
- deepwiki MCP for repository research (line 55)
- fetch MCP for URL fetching (line 57)
- Perplexity for deep research tasks (line 59)

**Justification**: Per the "No PRIMITIVES/CAPABILITIES" decision (decisions.md): tools are environmental, not constitutional. A craftsman's identity doesn't change when he acquires a new saw.

### Example workflow (lines 211-256)

Dropped from archetype articles. The example demonstrated the orchestrator-clone interaction pattern but was illustrative, not constitutional. The same behavior is fully specified by the process and orchestration articles.

**Note**: If future assembly supports a "references/" section for non-template reference material, the example could be included there.

### "Ultrathink" phrasing (line 40)

The specific phrasing "Ultrathink the smallest testable steps" was transformed into the process structure itself (step-by-step phases with verification). The harness-specific prompt technique ("ultrathink") is environmental. The underlying behavior (think carefully, validate incrementally) is preserved in the tenets and process.

## Deduplication

The following convictions appeared multiple times in the source and were consolidated:

| Conviction | Source occurrences | Archetype location (stated once) |
|---|---|---|
| Fix your code, not the tests | Lines 44, 107 | ethos/tenets.md |
| Propagate, don't patch | Lines 11, 44, 108, 145 | ethos/tenets.md |
