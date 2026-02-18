import { describe, expect, test } from "bun:test"
import {
  STARTUP_ERROR_CODES,
  makeCompositionOnlyReport,
  makeHostReadiness,
  makeStartupError,
} from "../helpers/contracts"
import { loadStartupOrchestratorModule } from "../helpers/module-loader"

describe("unit startup-orchestrator contracts", () => {
  test("T-07 success path executes readiness -> probe -> sdk in order", async () => {
    const runtime = await loadStartupOrchestratorModule()
    const calls: string[] = []

    const result = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => {
          calls.push("readiness")
          return { ok: true, value: makeHostReadiness() }
        },
        probeIntegrationCapabilities: async () => {
          calls.push("probe")
          return { ok: true, value: makeCompositionOnlyReport() }
        },
        createHarnessSDKClient: async () => {
          calls.push("sdk")
          return { ok: true, value: { session: {}, teammate: {} } }
        },
      },
    )

    expect(calls).toEqual(["readiness", "probe", "sdk"])
    expect(result.ok).toBe(true)
  })

  test("T-08 readiness failure short-circuits and skips later stages", async () => {
    const runtime = await loadStartupOrchestratorModule()
    let probeCalls = 0
    let sdkCalls = 0

    const result = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({
          ok: false,
          error: makeStartupError("HOST_HEALTH_UNREACHABLE"),
        }),
        probeIntegrationCapabilities: async () => {
          probeCalls += 1
          return { ok: true, value: makeCompositionOnlyReport() }
        },
        createHarnessSDKClient: async () => {
          sdkCalls += 1
          return { ok: true, value: { session: {}, teammate: {} } }
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("HOST_HEALTH_UNREACHABLE")
    }
    expect(probeCalls).toBe(0)
    expect(sdkCalls).toBe(0)
  })

  test("T-09 probe failures wrap as PROBE_FAILED and skip sdk", async () => {
    const runtime = await loadStartupOrchestratorModule()
    let sdkCalls = 0

    const result = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({ ok: true, value: makeHostReadiness() }),
        probeIntegrationCapabilities: async () => ({
          ok: false,
          error: {
            code: "OPENCODE_UNREACHABLE",
            serverUrl: "http://127.0.0.1:4099",
            cause: "network",
          },
        }),
        createHarnessSDKClient: async () => {
          sdkCalls += 1
          return { ok: true, value: { session: {}, teammate: {} } }
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("PROBE_FAILED")
      expect(result.error.error.code).toBe("OPENCODE_UNREACHABLE")
    }
    expect(sdkCalls).toBe(0)
  })

  test("T-10 sdk failures wrap as SDK_BOOTSTRAP_FAILED", async () => {
    const runtime = await loadStartupOrchestratorModule()

    const result = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({ ok: true, value: makeHostReadiness() }),
        probeIntegrationCapabilities: async () => ({ ok: true, value: makeCompositionOnlyReport() }),
        createHarnessSDKClient: async () => ({
          ok: false,
          error: {
            code: "SDK_CONNECTION_FAILED",
            serverUrl: "http://127.0.0.1:4099",
            cause: "network",
          },
        }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("SDK_BOOTSTRAP_FAILED")
      expect(result.error.error.code).toBe("SDK_CONNECTION_FAILED")
    }
  })

  test("T-11 orchestrator uses injected clock with exact five reads and deterministic timings", async () => {
    const runtime = await loadStartupOrchestratorModule()
    const reads = [100, 130, 160, 220, 230]
    let count = 0

    const result = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({ ok: true, value: makeHostReadiness() }),
        probeIntegrationCapabilities: async () => ({ ok: true, value: makeCompositionOnlyReport() }),
        createHarnessSDKClient: async () => ({ ok: true, value: { session: {}, teammate: {} } }),
        clock: {
          nowMs: () => {
            const value = reads[count] ?? reads[reads.length - 1]
            count += 1
            return value
          },
        },
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(count).toBe(5)
      expect(result.value.timingsMs.readiness).toBe(30)
      expect(result.value.timingsMs.probe).toBe(30)
      expect(result.value.timingsMs.sdk).toBe(60)
      expect(result.value.timingsMs.total).toBe(130)
      expect(typeof result.value.serverUrl).toBe("string")
      expect(typeof result.value.mode).toBe("string")
      expect(typeof result.value.report).toBe("object")
      expect(typeof result.value.readiness).toBe("object")
      expect(Array.isArray(result.value.warnings)).toBe(true)
    }
  })

  test("T-20 orchestrator failures emit declared startup error discriminants", async () => {
    const runtime = await loadStartupOrchestratorModule()
    const allowed = new Set<string>(STARTUP_ERROR_CODES)

    const probeFailure = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({ ok: true, value: makeHostReadiness() }),
        probeIntegrationCapabilities: async () => ({
          ok: false,
          error: {
            code: "OPENCODE_UNREACHABLE",
            serverUrl: "http://127.0.0.1:4099",
            cause: "network",
          },
        }),
      },
    )

    const sdkFailure = await runtime.startHarnessRuntime(
      {
        serverUrl: "http://127.0.0.1:4099",
        cwd: "/tmp",
        timeoutMs: 1500,
        healthPath: "/global/health",
      },
      {
        checkHostReadiness: async () => ({ ok: true, value: makeHostReadiness() }),
        probeIntegrationCapabilities: async () => ({ ok: true, value: makeCompositionOnlyReport() }),
        createHarnessSDKClient: async () => ({
          ok: false,
          error: {
            code: "SDK_CONNECTION_FAILED",
            serverUrl: "http://127.0.0.1:4099",
            cause: "network",
          },
        }),
      },
    )

    expect(probeFailure.ok).toBe(false)
    if (!probeFailure.ok) {
      expect(allowed.has(probeFailure.error.code)).toBe(true)
    }
    expect(sdkFailure.ok).toBe(false)
    if (!sdkFailure.ok) {
      expect(allowed.has(sdkFailure.error.code)).toBe(true)
    }
  })
})
