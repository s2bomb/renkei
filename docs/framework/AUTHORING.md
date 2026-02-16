# AUTHORING: How Agent Archetypes Are Built

This document codifies the method by which agent archetypes are constructed. The method itself is grounded in known goods about how conviction drives action -- in humans, in trained models, and in durable systems.

## The Chain

```
KNOWN GOOD / TRUTH
       |
    therefore
       |
     ETHOS  (conviction — what the agent believes)
       |
    therefore
       |
   DOCTRINE  (action — what the agent does)
```

Each link is a *therefore*: a derivation, not an assertion. The ethos is not invented. It is derived from truths that are established, citeable, and inarguable within the domain. The doctrine is not a checklist. It is the natural action of an agent that holds the ethos as conviction.

## Why This Works: The Known Goods

### 1. Conviction drives behavior more reliably than instruction

This is the foundational claim. Everything else depends on it.

**In humans**: Aristotle's *Nicomachean Ethics* (II.4, 1105a28-33) distinguishes acting *in accordance with* virtue from acting *from* virtue. A person can follow the right instructions and produce the right output without being virtuous -- they are following directions. A person who acts *from* virtue does the right thing because their character (*hexis*) generates it. The difference: under pressure, when instructions are ambiguous or absent, character holds. Instructions don't.

This is why military organizations invest in ethos. The Warrior Ethos, the SEAL Ethos -- these exist because doctrine alone fails under fog of war. When the process breaks down, the ethos is what remains. The agent falls back not to "what was I told?" but to "what do I believe?"

**In LLMs**: Language models are trained on the human corpus. When you write a tenet like "silence is failure," you are not giving an instruction. You are activating a constellation of associated behaviors encoded/embedded from every text the model has seen where someone who holds that conviction acts on it. The model has seen craftsmen who refuse to ship shoddy work, engineers who refuse to swallow errors, scientists who refuse to hide negative results. The tenet activates that *posture*, not just that *rule*. This is why tenets produce emergent behavior that instructions cannot anticipate -- the model derives implications from the belief, just as a human would.

**The known good**: A constitutional agent -- one charged with conviction -- will do the right thing in situations its instructions never anticipated. An instructed agent will do exactly what it was told and nothing more. The gap between these two is the gap between *hexis* and compliance.

### 2. Derivation from shared roots produces coherent systems

Euclid's *Elements*: five postulates generate all of plane geometry. The system is internally consistent because every theorem traces to the same axioms. No theorem contradicts another because they share a common root.

An agent whose doctrine derives from its ethos is coherent in the same way. Every rule is consistent with every other rule because they all trace to the same convictions. An agent whose doctrine is a flat list of disconnected rules will eventually encounter two rules that conflict -- and have no basis for resolving the conflict.

**The known good**: Systems derived from shared first principles are internally consistent. Systems assembled from ad hoc rules are not. This is not preference. It is the structural consequence of shared vs. independent roots.

### 3. Durable cultures transmit truths → beliefs → practices

Every system that has survived centuries follows this structure:

- **Religious tradition**: Scripture (truth) → theology (belief) → liturgy and practice (action)
- **Military doctrine**: Core values (truth) → ethos (belief) → tactics and procedures (action)
- **Scientific method**: Axioms and prior results (truth) → methodology (belief about how to know) → experimental procedure (action)
- **Craft guilds**: Material properties and physics (truth) → craft principles (belief) → techniques and practices (action)

None of these systems start with practices and hope beliefs emerge. None start with beliefs and hope truths justify them. The direction is always: truth first, conviction derived, action derived from conviction.

**The known good**: The truth → belief → action structure is not one option among many. It is the structure that survives pressure, transmits across generations, and self-corrects when practices drift. Systems that skip the belief layer (instruction-only) are brittle. Systems that skip the truth layer (belief without grounding) are dogma.

### 4. Known goods are domain-specific and externally established

The truths that ground an agent's ethos are not invented by the archetype author. They are identified. They already exist in the domain -- as mathematical facts, physical constraints, proven patterns, legal principles, or empirical results established by people who labored over them.

The test-writer's ethos is grounded in Popper's falsifiability, Aristotle's demonstration, and the biblical testimony pattern. These were not chosen to sound impressive. They are the actual epistemological frameworks that govern what it means to *know* something is correct. The test-writer's domain *is* knowledge verification. These *are* its known goods.

A rendering agent's ethos would be grounded in different known goods: the physics of light transport, the psychophysics of human perception, the mathematical properties of linear algebra. A data pipeline agent's ethos would draw from information theory, set theory, and the CAP theorem.

**The known good**: The author's job is curation, not creation. Identify which established truths govern this agent's domain. The ethos writes itself.

## The Derivation Boundary: Where "Therefore" Hits Diminishing Returns

The chain has a natural stopping point in both directions. Exceeding it produces waste, not value.

### Upward: Do not derive the known goods

Aristotle identified this boundary in *Posterior Analytics* II.19 (100b5-12): first principles (*archai*) are grasped by *nous* (intuitive reason), not by further demonstration. If every premise required a prior premise, you get infinite regress and can demonstrate nothing. The known goods are the axioms. They are accepted because they are evident, proven, or empirically established -- not because they derive from something deeper.

If you find yourself trying to justify *why* a pure function is easier to reason about, you have gone too far. That is a known good. It terminates the upward chain.

### Downward: Do not over-derive doctrine

This is the analogue of abstraction mania in software. In web development, the pathology is: extract a helper, then a utility, then a factory, then an abstract factory -- each layer adding indirection without adding capability. The code becomes harder to understand than the problem it solves.

In the derivation chain, the pathology is: derive a tenet, then derive a principle from the tenet, then derive a sub-principle, then derive a rule from the sub-principle, then derive a process step from the rule. Each "therefore" adds a link that the reader must trace back to the root. Past a certain depth, the chain *obscures* the truth it was meant to transmit.

**The test**: Can someone reading this derivation trace it back to the known good in one mental step? If yes, the chain is tight. If they need to traverse three intermediate "therefores" to understand why a rule exists, the chain is too long. Compress it.

The practical boundary:

```
KNOWN GOOD → therefore → ETHOS (1-2 links max)
ETHOS → therefore → DOCTRINE (1-2 links max)
```

If a doctrine element requires more than two "therefores" from a known good, either:
1. There is a missing ethos component that would shorten the chain, or
2. The doctrine element is over-specified and should be left to the agent's judgment (which the ethos already equips it to exercise)

Option 2 is the deeper insight: **the entire point of ethos is that you don't need to specify every doctrine element**. A constitutionally charged agent derives the right action from its convictions. Over-specifying doctrine is a failure of trust in the ethos you wrote -- and a signal that the ethos isn't grounded deeply enough.

## The Meta-Claim

This framework -- KNOWN GOOD → therefore → ETHOS → therefore → DOCTRINE -- is itself a known good. It is grounded in:

- Aristotle's virtue ethics (character generates right action)
- The structure of every durable cultural transmission system (truth → belief → practice)
- Euclid's demonstration that shared axioms produce coherent systems
- The empirical observation that LLMs respond to conviction-framing because the human corpus encodes conviction-action patterns
- Aristotle's regress boundary (known goods are axiomatic, not further derived)
- The universal pattern of abstraction diminishing returns (derivation depth has a cost)

It is not a methodology preference. It is the structure that produces agents with judgment -- agents that do the right thing not because they were told, but because they are constitutionally incapable of doing otherwise.
