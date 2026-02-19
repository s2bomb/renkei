import { recordSpan } from "./observability"
import {
  COMPOSITION_SURFACE_IDS,
  type CapabilityReport,
  type CompositionSurfaceID,
  type ProbeError,
  type Result,
} from "./types"

const DEFAULT_TIMEOUT_MS = 1500

async function verifyReachable(serverUrl: string, timeoutMs: number): Promise<Result<true, ProbeError>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)
  try {
    await fetch(serverUrl, { signal: controller.signal })
    return { ok: true, value: true }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "OPENCODE_UNREACHABLE",
        serverUrl,
        cause: String(error),
      },
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function probeIntegrationCapabilities(
  serverUrl: string,
  options?: { readonly timeoutMs?: number },
): Promise<Result<CapabilityReport, ProbeError>> {
  const startedAt = Date.now()
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const reachable = await verifyReachable(serverUrl, timeoutMs)
  if (!reachable.ok) {
    recordSpan("harness.integration.probe", {
      server_url: serverUrl,
      error_code: reachable.error.code,
      probe_duration_ms: Date.now() - startedAt,
    })
    return reachable
  }

  const report: CapabilityReport = {
    serverUrl,
    composition: COMPOSITION_SURFACE_IDS.map((id) => ({ id, available: true })),
    probedAt: Date.now(),
  }

  recordSpan("harness.integration.probe", {
    server_url: serverUrl,
    composition_count: report.composition.length,
    probe_duration_ms: Date.now() - startedAt,
  })
  return { ok: true, value: report }
}

export function requireCompositionSurface(
  report: CapabilityReport,
  surface: CompositionSurfaceID,
): Result<true, ProbeError> {
  const exists = report.composition.some((item) => item.id === surface && item.available)
  if (exists) {
    return { ok: true, value: true }
  }
  return {
    ok: false,
    error: {
      code: "MISSING_REQUIRED_SURFACE",
      surface,
      message: `Required composition surface unavailable: ${surface}`,
    },
  }
}
