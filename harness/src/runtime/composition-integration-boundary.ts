import { createHarnessSDKClient, loadDeployedSkills, type SessionInfo } from "./composition-seam"
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
  StartupWarning,
} from "./types"

export type CompositionBoundaryInput = {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly warning?: StartupWarning
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
  readonly createHarnessSDKClient: typeof createHarnessSDKClient
  readonly loadDeployedSkills: typeof loadDeployedSkills
}

const REQUIRED_SURFACES: ReadonlyArray<CompositionSurfaceID> = [
  "tool-registry",
  "plugin-hooks",
  "skill-load",
  "sdk-client",
]

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
    createHarnessSDKClient,
    loadDeployedSkills,
    ...deps,
  }

  const startup = await runtimeDeps.startHarnessRuntime({
    serverUrl: input.serverUrl,
    cwd: input.cwd,
    timeoutMs: input.timeoutMs,
    healthPath: input.healthPath,
    warning: input.warning,
  })
  if (!startup.ok) {
    return startup
  }

  const surfaces = assertRequiredSurfaces(startup.value.report, REQUIRED_SURFACES)
  if (!surfaces.ok) {
    return surfaces
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
