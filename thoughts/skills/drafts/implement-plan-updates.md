# implement-plan Skill — Updates (Draft)

Changes needed in `implement-plan/SKILL.md` for the test-layer refactor.

---

## 1. Update identity — no longer writes tests

**Old philosophy:** TDD — write tests first, then implement.

**New philosophy:** Tests already exist (written by `/test-implementer`). Your job is to make them pass.

Update the Getting Started section:

```markdown
When given a plan path:
- Read the plan completely and check for any existing checkmarks (- [x])
- **Skip test phases** — those are owned by `/test-implementer` and should already be completed
- Read `test_spec_source` and `design_source` from plan frontmatter when present
- Identify which phases are YOUR responsibility (implementation phases, not test phases)
- Read any original ticket and all files mentioned in the plan
```

---

## 2. Update verification approach

**Old:**
```markdown
2. Verify tests-first execution for the phase:
   - Phase-targeted tests were written first
   - Targeted tests failed before implementation where applicable
   - Implementation was done toward those tests
```

**New:**
```markdown
2. Verify implementation against existing tests:
   - Run the tests that this phase should make pass (from the test spec)
   - Tests should transition from failing to passing
   - If tests still fail, investigate and fix the implementation (not the tests)
```

---

## 3. Update the verbatim block for clones

Remove test-writing instructions. The key change:

**Remove:**
```
You must write validation code for every phase.
```

**Replace with:**
```
Tests already exist for your implementation (written by /test-implementer). Your job is to make those tests pass. Run them frequently. If a test fails after your implementation, fix your code — not the test.

For additional validation beyond existing tests, you may:
- Add Logfire spans that prove the code path executes with expected data
- Write a tmp validation script if the existing tests don't cover a specific concern
- Use Playwright for browser-based validation if relevant
```

---

## 4. Update phase ownership awareness

Add to the implementation philosophy:

```markdown
## Phase Ownership

The plan distinguishes two types of phases:
- **Test phases** (owned by `/test-implementer`) — already completed before you start
- **Implementation phases** (owned by you) — write code to make existing tests pass

When you encounter a test phase in the plan, skip it — it's already done. Your checkboxes are only the implementation phases.
```

---

## 5. Key behavioral change

The implementer's loop changes from:
```
write test → see it fail → write code → see it pass → commit
```

To:
```
run existing test → see it fail → write code → see it pass → commit
```

Same TDD loop, just the "write test" step is already done by another agent.
