# Perspective C: Delegation Prompt Design

## 1. Anatomy of a Clean Delegation Prompt

A delegation prompt is a function call site. It has the same parts as any call site: the function to invoke, the arguments, and the expected return type.

### Must contain

1. **Skill invocation instruction.** Runtime boilerplate -- tells the harness which function to load. This is the `call` instruction, not domain content.

2. **Input parameters.** What the delegate receives. Artifact paths, context data, constraints. These are the function arguments. They must be concrete values, not descriptions of how the caller arrived at them.

3. **Return contract.** What the delegate must return. Typed, terminal, enumerated. This is the function's return type. The caller uses the return value to branch its own control flow.

### Must NOT contain

1. **Process narration.** "Continue through X process to Y outcome" describes the callee's implementation. A call site does not narrate the function body. `sort(array)` does not say "iterate through the array comparing adjacent elements."

2. **Phase names.** "Do not stop at intake-only chat" names an internal checkpoint of the callee. If the caller knows the callee's phase names, the caller is coupled to the callee's implementation. Changing the callee's phases requires editing the caller.

3. **Behavioral guardrails that belong in the delegate's own archetype.** "Delegate required members (spec-writer, research-codebase, ...)" is the tech-lead's orchestration doctrine, not the shaper's business. The tech-lead's own archetype governs which members it delegates to.

4. **Negated instructions.** "Do not stop at X" implies X is a valid state that must be overridden. Under the function model, the only valid return is the contracted one. There is nothing to negate.

## 2. Why Process Narration in Delegation Prompts Is Harmful

The foundation states: "Agents are non-deterministic functions -- stateless, terminal, composable" (AGENTS.md, line 16). The code style demands "Honest signatures" -- "what goes in, what comes out" (AGENTS.md, line 266).

The leader invocation rule (archetypes/AGENTS.md, lines 84-87) codifies this for leaders specifically: "Invocation triggers immediate stage execution. No waiting/conversational intake state. Leader returns only terminal stage outcome."

When a caller narrates the callee's internal process, three things break:

**Encapsulation violation.** Lines 106-109 of orchestration.md say: "Continue through technical-preparation process to stage outcome. Do not stop at intake-only chat. Delegate required members (spec-writer, research-codebase, api-designer, test-designer, create-plan) and synthesize package." The shaper now knows the tech-lead's internal phase names ("intake"), its member roster, and its execution trajectory. The shaper has reached inside the tech-lead's function body.

**Coupling.** If the tech-lead archetype renames its process, adds a member, or restructures its phases, the shaper's delegation prompt must also change. Two archetypes on two different teams are now coupled through implementation details embedded in a call site. This is the archetype equivalent of importing a module's private functions.

**Legitimized intermediate states.** "Do not stop at intake-only chat" treats "intake-only chat" as an observable, stoppable state. Under the function model, there are no observable intermediate states. The function either returns its contracted result or it fails. Naming an intermediate state in the call site converts an implementation detail into an interface concept.

Compare to the code style principle: "Return data, not promises. A pure function is done when it returns" (AGENTS.md, line 269). A delegation prompt that names intermediate states is writing the callee's promise chain into the call site.

## 3. The Clean Version

Replacement for lines 92-117 of orchestration.md:

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'tech-lead' and args: '[active shaped artifact path(s)]'.

DO NOT start planning or coding before Skill invocation.

Input:
- Active shaped artifact(s) at: [paths]
- Decision owner has confirmed these items as active.
- Shaped artifacts are ground truth for product intent and boundaries.

Return:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary
4. If `blocked`: blockers requiring shaper or decision-owner clarification
"""
)
```

What changed:
- Removed "Execution requirement" block entirely (lines 106-109). No process narration, no phase names, no member roster.
- Changed "Return only when stage outcome is reached:" to "Return:". The qualification implied early return was possible; the contract already makes this unnecessary.
- Removed "from `execution-lead`" on the execution kickoff line. How the tech-lead produces its evidence is its own business.
- Renamed "Context:" to "Input:" -- it is function input, not narrative context.

## 4. Comparison: Problem-Analyst vs Tech-Lead Delegation

The problem-analyst delegation (lines 36-53) is cleaner than the tech-lead delegation. Here's why:

**Problem-analyst prompt (lines 36-53):**
- Skill invocation instruction: present, clean.
- Input parameters: not inline (specified separately at lines 56-59), but the prompt itself is contract-only.
- Return contract: lines 47-51 list exactly what comes back. Five items, all terminal, all data.
- Process narration: absent. The prompt does not say "continue through problem-analysis process" or "do not stop at initial assessment."
- Phase names: absent. No callee internals referenced.

**Tech-lead prompt (lines 92-117):**
- Skill invocation instruction: present, clean.
- Input parameters: present (lines 102-104).
- Return contract: present (lines 111-115) but gated with "Return only when stage outcome is reached" -- a qualifier that implies the alternative exists.
- Process narration: present. "Continue through technical-preparation process to stage outcome" (line 107).
- Phase names: present. "Do not stop at intake-only chat" (line 108).
- Callee internals: present. Member roster listed (line 109).

The problem-analyst prompt treats the delegate as a function: here's what you get, here's what I need back. The tech-lead prompt treats the delegate as a process to steer: continue through this, don't stop there, delegate these members.

**Lesson:** The problem-analyst delegation was likely written first or written in a single authoring pass. The tech-lead delegation accumulated behavioral patches -- the "do not stop at intake" line reads as a fix for observed behavior where the tech-lead returned too early. The fix was applied at the call site instead of in the tech-lead's own archetype (where the leader invocation rule already prohibits it). Call-site patches for callee behavior are a maintenance trap.

## 5. Design Principle

**A delegation prompt is a call site, not a function body. Specify input and return type. Never narrate the callee's execution.**

Grounding: "Agents are non-deterministic functions -- stateless, terminal, composable" (AGENTS.md). "Honest signatures... what goes in, what comes out" (AGENTS.md). "Leader returns only terminal stage outcome" (archetypes/AGENTS.md).

Therefore: a delegation prompt contains exactly what a call site contains -- the function name (skill invocation), arguments (input), and expected return type (return contract). Everything else is implementation detail that belongs in the callee's archetype, not in the caller's prompt.
