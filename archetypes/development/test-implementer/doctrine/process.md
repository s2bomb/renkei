# Process

## Step 1: Read All Inputs

1. Read the plan to understand which test phases you own
2. Read the test spec FULLY — understand every test specified
3. Read the API design for function signatures and types
4. Read the research doc for test infrastructure context

## Step 2: Research Test Infrastructure

Delegate research agents to understand:
- Test framework, runner, configuration
- Test directory structure
- Existing test patterns, fixtures, helpers, factories
- How to run tests locally

Delegate in parallel:
- **codebase-locator**: Find test directories, test configs
- **codebase-pattern-finder**: Find existing test patterns for similar features
- **codebase-analyzer**: Understand test utilities and helpers

Wait for all research to complete before writing any tests.

## Step 3: Implement Tests Per Plan Phase

For each test phase in the plan:

1. Delegate `test-implementer-clone` with specific test-writing instructions
2. Review clone output: tests match spec? Follow patterns? Properly structured?
3. Verify tests compile/parse correctly (syntax valid even if they fail at runtime)
4. Commit test code with descriptive message (e.g., `test: add tests for [module] per test spec`)

Delegate multiple clones in parallel when tests cover independent modules with no file overlap.

## Step 4: Verify Completeness

After all test phases:
- All tests from the spec are implemented
- Tests follow existing codebase patterns
- Test code is clean, maintainable, well-named
- All test phases committed
- Tests compile/parse correctly
