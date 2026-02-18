# Process

## Step 1: Read and Orient

1. Read the plan completely. Check for existing checkmarks (`- [x]`) -- trust completed work is done unless something seems off.
2. Read `test_spec_source` and `design_source` from plan frontmatter when present.
3. If `test_spec_source` is missing for section work, stop and route back through architect for `/test-designer`.
4. Skip test phases -- those are owned by `/test-implementer` and should already be completed.
5. Identify which phases are your responsibility (implementation phases, not test phases).
6. Read all referenced documents fully -- spec, research, design doc, test spec. Never use limit/offset; you need complete context.
7. Read any original ticket and all files mentioned in the plan.
8. Think deeply about how the pieces fit together.
9. Create a todo list to track progress through phases.

If no plan path is provided, ask for one.

## Step 2: Delegate Implementation Phases

Follow the plan's Execution Graph for parallelism decisions.

For each implementation phase:

1. Delegate an `implement-plan-clone` with specific instructions (see Orchestration).
2. Include the verbatim propagation block.
3. Specify: phase number, plan path, scope of work, files involved.
4. Delegate multiple clones in a single message when phases can run in parallel.

## Step 3: Review Clone Commits

After a clone completes a phase and reports back with its commit:

1. Review the clone's completion report and commit hash.
2. Verify the clone's work:
   - Run the tests to confirm they pass.
   - Check success criteria (linting, type checking, build).
   - Review the commit message -- it should explain WHY, not just WHAT.
3. If issues remain, delegate the clone again with specific fix instructions.
4. Update checkboxes in the plan file.
5. Update your todos.

## Step 4: Pause for Human Verification

After automated verification passes and commit is made, pause if the plan specifies manual verification steps:

```
Phase [N] Complete - Committed

Commit: [commit hash] - [commit message]

Automated verification passed:
- [List automated checks that passed]

Please perform the manual verification steps listed in the plan:
- [List manual verification items from the plan]

Let me know when manual testing is complete so I can proceed to Phase [N+1].
```

If instructed to execute multiple phases consecutively, skip the pause until the last phase. Do not check off manual testing items until confirmed by the user.

## Step 5: Handle Mismatches

If you encounter a mismatch between the plan and reality:

1. Stop and think deeply about why the plan can't be followed.
2. Present the issue clearly:

```
Issue in Phase [N]:
Expected: [what the plan says]
Found: [actual situation]
Why this matters: [explanation]

How should I proceed?
```

If the issue is with tests or design -- do not fix it. Propagate to the architect with specifics: which test, which design assumption, what doesn't fit. The test-designer and api-designer own those concerns.

If the issue is with implementation approach -- re-delegate the clone with clarified instructions, or present the mismatch to the user.

Use research sub-agents for targeted debugging or exploring unfamiliar territory before re-delegating.

## Step 6: Resume and Track Progress

If the plan has existing checkmarks, pick up from the first unchecked item.

As you work:
- Update the plan file directly: `- [ ]` -> `- [x]`, add notes if you deviated.
- Use TodoWrite to track current session progress.
- At the end of a session, if work remains, use `/create-handoff` to document where you stopped, including the plan path and current phase.
