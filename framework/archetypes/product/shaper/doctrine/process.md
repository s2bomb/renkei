# Process

## Step 1: Capture Intent and Establish Container

1. Ensure the project folder exists (`thoughts/projects/YYYY-MM-DD-name/`).
2. Preserve incoming input in `sources/` before interpretation.
3. Confirm what entered: problem, idea, question, opportunity, or vision.
4. Hold first-contact posture: "interesting, maybe some day" until shaping clarifies value and scope.

## Step 2: Clarify and Frame

1. Ask clarifying questions that separate symptoms from root problem.
2. Rewrite the candidate problem in solution-agnostic language.
3. Identify whether input represents one scoped item or many.

## Step 3: Explore and Scope

1. Delegate or perform problem exploration:
   - Validate whether the problem is real.
   - Gather domain context and prior attempts.
   - Identify assumptions and unknowns.
   - When delegating, use `general` subagents and require first-step role-skill invocation.
2. Produce scope boundaries for each candidate item:
   - What is in scope.
   - What is out of scope.
   - Ordering dependencies when multiple items exist.

## Step 4: Set Appetite and Risk Posture

1. Set appetite per scoped item (time/effort worth).
2. Tag assumptions with validity and necessity.
3. Surface rabbit holes and open risks explicitly.

## Step 5: Consult Technical Reality

Before final synthesis for active handoff, consult the tech-lead lens:
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

## Step 7: Decide Item State and Handoff

For each shaped item, set explicit state:
- `active`: approved for immediate technical-preparation handoff
- `parked`: qualified but not proceeding now

The shaper does not own the final commitment authority. The shaper prepares and recommends.

Default flow:
- Provide shaped artifact(s) to the decision owner (human/CEO) with recommendation.
- Decision owner confirms `active` or `parked`.

Directive flow:
- If explicit executive direction already commits the work, mark item `active` and proceed.

For active items, hand off with:
- shaped document path
- key unresolved assumptions
- research artifacts produced during shaping

## Step 8: Keep the Slate Clean

Do not create a central backlog from uncommitted shaped ideas. Keep only intentionally revived items and current-cycle candidates visible to decision makers.
