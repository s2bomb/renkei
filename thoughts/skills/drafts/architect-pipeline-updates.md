# Architect Skill — Pipeline Updates (Draft)

These are the changes needed in both `architect/SKILL.md` and `architect-opencode/SKILL.md` when we promote the test-layer refactor.

---

## 1. Replace `/test-writer` command section with `/test-designer`

**Remove** the entire `/test-writer` section and replace with:

```markdown
### /test-designer

**Role**: Design test specifications from API contracts. Scope-bounded by the API surface.

**Delegate:**
```python
Task(
  subagent_type="general",
  prompt="STOP. READ THIS BEFORE DOING ANYTHING.\n\nYour FIRST action MUST be to call the Skill tool with skill: 'test-designer' and args: '[design doc path] [spec path] [research path]'.\n\nDO NOT start reading files, grepping, or exploring the codebase yourself. The Skill tool will load the test-designer skill which gives you your full methodology and instructions. Without it you will not have the correct instructions.\n\nAgain: Step 1 is calling the Skill tool. Nothing else comes first."
)
```

**Output**: `{project}/working/section-N-test-spec.md`

**Feedback signals**:
- [ ] Every API contract maps to at least one test
- [ ] Error contracts have explicit error-path tests
- [ ] Tests would fail incorrect implementations
- [ ] Scope stays within API surface
- [ ] Design gaps flagged (not worked around)

**Iterate if**: Tests don't trace to API contracts, scope creep beyond API surface, missing error path tests.

**Loop rule (design <-> test-designer):** If test-designer surfaces design gaps, route back to `/api-designer` with specific feedback.
```

---

## 2. Add `/test-implementer` command section (after `/create-plan`)

**Add new section:**

```markdown
### /test-implementer

**Role**: Write executable test code from test specifications. TDD red phase — tests fail initially.

**Delegate:**
```python
Task(
  subagent_type="general",
  prompt="STOP. READ THIS BEFORE DOING ANYTHING.\n\nYour FIRST action MUST be to call the Skill tool with skill: 'test-implementer' and args: '[plan path]'.\n\nDO NOT start reading files, grepping, or exploring the codebase yourself. The Skill tool will load the test-implementer skill which gives you your full methodology and instructions. Without it you will not have the correct instructions.\n\nAgain: Step 1 is calling the Skill tool. Nothing else comes first."
)
```

**Output**: Test files committed, plan checkboxes updated for test phases.

**Feedback signals**:
- [ ] All tests from spec are implemented
- [ ] Tests follow existing codebase patterns
- [ ] Tests compile/parse correctly
- [ ] Test commits are separate from implementation commits

**Iterate if**: Tests missing from spec, wrong patterns, syntax errors.
```

---

## 3. Update per-section pipeline diagram

**Old:**
```
spec-writer → research → api-design → test-spec → plan → implement → validate
```

**New:**
```
spec-writer → research → api-design → test-design → plan → test-impl → implement → validate
```

---

## 4. Update per-section pipeline steps

**Replace 2c (Test Specification) with:**

```markdown
**2c. Test Design**
1. Delegate `/test-designer` with research + spec + design paths
2. Read test spec output
3. Evaluate: Every API contract covered? Error paths tested? Scope within API surface?
4. If test-designer surfaces design gaps, route back to `/api-designer` and iterate
```

**Replace 2d (Plan) — update reference from test-writer to test-designer:**

```markdown
**2d. Plan**
1. Delegate `/create-plan` with research + test spec from test-designer (and design references)
2. Read plan output
3. Evaluate: requirements traced? phases concrete? test phases assigned to test-implementer? code phases assigned to implement-plan?
4. **Iterate if issues, proceed if solid**
```

**Replace 2e (Implement tests) with:**

```markdown
**2e. Implement Tests**
1. Delegate `/test-implementer` with the plan path
2. Check: test phases complete? Tests committed? Tests compile/parse?
3. Iterate with specific feedback if issues
```

**Update 2f (Implement) — clarify no tests:**

```markdown
**2f. Implement**
1. Delegate `/implement-plan` with the plan path
2. Check: implementation phases complete? Existing tests pass? Commits created? Build passes?
3. Iterate with specific feedback if issues
```

---

## 5. Update pipeline summary diagram

**Old:**
```
Research + design + test spec → /create-plan → plan document
     ↓
Plan → /implement-plan → code + commits
```

**New:**
```
Research + design + test spec → /create-plan → plan document
     ↓
Plan → /test-implementer → test code + commits
     ↓
Plan + tests → /implement-plan → implementation code + commits
```

---

## 6. Update stage tracking list

Add `test-design` and `test-impl` to the stage progression:

```
research / api-design / test-design / plan / test-impl / implement / validate
```
