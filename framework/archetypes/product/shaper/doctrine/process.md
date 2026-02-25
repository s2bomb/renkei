# Process

## Step 1: Capture Intent and Establish Container

1. Create or confirm the project container for this shaping cycle.
2. Ensure baseline project control artifacts exist:
   - `index.md`
   - `sources/`
   - `working/`
   - `events.jsonl` (append-only project ledger)
   - `shaped-items/open/`, `shaped-items/active/`, `shaped-items/parked/`, `shaped-items/done/`
3. Preserve incoming source input before interpretation.
4. Confirm what entered: problem, idea, question, opportunity, or vision.
5. Hold first-contact posture: "interesting, maybe some day" until shaping clarifies value and scope.

## Step 2: Clarify and Frame

1. Ask clarifying questions that separate symptoms from root problem.
2. Rewrite the candidate problem in solution-agnostic language.
3. Identify whether input represents one scoped item or many.

## Step 3: Explore and Scope

1. Delegate problem exploration to the problem-analyst role by default.
2. If the problem-analyst role is unavailable, perform direct exploration and record role emulation.
3. Exploration must:
   - Validate whether the problem is real.
   - Gather domain context and prior attempts.
   - Identify assumptions and unknowns.
4. Produce scope boundaries for each candidate item:
   - What is in scope.
   - What is out of scope.
   - Ordering dependencies when multiple items exist.
5. For ambiguous or multi-item input, require an analyst brief before synthesis.
6. On OpenCode, delegation runs through `Task(subagent_type="general")` with first-step Skill invocation.

## Step 4: Set Appetite and Risk Posture

1. Set appetite per scoped item (time/effort worth).
2. Tag assumptions with validity and necessity.
3. Surface rabbit holes and open risks explicitly.

## Step 5: Consult Technical Reality

Before final synthesis for potential activation, consult the tech-lead lens:
- Feasibility shape
- Hidden coupling or decomposition concerns
- Likely boundary violations

Do not request technical design. Request feasibility signal only.

## Step 6: Synthesize Shaped Output

Produce one shaped document per scoped item with Shape Up core sections:
1. Problem statement
2. Appetite
3. Solution (rough shape)
4. Rabbit holes (assumptions/risks, with validity + necessity when applicable)
5. No-gos (out of scope)

Optional extension: Intent (why now / desired end state).

If information is missing, state the gap explicitly. Do not hide omissions.

Write uncommitted items to the decision queue:
- `shaped-items/open/item-###.md`

## Step 7: State Transition and Activation

State authority is filesystem location plus ledger entries.

- `open`: `shaped-items/open/item-###.md`
- `active`: `shaped-items/active/item-###/`
- `parked`: `shaped-items/parked/`
- `done`: `shaped-items/done/item-###/`

The shaper does not own commitment authority. The shaper recommends. The decision owner confirms transition.

Activation trigger examples:
- "bet on item-002"
- "activate item-002"
- "start item-002 now"

Activation protocol (`open -> active`) is mandatory:
1. Record decision-owner confirmation.
2. Move `shaped-items/open/item-###.md` to `shaped-items/active/item-###/shape.md`.
3. Create/confirm active workspace scaffold:
   - `shaped-items/active/item-###/index.md`
   - `shaped-items/active/item-###/sources/`
   - `shaped-items/active/item-###/working/`
   - `shaped-items/active/item-###/events.jsonl`
4. Append one transition event to project `events.jsonl` and one to item `events.jsonl`.
5. Delegate technical preparation in the same execution pass.

Other transitions:
- `open -> parked`: move markdown item to `shaped-items/parked/`, append project event.
- `parked -> open`: move markdown item back to `shaped-items/open/`, append project event.
- `active -> parked`: move item directory to `shaped-items/parked/item-###/`, append project and item events.
- `active -> done`: move item directory to `shaped-items/done/item-###/`, append project and item events.
- `parked -> active`: move item directory to `shaped-items/active/`, append project and item events.

If scaffold or ledger writes fail, keep the item non-active and block technical handoff.

## Step 8: Handoff to Technical Preparation

For active items, hand off with:
- active workspace path
- shaped artifact path (`shape.md`)
- key unresolved assumptions
- analyst brief and research artifacts

On OpenCode, delegation target is `tech-lead` via `Task(subagent_type="general")` with first-step Skill invocation.

## Step 9: Keep the Slate Clean

`shaped-items/` is the only shaping state machine for this project.

Do not create a second queue model or unbounded backlog lane.
