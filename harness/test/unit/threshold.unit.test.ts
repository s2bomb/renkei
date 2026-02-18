import { describe, expect, test } from "bun:test"
import { makeCompositionOnlyReport, makeForkAvailableReport } from "../helpers/contracts"
import { loadForkThresholdModule } from "../helpers/module-loader"

describe("unit threshold contracts", () => {
  test("T-14 threshold table is complete and evidence-backed", async () => {
    const runtime = await loadForkThresholdModule()
    const thresholds = runtime.listForkThresholds()

    expect(thresholds).toHaveLength(5)
    for (const entry of thresholds) {
      expect(typeof entry.schemaEvidence).toBe("string")
      expect(entry.schemaEvidence.length).toBeGreaterThan(0)
      expect(typeof entry.runtimeEvidence).toBe("string")
      expect(entry.runtimeEvidence.length).toBeGreaterThan(0)
      expect(typeof entry.diffPreview).toBe("string")
      expect(entry.diffPreview.length).toBeGreaterThan(0)
    }
  })

  test("T-15 evaluateThreshold returns required mode on unavailable capability", async () => {
    const runtime = await loadForkThresholdModule()
    const report = makeCompositionOnlyReport()

    const result = runtime.evaluateForkThreshold("background-launch", report)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.mode).toBe("fork-required")
      expect(result.value.capability).toBe("background-launch")
    }
  })

  test("T-16 evaluateThreshold returns compose mode when capability is available", async () => {
    const runtime = await loadForkThresholdModule()
    const report = makeForkAvailableReport({ availableCapabilities: ["session-name"] })

    const result = runtime.evaluateForkThreshold("session-name", report)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.mode).toBe("compose")
      expect(result.value.capability).toBe("session-name")
    }
  })

  test("T-17 requireCapability returns FORK_CAPABILITY_UNAVAILABLE when missing", async () => {
    const runtime = await loadForkThresholdModule()
    const report = makeCompositionOnlyReport()

    const result = runtime.requireForkCapability("active-child-query", report)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("FORK_CAPABILITY_UNAVAILABLE")
      expect(result.error.capability).toBe("active-child-query")
    }
  })

  test("T-18 describeBoundary partitions compose vs required correctly", async () => {
    const runtime = await loadForkThresholdModule()
    const report = makeForkAvailableReport({
      availableCapabilities: ["session-name", "background-launch"],
    })

    const result = runtime.describeForkBoundary(report)
    expect(result.composable).toHaveLength(2)
    expect(result.forkRequired).toHaveLength(3)

    const ids = new Set<string>()
    for (const item of [...result.composable, ...result.forkRequired]) {
      expect(ids.has(item.capability)).toBe(false)
      ids.add(item.capability)
    }
    expect(ids.size).toBe(5)
  })
})
