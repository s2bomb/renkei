# Perspective D: Consistency Check

## Scope

Does fixing the three findings in `orchestration.md` create inconsistencies with other shaper doctrine files? For each file: what references the affected concepts, and does the fix require coordinated updates?

---

## 1. Cross-Reference Check

### "Intake" as a named concept

**orchestration.md line 108:** `Do not stop at intake-only chat.`

Appears nowhere else in any shaper file. The audit confirms: "The term 'intake' appears exactly once (line 108) and it refers to the tech-lead's behavior, not the shaper's." Removing this line creates zero inconsistencies.

### "Technical-preparation process" as a named traversable concept

**orchestration.md line 107:** `Continue through technical-preparation process to stage outcome.`

Other files use "technical preparation" but as a **stage name or handoff target**, never as a named internal process the shaper narrates through:

- **process.md line 93:** "Delegate technical preparation in the same execution pass." -- describes the shaper's action (delegate), not the delegate's internal trajectory.
- **process.md line 112:** "delegation target is `tech-lead` via `Task(subagent_type="general")`" -- runtime mechanics, not process narration.
- **process.md line 114:** "Do not run technical preparation directly" -- boundary rule, not traversal instruction.
- **pipeline.md line 6:** `tech-lead -> execution-lead -> execution` -- topology, not internal process description.
- **pipeline.md line 40:** "hand off to `tech-lead` for technical preparation orchestration" -- handoff target naming.
- **team-contract.md line 7:** "owns technical preparation after activation" -- role assignment.
- **output-contract.md line 81:** "`tech-lead` is responsible for downstream handoff to `execution-lead` after technical-preparation package synthesis." -- downstream description.

**Verdict:** The phrase "technical-preparation process" as a thing to "continue through" is unique to orchestration.md line 107. All other files reference "technical preparation" as a stage or handoff target. Removing the process-narration language in orchestration.md creates no conflict with any other file.

### "Return only when stage outcome is reached"

**orchestration.md line 111:** `Return only when stage outcome is reached:`

No other shaper file uses this phrasing or any equivalent "return only when..." conditional. The return contract lives solely inside the delegation prompt in orchestration.md. Tightening "Return only when stage outcome is reached:" to "Return:" affects only orchestration.md.

### `ready-for-execution` and `blocked` as return values

**orchestration.md lines 90, 112:** `ready-for-execution | blocked`

These values appear in exactly two places, both in orchestration.md:
- Line 90: "`tech-lead` owns the stage until it returns `ready-for-execution` or `blocked`."
- Line 112: "Technical-preparation outcome: `ready-for-execution` | `blocked`"

No other shaper file references these values. Specifically:
- **process.md** -- never mentions `ready-for-execution` or `blocked`. Step 8 describes handoff inputs (paths, artifacts, assumptions) but says nothing about what the tech-lead returns.
- **pipeline.md** -- never mentions these values. Describes topology and handoff preconditions, not return values.
- **team-contract.md** -- never mentions these values.
- **output-contract.md** -- never mentions these values. The "Downstream Contract" section (lines 77-87) describes what the shaper hands off, not what comes back.

**Verdict:** `ready-for-execution | blocked` are self-contained within orchestration.md's delegation prompt. They can be retained, removed, or reworded without touching any other file.

---

## 2. File-by-File Verdicts

### `doctrine/process.md` -- CONSISTENT

Process.md describes what the **shaper does** (Steps 1-9). The tech-lead delegation is referenced in Steps 7-8 as an action the shaper takes ("Delegate technical preparation", "hand off with..."), not as narration of the tech-lead's internal execution. The proposed fix to orchestration.md -- removing process narration and making the delegation contract-only -- aligns with how process.md already treats the delegation: as a handoff action with inputs, not an internal-process description.

Key lines that remain consistent:
- Line 93: "Delegate technical preparation in the same execution pass." (shaper action, not tech-lead narration)
- Line 114: "Do not run technical preparation directly and do not delegate `execution-lead` directly" (boundary rule, independent of the delegation prompt's wording)

**No changes needed.**

### `doctrine/pipeline.md` -- CONSISTENT

Pipeline.md describes topology: who connects to whom, what flows between them. It says:
- Line 40: "hand off to `tech-lead` for technical preparation orchestration"
- Line 41: "After technical-preparation package transfer, `tech-lead` hands off to `execution-lead`"
- Line 44: "After handoff to `tech-lead`, `shaper` stays out of downstream orchestration"

None of this describes the tech-lead's internal process or specifies return values. The proposed fix (making orchestration.md's delegation contract-only) is fully consistent with pipeline.md's topology-level description.

**No changes needed.**

### `doctrine/team-contract.md` -- CONSISTENT

Team-contract.md defines role boundaries and delegation triggers. Relevant lines:
- Line 7: "`tech-lead` -- owns feasibility and implementation-risk signal before activation; owns technical preparation after activation."
- Line 15: "`tech-lead` provides advisory feasibility signal at product stage and owns technical-preparation orchestration after activation."
- Line 17: "`shaper` does not delegate `execution-lead` directly for active items once `tech-lead` handoff is issued"
- Line 23: "Delegate to `tech-lead` after `active` transition scaffold and ledger requirements are satisfied."

All of these describe **who owns what** and **when delegation triggers**. None specify what the tech-lead returns, what its internal process looks like, or mention `ready-for-execution`/`blocked`. The proposed fix does not conflict with any of these boundary definitions.

**No changes needed.**

### `doctrine/output-contract.md` -- CONSISTENT

Output-contract.md defines what the **shaper** produces, not what comes back from delegates. The downstream contract section (lines 77-87) describes what the shaper hands off to the tech-lead:
- Line 79: "shaped artifact must be handoff-ready for `tech-lead` without additional reframing"
- Line 81: "`tech-lead` is responsible for downstream handoff to `execution-lead` after technical-preparation package synthesis"
- Lines 83-87: Required handoff payload (paths, artifacts, assumptions)

None of this references what the tech-lead delegation returns or how it executes internally. The completion report (lines 89-103) describes the shaper's terminal output, not the tech-lead's.

**No changes needed.**

---

## 3. Summary

| File | Verdict | Detail |
|---|---|---|
| `doctrine/orchestration.md` | **TARGET** | Contains all three findings. This is the only file that needs editing. |
| `doctrine/process.md` | **CONSISTENT** | References tech-lead delegation as a shaper action; does not narrate delegate internals or use affected language. |
| `doctrine/pipeline.md` | **CONSISTENT** | Topology-level description only. No return values, no process narration. |
| `doctrine/team-contract.md` | **CONSISTENT** | Role boundaries and triggers only. No overlap with affected concepts. |
| `doctrine/output-contract.md` | **CONSISTENT** | Shaper output specification. Does not reference delegate return values or internal process. |

**Bottom line:** The three anti-pattern findings are fully self-contained within orchestration.md's tech-lead delegation prompt (lines 90-117). No other shaper doctrine file references `intake`, `ready-for-execution`, `blocked`, "stage outcome," or narrates the tech-lead's internal execution path. The fix is a single-file change with no cross-file coordination required.
