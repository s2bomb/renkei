# Renkei

Full-suite system for defining, embodying, and operating agentic teams. Three layers: **authoring** (who agents are), **engine** (how they act), **platform** (how they connect to the world).

> See `docs/personal-notes/vision.md` for the full vision. See `docs/authoring/VOCABULARY.md` for the controlled vocabulary.

---

## Foundation

This repository is built on observable facts, not preferences. Every principle and rule below traces back to one or more of these truths. If a rule conflicts with a truth, the rule is wrong.

- **Conviction drives behavior more reliably than instruction.** A constitutionally charged agent -- one charged with belief -- will do the right thing in situations its instructions never anticipated. An instructed agent will do exactly what it was told and nothing more. The gap between these two is the gap between character and compliance. (Aristotle, *Nicomachean Ethics* II.4, 1105a28-33.)
- **Derivation from shared roots produces coherent systems.** Euclid's five postulates generate all of plane geometry. No theorem contradicts another because they share a common root. An agent whose doctrine derives from its ethos is coherent in the same way. A flat list of disconnected rules will eventually encounter two that conflict -- and have no basis for resolving the conflict.
- **The truth -> belief -> action structure is the one that survives.** Religious tradition, military doctrine, the scientific method, craft guilds -- every durable system transmits truths, derives beliefs, then derives practices. Systems that skip the belief layer are brittle. Systems that skip the truth layer are dogma.
- **Agents are non-deterministic functions.** They are closer to computer functions than to humans -- stateless, terminal, composable -- but their non-determinism means pure instruction is insufficient. Ethos backed by truth narrows the output distribution toward determinism without making it rigid.
- **Teams are the composition primitive.** Two or more agents gathered under a leader is a team. Teams compose into teams. Enough teams compose into an organization. The same primitive at every scale. (Every durable human organization -- business, military, religious, civic -- uses this structure.)
- **Complexity compounds. Simplicity scales.** Every abstraction is a bet that its cost will be repaid. The burden of proof is on complexity, not simplicity.
- **A function you can read top-to-bottom is the only unit a human can fully reason about.** Hidden state is hidden bugs. The signature must tell the truth: what goes in, what comes out, what gets mutated.

### When Things Conflict

This document contains truths (domain facts, proven observations), principles (engineering beliefs), and rules (concrete practices with scope). When they conflict:

1. **Ground it.** Every assertion traces to something established. If it can't be grounded, say so explicitly. Do not hedge -- "X is Y" not "X might be Y."
2. **Derive, don't invent.** Every tenet traces to a known good through an explicit "therefore." If you can't show the derivation, the tenet is arbitrary.
3. **Simplify.** 1-2 "therefores" in each direction. Over-derivation is a defect, not thoroughness.
4. **Listen.** When the code resists or the document fights you, the structure is wrong. Pain is signal. Stop and reorganize.

These four are ordered by priority. A developer should sacrifice simplicity (3) before sacrificing grounding (1).

---

## The Three Layers

```
┌─────────────────────────────────────────────────────┐
│                 Renkei (the system)                  │
├─────────────────────────────────────────────────────┤
│  Layer 1: Authoring           (authoring/)          │
│    Truth → Ethos → Doctrine authoring               │
│    Assembly, deployment to engine-native formats     │
│    Derivation method (the "compiler")               │
├─────────────────────────────────────────────────────┤
│  Layer 2: Engine              (engine/)             │
│    Agent execution runtime (composition over OpenCode)│
│    Teams as core primitive                          │
│    Communication: in-person + email protocols       │
│    CLI + TUI + Web + SDK + Server                   │
├─────────────────────────────────────────────────────┤
│  Layer 3: Platform            (platform/)           │
│    Human-compatible interfaces (email, Slack, etc.) │
│    Server deployment and orchestration              │
│    Observation capture and session replay            │
└─────────────────────────────────────────────────────┘
```

**Layer 1** defines WHO agents are. The authoring layer produces agent definitions grounded in domain truths and driven by conviction.

**Layer 2** embodies agents and lets them act. The engine (composition layer over vanilla OpenCode) executes archetypes as live agents, composes them into teams, manages communication, and gives humans operational control. This is the runtime layer.

**Layer 3** connects agents to the world humans already use. Email, Slack, Discord, databases, file systems -- not invented tools, but the tools that already exist. This is the platform layer.

The layers have a strict dependency direction. Authoring does not depend on the engine. The engine depends on authoring's output format. Platform depends on the engine.

---

## Where Things Live

> **IMPORTANT**: Every file must have a clear home. If you're unsure where something belongs, walk the decision tree below. Putting code or docs in the wrong place creates debt that compounds with every feature.

### The Six Categories

Every directory in the codebase belongs to exactly one category. Each category carries a **rule** -- not a label.

| Category | Rule | Location |
|---|---|---|
| **Authoring** | Archetype authoring system. Definitions, assembly tooling, authoring-specific docs. See `authoring/AGENTS.md`. | `authoring/` |
| **Engine** | Agent execution runtime. Composition layer over vanilla OpenCode. See `engine/AGENTS.md`. | `engine/` |
| **Docs** | Stable, synthesized references. Edit only when decisions change. Not a working area. | `docs/` |
| **Thoughts** | Working area. Ideas, issues, research, specs, skill drafts. Historical record -- do not modify research papers. | `thoughts/` |
| **Root** | Repo metadata only. `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore`. Nothing else at root level. | `/` |

### Dependencies Flow One Direction

```
docs ← authoring ← engine ← platform
           ^
    thoughts (read by humans and agents, never imported by code)
```

- **Docs** are the stable product of synthesis from research and decisions. They are the system's intellectual foundation.
- **Authoring** produces archetype definitions and assembled skill files. It references docs (vocabulary, authoring method) but never imports engine code.
- **Engine** consumes authoring output (skill files, archetype metadata). It never defines archetype content. It never modifies the authoring layer.
- **Thoughts** are working material. They feed into docs, authoring, and engine when decisions are made. They are never imported by code.

### Decision Tree

When you have new content to place, walk this tree:

```
Is it code?
|
+-- Yes
|   +-- Does it define or assemble archetypes? (Python)
|   |   +-- Yes → authoring/lib/
|   |           Rule: own file, independently runnable, no engine imports
|   |
|   +-- Does it execute agents, manage teams, or run the runtime? (TypeScript)
|   |   +-- Yes → engine/
|   |           Rule: composes over vanilla OpenCode, no authoring internals
|   |
|   +-- Neither → Reconsider: does this code belong in renkei at all?
|
+-- No (it's markdown)
    +-- Is this a stable, synthesized reference?
    |   +-- Yes → docs/authoring/ or docs/personal-notes/
    |             Rule: edit only when decisions change
    |
    +-- Is this an archetype definition (truth, ethos, doctrine articles)?
    |   +-- Yes → authoring/archetypes/<team>/<name>/<pillar>/
    |             Rule: each article is one file, manifest declares assembly order
    |
    +-- Is this working material (ideas, issues, research, specs, drafts)?
        +-- Yes → thoughts/<category>/
                  Rule: historical record, date-stamped where applicable
```

Every path terminates in a location AND a rule. If the content doesn't fit any path, extend the tree.

---

## Repository Structure

```
authoring/                        # Layer 1: Archetype authoring system
  archetypes/
    development/                  # Development team
      _shared/                    # Shared articles across team archetypes
        doctrine/
        ethos/
      test-designer/              # Archetype: contract-to-test-spec design
        archetype.yaml            # Manifest: assembly order, output targets, metadata
        truth/                    # Domain known goods
        ethos/                    # Identity, tenets, principles
        doctrine/                 # Process, orchestration, pipeline, output contract
        references/               # Supporting material deployed alongside skill file
      test-implementer/           # Archetype: TDD red phase test code writer
      implement-plan/             # Archetype: plan execution, makes tests pass
  lib/
    assemble.py                   # Assembly script: compose, diff, deploy, git-wrap

engine/                           # Layer 2: Agent execution runtime
  (Composition layer over vanilla OpenCode -- see engine/AGENTS.md)

docs/
  authoring/                      # Stable, synthesized authoring documentation
    AUTHORING.md                  # How agent archetypes are built (the derivation method)
    VOCABULARY.md                 # Controlled vocabulary -- THE authoritative term reference
    WHY.md                        # Why Renkei exists + decision filter
  personal-notes/                 # Vision, decisions, and thesis documents
    chaos-to-order.md             # Truth-seeking code thesis
    decisions.md                  # All decisions with grounding (authoritative record)
    vision.md                     # Full project vision
  things/
    agent-archetype/              # Archetype structure definitions

thoughts/
  roadmap.md                      # Living milestone tracker
  milestones/                     # One brief per milestone when it becomes active
  projects/                       # Active project workspaces
  ideas/                          # open/ rejected/ shipped/
  issues/                         # open/ closed/
  observations/                   # open/ validated/ dismissed/
  research/                       # Numbered research papers (01-*.md through 09-*.md)
  skills/                         # Skill drafts and new skill definitions
    drafts/                       # Draft updates to existing deployed skills
  specs/                          # Dated specifications (YYYY-MM-DD-name.md)
```

---

## The Contract Between Layers

The authoring layer and engine connect through a defined output format. Neither imports the other's internals.

**Authoring produces:**
- Assembled skill files (SKILL.md) -- the full archetype rendered for a specific engine
- Archetype metadata (manifests) -- team membership, roles, assembly order
- Shared vocabulary (VOCABULARY.md) -- term definitions both layers use

**Engine consumes:**
- Skill files as agent system prompts
- Metadata for team composition, role assignment, progressive disclosure
- Vocabulary for consistent UI labeling and communication

Change authoring's assembly process -- the engine does not care as long as the output format holds. Change the engine's UI -- authoring does not care as long as it still loads skill files.

This is the compiler/runtime relationship. Authoring is the compiler (source → executable). The engine is the runtime (executes the output). The skill file is the object code.

---

## File Organization

> **IMPORTANT**: The directory doctrine tells you where things live. The file doctrine tells you what a file contains. A file that mixes unrelated concepts is as harmful as content in the wrong directory.

### The Rule

**One file = one concept.** Not one function -- one concept. A concept is an idea a developer or author seeks as a unit.

A Python file may contain multiple functions and a dataclass if they serve one concept. A markdown file may contain multiple sections if they serve one concept. A file must never contain two unrelated ideas. If you struggle to name it, it owns too much.

### When to Split

Split when concepts diverge. Never split to hit a line count.

**Split triggers:**

1. **Distinct concepts.** Two ideas a person thinks about separately.
2. **Natural duality.** Read/write, compose/deploy, design/implement.
3. **Independent change.** Code changes for a different reason than its neighbours.

**Do NOT split when:**

- The file is "big" but cohesive. Size follows from content, not the reverse.
- Splitting forces readers to jump between files to understand one idea.

---

## Naming

### Code

| Code Kind | Case | Example |
|---|---|---|
| Functions (Python) | `snake_case` | `def read_manifest()` |
| Functions (TypeScript) | `camelCase` | `function loadArchetype()` |
| Classes / types | `PascalCase` | `class ArchetypeManifest` / `type TeamConfig` |
| Variables | `snake_case` (Python) / `camelCase` (TypeScript) | |
| Constants (module-level) | `SCREAMING_SNAKE_CASE` | `PILLARS = ["truth", "ethos", "doctrine"]` |
| Modules / files | `snake_case` (Python) / `kebab-case` (TypeScript) | `assemble.py` / `archetype-loader.ts` |
| CLI flags | `--kebab-case` | `--dry-run`, `--push`, `--force` |

### Domain Naming

| Pattern | Rule |
|---|---|
| Top-level directory | The layer it owns: `authoring`, `engine`, `docs`, `thoughts` |
| Archetype directory | The agent it defines: `test-designer`, `api-designer` |
| Pillar directory | Exactly one of: `truth`, `ethos`, `doctrine` |
| Article file | The article it contains: `identity.md`, `tenets.md`, `process.md` |
| Python file | The domain of its functions: `assemble.py`, `convert.py` |
| TypeScript file | The domain of its functions: `archetype-loader.ts`, `team-manager.ts` |
| Function | Verb, imperative: `read_manifest`, `assemble`, `loadArchetype`, `spawnTeam` |

**Never**: `Manager`, `Handler`, `Service`, `Helper`, `Utils` (over 200 lines), `Base`, `Abstract`. These names describe an architectural role, not a domain concept. A name that describes the domain (`assemble`, `manifest`, `article`) survives refactoring. A name that describes the pattern (`AssemblyManager`, `ArticleService`) becomes a lie the moment the implementation changes.

---

## Code Style

### Principles

These apply to all code in the system -- Python, TypeScript, whatever arrives next.

- **Honest signatures.** A function's parameters tell you what it needs. Its return type tells you what it produces. If it mutates state, that is visible in the signature. The signature never lies.
- **Prevent, don't detect.** Make invalid states unrepresentable. Validate external data at the gate. Assert internal invariants. Crash on violations.
- **Compute, don't remember.** Recompute what is cheap. A cache is hidden state with an eviction policy you'll forget. If you cannot name the invalidation trigger, you cannot have the cache.
- **Return data, not promises.** A pure function is done when it returns. A stateful object is never done -- it's between mutations.
- **Complexity compounds. Simplicity scales.** The simplest code that does the job is the best code. Every abstraction must justify its cost.

### Procedural Style

This is a procedural codebase across both layers. No class hierarchies, no inheritance, no "design patterns" that exist to work around OOP's limitations.

- Dataclasses / plain objects hold data. No domain logic on types.
- Functions operate on data. They live in files organized by domain, not stapled onto the types they happen to use.
- Control flow is explicit. An `if` chain is almost always clearer than dynamic dispatch.
- State is a value you pass around, not a property you hide inside an object and mutate through methods.

### Python Conventions (Authoring)

- **Type hints on all function signatures.** Parameters and return types. No `Any` unless genuinely needed. Use `Path`, not `str`, for filesystem paths.
- **`pathlib.Path` for all filesystem operations.** Not `os.path`. Not string concatenation.
- **Explicit imports only.** No wildcard imports. Sort alphabetically. Stdlib first, then third-party, then local.
- **`subprocess.run` with `check=True` and `capture_output=True`** for external commands.
- **`sys.exit(1)` for fatal errors.** Print to `sys.stderr`.
- **f-strings for formatting.** Not `.format()`, not `%`.
- **No global mutable state.** Module-level constants are fine. Module-level variables that change are not.

### TypeScript Conventions (Engine)

To be established when the engine is integrated. Will follow the same principles (honest signatures, procedural style, explicit control flow) adapted for TypeScript/Bun idioms.

### Dependencies

Python tooling uses only stdlib plus:

| Package | Purpose |
|---|---|
| `pyyaml` | Parse `archetype.yaml` manifests |

TypeScript dependencies will be inherited from vanilla OpenCode's existing dependency tree plus minimal additions.

Do not add dependencies without justification. Every dependency is a bet that its maintenance, security, and API stability will be worth the cost of not writing the code yourself.

---

## Controlled Vocabulary

`docs/authoring/VOCABULARY.md` is the single source of truth for all terminology. Rules:

- **One preferred term per concept, one definition per term.**
- Terms are constant across all domains -- a term means the same thing in docs, code comments, GUI labels, and conversation.
- When a document needs a term not listed in VOCABULARY.md, add it there first. Never define terms locally.
- Check the deprecated terms table before using any term.

Key terms you must use correctly:

| Term | Meaning |
|---|---|
| Archetype | Complete agent definition (Truth + Ethos + Doctrine pillars) |
| Pillar | One of three required top-level divisions: Truth, Ethos, Doctrine |
| Article | A compositional piece within a pillar (the atomic authoring unit) |
| Team | A composed collection of archetypes working toward a shared goal |
| Harness | The agentic runtime that executes archetypes |
| Assembly | Composing articles into output, guided by a manifest |
| Skill File | Host-specific output produced by assembling an archetype |
| Manifest | `archetype.yaml` declaring assembly order and metadata |
| Known Good | An established, citeable, inarguable fact within a domain |
| Derivation | Deriving ethos from known goods, doctrine from ethos, via "therefore" links |

---

## Writing Guidelines

### Markdown Style

- Use `#` headings hierarchically (`#` for title, `##` for sections, `###` for subsections).
- Use ` -- ` (space-dash-dash-space) for em-dashes in prose.
- Use backticks for term references when introducing or emphasizing vocabulary terms.
- Use code blocks with language hints for structural diagrams.
- Links between documents use relative paths.

### Document Conventions

- **Authoring docs** (`docs/authoring/`): Synthesized, stable references. Edit only when decisions change.
- **Decisions** (`docs/personal-notes/decisions.md`): Every decision records its grounding and a reference to the research that produced it.
- **Research papers** (`thoughts/research/`): Numbered sequentially. Historical record -- do not modify.
- **Specs** (`thoughts/specs/`): Dated (`YYYY-MM-DD-name.md`). Define concrete changes.
- **Issues** (`thoughts/issues/`): Tracked as markdown in `open/` or `closed/`.
- **Observations** (`thoughts/observations/`): Structured field notes from real use.
- **Skill drafts** (`thoughts/skills/drafts/`): Updates to existing skills pending deployment.

### Tone and Style

- Direct, precise, no hedging. "X is Y" not "X might be Y."
- Ground claims. Every assertion traces to something established.
- No filler. State the thing.
- Use the framework's own patterns: known goods justify tenets, tenets justify actions.

---

## Verification

### The Compiler Proves Types. Humans Prove Derivations.

**Authoring verification:**
- Assembly: `--dry-run` shows assembled output. `--push` shows diffs. Every deploy is git-committed for rollback.
- Derivation: every tenet traces to a known good, every doctrine article traces to an ethos article. The audit trail is the therefore-chain.
- Vocabulary: terms defined in one place. Deprecated terms listed. Agents check before using.

**Engine verification:**
- To be established when engine is integrated. Will include TypeScript type checking, test runner, and integration tests for team primitives.

### When Code Arrives

- Tests for any function with non-trivial logic.
- A test runner configuration when the first test file is created.
- CI when the first external contributor appears.

Do not add testing infrastructure preemptively. Add it when the first test is written.

---

## Current State

**The constraint is: daily-drivable engine.** Everything else is blocked by not having an engine that can be used instead of plain OpenCode for daily work.

| Layer | Status |
|---|---|
| Authoring | Working. Assembly script, 3 archetypes built and deployed. |
| Engine | Composition layer over vanilla OpenCode. Runtime modules built and tested. Not yet daily-drivable. |
| Platform | Not started. |

See `thoughts/roadmap.md` for the full milestone tracker.

---

## Common Mistakes to Avoid

- Do not use deprecated terms (check VOCABULARY.md deprecated table).
- Do not define terms locally -- add to VOCABULARY.md first.
- Do not confuse archetype (the definition) with skill file (host-specific output).
- Do not add "rules" to ethos. Derive constraints from conviction.
- Do not modify research papers (they are historical record).
- Do not skip grounding. Every decision traces to something established.
- Do not add dependencies without justification.
- Do not put authoring code in engine/ or vice versa. The dependency direction is one-way.

---

## Updating This Document

- When you hit a "where does this go?" question the tree can't answer -- extend the tree.
- When a principle leads to a bad outcome -- revise the principle, document why.
- When the project structure changes (new layers emerge) -- add the layer with its rule.
- When conventions need updating (new tools, new patterns) -- update the conventions section.
- When the critical path advances -- update the current state.
