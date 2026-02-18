import type { CapabilityReport, Result } from "./types"

export type IntegrationDepth = "in-process-seam" | "host-sdk"

export type IntegrationDepthPolicy = {
  readonly preferredDepth: IntegrationDepth
  readonly allowFallback: boolean
}

export type IntegrationDepthDecision = {
  readonly depth: IntegrationDepth
  readonly reason: string
}

export type IntegrationDepthError = {
  readonly code: "INTEGRATION_DEPTH_UNSUPPORTED"
  readonly requested: IntegrationDepth
  readonly mode: "composition-only" | "fork-available"
  readonly reason: string
}

export function defaultIntegrationDepthPolicy(): IntegrationDepthPolicy {
  return {
    preferredDepth: "in-process-seam",
    allowFallback: true,
  }
}

export function resolveIntegrationDepth(
  report: CapabilityReport,
  policy?: IntegrationDepthPolicy,
): Result<IntegrationDepthDecision, IntegrationDepthError> {
  const resolvedPolicy = policy ?? defaultIntegrationDepthPolicy()
  if (resolvedPolicy.preferredDepth === "in-process-seam") {
    return {
      ok: true,
      value: {
        depth: "in-process-seam",
        reason: "Selected in-process-seam depth for composition runtime compatibility",
      },
    }
  }

  if (report.mode !== "composition-only") {
    return {
      ok: true,
      value: {
        depth: "host-sdk",
        reason: "Selected host-sdk depth because fork capabilities are available",
      },
    }
  }

  if (!resolvedPolicy.allowFallback) {
    return {
      ok: false,
      error: {
        code: "INTEGRATION_DEPTH_UNSUPPORTED",
        requested: resolvedPolicy.preferredDepth,
        mode: report.mode,
        reason: "host-sdk depth is unsupported in composition-only mode",
      },
    }
  }

  return {
    ok: true,
    value: {
      depth: "in-process-seam",
      reason: "Fallback to in-process-seam because host-sdk is unsupported in composition-only mode",
    },
  }
}
