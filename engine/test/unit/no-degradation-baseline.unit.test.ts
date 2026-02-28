import { describe, expect, test } from "bun:test"
import {
  BASELINE_VIOLATION_ERROR_CODES,
  makeCompositionReport,
  makeCompositionReportMissingSurfaces,
  makeStartupSuccess,
} from "../helpers/contracts"
import { loadNoDegradationBaselineModule } from "../helpers/module-loader"

type TimingField = "total" | "readiness" | "probe" | "sdk"

function startupWithoutTiming(field: TimingField) {
  const startup = makeStartupSuccess()
  const timings = { ...startup.timingsMs }
  const partial = timings as Partial<typeof timings>
  delete partial[field]
  return {
    ...startup,
    timingsMs: partial,
  } as unknown
}

describe("unit no-degradation-baseline contracts", () => {
  test("T2-08 composition baseline passes with required status fields", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    const result = runtime.evaluateNoDegradationBaseline({
      report: makeCompositionReport(),
      startup: makeStartupSuccess(),
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.status.compositionSurfaceCount).toBe(4)
      expect(result.value.status.timingsPresent).toBe(true)
    }
  })

  test("T2-09 composition surface count mismatch returns typed error", async () => {
    const runtime = await loadNoDegradationBaselineModule()
    const allowed = new Set<string>(BASELINE_VIOLATION_ERROR_CODES)

    const result = runtime.evaluateNoDegradationBaseline({
      report: makeCompositionReportMissingSurfaces(["tool-registry"]),
      startup: makeStartupSuccess(),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH")
      expect(result.error.expected).toBe(4)
      expect(result.error.actual).toBe(3)
    }
  })

  test("T2-11 missing startup timing fields return BASELINE_STARTUP_TIMINGS_MISSING", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    for (const field of ["total", "readiness", "probe", "sdk"] as const) {
      const result = runtime.evaluateNoDegradationBaseline({
        report: makeCompositionReport(),
        startup: startupWithoutTiming(field),
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe("BASELINE_STARTUP_TIMINGS_MISSING")
        expect(result.error.field).toBe(field)
      }
    }
  })

})
