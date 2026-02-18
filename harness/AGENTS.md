# Harness

Agent execution runtime. Fork of [OpenCode](https://github.com/nichochar/opencode), opinionated toward archetype-driven teams as the core primitive.

> This directory is a placeholder. The OpenCode fork will land here as a composition layer (OpenCode as dependency, not a modified fork). See `thoughts/ideas/open/renkei-full-system-vision.md` for the full harness vision.

## Status

**Not yet integrated.** Harness primitives exist in a separate OpenCode fork (`section-1-core-messaging` branch). Bringing them into this repo under a clean composition architecture is the current milestone.

## What the Harness Will Provide

1. **Agent execution** -- load archetypes (truth + ethos + doctrine) as agent system prompts
2. **Teams** -- recursive composition primitive (leader + members, nesting)
3. **Communication** -- parent-child messaging, email-style async between team leaders
4. **Interfaces** -- TUI, web, server, SDK (inherited from OpenCode)

## Architecture Direction

Three-tier composition over fork:

```
Tier 1: opencode          (pure upstream dependency)
Tier 2: @renkei/shim      (minimal extension hooks)
Tier 3: @renkei/harness   (teams, communication, archetype loading)
```

See `thoughts/specs/2026-02-18-opencode-team-capacity-envelope.md` for capacity planning.

## Depends On

- `framework/` -- consumes assembled skill files and archetype metadata
