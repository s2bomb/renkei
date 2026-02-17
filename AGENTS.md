# Renkei

Meta-framework for authoring AI agent archetypes. Defines a derivation chain method for building agent definitions from domain truths through conviction to action.

> See `docs/framework/VOCABULARY.md` for the full controlled vocabulary. See `docs/framework/AUTHORING.md` for the derivation method and its grounding.

---

## Foundation

This repository serves two audiences: **archetype authors** (who write markdown defining agent character and doctrine) and **tooling developers** (who write Python that assembles, deploys, and manages those definitions). Both follow the same foundation. Every principle and rule below traces back to one or more of these truths. If a rule conflicts with a truth, the rule is wrong.

- **Conviction drives behavior more reliably than instruction.** A constitutionally charged agent -- one charged with belief -- will do the right thing in situations its instructions never anticipated. An instructed agent will do exactly what it was told and nothing more. The gap between these two is the gap between character and compliance. (Aristotle, *Nicomachean Ethics* II.4, 1105a28-33.)
- **Derivation from shared roots produces coherent systems.** Euclid's five postulates generate all of plane geometry. No theorem contradicts another because they share a common root. An agent whose doctrine derives from its ethos is coherent in the same way. A flat list of disconnected rules will eventually encounter two that conflict -- and have no basis for resolving the conflict.
- **The truth -> belief -> action structure is the one that survives.** Religious tradition, military doctrine, the scientific method, craft guilds -- every durable system transmits truths, derives beliefs, then derives practices. Systems that skip the belief layer are brittle. Systems that skip the truth layer are dogma.
- **Known goods are identified, not created.** The author's job is curation, not creation. The truths already exist in the domain -- mathematical, empirical, epistemological. Find them.
- **Complexity compounds. Simplicity scales.** Every abstraction is a bet that its cost will be repaid. The burden of proof is on complexity, not simplicity.
- **A function you can read top-to-bottom is the only unit a human can fully reason about.** Hidden state is hidden bugs. The signature must tell the truth: what goes in, what comes out, what gets mutated.

### When Things Conflict

This document contains truths (domain facts, proven observations), principles (engineering beliefs), and rules (concrete practices with scope). When they conflict:

1. **Ground it.** Every assertion traces to something established. If it can't be grounded, say so explicitly. Do not hedge -- "X is Y" not "X might be Y."
2. **Derive, don't invent.** Every tenet traces to a known good through an explicit "therefore." If you can't show the derivation, the tenet is arbitrary.
3. **Simplify.** 1-2 "therefores" in each direction. Over-derivation is a defect, not thoroughness. If a doctrine article needs three links to trace back to a known good, either a missing ethos article would shorten the chain, or the doctrine is over-specified.
4. **Listen.** When the code resists or the document fights you, the structure is wrong. Pain is signal. Stop and reorganize.

These four are ordered by priority. A developer should sacrifice simplicity (3) before sacrificing grounding (1).

---

## Where Things Live

> **IMPORTANT**: Every file must have a clear home. If you're unsure where something belongs, walk the decision tree below. Putting code or docs in the wrong place creates debt that compounds with every feature.

### The Five Categories

Every directory in the codebase belongs to exactly one category. Each category carries a **rule** -- not a label.

| Category | Rule | Location |
|---|---|---|
| **Archetypes** | Source definitions. Each archetype has `archetype.yaml`, three pillar directories, optional `references/`. Never contains assembled output. | `archetypes/<ensemble>/<name>/` |
| **Docs** | Stable, synthesized references. Edit only when decisions change. Not a working area. | `docs/` |
| **Lib** | Python tooling. No archetype content. Independently testable. Operates on archetypes but is not one. | `lib/` |
| **Thoughts** | Working area. Ideas, issues, research, specs, skill drafts. Historical record -- do not modify research papers. | `thoughts/` |
| **Root** | Repo metadata only. `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore`. Nothing else at root level. | `/` |

### Dependencies Flow One Direction

```
docs <- archetypes <- lib
                       ^
                thoughts (read by humans and agents, never imported by lib)
```

- Docs are the stable product of synthesis from research and decisions. They never reference archetypes directly.
- Archetypes are the core product. They reference docs (vocabulary, authoring method) but never import lib code.
- Lib operates on archetypes (reads manifests, composes articles, deploys to harnesses). It never defines archetype content.
- Thoughts are working material. They feed into docs and archetypes when decisions are made. They are never imported by lib.

### Decision Tree

When you have new content to place, walk this tree:

```
Is it Python code?
|
+-- Yes
|   +-- Does it operate on archetypes (assembly, deployment, conversion)?
|       +-- Yes -> lib/<tool>.py
|       |         Rule: own file, independently runnable, no archetype content
|       +-- No  -> Reconsider: does this tool belong in renkei at all?
|
+-- No (it's markdown)
    +-- Is this a stable, synthesized reference?
    |   +-- Yes -> docs/framework/ or docs/personal-notes/
    |             Rule: edit only when decisions change
    |
    +-- Is this an archetype definition (truth, ethos, doctrine articles)?
    |   +-- Yes -> archetypes/<ensemble>/<name>/<pillar>/
    |             Rule: each article is one file, manifest declares assembly order
    |
    +-- Is this working material (ideas, issues, research, specs, drafts)?
        +-- Yes -> thoughts/<category>/
                  Rule: historical record, date-stamped where applicable
```

Every path terminates in a location AND a rule. If the content doesn't fit any path, extend the tree.

---

## Repository Structure

```
archetypes/
  development/              # Development ensemble
    _shared/                # Shared articles across ensemble archetypes
      doctrine/
      ethos/
    test-designer/          # Archetype: contract-to-test-spec design
      archetype.yaml        # Manifest: assembly order, output targets, metadata
      truth/                # Domain known goods
      ethos/                # Identity, tenets, principles
      doctrine/             # Process, orchestration, pipeline, output contract
      references/           # Supporting material deployed alongside skill file
    test-implementer/       # Archetype: TDD red phase test code writer

docs/
  framework/                # Stable, synthesized framework documentation
    AUTHORING.md            # How agent archetypes are built (the derivation method)
    VOCABULARY.md           # Controlled vocabulary -- THE authoritative term reference
    WHY.md                  # Why Renkei exists + decision filter
  personal-notes/           # Vision, decisions, and thesis documents
    chaos-to-order.md       # Truth-seeking code thesis
    decisions.md            # All decisions with grounding (authoritative record)
    vision.md               # Full project vision
  things/
    agent-archetype/        # Archetype structure definitions

lib/
  assemble.py               # Assembly script: compose, diff, deploy, git-wrap

thoughts/
  ideas/                    # open/ rejected/ shipped/
  issues/                   # open/ closed/
  observations/             # open/ validated/ dismissed/ -- field notes from real use
  research/                 # Numbered research papers (01-*.md through 06-*.md)
  skills/                   # Skill drafts and new skill definitions
    drafts/                 # Draft updates to existing deployed skills
  specs/                    # Dated specifications (YYYY-MM-DD-name.md)
```

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
| Functions | `snake_case` | `def read_manifest()` |
| Classes / dataclasses | `PascalCase` | `class ArchetypeManifest` |
| Variables | `snake_case` | `archetype_dir = Path(...)` |
| Constants (module-level) | `SCREAMING_SNAKE_CASE` | `PILLARS = ["truth", "ethos", "doctrine"]` |
| Modules / files | `snake_case` | `assemble.py` |
| CLI flags | `--kebab-case` | `--dry-run`, `--push`, `--force` |

### Domain Naming

| Pattern | Rule |
|---|---|
| Directory | The concept it owns, noun form: `archetypes`, `lib`, `thoughts` |
| Archetype directory | The agent it defines: `test-designer`, `api-designer` |
| Pillar directory | Exactly one of: `truth`, `ethos`, `doctrine` |
| Article file | The article it contains: `identity.md`, `tenets.md`, `process.md`, `orchestration.md` |
| Python file | The domain of its functions: `assemble.py`, `convert.py` |
| Function | Verb, imperative: `read_manifest`, `assemble`, `push_one`, `downshift_headings` |

**Never**: `Manager`, `Handler`, `Service`, `Helper`, `Utils` (over 200 lines), `Base`, `Abstract`. These names describe an architectural role, not a domain concept. A name that describes the domain (`assemble`, `manifest`, `article`) survives refactoring. A name that describes the pattern (`AssemblyManager`, `ArticleService`) becomes a lie the moment the implementation changes.

---

## Code Style

### Principles

- **Honest signatures.** A function's parameters tell you what it needs. Its return type tells you what it produces. If it mutates state, that is visible in the signature. The signature never lies.
- **Prevent, don't detect.** Make invalid states unrepresentable. Validate external data at the gate (CLI args, manifest contents, file paths). Assert internal invariants. Crash on violations. Do not return `None` where you mean "this should never happen."
- **Compute, don't remember.** Recompute what is cheap. A cache is hidden state with an eviction policy you'll forget. If you cannot name the invalidation trigger, you cannot have the cache.
- **Return data, not promises.** A pure function is done when it returns. A stateful object is never done -- it's between mutations.
- **Complexity compounds. Simplicity scales.** Every abstraction is a bet that its cost will be repaid. The burden of proof is on complexity, not simplicity. The simplest code that does the job is the best code.

### Conventions

This is a procedural codebase. No class hierarchies, no inheritance, no "design patterns" that exist to work around OOP's limitations. If you catch yourself reaching for a base class, a factory, a strategy pattern, or a visitor -- stop. You're solving a problem that procedural code doesn't have.

**Domain logic lives in functions, not on classes.**

- Dataclasses and `TypedDict` hold data. They may have `__str__` or `__eq__` but no domain logic.
- Functions operate on data. They live in files organized by domain, not stapled onto the types they happen to use.
- Control flow is explicit. An `if` chain is almost always clearer than dynamic dispatch. When you write a function, the reader can see every path by reading top to bottom.
- State is a value you pass around, not a property you hide inside an object and mutate through methods.

### Python Conventions

- **Type hints on all function signatures.** Parameters and return types. No `Any` unless genuinely needed. Use `Path`, not `str`, for filesystem paths.
- **`pathlib.Path` for all filesystem operations.** Not `os.path`. Not string concatenation.
- **Explicit imports only.** No wildcard imports. Sort alphabetically. Stdlib first, then third-party, then local.
- **`subprocess.run` with `check=True` and `capture_output=True`** for external commands. Never use `os.system`.
- **`sys.exit(1)` for fatal errors.** Print to `sys.stderr`. Do not raise exceptions for expected CLI failures.
- **f-strings for formatting.** Not `.format()`, not `%`.
- **No global mutable state.** Module-level constants are fine. Module-level variables that change are not.

### Dependencies

Python tooling uses only stdlib plus:

| Package | Purpose |
|---|---|
| `pyyaml` | Parse `archetype.yaml` manifests |

Do not add dependencies without justification. Every dependency is a bet that its maintenance, security, and API stability will be worth the cost of not writing the code yourself.

---

## Controlled Vocabulary

`docs/framework/VOCABULARY.md` is the single source of truth for all terminology. Rules:

- **One preferred term per concept, one definition per term.**
- Terms are constant across all domains -- a term means the same thing in docs, code comments, GUI labels, and conversation.
- When a document needs a term not listed in VOCABULARY.md, add it there first. Never define terms locally in individual documents.
- Check the deprecated terms table before using any term. Do not use: "component", "element", "workflow" (as noun for process), "pipeline" (as noun for ensemble), or "rule" (as ethos article).

Key terms you must use correctly:

| Term | Meaning |
|---|---|
| Archetype | Complete agent definition (Truth + Ethos + Doctrine pillars) |
| Pillar | One of three required top-level divisions: Truth, Ethos, Doctrine |
| Article | A compositional piece within a pillar (the atomic authoring unit) |
| Ensemble | A composed collection of archetypes working toward a shared goal |
| Harness | The agentic runtime (Claude Code, OpenCode) -- Renkei is NOT a harness |
| Assembly | Composing articles into output, guided by a manifest |
| Skill File | Host-specific output produced by assembling an archetype |
| Manifest | `archetype.yaml` declaring assembly order and metadata |
| Known Good | An established, citeable, inarguable fact within a domain |
| Derivation | Deriving ethos from known goods, doctrine from ethos, via "therefore" links |

---

## Writing Guidelines

### Markdown Style

- Use `#` headings hierarchically (`#` for title, `##` for sections, `###` for subsections).
- Use ` -- ` (space-dash-dash-space) for em-dashes in prose. This is used consistently across the repo.
- Use backticks for term references when introducing or emphasizing vocabulary terms.
- Use code blocks with language hints for structural diagrams.
- Links between documents use relative paths: `[ETHOS.md](./ETHOS.md)`.

### Document Conventions

- **Framework docs** (`docs/framework/`): Synthesized, stable references. Edit only when decisions change.
- **Decisions** (`docs/personal-notes/decisions.md`): Every decision records its grounding and a reference to the research that produced it. Format: `**Decision**: ... **Grounding**: ... **Reference**: ...`
- **Research papers** (`thoughts/research/`): Numbered sequentially (`01-`, `02-`, etc.). Exploratory, may contain superseded ideas. Do not modify existing research papers unless correcting errors.
- **Specs** (`thoughts/specs/`): Dated (`YYYY-MM-DD-name.md`). Define concrete changes with origin, problem, solution, and affected items.
- **Issues** (`thoughts/issues/`): Tracked as markdown in `open/` or `closed/`. May be voice note transcripts.
- **Observations** (`thoughts/observations/`): Structured field notes from real use. Tracked in `open/`, `validated/`, or `dismissed/`. Each observation separates what happened from what it might mean. Format: Context, What Happened, What Was Expected, Hypothesis, Disposition.
- **Skill drafts** (`thoughts/skills/drafts/`): Updates to existing skills pending deployment.

### Tone and Style

- Direct, precise, no hedging. "X is Y" not "X might be Y" or "X could potentially be Y".
- Ground claims. Every assertion should trace to something established. If it can't be grounded, say so explicitly.
- No filler. No "it's important to note that" or "it should be mentioned that". State the thing.
- Use the framework's own patterns: known goods justify tenets, tenets justify actions. Apply this structure when making arguments.

---

## Core Concepts

### The Derivation Chain

```
KNOWN GOOD  ->therefore->  ETHOS  ->therefore->  DOCTRINE
```

- **1-2 "therefores" max** in each direction (the derivation boundary).
- If a doctrine article needs 3+ links back to a known good, either a missing ethos article would shorten the chain, or the doctrine is over-specified.
- Known goods are **identified** (curated from the domain), not **invented**.

### Three Pillars (locked, immutable)

1. **Truth** -- domain-specific known goods. Required. Even a simple agent needs at least 2 sentences.
2. **Ethos** -- who the agent is, what it believes, how it thinks. The pillar of *being*. Stable across workflow changes.
3. **Doctrine** -- what the agent does, how it delegates, what it produces. The pillar of *doing*. Evolves as workflows change.

### Ethos vs Rules

Rules (NEVER/ALWAYS) are *nomos* (external law), not *ethos* (internal character). The framework explicitly rejects rules as an ethos article. If an agent needs a rule, the ethos isn't deep enough. A constitutionally charged agent derives constraints from conviction.

### Verbatim Propagation

Orchestrators pass ethos to sub-agents **byte-identical**. No paraphrasing, no normalization. Paraphrasing introduces drift.

---

## Tooling

### Assembly Script (`lib/assemble.py`)

Reads `archetype.yaml`, composes articles in pillar order (truth -> ethos -> doctrine), and produces a host-adapted SKILL.md for Claude Code. Every deploy is git-wrapped with pre-deploy snapshot and post-deploy commit for rollback safety.

**Commands:**

```bash
# Preview assembled output (no file writes)
python lib/assemble.py archetypes/development/test-designer --dry-run

# Assemble to a specific output directory
python lib/assemble.py archetypes/development/test-designer -o output/

# Assemble all archetypes in an ensemble
python lib/assemble.py --all archetypes/development/

# Deploy: assemble, diff, approve, write to target, git commit
python lib/assemble.py --push archetypes/development/test-designer

# Deploy all, skip interactive approval
python lib/assemble.py --push --force --all archetypes/development/
```

**What `--push` does:**

1. Assembles the archetype into a SKILL.md string
2. Shows a diff against the currently deployed file
3. Prompts for approval (unless `--force`)
4. Commits the current deployed state as a pre-deploy snapshot (rollback point)
5. Writes the new SKILL.md and copies `references/` if present
6. Commits the new state as a deploy commit

**Dependencies:** `pyyaml` (for YAML manifest parsing). No other third-party packages.

---

## Verification

### The Compiler Proves Types. Humans Prove Derivations.

There is no test runner. The verification strategy is structural:

- **Assembly verification**: `--dry-run` shows the assembled output without writing files. `--push` shows a diff before deploying. Every deploy is git-committed for rollback.
- **Derivation verification**: Every tenet traces to a known good. Every doctrine article traces to an ethos article. The audit trail is the therefore-chain, readable by humans.
- **Vocabulary verification**: Terms are defined in one place (`VOCABULARY.md`). Deprecated terms are listed. Agents check the deprecated table before using any term.

### When Code Arrives

As the lib directory grows (conversion tools, GUI, validators), add:

- Tests for any function with non-trivial logic (assembly composition, heading shifting, git integration)
- A test runner configuration when the first test file is created
- CI when the first external contributor appears

Do not add testing infrastructure preemptively. Add it when the first test is written.

---

## Critical Path (Current State)

Steps 1-6 are done. Step 7 is next.

1. ~~Synthesize into VOCABULARY.md~~
2. ~~Write WHY.md~~
3. ~~Define file system structure~~ (archetypes on disk, assembly script built)
4. ~~Decompose test-writer as proof of concept~~ (test-designer + test-implementer archetypes created, skills deployed)
5. ~~Write assembly script~~ (`lib/assemble.py` with git-wrapped deploys)
6. ~~Round-trip validation~~ (archetypes assembled and deployed, architect skills updated)
7. Decompose all archetypes (~16 skills + ~14 sub-agents)
8. Build GUI
9. Build conversion tools

---

## Common Mistakes to Avoid

- Do not use deprecated terms (check VOCABULARY.md deprecated table).
- Do not define terms locally -- add to VOCABULARY.md first.
- Do not confuse archetype (the definition) with skill file (host-specific output).
- Do not confuse ensemble (collection of archetypes) with pipeline (one topology).
- Do not add "rules" to ethos. Derive constraints from conviction.
- Do not modify research papers (they are historical record). Write new research or update framework docs instead.
- Do not skip grounding. Every decision, every tenet, every structural choice must trace to something established.
- Do not add Python dependencies without justification.
- Do not add testing infrastructure before writing the first test.

---

## Updating This Document

- When you hit a "where does this go?" question the tree can't answer -- extend the tree.
- When a principle leads to a bad outcome -- revise the principle, document why.
- When the project structure changes (new categories emerge) -- add the category with its rule.
- When Python conventions need updating (new tools, new patterns) -- update the conventions section.
- When the critical path advances -- update the checklist.
