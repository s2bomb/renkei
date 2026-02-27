# System Usability Review -- Decompose System

**Reviewer perspective**: System Usability -- would someone (human or agent) actually be able to follow this process and produce good results?

**Artifact reviewed**: `lib/decompose/AGENTS.md` (process definition) + `lib/decompose/workbench/implement-plan/` (test run artifacts) + `archetypes/development/implement-plan/` (produced archetype)

**Date**: 2026-02-17

**Overall rating**: **Needs work**

The system produced a good archetype on its first test run. The implement-plan decomposition is well-reasoned, the workbench artifacts tell a clear story, and the produced archetype is structurally richer than the original. But the system succeeded partly because the person doing it already understood Renkei deeply. A cold agent -- or even a warm human doing their second decomposition -- would hit several gaps that the current document does not address.

---

## Question-by-Question Assessment

### 1. Could an agent follow this process cold?

Partially. The five phases are clear in structure (input/action/output/verification), the tag vocabulary is concrete, and the workbench convention is simple. An agent could execute Phases 1, 3, and 5 with reasonable confidence.

**Phase 2 would likely fail.** The instruction "look for mathematical properties, epistemological principles, empirical patterns" is genre guidance, not a method. An agent that hasn't internalized AUTHORING.md would not know that "Code is read more than it is written (Martin, 2008)" qualifies as a known good while "clean code is good" does not. The distinction between a citable domain fact and a conventional opinion is the hardest judgment in the system, and AGENTS.md describes it with one bullet point.

**What's missing**:

- **The source file.** Phase 1 says "Read the source agent definition" but never says where to find it. The audit references `~/.claude/skills/implement-plan/SKILL.md` -- a path on the author's local machine. A cold agent needs to know: Where are skill files? What if the skill file is deployed already (read from deploy target) vs. still in assembly (assemble with `--dry-run` to get the current output)? The system assumes the operator knows how to obtain the source. It should state: "The source is the currently deployed skill file at the path in `archetype.yaml` -> `output[].path`, or for a fresh decomposition, the existing SKILL.md in the harness's skill directory."
- **AUTHORING.md is not referenced.** AGENTS.md references `docs/things/agent-archetype/ETHOS.md` for the ethos/doctrine test, but never mentions `docs/framework/AUTHORING.md` -- the document that explains *why* the derivation chain works, what counts as a known good, and the derivation boundary. An agent doing Phase 2 without having read AUTHORING.md is navigating without a map.
- **Existing archetypes are not referenced as examples.** The guidance says "the test-designer has 3 known goods" and names them, but doesn't tell the agent to *go read the test-designer archetype* as a model. A cold agent doesn't know where to find it or what to look for. The system should explicitly say: "Before starting Phase 2, read 1-2 existing archetypes (e.g., `archetypes/development/test-designer/` and `archetypes/development/test-implementer/`) to calibrate your sense of known good density, tenet voice, and article structure."
- **No mention of `_shared/`.** The tagging principles and restructure phase don't mention shared articles. Phase 4 mentions shared conviction candidates but doesn't explain the `_shared/` mechanism. An agent wouldn't know what `_shared/` is, where it lives, or how to use it.
- **No manifest guidance.** Phase 3 says "Write the `archetype.yaml` manifest" but gives no structural guidance. The existing manifests are simple YAML, but an agent wouldn't know the schema -- what keys are required, what `output` looks like, whether `references` is a valid key. A minimal schema or "use an existing manifest as a template" instruction is needed.

### 2. Phase 1 (Audit) clarity

The tag vocabulary is mostly complete. Tagging principles are sufficient for the major ambiguities (tenet vs. principle, ethos vs. doctrine, rule handling). Two issues:

**Missing tag: `METADATA`.** The audit uses a `METADATA` tag (line 17 of 01-audit.md: "Tag: **METADATA** (manifest fields)") that doesn't exist in the tag vocabulary table. This is exactly the kind of content every skill file has (frontmatter: name, description, model) and every audit will encounter. Add it.

**Missing guidance: multi-tag density.** The tagging principles say "A single sentence can carry multiple tags. Note all of them." The audit demonstrates this well -- lines like 11 get 3 tags. But it doesn't give guidance on *recording format*. The audit uses narrative paragraphs with inline bold tags, organized by line ranges. This format works but is inconsistent -- some entries are per-line, some are per-section. A cold agent would benefit from a concrete format example in AGENTS.md showing what a tagged entry looks like. Even one example entry would anchor the format.

**Ambiguity not covered: TENET vs. IDENTITY.** The audit tags "you propagate the problem upward" as both ETHOS:TENET and ETHOS:IDENTITY. The document explains tenet-vs-principle and ethos-vs-doctrine, but not tenet-vs-identity. The principle here: identity declares *what the agent is/isn't*, while a tenet declares *what the agent believes*. "I propagate problems upward" is identity (what I do). "Unreviewed changes bypass verification" is the tenet (what I believe that makes me propagate). The distinction matters because identity is stable across ensemble position changes; tenets are stable across workflow changes. A sentence in the tagging principles would prevent conflation.

### 3. Phase 2 (Derive) guidance

This is the system's weakest phase from a usability standpoint. The workbench artifact (02-derive.md) is excellent -- the Beck/Fowler/Martin citations are well-chosen, the therefore-chains are tight, the coverage check is rigorous. But the process document doesn't explain how to get there.

**What would make it more actionable:**

1. **A method, not a hint.** Replace "Look for mathematical properties, epistemological principles, empirical patterns" with an actual procedure. Something like:
   - For each conviction cluster, ask: "Why does the agent believe this? What domain fact makes this conviction true rather than arbitrary?"
   - The answer is often a named result (Beck's TDD, Fowler's CI, Martin's read-write ratio). Search for the *person and work* that established the fact.
   - If you can't name a source: either the conviction is a restatement of something more fundamental (dig to the root), or it's a preference masquerading as a truth (flag it for review).

2. **A worked heuristic for "is this a real known good?"** The test: a known good is true regardless of whether this agent exists. Beck's TDD is true whether or not the implement-plan agent is defined. "DX is important" is an opinion; "code is read 10:1 over being written" is a fact. The known good exists in the domain, not in the agent. This distinction is in AUTHORING.md but not in AGENTS.md.

3. **Handling the "conviction cluster" step.** The audit produces 7 individual convictions. The derive phase groups them into 4 clusters. That grouping is non-obvious -- convictions 1 and 7 clustered together, convictions 3, 4, and 6 clustered together. The system should acknowledge this intermediate step: "Before searching for truths, group convictions that seem to share a common root. Convictions that cluster naturally often derive from the same known good."

4. **What to do when you're stuck.** The guidance says "If a conviction resists grounding, that's a signal." Signal of what? Two possibilities: the conviction is arbitrary, or there's an undiscovered truth. The system doesn't help you distinguish. A practical test: "Can you state the conviction's negation and find reasonable people/traditions that hold it? If so, it's a value judgment (legitimate tenet) but you still need a grounding truth that explains why *this agent* holds it."

### 4. Phase 3 (Restructure) losslessness check

The mapping table approach works. The implement-plan 03-restructure.md is clear -- every source section maps to an archetype location, dropped content is justified, deduplication is recorded. Two concerns:

**Granularity inconsistency.** Some rows map a single line, others map a 30-line range (e.g., "Lines 16-19" -> orchestration). A cold agent might wonder what granularity to use. The principle should be: map at the granularity that lets you verify no behavioral element was missed. Process steps can often be mapped as a block. Convictions should be mapped individually because they might split across ethos articles.

**"Dropped with justification" needs a threshold.** The system says "Environmental content that was dropped should be explicitly noted as dropped-with-reason, not silently lost." The implement-plan audit does this well. But it's not clear *what justification is sufficient*. The audit drops the example workflow (45 lines) with "illustrative, not constitutional." That's a judgment call. A conservative agent might keep it; an aggressive one might drop more. The system should state the test: "If removing this content would cause the agent to make different judgments or follow different processes, it is constitutional and must be preserved. If not, it can be dropped with justification."

**Transformation tracking.** The table has a "Status" column with values: Preserved, Transformed, Absorbed, Deduplicated, DROPPED. This taxonomy is useful but undocumented in AGENTS.md. If this is the expected status vocabulary, codify it.

### 5. Phase 4 (Enrich) gap checklist completeness

The six-item checklist catches the most common gaps. Three gaps it could miss:

1. **Verbatim block content.** The checklist doesn't mention verifying that the verbatim propagation block contains the right convictions. In the implement-plan case, the verbatim block was cleaned from 38 lines (mixed) to 3 paragraphs (convictions only). That's a significant change that could alter clone behavior. A checklist item: "Verbatim block audit -- does the verbatim propagation block contain exactly the convictions clones need, nothing more?"

2. **Tenet ordering.** The checklist doesn't address tenet priority. In the test-designer, tenets are ordered by importance (the framework implies this via the AUTHORING.md priority discussion). In the implement-plan, the tenet ordering implies priority: "tests are truth standard" first, then "propagate don't patch," then "DX," then "validated checkpoints." Is this intentional? Tenet ordering shapes runtime behavior when tenets conflict. A checklist item: "Are tenets ordered by priority? Would swapping the order change behavior under tension?"

3. **Doctrine-to-ethos traceability in the *other* direction.** The checklist checks truth->tenet and tenet->truth. It also says "every doctrine step traces to an ethos article." But the quality test in Phase 4 only checks four doctrine steps. A systematic check -- *every* doctrine step mapped to its grounding ethos article -- would be more rigorous. The implement-plan process.md has ~30 concrete steps. Did each one get traced? The workbench doesn't show this.

### 6. Phase 5 (Verify) behavioral equivalence

The fundamental problem: you cannot actually assess behavioral equivalence without running both versions. The system acknowledges this implicitly by defining equivalence as "an agent running the assembled SKILL.md would make the same judgments and follow the same processes." But it provides no method for testing this claim.

**What the current approach does well:** The behavioral equivalence table in 05-verify.md (14 rows, each mapping an original behavior to archetype preservation) is the best available proxy. It's a checklist-based assessment: "did we account for this behavior?" That's honest and practical.

**What it can't catch:**

- **Emergent behavioral differences from structural changes.** Deduplicating "propagate don't patch" from 4 repetitions to 1 statement changes emphasis. The original's repetition hammered the point -- an LLM seeing the same directive 4 times weights it differently than seeing it once. The archetype compensates with truthful grounding, but whether that compensation is *equivalent* is an empirical question the verify phase can't answer.
- **Dropped environmental content effects.** The 6 tool references were dropped as "environmental." But an agent that knows "use Logfire MCP for logs" behaves differently from one that doesn't -- it's more likely to check logs. The behavior was dropped, not preserved. The system claims "no constitutional content was dropped," but the distinction between constitutional and operational is fuzzier than the system admits.

**Recommendation**: Add a "smoke test" protocol to Phase 5. After assembly, give the assembled SKILL.md to an agent with a representative prompt (e.g., "Implement phase 3 of this plan") and compare the agent's behavior to what you'd expect from the original. This doesn't need to be automated -- even a thought experiment ("would the agent do X?") structured around 3-5 representative scenarios would add rigor.

### 7. Workbench convention

The convention (one directory, five numbered files) is clean and sufficient for a single-pass decomposition. Two issues:

**No revision tracking.** If Phase 4 reveals a gap that requires revisiting Phase 2 (e.g., an ungrounded conviction that needs a new truth), the system has no mechanism for recording that. Does the agent update 02-derive.md in place? Create a 02-derive-v2.md? Add a note to 04-enrich.md saying "Phase 2 was revised"? The workbench should have a convention for revisions. Simplest: edit in place and note the revision at the top of the file with date and reason.

**No cross-session continuity.** The system says "one agent at a time" but doesn't address session boundaries. If a decomposition spans two Claude sessions (which is likely for complex agents), the second session needs to pick up where the first left off. The workbench files serve this purpose implicitly -- they're the state -- but there's no explicit "resume" protocol. Even a one-liner would help: "To resume a decomposition, read all existing workbench files and the produced archetype (if any), then continue from the next incomplete phase."

### 8. System evolution

"Update after each decomposition" is the right instinct but insufficient mechanism.

**What's missing:**

- **Where observations go.** The system says "record what worked and what didn't in the workbench verification report." That's what 05-verify.md's "System Observations" section does. But observations in individual workbench files are buried -- they won't be found when the next decomposition starts. There should be a persistent record. Options: a `lib/decompose/CHANGELOG.md` that accumulates observations across decompositions, or (staying within existing conventions) reference `thoughts/observations/` as the home for decompose-system observations.
- **The feedback loop is one-directional.** Observations flow from workbench -> AGENTS.md updates. But there's no mechanism for validating that the update actually helped. After 3 decompositions, you'd have a better AGENTS.md, but no record of *which* improvements came from *which* observations. The observation/disposition lifecycle in `thoughts/observations/` (open -> validated/dismissed) would serve this purpose if adopted.

### 9. Biggest gap

**Phase 2 has no method.**

The system tells you *what* to produce (known goods with citations and therefore-chains) and *what it should look like* (2-3 truths, 1-2 therefore links). But it does not tell you *how to find the truths*. It says "look for mathematical properties, epistemological principles, empirical patterns" -- that's like telling someone to "look for ingredients" when what they need is a recipe.

The implement-plan decomposition found Beck, Fowler, and Martin because the author already knew those references. An agent decomposing the spec-writer skill would need to identify the domain truths of requirements engineering. An agent decomposing the research-codebase skill would need to identify the domain truths of documentation and observation. These are genuinely hard cognitive tasks that the current system treats as obvious.

The consequence: the next decomposition will either (a) produce weak truths (conventional wisdom dressed up as known goods), (b) stall at Phase 2 while the agent searches without a method, or (c) succeed only if the agent happens to have strong domain knowledge. Option (c) is what happened with implement-plan. It won't generalize.

**What would fix it:**

1. Add a concrete method to Phase 2 (see Q3 recommendations above).
2. Reference AUTHORING.md explicitly as required reading before starting Phase 2.
3. Add the "negation test" for candidate truths: if negating the candidate produces an absurd or empirically false statement, it's likely a genuine known good. If negating it produces a legitimate alternative viewpoint, it's a preference, not a truth.
4. Add a "known good smell test" to the verification: the known good must be true regardless of whether this particular agent exists, citable to a named source, and inarguable within the domain.

---

## Top 3 Recommendations

1. **Add a concrete method to Phase 2.** The current guidance ("look for mathematical properties...") is genre description, not procedure. Add: (a) a conviction clustering step, (b) the "why does the agent believe this?" recursive question, (c) the negation test for candidate truths, (d) explicit reference to AUTHORING.md, and (e) instruction to read 1-2 existing archetypes as calibration before starting.

2. **Add a prerequisites section to AGENTS.md.** Before Phase 1, list what the operator must read and have available: the source skill file (with instructions on how to obtain it), AUTHORING.md, VOCABULARY.md, 1-2 reference archetypes, and the `_shared/` directory if it exists. The system currently assumes the operator has this context. Making it explicit is the difference between "works for the author" and "works for anyone."

3. **Add the `METADATA` tag and a format example to Phase 1.** The audit format is underdocumented -- the tag vocabulary table is missing `METADATA`, the status vocabulary (Preserved/Transformed/Absorbed/Deduplicated/DROPPED) is used but not defined, and there's no example of what a tagged entry looks like. One concrete example entry in AGENTS.md would anchor the format for every future decomposition.
