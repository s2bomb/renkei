# Engine

The Renkei composition layer over OpenCode. Governs how engine code is written, where it lives, and how it extends the platform through a hierarchy of seams.

---

## Foundation

This document is built on observable facts, not preferences. Every principle and rule below traces back to one or more of these truths. If a rule conflicts with a truth, the rule is wrong.

1. **OpenCode is a working agentic platform.** It provides session execution, prompt loop, tool registry, plugin hooks, skill loading, SDK/server interfaces, and multiple UI surfaces (TUI, GUI, CLI, server). Rebuilding this infrastructure is waste. Composing with it is leverage. The evidence: real operators use it daily.

2. **Not all required behaviours are achievable through existing OpenCode seams.** Item-001 identified 3 Bucket C behaviours requiring new hooks that the existing platform does not provide. Item-003 proved 3 Bucket B capabilities composable without vendor changes -- confirming the gap is real and bounded, not imagined. Item-004 resolved the highest-priority gap (C-1: UI message part registration) through a custom frontend wrapper package. The plugin system alone is insufficient for the full engine capability set.

3. **Brave Browser maintains a minimal, documented patch set on the Chromium engine.** Each patch adds an extension point rather than a feature -- "even to change a logo, the patch creates the extension point that allows logo replacement, not a hardcoded swap." This model has sustained a production browser through thousands of upstream Chromium releases. It is the empirical precedent for the Renkei/OpenCode relationship. The precedent is not direction; it is evidence. It works at browser scale.

4. **The previous engine scaffolding (M2) connected to in-memory mocks, not real OpenCode seams.** 29 files, ~4,700 lines of architecturally conformant code proved patterns but achieved zero actual composition. The four claimed composition adapters wrote to in-process Maps. The code has been removed. Git history preserves it for reference patterns. The engine starts from a clean slate.

### What follows from this

These principles derive directly from the truths above. They are not arbitrary preferences. The word "therefore" marks the derivation -- the step from observed truth to engineering principle.

- **OpenCode is the full platform, not a plugin host.** It owns the session engine, prompt loop, transport, interfaces, and all infrastructure. The platform is complete; therefore, the engine's relationship to OpenCode is Brave-to-Chromium -- deep composition across a shared substrate -- not plugin-to-host. A plugin system is sufficient for lightweight extensions. The engine exists because lightweight extensions are not sufficient.

- **Gaps are real and bounded.** Item-003 proved that many capabilities compose cleanly. Item-001 catalogued where they do not. The gap is bounded; therefore, the engine does not need to modify the platform for every capability -- only for the bounded set where seams are absent. The principle is: use what exists, create only what is needed.

- **Extension points scale; features do not.** The Brave model demonstrates that a patch creating a generalised hook enables many future capabilities from a single investment. A patch that inserts a feature enables exactly one. The precedent is clear; therefore, when creating a new seam (Level 3), the patch must be a hook that enables freedom -- not a one-off insertion for a single use case.

- **Proved patterns without proved composition is not progress.** The M2 work was not wasted -- the patterns (Result types, dependency injection, typed error discriminants) are valid and will be recovered in item-010. But it was also not progress on composition. The distinction matters; therefore, the measure of engine progress is: does the feature code compose with the real platform through a real seam? If not, it is not done.

---

## The Seam Hierarchy

Every engine feature must be classified at one of four levels. The hierarchy is the primary decision filter for all engine development. Lower-numbered levels are always preferred.

### Level 1: Existing Seam, Right Fit

OpenCode already provides a seam that cleanly satisfies the requirement. Use it. No debate, no composition, no patch.

**Derivation**: Reusing what exists avoids adding abstraction debt. Abstraction debt compounds -- every layer added is a bet that its maintenance cost will be repaid. Use what exists; therefore no new seam is needed.

**Example**: Bucket A behaviours from item-001 (9 behaviours already composable through existing surfaces). Specific example: skill file loading via OpenCode's skill loading mechanism directly satisfies archetype skill deployment. The seam exists. Use it.

---

### Level 2: Existing Seams, Composed

Multiple existing seams can be combined to deliver the requirement. Use them if the composition is clean.

**Derivation**: Composition is the fundamental operation at every scale -- "Teams are the composition primitive" (root AGENTS.md). If multiple seams each do one thing well and combine coherently, the composition costs nothing extra to maintain. The principle holds at every scale; therefore compose existing seams before creating new ones.

**The "clean vs. twisted" criterion**: A composition is clean when both seams are used with their documented public APIs and the result is coherent. A composition is twisted when one seam is called in a way its contract does not intend, or when return values are piped between seams by exploiting implementation details rather than designed interfaces. If the seam must be twisted sideways, it is the wrong seam.

**Example from research**: Item-003 proved B-1 (system prompt injection), B-2 (custom tool registration), and B-5 (agent config definition) are composable through plugin hooks and config entries. These compose cleanly because each seam is used as its contract designs.

**Classification note**: Adding a new package to the vendored platform monorepo that imports OpenCode's designed library exports (as item-004's Path B does for `@opencode-ai/renkei-app`) is Level 2 composition, not a Level 3 patch. Zero existing platform files are modified; the package composes through designed extension surfaces.

---

### Level 3: New Seam via Patch

The right seam does not exist. Create it inside the vendored platform. The patch is NOT the feature -- it is the extension point that enables the feature and many future features.

**Derivation**: A patch that creates a generalised extension point scales future capabilities from a single investment. A patch that does not satisfy the four conditions inserts a feature, not a hook -- it compounds complexity without scaling value. The gap between hook and feature is the gap between Level 3 and a fork; therefore every Level 3 patch must satisfy all four conditions, or it is not a Level 3 patch.

**Four conditions -- all must be met:**

1. **Minimal.** The patch adds the smallest possible code change to create the extension point. No feature logic lives in the platform code.
2. **Documented.** Every patch is recorded with: what it adds, why it is needed, which engine features depend on it, and how it survives rebaseline.
3. **Positioned to minimise merge conflicts.** The patch targets stable areas of the platform source. It avoids high-churn files. It is structured so upstream changes to surrounding code do not conflict.
4. **Enables freedom.** The patch is a hook that enables multiple features and future capabilities -- not a one-off insertion for a single use case.

**Approval gate**: Level 3 patches modify the vendored platform. They are not routine development decisions. Every Level 3 patch requires explicit documentation and review before landing.

---

### Level 4: Runtime Manipulation

Edge case. Replace a resource at boot, intercept at startup, monkey-patch at load time. Last resort.

This level exists to acknowledge that some requirements cannot be satisfied through seams -- discovered or created. Runtime manipulation has no conditions that make it acceptable -- it is acknowledged as sometimes necessary, always documented, and always revisited when a seam-based alternative becomes available.

**Constraints**:
1. Must be documented with the specific reason no seam-based approach works.
2. Must be isolated -- cannot interact with seam adapter behaviour.
3. Must be revisited whenever the platform is rebaselined. A new upstream version may provide a seam that replaces the runtime manipulation.

---

### Decision Flowchart

Every feature requirement must walk this flowchart:

```
Feature requirement arrives
  │
  ├─ Does an existing OpenCode seam satisfy it directly?
  │   └─ Yes → Level 1. Use it.
  │
  ├─ Can multiple existing seams compose cleanly to satisfy it?
  │   └─ Yes, and composition uses documented APIs → Level 2. Compose.
  │   └─ Yes, but requires exploiting implementation details → STOP. Wrong approach.
  │
  ├─ Can a new seam be created that satisfies all four conditions?
  │   └─ Yes → Level 3. Create the seam via patch. Document it.
  │
  └─ None of the above work?
      └─ Level 4. Runtime manipulation. Document why. Revisit at next rebaseline.
```

---

## The Brave/Chromium Relationship Model

Understanding this model makes the seam hierarchy intuitive. Without it, Level 3 patches look like a fork. They are not.

**OpenCode is the full platform -- frontend and backend.** Like Chromium is both the renderer and the browser engine, OpenCode provides both the UI surfaces (TUI, GUI, CLI) and the backend runtime (session execution, transport, storage). The engine composes over the entire platform surface, not just a plugin layer.

**The relationship is Brave-to-Chromium, not plugin-to-host.** If the plugin system were sufficient, the engine would not exist as a distinct layer. The engine exists because some required capabilities need seams that the platform does not yet provide. Brave does not just register Chrome extensions -- it ships a browser that shares Chromium's rendering engine while adding its own privacy and feature surface above it.

**"Patch" means creating an extension point.** The Brave model is explicit: even to change a logo, the patch creates the extension point that allows logo replacement -- not a hardcoded swap. The patch is the hook; the engine code composes through the hook. This is the distinction that separates conditioned patches from a fork.

**"Seam" means a documented extension point.** Seams are the interface surface between the engine and the platform. Discovered seams (Level 1, Level 2) already exist in OpenCode. Created seams (Level 3) are added via patch and maintained through rebaseline.

**The composition relationship is maintained through rebaseline.** When the vendored platform is updated to a new upstream version, seam adapters are verified and Level 3 patches are re-applied. This is the ongoing cost of the relationship. It is bounded by the four patch conditions -- minimal, documented, positioned, enables freedom. A well-conditioned patch survives rebaseline with minimal conflict.

**Reconciliation with root AGENTS.md**: The root document describes the engine as "composition layer over vanilla OpenCode." Level 3 patches modify the vendored platform, which appears to contradict "vanilla." The resolution: creating a seam is not the same as inserting a feature. The patch creates the hook; the adapter and feature code compose through the hook. The composition model is preserved. The "vanilla" qualifier in the root document can be refined when it is next updated, but no change is required now.

---

## Ownership Boundary

What the platform owns versus what the engine owns. This is the intent model -- what the engine will own when features are built, not what exists today.

| Platform (OpenCode -- we do not maintain) | Engine (Renkei -- we maintain) |
|---|---|
| Session engine, prompt loop, tool execution | Archetype loading, orchestration policy |
| TUI, GUI, CLI, server, SDK surfaces | Seam adapters (anti-corruption layer) |
| Plugin/tool registry mechanics | Engine-specific tools, plugins, skill deployment |
| Transport, events, storage | Observability normalisation |
| General platform and ecosystem | Seam inventory and seam maintenance |

**Current engine state**: Clean slate. No feature code exists. No seam adapters are implemented. Implementation begins in item-010. This table documents the intended ownership model when those features are built.

**Vendor management is engine infrastructure.** Maintaining the git subtree relationship with upstream OpenCode does not use platform seams and is not a feature -- it is the mechanism that keeps the vendor relationship current. It is owned by the engine layer.

---

## Anti-Corruption Layer

**Principle**: Feature code never imports from the platform (OpenCode) directly. All platform seam usage goes through engine-maintained seam adapter modules.

**Why**: If the platform changes a seam, only the adapter module needs updating. Feature code is insulated from platform churn. The adapter layer is the living inventory of every seam in use -- if a seam has no adapter, the engine is not using it. This is Domain-Driven Design's anti-corruption layer (Evans, 2003, Chapter 14) applied to the platform boundary.

**Structural pattern** (not implementation -- the pattern):

- One adapter module per seam.
- The adapter exports engine-owned types and functions. No platform types leak through the adapter interface.
- Feature code imports from adapters. Adapters import from the platform. Nothing else crosses the boundary.
- The dependency direction is strictly one-way: features → adapters → platform.

**Level 3 seams also get adapters.** The adapter layer covers all seams the engine uses, regardless of whether they were discovered (Level 1/2) or created (Level 3). A created seam that has no adapter is an incomplete Level 3 implementation.

**Where adapters live**: See the directory doctrine section below.

---

## Engine Directory Doctrine

Where engine code lives. Every file has a home; ambiguity is technical debt.

```
engine/
  AGENTS.md                    # This document -- the governing doctrine
  CLAUDE.md                    # Pointer to AGENTS.md
  package.json                 # Scripts, dependencies
  tsconfig.json                # TypeScript config (strict mode)
  .editorconfig                # Symlink → platform (OpenCode)
  .prettierignore              # Symlink → platform (OpenCode)
  config/
    opencode-linkage.json      # Vendor provenance record (upstream coordinates)
    prettier.json              # Style config (tracks platform via symlink)
    approved-opencode-surfaces.json  # Machine-readable registry of approved seams
  src/
    adapters/                  # Seam adapters (anti-corruption layer)
                               #   One file per seam. Exports engine-owned types only.
    features/                  # Engine features (capability delivery)
                               #   Import from adapters, never from platform directly.
    shared/                    # Shared types and utilities
                               #   Result<T,E>, error shapes, domain types.
                               #   Imports nothing. Foundational layer.
    index.ts                   # Engine entry point (implementation begins item-010)
  test/
    unit/                      # Pure unit tests (no platform instance required)
    integration/               # Composition tests (requires running platform)
```

**Dependency rules** -- these are not preferences, they are structural constraints:

- `features/` imports from `adapters/` and `shared/`. Never from the platform directly.
- `adapters/` imports from the platform and `shared/`. Never from `features/`.
- `shared/` imports nothing. It is the foundational layer.
- `test/unit/` imports from `features/`, `adapters/`, `shared/`. No platform calls.
- `test/integration/` imports from `features/`, `adapters/`. Platform calls are expected.
- Infrastructure (config, build scripts) is independent.

**Builder autonomy**: Specific directory names within `src/` are the implementer's decision. `src/adapters/` vs `src/seams/`, `src/features/` vs `src/capabilities/` -- both are valid. The constraint is: the structure must implement all six categories (seam adapters, feature code, shared types, entry points, infrastructure, tests), must implement the one-way dependency direction, and must allow `bun run typecheck`, `bun run lint`, and `bun run test:unit` to function.

**Config directory**: `engine/config/` is retained across all items.

- `opencode-linkage.json` -- vendor provenance record. Records the upstream OpenCode version, git coordinates, and relationship metadata. Reference this for manual rebaseline operations.
- `prettier.json` -- style config that tracks the platform via symlink. Engine style is always consistent with the platform.
- `approved-opencode-surfaces.json` -- the machine-readable registry of approved platform composition seams. Documents which platform surfaces the engine is permitted to compose through. Current entries (tool-registry, plugin-hooks, skill-load, sdk-client) describe real OpenCode surfaces and are architecturally valid. The legacy "Harness" term in its rationale fields is acceptable as historical data. Item-010+ will maintain this file as the anti-corruption layer is built.

---

## Quality Gates

Every change must pass all gates before commit.

```bash
bun run typecheck          # TypeScript strict mode (no emit)
bun run lint               # Prettier (platform config via symlink)
bun run test:unit          # Unit tests (no platform instance required)
```

Integration tests require a running OpenCode instance:

```bash
bun run test:integration   # Composition tests (requires running platform)
```

All four quality gate commands must exit 0. On a clean-slate codebase (no feature code), the test commands are no-ops -- this is expected and correct. When feature code arrives in item-010, the no-op behaviour disappears naturally.

---

## Dependencies

**Platform (OpenCode)**: The vendored platform dependency. The engine composes through OpenCode's seams; it does not own or maintain the platform's internals. Relationship maintained through rebaseline: pull upstream changes, verify seam adapters, re-apply Level 3 patches.

**Authoring layer**: The engine consumes assembled skill files and archetype metadata. Dependency direction: engine depends on authoring output, never the reverse. The authoring layer never imports engine code.

**No engine-specific npm dependencies** without justification. Every dependency is a bet on its maintenance, security, and API stability. The engine inherits OpenCode's runtime dependency tree. When an additional dependency is genuinely needed, document the justification explicitly.

**Code quality config**: Prettier and editorconfig are symlinked from the platform so engine style tracks upstream automatically.

---

## Current State

Honest record of what exists as of item-009.

| What | Status |
|---|---|
| Governing doctrine (this document) | Written -- item-009 |
| engine/src/ | Exists, contains only placeholder index.ts |
| Seam adapters | None implemented |
| Feature code | None written |
| Composition with platform | None |
| Quality gates (typecheck, lint) | Functional on clean codebase |
| Test suite | No test files (expected -- no features yet) |

**Implementation begins in item-010.**

Prior M2 scaffolding (29 files, ~4,700 lines in `engine/src/runtime/`) proved patterns but connected to in-memory mocks, not real OpenCode seams. It was removed as part of item-009. Git history preserves all deleted files for reference patterns (Result types, dependency injection, typed error discriminants, HTTP health checks).

---

## Updating This Document

Update this document when:

- **A new seam is discovered in the platform** -- update the approved-opencode-surfaces.json and document the seam in context.
- **A Level 3 patch is created** -- document the patch in this file: what it adds, which feature depends on it, and how it survives rebaseline.
- **Quality gates change** -- update the quality gates section.
- **The directory structure changes** -- update the directory doctrine.
- **The seam hierarchy is revised** -- record the revision in `docs/personal-notes/decisions.md` first, then update this document.
- **New engine-domain terms are introduced** -- add to `docs/authoring/VOCABULARY.md` first, then use them here.
- **A principle leads to a bad outcome** -- revise the principle, document why, trace the derivation.
