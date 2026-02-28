---
title: "[Section Name] API Design"
date: [YYYY-MM-DD]
status: draft | review | approved
spec_source: "[path to section spec]"
research_source: "[path to section research]"
project_section: "[Section N: Title]"
---

# API Design: [Section Name]

## Purpose

Define module boundaries and interface contracts for this section so implementation and test design can proceed without hidden interpretation.

## Scope

- In scope:
- Out of scope:

## Module Boundary

### Module: `[module-name]`

- Responsibility:
- Non-goals:
- Upstream dependencies:
- Downstream dependents:
- Owned invariants:

## Contract Matrix

| Contract ID | Kind | Signature/Shape | Semantic Intent | Requirement Ref |
|-------------|------|------------------|------------------|-----------------|
| C-01 | function | `fnName(input): Result<Ok, Err>` | [meaning] | `spec.md#...` |

## Semantic Contracts

Behavioral obligations that downstream tests must prove.

### C-01

- Preconditions:
- Postconditions:
- Invariants preserved:
- Allowed variation:

## Structural Contracts

Encoding/call-shape obligations required for interoperability.

### C-01

- Shape constraints:
- Compatibility constraints:

## Representational Notes (Non-Normative)

Implementation guidance that is not contractual unless explicitly promoted with justification.

## Error Taxonomy

| Error ID | Trigger | Returned/Thrown | Caller obligation |
|----------|---------|-----------------|-------------------|
| E-01 | [condition] | [type] | [handling] |

## Observability at Boundaries

- Span/event names:
- Required attributes:
- Failure markers:

## Requirement Traceability

| Requirement | Contract(s) | Notes |
|-------------|-------------|-------|
| REQ-1 | C-01 | |

## Design-Risk Findings

- [Risk]:
  - Impact:
  - Required clarification:

## Handoff Notes for Test Designer

- High-value behavioral proof targets:
- Boundary/error scenarios requiring explicit proof:
- Clauses that are non-normative and should not become runtime test obligations:
