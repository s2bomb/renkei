import type { StartupJsonReport } from "./renkei-dev"
import type { Result } from "./types"

export type DeterministicSignalInput = {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number
  readonly json?: StartupJsonReport
}

export type DeterministicSignalExpectation = {
  readonly expectedExitCode: 0 | 1
  readonly expectedHumanSignal: "renkei-dev startup ok serverUrl=" | "renkei-dev startup failed code="
  readonly requireJsonContract: boolean
}

export type DeterministicSignalFailure =
  | {
      readonly code: "SIGNAL_EXIT_CODE_MISMATCH"
      readonly expected: 0 | 1
      readonly actual: number
    }
  | {
      readonly code: "SIGNAL_HUMAN_STRING_MISSING"
      readonly expectedPrefix: string
      readonly stream: "stdout" | "stderr"
    }
  | {
      readonly code: "SIGNAL_JSON_MISSING"
    }
  | {
      readonly code: "SIGNAL_JSON_OK_FLAG_MISMATCH"
      readonly expectedOk: boolean
      readonly actualOk: boolean
    }
  | {
      readonly code: "SIGNAL_JSON_EXIT_CODE_MISMATCH"
      readonly expected: 0 | 1
      readonly actual: number
    }

export type DeterministicSignalReport = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly expectation: DeterministicSignalExpectation
}

export type DeterministicSignalDependencies = {
  readonly nowMs: () => number
}

export function verifyDeterministicStartupSignals(
  input: DeterministicSignalInput,
  expectation: DeterministicSignalExpectation,
  deps?: Partial<DeterministicSignalDependencies>,
): Result<DeterministicSignalReport, DeterministicSignalFailure> {
  const nowMs = deps?.nowMs ?? Date.now

  if (input.exitCode !== expectation.expectedExitCode) {
    return {
      ok: false,
      error: {
        code: "SIGNAL_EXIT_CODE_MISMATCH",
        expected: expectation.expectedExitCode,
        actual: input.exitCode,
      },
    }
  }

  const stream: "stdout" | "stderr" = expectation.expectedExitCode === 0 ? "stdout" : "stderr"
  const signalValue = stream === "stdout" ? input.stdout : input.stderr
  if (!signalValue.startsWith(expectation.expectedHumanSignal)) {
    return {
      ok: false,
      error: {
        code: "SIGNAL_HUMAN_STRING_MISSING",
        expectedPrefix: expectation.expectedHumanSignal,
        stream,
      },
    }
  }

  if (expectation.requireJsonContract && !input.json) {
    return {
      ok: false,
      error: {
        code: "SIGNAL_JSON_MISSING",
      },
    }
  }

  if (expectation.requireJsonContract && input.json) {
    const expectedOk = expectation.expectedExitCode === 0
    if (input.json.ok !== expectedOk) {
      return {
        ok: false,
        error: {
          code: "SIGNAL_JSON_OK_FLAG_MISMATCH",
          expectedOk,
          actualOk: input.json.ok,
        },
      }
    }

    if (input.json.exitCode !== expectation.expectedExitCode) {
      return {
        ok: false,
        error: {
          code: "SIGNAL_JSON_EXIT_CODE_MISMATCH",
          expected: expectation.expectedExitCode,
          actual: input.json.exitCode,
        },
      }
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: nowMs(),
      pass: true,
      expectation,
    },
  }
}
