import type { Result } from "./types"
import type { RunbookCommandID, RunbookCommandStep } from "./operator-runbook-contract"
import { createSectionESmokeRunbookContract } from "./operator-runbook-contract"

export type CanonicalSmokeSequence = readonly [
  RunbookCommandStep & { readonly id: "bootstrap:vendor-install" },
  RunbookCommandStep & { readonly id: "bootstrap:opencode-dev-server" },
  RunbookCommandStep & { readonly id: "bootstrap:health-check" },
  RunbookCommandStep & { readonly id: "quality:typecheck" },
  RunbookCommandStep & { readonly id: "quality:lint" },
  RunbookCommandStep & { readonly id: "quality:test-unit" },
  RunbookCommandStep & { readonly id: "runtime:renkei-dev-json" },
  RunbookCommandStep & { readonly id: "quality:test-integration" },
]

export type SmokeSequenceError =
  | {
      readonly code: "SMOKE_SEQUENCE_LENGTH_INVALID"
      readonly expected: 8
      readonly actual: number
    }
  | {
      readonly code: "SMOKE_SEQUENCE_STEP_MISMATCH"
      readonly index: number
      readonly expected: RunbookCommandID
      readonly actual?: RunbookCommandID
    }
  | {
      readonly code: "SMOKE_SEQUENCE_COMMAND_EMPTY"
      readonly id: RunbookCommandID
    }
  | {
      readonly code: "SMOKE_SEQUENCE_EXPECTED_EXIT_INVALID"
      readonly id: RunbookCommandID
      readonly expectedExitCode: number
    }

export type SmokeSequenceValidationReport = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly sequence: CanonicalSmokeSequence
}

export type SmokeSequenceDependencies = {
  readonly nowMs: () => number
}

// Canonical ordered list of step IDs -- used for verification
const CANONICAL_IDS: ReadonlyArray<RunbookCommandID> = [
  "bootstrap:vendor-install",
  "bootstrap:opencode-dev-server",
  "bootstrap:health-check",
  "quality:typecheck",
  "quality:lint",
  "quality:test-unit",
  "runtime:renkei-dev-json",
  "quality:test-integration",
]

export function canonicalSectionESmokeSequence(): CanonicalSmokeSequence {
  const contract = createSectionESmokeRunbookContract()
  return contract.commandSequence as unknown as CanonicalSmokeSequence
}

export function verifyCanonicalSectionESmokeSequence(
  steps: ReadonlyArray<RunbookCommandStep>,
  deps?: Partial<SmokeSequenceDependencies>,
): Result<SmokeSequenceValidationReport, SmokeSequenceError> {
  const nowMs = deps?.nowMs ?? Date.now

  // Check length first
  if (steps.length !== 8) {
    return {
      ok: false,
      error: {
        code: "SMOKE_SEQUENCE_LENGTH_INVALID",
        expected: 8,
        actual: steps.length,
      },
    }
  }

  // Check order: each step ID must match canonical ID at same index
  for (let i = 0; i < 8; i++) {
    if (steps[i].id !== CANONICAL_IDS[i]) {
      return {
        ok: false,
        error: {
          code: "SMOKE_SEQUENCE_STEP_MISMATCH",
          index: i,
          expected: CANONICAL_IDS[i],
          actual: steps[i].id,
        },
      }
    }
  }

  // Check command arrays: no step may have an empty command
  for (const step of steps) {
    if (step.command.length === 0) {
      return {
        ok: false,
        error: { code: "SMOKE_SEQUENCE_COMMAND_EMPTY", id: step.id },
      }
    }
  }

  // Check exit codes: all must be 0
  for (const step of steps) {
    if (step.expectedExitCode !== 0) {
      return {
        ok: false,
        error: {
          code: "SMOKE_SEQUENCE_EXPECTED_EXIT_INVALID",
          id: step.id,
          expectedExitCode: step.expectedExitCode,
        },
      }
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: nowMs(),
      pass: true,
      sequence: steps as unknown as CanonicalSmokeSequence,
    },
  }
}
