import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import {
  COMPOSITION_SURFACES,
  LIVE_PREREQ_ERROR_CODES,
  NO_DEGRADATION_PIPELINE_ERROR_CODES,
  SIGNAL_ERROR_CODES,
  WORKFLOW_SIGNOFF_ERROR_CODES,
  makeCompositionReport,
  makeStartupSuccess,
} from "../helpers/contracts"
import {
  loadBaselineWorkflowsModule,
  loadDeterministicSignalsModule,
  loadLiveIntegrationPrereqsModule,
  loadNoDegradationPipelineModule,
} from "../helpers/module-loader"

type LivePrereqResult =
  | { readonly ok: true; readonly value: Record<string, unknown> }
  | { readonly ok: false; readonly error: Record<string, unknown> }

type DeterministicSignalExpectation = {
  readonly expectedExitCode: 0 | 1
  readonly expectedHumanSignal: "renkei-dev startup ok serverUrl=" | "renkei-dev startup failed code="
  readonly requireJsonContract: boolean
}

type SignalSuccess = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly expectation: DeterministicSignalExpectation
}

type SignalResult =
  | { readonly ok: true; readonly value: SignalSuccess }
  | { readonly ok: false; readonly error: Record<string, unknown> }

type LivePrereqRuntime = {
  readonly defaultRequiredSectionDSurfaces: () => ReadonlyArray<string>
  readonly verifyLiveIntegrationPrerequisites: (
    input: Record<string, unknown>,
    deps?: Record<string, unknown>,
  ) => LivePrereqResult
}

type DeterministicSignalsRuntime = {
  readonly verifyDeterministicStartupSignals: (
    input: Record<string, unknown>,
    expectation: DeterministicSignalExpectation,
    deps?: Record<string, unknown>,
  ) => SignalResult
}

type PipelineInput = {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly requiredSurfaces: ReadonlyArray<(typeof COMPOSITION_SURFACES)[number]>
  readonly approvedSurfaceRegistryPath: string
}

type PipelineSuccess = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly serverUrl: string
  readonly requiredSurfaces: ReadonlyArray<string>
  readonly startup: ReturnType<typeof makeStartupSuccess>
  readonly baseline: {
    readonly requirement: {
      readonly requiredCompositionSurfaceCount: 4
      readonly requireStartupTimingFields: true
    }
    readonly status: {
      readonly compositionSurfaceCount: number
      readonly timingsPresent: true
    }
  }
  readonly evidence: {
    readonly report: ReturnType<typeof makeCompositionReport>
    readonly compositionSurfaceCount: number
    readonly startupTimingsMs: ReturnType<typeof makeStartupSuccess>["timingsMs"]
  }
}

type PipelineResult =
  | { readonly ok: true; readonly value: PipelineSuccess }
  | {
      readonly ok: false
      readonly error: {
        readonly code: string
        readonly stage: string
        readonly error: Record<string, unknown>
      }
    }

type NoDegradationPipelineRuntime = {
  readonly runNoDegradationValidationPipeline: (
    input: PipelineInput,
    deps?: Record<string, unknown>,
  ) => Promise<PipelineResult>
}

type PipelineStage =
  | "prerequisite"
  | "boundary-startup"
  | "approved-surface-registry"
  | "pure-surface-gate"
  | "baseline"

function makePipelineInput(): PipelineInput {
  return {
    serverUrl: "http://127.0.0.1:4099",
    cwd: "/tmp",
    timeoutMs: 1500,
    healthPath: "/global/health",
    requiredSurfaces: COMPOSITION_SURFACES,
    approvedSurfaceRegistryPath: "config/approved-opencode-surfaces.json",
  }
}

function makePipelineDeps(options?: { readonly failStage?: PipelineStage; readonly nowMs?: number }) {
  const failStage = options?.failStage
  const callOrder: PipelineStage[] = []
  const callCount: Record<PipelineStage, number> = {
    prerequisite: 0,
    "boundary-startup": 0,
    "approved-surface-registry": 0,
    "pure-surface-gate": 0,
    baseline: 0,
  }

  const report = makeCompositionReport()
  const startup = makeStartupSuccess()
  const baseline = {
    requirement: {
      requiredCompositionSurfaceCount: 4 as const,
      requireStartupTimingFields: true as const,
    },
    status: {
      compositionSurfaceCount: 4,
      timingsPresent: true as const,
    },
  }

  return {
    callOrder,
    callCount,
    report,
    startup,
    deps: {
      nowMs: () => options?.nowMs ?? 1700000000314,
      verifyLiveIntegrationPrerequisites: () => {
        callOrder.push("prerequisite")
        callCount.prerequisite += 1
        if (failStage === "prerequisite") {
          return {
            ok: false,
            error: {
              code: "LIVE_PREREQ_SERVER_URL_MISSING",
              envVar: "OPENCODE_SERVER_URL",
            },
          }
        }
        return {
          ok: true,
          value: {
            checkedAtMs: 1700000000301,
            serverUrl: "http://127.0.0.1:4099",
            approvedSurfaceRegistryPath: "config/approved-opencode-surfaces.json",
            requiredSurfaces: COMPOSITION_SURFACES,
          },
        }
      },
      bootstrapCompositionBoundary: async () => {
        callOrder.push("boundary-startup")
        callCount["boundary-startup"] += 1
        if (failStage === "boundary-startup") {
          return {
            ok: false,
            error: {
              code: "HOST_HEALTH_UNREACHABLE",
              healthUrl: "http://127.0.0.1:4099/global/health",
              cause: "network",
            },
          }
        }
        return {
          ok: true,
          value: {
            startup,
          },
        }
      },
      loadApprovedSurfaceRegistry: async () => {
        callOrder.push("approved-surface-registry")
        callCount["approved-surface-registry"] += 1
        if (failStage === "approved-surface-registry") {
          return {
            ok: false,
            error: {
              code: "APPROVED_SURFACE_REGISTRY_NOT_FOUND",
              path: "config/approved-opencode-surfaces.json",
            },
          }
        }
        return {
          ok: true,
          value: {
            entries: COMPOSITION_SURFACES.map((id) => ({ id })),
          },
        }
      },
      enforcePureSurfaceContract: () => {
        callOrder.push("pure-surface-gate")
        callCount["pure-surface-gate"] += 1
        if (failStage === "pure-surface-gate") {
          return {
            ok: false,
            error: {
              code: "REQUIRED_SURFACE_UNAVAILABLE",
              surface: "sdk-client",
              probeError: {
                code: "MISSING_REQUIRED_SURFACE",
                surface: "sdk-client",
                message: "Required composition surface unavailable: sdk-client",
              },
            },
          }
        }
        return {
          ok: true,
          value: {
            reportSurfaceCount: COMPOSITION_SURFACES.length,
          },
        }
      },
      evaluateNoDegradationBaseline: () => {
        callOrder.push("baseline")
        callCount.baseline += 1
        if (failStage === "baseline") {
          return {
            ok: false,
            error: {
              code: "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH",
              expected: 4,
              actual: 3,
            },
          }
        }
        return {
          ok: true,
          value: baseline,
        }
      },
    },
  }
}

type SectionDBaselineWorkflow = {
  readonly id: string
  readonly command: ReadonlyArray<string>
  readonly requiresLiveServer: boolean
  readonly expectedExitCode: 0
}

type WorkflowSignoffResult =
  | {
      readonly ok: true
      readonly value: {
        readonly checkedAtMs: number
        readonly pass: true
        readonly workflows: ReadonlyArray<{
          readonly id: string
          readonly command: ReadonlyArray<string>
          readonly ok: true
          readonly exitCode: 0
        }>
      }
    }
  | { readonly ok: false; readonly error: Record<string, unknown> }

type WorkflowSignoffRuntime = {
  readonly defaultSectionDBaselineWorkflows: () => ReadonlyArray<SectionDBaselineWorkflow>
  readonly evaluateSectionDBaselineWorkflows: (
    workflows: ReadonlyArray<SectionDBaselineWorkflow>,
    deps?: Record<string, unknown>,
  ) => Promise<WorkflowSignoffResult>
}

describe("unit section-3 live-integration-prereqs contracts", () => {
  const originalServerUrlEnv = process.env.OPENCODE_SERVER_URL

  beforeEach(() => {
    process.env.OPENCODE_SERVER_URL = undefined
  })

  afterEach(() => {
    process.env.OPENCODE_SERVER_URL = originalServerUrlEnv
  })

  test("T3-02 missing OPENCODE_SERVER_URL fails typed before downstream gates", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const result = runtime.verifyLiveIntegrationPrerequisites({
      serverUrlEnvVar: "OPENCODE_SERVER_URL",
      serverUrlValue: process.env.OPENCODE_SERVER_URL,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("LIVE_PREREQ_SERVER_URL_MISSING")
      expect(result.error.envVar).toBe("OPENCODE_SERVER_URL")
    }
  })

  test("T3-03 invalid URL fails typed with original value and parse cause", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const result = runtime.verifyLiveIntegrationPrerequisites(
      {
        serverUrlEnvVar: "OPENCODE_SERVER_URL",
        serverUrlValue: "::::invalid::::",
      },
      {
        parseUrl: (value: string) => ({
          ok: false,
          error: {
            cause: `failed-parse:${value}`,
          },
        }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("LIVE_PREREQ_SERVER_URL_INVALID")
      expect(result.error.envVar).toBe("OPENCODE_SERVER_URL")
      expect(result.error.value).toBe("::::invalid::::")
      expect(result.error.cause).toBe("failed-parse:::::invalid:::::")
    }
  })

  test("T3-04 empty required surfaces fails typed", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const result = runtime.verifyLiveIntegrationPrerequisites({
      serverUrlEnvVar: "OPENCODE_SERVER_URL",
      serverUrlValue: "http://127.0.0.1:4099",
      requiredSurfaces: [],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("LIVE_PREREQ_REQUIRED_SURFACE_LIST_EMPTY")
    }
  })

  test("T3-05 duplicate required surface fails typed and names duplicate", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const result = runtime.verifyLiveIntegrationPrerequisites({
      serverUrlEnvVar: "OPENCODE_SERVER_URL",
      serverUrlValue: "http://127.0.0.1:4099",
      requiredSurfaces: ["tool-registry", "tool-registry"],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("LIVE_PREREQ_REQUIRED_SURFACE_DUPLICATE")
      expect(result.error.surface).toBe("tool-registry")
    }
  })

  test("T3-06 unknown required surface fails typed and exposes allowed surfaces", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const result = runtime.verifyLiveIntegrationPrerequisites({
      serverUrlEnvVar: "OPENCODE_SERVER_URL",
      serverUrlValue: "http://127.0.0.1:4099",
      requiredSurfaces: ["tool-registry", "unknown-surface"],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("LIVE_PREREQ_REQUIRED_SURFACE_UNKNOWN")
      expect(result.error.surface).toBe("unknown-surface")
      expect(result.error.allowed).toEqual(COMPOSITION_SURFACES)
    }
  })

  test("T3-07 invalid approved registry path fails typed with stable rule keys", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime
    const allowed = new Set<string>(LIVE_PREREQ_ERROR_CODES)

    const cases: ReadonlyArray<{
      readonly path: string
      readonly detail: string
    }> = [
      { path: "   ", detail: "EMPTY_PATH" },
      {
        path: "/config/approved-opencode-surfaces.json",
        detail: "ABSOLUTE_PATH",
      },
      {
        path: "config\\approved-opencode-surfaces.json",
        detail: "PATH_SEPARATOR_INVALID",
      },
      {
        path: "config/./approved-opencode-surfaces.json",
        detail: "DOT_SEGMENT",
      },
      {
        path: "config/../approved-opencode-surfaces.json",
        detail: "PARENT_SEGMENT",
      },
      {
        path: "config/approved-opencode-surfaces.txt",
        detail: "NOT_JSON_FILE",
      },
    ]

    for (const testCase of cases) {
      const result = runtime.verifyLiveIntegrationPrerequisites({
        serverUrlEnvVar: "OPENCODE_SERVER_URL",
        serverUrlValue: "http://127.0.0.1:4099",
        approvedSurfaceRegistryPath: testCase.path,
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(allowed.has(String(result.error.code))).toBe(true)
        expect(result.error.code).toBe("LIVE_PREREQ_APPROVED_REGISTRY_PATH_INVALID")
        expect(result.error.path).toBe(testCase.path)
        expect(result.error.detail).toBe(testCase.detail)
      }
    }
  })

  test("T3-08 success returns resolved prerequisite payload with deterministic timestamp", async () => {
    const runtime = (await loadLiveIntegrationPrereqsModule()) as LivePrereqRuntime

    const result = runtime.verifyLiveIntegrationPrerequisites(
      {
        serverUrlEnvVar: "OPENCODE_SERVER_URL",
        serverUrlValue: "http://127.0.0.1:4099",
      },
      {
        nowMs: () => 1700000000123,
        parseUrl: (value: string) => ({ ok: true, value: value.trim() }),
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.checkedAtMs).toBe(1700000000123)
      expect(result.value.serverUrl).toBe("http://127.0.0.1:4099")
      expect(result.value.approvedSurfaceRegistryPath).toBe("config/approved-opencode-surfaces.json")
      expect(result.value.requiredSurfaces).toEqual(COMPOSITION_SURFACES)
    }
  })
})

describe("unit section-3 no-degradation-pipeline contracts", () => {
  test("T3-09 prerequisite stage failure is wrapped with stage-tagged pipeline error", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const allowed = new Set<string>(NO_DEGRADATION_PIPELINE_ERROR_CODES)
    const setup = makePipelineDeps({ failStage: "prerequisite" })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("NO_DEGRADATION_PREREQUISITE_FAILED")
      expect(result.error.stage).toBe("prerequisite")
      expect(result.error.error.code).toBe("LIVE_PREREQ_SERVER_URL_MISSING")
    }
    expect(setup.callOrder).toEqual(["prerequisite"])
    expect(setup.callCount.prerequisite).toBe(1)
    expect(setup.callCount["boundary-startup"]).toBe(0)
    expect(setup.callCount["approved-surface-registry"]).toBe(0)
    expect(setup.callCount["pure-surface-gate"]).toBe(0)
    expect(setup.callCount.baseline).toBe(0)
  })

  test("T3-10 boundary-startup failure short-circuits with exact stage tag", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const allowed = new Set<string>(NO_DEGRADATION_PIPELINE_ERROR_CODES)
    const setup = makePipelineDeps({ failStage: "boundary-startup" })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("NO_DEGRADATION_BOUNDARY_FAILED")
      expect(result.error.stage).toBe("boundary-startup")
      expect(result.error.error.code).toBe("HOST_HEALTH_UNREACHABLE")
    }
    expect(setup.callOrder).toEqual(["prerequisite", "boundary-startup"])
    expect(setup.callCount["approved-surface-registry"]).toBe(0)
    expect(setup.callCount["pure-surface-gate"]).toBe(0)
    expect(setup.callCount.baseline).toBe(0)
  })

  test("T3-11 approved-surface-registry failure short-circuits with exact stage tag", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const allowed = new Set<string>(NO_DEGRADATION_PIPELINE_ERROR_CODES)
    const setup = makePipelineDeps({ failStage: "approved-surface-registry" })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("NO_DEGRADATION_APPROVED_REGISTRY_FAILED")
      expect(result.error.stage).toBe("approved-surface-registry")
      expect(result.error.error.code).toBe("APPROVED_SURFACE_REGISTRY_NOT_FOUND")
    }
    expect(setup.callOrder).toEqual(["prerequisite", "boundary-startup", "approved-surface-registry"])
    expect(setup.callCount["pure-surface-gate"]).toBe(0)
    expect(setup.callCount.baseline).toBe(0)
  })

  test("T3-12 pure-surface-gate violation short-circuits with exact stage tag", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const allowed = new Set<string>(NO_DEGRADATION_PIPELINE_ERROR_CODES)
    const setup = makePipelineDeps({ failStage: "pure-surface-gate" })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("NO_DEGRADATION_PURE_SURFACE_GATE_FAILED")
      expect(result.error.stage).toBe("pure-surface-gate")
      expect(result.error.error.code).toBe("REQUIRED_SURFACE_UNAVAILABLE")
    }
    expect(setup.callOrder).toEqual([
      "prerequisite",
      "boundary-startup",
      "approved-surface-registry",
      "pure-surface-gate",
    ])
    expect(setup.callCount.baseline).toBe(0)
  })

  test("T3-13 baseline violation returns exact stage-tagged baseline failure", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const allowed = new Set<string>(NO_DEGRADATION_PIPELINE_ERROR_CODES)
    const setup = makePipelineDeps({ failStage: "baseline" })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("NO_DEGRADATION_BASELINE_FAILED")
      expect(result.error.stage).toBe("baseline")
      expect(result.error.error.code).toBe("BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH")
      if (result.error.error.code === "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH") {
        expect(result.error.error.expected).toBe(4)
        expect(result.error.error.actual).toBe(3)
      }
    }
    expect(setup.callOrder).toEqual([
      "prerequisite",
      "boundary-startup",
      "approved-surface-registry",
      "pure-surface-gate",
      "baseline",
    ])
    expect(setup.callCount.baseline).toBe(1)
  })

  test("T3-14 success path preserves fixed stage order and evidence contract", async () => {
    const runtime = (await loadNoDegradationPipelineModule()) as NoDegradationPipelineRuntime
    const setup = makePipelineDeps({ nowMs: 1700000000314 })

    const result = await runtime.runNoDegradationValidationPipeline(makePipelineInput(), setup.deps)

    expect(result.ok).toBe(true)
    expect(setup.callOrder).toEqual([
      "prerequisite",
      "boundary-startup",
      "approved-surface-registry",
      "pure-surface-gate",
      "baseline",
    ])
    expect(setup.callCount.prerequisite).toBe(1)
    expect(setup.callCount["boundary-startup"]).toBe(1)
    expect(setup.callCount["approved-surface-registry"]).toBe(1)
    expect(setup.callCount["pure-surface-gate"]).toBe(1)
    expect(setup.callCount.baseline).toBe(1)
    if (result.ok) {
      expect(result.value.checkedAtMs).toBe(1700000000314)
      expect(result.value.pass).toBe(true)
      expect(result.value.serverUrl).toBe("http://127.0.0.1:4099")
      expect(result.value.requiredSurfaces).toEqual(COMPOSITION_SURFACES)
      expect(result.value.evidence.report).toEqual(setup.report)
      expect(result.value.evidence.compositionSurfaceCount).toBe(COMPOSITION_SURFACES.length)
      expect(result.value.evidence.startupTimingsMs).toEqual(setup.startup.timingsMs)
    }
  })
})

describe("unit section-3 workflow-signoff contracts", () => {
  test("T3-16 empty workflow list fails typed before command execution", async () => {
    const runtime = (await loadBaselineWorkflowsModule()) as WorkflowSignoffRuntime
    const allowed = new Set<string>(WORKFLOW_SIGNOFF_ERROR_CODES)
    const calls: Array<ReadonlyArray<string>> = []

    const result = await runtime.evaluateSectionDBaselineWorkflows([], {
      hasEnvVar: () => true,
      runCommand: async (command: ReadonlyArray<string>) => {
        calls.push(command)
        return { exitCode: 0, stdout: "", stderr: "" }
      },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("WORKFLOW_SIGNOFF_LIST_EMPTY")
    }
    expect(calls).toHaveLength(0)
  })

  test("T3-17 duplicate workflow ID fails typed and points to duplicate", async () => {
    const runtime = (await loadBaselineWorkflowsModule()) as WorkflowSignoffRuntime
    const allowed = new Set<string>(WORKFLOW_SIGNOFF_ERROR_CODES)
    const calls: Array<ReadonlyArray<string>> = []

    const result = await runtime.evaluateSectionDBaselineWorkflows(
      [
        {
          id: "quality:typecheck",
          command: ["bun", "run", "typecheck"],
          requiresLiveServer: false,
          expectedExitCode: 0,
        },
        {
          id: "quality:typecheck",
          command: ["bun", "run", "typecheck"],
          requiresLiveServer: false,
          expectedExitCode: 0,
        },
      ],
      {
        hasEnvVar: () => true,
        runCommand: async (command: ReadonlyArray<string>) => {
          calls.push(command)
          return { exitCode: 0, stdout: "", stderr: "" }
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("WORKFLOW_SIGNOFF_DUPLICATE_ID")
      expect(result.error.id).toBe("quality:typecheck")
    }
    expect(calls).toHaveLength(0)
  })

  test("T3-18 live-server-required workflow fails typed when env var missing", async () => {
    const runtime = (await loadBaselineWorkflowsModule()) as WorkflowSignoffRuntime
    const allowed = new Set<string>(WORKFLOW_SIGNOFF_ERROR_CODES)
    const calls: Array<ReadonlyArray<string>> = []

    const result = await runtime.evaluateSectionDBaselineWorkflows(
      [
        {
          id: "runtime:renkei-dev-json",
          command: ["bun", "run", "renkei-dev", "--", "--json"],
          requiresLiveServer: true,
          expectedExitCode: 0,
        },
      ],
      {
        hasEnvVar: () => false,
        runCommand: async (command: ReadonlyArray<string>) => {
          calls.push(command)
          return { exitCode: 0, stdout: "", stderr: "" }
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("WORKFLOW_SIGNOFF_LIVE_SERVER_REQUIRED")
      expect(result.error.workflowID).toBe("runtime:renkei-dev-json")
      expect(result.error.envVar).toBe("OPENCODE_SERVER_URL")
    }
    expect(calls).toHaveLength(0)
  })

  test("T3-19 first non-zero command exit fails typed and short-circuits remaining workflows", async () => {
    const runtime = (await loadBaselineWorkflowsModule()) as WorkflowSignoffRuntime
    const allowed = new Set<string>(WORKFLOW_SIGNOFF_ERROR_CODES)
    const calls: Array<ReadonlyArray<string>> = []

    const workflows: ReadonlyArray<SectionDBaselineWorkflow> = [
      {
        id: "quality:typecheck",
        command: ["bun", "run", "typecheck"],
        requiresLiveServer: false,
        expectedExitCode: 0,
      },
      {
        id: "quality:lint",
        command: ["bun", "run", "lint"],
        requiresLiveServer: false,
        expectedExitCode: 0,
      },
      {
        id: "quality:test-unit",
        command: ["bun", "run", "test:unit"],
        requiresLiveServer: false,
        expectedExitCode: 0,
      },
    ]

    const result = await runtime.evaluateSectionDBaselineWorkflows(workflows, {
      hasEnvVar: () => true,
      runCommand: async (command: ReadonlyArray<string>) => {
        calls.push(command)
        if (calls.length === 2) {
          return { exitCode: 7, stdout: "", stderr: "lint failed" }
        }
        return { exitCode: 0, stdout: "", stderr: "" }
      },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("WORKFLOW_SIGNOFF_COMMAND_FAILED")
      expect(result.error.workflowID).toBe("quality:lint")
      expect(result.error.expectedExitCode).toBe(0)
      expect(result.error.actualExitCode).toBe(7)
      expect(result.error.stderr).toBe("lint failed")
    }
    expect(calls).toHaveLength(2)
    expect(calls).toEqual([
      ["bun", "run", "typecheck"],
      ["bun", "run", "lint"],
    ])
  })

  test("T3-20 all commands succeeding returns deterministic pass report", async () => {
    const runtime = (await loadBaselineWorkflowsModule()) as WorkflowSignoffRuntime
    const calls: Array<ReadonlyArray<string>> = []
    const workflows = runtime.defaultSectionDBaselineWorkflows()

    const result = await runtime.evaluateSectionDBaselineWorkflows(workflows, {
      nowMs: () => 1700000000210,
      hasEnvVar: () => true,
      runCommand: async (command: ReadonlyArray<string>) => {
        calls.push(command)
        return { exitCode: 0, stdout: "ok", stderr: "" }
      },
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.checkedAtMs).toBe(1700000000210)
      expect(result.value.pass).toBe(true)
      expect(result.value.workflows).toHaveLength(5)
      expect(result.value.workflows.map((workflow) => workflow.id)).toEqual(workflows.map((workflow) => workflow.id))
      expect(result.value.workflows.map((workflow) => workflow.command)).toEqual(
        workflows.map((workflow) => workflow.command),
      )
      expect(result.value.workflows.map((workflow) => workflow.ok)).toEqual([true, true, true, true, true])
      expect(result.value.workflows.map((workflow) => workflow.exitCode)).toEqual([0, 0, 0, 0, 0])
    }
    expect(calls).toEqual(workflows.map((workflow) => workflow.command))
  })
})

describe("unit section-3 deterministic-signals contracts", () => {
  test("T3-21 success expectation validates deterministic success signal set", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "renkei-dev startup ok serverUrl=http://127.0.0.1:4099",
        stderr: "",
        exitCode: 0,
        json: { ok: true, exitCode: 0 },
      },
      {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
      {
        nowMs: () => 1700000000221,
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.checkedAtMs).toBe(1700000000221)
      expect(result.value.pass).toBe(true)
      expect(result.value.expectation.expectedExitCode).toBe(0)
      expect(result.value.expectation.expectedHumanSignal).toBe("renkei-dev startup ok serverUrl=")
      expect(result.value.expectation.requireJsonContract).toBe(true)
    }
  })

  test("T3-22 failure expectation validates deterministic failure signal set", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "",
        stderr: "renkei-dev startup failed code=HOST_HEALTH_TIMEOUT",
        exitCode: 1,
        json: { ok: false, exitCode: 1 },
      },
      {
        expectedExitCode: 1,
        expectedHumanSignal: "renkei-dev startup failed code=",
        requireJsonContract: true,
      },
      {
        nowMs: () => 1700000000222,
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.checkedAtMs).toBe(1700000000222)
      expect(result.value.pass).toBe(true)
      expect(result.value.expectation.expectedExitCode).toBe(1)
      expect(result.value.expectation.expectedHumanSignal).toBe("renkei-dev startup failed code=")
      expect(result.value.expectation.requireJsonContract).toBe(true)
    }
  })

  test("T3-23 exit code mismatch fails typed", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime
    const allowed = new Set<string>(SIGNAL_ERROR_CODES)

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "renkei-dev startup ok serverUrl=http://127.0.0.1:4099",
        stderr: "",
        exitCode: 1,
        json: { ok: false, exitCode: 1 },
      },
      {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SIGNAL_EXIT_CODE_MISMATCH")
      expect(result.error.expected).toBe(0)
      expect(result.error.actual).toBe(1)
    }
  })

  test("T3-24 missing required human signal prefix fails typed with stream context", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime
    const allowed = new Set<string>(SIGNAL_ERROR_CODES)

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "startup ok serverUrl=http://127.0.0.1:4099",
        stderr: "",
        exitCode: 0,
        json: { ok: true, exitCode: 0 },
      },
      {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SIGNAL_HUMAN_STRING_MISSING")
      expect(result.error.expectedPrefix).toBe("renkei-dev startup ok serverUrl=")
      expect(result.error.stream).toBe("stdout")
    }
  })

  test("T3-25 required JSON contract missing fails typed", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime
    const allowed = new Set<string>(SIGNAL_ERROR_CODES)

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "renkei-dev startup ok serverUrl=http://127.0.0.1:4099",
        stderr: "",
        exitCode: 0,
      },
      {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SIGNAL_JSON_MISSING")
    }
  })

  test("T3-26 JSON ok flag mismatch fails typed", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime
    const allowed = new Set<string>(SIGNAL_ERROR_CODES)

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "renkei-dev startup ok serverUrl=http://127.0.0.1:4099",
        stderr: "",
        exitCode: 0,
        json: { ok: false, exitCode: 0 },
      },
      {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SIGNAL_JSON_OK_FLAG_MISMATCH")
      expect(result.error.expectedOk).toBe(true)
      expect(result.error.actualOk).toBe(false)
    }
  })

  test("T3-27 JSON exit code mismatch fails typed", async () => {
    const runtime = (await loadDeterministicSignalsModule()) as DeterministicSignalsRuntime
    const allowed = new Set<string>(SIGNAL_ERROR_CODES)

    const result = runtime.verifyDeterministicStartupSignals(
      {
        stdout: "",
        stderr: "renkei-dev startup failed code=HOST_HEALTH_TIMEOUT",
        exitCode: 1,
        json: { ok: false, exitCode: 0 },
      },
      {
        expectedExitCode: 1,
        expectedHumanSignal: "renkei-dev startup failed code=",
        requireJsonContract: true,
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SIGNAL_JSON_EXIT_CODE_MISMATCH")
      expect(result.error.expected).toBe(1)
      expect(result.error.actual).toBe(0)
    }
  })
})
