# OpenCode Composition Strategy

How Renkei maintains its relationship with OpenCode as an upstream dependency. Written for executive discussion.

---

## The Problem

Renkei builds on top of OpenCode (an open-source agentic runtime). We need to add features OpenCode doesn't have -- teams, archetype loading, custom rendering. The question is: how do we add those features without creating a maintenance nightmare every time OpenCode releases an update?

## The Proven Model: Brave + Chromium

Brave browser faces this exact problem at 1000x our scale. They build a privacy-focused browser on top of Google's Chromium (millions of lines of code, 240 Git repos, 60GB of source). They ship to 32 million users and rebase on new Chromium versions every 2-3 weeks.

Their solution, documented at `brave-core/docs/patching_and_chromium_src.md`:

1. **Keep upstream clean.** Chromium source is fetched fresh. Brave's code lives in a separate `brave-core` directory.
2. **Hierarchy of intervention.** Try the least invasive approach first. Only patch Chromium source as a last resort.
3. **When you must patch, prefer extensible patches.** From their docs: "You should almost never patch in two methods calls in a row. We should prefer extensible patches." Meaning: patch in one generic extension point, not multiple feature-specific changes.
4. **All patches are named files** in a `patches/` directory. You can answer "what did we change in Chromium?" by listing a directory.

This works. Brave ships a major browser on a 2-3 week update cycle with this model.

## Our Version of This

Renkei's structure already mirrors Brave's:

| Brave | Renkei | Purpose |
|---|---|---|
| `src/` (clean Chromium) | `vendor/opencode/` | Upstream, replaced wholesale on update |
| `src/brave/` (all custom code) | `harness/` | Our code, our directory |
| `src/brave/patches/` | `patches/opencode/` (to build) | Named patch files applied to upstream |
| `src/brave/components/` | `harness/src/` | New feature code |

## Three Composition Layers

Features are built through the least invasive layer possible, in order:

### Layer 1: Content (free -- no code changes)

OpenCode automatically loads these from the working directory:

- **AGENTS.md** -- injected as system prompt instructions. This is how archetype definitions (personality, beliefs, process) reach the agent.
- **Skill files** (`.claude/skills/*/SKILL.md`) -- registered as invocable capabilities.
- **Config** (`.opencode/config.yaml`) -- model selection, MCP servers, provider keys.

This layer is zero-maintenance. Update OpenCode, everything still works. No patches, no conflicts, no rebase.

### Layer 2: Extension (medium -- uses OpenCode's registration APIs)

OpenCode has registration points that don't require modifying its source:

- **Tool registry** -- register custom tools the agent can call (e.g., deploy an archetype, manage team metadata).
- **MCP servers** -- external tool providers registered via config.
- **Custom agents** -- defined in config with their own system prompts and tool sets.

Feature code lives in `harness/src/`. It imports OpenCode types from `vendor/opencode/` and registers through OpenCode's APIs at startup. No files in `vendor/` are modified.

### Layer 3: Hook patches (maintenance cost -- but stable)

When OpenCode doesn't have an extension point we need, we patch one in. **The patch adds a hook, not a feature.** All feature code lives in `harness/` and plugs into the hook.

This is the key insight, modeled directly on Brave's approach.

## The Hook Pattern (Most Important Section)

### The wrong way: feature patches

Patch OpenCode to directly implement team rendering in the TUI. 420 lines of feature code living inside `vendor/opencode/`. When OpenCode updates their TUI, all 420 lines conflict. Every new feature requires a new patch. Patch count grows linearly with features.

### The right way: hook patches

Patch OpenCode to accept a callback at the render point. 5 lines. The actual rendering code (420 lines) lives in `harness/` and registers with the hook. When OpenCode updates their TUI, only the 5-line hook might conflict. New features use the same hook. **Patch count grows with surfaces, not features.**

### Concrete example -- TUI rendering

The patch (lives in `vendor/opencode/`, ~5 lines):
```
// Added to header.tsx:
import { useHarnessSlot } from "@renkei/hooks"
const HeaderExtension = useHarnessSlot("session-header")
// ... render {HeaderExtension && <HeaderExtension />} alongside existing content
```

The feature (lives in `harness/src/`, unlimited lines):
```
// Our code, our directory, no patch needed:
registerSlot("session-header", TeammateChips)
```

Want to add archetype badges to the header later? No new patch -- register another component in the same hook.

### What the hooks cover

We need hooks at approximately 5 surfaces in OpenCode:

| Hook | What it enables | Patch size |
|---|---|---|
| TUI render slots | Custom rendering at 2-3 points (header, sidebar, status) | ~30 lines |
| System prompt sections | Inject session context, team info, archetype instructions | ~10 lines |
| Session lifecycle | React to session create/update/list for team metadata | ~15 lines |
| Prompt metadata | Attach source attribution, team context to messages | ~10 lines |
| (Tool registration) | Already exists in OpenCode -- no patch needed | 0 lines |

**Total: ~65 lines of patches across 4-5 files. All structural. Zero feature code.**

Once these hooks exist, features compose through them indefinitely. Feature 1, feature 10, feature 50 -- same hooks, no new patches.

## The Numbers

| Approach | Patches | Lines in vendor/ | New features require |
|---|---|---|---|
| Undisciplined fork | Interleaved with upstream | Unknowable | Archaeology |
| Feature patches (naive) | ~7 | ~750 | New patch per feature |
| **Hook patches (our model)** | **~4** | **~65** | **No new patches** |

## Update Workflow

When OpenCode releases a new version:

1. Replace `vendor/opencode/` with fresh upstream
2. Run `apply-patches.sh` -- applies the ~4 hook patches in order
3. Most apply clean (they're small, additive). Fix any that don't.
4. Run `bun run test:unit` from `harness/` -- harness contracts verify everything still works
5. Done. Estimated time: **30 minutes per update**.

The harness contracts (built in M2) catch **silent behavioral changes** -- cases where an API still exists but behaves differently. Git merge can only catch line-level conflicts. Our contracts catch semantic breakage.

## Decision Framework for Engineers

When building a feature that touches OpenCode:

```
Can it be content (AGENTS.md, skills, config)?
  YES --> Do that. Zero patches. Zero maintenance.

Can it be a tool registered from harness/?
  YES --> Do that. Import OpenCode types, call ToolRegistry.register().
          Code lives in harness/. Zero patches.

Does it need to change OpenCode's existing behavior?
  YES --> Is there already a hook for this surface?
            YES --> Compose through the hook. Code in harness/. Zero patches.
            NO  --> Create the hook (small, stable patch).
                    Then compose through it. Feature code in harness/.
```

The rule: **patch the hook, not the feature.**

## Why Not Just Fork?

A fork works mechanically. Many projects do it (Brave calls theirs a fork). The difference is discipline:

- A **fork** psychologically invites divergence. "This is our version." Over time, upstream merges get painful, you stop doing them, and you've accidentally built a separate product you maintain alone.
- A **vendored copy with hook patches** psychologically resists divergence. Every patch is a named file with a justification. You feel the count. When it hits 10, alarm bells ring.

For a small team, that discipline pressure matters. Brave can afford 100+ patches because they have 50+ engineers. We can't. The vendored model with hooks keeps us honest.

## Strategic Value

1. **Every OpenCode feature lands for free.** New model support, bug fixes, MCP improvements, performance. Update `vendor/opencode/`, re-apply 4 patches, done.
2. **Patch count is the maintenance debt gauge.** Under 5 = healthy. 5-10 = watch it. 10+ = reconsider the approach.
3. **Hooks are proposable upstream.** Because they don't change OpenCode's behavior when nothing is registered, they could become official extension points. This keeps the door open for reducing patch count to zero over time.
4. **Features ship fast.** Engineers write tools and UI in `harness/` using OpenCode's types and APIs. No waiting for upstream. No managing a fork. Import, build, register.
