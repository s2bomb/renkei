export const COMPOSITION_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

export const STARTUP_ERROR_CODES = [
  "STARTUP_SERVER_URL_MISSING",
  "STARTUP_SERVER_URL_INVALID",
  "HOST_HEALTH_TIMEOUT",
  "HOST_HEALTH_UNREACHABLE",
  "HOST_HEALTH_INVALID",
  "PROBE_FAILED",
  "SDK_BOOTSTRAP_FAILED",
] as const

export const SECTION_2_BOUNDARY_ERROR_CODES = [
  ...STARTUP_ERROR_CODES,
  "APPROVED_SURFACE_REGISTRY_FAILED",
  "PURE_SURFACE_CONTRACT_FAILED",
  "SKILL_LOAD_FAILED",
  "COMPOSITION_SURFACE_MISSING",
] as const

export const BASELINE_VIOLATION_ERROR_CODES = [
  "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH",
  "BASELINE_STARTUP_TIMINGS_MISSING",
] as const

export const APPROVED_SURFACE_REGISTRY_ERROR_CODES = [
  "APPROVED_SURFACE_REGISTRY_NOT_FOUND",
  "APPROVED_SURFACE_REGISTRY_INVALID",
  "APPROVED_SURFACE_DUPLICATE_ID",
  "APPROVED_SURFACE_EMPTY",
] as const

export const PURE_SURFACE_GATE_ERROR_CODES = [
  "SURFACE_NOT_APPROVED",
  "REQUIRED_SURFACE_UNAVAILABLE",
  "SURFACE_REPORT_CONTAINS_DUPLICATE",
  "SURFACE_REPORT_EMPTY",
] as const

export const STALE_ASSUMPTION_SCANNER_ERROR_CODES = [
  "SCAN_ROOT_MISSING",
  "SCAN_TARGET_INVALID",
  "SCAN_IO_FAILURE",
] as const

export const PURITY_VERIFICATION_ERROR_CODES = [
  "PURITY_REGISTRY_FAILED",
  "PURITY_SURFACE_GATE_FAILED",
  "PURITY_STALE_ASSUMPTION_FAILED",
  "PURITY_STALE_ASSUMPTION_FOUND",
] as const

export const LIVE_PREREQ_ERROR_CODES = [
  "LIVE_PREREQ_SERVER_URL_MISSING",
  "LIVE_PREREQ_SERVER_URL_INVALID",
  "LIVE_PREREQ_REQUIRED_SURFACE_LIST_EMPTY",
  "LIVE_PREREQ_REQUIRED_SURFACE_DUPLICATE",
  "LIVE_PREREQ_REQUIRED_SURFACE_UNKNOWN",
  "LIVE_PREREQ_APPROVED_REGISTRY_PATH_INVALID",
] as const

export const NO_DEGRADATION_PIPELINE_ERROR_CODES = [
  "NO_DEGRADATION_PREREQUISITE_FAILED",
  "NO_DEGRADATION_BOUNDARY_FAILED",
  "NO_DEGRADATION_APPROVED_REGISTRY_FAILED",
  "NO_DEGRADATION_PURE_SURFACE_GATE_FAILED",
  "NO_DEGRADATION_BASELINE_FAILED",
] as const

export const WORKFLOW_SIGNOFF_ERROR_CODES = [
  "WORKFLOW_SIGNOFF_LIST_EMPTY",
  "WORKFLOW_SIGNOFF_DUPLICATE_ID",
  "WORKFLOW_SIGNOFF_COMMAND_FAILED",
  "WORKFLOW_SIGNOFF_LIVE_SERVER_REQUIRED",
] as const

export const SIGNAL_ERROR_CODES = [
  "SIGNAL_EXIT_CODE_MISMATCH",
  "SIGNAL_HUMAN_STRING_MISSING",
  "SIGNAL_JSON_MISSING",
  "SIGNAL_JSON_OK_FLAG_MISMATCH",
  "SIGNAL_JSON_EXIT_CODE_MISMATCH",
] as const

export const RUNBOOK_ARTIFACT_BINDING_ERROR_CODES = [
  "RUNBOOK_BINDING_ARTIFACT_EMPTY",
  "RUNBOOK_BINDING_TAG_MISSING",
  "RUNBOOK_BINDING_COMMAND_ID_SET_MISMATCH",
] as const

export const SMOKE_SEQUENCE_ERROR_CODES = [
  "SMOKE_SEQUENCE_LENGTH_INVALID",
  "SMOKE_SEQUENCE_STEP_MISMATCH",
  "SMOKE_SEQUENCE_COMMAND_EMPTY",
  "SMOKE_SEQUENCE_EXPECTED_EXIT_INVALID",
] as const

export const CWD_RESOLUTION_ERROR_CODES = [
  "RUNBOOK_CWD_NOT_ABSOLUTE",
  "RUNBOOK_CWD_PATH_TRAVERSAL",
  "RUNBOOK_CWD_LABEL_UNRESOLVED",
] as const

export const PREFLIGHT_ERROR_CODES = [
  "RUNBOOK_PREFLIGHT_ENV_MISSING",
  "RUNBOOK_PREFLIGHT_ENV_INVALID_URL",
  "RUNBOOK_PREFLIGHT_PATH_MISSING",
  "RUNBOOK_PREFLIGHT_CWD_INVALID",
] as const

export const EVIDENCE_ERROR_CODES = [
  "RUNBOOK_EVIDENCE_SEQUENCE_INVALID",
  "RUNBOOK_EVIDENCE_STEP_FAILED",
  "RUNBOOK_EVIDENCE_JSON_MISSING",
  "RUNBOOK_EVIDENCE_SIGNAL_INVALID",
] as const

type CompositionSurfaceID = (typeof COMPOSITION_SURFACES)[number]
type StartupErrorCode = (typeof STARTUP_ERROR_CODES)[number]

export function makeCompositionReport(serverUrl = "http://127.0.0.1:4099") {
  return {
    serverUrl,
    composition: COMPOSITION_SURFACES.map((id) => ({ id, available: true as const })),
    probedAt: Date.now(),
  }
}

export function makeCompositionReportMissingSurfaces(
  missing: ReadonlyArray<CompositionSurfaceID>,
  serverUrl = "http://127.0.0.1:4099",
) {
  const report = makeCompositionReport(serverUrl)
  const missingSet = new Set(missing)
  return {
    ...report,
    composition: report.composition.filter((surface) => !missingSet.has(surface.id)),
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

export function makeStartupSuccess(options?: { readonly serverUrl?: string }) {
  const report = makeCompositionReport(options?.serverUrl)

  return {
    serverUrl: report.serverUrl,
    report,
    readiness: makeHostReadiness({ serverUrl: report.serverUrl }),
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

export function makeStartupSuccessResult(options?: { readonly serverUrl?: string }) {
  return {
    ok: true as const,
    value: makeStartupSuccess(options),
  }
}

export function makeLoadedSkills() {
  return [
    {
      name: "test-designer",
      description: "Writes test specs",
      location: "/tmp/skills/test-designer/SKILL.md",
      content: "# Test Designer",
    },
    {
      name: "implement-plan",
      description: "Implements approved plans",
      location: "/tmp/skills/implement-plan/SKILL.md",
      content: "# Implement Plan",
    },
  ] as const
}

export function makeStartupFailureResult(code: StartupErrorCode) {
  return {
    ok: false as const,
    error: makeStartupError(code),
  }
}
