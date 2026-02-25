# Output Contract

## Artifact

Shaped pitch document. Generate from [references/template.md](references/template.md).

One document per scoped item.

## Path Convention

- Primary: `{project_root}/working/shaped-item-{N}.md`
- Single-item shortcut: `{project_root}/working/shaped-problem.md`

## Required Structure

Every shaped document includes the Shape Up core contract:

1. Problem statement
2. Appetite
3. Solution (rough shape)
4. Rabbit holes (assumptions/risks)
5. No-gos (out of scope)

Optional Renkei extension:
- Intent (why now / desired end state)

Plus required metadata:
- Decision state: `proposed-active`, `active`, or `parked`
- Date
- Source references

## Quality Gates

Do not hand off an `active` item unless:
- Problem statement is solution-agnostic and specific
- Appetite is explicit
- Rabbit holes are explicit and tagged (validity + necessity where applicable)
- No-gos are explicit
- Solution constrains direction without technical prescription
- Major unresolved risks are visible
- Decision state is explicit

## Completion Report

```
Shaping complete.

Items shaped: [N]
Proposed active: [N]
Active: [N]
Parked: [N]

Artifacts:
- [path 1]
- [path 2]

Ready for technical preparation on active items.
```
