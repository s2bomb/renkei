# Vision

Renkei is a full-suite system for building, driving, and operating agentic teams. It spans from defining who agents are, to running them, to letting them act in the world.

## The Problem

Agent systems today are driven by flat instruction lists -- pure doctrine with no grounding. At the individual level, this produces agents that break rules, hallucinate under pressure, and cannot reason through novel tensions. At the system level, there is no team structure, no cross-team communication, and no way for a human to interact with nested agents mid-execution. The human launches a top-level agent, waits, and hopes.

## The Thesis

Agents are non-deterministic functions. They are closer to computer functions than to humans -- stateless, terminal, composable -- but their non-determinism means pure instruction is insufficient. The structures that make humans reliable (conviction grounded in truth, identity that resists drift) activate equivalent patterns in agents trained on human output. Ethos backed by truth narrows the output distribution toward determinism without making it rigid.

Teams are the composition primitive. Two or more agents gathered, with a leader who deployed them, is a team. Teams compose into teams. Enough teams compose into an organization. The same primitive at every scale.

Therefore: define agents through truth-grounded conviction (archetypes), compose them into teams with structured communication, and give humans operational control at every level. This is Renkei.

## The Three Layers

```
┌─────────────────────────────────────────────────────┐
│                 Renkei (the system)                  │
├─────────────────────────────────────────────────────┤
│  Layer 1: Archetype Framework                       │
│    Truth → Ethos → Doctrine authoring               │
│    Assembly, deployment to harness-native formats    │
│    Derivation method (the "compiler")               │
│    GUI for authoring and auditing archetypes         │
├─────────────────────────────────────────────────────┤
│  Layer 2: Harness (fork of OpenCode)                │
│    Agent execution runtime                          │
│    Teams as core primitive                          │
│    Communication: in-person + email protocols       │
│    CLI + GUI + SDK + Server                         │
├─────────────────────────────────────────────────────┤
│  Layer 3: Tools & Integrations                      │
│    Human-compatible interfaces (email, Slack, etc.) │
│    Server deployment and orchestration              │
│    Observation capture and session replay            │
└─────────────────────────────────────────────────────┘
```

**Layer 1** defines WHO agents are. The archetype framework -- truth, ethos, doctrine -- produces agent definitions grounded in domain truths and driven by conviction. This is the authoring layer.

**Layer 2** embodies agents and lets them act. The harness (forked from OpenCode) executes archetypes as live agents, composes them into teams, manages communication, and gives humans operational control. This is the runtime layer.

**Layer 3** connects agents to the world humans already use. Email, Slack, Discord, databases, file systems -- not invented tools, but the tools that already exist. This is the integration layer.

## Teams

A team is the core composition primitive. It emerges from deployment, not declaration.

### Definition

- An agent that deploys other agents is a **leader**. The deployed agents are **members**.
- Two or more agents gathered under a leader is a **team**.
- A member that deploys its own members becomes a leader of a nested team.
- Teams compose recursively. A team of teams is an organization.

```
Team {
  leader: Agent       // archetype-driven, deployed by parent
  members: Agent[]    // deployed by leader
  sub_teams: Team[]   // members who are themselves leaders
}
```

### Communication

Two modes, modeled on how humans communicate:

**In-person** (synchronous, direct message injection into thread):
- All members of the same team can communicate in-person with each other.
- Only within the same team. No cross-team in-person communication.
- This is how members coordinate on shared work.

**Email** (asynchronous, store-and-forward protocol):
- Only leaders can have email.
- Non-leaders cannot have email.
- Cross-team communication goes through leaders only: leader → parent, leader → leader via email.
- The email protocol is shaped like real email (SMTP-like addressing, threading, delivery status). Internal-first, but designed so it can bridge to real email systems when the time comes.

### Why This Matters

This model gives humans something no current harness provides: **operational control of nested agents mid-execution**. Today, you launch a top-level agent and watch. You cannot communicate with sub-agents. You cannot pause a team, evaluate their work, and decide whether to continue or redirect. You cannot close one team while others keep running.

With teams:
- A human communicates with any team leader (in-person or email).
- A human can pause, evaluate, and redirect any team.
- Other teams keep running while one team is being redirected.
- As the human learns to orchestrate teams (like a CEO learning to run an organization), the system scales.

## Key Differentiators

1. **Archetype-driven agents.** Truth → Ethos → Doctrine. Agents with conviction, not just instructions. Runtime reasoning from first principles when tensions arise.
2. **Teams as composition primitive.** Recursive, procedural (not inheritance). Same structure from one team to an organization.
3. **Structured communication.** In-person within teams, email across teams. No hidden channels, no global broadcast.
4. **Human-to-subagent communication.** The human is not locked out while agents work. Observe, communicate, redirect at any level.
5. **Human-compatible tooling.** Agents use the tools humans already use. We don't invent tools -- we integrate with email, Slack, Discord, databases, file systems.

## Scale Path

```
1 agent          → you use it like OpenCode today
1 team           → leader delegates to members, you talk to the leader
multiple teams   → leaders coordinate via email, you oversee team leaders
teams of teams   → organizational structure, you operate at the executive level
```

Personal use: a Mac Mini running teams that manage your life and projects.
Developer use: teams that handle research, design, implementation, testing -- the existing development pipeline.
Enterprise use: organizational structures where teams of agents handle departments of work, coordinated through the same primitives.

## Grounding

These theories and observations support the design:

- **Conviction drives determinism.** `thoughts/research/09-agents-as-non-deterministic-functions.md` -- ethos narrows the output distribution of non-deterministic functions.
- **Self-healing under tension.** `thoughts/observations/open/truth-backed-self-healing-under-doctrine-tension.md` -- truth-backed agents propagate tensions coherently rather than breaking.
- **Teams mirror human organization.** `thoughts/ideas/open/teams.md` -- every durable human organization (business, military, religious, civic) uses nested teams with leaders and structured communication.
- **Communication follows email semantics.** `thoughts/ideas/open/communication-systems.md` -- async agent communication maps to SMTP patterns (addressing, threading, delivery status, priority).

## Current State

| Layer | Status |
|---|---|
| Archetype Framework | Working. Assembly script, 2 archetypes (test-designer, test-implementer) built and deployed. |
| Harness | Primitives implemented in OpenCode fork (`teams`, `send_message`, `teams_status`, `standby`, `stop_teammate`). Not daily-drivable yet. |
| Tools & Integrations | Not started. |

## The Constraint

The harness is what blocks everything. Without a daily-drivable harness:
- Archetypes cannot be tested in real team dynamics.
- Observations cannot be captured from real sessions.
- The teams model cannot be validated.
- The conviction benchmark cannot collect fixtures.

The first milestone is: **daily-drivable harness** -- works as well as plain OpenCode, plus teams primitive, plus archetype loading, plus session capture.
