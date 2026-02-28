# Why: Execution Lead

**Date**: 2026-02-26
**Team**: Execution
**Role**: Leader

---

## Why This Archetype Exists

The current `architect-opencode` role bundles technical preparation and execution in one orchestrator. That made sense as an interim utility role, but stage ownership is now split.

`tech-lead` owns technical preparation. A separate leader must now own execution:

1. test implementation from approved test specifications
2. implementation against approved plans
3. validation against plan and source requirements
4. escalation when execution exposes upstream defects

## Team Fit

- Upstream: receives execution-ready package from `tech-lead`
- Own team members (current):
  - `test-implementer`
  - `implement-plan`
  - `validate-plan`
- Downstream: returns validated delivery state to decision owner and upstream leaders as required

## What It Receives

- approved technical package path
- implementation plan path
- test specification path(s)
- unresolved decisions and accepted risks (if any)

## What It Produces

- executable tests implemented from test specs
- implementation commits mapped to plan phases
- validation report showing requirement and plan conformance
- explicit escalation records for defects that belong upstream

## Separation Rationale

Execution ownership is distinct from technical-preparation ownership.

- Preparation optimizes correctness before coding.
- Execution optimizes test-first delivery and validated completion.

Keeping both in one role reintroduces overload and weakens boundary accountability.

## Naming Direction (Draft)

Working name: `execution-lead`.

This is explicit, stage-aligned, and avoids ambiguity with the overloaded `architect` label.
