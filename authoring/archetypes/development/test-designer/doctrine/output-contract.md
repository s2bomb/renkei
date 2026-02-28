# Output Contract

## Artifact

Test specification document. Generate based on [references/template.md](references/template.md).

The template structures the spec around the API surface -- contracts are the primary organizing axis. Each test groups under its API contract, not under a requirement. Requirement traceability is a cross-reference, not the primary structure.

## Path Convention

- Project section: `{project_root}/working/section-N-test-spec.md`
- Standalone: `thoughts/tests/YYYY-MM-DD-description-test-spec.md`

## Structure

The test spec contains:
- API surface summary (contracts under test, extracted from design doc)
- Contract verification matrix (contract → verifier-of-record → proof artifact)
- Per-contract proof obligations (grouped by function/module boundary)
- Each test: what it proves, setup, expected behavior, discriminating power
- Non-test evidence register (claims proven by static verifiers, with rationale)
- Requirement traceability (requirement → contract → test)
- Test execution order for planner consumption
- Design gap callouts when testability is blocked
- Explicit scope boundary (what is NOT tested and why)

## Quality Gates

Do not hand off to the planner unless:
- Every in-scope API contract maps to a verifier-of-record
- Every runtime test includes explicit rationale for why static verification is insufficient
- Error contracts have explicit error-path tests
- Tests would fail incorrect implementations (discriminating power)
- Every runtime test names a unique wrong implementation it would fail
- Any untestable requirement is documented as a design gap
- Any representational claim without requirement-backed semantic consequence is documented as design-risk
- Scope stays within API surface (no internal implementation tests)
- No test encodes incidental details unless the contract explicitly requires them (order, full-object equality, fixed counts, exact representation)

## Completion Report

```
Test specification complete.

**Location**: [path]
**Summary**: [N] tests across [N] API contracts
**Design gaps**: [if any — architect should iterate with /api-designer]

Ready for planner.
```
