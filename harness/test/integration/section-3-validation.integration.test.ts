import { describe, expect, test } from "bun:test"
import { COMPOSITION_SURFACES } from "../helpers/contracts"
import { createCompositionFixture } from "../helpers/fixture"
import { loadNoDegradationPipelineModule } from "../helpers/module-loader"

type PipelineRuntime = {
  readonly runNoDegradationValidationPipeline: (input: {
    readonly serverUrl: string
    readonly cwd: string
    readonly timeoutMs: number
    readonly healthPath: string
    readonly requiredSurfaces: ReadonlyArray<(typeof COMPOSITION_SURFACES)[number]>
    readonly approvedSurfaceRegistryPath: string
  }) => Promise<
    | {
        readonly ok: true
        readonly value: {
          readonly pass: true
          readonly serverUrl: string
          readonly requiredSurfaces: ReadonlyArray<string>
          readonly evidence: {
            readonly report: {
              readonly serverUrl: string
              readonly composition: ReadonlyArray<{ readonly id: string }>
            }
            readonly compositionSurfaceCount: number
            readonly startupTimingsMs: {
              readonly total: number
              readonly readiness: number
              readonly probe: number
              readonly sdk: number
            }
          }
        }
      }
    | {
        readonly ok: false
        readonly error: {
          readonly code: string
          readonly stage: string
          readonly error: {
            readonly code: string
            readonly healthUrl?: string
          }
        }
      }
  >
}

function makePipelineInput(serverUrl: string) {
  return {
    serverUrl,
    cwd: process.cwd(),
    timeoutMs: 1500,
    healthPath: "/global/health",
    requiredSurfaces: COMPOSITION_SURFACES,
    approvedSurfaceRegistryPath: "config/approved-opencode-surfaces.json",
  }
}

describe("integration section-3 no-degradation validation contracts", () => {
  test("T3-28 live pipeline returns typed pass evidence and stage-tagged controlled failure", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as PipelineRuntime
    const liveServerUrl = process.env.OPENCODE_SERVER_URL

    if (!liveServerUrl) {
      const failureOnlyResult = await runtime.runNoDegradationValidationPipeline(
        makePipelineInput("http://127.0.0.1:1"),
      )
      if (failureOnlyResult.ok) {
        throw new Error(`T3-28 failure-only path passed unexpectedly: ${JSON.stringify(failureOnlyResult.value)}`)
      }

      expect(failureOnlyResult.error.code).toBe("NO_DEGRADATION_BOUNDARY_FAILED")
      expect(failureOnlyResult.error.stage).toBe("boundary-startup")
      expect(failureOnlyResult.error.error.code).toBe("HOST_HEALTH_UNREACHABLE")
      expect(failureOnlyResult.error.error.healthUrl).toContain("127.0.0.1:1")
      return
    }

    const fixture = createCompositionFixture()

    const passResult = await runtime.runNoDegradationValidationPipeline(makePipelineInput(fixture.serverUrl))
    if (!passResult.ok) {
      throw new Error(`T3-28 pass path failed unexpectedly: ${JSON.stringify(passResult.error)}`)
    }

    expect(passResult.value.pass).toBe(true)
    expect(passResult.value.serverUrl).toBe(fixture.serverUrl)
    expect(passResult.value.requiredSurfaces).toEqual(COMPOSITION_SURFACES)
    expect(passResult.value.evidence.report.serverUrl).toBe(fixture.serverUrl)
    expect(passResult.value.evidence.report.composition).toHaveLength(COMPOSITION_SURFACES.length)
    expect(passResult.value.evidence.compositionSurfaceCount).toBe(COMPOSITION_SURFACES.length)
    expect(passResult.value.evidence.startupTimingsMs.total).toBeGreaterThan(-1)
    expect(passResult.value.evidence.startupTimingsMs.readiness).toBeGreaterThan(-1)
    expect(passResult.value.evidence.startupTimingsMs.probe).toBeGreaterThan(-1)
    expect(passResult.value.evidence.startupTimingsMs.sdk).toBeGreaterThan(-1)

    const failureResult = await runtime.runNoDegradationValidationPipeline(makePipelineInput("http://127.0.0.1:1"))
    if (failureResult.ok) {
      throw new Error(`T3-28 failure path passed unexpectedly: ${JSON.stringify(failureResult.value)}`)
    }

    expect(failureResult.error.code).toBe("NO_DEGRADATION_BOUNDARY_FAILED")
    expect(failureResult.error.stage).toBe("boundary-startup")
    expect(failureResult.error.error.code).toBe("HOST_HEALTH_UNREACHABLE")
    expect(failureResult.error.error.healthUrl).toContain("127.0.0.1:1")
  })
})
