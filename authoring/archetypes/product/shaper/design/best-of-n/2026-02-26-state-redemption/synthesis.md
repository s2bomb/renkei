# Synthesis: Shaper State Redemption -- 2026-02-26

Five independent perspectives analyzed how to remove stateful anti-patterns from the shaper's tech-lead delegation prompt in `doctrine/orchestration.md`.

---

## 1. What All Five Perspectives Agree On

**Universal agreement on all core points.** This is rare for a best-of-N pass -- no contested decisions.

### The three findings are legitimate and should be fixed

Every perspective confirms the audit's three findings are genuine anti-patterns:
- "Do not stop at intake-only chat" (line 108) -- legitimizes "intake" as a named intermediate state
- "Continue through technical-preparation process to stage outcome" (line 107) -- narrates the delegate's internal process
- "Return only when stage outcome is reached:" (line 111) -- implies early return is a possibility to guard against

### The fix is single-file

Perspective D confirmed: no other shaper doctrine file (`process.md`, `pipeline.md`, `team-contract.md`, `output-contract.md`) references the affected concepts. "Intake" appears nowhere else. `ready-for-execution | blocked` appear only in `orchestration.md`. No coordinated cross-file updates needed.

### Line 108 should be deleted entirely

All five perspectives agree: remove "Do not stop at intake-only chat" with no replacement. The return contract makes it redundant. The leader invocation rule covers the intent.

### Line 111 should change to "Return:"

All five perspectives agree: strip "only when stage outcome is reached" and leave just "Return:". The discriminated union return type makes the qualifier noise.

### The underlying defect is one thing, not three

Perspective A identified and the others confirmed: the three findings are a single defect -- the delegation prompt contains function body, not function signature. The caller wrote the callee's implementation into the call site.

### Risk is low enough to proceed

Perspective E rated all three changes LOW or LOW-MEDIUM. The leader invocation rule already covers the removed guardrails' intent. The return contract and retry rule provide structural protection.

---

## 2. Where Perspectives Diverged

### Divergence 1: What to do with line 107

**Perspective B (minimal surgery):** REPLACE "Continue through technical-preparation process to stage outcome" with "Produce technical-preparation package." Keep the "Execution requirement:" section header (line 106) and the member list (line 109).

**Perspective A (function signature):** REMOVE the entire "Execution requirement" block (lines 106-109). Everything between the parameters and the return type is function body that doesn't belong.

**Perspective C (delegation prompt design):** REMOVE the entire "Execution requirement" block. Also remove the member roster (line 109), calling it "the tech-lead's orchestration doctrine, not the shaper's business."

**Resolution: Follow Perspective B (minimal surgery).** Rationale:
1. Line 109 ("Delegate required members... and synthesize package") tells the delegate *what to produce*, not *how to traverse its process*. This is output specification, not process narration. Perspective B correctly identified this distinction.
2. The member list (spec-writer, research-codebase, etc.) is arguably a coupling concern (Perspective C), but removing it is a separate question from the anti-pattern fix. The audit did not flag line 109.
3. Minimal surgery reduces risk. We can evaluate the member-list coupling separately.
4. Replacing "Continue through technical-preparation process to stage outcome" with "Produce technical-preparation package" converts process narration to deliverable specification -- the exact fix Perspective E identified as a non-stateful mitigation for the LOW-MEDIUM risk.

### Divergence 2: Whether "Context:" should become "Input:"

**Perspective C:** Rename "Context:" to "Input:" because it is function input, not narrative context.

**Perspectives A, B, D, E:** Do not change "Context:" -- it was not flagged by the audit.

**Resolution: Do not rename.** The audit found three specific anti-patterns. "Context:" is not one of them. Renaming it is a style preference, not an anti-pattern fix. If it should change, that's a separate evaluation.

### Divergence 3: Whether to remove "from `execution-lead`" on line 114

**Perspective C:** Remove "from `execution-lead`" -- how the tech-lead produces execution evidence is its own business.

**Perspectives A, B, D, E:** Do not flag this.

**Resolution: Do not remove.** This is a return contract detail that tells the shaper what to expect in the return value. It specifies *what* comes back (evidence from execution-lead), not *how* the tech-lead should produce it. Not an anti-pattern.

### Divergence 4: Pre-deployment caveat

**Perspective E:** Before deploying, verify the tech-lead's SKILL.md implements the leader invocation rule. If it doesn't, fix the tech-lead archetype first.

**Other perspectives:** Did not raise this.

**Resolution: Accept the caveat as an action item, not a blocker.** The shaper should not compensate for a broken callee (Perspective E's own conclusion). The fix is correct regardless of the tech-lead's state. But verifying the tech-lead is a good practice. Record it as a follow-up.

---

## 3. Concrete Changes

### File: `framework/archetypes/product/shaper/doctrine/orchestration.md`

**Change 1: Line 107**
```
BEFORE: - Continue through technical-preparation process to stage outcome.
AFTER:  - Produce technical-preparation package.
```

**Change 2: Line 108**
```
BEFORE: - Do not stop at intake-only chat.
AFTER:  (delete entire line)
```

**Change 3: Line 111**
```
BEFORE: Return only when stage outcome is reached:
AFTER:  Return:
```

### No other files need changes

Confirmed by Perspective D: `process.md`, `pipeline.md`, `team-contract.md`, `output-contract.md` are all consistent with the fix.

### Complete before/after of the delegation prompt

**BEFORE (lines 106-115):**
```
Execution requirement:
- Continue through technical-preparation process to stage outcome.
- Do not stop at intake-only chat.
- Delegate required members (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`) and synthesize package.

Return only when stage outcome is reached:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary from `execution-lead`
4. If `blocked`: blockers requiring shaper or decision-owner clarification
```

**AFTER (lines 106-113):**
```
Execution requirement:
- Produce technical-preparation package.
- Delegate required members (`spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan`) and synthesize package.

Return:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary from `execution-lead`
4. If `blocked`: blockers requiring shaper or decision-owner clarification
```

---

## 4. Follow-Up Actions

1. **Verify tech-lead archetype implements leader invocation rule.** The shaper's guardrails were likely compensating for the tech-lead's behavior. Confirm the tech-lead's own SKILL.md says "invocation triggers immediate execution, return only terminal outcome." If not, fix it there. (Source: Perspective E)

2. **Consider member-list coupling separately.** Line 109 enumerates the tech-lead's delegates in the shaper's call site. Three perspectives flagged this as coupling. It is not an anti-pattern in the audit's taxonomy, but it may warrant a separate evaluation. (Source: Perspectives A, C)

3. **Extract delegation prompt design principle.** Perspective C articulated: "A delegation prompt is a call site, not a function body. Specify input and return type. Never narrate the callee's execution." This should be codified somewhere that all archetype authors can reference -- possibly in `docs/framework/AUTHORING.md` or as a shared doctrine article. (Source: Perspective C)

---

## 5. Grounding

Every change traces to the function model in AGENTS.md:

| Change | Principle | AGENTS.md Source |
|---|---|---|
| Remove "Continue through technical-preparation process" | Caller does not dictate function body | "Honest signatures... what goes in, what comes out" |
| Remove "Do not stop at intake-only chat" | No named intermediate states | "Agents are non-deterministic functions -- stateless, terminal, composable" |
| Change "Return only when" to "Return:" | Return type prevents invalid returns structurally | "Prevent, don't detect" |
