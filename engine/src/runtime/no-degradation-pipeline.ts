import { loadApprovedSurfaceRegistry, type ApprovedSurfaceRegistryError } from "./approved-surface-registry"
import { type CompositionBoundaryError } from "./composition-integration-boundary"
import {
  evaluateNoDegradationBaseline,
  type BaselineEvaluation,
  type BaselineViolationError,
} from "./no-degradation-baseline"
import { enforcePureSurfaceContract, type SurfaceGateViolation } from "./pure-surface-gate"
import { startHarnessRuntime } from "./startup-orchestrator"
import type { CapabilityReport, CompositionSurfaceID, Result, StartupSuccess } from "./types"
import {
  verifyLiveIntegrationPrerequisites,
  type LiveIntegrationPrerequisiteError,
  type LiveIntegrationPrerequisiteSuccess,
} from "./live-integration-prereqs"

export type NoDegradationPipelineInput = {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
  readonly approvedSurfaceRegistryPath: string
}

export type NoDegradationPipelineStage =
  | "prerequisite"
  | "boundary-startup"
  | "approved-surface-registry"
  | "pure-surface-gate"
  | "baseline"

export type NoDegradationPipelineSuccess = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly serverUrl: string
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
  readonly startup: StartupSuccess
  readonly baseline: BaselineEvaluation
  readonly evidence: {
    readonly report: CapabilityReport
    readonly compositionSurfaceCount: number
    readonly startupTimingsMs: StartupSuccess["timingsMs"]
  }
}

export type NoDegradationPipelineError =
  | {
      readonly code: "NO_DEGRADATION_PREREQUISITE_FAILED"
      readonly stage: "prerequisite"
      readonly error: LiveIntegrationPrerequisiteError
    }
  | {
      readonly code: "NO_DEGRADATION_BOUNDARY_FAILED"
      readonly stage: "boundary-startup"
      readonly error: CompositionBoundaryError
    }
  | {
      readonly code: "NO_DEGRADATION_APPROVED_REGISTRY_FAILED"
      readonly stage: "approved-surface-registry"
      readonly error: ApprovedSurfaceRegistryError
    }
  | {
      readonly code: "NO_DEGRADATION_PURE_SURFACE_GATE_FAILED"
      readonly stage: "pure-surface-gate"
      readonly error: SurfaceGateViolation
    }
  | {
      readonly code: "NO_DEGRADATION_BASELINE_FAILED"
      readonly stage: "baseline"
      readonly error: BaselineViolationError
    }

export type NoDegradationPipelineDependencies = {
  readonly nowMs: () => number
  readonly verifyLiveIntegrationPrerequisites: typeof verifyLiveIntegrationPrerequisites
  readonly bootstrapCompositionBoundary: (input: {
    readonly serverUrl: string
    readonly cwd: string
    readonly timeoutMs: number
    readonly healthPath: string
  }) => Promise<Result<{ readonly startup: StartupSuccess }, CompositionBoundaryError>>
  readonly loadApprovedSurfaceRegistry: typeof loadApprovedSurfaceRegistry
  readonly enforcePureSurfaceContract: typeof enforcePureSurfaceContract
  readonly evaluateNoDegradationBaseline: typeof evaluateNoDegradationBaseline
}

async function defaultBoundaryStartupAdapter(input: {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
}): Promise<Result<{ readonly startup: StartupSuccess }, CompositionBoundaryError>> {
  const startup = await startHarnessRuntime(input)
  if (!startup.ok) {
    return startup
  }
  return {
    ok: true,
    value: {
      startup: startup.value,
    },
  }
}

function verifyPrerequisites(
  input: NoDegradationPipelineInput,
  deps: NoDegradationPipelineDependencies,
): Result<LiveIntegrationPrerequisiteSuccess, NoDegradationPipelineError> {
  const prerequisite = deps.verifyLiveIntegrationPrerequisites({
    serverUrlEnvVar: "OPENCODE_SERVER_URL",
    serverUrlValue: input.serverUrl,
    approvedSurfaceRegistryPath: input.approvedSurfaceRegistryPath,
    requiredSurfaces: input.requiredSurfaces,
  })

  if (!prerequisite.ok) {
    return {
      ok: false,
      error: {
        code: "NO_DEGRADATION_PREREQUISITE_FAILED",
        stage: "prerequisite",
        error: prerequisite.error,
      },
    }
  }

  return prerequisite
}

export async function runNoDegradationValidationPipeline(
  input: NoDegradationPipelineInput,
  deps?: Partial<NoDegradationPipelineDependencies>,
): Promise<Result<NoDegradationPipelineSuccess, NoDegradationPipelineError>> {
  const runtimeDeps: NoDegradationPipelineDependencies = {
    nowMs: Date.now,
    verifyLiveIntegrationPrerequisites,
    bootstrapCompositionBoundary: defaultBoundaryStartupAdapter,
    loadApprovedSurfaceRegistry,
    enforcePureSurfaceContract,
    evaluateNoDegradationBaseline,
    ...deps,
  }

  const prerequisite = verifyPrerequisites(input, runtimeDeps)
  if (!prerequisite.ok) {
    return prerequisite
  }

  const boundary = await runtimeDeps.bootstrapCompositionBoundary({
    serverUrl: prerequisite.value.serverUrl,
    cwd: input.cwd,
    timeoutMs: input.timeoutMs,
    healthPath: input.healthPath,
  })
  if (!boundary.ok) {
    return {
      ok: false,
      error: {
        code: "NO_DEGRADATION_BOUNDARY_FAILED",
        stage: "boundary-startup",
        error: boundary.error,
      },
    }
  }

  const report = boundary.value.startup.report

  const approvedSurfaceRegistry = await runtimeDeps.loadApprovedSurfaceRegistry(
    prerequisite.value.approvedSurfaceRegistryPath,
  )
  if (!approvedSurfaceRegistry.ok) {
    return {
      ok: false,
      error: {
        code: "NO_DEGRADATION_APPROVED_REGISTRY_FAILED",
        stage: "approved-surface-registry",
        error: approvedSurfaceRegistry.error,
      },
    }
  }

  const surfaceGate = runtimeDeps.enforcePureSurfaceContract({
    report,
    requiredSurfaces: prerequisite.value.requiredSurfaces,
    approvedRegistry: approvedSurfaceRegistry.value,
  })
  if (!surfaceGate.ok) {
    return {
      ok: false,
      error: {
        code: "NO_DEGRADATION_PURE_SURFACE_GATE_FAILED",
        stage: "pure-surface-gate",
        error: surfaceGate.error,
      },
    }
  }

  const baseline = runtimeDeps.evaluateNoDegradationBaseline({
    report,
    startup: boundary.value.startup,
  })
  if (!baseline.ok) {
    return {
      ok: false,
      error: {
        code: "NO_DEGRADATION_BASELINE_FAILED",
        stage: "baseline",
        error: baseline.error,
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: runtimeDeps.nowMs(),
      pass: true,
      serverUrl: prerequisite.value.serverUrl,
      requiredSurfaces: prerequisite.value.requiredSurfaces,
      startup: boundary.value.startup,
      baseline: baseline.value,
      evidence: {
        report,
        compositionSurfaceCount: surfaceGate.value.reportSurfaceCount,
        startupTimingsMs: boundary.value.startup.timingsMs,
      },
    },
  }
}
