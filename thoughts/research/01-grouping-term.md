# Research: What Do We Call a Collection of Agent Archetypes?

## The Question

What is the right concept and term for a collection of agent archetypes that work together toward a shared goal?

The current docs use **pipeline**. This document evaluates that term and alternatives by grounding each in known goods from multiple domains, then makes a recommendation.

## The Central Tension

Renkei's agent archetypes have a dual nature:

**Human-like**: They hold convictions (tenets), exercise judgment (principles), maintain identity, and push back on each other. The test-writer will challenge the API designer if the design is untestable. Agents argue, convince, and hold their ground. This is by design -- conviction drives behavior more reliably than instruction (Aristotle, *Nicomachean Ethics* II.4, 1105a28-33).

**Computer-like**: They produce deterministic, structured outputs (typed artifacts, JSON, documents with defined schemas). They have typed inputs and outputs. When composed well, the overall system is deterministic. Their interfaces are clean even when their internal reasoning is complex.

The term must honor both natures. A term that captures only the human side (organization, team) loses the determinism. A term that captures only the computer side (pipeline, function) loses the conviction.

## Candidates Evaluated

### 1. Pipeline

**Origin**: Industrial manufacturing and Unix shell piping.

**What it captures**: Linear flow from input to output. Typed data moving through stages. The Unix pipe `|` connects stdout of one process to stdin of the next. Each stage transforms data and passes it forward.

**What it misses**: The docs already acknowledge the system is "a graph of stages ... supports sequential flow, parallel fan-out, and feedback loops" (vision.md). A pipeline is topologically linear. The actual system has:
- Parallel fan-out (test-writer spawns 5 perspective clones simultaneously)
- Feedback loops (test-writer routes design gaps back to API designer)
- Quality gates that can reject and iterate
- Best-of-N patterns where multiple agents analyze independently

Pipeline also misses the human nature entirely. A Unix pipeline's stages do not argue with each other. `grep` does not push back on `cat` if the input is poorly structured. Pipeline implies passive, stateless transformation -- the opposite of conviction-driven agents.

**Known good against it**: The Unix pipeline article "What UNIX Pipelines Got Right" explicitly states pipelines enforce "linear topology only" -- "you cannot easily fan out data to multiple consumers or merge streams from multiple producers." Each component has "exactly one input file descriptor and one output file descriptor." (Source: programmingsimplicity.substack.com)

**Verdict**: Pipeline describes one possible topology within the system, not the system itself. Using "pipeline" for the whole is a category error -- it names the simplest case and loses the rest.

### 2. Organization

**Origin**: Organizational theory (Mintzberg, Galbraith, McChrystal).

**What it captures**: Hierarchy, roles, delegation, coordination. Mintzberg's five structural configurations (Simple Structure, Machine Bureaucracy, Professional Bureaucracy, Divisionalized Form, Adhocracy) describe different coordination mechanisms. The adhocracy -- "adaptive, creative, and flexible integrative behavior based on non-permanence and spontaneity" (Mintzberg) -- maps reasonably well to agent compositions.

**What it misses**: Organizations are permanent structures with ongoing purposes. Agent compositions are assembled for specific goals and dissolve when done. More critically, "organization" implies the human side so strongly that the computer side disappears. Nobody talks about the "deterministic output" of an organization. The term carries heavy connotations of bureaucracy, politics, and overhead.

**Verdict**: Too human. Loses the function-like, composable, deterministic nature.

### 3. Workflow

**Origin**: Business process management.

**What it captures**: Ordered steps from start to finish.

**What it misses**: Everything that matters. Workflow is the weakest candidate -- it implies a fixed sequence of steps to be followed, not a composition of conviction-driven agents. A workflow has no judgment, no feedback, no conviction. It is a checklist.

**Verdict**: Rejected. Does not honor either nature adequately.

### 4. Function (or Composition)

**Origin**: Mathematics and functional programming.

**What it captures**: Composability. Typed inputs and outputs. Deterministic behavior. In category theory, composition is formally defined: `(f . g)(x) = f(g(x))`. The output of one function becomes the input of the next. Functions can be composed into larger functions that are themselves composable. This maps directly to agents with typed inputs/outputs producing typed artifacts.

**What it misses**: Functions are stateless and have no conviction. `f . g` does not involve `g` pushing back on `f` because `f` produced an untestable design. Functions do not argue. They do not hold tenets. The entire ethos domain -- identity, tenets, principles, rules -- has no analogue in function composition.

**Related concepts worth noting**: Monads formalize composition within contexts (error handling, effects). Applicative functors enable composition of contextualized values. These capture some structural patterns but still miss the conviction dimension.

**Verdict**: Captures the computer nature well but erases the human nature entirely.

### 5. Task Force

**Origin**: Military doctrine (U.S. Army FM 3-0, Joint Publication 1).

**Definition**: "A temporary grouping of forces designed to accomplish a particular mission" (Army doctrine, TRADOC). Task forces are explicitly temporary, deliberately designed for specific missions, and disbanded on completion.

**What it captures**: Temporary composition for a specific goal. Specialized units with different capabilities assembled to complement each other. Combined arms doctrine: "the synchronized and simultaneous application of arms to achieve an effect greater than if each element was used separately or sequentially." This maps well -- agents with different specializations (researcher, designer, test-writer, implementer) composed to produce an effect none could produce alone.

**What it misses**: Task forces operate under a single commander with clear hierarchical authority. The command relationship is one-directional. Subordinate units execute the commander's intent, not their own conviction. Military task forces do not have the feedback loop where a subordinate unit challenges the task force commander's plan. The term is also militaristic -- it carries connotations of combat operations that may not fit a software development context.

**What it gets right**: The principle of combined arms -- that specialized capabilities must be integrated, and that the integrated whole achieves effects no single capability could -- is a genuine known good that applies to agent composition.

**Verdict**: Structurally sound but too hierarchical and too militaristic. The combined arms principle is valuable; the term itself is not.

### 6. Ensemble

**Origin**: French *ensemblée*, from Late Latin *insimul* ("at the same time"), from *simul* ("at the same time") + intensive prefix *in-*. First attested in English 1703 meaning "all the parts of a thing considered together." Musical sense ("the union of all parts in a performance") from 1844. (Source: etymonline.com)

**What it captures in music**: Multiple distinct voices coordinating to produce a unified performance. Crucially, ensemble does not require a conductor. Conductorless orchestras (Orpheus Chamber Orchestra, founded 1972; A Far Cry; Australian Chamber Orchestra) demonstrate that ensemble coordination can be achieved through mutual listening and shared understanding rather than hierarchical command. Musicians maintain autonomous artistic judgment -- they interpret, they express, they make real-time decisions -- while producing a coherent whole. The conductor, when present, functions as "a mediator who translates the creativity of musicians" and "stimulates the autonomous imagination of a group of musicians in such a way that they naturally choose congruent modes of musical initiative" (Sydney Conservatorium, "On Conductors"). This is ethos propagation: the conductor projects a vision, and musicians with their own conviction align to it.

**What it captures in machine learning**: Ensemble methods combine predictions from multiple models to achieve superior performance through diversity. The theoretical foundation: when ensemble members make uncorrelated errors, the combination produces lower error than any single model (bias-variance-diversity trade-off, JMLR 2023). Critically, diversity is not a bug -- it is the mechanism. "Combining a few top-performing models with several weaker models often outperforms combining only the best models, because top performers tend to make similar mistakes" (Machine Learning Mastery). This maps directly to the best-of-N pattern where perspective clones analyze from different angles and an orchestrator synthesizes.

**What it captures of the dual nature**:

- *Human-like*: Ensemble members have autonomous judgment. In music, they interpret. In ML, they have different learned representations. In the agent system, they hold convictions. Ensemble members disagree -- and the disagreement is valuable.

- *Computer-like*: Ensembles produce deterministic outputs. In ML, combination methods (voting, weighted mean, softmax normalization) transform diverse predictions into a single typed result. The individual members may reason differently, but the output is structured and composable.

- *Topology*: Ensemble does not imply linear flow. It accommodates parallel operation (all members run simultaneously), sequential operation (one after another), and mixed topologies. An ensemble can include sub-ensembles.

- *Hierarchy*: Ensemble is compatible with both flat and hierarchical structures. A chamber ensemble has no conductor. A symphony ensemble has one. The term does not prescribe.

**What it captures structurally**: An ensemble is explicitly a *whole* made of *parts* that retains its identity as a whole. Aristotle's criterion applies: an ensemble is "not a mere heap, but the whole is something besides the parts" (*Metaphysics* VIII, 1045a). The ensemble has emergent properties -- a sound, a result, a capability -- that no single member possesses.

**Known goods supporting it**:

1. *Diversity produces better outcomes than uniformity* -- this is the ensemble learning principle, empirically established across decades of ML research. It maps directly to the perspective clone pattern.

2. *Autonomous judgment within coordinated action* -- this is how musical ensembles work, and it maps directly to agents with ethos operating within shared doctrine.

3. *The whole exceeds the parts* -- Aristotle's organic whole, systems theory's emergent properties. An ensemble is more than the sum of its members.

4. *Multiple independent witnesses establish truth* -- Deuteronomy 19:15, Boyle's multiple trials principle. Ensemble methods are this principle in computational form.

**Potential concerns**:

- "Ensemble" in common English can mean simply "a group" or even "a matching outfit." The technical weight comes from the musical and ML domains, not from casual usage.
- The term does not inherently convey the *purpose* or *goal-directedness* of the composition. A musical ensemble performs; an ML ensemble predicts. What does an agent ensemble do? This may need to be established by the framework's usage rather than carried by the word itself.
- No significant political or ideological baggage. The term is neutral across contexts.

**Verdict**: Strongest candidate. Honors both natures simultaneously. Grounded in known goods from multiple domains.

### 7. Other Candidates Briefly Evaluated

**Collective**: Carries heavy political/ideological connotation (collectivism, collective farms, Marxist theory). The etymological meaning ("gathered together") is fine, but the baggage is too heavy. Rejected.

**Cadre**: From military/revolutionary terminology. Implies a vanguard or leadership nucleus, not a composed group of equals. Carries leftist political connotations. Does not map to the full structure. Rejected.

**Cohort**: Roman military unit (~480 soldiers). Modern meaning has drifted to "demographic group" (a cohort of students). Neither meaning captures the composed, goal-directed nature. Rejected.

**Corps**: From Latin *corpus* (body). Implies unified hierarchical organization under a single command. Too militaristic, too hierarchical, too permanent. Rejected.

**Troupe**: From theater. Implies artistic collaboration around a shared artistic vision. Captures the human side well but has no computer-side resonance. Also too narrow -- "troupe" sounds like a group of performers, not a composed system. Rejected.

**Cell**: From biology/revolutionary organizations. Implies autonomous units in a network with minimal coordination. Too decentralized -- agents in the system need structured coordination, not loose networking. Also carries connotations of clandestine or insurgent organization. Rejected.

**Assembly**: Split meaning (manufacturing line vs. political body) creates ambiguity. The manufacturing meaning implies linear, repetitive, minimal-autonomy work -- the opposite of conviction-driven agents. Rejected.

**Consortium**: Independent entities in voluntary coordination. Captures autonomy well but implies that members remain fundamentally separate with their own purposes. Agent archetypes in a composition share a purpose; they are not independent organizations cooperating on a side project. Rejected.

**Formation**: Military arrangement under a commander. Too hierarchical, too rigid, too militaristic. Rejected.

**Harmony**: Beautiful concept (integration of distinct elements into coherent wholes) but it names a *property* of the composition, not the composition itself. You would say "the ensemble achieves harmony," not "deploy a harmony." Rejected as a noun for the thing, but potentially valuable as a descriptor.

**Synthesis**: Names the *process* of combining, not the *entity* that results. "A synthesis of agents" describes what happened, not what exists. Rejected.

**Accord / Concord**: Name the *state of agreement*, not the composed entity. Also imply that agreement is the goal, which undervalues the productive disagreement that ensemble methods show is essential. Rejected.

**Cadence**: Names temporal rhythm, not the composed entity. Useful for describing execution patterns within a composition, not the composition itself. Rejected.

## Analysis: What the Right Term Must Do

Drawing from the research, the right term must satisfy these criteria:

| Criterion | Derived From | Pipeline | Ensemble |
|-----------|-------------|----------|----------|
| Honors human nature (conviction, judgment) | Aristotle's virtue ethics; the entire ethos domain | No | Yes -- musical ensembles have autonomous artistic judgment |
| Honors computer nature (typed I/O, determinism) | Function composition; typed interfaces | Yes -- but only linear | Yes -- ML ensembles produce deterministic combined outputs |
| Accommodates non-linear topology | Actual system has fan-out, feedback, quality gates | No -- linear by definition | Yes -- no topological constraint |
| Allows productive disagreement | Ensemble learning theory; cross-examination (Wigmore) | No -- stages don't disagree | Yes -- diversity is the mechanism |
| Implies a whole greater than parts | Aristotle *Metaphysics* VIII, 1045a; emergent properties | Weak -- a pipeline is its stages | Yes -- an ensemble has emergent properties |
| Neutral (no political/ideological baggage) | Pragmatic concern | Yes | Yes |
| Concise and natural in usage | Pragmatic concern | Yes | Yes |
| Compatible with existing framework language | Renkei's ethos/doctrine model | Partial | Yes |

## Recommendation

**Use "ensemble" as the term for a composed collection of agent archetypes working toward a shared goal.**

The term is grounded in known goods from three independent domains:

1. **Music**: Autonomous voices with individual judgment coordinating to produce a unified performance, with or without a conductor. The conductor (when present) is a mediator of shared vision, not a commander -- mapping to the orchestrator archetype.

2. **Machine learning**: Multiple models with diverse perspectives producing a combined output that exceeds any individual. Diversity is the mechanism, not a flaw. Maps to the best-of-N pattern and quality gates.

3. **Systems theory**: The ensemble is an organic whole (*Metaphysics* VIII, 1045a) with emergent properties. It is not a heap of parts but a composition with form.

The term naturally handles the dual nature:
- Agents as musicians: they have conviction, they interpret, they push back, they exercise judgment.
- Agents as functions: they have typed inputs and outputs, they compose, the combined output is deterministic.

### Usage in the Framework

- "An ensemble of archetypes" -- the composed group
- "The development ensemble" -- the specific composition for the development workflow
- "Ensemble position" -- where an archetype sits (replacing "pipeline position")
- "Ensemble topology" -- the graph structure (sequential, parallel, fan-out, feedback)
- "Sub-ensemble" -- a nested group within a larger ensemble (e.g., the test-writer and its perspective clones form a sub-ensemble within the development ensemble)

### What "Pipeline" Becomes

Pipeline does not disappear -- it becomes one possible *topology* within an ensemble. An ensemble with purely sequential flow is a pipeline. But the concept is broader: ensembles can also have parallel branches, feedback loops, quality gates, and best-of-N fan-outs. Pipeline describes the simplest case; ensemble describes the general concept.

### Relationship to "Renkei"

The project name itself supports this choice. Renkei (連携) means "cooperation, coordination, linkage" -- the act of working together with each element remaining distinct yet moving in concert. This is precisely what a musical ensemble does: distinct voices, coordinated action, emergent whole. The framework helps you build ensembles; the name describes what ensembles achieve.

## Sources

### Music and Performance
- Sydney Conservatorium, "On Conductors" (thinkmusic.sydney.edu.au, 2011)
- Wikipedia, "Conductorless orchestra"
- Vaia, "Ensemble Coordination Skills" (studysmarter.co.uk)
- PMC, "Group Flow in Musical Ensembles" (PMC6066987)

### Machine Learning
- Machine Learning Mastery, "Ensemble Diversity for Machine Learning"
- JMLR Vol. 24, "A Unified Theory of Ensemble Diversity" (2023)
- Oregon State, "An Introduction to Ensemble Methods" (web.engr.oregonstate.edu)
- Machine Learning Mastery, "Combine Predictions for Ensemble Learning"

### Military Doctrine
- U.S. Army FM 3-0, Operations
- Joint Publication 1, Doctrine for the Armed Forces
- TRADOC, "Task-Organizing" (odin.tradoc.army.mil)
- tdhj.org, "Combined Arms Warfare"
- House, "Combined Arms Warfare" (Army University Press)

### Organizational Theory
- Lunenburg, "Organizational Structure: Mintzberg's Framework" (IJSAID, 2012)
- PMI, "Matrix Organization Structure: Reason and Evolution" (1837)
- McChrystal Group, "Team of Teams / Empowered Execution"

### Systems Theory
- Systems Thinking Alliance, "General Systems Theory"
- Wikipedia, "Systems Theory"
- Simon, "The Architecture of Complexity" (1962)
- Koestler, holons and holarchies
- Beer, "Viable System Model" (1972)
- Ashby, "Law of Requisite Variety"

### Biology
- Wikipedia, "Superorganism," "Eusociality," "Microbial Consortium," "Holobiont"
- Britannica, "Multicellular Organism," "Social Insect"
- Discover Wildlife, "What Is a Superorganism"
- Carnegie Science, "What's a Holobiont?"

### Philosophy
- Aristotle, *Metaphysics* VIII, 1045a (Ross translation; MIT Internet Classics Archive)
- Stanford Encyclopedia of Philosophy, "Mereology"
- Stanford Encyclopedia of Philosophy, "Emergent Properties"
- sententiaeantiquae.com, "No, Aristotle Didn't Write 'A Whole is Greater Than the Sum of Its Parts'"

### Etymology
- etymonline.com: ensemble, corps, troupe, collectivism
- Merriam-Webster: consortium, concord, cohort, ensemble
- Wikipedia: Cohort (military unit), Corps, Cadre (military)

### Japanese Language and Culture
- nihongomaster.com, "Renkei" (連携)
- mailmate.jp, "Renkei" (Japanese business glossary)
- CEFIA, "RENKEI Control" (cefia-dp.go.jp)
- nihonium.io, "Hierarchy vs Consensus in Japan"
- Osaka Language Solutions, "Japanese Corporate Hierarchy" (2026)

### Functional Programming
- Wikipedia, "Function Composition (Computer Science)"
- Wikipedia, "Monad (Category Theory)," "Combinatory Logic"
- Hackage, "Control.Applicative"
- The Coder Cafe, "Functors, Applicatives, and Monads"
- programmingsimplicity.substack.com, "What UNIX Pipelines Got Right"
