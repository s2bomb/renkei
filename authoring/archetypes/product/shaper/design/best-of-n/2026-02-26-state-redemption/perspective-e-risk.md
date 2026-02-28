# Perspective E: Risk and Regression

What could go wrong with removing the safeguard language? Is the cure worse than the disease?

---

## 1. The Original Intent

Someone watched a tech-lead agent get invoked and come back with something like "I've received the shaped artifacts. What would you like me to focus on first?" -- an acknowledgment, not a result. This is a real, observed, frequent LLM agent failure mode. The original author wrote "Do not stop at intake-only chat" and "Continue through technical-preparation process to stage outcome" because they saw this happen and needed it to stop happening *now*.

This was a patch, not a design. It was correct as triage. The question is whether removing it leaves the wound unprotected.

## 2. The Failure Mode Without the Guardrail

LLM agents exhibit a strong default toward conversational turn-taking. When invoked via `Task()`, a delegate agent can:

1. Acknowledge the input ("I see you've provided shaped artifacts for X...")
2. Ask clarifying questions ("Should I prioritize the API design or the test specs?")
3. Describe what it *will* do without doing it ("I'll now proceed to run technical preparation...")
4. Do partial work and return a progress summary rather than a terminal outcome

All four are real failure modes. They are especially likely when:
- The delegation prompt is long and complex (the shaper's tech-lead prompt is 22 lines)
- The delegate has its own skill file with a multi-step process
- The runtime doesn't enforce typed return values (current OpenCode runtime does not)

Deleting lines 107-108 removes the only explicit instruction that says "don't do the conversational thing." The return contract (lines 111-115) says what to return but does not say "actually execute the work." A pedantic LLM could satisfy the return contract format while returning fabricated values without having done the work. This is not hypothetical -- it is a documented failure mode of LLM agents given complex multi-step delegation prompts.

## 3. The Function Model's Answer

The function model provides three mechanisms:

**Return contract (lines 111-115).** The delegate must return `ready-for-execution | blocked` plus artifact paths or blockers. This constrains the *shape* of the output. It does not force the agent to actually execute the work that produces valid values for those fields.

**Retry rule (lines 125-128).** If the return misses contract fields, re-delegate with explicit defects. Two retries max, then escalate. This catches returns that are structurally incomplete. It does *not* catch returns that are structurally correct but substantively empty (e.g., `blocked` with a fabricated blocker to avoid doing work).

**"Prevent, don't detect" (AGENTS.md line 267).** Make invalid states unrepresentable. This is the strongest mechanism -- but it requires a runtime that can enforce typed terminal values. The current runtime (OpenCode `Task()` with string prompts) cannot enforce this. The return contract is a gentleman's agreement, not a type system.

**Honest assessment:** The return contract alone does not prevent the failure mode. It prevents the wrong *shape* of output. It does not prevent the wrong *substance*. The retry rule catches missing fields but not fabricated ones. "Prevent, don't detect" is the correct principle but requires runtime enforcement that does not yet exist.

## 4. The Leader Invocation Rule

From `archetypes/AGENTS.md` (lines 84-87):

> Leader invocation rule:
> - Invocation triggers immediate stage execution.
> - No waiting/conversational intake state.
> - Leader returns only terminal stage outcome (`ready/complete` or `blocked/escalated`).

This rule covers the *exact* intent of the removed guardrails:

- "Do not stop at intake-only chat" = "No waiting/conversational intake state"
- "Continue through technical-preparation process to stage outcome" = "Invocation triggers immediate stage execution" + "Leader returns only terminal stage outcome"

The coverage is complete. The leader invocation rule says everything the guardrail lines say, but in function-model terms rather than state-avoidance terms.

**However** -- this rule lives in `archetypes/AGENTS.md` (the design layer guide), not in the tech-lead's own skill file. When the shaper delegates to tech-lead, the tech-lead's behavior is governed by its own SKILL.md, not by `archetypes/AGENTS.md`. The leader invocation rule is a design constraint for archetype authors; it is not an instruction the tech-lead agent receives at runtime.

This means the guardrail's protection depends on the tech-lead's own archetype correctly implementing the leader invocation rule. If the tech-lead's SKILL.md already says "invocation triggers immediate execution, return only terminal outcome," then the shaper's guardrail is truly redundant. If it does not, removing the guardrail leaves a gap.

## 5. Risk Assessment

### Removing "Do not stop at intake-only chat" -- **LOW**

The leader invocation rule already codifies this constraint at the archetype design level. The tech-lead's own archetype should (and likely does) implement "no conversational intake." The line is redundant *if* the tech-lead archetype is well-constructed.

The residual risk is that the tech-lead archetype is poorly constructed. But protecting against that here is the wrong layer -- it is duct-taping the caller to compensate for a broken callee. The fix belongs in the tech-lead archetype, not in the shaper's delegation prompt.

**Risk: LOW.** No mitigation needed beyond verifying the tech-lead archetype implements the leader invocation rule.

### Removing "Continue through technical-preparation process to stage outcome" -- **LOW-MEDIUM**

This line does two things: (1) instructs the delegate to complete its work, and (2) narrates the delegate's internal process name. Removing it eliminates the anti-pattern (narrating the delegate's internals). But it also removes the only explicit "do the work" instruction.

The return contract implicitly says "do the work" by specifying what the return must contain. A well-constructed tech-lead agent will do the work because its own archetype tells it to. But "implicitly" is the risk word. LLM agents respond to explicit instruction more reliably than implicit inference.

**Risk: LOW-MEDIUM.** Mitigation (non-stateful): The delegation prompt's line 109 already says "Delegate required members (...) and synthesize package." This is an explicit work instruction that survives the removal. Alternatively, a single line like "Produce the technical-preparation package" (what, not how) would make the work expectation explicit without narrating the delegate's internal process. This is not reintroducing stateful language -- it is specifying the deliverable.

### Changing "Return only when stage outcome is reached:" to "Return:" -- **LOW**

The word "only" and the phrase "when stage outcome is reached" are the stateful parts. They imply there is a temptation to return early that must be overridden. Under the function model, a function returns when it returns. The qualification is noise.

The return enum (`ready-for-execution | blocked`) already communicates that these are terminal values. Adding "only when stage outcome is reached" does not make the contract stricter -- it makes the reader wonder what other return points exist.

**Risk: LOW.** No mitigation needed.

## 6. Net Assessment

The system is **better off without these guardrails**, with one caveat.

**The case for removal:**
- The lines legitimize "intake" as a named intermediate state (anti-pattern #6).
- They narrate the delegate's internal process, violating the function model's encapsulation.
- They are instructions (nomos), not conviction (ethos). The framework's foundation says conviction drives behavior more reliably than instruction.
- The leader invocation rule already covers their intent at the design level.
- The return contract already constrains the output shape.
- The retry rule already catches structurally incomplete returns.

**The case for caution:**
- The current runtime has no typed return enforcement. The return contract is a string in a prompt, not a type signature. LLM agents can satisfy string-described contracts superficially.
- The tech-lead archetype's own implementation of the leader invocation rule has not been verified as part of this audit.
- LLM agents are non-deterministic. Removing a redundant instruction that says "actually do the work" increases the variance of outcomes, even if the expected outcome is unchanged.

**The caveat:** Before deploying this change, verify that the tech-lead's own SKILL.md implements the leader invocation rule (immediate execution, terminal return only). If it does, the removal is safe. If it does not, fix the tech-lead archetype first, then remove the shaper guardrails.

**Net:** Remove the lines. The anti-pattern harm (legitimizing intermediate states, violating encapsulation, instruction over conviction) outweighs the regression risk. The existing mechanisms (return contract, retry rule, leader invocation rule) provide adequate coverage. The one gap (runtime type enforcement) is a harness concern, not an archetype concern -- and cannot be solved by adding instructions to a delegation prompt.
