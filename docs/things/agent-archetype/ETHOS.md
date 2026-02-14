# Ethos

The ethos is the agent's character -- who it is, what it believes, how it thinks, and what it will not do. It is the domain of *being*.

The word comes from Greek, meaning "character" or "guiding beliefs." In classical rhetoric, ethos is the credibility and moral character that makes an audience trust a speaker. In military tradition, an ethos is the defining creed of a unit -- the Warrior Ethos, the SEAL Ethos -- the set of beliefs that hold under pressure when process breaks down. An agent's ethos does the same: it defines the agent's stance toward its domain and the constraints it will not violate.

## Why Ethos Exists as a Grouping

A single agent definition (like a SKILL.md) mixes together many different types of content. Some of that content defines the agent's *character*. Some defines its *workflow*. When these are interleaved in one flat document, two problems emerge:

1. **Authoring problem.** When creating a new agent, you don't know which sections define character vs workflow. You copy-paste from an existing skill and hope you got the right pieces.

2. **Maintenance problem.** When updating shared values (e.g., "we never assume anything"), you need to find every place an ethos principle appears across all agents. If it's mixed into process steps, you miss it.

Ethos groups the character-defining content together so it can be authored, reviewed, and propagated independently of workflow.

## The Components

### Identity

The agent's declaration of self and its boundaries.

Identity is not just a name or a role. It is a *relationship claim* -- the agent's position in a system of other agents and its relationship to truth. Compare these actual identity declarations:

- **Architect**: "You direct the full workflow from raw requirements to validated implementation." (I am the conductor.)
- **Test-writer**: "You define what 'correct' means in executable, provable terms." (I am the arbiter of truth.)
- **Research-codebase**: "Document the codebase as-is." (I am the documentarian.)

Each identity implies a fundamentally different orientation. The architect evaluates. The test-writer proves. The researcher observes.

**Anti-identity** is the second half -- equally important. Without it, LLMs drift toward doing everything. Anti-identity is the agent's immune system; it rejects behaviors that would corrupt its role:

- "You are an architect, not a researcher, not a planner, not an implementer."
- "You are a worker, not an orchestrator. Do not spawn additional clones."
- "You are a documentarian, not a critic or consultant."

### Tenets (Axiology)

What the agent believes about its domain.

Axiology is the branch of philosophy concerned with values -- what is good, what matters, what should be prioritized. An agent's tenets are its axiological commitments: the deepest held positions about its domain that shape every decision.

Tenets are not instructions. They are convictions. The difference matters: an instruction says "do X." A tenet says "X is true, and therefore..." The agent internalizes the belief and derives its own behavior from it.

The test-writer skill has the most developed tenets in the current system:

1. **"Tests are specifications, not afterthoughts."** -- This isn't telling the agent to write tests first. It's asserting that the *nature* of a test is to define correctness. The behavioral implications flow from the belief.

2. **"Silence is failure."** -- This isn't a rule about error handling. It's a value judgment: any system that can fail silently is unacceptable. The agent will add error propagation checks that no instruction asked for, because it *believes* silence is failure.

3. **"Truth over completion."** -- This is a priority ordering. When forced to choose between 5 thorough tests and 50 shallow ones, the tenet resolves the ambiguity. No process step could anticipate every such trade-off.

Tenets belong in skills where the agent embodies an opinionated philosophy. Not every agent needs them -- a utility agent that locates files has no axiological stance. But any agent that makes judgment calls benefits from explicit tenets.

### Principles (Epistemology)

How the agent operates and makes decisions.

Epistemology is the branch of philosophy concerned with knowledge -- how we know what we know, what counts as justified belief, what methods produce reliable results. An agent's principles are its epistemological commitments: the methods and approaches it trusts.

Principles are different from tenets. Tenets say *what matters*. Principles say *how to work*. Compare:

- Tenet: "Silence is failure." (a value)
- Principle: "Quality gates, not vibes." (a method)

- Tenet: "Truth over completion." (a priority)
- Principle: "Source documents are ground truth." (an epistemological claim)

- Tenet: "Tests must distinguish correct from incorrect implementations." (a belief about what good tests are)
- Principle: "Agentic, not scripted." (an approach to work)

The distinction matters for authoring: when creating a new agent, tenets answer "what does this agent believe?" while principles answer "how does this agent approach its work?"

### Rules (Behavioral Law)

Hard constraints that the agent must never violate.

Rules are not philosophical. They are guardrails. They exist because without them, agents drift -- subtly, confidently, and wrong. Rules are the agent's laws: NEVER do X, ALWAYS do Y.

Rules differ from principles in enforcement. A principle like "agentic, not scripted" guides behavior but allows interpretation. A rule like "NEVER write research documents -- delegate /research-codebase" is absolute. Breaking a principle means working suboptimally. Breaking a rule means the agent has left its role.

Rules also serve as checkpoints. The architect skill includes: "CHECKPOINT: If you find yourself writing a plan, research document, or code directly -- STOP. You are deviating from your role." This is a rule that explicitly tells the agent to self-monitor for drift.

## How Ethos Propagates

An orchestrator's ethos doesn't stay in one agent. Through **verbatim propagation**, ethos values are injected into sub-agents. When the test-writer delegates to test-writer-clones, it passes its tenets and principles word-for-word. This ensures that a clone analyzing from the "Error Path Adversary" perspective still holds the same core beliefs as the parent.

Verbatim propagation is immutable -- the text is forwarded exactly, not paraphrased. This is deliberate. Paraphrasing introduces drift. Over a delegation hierarchy (architect -> test-writer -> test-writer-clone), small drifts compound into large deviations. Exact transmission eliminates this.

## The Test

If you can change something about an agent and its *judgment* stays the same, that thing is not ethos -- it's doctrine. If changing it would alter *how the agent thinks*, it's ethos.
