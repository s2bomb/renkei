# Process

## Step 1: Understand the API Surface

1. Read all inputs FULLY: API design doc, spec, research
2. For each function/module in the design doc, extract:
   - Function signature (name, params, return type)
   - Error cases (Result types, thrown exceptions)
   - Side effects (if any)
   - Module boundaries and composition points
3. Classify each extracted claim:
   - Behavioral contract (observable runtime behavior)
   - Structural/static contract (shape, types, imports, signatures)
   - Representation detail (layout/text/shape claims that may be incidental)
4. Map requirements to API contracts: which requirements are proven by which contracts?
5. Identify design-risk gaps:
   - Requirements without corresponding API contracts
   - Claimed contracts without requirement-backed behavioral consequence

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

## Step 3: Specify Proof Obligations Per Contract

For each API contract in the design doc:

1. **Verifier-of-record**: Assign the cheapest sufficient verifier (compiler/type checker/linter/static analyzer/runtime test).
2. **Runtime admission check**: Only specify a runtime test if wrong code could pass static verifiers and still violate behavior at execution time.
3. **Representation-detail gate**: If the claim is representational, require requirement-backed semantic consequence. If absent, do not convert to a runtime test; flag as design-risk.
4. **Happy path** (runtime obligations only): What does correct behavior look like? What observable output proves it?
5. **Error path** (runtime obligations only): What should fail? Does the error propagate correctly? Is the error type right?
6. **Boundary conditions** (if relevant): Edge cases at the API boundary
7. **Composition** (if relevant): Does this compose correctly with other contracts?
8. **Assertion scope check**: Is the expected assertion narrow and contract-bound, or broad and incidental?
9. **Allowed variation**: What valid implementation changes should NOT break this proof?

For each runtime test you specify:
- **What it proves** (one sentence, traces to API contract)
- **Why runtime is required** (what static verifiers cannot prove here)
- **Test setup** (inputs, preconditions — execute behavior, do not inspect source text)
- **Expected behavior** (observable output, return value, error type)
- **Discriminating power** (what wrong implementation would this catch?)
- **Contract invariant** (the behavior rule being proven)
- **Allowed variation** (what can change without contract breakage)
- **Assertion scope rationale** (why this is minimum sufficient proof)
- **Fragility check** (what incidental change would incorrectly fail this test)

## Step 4: Compile Test Specification

**For small sections (1-2 modules):** Write the test spec directly.

**For larger sections (3+ modules):** Delegate `test-writer-clone` agents per module, each bounded by their module's API surface. Synthesize into a unified test spec.

## Step 5: Verify Completeness

Before writing the final spec:
- Every API contract maps to a verifier-of-record
- Runtime tests exist only for runtime obligations
- Error paths have explicit tests
- Tests would fail on incorrect implementations
- Any untestable requirement documented as a design gap
- Any design claim without requirement-backed behavioral consequence documented as design-risk
- Test count is reasonable for the scope (no spec-creep)
