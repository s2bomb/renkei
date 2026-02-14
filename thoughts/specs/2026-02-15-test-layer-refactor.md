# Test Layer Refactor: Split test-writer into test-designer + test-implementer

## Origin

`thoughts/issues/open/test-layer-refactor.md` — the test-writer is too zealous (5-perspective adversarial ensemble for what should be a natural derivative of API design), and implement-plan conflates test-writing with code-writing.

## Problem

1. **test-writer lost the forest for the trees.** It runs a full adversarial ensemble when the API design already laboured over contracts, error handling, and module boundaries. The test spec should be a lean derivative of the API design — "prove these contracts hold" — not an independent adversarial exercise.

2. **implement-plan conflates two responsibilities.** The architect already hacked around this (steps 2e/2f split "implement tests" from "implement code"). That hack should become explicit architecture.

## Solution

Split the test layer into two dedicated archetypes:

| Old | New | Role |
|-----|-----|------|
| test-writer (spec + too much) | **test-designer** | Reads API contracts, specs which tests prove them. Lean, scope-bounded by API surface. The test equivalent of api-designer. |
| implement-plan (tests + code) | **test-implementer** | Writes actual test code from the test spec. TDD red phase only. Never writes implementation code. |
| implement-plan (tests + code) | **implement-plan** (updated) | Writes only implementation code. Tests already exist from test-implementer. Makes existing tests pass. |

## Pipeline Change

**Old:**
```
research → api-design → test-writer → plan → implement-plan(tests) → implement-plan(code) → validate
```

**New:**
```
research → api-design → test-designer → plan → test-implementer → implement-plan → validate
```

## Affected Skills

- `~/.claude/skills/test-designer/SKILL.md` — NEW
- `~/.claude/skills/test-implementer/SKILL.md` — NEW
- `~/.claude/skills/architect/SKILL.md` — pipeline update
- `~/.claude/skills/architect-opencode/SKILL.md` — pipeline update
- `~/.claude/skills/create-plan/SKILL.md` — agent awareness
- `~/.claude/skills/implement-plan/SKILL.md` — remove test-writing responsibility
- `~/.claude/skills/test-writer/SKILL.md` — deprecated (kept for reference)

## Key Design Decisions

1. **test-designer does NOT run adversarial clone ensembles by default.** It delegates `test-writer-clone` agents per module only when the section has 3+ independent modules. For most sections, it works directly — one agent, one pass through the API contracts.

2. **test-designer is scope-bounded by the API design.** Every test traces to a specific API contract. If something isn't in the API surface, it's flagged as a design gap, not expanded scope.

3. **test-implementer uses `implement-plan-clone` agents.** No new clone types needed — existing clones do the work, just scoped to test files only.

4. **implement-plan no longer writes tests.** Its verification step changes from "verify tests were written first" to "run existing tests, make them pass."
