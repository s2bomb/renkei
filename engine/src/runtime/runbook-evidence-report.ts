import type { Result } from "./types"
import type { StartupJsonReport } from "./renkei-dev"
import type { DeterministicSignalFailure } from "./deterministic-signals"
import { verifyDeterministicStartupSignals } from "./deterministic-signals"
import type { RunbookCommandID, RunbookCommandStep } from "./operator-runbook-contract"
import { STEP_EVIDENCE_KEYS } from "./operator-runbook-contract"
import { verifyCanonicalSectionESmokeSequence, type SmokeSequenceError } from "./canonical-smoke-sequence"
import type { EnvironmentPreflightSuccess } from "./runbook-environment-preflight"

export type { EnvironmentPreflightSuccess }

export type RunbookStepExecution = {
  readonly id: RunbookCommandID
  readonly command: ReadonlyArray<string>
  readonly cwd: "repo-root" | "harness"
  readonly startedAtMs: number
  readonly finishedAtMs: number
  readonly durationMs: number
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
}

export type RunbookEvidenceInput = {
  readonly runbookVersion: "section-e.v1"
  readonly preflight: EnvironmentPreflightSuccess
  readonly stepExecutions: ReadonlyArray<RunbookStepExecution>
  readonly renkeiDevJsonReport?: StartupJsonReport
}

export type RunbookEvidenceFailure =
  | {
      readonly code: "RUNBOOK_EVIDENCE_SEQUENCE_INVALID"
      readonly error: SmokeSequenceError
    }
  | {
      readonly code: "RUNBOOK_EVIDENCE_STEP_FAILED"
      readonly stepID: RunbookCommandID
      readonly exitCode: number
    }
  | {
      readonly code: "RUNBOOK_EVIDENCE_SIGNAL_INVALID"
      readonly error: DeterministicSignalFailure
    }
  | {
      readonly code: "RUNBOOK_EVIDENCE_JSON_MISSING"
    }

export type RunbookEvidenceSuccess = {
  readonly generatedAtMs: number
  readonly pass: true
  readonly runbookVersion: "section-e.v1"
  readonly environment: {
    readonly serverUrl: string
    readonly workingDirectory: string
  }
  readonly steps: ReadonlyArray<{
    readonly id: RunbookCommandID
    readonly ok: true
    readonly exitCode: 0
    readonly durationMs: number
  }>
  readonly deterministicSignals: {
    readonly startupSuccessVerified: true
    readonly jsonContractVerified: true
  }
}

export type RunbookEvidenceDependencies = {
  readonly nowMs: () => number
  readonly verifyCanonicalSectionESmokeSequence: typeof verifyCanonicalSectionESmokeSequence
  readonly verifyDeterministicStartupSignals: (
    input: {
      readonly stdout: string
      readonly stderr: string
      readonly exitCode: number
      readonly json?: StartupJsonReport
    },
    expectation: {
      readonly expectedExitCode: 0 | 1
      readonly expectedHumanSignal: "renkei-dev startup ok serverUrl=" | "renkei-dev startup failed code="
      readonly requireJsonContract: boolean
    },
  ) => Result<unknown, DeterministicSignalFailure>
}

function mergeDependencies(deps?: Partial<RunbookEvidenceDependencies>): RunbookEvidenceDependencies {
  return {
    nowMs: deps?.nowMs ?? Date.now,
    verifyCanonicalSectionESmokeSequence:
      deps?.verifyCanonicalSectionESmokeSequence ?? verifyCanonicalSectionESmokeSequence,
    verifyDeterministicStartupSignals: deps?.verifyDeterministicStartupSignals ?? verifyDeterministicStartupSignals,
  }
}

export function buildSectionERunbookEvidenceReport(
  input: RunbookEvidenceInput,
  deps?: Partial<RunbookEvidenceDependencies>,
): Result<RunbookEvidenceSuccess, RunbookEvidenceFailure> {
  const resolved = mergeDependencies(deps)

  // Stage 1: Validate canonical sequence integrity from recorded steps
  const mappedSteps: ReadonlyArray<RunbookCommandStep> = input.stepExecutions.map((s) => ({
    id: s.id,
    command: s.command,
    cwd: s.cwd,
    expectedExitCode: 0 as const,
    evidenceKey: STEP_EVIDENCE_KEYS[s.id],
  }))

  const sequenceResult = resolved.verifyCanonicalSectionESmokeSequence(mappedSteps)
  if (!sequenceResult.ok) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_EVIDENCE_SEQUENCE_INVALID",
        error: sequenceResult.error,
      },
    }
  }

  // Stage 2: Find first step with non-zero exit code
  const failedStep = input.stepExecutions.find((s) => s.exitCode !== 0)
  if (failedStep !== undefined) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_EVIDENCE_STEP_FAILED",
        stepID: failedStep.id,
        exitCode: failedStep.exitCode,
      },
    }
  }

  // Stage 3: Verify renkei-dev JSON report is present
  if (input.renkeiDevJsonReport === undefined) {
    return {
      ok: false,
      error: { code: "RUNBOOK_EVIDENCE_JSON_MISSING" },
    }
  }

  // Stage 4: Verify deterministic startup signals using the renkei-dev-json step
  const renkeiStep = input.stepExecutions.find((s) => s.id === "runtime:renkei-dev-json")
  const signalInput = {
    stdout: renkeiStep?.stdout ?? "",
    stderr: renkeiStep?.stderr ?? "",
    exitCode: renkeiStep?.exitCode ?? 0,
    json: input.renkeiDevJsonReport,
  }

  const signalResult = resolved.verifyDeterministicStartupSignals(signalInput, {
    expectedExitCode: 0,
    expectedHumanSignal: "renkei-dev startup ok serverUrl=",
    requireJsonContract: true,
  })

  if (!signalResult.ok) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_EVIDENCE_SIGNAL_INVALID",
        error: signalResult.error,
      },
    }
  }

  // Build minimal condensed success evidence
  return {
    ok: true,
    value: {
      generatedAtMs: resolved.nowMs(),
      pass: true,
      runbookVersion: "section-e.v1",
      environment: {
        serverUrl: input.preflight.env.OPENCODE_SERVER_URL,
        workingDirectory: input.preflight.workingDirectory,
      },
      steps: input.stepExecutions.map((s) => ({
        id: s.id,
        ok: true,
        exitCode: 0,
        durationMs: s.durationMs,
      })),
      deterministicSignals: {
        startupSuccessVerified: true,
        jsonContractVerified: true,
      },
    },
  }
}
