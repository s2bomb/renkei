# Perspective A: Function Signature

Analytical lens: treat the shaper->tech-lead delegation as a function call. What are the parameters, return type, and error type? Where does the current prompt violate honest signatures?

---

## 1. Current Implicit Signature

Reading lines 92-117 of `orchestration.md`, the delegation prompt implies this signature:

```python
def tech_lead(
    skill: str,                          # 'tech-lead' (line 98)
    artifact_paths: list[Path],          # active shaped artifact paths (line 98)
    decision_context: str,               # "Decision owner confirmed..." (lines 103-104)
    execution_instructions: str,         # lines 106-109 -- HOW to execute internally
    member_list: list[str],              # line 109 -- which sub-agents to delegate to
) -> ???:                                # lines 111-115 -- mixed terminal/conditional return
    ...
```

**Three signature violations:**

1. **`execution_instructions` is not a parameter -- it's an implementation body.** Lines 106-109 tell the function *how to execute internally* ("Continue through technical-preparation process", "Delegate required members... and synthesize package"). A caller that dictates the callee's implementation has violated encapsulation. In the function model: you pass arguments, you don't pass the function body.

2. **`member_list` is a leaked internal.** Line 109 enumerates `spec-writer`, `research-codebase`, `api-designer`, `test-designer`, `create-plan` -- the tech-lead's own delegates. The shaper should not know or specify these. A function's caller does not choose which subroutines the function calls.

3. **The return type is dishonest.** Lines 111-115 specify a conditional return structure, but the qualifier "Return **only when** stage outcome is reached" implies the function might return at other times. An honest return type leaves no room for "only when" -- the type itself makes premature return unrepresentable.

---

## 2. Clean Function Signature

```python
@dataclass
class TechLeadSuccess:
    outcome: Literal["ready-for-execution"]
    package_paths: list[Path]
    execution_evidence: str

@dataclass
class TechLeadBlocked:
    outcome: Literal["blocked"]
    blockers: list[str]               # items requiring shaper/decision-owner clarification

TechLeadResult = TechLeadSuccess | TechLeadBlocked

def tech_lead(
    artifact_paths: list[Path],       # the shaped items to prepare
    shaped_artifacts_are_ground_truth: bool = True,  # could be implicit
) -> TechLeadResult:
    """
    Produce a technical-preparation package for the given active shaped items.
    """
    ...
```

**What changed:**

- **Parameters are data only.** Paths to shaped artifacts and context. No execution instructions, no member lists, no process narration.
- **Return type is a discriminated union.** `TechLeadSuccess | TechLeadBlocked`. Both are terminal. There is no third variant. The type system prevents premature return -- there is literally no type to return if you're "at intake."
- **No "only when" needed.** The return type IS the contract. If the function returns, it returned one of the two variants. The constraint is structural, not instructional.

---

## 3. The Three Findings as Signature Violations

### Finding 1: "Do not stop at intake-only chat" (line 108)

**Signature violation: inventing a return type that doesn't exist.**

This instruction presupposes a third, unnamed return variant: `IntakeOnly`. In the function model, if `IntakeOnly` is not in the return union, the function *cannot* return it. The instruction to "not stop at intake" is like writing `# do not return None` on a function typed `-> int`. If the type is right, the instruction is noise. If the instruction is needed, the type is wrong.

The honest fix: the return type `TechLeadSuccess | TechLeadBlocked` makes `IntakeOnly` unrepresentable. Delete the line.

### Finding 2: "Continue through technical-preparation process to stage outcome" (line 107)

**Signature violation: caller dictating the function body.**

AGENTS.md: "A function's parameters tell you what it needs. Its return type tells you what it produces." (line 266). This instruction tells the function *what to do between call and return*. That is the function body -- the callee's concern, not the caller's. A caller that specifies the body has created a coupling to the callee's implementation. If tech-lead reorganizes its process, this instruction either becomes wrong or prevents the reorganization.

The honest fix: specify parameters and return type. The function body belongs to tech-lead's own archetype.

### Finding 3: "Return only when stage outcome is reached" (line 111)

**Signature violation: an honest return type makes the qualifier redundant.**

"Only when" implies there exist times when the function might return prematurely. If the return type is `TechLeadSuccess | TechLeadBlocked`, there is no premature return to guard against. The qualifier converts a type-level guarantee into a prose-level request, which is strictly weaker.

From AGENTS.md line 267: "Prevent, don't detect." A discriminated union *prevents* invalid returns. "Only when" tries to *detect and forbid* them with prose. Prevention wins.

---

## 4. What the Delegation Prompt Should Look Like

The caller (shaper) needs to supply exactly two things:

1. **Parameters** -- the data the function needs
2. **Return type** -- what shape the result must take

Everything else -- execution path, member delegation, process narration -- belongs to the callee.

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

Return:
1. Technical-preparation outcome: `ready-for-execution` | `blocked`
2. Technical package artifact path(s)
3. If `ready-for-execution`: execution kickoff evidence summary
4. If `blocked`: blockers requiring shaper or decision-owner clarification
"""
)
```

**What was removed:** Lines 106-109 entirely (execution requirement block). Six lines of process narration replaced by zero lines. The return contract (already present) does all the work.

**What stayed:** Skill invocation protocol (runtime-specific, necessary). Context (parameter data). Return contract (the return type).

---

## 5. Key Insight

**The three findings are one finding: the delegation prompt contains function body, not function signature.**

Other perspectives may treat the three audit findings as independent problems needing independent fixes. From the function signature lens, they are all the same defect: the caller is writing the callee's implementation in the call site. "Continue through process" is body. "Do not stop at intake" is body (a negated branch). "Return only when" is a runtime assertion that the type system should enforce.

The single fix is: **strip everything between the parameters and the return type.** What remains is a function call. What was removed was never the caller's to write.

This is the direct application of AGENTS.md line 19: "The signature must tell the truth: what goes in, what comes out, what gets mutated." The current prompt tells the truth *plus* tells the implementation. The surplus is the entire problem.
