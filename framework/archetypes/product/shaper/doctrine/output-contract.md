# Output Contract

## Artifact

Produce one shaped pitch document per scoped item.

A template may be used as a convenience, but the contract fields are mandatory regardless of format.

## Location Convention (Single State Queue)

- Open queue item: `shaped-items/open/item-###.md`
- Active item workspace: `shaped-items/active/item-###/shape.md`
- Parked item: `shaped-items/parked/`
- Done item: `shaped-items/done/item-###/shape.md`

State authority is path location plus transition ledger entries.

## Required Active Workspace Scaffold

When an item becomes `active`, require:
- `shape.md` (canonical shaped artifact)
- `index.md` (item control-plane file)
- `sources/` (item evidence)
- `working/` (execution artifacts)
- `events.jsonl` (append-only item ledger)

Project-level required companions:
- `index.md`
- `sources/`
- `working/`
- `events.jsonl` (append-only project ledger)

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
- Date
- Item ID
- Decision owner (role or person)
- Source references

Required transition event fields (`events.jsonl`):
- `ts`
- `actor`
- `type`
- `item`
- `from`
- `to`
- `reason`
- `artifacts`

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
- Decision-owner acknowledgment is explicit
- Active workspace scaffold exists and is complete
- Project and item transition events exist

## Downstream Contract

For confirmed `active` items, the shaped artifact must be handoff-ready for `architect-opencode` without additional reframing.

Required handoff payload:
- active workspace path
- shaped artifact path
- analyst brief/evidence paths
- unresolved assumptions and open risks

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
