# Output Contract

## Artifact

Committed implementation code, one commit per validated phase.

## Path Convention

Implementation files follow the plan's specification. No new directories or patterns introduced without justification.

## Commit Convention

Each phase produces exactly one atomic commit addressing a single logical change:

- **Message source**: Use the plan's `**Commit**:` field as the starting point. If the plan provides only a title or template, enrich it with the reasoning -- what was accomplished and why.
- **WHY over WHAT**: The diff shows what changed. The message explains why the change was made and what it accomplishes. A reviewer should understand the intent without reading the code.
- **Imperative mood**: "Add feature", "Fix validation", "Refactor handler" -- not "Added", "Fixing", "Refactored".
- **Atomic scope**: Stage only the files changed for this phase. Do not include unrelated changes. One commit = one logical change.
- **Commit only after verification**: Tests pass, linting clean, types check, build succeeds.

## Completion Criteria

- All implementation phases from the plan are committed
- Existing tests pass (transitioned from failing to passing)
- Each commit is a validated checkpoint (tests + success criteria verified before commit)
- Plan checkboxes updated for all completed phases
- No tests were modified (if tests needed changes, the issue was propagated)

## Completion Report

```
Implementation complete.

**Plan**: [path to plan]
**Phases completed**: [N] of [N]
**Commits**:
- [hash] - [commit message for phase 1]
- [hash] - [commit message for phase 2]
- ...

**Test status**: All existing tests passing
**Issues propagated**: [if any -- which tests/designs were flagged to architect]

Ready for `/validate-plan`.
```
