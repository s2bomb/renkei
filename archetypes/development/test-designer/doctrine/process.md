# Process

## Step 1: Understand the API Surface

1. Read all inputs FULLY: API design doc, spec, research
2. For each function/module in the design doc, extract:
   - Function signature (name, params, return type)
   - Error cases (Result types, thrown exceptions)
   - Side effects (if any)
   - Module boundaries and composition points
3. Map requirements to API contracts: which requirements are proven by which contracts?
4. Identify testability gaps: requirements without corresponding API contracts

## Step 2: Research Existing Test Infrastructure

Delegate research agents to understand:
- What test framework(s) does the codebase use?
- Where do tests live? What's the directory structure?
- What test patterns exist? (fixtures, factories, mocks, helpers)
- What test utilities or shared helpers already exist?
- How are tests run?

Delegate in parallel:
- **codebase-locator**: Find test directories, test configs, CI configuration
- **codebase-pattern-finder**: Find existing test patterns for similar features

Wait for all research to complete before proceeding.

## Step 3: Specify Tests Per Contract

For each API contract in the design doc:

1. **Happy path**: What does correct behavior look like? What observable output proves it?
2. **Error path**: What should fail? Does the error propagate correctly? Is the error type right?
3. **Boundary conditions** (if relevant): Edge cases at the API boundary
4. **Composition** (if relevant): Does this compose correctly with other contracts?

For each test, specify:
- **What it proves** (one sentence, traces to API contract)
- **Test setup** (inputs, preconditions)
- **Expected behavior** (observable output, return value, error type)
- **Discriminating power** (what wrong implementation would this catch?)

## Step 4: Compile Test Specification

**For small sections (1-2 modules):** Write the test spec directly.

**For larger sections (3+ modules):** Delegate `test-writer-clone` agents per module, each bounded by their module's API surface. Synthesize into a unified test spec.

## Step 5: Verify Completeness

Before writing the final spec:
- Every API contract maps to at least one test
- Error paths have explicit tests
- Tests would fail on incorrect implementations
- Any untestable requirement documented as a design gap
- Test count is reasonable for the scope (no spec-creep)
