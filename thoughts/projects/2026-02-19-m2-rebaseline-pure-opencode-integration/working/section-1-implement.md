# Section 1 Implementation Evidence -- Vendored Linkage + Startup Boundary

Date: 2026-02-19
Plan: `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/section-1-implementation-plan.md`

## Scope Executed

- Implemented Section 1 runtime modules for topology, path safety, vendored subtree update workflow, and startup-boundary verification.
- Completed sibling-path removal from harness lint configuration with repository-local config contract.
- Completed Section 1 TI/IP tests and validated Section 1 global gate.

## Files Changed (Section 1)

Implementation/runtime/config:

- `harness/config/opencode-linkage.json`
- `harness/config/prettier.json`
- `harness/package.json`
- `harness/src/runtime/repo-path-resolution.ts`
- `harness/src/runtime/startup-boundary.ts`
- `harness/src/runtime/vendored-opencode-linkage.ts`
- `harness/src/runtime/vendored-update-workflow.ts`

Tests and test support:

- `harness/test/helpers/section-1-fixtures.ts`
- `harness/test/helpers/section-1-module-loader.ts`
- `harness/test/types/node-shims.d.ts`
- `harness/test/unit/section-1-linkage.unit.test.ts`
- `harness/test/unit/section-1-path-resolution.unit.test.ts`
- `harness/test/unit/section-1-startup-boundary.unit.test.ts`
- `harness/test/unit/section-1-vendored-update.unit.test.ts`

Project tracking artifacts:

- `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/section-1-implementation-plan.md`
- `thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/index.md`

## Validation Evidence

Section 1 targeted suites:

```bash
bun test --filter section-1-linkage
bun test --filter section-1-path-resolution
bun test --filter section-1-vendored-update
bun test --filter section-1-startup-boundary
```

Outcome: all passing.

Section 1 global gate:

```bash
bun test --filter unit
bun run typecheck
bun run lint
```

Outcome: all passing.

## Contract Preservation Notes

- Startup stage order remains `readiness -> probe -> sdk`.
- `StartupError` discriminants remain unchanged.
- `runRenkeiDevCommand` exit contract remains success `0`, failure `1`.
- Startup integration remains URL-boundary based; no direct vendored runtime import added to startup path.
