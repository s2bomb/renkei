# Output Contract

## Artifact

Produce one shaped pitch document per scoped item.

A template may be used as a convenience, but the contract fields are mandatory regardless of format.

## Location Convention

Store artifacts using the active environment's project convention.

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
- Each major problem claim includes evidence or an explicit uncertainty label
- Appetite is explicit
- Rabbit holes are explicit and tagged (validity + necessity where applicable)
- Each rabbit hole includes consequence if wrong
- No-gos are explicit
- Solution constrains direction without technical prescription
- Major unresolved risks are visible
- Decision state is explicit
- Decision-owner acknowledgment is explicit

## Downstream Contract

For confirmed `active` items, the shaped artifact must be handoff-ready for `architect-opencode` without additional reframing.

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
