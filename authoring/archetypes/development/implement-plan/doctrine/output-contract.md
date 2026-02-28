# Output Contract

## Artifact

Committed implementation code, one commit per validated phase.

## Path Convention

Implementation files follow the plan's specification. No new directories or patterns introduced without justification.

## Commit Convention

Clones commit their own work after verification. Each phase produces exactly one atomic commit. The orchestrator reviews clone commits but does not create them.

Commit discipline (applied by clones, enforced by orchestrator review):

- **Message source**: Plan's `**Commit**:` field as the starting point, enriched with reasoning.
- **WHY over WHAT**: The message explains why the change was made. The diff shows what.
- **Imperative mood**: "Add feature", "Fix validation", "Refactor handler".
- **Atomic scope**: One commit = one phase = one logical change.
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
**Issues propagated**: [if any -- which tests/designs were flagged to execution-lead]

Ready for `/validate-plan`.
```
