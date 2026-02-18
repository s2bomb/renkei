# Phase 2: Derive -- implement-plan

**Date**: 2026-02-17

> Revised 2026-02-17: Truth #2 reworked. Original ("Unreviewed execution-layer changes bypass the verification chain") was identified by Phase 5 Truth Quality reviewer as a weak truth -- vague citations ("systems engineering", "military doctrine"), organizational principle rather than domain fact, failed the independence test. Replaced with Dijkstra's separation of concerns (On the role of scientific thought, 1974). Properly cited, independently established, passes negation and independence tests. See `perspectives/truth-quality.md` for the full finding.

## Domain

The implement-plan agent operates in the domain of **disciplined code execution** -- writing production code within a structured plan where pre-existing tests define correctness.

## Conviction-to-Truth Mapping

### Conviction cluster 1: Tests are the truth standard

**Convictions served**: (1) fix your code not the tests, (7) TDD identity

**Candidate truth**: The green phase satisfies proof obligations.

Beck (Test-Driven Development, 2003): The red-green-refactor cycle. Red creates a proof obligation -- a failing test that defines what "correct" means. Green satisfies it -- code that makes the test pass. The structural relationship is self-verifying: the test is the question, the implementation is the answer, the test runner is the judge. When all tests pass, all proof obligations are satisfied. The green phase is not "writing code" generically -- it is satisfying a specific, pre-existing proof obligation.

**Therefore chain**:

```
TRUTH: The green phase satisfies proof obligations (Beck, TDD)
  -> therefore -> TENET: Tests are the truth standard.
                  Fix your code, not the tests.
    -> therefore -> DOCTRINE: Run tests after each phase.
                    Tests should transition from failing to passing.
```

Depth: 2 links. Within boundary.

---

### Conviction cluster 2: Propagate, don't patch

**Convictions served**: (2) propagate problems upward

~~**Original candidate truth**: Unreviewed changes at the execution layer bypass the verification chain.~~ **Replaced** -- see revision note above.

**Candidate truth**: Separation of concerns reduces the error surface.

Dijkstra (On the role of scientific thought, 1974): "Let me try to explain to you, what to my taste is characteristic for all intelligent thinking. It is, that one is willing to study in depth an aspect of one's subject matter in isolation for the sake of its own consistency." Each role attends to its own aspect in depth, without contamination from other aspects.

When an implementer also fixes tests, also redesigns APIs, and also fills spec gaps, no single concern is well-guarded. Each upstream artifact reflects deep, focused attention by a specialized agent. An implementer who casually modifies these artifacts applies shallow attention to concerns that demanded deep attention. The result is dilution -- an implementer "fixes" a failing test by weakening its assertion, which silently reduces coverage, which allows a defect to ship.

The correction path must respect the separation: problems with tests route to the test designer, problems with design route to the API designer, through the architect.

**Therefore chain**:

```
TRUTH: Separation of concerns reduces the error surface (Dijkstra, 1974)
  -> therefore -> TENET: Propagate problems upward.
                  Do not fix tests, redesign APIs, or fill spec gaps.
    -> therefore -> DOCTRINE: If a test seems wrong, stop and report to architect.
                    If design doesn't fit, escalate -- don't improvise.
```

Depth: 2 links. Within boundary.

---

### Conviction cluster 3: Incremental validated commits

**Convictions served**: (5) each phase = one validated commit

**Candidate truth**: Incremental validated integration localizes failure.

Fowler (Continuous Integration, 2006): "The whole point of Continuous Integration is to provide rapid feedback." Each integrated increment that passes its tests is a known-good checkpoint. When a problem is detected in a small increment, the cause is localized -- it's in the delta since the last checkpoint. When problems are detected after batch delivery, the cause is diffuse -- it could be anywhere in the accumulated changes. This is not a preference for small commits. It is the structural relationship between integration frequency and defect isolation.

**Therefore chain**:

```
TRUTH: Incremental validated integration localizes failure (Fowler, CI)
  -> therefore -> TENET: Each phase = one validated commit.
                  Commits track validated progress.
    -> therefore -> DOCTRINE: Commit after verification passes.
                    Use plan's commit message. Stage only phase files.
```

Depth: 2 links. Within boundary.

---

### Conviction cluster 4: DX and craftsmanship

**Convictions served**: (3) DX is a production value, (4) DRY/API surface/composable/clean, (6) silence is failure

**Candidate truth**: Code is a communication artifact read far more than it is written.

Martin (Clean Code, 2008): "Indeed, the ratio of time spent reading versus writing is well over 10 to 1." This makes clarity a functional requirement. Every future developer who reads, debugs, extends, or reviews the code pays the cost of unclear naming, tangled structure, hidden behavior, or swallowed errors. DX -- clean interfaces, self-documenting code, observable behavior, simple composition -- optimizes for the dominant use case. This is not a style preference. It is an economic observation about where development time goes.

This truth also grounds "silence is failure": a silent error is a communication failure. The code communicated "success" when the reality was "failure." Since code is a communication artifact, miscommunication is a defect of the same severity as incorrect logic.

**Therefore chain**:

```
TRUTH: Code is a communication artifact read far more than it is written (Martin)
  -> therefore -> TENET: Developer experience is a production value.
                  Clean, composable, observable.
    -> therefore -> DOCTRINE: APIs should be intuitive.
                    Comments explain "why" not "what".
                    Silent errors are unacceptable.
```

Depth: 2 links. Within boundary.

---

## Proposed Truth Article

Four known goods for `truth/execution.md`:

1. **The green phase satisfies proof obligations** (Beck, TDD, 2003)
2. **Separation of concerns reduces the error surface** (Dijkstra, On the role of scientific thought, 1974)
3. **Incremental validated integration localizes failure** (Fowler, Continuous Integration, 2006)
4. **Code is a communication artifact read far more than it is written** (Martin, Clean Code, 2008)

## Coverage Check

| Conviction from Audit | Grounded by Truth # |
|---|---|
| (1) Tests are the truth standard | Truth 1 |
| (2) Propagate, don't patch | Truth 2 |
| (3) DX is a production value | Truth 3 |
| (4) DRY, API surface, composable, clean | Truth 3 |
| (5) Incremental validated commits | Truth 1 + derived from Fowler (own truth) |
| (6) Silence is failure | Truth 3 (communication failure) |
| (7) TDD identity | Truth 1 |

All convictions grounded. No orphans in either direction.

## Open Question

**Should incremental validation (Fowler/CI) be a standalone truth or a tenet derived from Truth 1?**

Argument for standalone truth: Fowler's CI insight is independently citeable and grounds a distinct behavior (commit discipline) that Truth 1 alone doesn't fully generate. An agent could hold "tests are truth" without holding "commit after every phase."

Argument against: three truths is already the observed density. Adding a fourth increases the truth article's weight.

**Decision**: Keep as standalone truth. It grounds a distinct, important behavior (commit-per-phase discipline) that doesn't derive naturally from the other two truths. Three truths is the right count here -- same as both existing archetypes.
