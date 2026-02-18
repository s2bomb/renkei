import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { loadHostReadinessModule } from "../helpers/module-loader"

type FetchType = typeof fetch

const originalFetch: FetchType = fetch

describe("unit host-readiness contracts", () => {
  beforeEach(() => {
    ;(globalThis as { fetch: FetchType }).fetch = originalFetch
  })

  afterEach(() => {
    ;(globalThis as { fetch: FetchType }).fetch = originalFetch
  })

  test("T-12 readiness success requires healthy true payload", async () => {
    const runtime = await loadHostReadinessModule()
    ;(globalThis as { fetch: FetchType }).fetch = async () => {
      return {
        json: async () => ({ healthy: true, version: "1.2.3" }),
      } as unknown as Response
    }

    const result = await runtime.checkHostReadiness({
      serverUrl: "http://127.0.0.1:4099",
      healthPath: "/global/health",
      timeoutMs: 100,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.healthy).toBe(true)
      expect(result.value.healthUrl).toBe("http://127.0.0.1:4099/global/health")
      expect(result.value.version).toBe("1.2.3")
    }
  })

  test("T-13 timeout path maps to HOST_HEALTH_TIMEOUT", async () => {
    const runtime = await loadHostReadinessModule()
    ;(globalThis as { fetch: FetchType }).fetch = (_url, init) => {
      return new Promise((_, reject) => {
        const signal = init?.signal as AbortSignal | undefined
        if (signal) {
          signal.addEventListener("abort", () => reject(new Error("aborted")))
        }
      })
    }

    const result = await runtime.checkHostReadiness({
      serverUrl: "http://127.0.0.1:4099",
      healthPath: "/global/health",
      timeoutMs: 1,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("HOST_HEALTH_TIMEOUT")
      expect(result.error.healthUrl).toBe("http://127.0.0.1:4099/global/health")
      expect(result.error.timeoutMs).toBe(1)
    }
  })

  test("T-14 network rejection maps to HOST_HEALTH_UNREACHABLE", async () => {
    const runtime = await loadHostReadinessModule()
    ;(globalThis as { fetch: FetchType }).fetch = async () => {
      throw new Error("connection refused")
    }

    const result = await runtime.checkHostReadiness({
      serverUrl: "http://127.0.0.1:4099",
      healthPath: "/global/health",
      timeoutMs: 50,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("HOST_HEALTH_UNREACHABLE")
      expect(result.error.healthUrl).toBe("http://127.0.0.1:4099/global/health")
      expect(result.error.cause.length).toBeGreaterThan(0)
    }
  })

  test("T-15 invalid payload table maps to HOST_HEALTH_INVALID", async () => {
    const runtime = await loadHostReadinessModule()
    const payloads: ReadonlyArray<unknown> = [{ healthy: false }, { version: "x" }, "not-an-object"]

    for (const payload of payloads) {
      ;(globalThis as { fetch: FetchType }).fetch = async () => {
        return {
          json: async () => payload,
        } as unknown as Response
      }

      const result = await runtime.checkHostReadiness({
        serverUrl: "http://127.0.0.1:4099",
        healthPath: "/global/health",
        timeoutMs: 100,
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe("HOST_HEALTH_INVALID")
        expect(result.error.detail.length).toBeGreaterThan(0)
      }
    }
  })
})
