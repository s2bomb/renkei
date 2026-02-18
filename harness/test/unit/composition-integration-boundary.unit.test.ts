import { describe, expect, test } from "bun:test"
import {
  SECTION_2_BOUNDARY_ERROR_CODES,
  makeCompositionOnlyReport,
  makeCompositionReportMissingSurfaces,
  makeLoadedSkills,
  makeStartupError,
  makeStartupSuccess,
} from "../helpers/contracts"
import { loadCompositionIntegrationBoundaryModule } from "../helpers/module-loader"

function makeBoundaryInput() {
  return {
    serverUrl: "http://127.0.0.1:4099",
    cwd: "/tmp",
    timeoutMs: 1500,
    healthPath: "/global/health",
    skillRoots: ["/tmp/skills"],
  }
}

describe("unit composition-integration-boundary contracts", () => {
  test("T2-06 assertRequiredSurfaces passes when all required surfaces are available", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()

    const report = makeCompositionOnlyReport()
    const result = runtime.assertRequiredSurfaces(report, ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"])

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBe(true)
    }
  })

  test("T2-07 assertRequiredSurfaces returns typed missing-surface payload", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()
    const report = makeCompositionReportMissingSurfaces(["tool-registry", "skill-load"])

    const result = runtime.assertRequiredSurfaces(report, ["tool-registry", "skill-load"])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("COMPOSITION_SURFACE_MISSING")
      expect(["tool-registry", "skill-load"].includes(result.error.surface)).toBe(true)
      expect(result.error.report).toBe(report)
      expect(typeof result.error.message).toBe("string")
    }
  })

  test("T2-02 startup failures propagate unchanged", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()
    const allowed = new Set<string>(SECTION_2_BOUNDARY_ERROR_CODES)

    for (const code of ["STARTUP_SERVER_URL_INVALID", "PROBE_FAILED"] as const) {
      const startupError = makeStartupError(code)
      const result = await runtime.bootstrapCompositionBoundary(makeBoundaryInput(), {
        startHarnessRuntime: async () => ({
          ok: false,
          error: startupError,
        }),
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(allowed.has(result.error.code)).toBe(true)
        expect(result.error.code).toBe(code)
      }
    }
  })

  test("T2-03 missing required surface fails loudly with missing surface id", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()
    const startup = makeStartupSuccess()
    const report = makeCompositionReportMissingSurfaces(["skill-load"])

    const result = await runtime.bootstrapCompositionBoundary(makeBoundaryInput(), {
      startHarnessRuntime: async () => ({
        ok: true,
        value: {
          ...startup,
          report,
        },
      }),
      createHarnessSDKClient: async () => ({
        ok: true,
        value: { session: {}, teammate: {} },
      }),
      loadDeployedSkills: async () => ({
        ok: true,
        value: makeLoadedSkills(),
      }),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("COMPOSITION_SURFACE_MISSING")
      expect(result.error.surface).toBe("skill-load")
      expect(result.error.report).toBe(report)
    }
  })

  test("T2-04 skill-load failures map to SKILL_LOAD_FAILED and retain nested error", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()

    const result = await runtime.bootstrapCompositionBoundary(makeBoundaryInput(), {
      startHarnessRuntime: async () => ({
        ok: true,
        value: makeStartupSuccess(),
      }),
      createHarnessSDKClient: async () => ({
        ok: true,
        value: { session: {}, teammate: {} },
      }),
      loadDeployedSkills: async () => ({
        ok: false,
        error: {
          code: "SKILL_PARSE_FAILED",
          path: "/tmp/skills/agent/SKILL.md",
          message: "invalid frontmatter",
        },
      }),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("SKILL_LOAD_FAILED")
      expect(result.error.error.code).toBe("SKILL_PARSE_FAILED")
    }
  })

  test("T2-05 missing required surface short-circuits before skill loading", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()
    let loadCalls = 0

    const result = await runtime.bootstrapCompositionBoundary(makeBoundaryInput(), {
      startHarnessRuntime: async () => ({
        ok: true,
        value: {
          ...makeStartupSuccess(),
          report: makeCompositionReportMissingSurfaces(["tool-registry"]),
        },
      }),
      createHarnessSDKClient: async () => ({
        ok: true,
        value: { session: {}, teammate: {} },
      }),
      loadDeployedSkills: async () => {
        loadCalls += 1
        return { ok: true, value: makeLoadedSkills() }
      },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("COMPOSITION_SURFACE_MISSING")
    }
    expect(loadCalls).toBe(0)
  })

  test("T2-01 success returns startup, sdk client, and loaded skills", async () => {
    const runtime = await loadCompositionIntegrationBoundaryModule()
    const startup = makeStartupSuccess()
    const sdk = { session: {}, teammate: {} }
    const loadedSkills = makeLoadedSkills()

    const result = await runtime.bootstrapCompositionBoundary(makeBoundaryInput(), {
      startHarnessRuntime: async () => ({ ok: true, value: startup }),
      createHarnessSDKClient: async () => ({ ok: true, value: sdk }),
      loadDeployedSkills: async () => ({ ok: true, value: loadedSkills }),
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.startup).toBe(startup)
      expect(result.value.sdk).toBe(sdk)
      expect(result.value.loadedSkills).toEqual(loadedSkills)
    }
  })
})
