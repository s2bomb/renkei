import type { HostHealthPayload, HostReadiness, HostReadinessInput, Result, StartupError } from "./types"

function isHostHealthPayload(value: unknown): value is HostHealthPayload {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as { healthy?: unknown }
  return record.healthy === true
}

function getHealthUrl(serverUrl: string, healthPath: string): string {
  return new URL(healthPath, serverUrl).toString().replace(/\/$/, "")
}

export async function checkHostReadiness(input: HostReadinessInput): Promise<Result<HostReadiness, StartupError>> {
  const healthUrl = getHealthUrl(input.serverUrl, input.healthPath)
  const controller = new AbortController()
  let didTimeout = false
  const timeout = setTimeout(() => {
    didTimeout = true
    controller.abort("timeout")
  }, input.timeoutMs)

  try {
    const response = await fetch(healthUrl, { signal: controller.signal })
    const payload: unknown = await response.json()

    if (!isHostHealthPayload(payload)) {
      return {
        ok: false,
        error: {
          code: "HOST_HEALTH_INVALID",
          healthUrl,
          detail: "health payload must include healthy: true",
        },
      }
    }

    return {
      ok: true,
      value: {
        checkedUrl: input.serverUrl,
        healthUrl,
        healthy: true,
        respondedAt: Date.now(),
        version: payload.version,
      },
    }
  } catch (error) {
    if (didTimeout) {
      return {
        ok: false,
        error: {
          code: "HOST_HEALTH_TIMEOUT",
          healthUrl,
          timeoutMs: input.timeoutMs,
        },
      }
    }

    return {
      ok: false,
      error: {
        code: "HOST_HEALTH_UNREACHABLE",
        healthUrl,
        cause: String(error),
      },
    }
  } finally {
    clearTimeout(timeout)
  }
}
