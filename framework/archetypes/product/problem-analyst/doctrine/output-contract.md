# Output Contract

## Artifact

Analyst brief. Generate from [references/template.md](references/template.md).

## Path Convention

- Primary: `{project_root}/working/problem-analysis-{YYYYMMDD-HHMM}.md`
- Optional stable alias: `{project_root}/working/problem-analysis-latest.md`

## Required Structure

1. Intake summary
2. Validation findings (evidence-backed)
3. Scope decomposition (items + dependencies)
4. Assumptions register (validity + necessity)
5. Open risks
6. Open questions
7. Recommended boundaries per scoped item (`in` / `out`)

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
