# Perspective: Truth Quality Assessment

**Perspective**: Truth Quality Assessor
**Date**: 2026-02-17
**Input**: `archetypes/development/implement-plan/truth/execution.md` (4 truths), `02-derive.md` (derivation work)
**Comparators**: `test-designer/truth/verification.md` (3 truths), `test-implementer/truth/implementation.md` (3 truths)

---

## Evaluation Standard

From VOCABULARY.md, a known good is: "An established, citeable, inarguable fact within a domain. Mathematical properties, physical constraints, proven patterns, legal principles, empirical results, or epistemological frameworks established by prior human labor. Known goods are identified (curated), not invented (created)."

From AUTHORING.md: "Known goods are domain-specific and externally established... The author's job is curation, not creation."

The test for each truth: Is this an established, citeable, inarguable fact? Or is it an assertion the author made and then attributed to an authority?

---

## Truth 1: "The green phase satisfies proof obligations"

**Citation**: Beck, Test-Driven Development (2003)
**Rating**: **Adequate**

### What Beck actually says

Beck describes the red-green-refactor cycle as a development practice. "Red: write a little test that doesn't work. Green: make the test work quickly. Refactor: eliminate all the duplication created in merely getting the test to work." This is an accurate description of TDD's mechanism.

### Where the truth article overclaims

The word "proof obligation" is doing significant work. Beck does not use this term. He describes tests as feedback mechanisms, not as formal proof obligations in the mathematical sense. The article imports formal verification language ("proof obligation," "self-verifying," "the test runner is the judge") and projects it onto Beck's pragmatic methodology.

The *structural observation* underneath is sound: in TDD, the failing test defines what "correct" means, and the green phase satisfies that definition. This is an inarguable property of TDD's mechanics. But the framing as "proof" overclaims -- software tests are not proofs in the formal sense. They are empirical checks on specific inputs. Dijkstra's observation holds: "testing shows the presence, not the absence, of bugs."

That said, within the Renkei ecosystem, the test-designer archetype already uses "proof obligation" as established vocabulary (its truth article: "Proof obligations are derivable from contracts"). So the term has internal consistency even if it borrows prestige from formal methods. The implement-plan agent inherits this vocabulary from the test-designer's output -- it receives proof obligations, it doesn't define them.

### Verdict

The underlying mechanism (green phase satisfies a pre-defined correctness criterion) is inarguable. The "proof obligation" framing is inherited from the ensemble's vocabulary rather than from Beck, which makes the citation slightly dishonest -- it attributes to Beck a framing Beck did not use. A more honest formulation: "In TDD, failing tests define correctness criteria; the green phase satisfies them (Beck, 2003). Within this ensemble, these criteria are called proof obligations because the test-designer derives them formally from API contracts."

This would be strong. As written, it is adequate -- correct in substance, slightly overclaimed in framing.

---

## Truth 2: "Unreviewed execution-layer changes bypass the verification chain"

**Citation**: "Systems engineering (configuration management)" and "military doctrine"
**Rating**: **Weak**

### The core claim

That when an executor modifies an upstream artifact, the modification bypasses the review process that approved the original. This is presented as a domain truth.

### Problem 1: This is an organizational principle, not a domain truth

The claim is true *within systems that have sequential review and baselined artifacts*. It is not a domain truth in the way that Popper's falsifiability or Beck's red-green cycle are domain truths. It is a property of a specific organizational structure -- one where roles are specialized, review is sequential, and artifacts are baselined.

Compare to the test-designer's Truth 2 ("Proof obligations are derivable from contracts"): that is a structural property of interfaces themselves. It holds regardless of what organization you work in, what process you follow, or how many people are involved. It is a mathematical property.

"Unreviewed changes bypass verification" is a tautology dressed as insight. Of course unreviewed changes bypass review -- that is what "unreviewed" means. The actual claim is: "Execution-layer agents should not modify upstream artifacts." That is an organizational rule, not a domain truth.

### Problem 2: The citations are not specific

"Systems engineering" and "military doctrine" are fields, not sources. A citeable known good has a specific author, work, and claim. Popper's falsifiability comes from *Conjectures and Refutations* (1963). Beck's TDD comes from *Test-Driven Development by Example* (2003). "Configuration management" is a practice area, not a citable claim.

If pressed: MIL-STD-973 (Configuration Management) or CMMI configuration management process areas could be cited. EIA-649 (National Consensus Standard for Configuration Management) explicitly requires change control on baselined artifacts. But the truth article does not cite these -- it gestures at fields.

### Problem 3: The counterfactual is arguable

Someone could reasonably argue that empowered executors who fix issues in-place are MORE effective than those who escalate everything. The Agile Manifesto's emphasis on "individuals and interactions over processes and tools" and the DevOps movement's emphasis on reduced handoffs and empowered teams are direct counterarguments. Toyota's production system gives line workers the authority to stop the line -- they don't escalate through a chain of command.

A genuine known good is inarguable. This one has well-established counterarguments from credible sources. That makes it a design choice, not a domain truth.

### What is actually true here

The genuine truth underneath is narrower: **In a system designed around sequential verification, modifications that bypass verification introduce unverified state.** This is a tautological but useful structural observation. The implement-plan agent operates within such a system (tests designed -> tests implemented -> code implemented). So the truth is really: "This agent operates within a sequential verification system, and here is a property of such systems."

That is honest but weaker. And it raises the question: is a property of your chosen organizational structure a "domain truth," or is it a design constraint?

### Verdict

This truth is the weakest of the four. It is an organizational principle presented as a domain truth, with non-specific citations, and has credible counterarguments. The conviction it grounds ("propagate, don't patch") is a good behavioral rule for this agent -- but it should be grounded in a stronger truth, or acknowledged as a design constraint of the ensemble rather than a domain truth.

---

## Truth 3: "Incremental validated integration localizes failure"

**Citation**: Fowler, Continuous Integration (2006)
**Rating**: **Strong**

### What Fowler actually says

Fowler's original CI article argues that frequent integration with automated testing provides rapid feedback and localizes defects. The specific claim -- that smaller increments localize failure to the delta since the last checkpoint -- is a structural property of incremental processes, not just Fowler's opinion.

### Is this a known good?

Yes. The relationship between increment size and defect localization is a structural property -- it holds for the same reason that binary search is O(log n). Smaller search space, faster localization. This is not a preference or a methodology choice. It is a consequence of how information localizes in sequential processes.

The citation to Fowler is appropriate -- he articulated this clearly and it is widely established. The insight is older than Fowler (it traces to integration testing practices in the 1970s), but Fowler's formulation is the standard reference.

### Is the therefore-chain valid?

TRUTH (incremental integration localizes failure) -> TENET (each phase = one validated commit) -> DOCTRINE (commit after verification passes). This is clean. The tenet is a direct application of the truth to the agent's operational context. Two links, tight chain.

### Verdict

This is the strongest truth in the article. It is structural, citeable, inarguable, and its therefore-chain is clean.

---

## Truth 4: "Code is a communication artifact read far more than it is written"

**Citation**: Martin, Clean Code (2008)
**Rating**: **Adequate**

### The 10:1 ratio

Martin's claim that "the ratio of time spent reading versus writing is well over 10 to 1" is presented as established fact. It is not. It is an estimate based on Martin's experience, not an empirically measured result with controlled methodology. The number is widely repeated but not rigorously established.

However, the *directional* claim -- that code is read substantially more than it is written -- is well-supported by empirical studies. Minelli, Mocci, and Lanza (2015, "I Know What You Did Last Summer") found developers spend about 70% of their time in understanding activities. Ko et al. (2006, "An Exploratory Study of How Developers Seek, Relate, and Collect Relevant Information") found similar patterns. The directional claim is inarguable even if the specific ratio is not.

### Is this the right domain for this truth?

This truth is doing a lot of work. It grounds three distinct tenets:

1. Developer experience is a production value (DX, clean code, composability)
2. Silence is failure (miscommunication as defect)
3. Craftsmanship standards (implicit in the tenet's elaboration)

The test-designer's truths each ground one tenet cluster. This truth grounds three. That is not necessarily wrong -- a single deep truth can legitimately ground multiple convictions. But it raises the question: is the truth deep enough to do all this work, or is it being stretched?

"Code is read more than written" does naturally ground "clarity matters." The leap to "silence is failure" requires an additional step: code-as-communication -> miscommunication-is-defect -> silence-is-miscommunication. That is three "therefores," which exceeds the derivation boundary.

### Should this be shared?

"Code is a communication artifact" is a universal software truth. It applies equally to the test-implementer ("Tests are production artifacts" is essentially the same observation applied to test code), the test-designer, the API designer, and every other development archetype. It is not specific to implement-plan.

Compare to test-designer's Truth 3 (Aristotle's scope bounds): that truth is specific to the act of scoping proof obligations. It would not apply to an implementer or a deployment agent. It earns its place in the test-designer's truth article because it is domain-specific.

"Code is read more than written" is true for every agent that produces code. It could reasonably live in `_shared/truth/` if such a thing existed, rather than in implement-plan's specific truth article.

### Verdict

The directional claim is sound. The specific ratio is anecdotal but the truth does not depend on the exact number. The therefore-chain to "silence is failure" is stretched (3 links). The truth is universal rather than implement-plan-specific. Adequate, but the weakest of the truths that I would keep.

---

## Structural Assessment

### Count: 4 truths vs. 3 in comparators

The derivation document (`02-derive.md`) itself notes this tension. It initially proposed 3 truths, then added the Fowler/CI truth as a 4th, then in the "Decision" section reversed to call it 3 truths while the actual article contains 4. This suggests the author was uncertain about the right count.

The existing archetypes (test-designer, test-implementer) each have 3 truths. Is 4 too many?

The test is not the count -- it is whether each truth earns its place by grounding a distinct conviction that the other truths cannot ground. Truth 3 (Fowler/CI) grounds commit-per-phase discipline, which is distinct from the other truths. It earns its place. The question is whether Truth 4 (Martin/communication) also earns its place or is doing work that could be absorbed elsewhere.

If Truth 2 (bypass verification) were strengthened or replaced, 4 truths could work. As it stands, with one weak truth and one stretched truth, 4 feels like it dilutes the article. Three strong truths would be better than four of mixed quality.

### Quality comparison to existing truth articles

**Test-designer truths** (verification.md):
- Popper's falsifiability: domain-specific, formally citeable, inarguable. **Strong.**
- Proof obligations derivable from contracts: structural property of interfaces, domain-specific. **Strong.**
- Aristotle's scope bounds: epistemological principle applied to testing scope. **Strong.**

All three are domain-specific to the act of designing tests. None are generic software truths. Each grounds one tenet cluster. The citations are to specific authors and works.

**Test-implementer truths** (implementation.md):
- Red phase has structural value (Beck): mechanistic property of TDD. **Strong.**
- Faithful translation preserves proof: structural property of specification translation. **Strong.**
- Tests are production artifacts: somewhat generic but specifically argued. **Adequate.**

The test-implementer's third truth is the closest parallel to implement-plan's fourth -- both are "code quality matters" observations applied to a specific context. But "tests are production artifacts" is more focused than "code is a communication artifact read more than written."

**Implement-plan truths** (execution.md):
- Green phase / proof obligations (Beck): sound mechanism, slightly overclaimed framing. **Adequate.**
- Bypass verification chain: organizational principle, not domain truth, vague citations. **Weak.**
- Incremental integration localizes failure (Fowler): structural, citeable, inarguable. **Strong.**
- Code as communication artifact (Martin): directional claim sound, stretched therefore-chains, generic. **Adequate.**

The implement-plan truth article is noticeably weaker than the test-designer's. The test-designer has three strong truths, each domain-specific, each tightly cited. The implement-plan has one strong, two adequate, and one weak. The quality gap is real.

---

## Therefore-Chain Validity

| Truth | Tenet | Chain Valid? |
|---|---|---|
| Green phase satisfies proof obligations | Tests are the truth standard | Yes -- direct application. If proof obligations exist, satisfying them IS the truth standard. |
| Bypass verification chain | Propagate, don't patch | **Questionable** -- the truth is an organizational principle, so the tenet is also an organizational rule dressed as conviction. The chain is internally consistent but built on sand. |
| Incremental integration localizes failure | Each phase is a validated checkpoint | Yes -- direct application. The tenet is the truth operationalized for this agent's context. |
| Code is communication artifact | DX is a production value | Yes, but stretched. The leap to "silence is failure" requires extra links. The DX tenet itself is fine. |

---

## Recommendations

### 1. Strengthen or replace Truth 2

The "bypass verification chain" truth is the weakest element. Two options:

**Option A: Narrow it to a citable structural claim.** Something like: "In systems with role specialization, the corrective path and the production path must remain separate (Deming, Out of the Crisis, 1986 -- special cause vs. common cause variation requires different correction channels)." This would give it a real citation and make it a structural property rather than an organizational rule.

**Option B: Replace it with a truth about separation of concerns.** The underlying conviction (propagate, don't patch) could be grounded in: "Separation of concerns reduces error surface (Dijkstra, 'On the role of scientific thought', 1974)." The argument: an executor who also reviews, also designs, and also specs is violating separation of concerns. Each role has a distinct failure mode, and combining them in one agent means no single failure mode is well-guarded. This is closer to a domain truth.

### 2. Tighten Truth 1's framing

Acknowledge that "proof obligation" is ensemble vocabulary, not Beck's term. Either: (a) cite the ensemble's test-designer as the source of the "proof obligation" framing and Beck as the source of the green-phase mechanism, or (b) use Beck's own language ("a failing test defines correctness; making it pass satisfies that definition") and let the ensemble context supply the formal framing.

### 3. Decide whether Truth 4 is implement-plan-specific

If "code is a communication artifact" belongs here, it should be argued specifically for the implement-plan context -- why does this truth matter MORE for the implementer than for other agents? The test-implementer does this well: "Tests are production artifacts" argues specifically that test code has the same longevity and readership as production code, which is a non-obvious claim specific to that agent's output.

An implement-plan-specific version might be: "Implementation code carries the permanent record of design decisions, outliving plans, specs, and the implementing session itself." This is more specific and harder to relocate to `_shared/`.

Alternatively, acknowledge it as a universal truth and accept that it will appear (perhaps in different formulations) across multiple archetypes. This is consistent with VOCABULARY.md: "A known good belongs to the domain, not to the archetype. Multiple archetypes may derive from the same known good."

### 4. Consider reducing to 3 truths

If Truth 2 is replaced or strengthened, and Truth 4 is tightened, 4 truths can work. But if the choice is between 4 truths of mixed quality and 3 strong truths, choose 3. Drop Truth 4 (absorb "silence is failure" into a tenet grounded by Truth 1 -- a test that passes when the code silently fails is a proof obligation violation) and focus the article.

---

## Overall Assessment

The truth article is **adequate but not strong**. It has one genuinely strong truth (Fowler/CI), two adequate truths that need tightening (Beck/green phase, Martin/communication), and one weak truth that should be reworked (bypass verification). The existing comparators (test-designer, test-implementer) are both stronger -- their truths are more domain-specific, more tightly cited, and less arguable.

The derivation work in `02-derive.md` is thorough and honest -- it surfaces its own uncertainty about the fourth truth, which is a good sign. The gap is not in the analysis but in the curation: some of these "truths" are design choices or organizational principles rather than established domain facts. The framework demands the distinction, and this article blurs it.

**Summary ratings:**

| Truth | Rating | Key Issue |
|---|---|---|
| 1. Green phase / proof obligations | Adequate | Framing overclaims; sound underneath |
| 2. Bypass verification chain | Weak | Organizational principle, not domain truth; vague citations; arguable |
| 3. Incremental integration localizes failure | Strong | Structural, citeable, inarguable |
| 4. Code as communication artifact | Adequate | Generic, stretched chains, anecdotal ratio |

**Recommendation**: Rework Truth 2, tighten Truths 1 and 4, consider reducing to 3 truths. The article should reach the quality standard set by the test-designer's truth article before proceeding.
