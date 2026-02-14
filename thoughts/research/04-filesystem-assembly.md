# Research: File System Structure and Assembly Mechanism

How should archetype elements be organized on disk, and how do decomposed elements assemble into usable artifacts?

## The Constraint Set

Before evaluating options, the constraints that any solution must satisfy:

1. **Decomposed authoring.** Elements (Identity, Tenets, Principles, Rules, Process, Orchestration, Pipeline, Output Contract) are authored in separate files (vision.md: "You edit components individually").
2. **Assembled output.** The system produces host-specific artifacts -- SKILL.md files for Claude Code, agent configs for OpenCode, etc. (vision.md: "Renkei assembles them into the skill files your harness expects").
3. **Verbatim propagation.** Orchestrators pass ethos to sub-agents exactly, without paraphrasing (ETHOS.md: "Verbatim propagation is immutable -- the text is forwarded exactly, not paraphrased"). The assembly mechanism must support extracting ethos content for injection into delegation blocks.
4. **Shared elements.** Multiple archetypes within a grouping may share tenets, principles, or rules (e.g., all agents in a pipeline share "silence is failure"). These must be maintainable in one place.
5. **Derivation traceability.** Each element traces to known goods through "therefore" links (DERIVATION.md). The file structure should make derivation visible, not obscure it.
6. **Round-trip capability.** The system must be able to decompose existing flat SKILL.md files into elements and reassemble them. The ~16 existing skills are the test bed.

## Part 1: Directory Structure

### What Other Systems Do

**Military doctrine** organizes by abstraction level: ADPs (principles) > FMs (practices) > ATPs (techniques). Within each level, publications are organized by functional area (operations, intelligence, logistics, planning). The structure is a matrix: abstraction level x functional domain. There is no single "correct" nesting -- the hierarchy serves navigation, not compilation.

**DITA** separates content from assembly. Topics live in a content directory organized by type or domain. Maps (assembly manifests) live separately and reference topics by path. The same topic can appear in multiple maps. Content organization is independent of output organization.

**Ansible** uses convention-over-configuration: `roles/<role-name>/tasks/main.yml`, `roles/<role-name>/handlers/main.yml`, etc. The directory structure *is* the manifest -- Ansible discovers components by their position in the tree. No separate manifest file needed for basic cases.

**Kustomize** uses `kustomization.yaml` as a manifest that references base resources and overlays. Bases are reusable; overlays specialize. The structure is: `base/` + `overlays/dev/` + `overlays/prod/`. Each overlay references the base and applies patches.

**Literate programming (WEB/CWEB)** stores everything in a single source file. Named chunks can be defined across multiple locations in the file; TANGLE concatenates all chunks with the same name in document order. Assembly order is controlled by chunk references from a root chunk. The source file *is* the manifest.

**Liturgical books** separate proper (unique per feast) from common (shared across feasts). The liturgical calendar serves as the manifest, controlling which proper + common elements combine for a given day. Assembly is: retrieve proper elements, combine with common elements according to rubrical rules.

### The Right Structure for Renkei

The structure must serve three operations: authoring (editing individual elements), assembly (building output artifacts), and navigation (finding things). These pull in different directions. Deep nesting serves authoring (isolation) but hurts navigation (too many clicks). Flat structures serve navigation but conflate concerns.

The pattern that best fits the constraints is **Ansible's convention-based directory structure** combined with **DITA's separation of content from assembly manifest**.

**Proposed structure:**

```
archetypes/
  <grouping>/
    <archetype-name>/
      archetype.yaml          # Manifest: assembly order, shared refs, output targets
      TRUTH.md                # Known goods grounding this archetype
      ethos/
        identity.md
        tenets.md
        principles.md
        rules.md
      doctrine/
        process.md
        orchestration.md      # Only for orchestrator archetypes
        pipeline.md
        output-contract.md
    _shared/                  # Shared elements within this grouping
      tenets/
        silence-is-failure.md
        truth-over-completion.md
      principles/
        source-documents-ground-truth.md
      rules/
        never-assume.md
```

**Why this structure:**

1. **Two-level nesting under archetype name (ethos/, doctrine/).** This mirrors the fundamental Ethos/Doctrine divide documented in the archetype model. The divide has different change frequencies, different authoring concerns, and different failure modes (agent-archetype README.md). Grouping by domain rather than listing all elements flat makes the structure self-documenting: opening `ethos/` shows you everything about character; opening `doctrine/` shows you everything about work.

2. **archetype.yaml as manifest.** DITA maps, Kustomize's kustomization.yaml, Helm's Chart.yaml, and Make's Makefile all demonstrate that a manifest file controlling assembly is superior to implicit assembly from directory structure alone. The manifest declares: assembly order, which shared elements to include, which output formats to generate, and any archetype-specific overrides. This is the minimum viable manifest -- it can grow as needs emerge.

3. **_shared/ directory at the grouping level.** The underscore prefix is a convention borrowed from Jekyll/Hugo (files prefixed with `_` are not directly processed as content). Shared elements live at the grouping level because sharing is most natural within a grouping -- agents in the same pipeline share values. Cross-grouping sharing is possible via path references but should be rare; if many archetypes across groupings share the same tenet, it may indicate the tenet belongs at a higher level of abstraction.

4. **TRUTH.md at the archetype root, not inside ethos/.** The known goods are the axioms from which ethos derives (DERIVATION.md: "The ethos is not invented. It is derived from truths that are established, citeable, and inarguable"). TRUTH.md sits above ethos/ because it is the grounding for ethos, not a component of it. This makes the derivation chain visible in the directory structure: TRUTH.md > ethos/ > doctrine/.

5. **Element files are plain markdown.** No frontmatter, no metadata in the content files themselves. Metadata (assembly order, shared refs, output targets) belongs in the manifest. Content files are pure content. This follows the principle of separation of concerns demonstrated by every system studied: DITA separates topics from maps, DocBook separates content from XInclude structure, Kustomize separates resources from kustomization.yaml. Mixing metadata into content files creates the exact conflation problem that decomposition is meant to solve.

### Depth Considerations

**Two levels deep from archetype root is the limit.** The archetype has `ethos/tenets.md` (two levels) and `doctrine/process.md` (two levels). This is consistent with DERIVATION.md's boundary: "KNOWN GOOD > therefore > ETHOS (1-2 links max) / ETHOS > therefore > DOCTRINE (1-2 links max)." If the derivation chain shouldn't exceed 2 links, the directory depth shouldn't either. Deeper nesting (e.g., `ethos/tenets/silence-is-failure.md`) would fragment content below the useful authoring unit -- a tenet is already atomic.

**Exception: orchestration may need subdirectories.** Orchestrators have perspective sets, verbatim blocks, and quality gates. If these grow large, `doctrine/orchestration/` could contain `perspectives.md`, `verbatim-blocks.md`, and `quality-gates.md`. But this should be deferred until the existing ~16 skills demonstrate the need.

## Part 2: Assembly Mechanism

### What Other Systems Do

The assembly mechanisms in studied systems fall into four categories:

| Mechanism | Systems | How It Works |
|-----------|---------|-------------|
| **Concatenation** | Literate programming (TANGLE), Make (linking) | Named chunks/object files joined in dependency order. Pure text/binary join. No transformation. |
| **Template expansion** | Helm, Hugo/Jekyll, Jinja2/Ansible | Placeholders in templates replaced with values. Logic (conditionals, loops) in templates. Output depends on input values. |
| **Include/compose** | DITA (conref + maps), DocBook (XInclude), C preprocessor (#include) | Content pulled from external files and inserted at reference points. Can be recursive. |
| **Transformation** | Kustomize (patches), Legal codification (editorial reorganization) | Base content modified by overlays/patches. Original preserved; modifications applied declaratively. |

**Which fits Renkei?**

The answer is **include/compose** as the primary mechanism, with **concatenation** as the fallback for simple cases.

Renkei's assembly is fundamentally about *composing authored content into a larger document*. It is not about:
- Template expansion (there are no variables to substitute -- the content is the content)
- Transformation (the content is not modified during assembly -- it is composed)
- Compilation (there is no type checking, linking, or code generation)

The closest analogy is **DITA map + topic composition**: a manifest (archetype.yaml) references content files (element .md files), specifies assembly order, and the assembler reads the manifest, reads the referenced files, and produces a composed output document.

### The Assembly Process

```
archetype.yaml (manifest)
       |
       | reads
       v
 +-----------+     +-----------+     +-----------+
 | TRUTH.md  |     | ethos/    |     | doctrine/ |
 |           |     | *.md      |     | *.md      |
 +-----------+     +-----------+     +-----------+
       |                 |                 |
       +--------+--------+---------+-------+
                |                  |
                v                  v
          [assembler]        [shared refs
           reads manifest,    resolved from
           resolves refs,     _shared/]
           orders content
                |
                v
         assembled.md
         (intermediate)
                |
                v
         [host adapter]
         (formats for target)
                |
                v
         SKILL.md / agent.yaml / etc.
         (host-specific output)
```

**Step 1: Manifest resolution.** The assembler reads `archetype.yaml`, which declares:
- Which element files to include
- Assembly order (which may differ from filesystem order)
- References to shared elements (`_shared/tenets/silence-is-failure.md`)
- Output target(s) (Claude Code SKILL.md, OpenCode config, etc.)

**Step 2: Content reading and composition.** The assembler reads each referenced file in manifest order. For shared elements, the assembler resolves the path and reads the shared file. The result is a single composed markdown document containing all elements in the declared order.

**Step 3: Host adaptation.** The composed markdown is formatted for the target harness. For Claude Code, this means:
- Adding YAML frontmatter (`name`, `description`)
- Structuring content under the headings Claude Code expects
- Wrapping verbatim propagation blocks in the format the harness uses for delegation

This is a two-phase process (compose then adapt) rather than a single-phase process because the composed intermediate is useful on its own -- it is the canonical archetype document, readable by humans, independent of any harness. The host adapter is a separate concern.

### Why Not Pure Concatenation?

Pure concatenation (cat file1.md file2.md > output.md) is tempting because it is simple. It works for the trivial case. But it fails for:

1. **Shared elements.** Concatenation cannot resolve references to shared files. You need path resolution.
2. **Ordering.** Concatenation follows filesystem order (alphabetical) unless you hardcode the order. The manifest provides explicit ordering.
3. **Conditional inclusion.** Not all archetypes have all elements (non-orchestrators lack orchestration.md). Concatenation includes everything or nothing. The manifest provides selective inclusion.
4. **Host formatting.** Different targets need different formatting. Concatenation produces one output. The two-phase process produces host-specific outputs.
5. **Verbatim extraction.** Verbatim propagation requires extracting ethos content and embedding it in delegation blocks. This requires understanding the content structure, not just joining files.

That said, for the simplest case (single archetype, all elements, one target), the assembly should reduce to something very close to concatenation. The system should be simple by default and complex only when the use case demands it.

### Why Not Template Expansion?

Template expansion (Helm, Jinja2) is overkill. The element files contain authored prose, not parameterized templates. There are no variables to substitute, no loops to execute, no conditionals to evaluate. The content is the content.

If template expansion were introduced, it would create a second language inside the markdown files -- `{{ tenet.name }}` or `{% if orchestrator %}` -- that authors would need to learn. This violates the design goal of plain markdown content files. The manifest handles conditionality; the content files stay pure.

The one exception where something template-like might be needed is verbatim propagation blocks, where an orchestrator's delegation message must include ethos content from the archetype. This is better modeled as an *include directive* in the manifest (`verbatim: ethos/*`) than as template syntax in the content.

## Part 3: The Manifest (archetype.yaml)

### Minimum Viable Manifest

```yaml
# archetype.yaml
name: test-writer
grouping: development-pipeline
type: orchestrator  # or: worker, utility

# Assembly order -- elements listed in output order
elements:
  - TRUTH.md
  - ethos/identity.md
  - ethos/tenets.md
  - shared: _shared/tenets/silence-is-failure.md
  - shared: _shared/tenets/truth-over-completion.md
  - ethos/principles.md
  - ethos/rules.md
  - doctrine/process.md
  - doctrine/orchestration.md
  - doctrine/pipeline.md
  - doctrine/output-contract.md

# Output targets
outputs:
  - format: claude-code
    path: .claude/skills/test-writer/SKILL.md
```

**Why YAML, not TOML or JSON?** YAML is the lingua franca of the systems studied: Ansible (playbooks, roles), Helm (Chart.yaml, values.yaml), Kustomize (kustomization.yaml), DITA (while XML, modern tooling uses YAML for configuration), Hugo/Jekyll (frontmatter and config). JSON lacks comments and is harder to read. TOML is less widely known. YAML has the advantage of being immediately familiar to the target audience (developers who work with agent harnesses).

**Why explicit element ordering in the manifest?** The filesystem has no inherent order. Alphabetical order (`doctrine/` before `ethos/`) would put doctrine before ethos, which inverts the derivation chain. The manifest makes order explicit and intentional, matching the derivation flow: TRUTH > Ethos > Doctrine.

**Why `shared:` prefix?** This makes shared element references visually distinct from local elements. The assembler knows to resolve shared paths relative to the grouping's `_shared/` directory. An alternative is a separate `shared_elements` section, but inline declaration preserves the assembly order context -- you can see exactly where the shared tenet appears in the final output.

### Manifest vs. Convention

Ansible demonstrates that convention-based discovery (tasks/main.yml is always loaded) can eliminate manifest files for simple cases. Should Renkei support convention-based assembly without a manifest?

**No, for three reasons:**

1. **Order matters and convention cannot express it.** Ansible tasks execute in file order because tasks are sequential. Renkei elements have a specific derivation-driven order (Truth > Identity > Tenets > Principles > Rules > Process > Orchestration > Pipeline > Output Contract) that doesn't match any alphabetical or conventional ordering.

2. **Shared elements require explicit declaration.** Convention cannot express "include silence-is-failure.md from the shared directory between the local tenets and principles." This requires a manifest.

3. **The manifest is small.** A typical archetype.yaml is 15-25 lines. The cost of maintaining it is trivial. The benefit -- explicit, readable, versionable assembly specification -- is significant.

However, a `renkei init` command could generate a default manifest from the directory contents, reducing the authoring burden for new archetypes.

## Part 4: Shared Elements

### The Problem

The user's ~16 skills and ~14 sub-agents likely share tenets, principles, and rules. "Silence is failure" probably appears in multiple skills. If each skill has its own copy, values drift. If shared values are maintained in one place, the question is how to reference and compose them.

### How Other Systems Handle It

**DITA conref**: A topic references a specific element in another topic by ID. The conref is resolved during processing; the referenced content replaces the conref element. Fragments can be as small as a single paragraph or as large as an entire section. This is the most granular approach.

**Liturgical proper/common**: Unique content lives in the proper (per-feast). Shared content lives in the common (per-category). Assembly combines proper + common according to rubrical rules. The separation is at the file level, not the element level.

**Kustomize bases**: Shared configuration lives in a base directory. Overlays reference the base and patch it. The base is complete and usable on its own; overlays modify it.

**C #include**: Shared declarations live in header files. Source files include headers. The preprocessor does textual insertion. Simple but no awareness of what's being included.

### Recommended Approach: File-Level Sharing with Manifest References

Shared elements in Renkei should be **whole files** referenced from the manifest, not inline fragments referenced from within content files.

**Why whole files, not fragments?**

1. **Authoring simplicity.** A shared tenet is a complete thought. "Silence is failure" has its derivation, its explanation, and its implications. Splitting it into a fragment that gets inlined into another document makes it harder to author and review.

2. **Readability.** When reading an archetype's assembled output, a shared tenet should read as a coherent section, not as a stitched-in fragment. Whole-file inclusion preserves the authored flow.

3. **The derivation chain.** Each tenet traces to known goods. If the tenet is a fragment embedded in another document, the derivation is invisible. If it's a standalone file, the derivation can be documented in that file.

4. **Avoids DITA's complexity.** DITA's conref mechanism is powerful but complex -- it requires element IDs, XPath-style addressing, and careful management of conref targets. Whole-file inclusion is the simplest mechanism that satisfies the requirement.

**The _shared/ convention:**

```
archetypes/
  development-pipeline/
    _shared/
      tenets/
        silence-is-failure.md    # Full tenet with derivation
        truth-over-completion.md
      principles/
        source-documents-ground-truth.md
      rules/
        never-assume.md
    test-writer/
      archetype.yaml  # References _shared/tenets/silence-is-failure.md
      ...
    test-writer-clone/
      archetype.yaml  # Also references _shared/tenets/silence-is-failure.md
      ...
```

When the assembler encounters a `shared:` reference, it reads the file from `_shared/` and includes it in the output at that position. The same shared file can be referenced by multiple archetypes. Changes to the shared file propagate to all archetypes that reference it on next assembly.

### Cross-Grouping Sharing

If a tenet needs to be shared across groupings (e.g., "silence is failure" is universal), there are two options:

1. **Elevate to a global shared directory.** `archetypes/_global/tenets/silence-is-failure.md`. Referenced as `global: _global/tenets/silence-is-failure.md` in the manifest.

2. **Duplicate with a canonical reference.** Each grouping has its own copy, with a comment noting the canonical source. This is less DRY but more self-contained.

Option 1 is cleaner but creates a dependency across groupings. Option 2 is more resilient but risks drift. **Recommendation: start with option 1 (global shared directory) and fall back to option 2 only if cross-grouping dependencies prove problematic.**

## Part 5: Verbatim Propagation and Assembly

Verbatim propagation is the mechanism by which an orchestrator passes its ethos to sub-agents (ETHOS.md: "the text is forwarded exactly, not paraphrased"). This has specific implications for assembly.

### The Problem

When an orchestrator delegates to a sub-agent, the delegation message includes the orchestrator's ethos verbatim. In a flat SKILL.md, this means the ethos text appears twice: once in the orchestrator's own definition, and once in the delegation block. If the ethos changes, both locations must be updated -- exactly the maintenance problem decomposition is meant to solve.

### How Assembly Solves It

With decomposed elements, the orchestrator's `doctrine/orchestration.md` can reference the ethos elements by name rather than by copying them:

```yaml
# In archetype.yaml for the orchestrator
verbatim_propagation:
  - ethos/identity.md
  - ethos/tenets.md
  - ethos/principles.md
```

The assembler, when generating the orchestration/delegation section of the output, reads these references and inserts the ethos content verbatim into the delegation block. The ethos content exists in one place (the element files); it appears in two places in the output (the archetype's own ethos section and the delegation block). Changes to the ethos automatically propagate to both locations.

This is analogous to:
- **C #include**: The header exists once; it appears in every compilation unit that includes it.
- **DITA conref**: The source element exists once; it appears everywhere it's referenced.
- **Literate programming chunks**: The named chunk is defined once; TANGLE expands it everywhere it's referenced.

The key insight from literate programming is that TANGLE performs **pure textual concatenation** -- no transformation, no paraphrasing, no interpretation. The chunk text is copied verbatim. This is exactly the semantics required for verbatim propagation: the ethos text must be forwarded exactly, character for character, to sub-agents.

### The Assembly Contract for Verbatim

The assembler must guarantee: **the text included via verbatim_propagation is byte-identical to the text in the source element file.** No formatting changes, no whitespace normalization, no markdown processing. This is the "immutable transmission" requirement from ETHOS.md applied to the assembly mechanism.

This is a stronger guarantee than most assembly systems provide. DITA conref resolves elements and may apply styling. Helm templates process Go template syntax. Kustomize patches modify content. The Renkei assembler, for verbatim blocks specifically, must do none of these things. It is a copy, not a transformation.

## Part 6: Assembly Analogies and the Right Metaphor

### What the Assembly Is Not

- **Not compilation.** Compilation transforms source into a fundamentally different representation (C to machine code). Renkei assembly produces markdown from markdown. The representation is the same.
- **Not linking.** Linking resolves symbolic references between compiled units. Renkei has no symbolic references to resolve -- shared elements are resolved by path, not by symbol.
- **Not rendering.** Rendering transforms structured content into presentational output (markdown to HTML). The host adapter does some of this, but the core assembly step does not.

### What the Assembly Is

The closest analogy is **liturgical book compilation**: assembling proper (unique) and common (shared) elements according to a rubrical calendar (manifest) into a complete missal (output artifact). The elements are authored independently. The calendar controls which elements combine and in what order. The output is a complete, usable text.

The second closest analogy is **DITA map-driven topic composition**: a map (manifest) references topics (element files), specifies their order and hierarchy, and the processor composes them into a publication. The topics don't know about the map; the map doesn't modify the topics; the processor joins them.

The third closest analogy is **Knuth's TANGLE**: named chunks (element files) are defined independently. A root chunk (manifest) references them. TANGLE expands references by pure textual concatenation in the declared order.

**The recommended metaphor for Renkei documentation and communication: "assembly" or "composition."** Not compilation, not building, not rendering. The act is composing independent elements into a coherent whole, guided by a manifest, without transforming the elements themselves.

## Part 7: Relation to Existing Skills

The ~16 existing skills and ~14 sub-agents are currently flat SKILL.md files. The framework must be able to **decompose** these into elements and **reassemble** them into equivalent output.

### Decomposition Strategy

Decomposition is the inverse of assembly. Given a flat SKILL.md, identify which sections correspond to which archetype elements:

| SKILL.md Section | Archetype Element |
|-----------------|-------------------|
| Identity / "You are..." / "You are not..." | ethos/identity.md |
| Tenets / Beliefs / Values | ethos/tenets.md |
| Principles / "How you work" | ethos/principles.md |
| Rules / NEVER / ALWAYS | ethos/rules.md |
| Process / Steps / Workflow | doctrine/process.md |
| Delegation / Clone types / Perspectives | doctrine/orchestration.md |
| Pipeline / Inputs / Outputs / Position | doctrine/pipeline.md |
| Output / Artifacts / Completion | doctrine/output-contract.md |

This decomposition can be partially automated (regex for NEVER/ALWAYS rules, section heading matching) but will require human judgment for the Ethos/Doctrine boundary in cases where the original SKILL.md interleaves them.

### Round-Trip Fidelity

The acid test: `decompose(skill.md) |> assemble() == skill.md`. Perfect round-trip fidelity is unlikely because decomposition imposes structure that the original may not have had. The practical goal is **semantic equivalence**: the assembled output should produce the same agent behavior as the original, even if the text differs in formatting or ordering.

## Summary of Recommendations

| Decision | Recommendation | Grounding |
|----------|---------------|-----------|
| Directory depth | 2 levels below archetype root (ethos/element.md, doctrine/element.md) | DERIVATION.md derivation boundary; Ansible convention depth |
| Manifest | archetype.yaml per archetype, explicit element ordering | DITA maps, Kustomize kustomization.yaml, Helm Chart.yaml |
| Assembly mechanism | Include/compose (read files in manifest order, join) | DITA topic composition, literate programming TANGLE |
| Host adaptation | Separate phase after composition | Separation of content from presentation (universal pattern) |
| Shared elements | _shared/ directory at grouping level, whole-file inclusion | Liturgical proper/common pattern, DITA conref at topic level |
| Verbatim propagation | Manifest declares verbatim refs; assembler copies byte-identical | TANGLE's pure textual concatenation; ETHOS.md immutability requirement |
| Content files | Pure markdown, no frontmatter, no metadata | Separation of content from manifest (DITA, Kustomize, DocBook) |
| Element granularity | One file per element (tenets.md, not one file per tenet) | DERIVATION.md's boundary on over-derivation; authoring unit coherence |

## Sources

### Systems Studied
- **Military doctrine**: Joint Publication system (jcs.mil/doctrine/), Army Doctrine Primer ADP 1-01 (irp.fas.org/doddir/army/adp1_01.pdf), TRADOC Regulation 25-30 (adminpubs.tradoc.army.mil/regulations/TR25-30.pdf)
- **DITA**: OASIS DITA specification (oasis-open.org/committees/dita/), conref mechanism (dita-lang.org/dita/archspec/base/conref), scoped keys (madcapsoftware.com/articles/scoped-keys-in-dita-1-3/)
- **DocBook**: Modular DocBook with XInclude (sagehill.net/docbookxsl/ModularDoc.html)
- **Ansible roles**: Ansible documentation (docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_reuse_roles.html), Red Hat overview (redhat.com/en/topics/automation/what-is-an-ansible-role)
- **Helm**: Chart structure (helm.sh/docs/topics/charts/), template guide (helm.sh/docs/chart_template_guide/), named templates (helm.sh/docs/chart_template_guide/named_templates)
- **Kustomize**: Kubernetes documentation (kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)
- **Literate programming**: Knuth's original paper (cs.tufts.edu/~nr/cs257/archive/literate-programming/01-knuth-lp.pdf), CWEB manual (literateprogramming.com/cwebx.pdf)
- **Liturgical books**: Columbia University liturgical year manuscript project (ccnmtl.columbia.edu/services/manuscripts/lit_year_as_org.html), Antiphonary (Wikipedia), USCCB liturgical year (usccb.org/prayer-worship/liturgical-year)
- **Legal codification**: Congressional Research Service R45190 (congress.gov/crs-product/R45190), US Code detailed guide (uscode.house.gov/detailed_guide.xhtml), positive law codification (uscode.house.gov/codification/legislation.shtml)
- **Static site generators**: Eleventy (11ty.dev), Jekyll layouts (jekyllrb.com/docs/layouts/), Hugo partials (discourse.gohugo.io)
- **Make**: GNU Make documentation (web.mit.edu/gnu/doc/html/make_10.html), Oracle make reference (docs.oracle.com/cd/E19504-01/802-5880)

### Project Documents Referenced
- vision.md -- Renkei vision and core concepts
- DERIVATION.md -- Derivation method and known goods
- docs/things/agent-archetype/README.md -- Archetype decomposition
- docs/things/agent-archetype/ETHOS.md -- Ethos domain, verbatim propagation
- docs/things/agent-archetype/DOCTRINE.md -- Doctrine domain
- docs/personal-notes/chaos-to-order.md -- Truth-seeking pipeline thesis
