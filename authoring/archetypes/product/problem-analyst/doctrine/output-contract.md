# Output Contract

## Artifact

Produce one analyst brief per analysis pass.

## Location Convention

Store analysis artifacts using the active environment's project convention.

## Required Structure

1. Intake summary
2. Problem validation findings
3. Scoped item list (1..N)
4. Assumptions register (validity + necessity)
5. Open risks and unresolved questions
6. Recommended boundaries per scoped item (`in` / `out`)
7. Source citations and confidence per major claim

## Quality Gates

Do not hand off unless:
- Every major claim has citation or explicit uncertainty label
- Scope decomposition is explicit (1..N items)
- Assumptions are tagged for validity and necessity
- Open risks are concrete, not generic
- Findings and interpretations are clearly separated

## Completion Report

```
Problem analysis complete.

Artifact: [path]
Scoped items: [N]
High-risk assumptions: [N]
Open questions: [N]

Ready for shaper synthesis.
```
