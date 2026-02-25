# Output Contract

## Artifact

Section design document(s) defining module boundaries and API contracts with zero hidden interpretation.

Generate using [references/template.md](references/template.md).

## Path Convention

- Project section: `{project_root}/working/section-N-api-design.md`
- Standalone: `thoughts/design/YYYY-MM-DD-[module-name].md`

## Required Structure

Each design output must include:

- Module boundary (responsibility, non-goals, dependencies)
- Contract matrix (function/type/event contracts)
- Semantic contracts and structural contracts (explicitly separated)
- Invariants and allowed variation
- Error taxonomy and propagation behavior
- Observability at boundary events
- Design-risk findings
- Requirement traceability
- Handoff notes for `test-designer`

## Quality Gates

No handoff if any gate fails:

- Each contract has explicit semantic meaning
- Normative contract clauses are separated from representational notes
- Invariants and allowed variation are explicit
- Error behavior is concrete and typed
- No vendor/storage/runtime internals leak into public contract semantics
- Another team can implement from this document without reading internals
- `test-designer` can derive proof obligations without reinterpretation

Soft wording is not accepted in normative clauses (`reasonable`, `best effort`, `appropriate`) unless explicitly defined in contract terms.

## Completion Report

```
API design complete.

**Location**: [path]
**Summary**: [N] modules, [N] contracts
**Design risks**: [if any]

Ready for `/test-designer`.
```
