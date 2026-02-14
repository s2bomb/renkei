---
title: "[Section Name] Test Specification"
date: [YYYY-MM-DD]
status: draft | review | approved
design_source: "[path to API design doc]"
spec_source: "[path to spec.md]"
research_source: "[path to research doc]"
project_section: "[Section N: Title]"
---

# Test Specification: [Section Name]

## Purpose

This document specifies the proof obligations for the API contracts in [section name]. Each test traces to a specific contract in the design doc. Passing all tests proves the contracts hold. Implementation agents build against this specification.

## Test Infrastructure

**Framework**: [e.g., vitest, pytest, jest -- from codebase research]
**Test location**: [directory path, following existing conventions]
**Patterns to follow**: [existing test files that model the right approach, with file:line references]
**Utilities available**: [existing test helpers, fixtures, factories -- with file:line references]
**Run command**: [how to run these specific tests]

## API Surface

Contracts under test, extracted from the design doc:

| Contract | Signature | Design Reference | Tests |
|----------|-----------|------------------|-------|
| [contract name] | `functionName(params): ReturnType` | `design.md#section` | T-01, T-02, T-03 |
| [contract name] | `otherFunction(params): Result<T, E>` | `design.md#section` | T-04, T-05 |

## Proof Obligations

### `functionName(params: ParamType): Result<SuccessType, ErrorType>`

Design reference: `design.md#functionName`
Depends on: [nothing | other contracts that must be tested first]

#### T-01: [What this test proves -- one sentence]

**Contract**: [Which API contract this proves holds]
**Setup**: [Inputs, preconditions, state]
**Expected**: [Observable output -- return value, error type, state change]
**Discriminating power**: [What wrong implementation would this catch? What does failure look like?]

---

#### T-02: [Error contract -- what this test proves]

**Contract**: [Which error contract this proves holds]
**Setup**: [Invalid input, error condition, failure state]
**Expected**: [Specific error type, error message content, no partial state change]
**Discriminating power**: [Catches implementations that swallow the error, return wrong type, or partially persist]

---

### `otherFunction(params: ParamType): Result<T, E>`

Design reference: `design.md#otherFunction`
Depends on: `functionName` (test first)

#### T-04: [What this test proves]

**Contract**: [Which API contract]
**Setup**: [Inputs, preconditions]
**Expected**: [Observable output]
**Discriminating power**: [What it catches]

---

## Requirement Traceability

Every requirement maps through an API contract to a test:

| Requirement | Source | Proved By Contract | Proved By Test |
|-------------|--------|--------------------|----------------|
| [REQ-1: description] | `spec.md#section` | `functionName()` | T-01 |
| [REQ-2: error handling] | `spec.md#section` | `functionName()` | T-02, T-03 |

## What Is NOT Tested (and Why)

- [Internal implementation detail]: Not part of the API surface. The implementation agent's concern.
- [UI rendering]: Separate test layer at [path], not in scope for this API surface.
- [Auth middleware]: Tested at [path/file:line], not duplicated here.

## Test Execution Order

Run in this order for fastest feedback:

1. [Foundation contracts -- no dependencies]
2. [Error path contracts -- prove error handling before integration]
3. [Composition contracts -- depend on foundation passing]

If group 1 fails, later group results are meaningless.

## Design Gaps

Issues found in the design doc that affect testability:

- **[Gap]**: [What's untestable and why]
  - Design doc reference: `[design-doc:section]`
  - Required change: [What the design needs to expose or modify]
  - Affected tests: [Which tests can't be written until this is resolved]

**If gaps exist, the architect should iterate with `/api-designer` before planning proceeds.**
