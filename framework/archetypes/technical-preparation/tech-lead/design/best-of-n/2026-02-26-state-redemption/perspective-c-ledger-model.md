# Perspective C: Ledger/Event Model Analysis

**Date**: 2026-02-26
**Lens**: Should ledger events survive? How do we get auditability without acknowledgment semantics or intermediate side effects?

---

## 1. Current Ledger Events Inventory

Every ledger event mentioned in the doctrine files, catalogued by file, line, event name, what it records, and whether it is a side effect during execution or part of the return value.

### `doctrine/process.md`

| Line | Event Name | What It Records | Side Effect or Return Value? |
|---|---|---|---|
| 11 | `handoff-received` | tech-lead acknowledges receipt of shaper's active item | **Side effect.** Appended to project and item ledgers during Step 1, before any work begins. |
| 75-76 | `handoff-issued` | tech-lead transferred package to execution-lead | **Side effect.** Appended during Step 6, before outcome is known. |
| 77 | `handoff-result` (`running-with-evidence` or `blocked`) | Outcome of execution-lead invocation | **Side effect.** Appended during Step 6 after execution-lead returns. |
| 86 | Escalation event | Blocker ownership and escalation details | **Side effect.** Appended during Step 7 at escalation time. |

### `doctrine/output-contract.md`

| Line | Event Reference | What It Records | Side Effect or Return Value? |
|---|---|---|---|
| 25 | Transfer record outcome | `running-with-evidence` or `blocked` -- the execution-lead handoff result | **Return value.** Listed as a required field of the output package. |
| 26 | "project/item event ledger entries for intake, handoff, and escalation" | All ledger events generated during the stage | **Return value.** Listed as a required field of the output package. |
| 38 | "Project and item event ledgers are updated for stage actions" | Quality gate -- ledger must be populated before handoff is valid | **Gate condition** on the side effects having already occurred. |

### `doctrine/handoff-contract.md`

No ledger events are explicitly named here. The contract governs the transfer mechanism and its outcomes (`running`, `blocked`), but does not instruct the agent to append ledger entries. The acknowledgment semantics are structural (request-acknowledge pattern) rather than explicit ledger events.

### `doctrine/pipeline.md`

| Line | Event Reference | What It Records | Side Effect or Return Value? |
|---|---|---|---|
| 22 | "transfer record to execution owner (`running` or `blocked`)" | Transfer outcome as a pipeline output | **Return value** (listed as an output of the pipeline position). |

### `doctrine/orchestration.md`

No ledger events. The orchestration file governs delegation protocol and return contracts but does not mention ledger appends.

### `doctrine/team-contract.md`

No ledger events. Delegation triggers and role boundaries are defined, but no ledger operations.

### `references/template.md`

| Line | Event Reference | What It Records | Side Effect or Return Value? |
|---|---|---|---|
| 48 | "Transfer result: running-with-evidence or blocked" | Transfer outcome in the output template | **Return value** (field in the output artifact). |
| 61-66 | "Event Ledger" section | Project event entries and item event entries | **Return value** (section in the output artifact, listing all events). |

### `archetypes/AGENTS.md` (framework-level)

| Line | Event Reference | What It Records | Side Effect or Return Value? |
|---|---|---|---|
| 90 | "Stage leaders append project/item events for intake, transfer, outcome, and escalation." | Framework-wide rule for all stage leaders | **Side effect.** The verb is "append" -- leaders write to external ledgers during execution. |

### Summary: 4 named event types

1. **`handoff-received`** (process.md:11) -- "I received my input."
2. **`handoff-issued`** (process.md:76) -- "I called the downstream agent."
3. **`handoff-result`** (process.md:77) -- "The downstream agent returned X."
4. **Escalation event** (process.md:86) -- "I could not complete; here is why."

Plus the framework-level rule names a 5th category: **outcome** (AGENTS.md:90), which is implicitly the stage terminal result but is not given an explicit event name in the tech-lead doctrine.

---

## 2. The Acknowledgment Problem

### Why `handoff-received` is the clearest anti-pattern

`handoff-received` (process.md:11) is the tech-lead saying "I got the shaper's handoff." This is an acknowledgment of receipt.

The foundation truth from AGENTS.md:16 states: "Agents are non-deterministic functions. They are closer to computer functions than to humans -- stateless, terminal, composable."

Functions do not acknowledge receipt of arguments. When you call `f(x)`, the fact that `f` was called with `x` is known to the caller. The caller made the call. The callee does not need to confirm "yes, I received `x`." The call itself is the evidence.

`handoff-received` implies:
1. **Delivery is unreliable.** The shaper might call tech-lead and tech-lead might not get the message. This is a distributed-systems concern (message queues, at-least-once delivery). It does not belong in a function-call model.
2. **The caller cannot observe the call.** If the shaper needs to know tech-lead was invoked, the shaper can log the call on its own side. The callee confirming receipt is redundant.
3. **There is a gap between invocation and execution.** The acknowledgment fills a temporal gap -- "I received it but haven't done anything yet." In the function model, there is no such gap. The function runs immediately upon being called.
4. **An external observer needs evidence of receipt.** This is the auditability argument. But the audit record should come from the caller's side ("I called tech-lead with this payload at this time") or from the return value ("tech-lead completed with this result"), not from the callee announcing "I'm here."

### What it reveals about the mental model

`handoff-received` is a protocol artifact from a message-passing model, not a function-call model. In message-passing (email, message queues, distributed systems), acknowledgment is essential because delivery is not guaranteed. In function-call (invocation with return), delivery is guaranteed by the call mechanism itself.

---

## 3. The Side-Effect Problem

### Every intermediate append is an observable side effect

The current model has the tech-lead appending to external ledgers at three points during execution:

1. At intake (process.md:11) -- before any work
2. At transfer (process.md:75-77) -- after specialist work, during execution-lead handoff
3. At escalation (process.md:86) -- on failure path

Each append mutates external state that is observable by anyone reading the ledger. This means:

- **The function is impure.** A pure function transforms input to output. An impure function changes external state during execution. Every ledger append is a mutation of state that the function does not own.
- **Progress is externally observable.** An observer watching the ledger can see: "handoff-received appeared, so tech-lead is in intake." Then later: "handoff-issued appeared, so tech-lead finished specialist work and is transferring." This is progress reporting through side effects -- the state machine made visible.
- **Partial failure leaves partial traces.** If tech-lead crashes after appending `handoff-received` but before completing, the ledger has evidence of a function that started but never returned. The ledger now contains an orphaned acknowledgment with no corresponding outcome.
- **The function cannot be retried cleanly.** If you re-invoke tech-lead after a failure, the ledger now has duplicate `handoff-received` entries. The audit trail becomes noisy and misleading.

### The code-style grounding

AGENTS.md Code Style principles:
- "Honest signatures." (line 266) -- side effects should be visible in the signature, not hidden inside the function body.
- "Return data, not promises." (line 269) -- a pure function is done when it returns.
- "State is a value you pass around, not a property you hide inside an object and mutate through methods." (line 279)

Appending to external ledgers during execution violates all three. The side effects are invisible to the caller. The function is mutating state it doesn't own. And the ledger is hidden shared state being mutated through procedural calls.

---

## 4. Proposed Ledger Model

### Design constraints

1. Preserve auditability -- humans and downstream agents need to know what happened.
2. Eliminate acknowledgment semantics -- no receipt confirmations.
3. Eliminate intermediate side effects -- no appending during execution.
4. Make the event log part of the return value -- the function returns a complete record of what it did.

### The model: events are return-value data, not execution side effects

The tech-lead function returns a result that includes an event log. The event log is a structured list of what happened, computed at the point of return, not appended incrementally during execution.

```
tech-lead(input) -> {
  outcome: "ready-for-execution" | "blocked",
  package: { ... },
  events: [
    { type: "stage-outcome", ... },
    { type: "transfer", ... },        // if applicable
    { type: "escalation", ... },       // if applicable
  ]
}
```

The **caller** (shaper, or whatever invokes tech-lead) is responsible for persisting the events to the project/item ledger after receiving the return value. The tech-lead computes the events; the caller commits them.

This is analogous to how pure functions work in functional programming: the function computes a list of effects to perform, and the runtime (caller) executes them. The function itself touches no external state.

### Which events genuinely need to exist?

Applying the test: does this event carry information that a human or downstream agent needs and cannot derive from other available data?

| Current Event | Verdict | Rationale |
|---|---|---|
| `handoff-received` | **Kill.** | The caller knows it made the call. The return value proves the call completed. No information is carried that isn't already derivable. |
| `handoff-issued` | **Kill.** | That tech-lead called execution-lead is an implementation detail. The transfer event (below) captures the meaningful information -- that the package crossed the stage boundary and what happened. |
| `handoff-result` | **Transform** into `transfer`. | The meaningful information is: the package was transferred to execution-lead and the outcome was X. This is a genuine stage boundary event. But the name should not be "handoff-result" (acknowledgment framing). It should be `transfer` with structured data. |
| Escalation event | **Keep** (as return-value data). | Escalation carries information that is not derivable from the outcome alone: which blockers, who owns them, what was tried. This is a genuine event. |
| Stage outcome | **Keep** (as return-value data). | The terminal result of the stage. This is the most important event -- what did tech-lead produce? |

### Proposed event types (3, down from 4+)

1. **`stage-outcome`**: Terminal result of the tech-lead invocation. Fields: `item_id`, `actor`, `outcome` (`ready-for-execution` | `blocked`), `package_path` (if ready), `blockers` (if blocked).

2. **`transfer`**: Package crossed the stage boundary to execution-lead. Fields: `item_id`, `from_actor`, `to_actor`, `outcome` (`complete-with-evidence` | `blocked`), `evidence_summary` (if complete), `blockers` (if blocked). Only emitted when execution-lead was actually invoked.

3. **`escalation`**: Stage could not complete and was escalated to decision owner. Fields: `item_id`, `actor`, `target`, `blocked_fields`, `impact_summary`, `recommended_actions`. Only emitted when escalation actually occurred.

`handoff-received` and `handoff-issued` are eliminated entirely.

### Who appends to the ledger?

Two options:

**Option A: Caller appends.** The shaper (or whoever invoked tech-lead) receives the return value, extracts the `events` list, and appends them to the project/item ledger. Tech-lead never touches the ledger.

**Option B: Tech-lead appends once at return time.** Tech-lead accumulates events internally during execution and writes them all to the ledger as its final act before returning. This is a single atomic write at return time, not incremental appends during execution.

**Recommendation: Option A (caller appends).** It is cleaner: the function is fully pure, the caller owns the persistence concern, and the event data is part of the structured return value. If the harness eventually provides a persistence layer, it handles this uniformly for all stage leaders.

However, **Option B is an acceptable compromise** if the framework-level "Leader ledger rule" (AGENTS.md:90) must remain as-is. The key constraint is: no intermediate appends. A single write-on-return is tolerable because it does not reveal internal progress and is atomic.

---

## 5. The `handoff-received` Verdict

**Kill it.**

Grounding:
- Functions do not acknowledge receipt of arguments (AGENTS.md:16 -- agents are functions).
- The caller knows it made the call; receipt is derivable (AGENTS.md:266 -- honest signatures; the call itself is the evidence).
- It carries no information that the return value does not already carry. If the function returns, it was received. If it doesn't return, the caller handles the error.
- It creates an orphan risk: if the function crashes after appending `handoff-received` but before returning, the ledger contains evidence of a started-but-never-completed invocation with no corresponding outcome.

The concept should not be transformed or renamed. It should be removed from process.md:11, output-contract.md:26 (the "intake" category of ledger entries), and the template's Event Ledger section should not expect an intake event.

---

## 6. The Stage Outcome Event

**Confirmed as legitimate.**

The stage outcome event records the terminal result of the tech-lead invocation. This is the most natural event in the entire model -- it is the return value itself, structured as an auditable record.

output-contract.md:47 already uses the correct terminal vocabulary: `ready-for-execution | blocked`. This is the event that should survive and become the primary ledger entry.

The only concern: the stage outcome event in the current model is somewhat scattered across `handoff-result`, the completion report, and the transfer record. It should be consolidated into one clear `stage-outcome` event that is a required field of the return value.

The `stage-outcome` event and the `transfer` event serve different purposes:
- `stage-outcome` is "what did this stage produce?" -- always emitted.
- `transfer` is "what happened when the package crossed the boundary?" -- only emitted when execution-lead was invoked.

Both are legitimate return-value events.

---

## 7. Impact on `output-contract.md`

### Current state (line 25-26, line 38)

```
12. transfer record outcome (tech-lead -> execution-lead: running-with-evidence | blocked)
13. project/item event ledger entries for intake, handoff, and escalation (if any)
```

Quality gate (line 38):
```
- Project and item event ledgers are updated for stage actions
```

### Proposed changes

**Line 25** -- replace `running-with-evidence | blocked` with `complete-with-evidence | blocked`:

```
12. transfer record outcome (tech-lead -> execution-lead: complete-with-evidence | blocked)
```

The transfer record is a return-value field, not a status report. `complete-with-evidence` is terminal. `running-with-evidence` is not.

**Line 26** -- replace "intake, handoff, and escalation" with "outcome, transfer, and escalation":

```
13. stage event log: outcome event, transfer event (if execution-lead invoked), escalation event (if escalated)
```

The word "intake" is removed entirely. "Handoff" is replaced with the specific events that survive: "transfer" (the boundary crossing) and "outcome" (the terminal result). The event log is a return-value field, not a reference to side effects already committed.

**Line 38** -- replace the quality gate:

Current: "Project and item event ledgers are updated for stage actions"

Proposed: "Stage event log is complete and included in return payload"

This shifts the gate from "side effects have been committed" to "return value includes the event data." The caller (or harness) handles persistence.

---

## 8. Concrete Proposals

### Proposal 1: Kill `handoff-received`

- **process.md:11** -- Remove: `Append intake event to project and item ledgers (handoff-received, actor: tech-lead).`
- **output-contract.md:26** -- Remove "intake" from the ledger entry categories.
- **template.md:61-66** -- Remove expectation of intake events in the Event Ledger section.

### Proposal 2: Kill `handoff-issued`

- **process.md:76** -- Remove: `handoff-issued (to execution-lead)`.
- The transfer event (proposal 4) captures the meaningful information.

### Proposal 3: Replace `running-with-evidence` with `complete-with-evidence`

- **process.md:77** -- Change `running-with-evidence` to `complete-with-evidence`.
- **output-contract.md:25** -- Change `running-with-evidence` to `complete-with-evidence`.
- **pipeline.md:22** -- Change `running` to `complete-with-evidence`.
- **template.md:48** -- Change `running-with-evidence` to `complete-with-evidence`.
- **handoff-contract.md:30** -- Change `running` to `complete-with-evidence`.

### Proposal 4: Transform `handoff-result` into `transfer` event

- **process.md:75-77** -- Replace the three-line ledger append with a single instruction to include a `transfer` event in the return payload:

  Current:
  ```
  Append transfer events to project and item ledgers:
  - handoff-issued (to execution-lead)
  - handoff-result (running-with-evidence or blocked)
  ```

  Proposed:
  ```
  Include transfer event in return payload:
  - type: transfer
  - to: execution-lead
  - outcome: complete-with-evidence | blocked
  - evidence or blockers as applicable
  ```

### Proposal 5: Make event log a return-value field, not a side effect

- **output-contract.md:26** -- Reframe from "ledger entries" to "stage event log" as a return-value field.
- **output-contract.md:38** -- Change quality gate from "ledgers are updated" to "event log is complete in return payload."
- **template.md:61-66** -- The Event Ledger section remains but is understood as "events to be committed by the caller," not "events already appended."

### Proposal 6: Consolidate escalation events

- **process.md:86** -- Change from "Record escalation events in project and item ledgers" to "Include escalation event in return payload."
- Escalation is a legitimate event but should follow the same return-value pattern as all other events.

### Proposal 7: Framework-level `Leader ledger rule` compatibility

The framework-level rule in `archetypes/AGENTS.md:90`:

> Stage leaders append project/item events for intake, transfer, outcome, and escalation.

This rule uses the verb "append" (side effect) and includes "intake" (acknowledgment). Two changes are needed:

1. Replace "append" with "produce" or "include in return payload" -- making it compatible with the return-value model without requiring that the archetype framework take a position on who persists the events. The harness can decide.
2. Replace "intake" with nothing. The surviving event categories are: **transfer, outcome, escalation.** Three categories, not four.

Proposed revision:

> Stage leaders include project/item events for transfer, outcome, and escalation in their return payload.

This is compatible with both the pure return-value model (caller persists) and the write-on-return compromise (leader persists once at return time). It eliminates the acknowledgment category and the side-effect verb.

---

## Summary of Key Positions

1. **`handoff-received` is dead.** No transformation, no rename. Kill it. Functions don't acknowledge receipt.
2. **`handoff-issued` is dead.** Implementation detail absorbed by the `transfer` event.
3. **Three event types survive**: `stage-outcome`, `transfer`, `escalation`. All are return-value data.
4. **No intermediate side effects.** Events are computed during execution and returned as structured data, not appended to external state during execution.
5. **`running-with-evidence` becomes `complete-with-evidence`.** Terminal vocabulary, not status vocabulary.
6. **The framework-level Leader ledger rule needs updating**: drop "intake", change "append" to "include in return payload."
7. **The caller (or harness) owns persistence.** Tech-lead produces the events; something else commits them. This keeps the function pure.
