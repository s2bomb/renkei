import { describe, expect, test } from "bun:test"
import {
  COMPOSITION_SURFACES,
  PURE_SURFACE_GATE_ERROR_CODES,
  makeCompositionReport,
  makeCompositionReportMissingSurfaces,
} from "../helpers/contracts"
import { loadPureSurfaceGateModule } from "../helpers/module-loader"

const CANONICAL_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

function makeApprovedRegistry() {
  return {
    version: "2026-02-19",
    sourcePath: "harness/config/approved-opencode-surfaces.json",
    generatedAtMs: 111,
    entries: CANONICAL_SURFACES.map((id) => ({
      id,
      seam: id,
      upstreamSurface: `upstream:${id}`,
      rationale: `rationale:${id}`,
    })),
  }
}

describe("unit section-2 pure-surface-gate contracts", () => {
  test("S2-T09 all approved required surfaces available returns deterministic evaluation", async () => {
    const runtime = await loadPureSurfaceGateModule()
    const report = makeCompositionReport()

    const result = runtime.enforcePureSurfaceContract(
      {
        report,
        requiredSurfaces: [...COMPOSITION_SURFACES],
        approvedRegistry: makeApprovedRegistry(),
      },
      () => 9090,
    )

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.checkedAtMs).toBe(9090)
    expect(result.value.required).toEqual(COMPOSITION_SURFACES)
    expect(result.value.approved).toEqual(COMPOSITION_SURFACES)
    expect(result.value.reportSurfaceCount).toBe(report.composition.length)
  })

  test("S2-T10 unknown report surface fails with SURFACE_NOT_APPROVED", async () => {
    const runtime = await loadPureSurfaceGateModule()
    const baseReport = makeCompositionReport()
    const report = {
      ...baseReport,
      composition: [
        ...baseReport.composition,
        {
          id: "experimental-surface",
          available: true,
        },
      ],
    }
    const allowed = new Set<string>(PURE_SURFACE_GATE_ERROR_CODES)

    const result = runtime.enforcePureSurfaceContract({
      report,
      requiredSurfaces: [...COMPOSITION_SURFACES],
      approvedRegistry: makeApprovedRegistry(),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(allowed.has(result.error.code)).toBe(true)
    expect(result.error.code).toBe("SURFACE_NOT_APPROVED")
    expect(result.error.surface).toBe("experimental-surface")
    expect(result.error.approved).toEqual(COMPOSITION_SURFACES)
  })

  test("S2-T11 missing required approved surface fails with REQUIRED_SURFACE_UNAVAILABLE", async () => {
    const runtime = await loadPureSurfaceGateModule()
    const report = makeCompositionReportMissingSurfaces(["skill-load"])

    const result = runtime.enforcePureSurfaceContract({
      report,
      requiredSurfaces: [...COMPOSITION_SURFACES],
      approvedRegistry: makeApprovedRegistry(),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("REQUIRED_SURFACE_UNAVAILABLE")
    expect(result.error.surface).toBe("skill-load")
    expect(result.error.probeError.code).toBe("MISSING_REQUIRED_SURFACE")
    expect(result.error.probeError.surface).toBe("skill-load")
  })

  test("S2-T12 duplicate reported surfaces fail at first duplicate", async () => {
    const runtime = await loadPureSurfaceGateModule()
    const report = {
      ...makeCompositionReport(),
      composition: [
        { id: "tool-registry", available: true },
        { id: "plugin-hooks", available: true },
        { id: "tool-registry", available: true },
        { id: "skill-load", available: true },
        { id: "sdk-client", available: true },
      ],
    }

    const result = runtime.enforcePureSurfaceContract({
      report,
      requiredSurfaces: [...COMPOSITION_SURFACES],
      approvedRegistry: makeApprovedRegistry(),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SURFACE_REPORT_CONTAINS_DUPLICATE")
    expect(result.error.surface).toBe("tool-registry")
  })

  test("S2-T13 empty report fails with SURFACE_REPORT_EMPTY", async () => {
    const runtime = await loadPureSurfaceGateModule()
    const report = {
      ...makeCompositionReport("http://127.0.0.1:4999"),
      composition: [],
    }

    const result = runtime.enforcePureSurfaceContract({
      report,
      requiredSurfaces: [...COMPOSITION_SURFACES],
      approvedRegistry: makeApprovedRegistry(),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SURFACE_REPORT_EMPTY")
    expect(result.error.serverUrl).toBe("http://127.0.0.1:4999")
  })

  test("S2-T14 assertSurfaceApproved returns typed CompositionSurfaceID for approved surface", async () => {
    const runtime = await loadPureSurfaceGateModule()

    const result = runtime.assertSurfaceApproved(makeApprovedRegistry(), "plugin-hooks")
    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value).toBe("plugin-hooks")
  })

  test("S2-T15 assertSurfaceApproved fails typed with approved allowlist for unknown surface", async () => {
    const runtime = await loadPureSurfaceGateModule()

    const result = runtime.assertSurfaceApproved(makeApprovedRegistry(), "fork-hooks")
    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SURFACE_NOT_APPROVED")
    expect(result.error.surface).toBe("fork-hooks")
    expect(result.error.approved).toEqual(COMPOSITION_SURFACES)
  })
})
