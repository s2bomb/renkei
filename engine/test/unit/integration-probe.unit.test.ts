import { describe, expect, test } from "bun:test"
import { makeCompositionReport } from "../helpers/contracts"
import { loadIntegrationProbeModule } from "../helpers/module-loader"

describe("unit integration-probe contracts", () => {
  test("T-04 missing composition surface returns MISSING_REQUIRED_SURFACE", async () => {
    const runtime = await loadIntegrationProbeModule()
    const report = makeCompositionReport()
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
})
