import { loadApprovedSurfaceRegistry, type ApprovedSurfaceRegistryError } from "./approved-surface-registry"
import { createHarnessSDKClient, loadDeployedSkills, type SessionInfo } from "./composition-seam"
import { enforcePureSurfaceContract, type SurfaceGateViolation } from "./pure-surface-gate"
import { startHarnessRuntime } from "./startup-orchestrator"
import type {
  CapabilityReport,
  CompositionError,
  CompositionSurfaceID,
  LoadedSkill,
  OpencodeSDKClient,
  Result,
  StartupError,
  StartupSuccess,
} from "./types"

export type CompositionBoundaryInput = {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly skillRoots?: ReadonlyArray<string>
}

export type CompositionBoundaryOutput = {
  readonly startup: StartupSuccess
  readonly sdk: OpencodeSDKClient
  readonly loadedSkills: ReadonlyArray<LoadedSkill>
}

export type CompositionBoundaryError =
  | StartupError
  | {
      readonly code: "APPROVED_SURFACE_REGISTRY_FAILED"
      readonly path: string
      readonly error: ApprovedSurfaceRegistryError
    }
  | {
      readonly code: "PURE_SURFACE_CONTRACT_FAILED"
      readonly error: SurfaceGateViolation
    }
  | {
      readonly code: "SKILL_LOAD_FAILED"
      readonly error: CompositionError
    }
  | {
      readonly code: "COMPOSITION_SURFACE_MISSING"
      readonly report: CapabilityReport
      readonly surface: CompositionSurfaceID
      readonly message: string
    }

export type CompositionBoundaryDependencies = {
  readonly startHarnessRuntime: typeof startHarnessRuntime
  readonly loadApprovedSurfaceRegistry: typeof loadApprovedSurfaceRegistry
  readonly enforcePureSurfaceContract: typeof enforcePureSurfaceContract
  readonly createHarnessSDKClient: typeof createHarnessSDKClient
  readonly loadDeployedSkills: typeof loadDeployedSkills
}

const REQUIRED_SURFACES: ReadonlyArray<CompositionSurfaceID> = [
  "tool-registry",
  "plugin-hooks",
  "skill-load",
  "sdk-client",
]

const DEFAULT_APPROVED_SURFACE_REGISTRY_PATH = "config/approved-opencode-surfaces.json"

export function assertRequiredSurfaces(
  report: CapabilityReport,
  required: ReadonlyArray<CompositionSurfaceID>,
): Result<true, CompositionBoundaryError> {
  for (const surface of required) {
    const available = report.composition.some((item) => item.id === surface && item.available)
    if (!available) {
      return {
        ok: false,
        error: {
          code: "COMPOSITION_SURFACE_MISSING",
          report,
          surface,
          message: `Required composition surface unavailable: ${surface}`,
        },
      }
    }
  }

  return { ok: true, value: true }
}

export async function bootstrapCompositionBoundary(
  input: CompositionBoundaryInput,
  deps?: Partial<CompositionBoundaryDependencies>,
): Promise<Result<CompositionBoundaryOutput, CompositionBoundaryError>> {
  const runtimeDeps: CompositionBoundaryDependencies = {
    startHarnessRuntime,
    loadApprovedSurfaceRegistry,
    enforcePureSurfaceContract,
    createHarnessSDKClient,
    loadDeployedSkills,
    ...deps,
  }

  const startup = await runtimeDeps.startHarnessRuntime({
    serverUrl: input.serverUrl,
    cwd: input.cwd,
    timeoutMs: input.timeoutMs,
    healthPath: input.healthPath,
  })
  if (!startup.ok) {
    return startup
  }

  const approvedRegistry = await runtimeDeps.loadApprovedSurfaceRegistry(DEFAULT_APPROVED_SURFACE_REGISTRY_PATH)
  if (!approvedRegistry.ok) {
    return {
      ok: false,
      error: {
        code: "APPROVED_SURFACE_REGISTRY_FAILED",
        path: DEFAULT_APPROVED_SURFACE_REGISTRY_PATH,
        error: approvedRegistry.error,
      },
    }
  }

  const gateResult = runtimeDeps.enforcePureSurfaceContract({
    report: startup.value.report,
    requiredSurfaces: REQUIRED_SURFACES,
    approvedRegistry: approvedRegistry.value,
  })
  if (!gateResult.ok) {
    return {
      ok: false,
      error: {
        code: "PURE_SURFACE_CONTRACT_FAILED",
        error: gateResult.error,
      },
    }
  }

  const sdk = await runtimeDeps.createHarnessSDKClient({
    serverUrl: input.serverUrl,
    directory: input.cwd,
  })
  if (!sdk.ok) {
    return {
      ok: false,
      error: {
        code: "SDK_BOOTSTRAP_FAILED",
        error: sdk.error,
      },
    }
  }

  const loadedSkills = await runtimeDeps.loadDeployedSkills({
    additionalRoots: input.skillRoots,
  })
  if (!loadedSkills.ok) {
    return {
      ok: false,
      error: {
        code: "SKILL_LOAD_FAILED",
        error: loadedSkills.error,
      },
    }
  }

  return {
    ok: true,
    value: {
      startup: startup.value,
      sdk: sdk.value,
      loadedSkills: loadedSkills.value,
    },
  }
}

export type { SessionInfo }
