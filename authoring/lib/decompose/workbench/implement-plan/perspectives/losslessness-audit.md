# Losslessness Audit -- implement-plan Decomposition

**Perspective**: Losslessness Auditor
**Date**: 2026-02-17
**Source**: `~/.claude/skills/implement-plan/SKILL.md` (257 lines)
**Archetype**: `archetypes/development/implement-plan/`

## Verdict

The decomposition preserves approximately 90% of behavioral content faithfully, but suffers from several losses -- two moderate, the rest minor -- primarily in the verbatim block, where specific operational guidance was dropped as "environmental" when parts of it were actually behavioral directives that clones would no longer receive.

---

## Finding Index

| # | Finding | Severity | Acceptable? |
|---|---|---|---|
| 1 | Verbatim block: "instrument proactively, not after failures" lost | **Moderate** | No -- remediate |
| 2 | Verbatim block: "Complexity should be hidden behind simple interfaces" lost | **Minor** | Marginal -- consider |
| 3 | Verbatim block: validation methods (tmp scripts, Logfire spans) dropped | **Moderate** | No -- partially remediate |
| 4 | "Ultrathink" dropped -- behavior partially preserved, intensity lost | **Minor** | Acceptable |
| 5 | "Run them frequently" lost from verbatim to clones | **Minor** | Acceptable |
| 6 | Example workflow dropped -- no behavioral loss | **Minor** | Acceptable |
| 7 | Deduplication of "propagate upward" lost contextual specificity | **Minor** | Acceptable with caveat |
| 8 | "Use git with a detailed message for documentation" lost | **Minor** | Acceptable (covered by commit convention) |
| 9 | Research method ("create a detailed research task in thoughts/research/") dropped | **Minor** | Marginal |
| 10 | TodoWrite reference dropped as environmental | **Minor** | Acceptable |
| 11 | Tone: "We" voice shifted to "You" voice | **Minor** | Acceptable |
| 12 | "Observability is first-class" downgraded in archetype | **Minor** | Marginal -- consider |
| 13 | Pause-then-ask pattern for human validation partially weakened | **Minor** | Acceptable |

---

## Detailed Findings

### Finding 1: "Instrument proactively, not after failures" lost

**Source**: Line 29 -- "Observability is first-class -- instrument proactively, not after failures."

**Archetype**: ethos/tenets.md line 20 says "Observable behavior -- silent errors are unacceptable; every failure must be captured and visible." The verbatim block in orchestration.md line 56 says "Silent errors are unacceptable -- every failure must be captured and visible."

**What was lost**: The phrase "instrument proactively, not after failures" is a distinct behavioral instruction beyond "silent errors are unacceptable." The original said two things: (1) don't swallow errors, AND (2) add observability instrumentation during initial implementation, don't wait for something to break first. The archetype preserves (1) but drops (2).

This matters because the clone -- the agent that actually writes code -- no longer receives the directive to proactively add instrumentation. The clone gets "silent errors are unacceptable" which is a reactive framing (catch errors), not a proactive one (instrument from the start).

**Severity**: Moderate. This is a behavioral directive that changes what code a clone actually writes.

**Assessment**: Not acceptable as-is. The proactive instrumentation directive should be restored to the DX tenet and to the verbatim block. It can be stated without naming Logfire -- "instrument proactively" is a behavior, "use Logfire" is environmental.

---

### Finding 2: "Complexity should be hidden behind simple interfaces" lost

**Source**: Line 30 -- "Complexity should be hidden behind simple interfaces."

**Archetype**: Not present in tenets.md or in the verbatim block. The tenet list includes: clean code, intuitive APIs, composable/procedural, DRY, API surface over implementation, observable behavior. "Hidden complexity" is arguably subsumed by "intuitive APIs" and "API surface over implementation," but it's a distinct statement. "Intuitive API" means the consumer can understand the interface. "Hidden complexity" means the implementation behind the interface can be complex as long as the interface stays simple. These are related but not identical.

**Severity**: Minor. This is subsumable under existing tenets, though adding it would cost nothing.

**Assessment**: Marginal. The original listed it as a separate bullet. The archetype's coverage is close but not exact. A one-phrase addition to the DX tenet ("complexity hidden behind simple interfaces") would close the gap.

---

### Finding 3: Validation methods dropped as environmental

**Source**: Lines 46-49:
- "Add Logfire spans that prove the code path executes with expected data"
- "Write a tmp validation script if existing tests don't cover a specific concern"
- "Use Playwright for browser-based validation if relevant"

**Archetype**: All three dropped. The 03-restructure.md justification is: "harness-environment features, not constitutional character."

**What was lost**: The tool names (Logfire, Playwright) are environmental. But the underlying *strategies* are behavioral:
1. **Add observability spans to prove code paths execute with expected data** -- this is a validation technique, not just a tool reference.
2. **Write a temporary validation script when tests don't cover a specific concern** -- this is a methodology.
3. **Use browser-based validation when relevant** -- this is a class of validation, not just a tool.

The archetype's process.md Step 3 says "Verify success criteria (tests pass, linting, type checking, build)" but has no mention of supplementary validation when existing tests are insufficient. The original explicitly anticipated the case where tests don't fully cover a concern and gave the clone three strategies for dealing with it.

**Severity**: Moderate. The clone now has no guidance for what to do when tests pass but there's reason to believe more validation is needed. The original anticipated this gap and filled it.

**Assessment**: Not fully acceptable. The tool names should stay dropped. But the three validation strategies should be preserved as doctrine guidance, either in process.md Step 3 or in the verbatim block. Suggested framing: "For additional validation beyond existing tests: add instrumentation that proves the code path executes with expected data, write a temporary validation script, or use browser-based validation if the feature has a UI."

---

### Finding 4: "Ultrathink" dropped

**Source**: Line 40 -- "Ultrathink the smallest testable steps you will validate and increments of the goal and make a plan."

**Archetype**: The 03-restructure.md says this was "transformed into the process structure itself" and the harness-specific prompt technique was dropped.

**Analysis**: "Ultrathink" is a Claude-specific prompt keyword that triggers extended reasoning. It is genuinely environmental -- it's a harness capability, not a behavior. The underlying behavior ("think carefully about the smallest testable steps") is preserved in process.md Step 1 ("Think deeply about how the pieces fit together") and Step 5 ("Stop and think deeply about why the plan can't be followed").

However, the *intensity* of the original instruction is notable. "Ultrathink" is not just "think" -- it's "use your deepest reasoning mode." The archetype says "think deeply" which is softer. Whether this matters depends on whether the assembler or host-adaptation layer can re-inject harness-specific prompt intensity keywords.

**Severity**: Minor. The behavior is preserved; the intensity mechanism is harness-specific.

**Assessment**: Acceptable. The host-adaptation layer is the correct place to re-inject "ultrathink" if needed.

---

### Finding 5: "Run them frequently" lost from clone guidance

**Source**: Line 44 -- "Run them frequently."

**Archetype**: Not present in the verbatim block (orchestration.md lines 54-58). The tenet in tenets.md says "When all tests pass, the implementation is correct" but doesn't say to run tests frequently during implementation. Process.md Step 3 says to run tests after a phase is complete, but the original's instruction was to run them *during* implementation, not just at the end of a phase.

**Severity**: Minor. The per-phase verification effectively enforces this for the orchestrator, but the clone -- which does the actual coding -- doesn't receive the "run frequently" directive.

**Assessment**: Acceptable. The phase-level verification effectively bounds the blast radius. But if clones implement large phases, the "run frequently within a phase" guidance would be useful. Consider adding to the verbatim block.

---

### Finding 6: Example workflow dropped

**Source**: Lines 211-256. A complete worked example showing orchestrator-clone interaction across multiple phases with parallel delegation.

**Archetype**: Not present.

**Analysis**: The example is illustrative. Every behavior it demonstrates is specified by the process and orchestration articles. The example adds nothing that the articles don't already contain -- it shows a Phase 1 serial delegation, verification with template, human pause, then Phase 2+3 parallel delegation. All of these are explicitly specified in the doctrine.

**Severity**: Minor. No behavioral content is lost.

**Assessment**: Acceptable. The example is reference material, not constitutional. The restructure note correctly suggests it could live in `references/` if needed.

---

### Finding 7: Deduplication of "propagate upward" lost contextual specificity

**Source**: "Propagate upward" appears in 4 contexts:
1. Line 11: General -- "When you encounter problems with tests or design... you propagate the problem upward."
2. Line 44: Within verbatim to clones -- "If a test seems wrong or untestable, stop and propagate the issue upward to the architect."
3. Line 108: In verification -- "If a test seems wrong, stop and propagate to the architect."
4. Line 145: In stuck-clone protocol -- "If the issue is with tests or design -- do not fix it. Propagate to the architect with specifics: which test, which design assumption, what doesn't fit."

**Archetype**: tenets.md states it once. doctrine/process.md Step 3 line 37 restates it ("If a test seems wrong, stop and propagate to the architect"). doctrine/process.md Step 5 line 83 restates it ("If the issue is with tests or design -- propagate to the architect"). orchestration.md line 46 restates it ("If the issue is with tests or design -- propagate to the architect. Do not fix it."). Verbatim block line 54 says "If a test seems wrong or untestable, stop and report the issue."

**Analysis**: This is actually well-handled. The tenet states the conviction once, and the doctrine articles reference it in their operational contexts. Each context *does* retain its specific framing. The one nuance that's slightly softened: occurrence #4 in the original (line 145) gives the most specific guidance -- "propagate with specifics: which test, which design assumption, what doesn't fit." The archetype's orchestration.md line 46 drops the "with specifics" qualifier. But process.md Step 5 line 83 retains it ("with specifics: which test, which design assumption, what doesn't fit").

**Severity**: Minor. The specificity guidance is preserved in doctrine but in a different location than the original's "when clones get stuck" section. The orchestration.md "When Clones Get Stuck" section drops the "with specifics" detail.

**Assessment**: Acceptable. The specificity is preserved in process.md Step 5, which is where the orchestrator would consult it.

---

### Finding 8: "Use git with a detailed message for documentation to track and save tested and validated progress"

**Source**: Line 40.

**Archetype**: The specific phrase is gone. The behavior is covered by output-contract.md (commit message from plan's `**Commit**:` field) and process.md Step 3 (commit before moving to next phase). The original's framing of git as "documentation" is lost -- the archetype treats git commits as a verification checkpoint, not as documentation.

**Severity**: Minor. The commit behavior is fully preserved. The "documentation" framing is an emphasis, not a distinct behavior.

**Assessment**: Acceptable.

---

### Finding 9: Research method dropped

**Source**: Line 59 -- "For deep research, create a detailed research task in thoughts/research/ and let perplexity work on needed research outcomes. Share the file location with the user."

**Archetype**: Not present. Dropped as environmental.

**Analysis**: "Let perplexity work" is environmental (names a tool). But "create a detailed research task in thoughts/research/" is a process -- it specifies a file location and a method. "Share the file location with the user" is a communication protocol.

The archetype's process.md Step 5 says "Use research sub-agents for targeted debugging or exploring unfamiliar territory" (line 87), which preserves the behavior of using research assistance. But the specific method (create a file in thoughts/research/, share location) is lost.

**Severity**: Minor. The research behavior is preserved abstractly. The specific file convention is project-specific, not constitutional.

**Assessment**: Marginal. The `thoughts/research/` convention is arguably project structure, not agent character. But "share the file location with the user" is a communication behavior. The archetype doesn't instruct the agent to communicate research decisions to the user.

---

### Finding 10: TodoWrite reference dropped

**Source**: Line 205 -- "Use TodoWrite to track your current session's progress."

**Archetype**: process.md line 95 says "Use TodoWrite to track current session progress." Actually, this IS preserved.

**Severity**: N/A. Not actually lost.

**Assessment**: Acceptable. Preserved in process.md Step 6.

---

### Finding 11: "We" voice shifted to "You" voice

**Source**: Lines 40-42 use "We" voice -- "We are test driven developers", "We NEVER assume anything", "We also validate our work."

**Archetype**: The verbatim block in orchestration.md line 58 preserves the "We" voice: "We NEVER assume anything." But the tenets use "You" voice. The identity uses "You" voice.

**Analysis**: The original's "We" voice in the verbatim block created a sense of shared identity between the orchestrator and its clones -- "we are on the same team, these are our shared values." The archetype's verbatim block preserves one instance of "We" but the tenets shift to "You."

**Severity**: Minor. The verbatim block (which goes to clones) preserves the "We" voice where it matters most. The tenets speaking to the orchestrator in "You" voice is appropriate.

**Assessment**: Acceptable. The tone shift in tenets is appropriate for the archetype's direct-address style. The verbatim block's "We" is preserved.

---

### Finding 12: "Observability is first-class" downgraded

**Source**: Line 29 -- "Observability is first-class -- instrument proactively, not after failures. Silent errors are unacceptable; every failure must be captured and visible in Logfire (or logs, if Logfire isn't available)."

**Archetype**: tenets.md line 20 -- "Observable behavior -- silent errors are unacceptable; every failure must be captured and visible."

**Analysis**: The original makes three claims: (1) observability is first-class (status claim), (2) instrument proactively (behavioral directive), (3) silent errors are unacceptable (negative constraint). The archetype preserves (3) and partially preserves (1) but drops (2) entirely (see Finding 1). Additionally, the original's parenthetical "(or logs, if Logfire isn't available)" showed graceful degradation -- use what's available. This is lost, but that's fine since Logfire is environmental.

The word "first-class" from the original carried weight. Saying "observability is first-class" is stronger than "observable behavior." The former is a design-time commitment; the latter is a runtime expectation.

**Severity**: Minor (the more serious aspect is Finding 1; this is the tonal residue).

**Assessment**: Marginal. Consider using "first-class" language: "Observability is first-class -- silent errors are unacceptable..."

---

### Finding 13: Human validation pause pattern partially weakened

**Source**: Lines 120-138 include a specific template AND two behavioral rules: (1) "If instructed to execute multiple phases consecutively, skip the pause until the last phase" (line 136), (2) "Do not check off items in the manual testing steps until confirmed by the user" (line 138).

**Archetype**: process.md Step 4 lines 49-65. The template is preserved. Rule (1) is preserved ("If instructed to execute multiple phases consecutively, skip the pause until the last phase"). Rule (2) is preserved ("Do not check off manual testing items until confirmed by the user").

**Severity**: N/A. Actually fully preserved on closer inspection.

**Assessment**: Acceptable. Both behavioral rules and the template are present.

---

## Summary

### Losses Requiring Remediation (2)

1. **Finding 1** (Moderate): "Instrument proactively, not after failures" is a behavioral directive that was incorrectly dropped with the Logfire tool reference. Restore the behavior in tenets.md and the verbatim block without naming Logfire.

2. **Finding 3** (Moderate): Three validation strategies (observability spans, tmp validation scripts, browser-based validation) were dropped as environmental. The tool names are environmental; the strategies are behavioral. Restore the strategies abstractly in process.md Step 3 or the verbatim block.

### Losses Worth Considering (3)

3. **Finding 2** (Minor): "Complexity hidden behind simple interfaces" -- a one-phrase addition to the DX tenet would close a gap.

4. **Finding 9** (Minor): "Share the file location with the user" -- a communication behavior was dropped with the research method. Minor but worth noting.

5. **Finding 12** (Minor): "First-class" language for observability was downgraded. Tonal, not behavioral, but the original's word choice was deliberate.

### Acceptable Losses (5+)

- Finding 4: Ultrathink -- correctly identified as harness-specific. Host-adaptation is the right place.
- Finding 5: "Run frequently" -- phase verification covers the intent.
- Finding 6: Example workflow -- illustrative, fully specified by doctrine.
- Finding 7: Propagate deduplication -- contextual details are preserved across doctrine articles.
- Finding 8: Git-as-documentation framing -- covered by commit convention.
- Finding 10: TodoWrite -- actually preserved.
- Finding 11: "We" voice -- preserved in verbatim block where it matters.
- Finding 13: Human validation rules -- actually fully preserved.

### Overall Assessment

The decomposition is structurally sound. The two moderate findings both stem from the same classification error: treating behavioral content as environmental because it was co-located with tool references. "Use Logfire" is environmental. "Instrument proactively" is behavioral. "Use Playwright" is environmental. "Use browser-based validation for UI features" is behavioral. The decomposer correctly identified the tool/behavior boundary in most cases but drew the line too aggressively in the verbatim block's validation section.

The deduplication is well-handled -- the four occurrences of "propagate upward" are consolidated into one tenet but correctly restated in their operational contexts within doctrine. No contextual specificity was lost in practice.

The enrichments (truth article, pipeline, output contract) are genuine additions that strengthen the archetype beyond the original. The derivation chain is clean. The structural transformation is faithful.

Fix Findings 1 and 3 and this decomposition is lossless.
