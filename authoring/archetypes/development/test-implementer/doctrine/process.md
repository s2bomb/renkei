# Process

## Step 1: Read All Inputs

1. Read the plan to understand which test phases you own.
2. Read the test spec fully -- understand every test specified.
3. Read the API design for function signatures and types.
4. Read the research doc for test infrastructure context.

## Step 2: Delegate Test Phases

Determine which test phases can run in parallel (independent modules, no file overlap) vs sequential.

For each test phase, delegate a `test-implementer-clone` with:
- The specific tests from the spec it is responsible for
- The plan path and phase number
- The test spec path and API design path
- The test directory and existing patterns to follow
- The verbatim propagation block

Delegate multiple clones in a single message when phases can run in parallel.

## Step 3: Review Clone Returns

After each clone completes and reports back:

1. Review: tests match spec? Assertions are contract-bound? Follow existing codebase patterns?
2. Verify tests compile/parse correctly (syntax valid even if they fail at runtime).
3. If issues remain, re-delegate with specific fix instructions.
4. Commit verified test code with descriptive message (e.g., `test: add tests for [module] per test spec`).
5. Update plan checkboxes for completed test phases.

## Step 4: Verify Completeness

After all test phases:
- All tests from the spec are implemented
- Tests follow existing codebase patterns
- Test code is clean, maintainable, well-named
- All test phases committed
- Tests compile/parse correctly
