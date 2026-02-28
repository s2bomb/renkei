# Final Pass C -- Filesystem and State Design for Active Shaped Items

## Decision

Activation should create a deterministic item subproject workspace, and state must be owned by one machine-readable file in that workspace. The shaped document remains the narrative artifact, not the source of truth for state.

## Minimal State Machine Spec

### Canonical state location

- Single source of truth: `<item-root>/state.yaml`
- Required fields:
  - `item_id` (string)
  - `state` (`proposed-active | active | parked`)
  - `updated_at` (UTC ISO-8601)
  - `updated_by` (role/person)

### Allowed transitions

| From | To | Allowed | Required side effects |
|---|---|---|---|
| proposed-active | active | Yes | Bootstrap workspace if missing; append ledger event |
| proposed-active | parked | Yes | Append ledger event |
| parked | proposed-active | Yes | Append ledger event |
| active | parked | Yes | Append ledger event |
| active | proposed-active | No | Must go through `parked` |
| parked | active | No | Must go through `proposed-active` |

### Activation rule

`proposed-active -> active` is the only transition that may bootstrap filesystem structure. Bootstrap must be idempotent: existing files are preserved, missing required files are created.

## Minimal Ledger Schema

### File

- Location: `<item-root>/ledger.ndjson`
- Format: newline-delimited JSON, append-only.

### Required event schema

Each line must include:

- `ts` (UTC ISO-8601)
- `item_id` (string)
- `event` (`state_changed`)
- `from_state` (`proposed-active | active | parked | null`)
- `to_state` (`proposed-active | active | parked`)
- `actor` (role/person)
- `reason` (non-empty string)
- `artifact` (path to shaped doc)

### Enforceable minimum requirement

For every change to `state.yaml.state`, exactly one new `state_changed` ledger entry is appended in the same change set.

## Workspace Shape (on activation)

Recommended minimal structure:

```text
<item-root>/
  state.yaml
  ledger.ndjson
  shaped.md
  README.md
  sources/
```

- `shaped.md` is the shaped pitch content.
- `README.md` is a short pointer to purpose + current state.
- `sources/` stores copied or linked shaping inputs.

## Precise File Edit Recommendations

### 1) `framework/archetypes/product/shaper/doctrine/process.md`

- In Step 1, replace generic "working container" language with deterministic item workspace initialization (`<item-root>` per scoped item).
- In Step 7, add explicit transition protocol:
  - write `state.yaml`
  - append `ledger.ndjson`
  - if transition is `proposed-active -> active`, run workspace bootstrap
- Add invariant sentence: shaped document metadata can mirror state, but does not define state.

### 2) `framework/archetypes/product/shaper/doctrine/output-contract.md`

- Replace "active environment convention" location text with a required per-item workspace root and required files (`state.yaml`, `ledger.ndjson`, shaped artifact).
- Add a new subsection "State Authority":
  - only `state.yaml` is authoritative
  - allowed state values
  - shaped doc `Decision state` field is descriptive copy only
- Add a new quality gate: every state transition has a same-change ledger entry.

### 3) `framework/archetypes/product/shaper/references/template.md`

- Add top metadata fields:
  - `Item Root: <path>`
  - `State File: <item-root>/state.yaml`
  - `Ledger File: <item-root>/ledger.ndjson`
- Rename `Decision State` label to `Decision State (mirror of state.yaml)`.
- Add a short "State Transition Record" section with placeholders:
  - `From:`
  - `To:`
  - `Reason:`
  - `Actor:`

### 4) `framework/archetypes/product/problem-analyst/references/template.md`

- Add `Item ID` and `Proposed Item Root` to metadata so analyst output and shaper output bind to the same workspace key early.
- Add optional `Potential split items` table keyed by `item_id` to prevent state collisions when one intake decomposes into many items.

## Migration Caution Notes

1. Legacy shaped docs that store `Decision State` inline may disagree with new `state.yaml`; define one-time reconciliation rule (`state.yaml` wins).
2. Item ID renames after activation can orphan ledger history; treat `item_id` as immutable once `ledger.ndjson` exists.
3. Backfilling old items without timestamps/actors weakens audit value; use explicit synthetic markers (for example `actor: migration`).
4. Concurrent edits can double-append transition events; require monotonic transition validation against current `state.yaml` before append.
5. Mixed path conventions across environments can fragment item roots; enforce one workspace root convention per repo before rollout.
