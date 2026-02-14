# create-plan Skill — Updates (Draft)

Changes needed in `create-plan/SKILL.md` for the test-layer refactor.

---

## 1. Update Required Inputs

**Old:**
```markdown
- Section test spec from `/test-writer` (primary truth contract)
```

**New:**
```markdown
- Section test spec from `/test-designer` (primary truth contract)
```

---

## 2. Add phase ownership awareness

Add to the plan template, after the Execution Graph section:

```markdown
## Phase Ownership

| Phase | Owner | Description |
|-------|-------|-------------|
| Phase 1 | `/test-implementer` | Write tests for [module] |
| Phase 2 | `/implement-plan` | Implement [module] to pass tests |
| ... | ... | ... |

**Test phases** are executed by `/test-implementer` — tests are written first, committed separately.
**Implementation phases** are executed by `/implement-plan` — code is written to make existing tests pass.
```

---

## 3. Update phase template

Each phase should indicate its owner. Add to the phase header:

```markdown
## Phase N: [Descriptive Name]

**Owner**: `/test-implementer` | `/implement-plan`
**Commit**: `test: ...` | `feat: ...`
```

---

## 4. Update the pipeline reference

**Old:**
```
project → /research-codebase → /api-designer → /test-writer → /create-plan → /implement-plan
```

**New:**
```
project → /research-codebase → /api-designer → /test-designer → /create-plan → /test-implementer → /implement-plan
```

---

## 5. Update validation strategy section

Add clarity that test phases come first:

```markdown
## Testing Strategy

**Test phases are planned first, implementation phases second.**

The plan structures work so that `/test-implementer` writes all test code before `/implement-plan` writes any implementation. This is TDD at the plan level:
1. Test phases create failing tests (red)
2. Implementation phases make tests pass (green)

Each test phase references specific tests from the test spec.
Each implementation phase references which tests it should make pass.
```
