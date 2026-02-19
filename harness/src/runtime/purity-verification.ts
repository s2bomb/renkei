import type { ApprovedSurfaceRegistry, ApprovedSurfaceRegistryError } from "./approved-surface-registry"
import type { SurfaceGateEvaluation, SurfaceGateViolation } from "./pure-surface-gate"
import type {
  StaleAssumptionFinding,
  StaleAssumptionScanError,
  StaleAssumptionScanResult,
} from "./stale-assumption-scanner"
import type { CompositionSurfaceID, Result } from "./types"

export type PurityVerificationInput = {
  readonly registryResult: Result<ApprovedSurfaceRegistry, ApprovedSurfaceRegistryError>
  readonly surfaceGateResult: Result<SurfaceGateEvaluation, SurfaceGateViolation>
  readonly staleScanResult: Result<StaleAssumptionScanResult, StaleAssumptionScanError>
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
}

export type PuritySeverityPolicy = {
  readonly failOn: ReadonlyArray<"error">
  readonly allow: ReadonlyArray<"warning">
}

export type PurityVerificationFailure =
  | { readonly code: "PURITY_REGISTRY_FAILED"; readonly error: ApprovedSurfaceRegistryError }
  | { readonly code: "PURITY_SURFACE_GATE_FAILED"; readonly error: SurfaceGateViolation }
  | { readonly code: "PURITY_STALE_ASSUMPTION_FAILED"; readonly error: StaleAssumptionScanError }
  | {
      readonly code: "PURITY_STALE_ASSUMPTION_FOUND"
      readonly failingSeverity: "error"
      readonly findings: ReadonlyArray<StaleAssumptionFinding>
    }

export type PurityVerificationReport = {
  readonly checkedAtMs: number
  readonly pass: boolean
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
  readonly approvedSurfaces: ReadonlyArray<CompositionSurfaceID>
  readonly staleFindingCount: number
  readonly staleFindingCountsBySeverity: {
    readonly error: number
    readonly warning: number
  }
  readonly evidence: {
    readonly registrySourcePath: string
    readonly reportSurfaceCount: number
    readonly scannedFiles: number
  }
}

export type PurityVerificationDependencies = {
  readonly nowMs: () => number
}

export function defaultPuritySeverityPolicy(): PuritySeverityPolicy {
  return {
    failOn: ["error"],
    allow: ["warning"],
  }
}

function cloneFindings(findings: ReadonlyArray<StaleAssumptionFinding>): ReadonlyArray<StaleAssumptionFinding> {
  return findings.map((finding) => ({ ...finding }))
}

function countFindingsBySeverity(
  findings: ReadonlyArray<StaleAssumptionFinding>,
): PurityVerificationReport["staleFindingCountsBySeverity"] {
  let error = 0
  let warning = 0

  for (const finding of findings) {
    if (finding.severity === "error") {
      error += 1
      continue
    }
    warning += 1
  }

  return { error, warning }
}

export function verifyPureOpenCodeIntegration(
  input: PurityVerificationInput,
  deps?: Partial<PurityVerificationDependencies>,
): Result<PurityVerificationReport, PurityVerificationFailure> {
  if (!input.registryResult.ok) {
    return {
      ok: false,
      error: {
        code: "PURITY_REGISTRY_FAILED",
        error: input.registryResult.error,
      },
    }
  }

  if (!input.surfaceGateResult.ok) {
    return {
      ok: false,
      error: {
        code: "PURITY_SURFACE_GATE_FAILED",
        error: input.surfaceGateResult.error,
      },
    }
  }

  if (!input.staleScanResult.ok) {
    return {
      ok: false,
      error: {
        code: "PURITY_STALE_ASSUMPTION_FAILED",
        error: input.staleScanResult.error,
      },
    }
  }

  const runtimeDeps: PurityVerificationDependencies = {
    nowMs: Date.now,
    ...deps,
  }

  const policy = defaultPuritySeverityPolicy()
  const findings = cloneFindings(input.staleScanResult.value.findings)
  const counts = countFindingsBySeverity(findings)

  if (policy.failOn.includes("error") && counts.error > 0) {
    return {
      ok: false,
      error: {
        code: "PURITY_STALE_ASSUMPTION_FOUND",
        failingSeverity: "error",
        findings,
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: runtimeDeps.nowMs(),
      pass: true,
      requiredSurfaces: [...input.requiredSurfaces],
      approvedSurfaces: [...input.surfaceGateResult.value.approved],
      staleFindingCount: findings.length,
      staleFindingCountsBySeverity: counts,
      evidence: {
        registrySourcePath: input.registryResult.value.sourcePath,
        reportSurfaceCount: input.surfaceGateResult.value.reportSurfaceCount,
        scannedFiles: input.staleScanResult.value.scannedFiles,
      },
    },
  }
}
