import { describe, expect, test } from "bun:test"
import { INTEGRATION_DEPTH_ERROR_CODES, makeCompositionOnlyReport, makeForkAvailableReport } from "../helpers/contracts"
import { loadIntegrationDepthPolicyModule } from "../helpers/module-loader"

describe("unit integration-depth-policy contracts", () => {
  test("T2-13 default policy resolves to in-process-seam", async () => {
    const runtime = await loadIntegrationDepthPolicyModule()

    const result = runtime.resolveIntegrationDepth(makeCompositionOnlyReport())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.depth).toBe("in-process-seam")
      expect(result.value.reason.length > 0).toBe(true)
    }
  })

  test("T2-14 composition-only host-sdk without fallback returns typed unsupported", async () => {
    const runtime = await loadIntegrationDepthPolicyModule()
    const allowed = new Set<string>(INTEGRATION_DEPTH_ERROR_CODES)

    const result = runtime.resolveIntegrationDepth(makeCompositionOnlyReport(), {
      preferredDepth: "host-sdk",
      allowFallback: false,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("INTEGRATION_DEPTH_UNSUPPORTED")
      expect(result.error.requested).toBe("host-sdk")
      expect(result.error.mode).toBe("composition-only")
    }
  })

  test("T2-15 composition-only host-sdk with fallback degrades explicitly", async () => {
    const runtime = await loadIntegrationDepthPolicyModule()

    const result = runtime.resolveIntegrationDepth(makeCompositionOnlyReport(), {
      preferredDepth: "host-sdk",
      allowFallback: true,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.depth).toBe("in-process-seam")
      expect(/fallback|host-sdk|unsupported/i.test(result.value.reason)).toBe(true)
    }
  })

  test("T2-16 fork-available mode permits host-sdk depth", async () => {
    const runtime = await loadIntegrationDepthPolicyModule()

    const result = runtime.resolveIntegrationDepth(makeForkAvailableReport(), {
      preferredDepth: "host-sdk",
      allowFallback: false,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.depth).toBe("host-sdk")
      expect(/fallback/i.test(result.value.reason)).toBe(false)
    }
  })

  test("T2-17 default policy returns canonical section-2 values", async () => {
    const runtime = await loadIntegrationDepthPolicyModule()

    const policy = runtime.defaultIntegrationDepthPolicy()
    expect(policy.preferredDepth).toBe("in-process-seam")
    expect(policy.allowFallback).toBe(true)
  })
})
