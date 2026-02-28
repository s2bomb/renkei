import { describe, expect, test } from "bun:test"
import { COMPOSITION_SURFACES, PURITY_VERIFICATION_ERROR_CODES } from "../helpers/contracts"
import { loadPurityVerificationModule } from "../helpers/module-loader"

const CANONICAL_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

function makeApprovedRegistry(sourcePath = "engine/config/approved-opencode-surfaces.json") {
  return {
    version: "2026-02-19",
    sourcePath,
    generatedAtMs: 111,
    entries: CANONICAL_SURFACES.map((id) => ({
      id,
      seam: id,
      upstreamSurface: `upstream:${id}`,
      rationale: `rationale:${id}`,
    })),
  }
}

function makeSurfaceGateEvaluation(reportSurfaceCount = 4) {
  return {
    checkedAtMs: 2026,
    approved: [...COMPOSITION_SURFACES],
    required: [...COMPOSITION_SURFACES],
    reportSurfaceCount,
  }
}

function makeFinding(options: {
  readonly file: string
  readonly line: number
  readonly column: number
  readonly matchedText: string
  readonly patternID: "fork-surface" | "openteams-surface" | "fork-env-var" | "fork-test-script"
  readonly severity: "error" | "warning"
}) {
  return {
    file: options.file,
    line: options.line,
    column: options.column,
    matchedText: options.matchedText,
    patternID: options.patternID,
    severity: options.severity,
  }
}

describe("unit section-2 purity-verification contracts", () => {
  test("S2-T26 zero findings yields pass report with deterministic evidence payload", async () => {
    const runtime = await loadPurityVerificationModule()

    const result = runtime.verifyPureOpenCodeIntegration(
      {
        registryResult: { ok: true, value: makeApprovedRegistry("engine/config/approved-opencode-surfaces.json") },
        surfaceGateResult: { ok: true, value: makeSurfaceGateEvaluation(4) },
        staleScanResult: { ok: true, value: { scannedFiles: 7, findings: [] } },
        requiredSurfaces: [...COMPOSITION_SURFACES],
      },
      { nowMs: () => 2626 },
    )

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.checkedAtMs).toBe(2626)
    expect(result.value.pass).toBe(true)
    expect(result.value.requiredSurfaces).toEqual(COMPOSITION_SURFACES)
    expect(result.value.approvedSurfaces).toEqual(COMPOSITION_SURFACES)
    expect(result.value.staleFindingCount).toBe(0)
    expect(result.value.staleFindingCountsBySeverity.error).toBe(0)
    expect(result.value.staleFindingCountsBySeverity.warning).toBe(0)
    expect(result.value.evidence.registrySourcePath).toBe("engine/config/approved-opencode-surfaces.json")
    expect(result.value.evidence.reportSurfaceCount).toBe(4)
    expect(result.value.evidence.scannedFiles).toBe(7)
  })

  test("S2-T27 warning-only stale findings pass and are counted", async () => {
    const runtime = await loadPurityVerificationModule()
    const findings = [
      makeFinding({
        file: "engine/test/unit/pure-surface-gate.unit.test.ts",
        line: 18,
        column: 9,
        matchedText: "openteams",
        patternID: "openteams-surface",
        severity: "warning",
      }),
      makeFinding({
        file: "thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/spec.md",
        line: 44,
        column: 3,
        matchedText: "fork",
        patternID: "fork-surface",
        severity: "warning",
      }),
    ]

    const result = runtime.verifyPureOpenCodeIntegration({
      registryResult: { ok: true, value: makeApprovedRegistry() },
      surfaceGateResult: { ok: true, value: makeSurfaceGateEvaluation() },
      staleScanResult: { ok: true, value: { scannedFiles: 12, findings } },
      requiredSurfaces: [...COMPOSITION_SURFACES],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.pass).toBe(true)
    expect(result.value.staleFindingCountsBySeverity.error).toBe(0)
    expect(result.value.staleFindingCountsBySeverity.warning).toBe(2)
    expect(result.value.staleFindingCount).toBe(2)
  })

  test("S2-T28 registry failure maps to PURITY_REGISTRY_FAILED", async () => {
    const runtime = await loadPurityVerificationModule()
    const allowed = new Set<string>(PURITY_VERIFICATION_ERROR_CODES)

    const result = runtime.verifyPureOpenCodeIntegration({
      registryResult: {
        ok: false,
        error: {
          code: "APPROVED_SURFACE_REGISTRY_INVALID",
          path: "engine/config/approved-opencode-surfaces.json",
          detail: "invalid payload",
        },
      },
      surfaceGateResult: { ok: true, value: makeSurfaceGateEvaluation() },
      staleScanResult: { ok: true, value: { scannedFiles: 0, findings: [] } },
      requiredSurfaces: [...COMPOSITION_SURFACES],
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(allowed.has(result.error.code)).toBe(true)
    expect(result.error.code).toBe("PURITY_REGISTRY_FAILED")
    expect(result.error.error.code).toBe("APPROVED_SURFACE_REGISTRY_INVALID")
    expect(result.error.error.path).toBe("engine/config/approved-opencode-surfaces.json")
  })

  test("S2-T29 surface gate violation maps to PURITY_SURFACE_GATE_FAILED", async () => {
    const runtime = await loadPurityVerificationModule()

    const result = runtime.verifyPureOpenCodeIntegration({
      registryResult: { ok: true, value: makeApprovedRegistry() },
      surfaceGateResult: {
        ok: false,
        error: {
          code: "SURFACE_NOT_APPROVED",
          surface: "experimental-surface",
          approved: [...COMPOSITION_SURFACES],
        },
      },
      staleScanResult: { ok: true, value: { scannedFiles: 4, findings: [] } },
      requiredSurfaces: [...COMPOSITION_SURFACES],
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("PURITY_SURFACE_GATE_FAILED")
    expect(result.error.error.code).toBe("SURFACE_NOT_APPROVED")
    expect(result.error.error.surface).toBe("experimental-surface")
    expect(result.error.error.approved).toEqual(COMPOSITION_SURFACES)
  })

  test("S2-T30 stale scanner error maps to PURITY_STALE_ASSUMPTION_FAILED", async () => {
    const runtime = await loadPurityVerificationModule()

    const result = runtime.verifyPureOpenCodeIntegration({
      registryResult: { ok: true, value: makeApprovedRegistry() },
      surfaceGateResult: { ok: true, value: makeSurfaceGateEvaluation() },
      staleScanResult: {
        ok: false,
        error: {
          code: "SCAN_IO_FAILURE",
          path: "engine/test/unit/pure-surface-gate.unit.test.ts",
          cause: "EACCES",
        },
      },
      requiredSurfaces: [...COMPOSITION_SURFACES],
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("PURITY_STALE_ASSUMPTION_FAILED")
    expect(result.error.error.code).toBe("SCAN_IO_FAILURE")
    expect(result.error.error.path).toBe("engine/test/unit/pure-surface-gate.unit.test.ts")
  })

  test("S2-T31 error-severity stale findings fail with PURITY_STALE_ASSUMPTION_FOUND", async () => {
    const runtime = await loadPurityVerificationModule()
    const findings = [
      makeFinding({
        file: "engine/test/unit/pure-surface-gate.unit.test.ts",
        line: 20,
        column: 5,
        matchedText: "fork",
        patternID: "fork-surface",
        severity: "error",
      }),
      makeFinding({
        file: "thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/spec.md",
        line: 45,
        column: 2,
        matchedText: "openteams",
        patternID: "openteams-surface",
        severity: "warning",
      }),
    ]

    const result = runtime.verifyPureOpenCodeIntegration({
      registryResult: { ok: true, value: makeApprovedRegistry() },
      surfaceGateResult: { ok: true, value: makeSurfaceGateEvaluation() },
      staleScanResult: { ok: true, value: { scannedFiles: 19, findings } },
      requiredSurfaces: [...COMPOSITION_SURFACES],
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("PURITY_STALE_ASSUMPTION_FOUND")
    expect(result.error.failingSeverity).toBe("error")
    expect(result.error.findings.length).toBe(2)
    expect(result.error.findings.some((finding: { severity: string }) => finding.severity === "error")).toBe(true)
    expect(result.error.findings.some((finding: { severity: string }) => finding.severity === "warning")).toBe(true)
  })
})
