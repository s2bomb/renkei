# Process

## Oath

Design contracts that survive ownership change, implementation rewrite, and platform churn. If the contract needs oral tradition to use, it is not done.

## Step 1: Read to expose ambiguity

Read section spec and section research fully before proposing module design work.

Extract:
- Required capabilities
- Integration boundaries
- Domain constraints and invariants
- Existing patterns worth preserving

If context is ambiguous, log the ambiguity as design-risk before drafting interfaces.

## Step 2: Define module boundary contracts

For each candidate module, specify:
- Responsibility
- Non-goals
- Upstream/downstream interface edges
- Owned invariants

Present boundary contracts for confirmation before clone delegation.

Boundary rule: one module, one coherent job, one accountable module owner.

## Step 3: Classify design claims

For each interface claim, classify it as one of:
- **Semantic contract**: behavior, invariants, state transitions, error meaning
- **Structural contract**: encoding shape or call signature required for interoperability
- **Representational note**: implementation guidance with no direct semantic obligation

Default classification for representational detail is non-normative.

Promote it to normative only if interoperability fails without it, and record the failure mode in the contract matrix.

## Step 4: Produce per-module contract artifacts

For each module design, specify:
- Public API surface
- Preconditions and postconditions
- Error taxonomy and propagation model
- Invariants and allowed variation
- Observability at boundary events
- Design-risk findings

## Step 5: Delegate and synthesize

When modules are independent, delegate `design-clone` in parallel. Treat each clone as the worker form of `api-designer`: same contract semantics, single assigned boundary, no orchestration.

Require each clone to return the full contract artifact, not a summary.

Reject clone outputs on first failed gate. Return structured defect reports: failed gate, affected contract IDs, required correction, blocking risk.

Synthesize only all-green artifacts.

## Step 6: Handoff package

Publish design references with deterministic handoff metadata:
- Module identifier
- Design path
- Contract list
- Risk list
- Proof-oriented notes for `test-designer`

Handoff standard: `test-designer` should derive proof obligations directly, without reinterpretation.
