export const COMPOSITION_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

export const FORK_CAPABILITIES = [
  "session-name",
  "active-child-query",
  "background-launch",
  "message-provenance",
  "prompt-wrapper",
] as const

export const STARTUP_WARNING_CODES = ["FORK_URL_MISMATCH", "FORK_URL_INVALID"] as const

export const STARTUP_ERROR_CODES = [
  "STARTUP_SERVER_URL_MISSING",
  "STARTUP_SERVER_URL_INVALID",
  "HOST_HEALTH_TIMEOUT",
  "HOST_HEALTH_UNREACHABLE",
  "HOST_HEALTH_INVALID",
  "PROBE_FAILED",
  "SDK_BOOTSTRAP_FAILED",
] as const

type ForkCapabilityID = (typeof FORK_CAPABILITIES)[number]
type StartupWarningCode = (typeof STARTUP_WARNING_CODES)[number]
type StartupErrorCode = (typeof STARTUP_ERROR_CODES)[number]

function capability(id: ForkCapabilityID, available: boolean) {
  return {
    id,
    available,
    gatingChange: `gating:${id}`,
  }
}

export function makeCompositionOnlyReport(serverUrl = "http://127.0.0.1:4099") {
  return {
    serverUrl,
    mode: "composition-only",
    composition: COMPOSITION_SURFACES.map((id) => ({ id, available: true as const })),
    fork: FORK_CAPABILITIES.map((id) => capability(id, false)),
    probedAt: Date.now(),
  }
}

export function makeForkAvailableReport(options?: {
  readonly serverUrl?: string
  readonly availableCapabilities?: ReadonlyArray<ForkCapabilityID>
}) {
  const available = new Set(options?.availableCapabilities ?? FORK_CAPABILITIES)
  return {
    serverUrl: options?.serverUrl ?? "http://127.0.0.1:4100",
    mode: "fork-available",
    composition: COMPOSITION_SURFACES.map((id) => ({ id, available: true as const })),
    fork: FORK_CAPABILITIES.map((id) => capability(id, available.has(id))),
    probedAt: Date.now(),
  }
}

export function makeStartupWarning(code: StartupWarningCode = "FORK_URL_MISMATCH") {
  return {
    code,
    message: `warning:${code}`,
  }
}

export function makeHostReadiness(options?: { readonly serverUrl?: string; readonly healthPath?: string }) {
  const serverUrl = options?.serverUrl ?? "http://127.0.0.1:4099"
  const healthPath = options?.healthPath ?? "/global/health"
  return {
    checkedUrl: serverUrl,
    healthUrl: `${serverUrl}${healthPath}`,
    healthy: true as const,
    respondedAt: 1,
    version: "test-version",
  }
}

export function makeStartupSuccess(options?: {
  readonly serverUrl?: string
  readonly mode?: "composition-only" | "fork-available"
  readonly warnings?: ReadonlyArray<{ readonly code: StartupWarningCode; readonly message: string }>
}) {
  const report =
    options?.mode === "fork-available"
      ? makeForkAvailableReport({ serverUrl: options.serverUrl })
      : makeCompositionOnlyReport(options?.serverUrl)

  return {
    serverUrl: report.serverUrl,
    mode: report.mode,
    report,
    readiness: makeHostReadiness({ serverUrl: report.serverUrl }),
    warnings: options?.warnings ?? [],
    timingsMs: {
      total: 100,
      readiness: 20,
      probe: 40,
      sdk: 40,
    },
  }
}

export function makeStartupError(code: StartupErrorCode) {
  if (code === "STARTUP_SERVER_URL_MISSING") {
    return { code }
  }
  if (code === "STARTUP_SERVER_URL_INVALID") {
    return {
      code,
      value: "not-a-url",
      cause: "Invalid URL",
    }
  }
  if (code === "HOST_HEALTH_TIMEOUT") {
    return {
      code,
      healthUrl: "http://127.0.0.1:4099/global/health",
      timeoutMs: 1500,
    }
  }
  if (code === "HOST_HEALTH_UNREACHABLE") {
    return {
      code,
      healthUrl: "http://127.0.0.1:4099/global/health",
      cause: "network",
    }
  }
  if (code === "HOST_HEALTH_INVALID") {
    return {
      code,
      healthUrl: "http://127.0.0.1:4099/global/health",
      detail: "healthy must be true",
    }
  }
  if (code === "PROBE_FAILED") {
    return {
      code,
      error: {
        code: "OPENCODE_UNREACHABLE",
        serverUrl: "http://127.0.0.1:4099",
        cause: "network",
      },
    }
  }

  return {
    code: "SDK_BOOTSTRAP_FAILED" as const,
    error: {
      code: "SDK_CONNECTION_FAILED",
      serverUrl: "http://127.0.0.1:4099",
      cause: "network",
    },
  }
}

export function makeStartupSuccessResult(options?: {
  readonly serverUrl?: string
  readonly mode?: "composition-only" | "fork-available"
  readonly warnings?: ReadonlyArray<{ readonly code: StartupWarningCode; readonly message: string }>
}) {
  return {
    ok: true as const,
    value: makeStartupSuccess(options),
  }
}

export function makeStartupFailureResult(code: StartupErrorCode) {
  return {
    ok: false as const,
    error: makeStartupError(code),
  }
}
