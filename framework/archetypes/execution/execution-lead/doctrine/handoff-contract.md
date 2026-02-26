# Handoff Contract

## Contract

This contract governs transfer from `tech-lead` (technical-preparation owner) to `execution-lead` (execution owner).

Member artifacts from technical-preparation specialists do not cross directly to execution members. `tech-lead` aggregates first.

## Required Intake Payload

1. active item workspace path
2. shaped artifact path
3. technical package path
4. plan path
5. test specification path(s)
6. unresolved decisions list
7. accepted risks list

## Required Acknowledgment Fields

Execution owner returns:

1. `receipt_confirmed`: true|false
2. `sufficiency_for_execution`: true|false
3. `blocking_gaps[]`: list (empty only if sufficient)
4. `first_execution_step`: initial action summary

## Transfer Rule

Execution ownership transfers only when:

- receipt is confirmed
- sufficiency is true

If either is false, ownership remains with `tech-lead`.

## Escalation Rule

If two correction cycles fail to achieve sufficient intake, escalate to decision owner with:

- blocked fields
- impact on appetite and delivery integrity
- recommended options
