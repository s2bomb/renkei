import { describe, expect, test } from "bun:test"
import {
  BASELINE_VIOLATION_ERROR_CODES,
  makeCompositionOnlyReport,
  makeCompositionOnlyReportWithForkLeak,
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
  test("T2-08 composition-only baseline passes with required status fields", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    const result = runtime.evaluateNoDegradationBaseline({
      report: makeCompositionOnlyReport(),
      startup: makeStartupSuccess(),
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.status.compositionSurfaceCount).toBe(4)
      expect(result.value.status.forkAvailableCount).toBe(0)
      expect(result.value.status.mode).toBe("composition-only")
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

  test("T2-10 unexpected fork availability in composition-only fails loudly", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    const leaked = makeCompositionOnlyReportWithForkLeak({
      leakedCapabilities: ["background-launch", "message-provenance"],
    })

    const result = runtime.evaluateNoDegradationBaseline({
      report: leaked,
      startup: makeStartupSuccess(),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("BASELINE_UNEXPECTED_FORK_AVAILABILITY")
      expect(result.error.mode).toBe("composition-only")
      expect(result.error.availableCapabilities.includes("background-launch")).toBe(true)
    }
  })

  test("T2-11 missing startup timing fields return BASELINE_STARTUP_TIMINGS_MISSING", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    for (const field of ["total", "readiness", "probe", "sdk"] as const) {
      const result = runtime.evaluateNoDegradationBaseline({
        report: makeCompositionOnlyReport(),
        startup: startupWithoutTiming(field),
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe("BASELINE_STARTUP_TIMINGS_MISSING")
        expect(result.error.field).toBe(field)
      }
    }
  })

  test("T2-12 default requirement returns canonical no-degradation constants", async () => {
    const runtime = await loadNoDegradationBaselineModule()

    const requirement = runtime.defaultBaselineRequirement()
    expect(requirement.requiredCompositionSurfaceCount).toBe(4)
    expect(requirement.requireForkUnavailableInCompositionOnly).toBe(true)
    expect(requirement.requireStartupTimingFields).toBe(true)
  })
})
