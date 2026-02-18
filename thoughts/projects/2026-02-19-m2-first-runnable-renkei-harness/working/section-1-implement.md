# Section 1 Implementation Notes -- Bootstrap command/runtime wiring

## Scope

Section 1 only, harness-only changes. Added startup command/runtime wiring for `renkei-dev`, startup contracts, and contract tests T-01 through T-21.

## Files Changed

### Test phase deliverables (Phases 1-3)

- `harness/test/helpers/module-loader.ts`
- `harness/test/helpers/contracts.ts`
- `harness/test/types/bun-test.d.ts`
- `harness/test/unit/mode-selector.unit.test.ts`
- `harness/test/unit/host-readiness.unit.test.ts`
- `harness/test/unit/startup-orchestrator.unit.test.ts`
- `harness/test/unit/renkei-dev.unit.test.ts`

### Implementation phase deliverables (Phases 4-6)

- `harness/src/runtime/types.ts`
- `harness/src/runtime/mode-selector.ts`
- `harness/src/runtime/host-readiness.ts`
- `harness/src/runtime/startup-orchestrator.ts`
- `harness/src/runtime/renkei-dev.ts`
- `harness/src/runtime/renkei-dev-cli.ts`
- `harness/package.json`

## Validation Commands and Outcomes

- `bun test --filter mode-selector` -- pass
- `bun test --filter host-readiness` -- pass
- `bun test --filter startup` -- pass
- `bun test --filter renkei-dev` -- pass
- `bun run test:unit` -- pass
- `bun run typecheck` -- pass
- `bun run lint` -- pass

## Live Startup Check Evidence

Provisioned local OpenCode server from local clone:

- `bun run --cwd packages/opencode src/index.ts serve --hostname 127.0.0.1 --port 43111`

Executed live startup check from harness:

- `OPENCODE_SERVER_URL="http://127.0.0.1:43111" bun run renkei-dev --json`

Observed success JSON with startup payload:

- `{"ok":true,"exitCode":0,...,"startup":{"serverUrl":"http://127.0.0.1:43111",...}}`

## Notes

- No OpenCode core refactors were made.
- Existing unrelated workspace modifications were left untouched.
