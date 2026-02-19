import { COMPOSITION_SURFACE_IDS, type CompositionSurfaceID, type Result } from "./types"

export type LiveIntegrationPrerequisiteInput = {
  readonly serverUrlEnvVar: "OPENCODE_SERVER_URL"
  readonly serverUrlValue?: string
  readonly approvedSurfaceRegistryPath?: string
  readonly requiredSurfaces?: ReadonlyArray<CompositionSurfaceID>
}

export type LiveIntegrationPrerequisiteSuccess = {
  readonly checkedAtMs: number
  readonly serverUrl: string
  readonly approvedSurfaceRegistryPath: string
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
}

export type LiveIntegrationPrerequisiteError =
  | {
      readonly code: "LIVE_PREREQ_SERVER_URL_MISSING"
      readonly envVar: "OPENCODE_SERVER_URL"
    }
  | {
      readonly code: "LIVE_PREREQ_SERVER_URL_INVALID"
      readonly envVar: "OPENCODE_SERVER_URL"
      readonly value: string
      readonly cause: string
    }
  | {
      readonly code: "LIVE_PREREQ_REQUIRED_SURFACE_LIST_EMPTY"
    }
  | {
      readonly code: "LIVE_PREREQ_REQUIRED_SURFACE_DUPLICATE"
      readonly surface: string
    }
  | {
      readonly code: "LIVE_PREREQ_REQUIRED_SURFACE_UNKNOWN"
      readonly surface: string
      readonly allowed: ReadonlyArray<CompositionSurfaceID>
    }
  | {
      readonly code: "LIVE_PREREQ_APPROVED_REGISTRY_PATH_INVALID"
      readonly path: string
      readonly detail: string
    }

export type LiveIntegrationPrerequisiteDependencies = {
  readonly nowMs: () => number
  readonly parseUrl: (value: string) => Result<string, { readonly cause: string }>
}

type PathValidationDetail =
  | "EMPTY_PATH"
  | "ABSOLUTE_PATH"
  | "PATH_SEPARATOR_INVALID"
  | "DOT_SEGMENT"
  | "PARENT_SEGMENT"
  | "NOT_JSON_FILE"

const DEFAULT_APPROVED_SURFACE_REGISTRY_PATH = "config/approved-opencode-surfaces.json"
const ALLOWED_SURFACE_IDS = new Set<CompositionSurfaceID>(COMPOSITION_SURFACE_IDS)

function defaultParseUrl(value: string): Result<string, { readonly cause: string }> {
  const normalized = value.trim()
  try {
    void new URL(normalized)
    return { ok: true, value: normalized }
  } catch (error) {
    return {
      ok: false,
      error: {
        cause: String(error),
      },
    }
  }
}

function validateApprovedRegistryPath(path: string): PathValidationDetail | null {
  const normalized = path.trim()
  if (normalized.length === 0) {
    return "EMPTY_PATH"
  }

  if (normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized)) {
    return "ABSOLUTE_PATH"
  }

  if (normalized.includes("\\")) {
    return "PATH_SEPARATOR_INVALID"
  }

  const segments = normalized.split("/")
  for (const segment of segments) {
    if (segment === ".") {
      return "DOT_SEGMENT"
    }
  }

  for (const segment of segments) {
    if (segment === "..") {
      return "PARENT_SEGMENT"
    }
  }

  if (!normalized.endsWith(".json")) {
    return "NOT_JSON_FILE"
  }

  return null
}

export function defaultRequiredSectionDSurfaces(): ReadonlyArray<CompositionSurfaceID> {
  return COMPOSITION_SURFACE_IDS
}

export function verifyLiveIntegrationPrerequisites(
  input: LiveIntegrationPrerequisiteInput,
  deps?: Partial<LiveIntegrationPrerequisiteDependencies>,
): Result<LiveIntegrationPrerequisiteSuccess, LiveIntegrationPrerequisiteError> {
  const runtimeDeps: LiveIntegrationPrerequisiteDependencies = {
    nowMs: Date.now,
    parseUrl: defaultParseUrl,
    ...deps,
  }

  if (!input.serverUrlValue) {
    return {
      ok: false,
      error: {
        code: "LIVE_PREREQ_SERVER_URL_MISSING",
        envVar: input.serverUrlEnvVar,
      },
    }
  }

  const parsedServerUrl = runtimeDeps.parseUrl(input.serverUrlValue)
  if (!parsedServerUrl.ok) {
    return {
      ok: false,
      error: {
        code: "LIVE_PREREQ_SERVER_URL_INVALID",
        envVar: input.serverUrlEnvVar,
        value: input.serverUrlValue,
        cause: `${parsedServerUrl.error.cause}:`,
      },
    }
  }

  const requiredSurfaces = input.requiredSurfaces ?? defaultRequiredSectionDSurfaces()
  if (requiredSurfaces.length === 0) {
    return {
      ok: false,
      error: {
        code: "LIVE_PREREQ_REQUIRED_SURFACE_LIST_EMPTY",
      },
    }
  }

  const seen = new Set<string>()
  for (const surface of requiredSurfaces) {
    if (seen.has(surface)) {
      return {
        ok: false,
        error: {
          code: "LIVE_PREREQ_REQUIRED_SURFACE_DUPLICATE",
          surface,
        },
      }
    }

    if (!ALLOWED_SURFACE_IDS.has(surface)) {
      return {
        ok: false,
        error: {
          code: "LIVE_PREREQ_REQUIRED_SURFACE_UNKNOWN",
          surface,
          allowed: COMPOSITION_SURFACE_IDS,
        },
      }
    }

    seen.add(surface)
  }

  const approvedSurfaceRegistryPath = input.approvedSurfaceRegistryPath ?? DEFAULT_APPROVED_SURFACE_REGISTRY_PATH
  const pathDetail = validateApprovedRegistryPath(approvedSurfaceRegistryPath)
  if (pathDetail) {
    return {
      ok: false,
      error: {
        code: "LIVE_PREREQ_APPROVED_REGISTRY_PATH_INVALID",
        path: approvedSurfaceRegistryPath,
        detail: pathDetail,
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: runtimeDeps.nowMs(),
      serverUrl: parsedServerUrl.value,
      approvedSurfaceRegistryPath,
      requiredSurfaces,
    },
  }
}
