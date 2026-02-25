# Handoff Contract

## Contract

This contract governs interim transfer from `tech-lead` (technical preparation owner) to `architect-opencode` (execution owner).

## Required Handoff Payload

1. active item workspace path
2. shaped artifact path
3. technical package path
4. unresolved decisions list
5. accepted risks list

## Required Acknowledgment Fields

Execution owner must return:

1. `receipt_confirmed`: true|false
2. `sufficiency_for_execution`: true|false
3. `blocking_gaps[]`: list (empty only if sufficient)
4. `first_execution_step`: initial action summary

## Transfer Rule

Execution ownership is transferred only when:
- receipt is confirmed
- sufficiency is true

If either is false, ownership remains with `tech-lead` and correction or escalation is required.

## Escalation Rule

If two correction cycles fail to achieve sufficient acknowledgment, escalate to decision owner with:
- blocked fields
- impact on appetite and delivery integrity
- recommended decision options
