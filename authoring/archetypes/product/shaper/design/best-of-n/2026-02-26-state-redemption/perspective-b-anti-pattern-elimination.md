# Perspective B: Anti-Pattern Elimination

Lens: What specific text should be removed or replaced, line by line? Minimal surgery -- the smallest change that eliminates all anti-patterns.

---

## 1. Line-by-Line Audit (Lines 84-117)

### Context lines (84-91) -- DO NOT MODIFY

| Line | Text | Verdict | Reason |
|---|---|---|---|
| 84 | `### Technical preparation delegation (post-decision)` | KEEP | Section heading. Clean. |
| 85 | *(blank)* | KEEP | Formatting. |
| 86 | `When a shaped item is confirmed \`active\` by the decision owner, delegate technical-preparation ownership to \`tech-lead\`.` | KEEP | Describes the trigger condition. Contract language, no anti-pattern. |
| 87 | *(blank)* | KEEP | Formatting. |
| 88 | `This delegation is mandatory and immediate. Activation is incomplete until delegation is issued.` | KEEP | Constraint on the shaper's own behavior. Clean. |
| 89 | *(blank)* | KEEP | Formatting. |
| 90 | `After handoff, \`shaper\` does not run technical preparation or delegate \`execution-lead\` directly for that item. \`tech-lead\` owns the stage until it returns \`ready-for-execution\` or \`blocked\`.` | KEEP | Ownership boundary + terminal return values. The return values here are used as a function contract (what the delegate returns), not as status reports. Clean. |
| 91 | *(blank)* | KEEP | Formatting. |

### Delegation prompt (92-117) -- SURGICAL ZONE

| Line | Text | Verdict | Reason |
|---|---|---|---|
| 92 | ` ```python` | KEEP | Code fence. |
| 93 | `Task(` | KEEP | Call syntax. |
| 94 | `  subagent_type="general",` | KEEP | Runtime parameter. |
| 95 | `  prompt="""` | KEEP | Prompt opening. |
| 96 | `STOP. READ THIS BEFORE DOING ANYTHING.` | KEEP | Attention anchor. Not stateful. |
| 97 | *(blank)* | KEEP | Formatting. |
| 98 | `Your FIRST action MUST be to call the Skill tool with skill: 'tech-lead' and args: '[active shaped artifact path(s)]'.` | KEEP | Invocation instruction. Clean. |
| 99 | *(blank)* | KEEP | Formatting. |
| 100 | `DO NOT start planning or coding before Skill invocation.` | KEEP | Guard rail for invocation order. Clean. |
| 101 | *(blank)* | KEEP | Formatting. |
| 102 | `Context:` | KEEP | Section label. |
| 103 | `- Decision owner confirmed these items as active.` | KEEP | Input context. Clean. |
| 104 | `- Shaped artifacts are the ground truth for product intent and boundaries.` | KEEP | Input context. Clean. |
| 105 | *(blank)* | KEEP | Formatting. |
| 106 | `Execution requirement:` | KEEP | Section label. Clean on its own. |
| 107 | `- Continue through technical-preparation process to stage outcome.` | **REPLACE** | **Finding 2.** Narrates the delegate's internal process trajectory. The shaper should not describe how the delegate traverses its internals. |
| 108 | `- Do not stop at intake-only chat.` | **REMOVE** | **Finding 1.** Treats "intake" as a named, stoppable intermediate state. Redundant if the return contract is terminal. Harmful because it legitimizes "intake" as a state. |
| 109 | `- Delegate required members (\`spec-writer\`, \`research-codebase\`, \`api-designer\`, \`test-designer\`, \`create-plan\`) and synthesize package.` | KEEP | Tells the delegate what to produce and who to use. This is contract language (produce a package, use these members). Not process narration -- it says *what*, not *when* or *in what order*. |
| 110 | *(blank)* | KEEP | Formatting. |
| 111 | `Return only when stage outcome is reached:` | **REPLACE** | **Finding 3.** "Only when stage outcome is reached" implies the delegate might return before a terminal outcome, which shouldn't be a possibility. Simplify to just "Return:". |
| 112 | `1. Technical-preparation outcome: \`ready-for-execution\` \| \`blocked\`` | KEEP | Terminal return enum. Clean. |
| 113 | `2. Technical package artifact path(s)` | KEEP | Return data. Clean. |
| 114 | `3. If \`ready-for-execution\`: execution kickoff evidence summary from \`execution-lead\`` | KEEP | Conditional return data. Clean. |
| 115 | `4. If \`blocked\`: blockers requiring shaper or decision-owner clarification` | KEEP | Conditional return data. Clean. |
| 116 | `"""` | KEEP | Prompt closing. |
| 117 | `)` | KEEP | Call closing. |

---

## 2. Minimal Surgery Principle

Three lines change. Everything else stays.

**Why line 107 is REPLACE, not REMOVE:** Removing it entirely leaves line 106 (`Execution requirement:`) with only one bullet (line 109). The replacement preserves the section's purpose -- telling the delegate what outcome to produce -- without narrating the delegate's internal trajectory.

**Why line 108 is REMOVE, not REPLACE:** There is nothing to replace it with. The concept it expresses ("don't stop at intake") is fully covered by the terminal return contract on lines 112-115. Any replacement would either repeat the return contract or introduce new language that isn't needed.

**Why line 111 is REPLACE, not REMOVE:** The line serves a structural purpose (introduces the return value list). Only the qualifying phrase needs to go.

---

## 3. The Three Findings -- Specific Actions

### Finding 1 (line 108): `- Do not stop at intake-only chat.`

**Action: REMOVE the entire line.**

Grounding: AGENTS.md line 16 -- agents are "stateless, terminal, composable." There is no "intake" state to stop at. The return contract (lines 112-115) already specifies the only valid terminal outcomes. Telling a function "don't return from your parameter validation step" is nonsensical if the return type is well-specified.

### Finding 2 (lines 106-107): `- Continue through technical-preparation process to stage outcome.`

**Action: REPLACE line 107 with `- Produce technical-preparation package.`**

Grounding: AGENTS.md line 269 -- "Return data, not promises." The shaper should specify *what* it wants back (a package), not *how* the delegate should traverse its own process. "Continue through X to Y" is trajectory narration. "Produce X" is a return contract.

### Finding 3 (line 111): `Return only when stage outcome is reached:`

**Action: REPLACE with `Return:`**

Grounding: AGENTS.md line 16 -- functions are terminal. A terminal function returns once. "Only when X is reached" implies there are intermediate return points to guard against. There aren't. A function either returns its result or fails.

---

## 4. Before/After

### BEFORE (lines 92-117)

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'tech-lead' and args: '[active shaped artifact path(s)]'.

DO NOT start planning or coding before Skill invocation.

Context:
- Decision owner confirmed these items as active.
- Shaped artifacts are the ground truth for product intent and boundaries.

Execution requirement:
- Continue through technical-preparation process to stage outcome.
- Do not stop at intake-only chat.
- Delegate required members (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`) and synthesize package.

Return only when stage outcome is reached:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary from `execution-lead`
4. If `blocked`: blockers requiring shaper or decision-owner clarification
"""
)
```

### AFTER (lines 92-116, one line shorter)

```python
Task(
  subagent_type="general",
  prompt="""
STOP. READ THIS BEFORE DOING ANYTHING.

Your FIRST action MUST be to call the Skill tool with skill: 'tech-lead' and args: '[active shaped artifact path(s)]'.

DO NOT start planning or coding before Skill invocation.

Context:
- Decision owner confirmed these items as active.
- Shaped artifacts are the ground truth for product intent and boundaries.

Execution requirement:
- Produce technical-preparation package.
- Delegate required members (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`) and synthesize package.

Return:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary from `execution-lead`
4. If `blocked`: blockers requiring shaper or decision-owner clarification
"""
)
```

### Diff summary

```
- Line 107: "Continue through technical-preparation process to stage outcome."
+ Line 107: "Produce technical-preparation package."

- Line 108: "Do not stop at intake-only chat."
  (removed entirely)

- Line 111: "Return only when stage outcome is reached:"
+ Line 110: "Return:"
```

---

## 5. What NOT to Change

| Lines | Content | Why untouched |
|---|---|---|
| 84-91 | Section heading, trigger condition, mandatory delegation rule, ownership boundary | These describe the shaper's own behavior and the delegation contract boundary. No anti-patterns -- they use `ready-for-execution \| blocked` as terminal return values, not intermediate status reports. |
| 92-105 | Skill invocation instruction, attention anchor, context block | Clean procedural instructions. No stateful vocabulary. |
| 109 | Member delegation instruction | Specifies *what* to produce and *who* to use. Contract language, not process narration. |
| 112-117 | Return value specification, code fence closing | Terminal return contract. The enum values are function return types, not status codes. This is the clean part the anti-pattern lines were redundantly guarding. |
| 118-142 | Parallelism rule, retry rule, verbatim propagation | Entirely separate sections. No audit findings. No reason to touch. |
