import type { Result, StartupError, StartupStage } from "./types"

export type StartupBoundaryInvariant =
  | "SERVER_URL_SOURCE_RULE"
  | "STARTUP_STAGE_ORDER"
  | "STARTUP_ERROR_DISCRIMINANTS_STABLE"
  | "EXIT_CODE_CONTRACT_STABLE"
  | "URL_BOUNDARY_INTEGRATION_ONLY"

export type StartupBoundaryViolation = {
  readonly code: "STARTUP_BOUNDARY_VIOLATION"
  readonly invariant: StartupBoundaryInvariant
  readonly detail: string
}

export type StartupBoundaryReport = {
  readonly checkedAtMs: number
  readonly invariants: ReadonlyArray<{
    readonly id: StartupBoundaryInvariant
    readonly ok: boolean
    readonly detail?: string
  }>
}

export type StartupBoundaryEvidence = {
  readonly serverUrlSourceRuleHolds: boolean
  readonly startupStageOrder: ReadonlyArray<StartupStage>
  readonly startupErrorDiscriminants: ReadonlyArray<string>
  readonly exitCodeContract: {
    readonly success: number
    readonly failure: number
  }
  readonly importsDirectVendoredRuntime: boolean
}

export type StartupBoundaryVerifierDependencies = {
  readonly nowMs: () => number
  readonly provideEvidence: () => StartupBoundaryEvidence
}

type InvariantReport = StartupBoundaryReport["invariants"][number]
type StartupErrorCode = StartupError["code"]

const EXPECTED_STAGE_ORDER: ReadonlyArray<StartupStage> = ["readiness", "probe", "sdk"]
const EXPECTED_STARTUP_ERROR_DISCRIMINANTS: ReadonlyArray<StartupErrorCode> = [
  "STARTUP_SERVER_URL_MISSING",
  "STARTUP_SERVER_URL_INVALID",
  "HOST_HEALTH_TIMEOUT",
  "HOST_HEALTH_UNREACHABLE",
  "HOST_HEALTH_INVALID",
  "PROBE_FAILED",
  "SDK_BOOTSTRAP_FAILED",
]

const DEFAULT_DEPS: StartupBoundaryVerifierDependencies = {
  nowMs: () => Date.now(),
  provideEvidence: () => ({
    serverUrlSourceRuleHolds: true,
    startupStageOrder: EXPECTED_STAGE_ORDER,
    startupErrorDiscriminants: EXPECTED_STARTUP_ERROR_DISCRIMINANTS,
    exitCodeContract: {
      success: 0,
      failure: 1,
    },
    importsDirectVendoredRuntime: false,
  }),
}

function reportInvariant(id: StartupBoundaryInvariant, ok: boolean, detail: string): InvariantReport {
  if (ok) {
    return { id, ok }
  }

  return {
    id,
    ok,
    detail,
  }
}

function isExpectedSequence<T>(actual: ReadonlyArray<T>, expected: ReadonlyArray<T>): boolean {
  if (actual.length !== expected.length) {
    return false
  }

  return expected.every((entry, index) => actual[index] === entry)
}

function findViolation(invariants: ReadonlyArray<InvariantReport>): InvariantReport | null {
  for (const invariant of invariants) {
    if (!invariant.ok) {
      return invariant
    }
  }

  return null
}

export function evaluateStartupBoundaryEvidence(
  evidence: StartupBoundaryEvidence,
  checkedAtMs: number,
): Result<StartupBoundaryReport, StartupBoundaryViolation> {
  const invariants: ReadonlyArray<InvariantReport> = [
    reportInvariant(
      "SERVER_URL_SOURCE_RULE",
      evidence.serverUrlSourceRuleHolds,
      "renkei-dev server URL source must remain CLI arg or OPENCODE_SERVER_URL",
    ),
    reportInvariant(
      "STARTUP_STAGE_ORDER",
      isExpectedSequence(evidence.startupStageOrder, EXPECTED_STAGE_ORDER),
      "startup stage order must remain readiness -> probe -> sdk",
    ),
    reportInvariant(
      "STARTUP_ERROR_DISCRIMINANTS_STABLE",
      isExpectedSequence(evidence.startupErrorDiscriminants, EXPECTED_STARTUP_ERROR_DISCRIMINANTS),
      "startup error discriminants must remain unchanged",
    ),
    reportInvariant(
      "EXIT_CODE_CONTRACT_STABLE",
      evidence.exitCodeContract.success === 0 && evidence.exitCodeContract.failure === 1,
      "runRenkeiDevCommand exit contract must remain success=0 failure=1",
    ),
    reportInvariant(
      "URL_BOUNDARY_INTEGRATION_ONLY",
      !evidence.importsDirectVendoredRuntime,
      "startup path must stay URL-boundary based without direct vendored runtime imports",
    ),
  ]

  const violation = findViolation(invariants)
  if (violation && violation.detail) {
    return {
      ok: false,
      error: {
        code: "STARTUP_BOUNDARY_VIOLATION",
        invariant: violation.id,
        detail: violation.detail,
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs,
      invariants,
    },
  }
}

export function verifyRenkeiDevStartupBoundary(
  deps?: Partial<StartupBoundaryVerifierDependencies>,
): Result<StartupBoundaryReport, StartupBoundaryViolation> {
  const runtimeDeps: StartupBoundaryVerifierDependencies = {
    ...DEFAULT_DEPS,
    ...deps,
  }

  return evaluateStartupBoundaryEvidence(runtimeDeps.provideEvidence(), runtimeDeps.nowMs())
}
