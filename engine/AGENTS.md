# Engine

Domain composition layer over OpenCode. Adds Renkei archetype loading, capability gating, and orchestration policy to OpenCode's runtime, interfaces, and tooling substrate.

---

## Foundation

OpenCode is a working agentic runtime with proven interfaces (TUI, GUI, server, SDK, CLI) used by real operators daily. Rebuilding that infrastructure is waste. Composing with it is leverage.

- **OpenCode is the host runtime.** It owns the session engine, prompt loop, tool execution, transport, event plumbing, and all interface surfaces. We do not rebuild these. We compose on top of them.
- **Composition is free leverage.** A composed adapter costs nothing to maintain when upstream changes. OpenCode upgrades are handled the same way as any dependency upgrade: check contracts, update adapters, verify gates.
- **Silent degradation is the most expensive failure mode.** When a capability is unavailable, an explicit typed error caught at the call site costs minutes. Silent degradation caught in production costs days and trust.
- **A runtime you cannot verify is a runtime you cannot trust.** Every capability claim must have an executable gate that proves it works or proves it doesn't.

### What follows from this

- **Own domain policy, not platform machinery.** Renkei defines archetype loading, orchestration rules, and composition adapters. OpenCode defines runtime plumbing, UI rendering, and transport. Do not blur this line.
- **Fail loud at every boundary.** Every function that touches a composition surface checks the gate before performing side effects. Returns typed `Result` errors, never throws for expected failures. Unexpected failures are normalized to `Result` at the engine boundary.
- **Treat OpenCode like a versioned dependency.** API changes in OpenCode are handled the same way as any dependency upgrade: check contracts, update adapters, verify gates. The integration probe exists for this reason.

---

## What We Own vs What OpenCode Owns

| OpenCode (host runtime -- we do not maintain) | Renkei Engine (our layer -- we maintain) |
|---|---|
| Session engine, prompt loop, tool execution | Archetype loading, orchestration policy |
| TUI, GUI, CLI, server, SDK surfaces | Capability probes, composition adapters |
| Plugin/tool registry mechanics | Engine-specific tools, plugins, and skill loading |
| Transport, events, storage | Observability normalization |
| General platform fixes and ecosystem updates | Composition seam maintenance |

---

## Composition Model

The engine composes with OpenCode through four proven extension seams:

| Seam | OpenCode surface | Engine use |
|---|---|---|
| Tool registry | `tool/registry.ts` | Register harness-specific tools via `registerComposedTool` |
| Plugin hooks | `plugin/index.ts` | Register lifecycle hooks via `registerHarnessPlugin` |
| Skill loading | `skill/skill.ts` + config | Load assembled archetype skill files via `loadDeployedSkills` |
| SDK/Server | `server/server.ts` + `sdk/js/` | Session operations via `createHarnessSDKClient` |

**No OpenCode files are modified.** All engine behavior is composed through these seams.

---

## Where Things Live

```
engine/
  AGENTS.md               # This document
  CLAUDE.md               # Pointer to AGENTS.md
  package.json            # Scripts, dependencies
  tsconfig.json           # TypeScript config
  .editorconfig           # Symlink -> OpenCode
  .prettierignore         # Symlink -> OpenCode
  src/
    runtime/              # Engine runtime modules
      types.ts            # Canonical types, Result<T,E>, error shapes
      integration-probe.ts # Capability detection against host runtime
      composition-seam.ts # Tool/plugin/skill/SDK composition adapters
      composition-integration-boundary.ts # Full bootstrap boundary
      startup-orchestrator.ts # Readiness -> probe -> SDK pipeline
      host-readiness.ts   # Health check against OpenCode server
      no-degradation-baseline.ts # Composition baseline enforcement
      renkei-dev.ts       # CLI command logic
      renkei-dev-cli.ts   # CLI entrypoint
      observability.ts    # Span recording normalization
      state.ts            # In-process state for composition testing
  test/
    unit/                 # Pure unit tests (no server required)
    integration/          # Composition tests (OPENCODE_SERVER_URL required)
    helpers/              # Fixtures, env gates, log spy, contracts
    types/                # Type shims for test environment
```

Each runtime module owns one domain concept. If a module grows to own two concepts, split it.

---

## Quality Gates

Every change must pass before commit:

```bash
bun run typecheck          # TypeScript strict mode, no emit
bun run lint               # Prettier (OpenCode config via symlink)
bun run test:unit          # Unit contracts (no server needed)
```

Integration tests require a running OpenCode instance:

```bash
OPENCODE_SERVER_URL=http://... bun run test:integration   # Composition contracts
```

---

## Dependencies

- **OpenCode** -- host runtime (treated as versioned platform dependency)
- **`authoring/`** -- consumes assembled skill files and archetype metadata (dependency direction: engine depends on authoring output, never the reverse)

Engine inherits OpenCode's runtime dependency tree. Do not add engine-specific dependencies without justification.

Code quality config (Prettier, editorconfig) is symlinked from OpenCode so engine style tracks upstream automatically.

---

## Current State

| What | Status |
|---|---|
| Runtime modules (probe, composition, startup, baseline) | Implemented, unit-tested |
| Composition seam adapters | Implemented and verified against composition baseline |
| Quality baseline | TypeScript strict, Prettier (OpenCode config), bun:test |
| End-to-end daily-driving flow | Not yet integrated |

Active project: `thoughts/projects/2026-02-19-m2-first-runnable-renkei-harness/`

---

## Extending This Code

When adding engine behavior:

1. **Use a composition seam.** Write an adapter that uses an existing OpenCode seam. Register it through the composition-seam module.
2. **Add a contract test.** Every new capability gets a test that proves it works AND a test that proves it fails loudly when unavailable.
3. **If a composition seam is insufficient, propose an OpenCode extension point.** Do not maintain patches. Engage with OpenCode upstream to add the hook you need.

---

## Updating This Document

- When a new composition seam is discovered in OpenCode -- add it to the composition model table.
- When quality gates change -- update the gates section.
- When the runtime module structure changes -- update the directory map.
- When a principle leads to a bad outcome -- revise the principle, document why.
