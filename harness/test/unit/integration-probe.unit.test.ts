import { describe, expect, test } from "bun:test"
import { makeCompositionOnlyReport } from "../helpers/contracts"
import { loadIntegrationProbeModule } from "../helpers/module-loader"

describe("unit integration-probe contracts", () => {
  test("T-04 missing composition surface returns MISSING_REQUIRED_SURFACE", async () => {
    const runtime = await loadIntegrationProbeModule()
    const report = makeCompositionOnlyReport()
    const degraded = {
      ...report,
      composition: report.composition.filter((surface) => surface.id !== "tool-registry"),
    }

    const result = runtime.requireCompositionSurface(degraded, "tool-registry")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("MISSING_REQUIRED_SURFACE")
      expect(result.error.surface).toBe("tool-registry")
    }
  })

  test("T-05 hasForkCapability reflects report truth table exactly", async () => {
    const runtime = await loadIntegrationProbeModule()
    const report = makeCompositionOnlyReport()
    const mixed = {
      ...report,
      fork: report.fork.map((item) => {
        if (item.id === "session-name" || item.id === "message-provenance") {
          return { ...item, available: true }
        }
        return { ...item, available: false }
      }),
    }

    expect(runtime.hasForkCapability(mixed, "session-name")).toBe(true)
    expect(runtime.hasForkCapability(mixed, "message-provenance")).toBe(true)
    expect(runtime.hasForkCapability(mixed, "background-launch")).toBe(false)
    expect(runtime.hasForkCapability(mixed, "active-child-query")).toBe(false)
    expect(runtime.hasForkCapability(mixed, "prompt-wrapper")).toBe(false)
  })
})
