# Section 1 Implementation Plan -- Vendored Subtree Linkage + Startup Boundary Preservation

Date: 2026-02-19
Project: `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/`
Section scope: Section A with Section C startup-boundary preservation obligations
Research source: `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/section-1-research.md`
API design source: `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/section-1-api-design.md`
Test spec source: `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/section-1-test-spec.md`

## Overview

Section 1 establishes repository-native OpenCode linkage via vendored subtree contracts, removes sibling-path assumptions, and proves that `renkei-dev` startup behavior is unchanged at the runtime boundary. The plan is split into test-implementation (TI) and implementation (IP) phases so each contract is proven red-first, then made green with typed outcomes.

## Grounded Constraints

- OpenCode linkage must be in-repo and subtree-based for this milestone (`sources/requirements.md:9`, `spec.md:33`, `spec.md:67`, `section-1-api-design.md:55`).
- No runtime/lint/test path may escape repository root (`spec.md:68`, `section-1-api-design.md:90`).
- Runtime integration remains URL-boundary based; no direct vendored runtime coupling in startup path (`section-1-api-design.md:235`, `section-1-research.md:31`).
- Startup typed contracts and stage order must remain stable (`spec.md:84`, `spec.md:85`, `section-1-api-design.md:232`, `section-1-api-design.md:233`).

## Traceability (Requirements -> Tests -> Phases)

| Requirement | Source | Test IDs | Planned Phases |
|---|---|---|---|
| R1 in-repo vendored linkage contract | `spec.md:67-71` | S1-T01..S1-T06 | TI-1, IP-1 |
| No sibling/outside-repo path usage | `spec.md:68` | S1-T07..S1-T13 | TI-1, IP-1, IP-3 |
| Deterministic vendored update + typed errors | `section-1-api-design.md:157-175` | S1-T14..S1-T19 | TI-2, IP-2 |
| Startup boundary preservation | `spec.md:84-85`, `section-1-api-design.md:231-237` | S1-T20..S1-T23 | TI-3, IP-3 |

## Strict Non-Goals

- No UI/TUI redesign work (`spec.md:27`, `sources/requirements.md:26`).
- No broad OpenCode runtime refactors (`spec.md:28`, `sources/requirements.md:27`).
- No tools-layer expansion (`spec.md:29`, `sources/requirements.md:28`).
- No change to `renkei-dev` success/failure exit-code semantics (must remain 0/1).
- No change to existing `StartupError` discriminant set for Section 1.

## Phase Ownership

| Phase | Owner | Responsibility |
|---|---|---|
| TI-* | `/test-implementer` | Add failing tests for section contracts exactly as specified in Section 1 test spec. |
| IP-* | `/implement-plan` | Implement smallest code increments to make TI tests pass while preserving existing startup contracts. |

## TI/IP Phases

## Phase TI-1 -- Topology + Path Contract Tests

**Owner**: `/test-implementer`
**Commit**: `test: add section-1 linkage and path contract tests`

### Changes Required

1. Add unit tests for linkage load/verify and safe repo path APIs.
   - New tests cover S1-T01..S1-T13 from `section-1-test-spec.md:57-188`.
2. Establish temporary fixtures for valid/invalid linkage config and repo path traversal cases.
3. Keep tests focused on discriminant-level assertions (`error.code`) and `Result` narrowing patterns.

### Validation Commands

- `bun test --filter section-1-linkage`
- `bun test --filter section-1-path-resolution`

### Success Criteria

- [x] Tests exist for S1-T01..S1-T13 and fail for missing implementation.
- [x] Each failing branch asserts explicit typed discriminants (no generic throw expectations).
- [x] Unit test files compile and run under Bun test runner.

---

## Phase IP-1 -- Linkage Config + Path Resolution Implementation

**Owner**: `/implement-plan`
**Commit**: `feat: implement vendored linkage and repo-safe path contracts`

### Changes Required

1. Implement `loadVendoredOpenCodeLinkage` and `verifyVendoredOpenCodeLinkage` per `section-1-api-design.md:49-63`.
2. Implement `resolveRepoRoot`, `resolveRepoPath`, `ensureFilePath`, and `ensureDirectoryPath` per `section-1-api-design.md:82-93`.
3. Add repository-managed linkage config file at `harness/config/opencode-linkage.json` with subtree mode and vendored root.
4. Ensure implementation rejects `../../opencode` and any out-of-repo traversal with typed errors.

### Validation Commands

- `bun test --filter section-1-linkage`
- `bun test --filter section-1-path-resolution`
- `bun test --filter unit`

### Success Criteria

- [x] S1-T01..S1-T13 pass.
- [x] Loader/verifier/path functions return typed `Result` unions; expected failures do not throw.
- [x] Config and path checks never resolve outside discovered repo root.

---

## Phase TI-2 -- Vendored Update Workflow Tests

**Owner**: `/test-implementer`
**Commit**: `test: add section-1 vendored update workflow contract tests`

### Changes Required

1. Add tests for update planning and execution contracts S1-T14..S1-T19 (`section-1-test-spec.md:194-252`).
2. Use dependency injection seams to force `GIT_NOT_AVAILABLE`, `WORKTREE_DIRTY`, `SUBTREE_COMMAND_FAILED`, and `POST_UPDATE_VALIDATION_FAILED` branches.
3. Assert command context is preserved on subtree failure.

### Validation Commands

- `bun test --filter section-1-vendored-update`

### Success Criteria

- [x] Tests exist for S1-T14..S1-T19 and fail before implementation.
- [x] Failures are asserted by typed discriminants and branch-specific payload fields.
- [x] Test setup does not rely on live git mutations for core branch proof.

---

## Phase IP-2 -- Vendored Update Planner/Executor Implementation

**Owner**: `/implement-plan`
**Commit**: `feat: implement deterministic vendored subtree update workflow`

### Changes Required

1. Implement `planVendoredUpdate` and `executeVendoredUpdate` contracts per `section-1-api-design.md:147-176`.
2. Implement `verifyVendoredUpdate` as a typed post-update gate.
3. Implement default execution dependencies:
   - git availability check,
   - dirty worktree check,
   - subtree command execution,
   - linkage provenance update,
   - post-update verification.
4. Ensure success is only returned after post-update verification passes.

### Validation Commands

- `bun test --filter section-1-vendored-update`
- `bun test --filter unit`

### Success Criteria

- [x] S1-T14..S1-T19 pass.
- [x] Update execution is typed and deterministic; expected failures never throw.
- [x] Dirty worktree and subtree failure branches include diagnostic context required by the contract.

---

## Phase TI-3 -- Startup Boundary Preservation Tests

**Owner**: `/test-implementer`
**Commit**: `test: add section-1 startup boundary preservation tests`

### Changes Required

1. Add pure evaluator tests S1-T20/S1-T21 (`section-1-test-spec.md:258-275`).
2. Add verifier wrapper tests S1-T22/S1-T23 with injected evidence provider (`section-1-test-spec.md:281-297`).
3. Assert invariant-specific failure identity for each violated boundary rule.

### Validation Commands

- `bun test --filter section-1-startup-boundary`

### Success Criteria

- [x] Tests exist for S1-T20..S1-T23 and fail before implementation.
- [x] All five invariants are asserted in pass and fail paths.
- [x] Violations return `STARTUP_BOUNDARY_VIOLATION` with exact invariant id.

---

## Phase IP-3 -- Startup Boundary Verifier + Sibling-Path Removal Integration

**Owner**: `/implement-plan`
**Commit**: `feat: preserve renkei-dev startup boundary and remove sibling-path assumptions`

### Changes Required

1. Implement `evaluateStartupBoundaryEvidence` and `verifyRenkeiDevStartupBoundary` per `section-1-api-design.md:220-243`.
2. Update harness script/config pathing so lint/build/test/runtime path references are repository-local and no longer depend on `../../opencode` (`section-1-research.md:25-27`, `section-1-api-design.md:256-257`).
3. Preserve existing runtime startup chain and error taxonomy; do not alter staged readiness -> probe -> sdk flow.
4. Add/update docs snippets in harness-local docs if needed to reflect repository-local linkage assumptions.

### Validation Commands

- `bun test --filter section-1-startup-boundary`
- `bun test --filter startup-orchestrator`
- `bun test --filter renkei-dev`
- `bun test --filter unit`
- `bun run lint`

### Success Criteria

- [x] S1-T20..S1-T23 pass.
- [x] Existing startup-orchestrator and `renkei-dev` unit contracts remain green.
- [x] No tracked runtime/lint/test path references escape repo root.
- [x] Exit-code and startup discriminant behavior remain unchanged.

### Corrective Closure Note (2026-02-19)

- Replaced `harness/.prettierignore` and `harness/.editorconfig` symlinks with repository-local tracked files to satisfy the no-outside-repo path contract for active lint/editor config inputs.
- Re-ran Section 1 validation set: `section-1`, `startup-orchestrator`, `renkei-dev`, `unit`, `typecheck`, `lint` -- all passing.

## Global Validation Gate (Section 1 Signoff)

Run after all IP phases:

```bash
bun test --filter unit
bun run typecheck
bun run lint
```

Section 1 is complete only when:

- All S1-T01..S1-T23 tests pass.
- Pre-existing startup and composition boundary tests stay green.
- Repository no longer relies on sibling path contracts for OpenCode linkage.

## Execution Graph

```text
TI-1 -> IP-1 -> TI-2 -> IP-2 -> TI-3 -> IP-3 -> Global Gate
```

| Phase | Depends On | Parallelizable |
|---|---|---|
| TI-1 | - | No |
| IP-1 | TI-1 | No |
| TI-2 | IP-1 | No |
| IP-2 | TI-2 | No |
| TI-3 | IP-1 | Yes, can start after IP-1 while IP-2 is in progress |
| IP-3 | TI-3, IP-2 | No |
| Global Gate | IP-3 | No |

Parallel execution note:

- After IP-1, one agent may proceed with TI-2/IP-2 while another runs TI-3. Merge point is IP-3 because it touches shared startup/path contracts.

## Risk Controls

- Preserve startup boundary by proving invariants with dedicated evaluator/verifier tests before integration edits.
- Keep expected failure branches typed and explicit; reject throw-based control flow for designed failures.
- Treat path traversal and sibling references as contract violations, not warnings.

## Deliverables from Section 1

- New/updated topology and path-resolution runtime modules in `harness/src/runtime/`.
- New repository-managed linkage config in `harness/config/`.
- Section 1 contract tests in `harness/test/unit/`.
- Updated harness script/config wiring with no sibling-path assumptions.
