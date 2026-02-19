import { describe, expect, test } from "bun:test"
import {
  CWD_RESOLUTION_ERROR_CODES,
  EVIDENCE_ERROR_CODES,
  PREFLIGHT_ERROR_CODES,
  RUNBOOK_ARTIFACT_BINDING_ERROR_CODES,
  SIGNAL_ERROR_CODES,
  SMOKE_SEQUENCE_ERROR_CODES,
} from "../helpers/contracts"
import {
  loadCanonicalSmokeSequenceModule,
  loadOperatorRunbookContractModule,
  loadRunbookArtifactBindingModule,
  loadRunbookEnvironmentPreflightModule,
  loadRunbookEvidenceReportModule,
  loadWorkingDirectoryLabelModule,
} from "../helpers/module-loader"

// ---------------------------------------------------------------------------
// Local types (mirror API design -- loaded dynamically so we define locally)
// ---------------------------------------------------------------------------

type RunbookCommandID =
  | "bootstrap:vendor-install"
  | "bootstrap:opencode-dev-server"
  | "bootstrap:health-check"
  | "quality:typecheck"
  | "quality:lint"
  | "quality:test-unit"
  | "runtime:renkei-dev-json"
  | "quality:test-integration"

type RunbookCommandStep = {
  readonly id: RunbookCommandID
  readonly command: ReadonlyArray<string>
  readonly cwd: "repo-root" | "harness"
  readonly requiresEnv?: ReadonlyArray<"OPENCODE_SERVER_URL">
  readonly expectedExitCode: 0
  readonly evidenceKey: string
}

type SectionESmokeRunbookContract = {
  readonly version: "section-e.v1"
  readonly generatedAtMs: number
  readonly requiredEnv: ReadonlyArray<"OPENCODE_SERVER_URL">
  readonly commandSequence: ReadonlyArray<RunbookCommandStep>
  readonly signalContract: {
    readonly startupSuccess: {
      readonly expectedExitCode: 0 | 1
      readonly expectedHumanSignal: string
      readonly requireJsonContract: boolean
    }
    readonly startupFailure: {
      readonly expectedExitCode: 0 | 1
      readonly expectedHumanSignal: string
      readonly requireJsonContract: boolean
    }
    readonly requiredJsonFields: ReadonlyArray<string>
  }
}

type OkResult<T> = { readonly ok: true; readonly value: T }
type ErrResult<E> = { readonly ok: false; readonly error: E }
type AnyResult = OkResult<Record<string, unknown>> | ErrResult<Record<string, unknown>>

type WorkingDirectoryLabel = "repo-root" | "harness"

type EnvironmentPreflightSuccess = {
  readonly checkedAtMs: number
  readonly env: { readonly OPENCODE_SERVER_URL: string }
  readonly resolvedPaths: ReadonlyArray<string>
  readonly workingDirectory: string
  readonly workingDirectoryLabel: WorkingDirectoryLabel
}

type RunbookStepExecution = {
  readonly id: RunbookCommandID
  readonly command: ReadonlyArray<string>
  readonly cwd: "repo-root" | "harness"
  readonly startedAtMs: number
  readonly finishedAtMs: number
  readonly durationMs: number
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
}

type StartupJsonReport = { readonly ok: boolean; readonly exitCode: number }

// ---------------------------------------------------------------------------
// Runtime wrapper types (for dynamic module casts)
// ---------------------------------------------------------------------------

type OperatorRunbookContractRuntime = {
  createSectionESmokeRunbookContract: (deps?: Partial<{ nowMs: () => number }>) => SectionESmokeRunbookContract
}

type RunbookArtifactBindingRuntime = {
  verifyRunbookArtifactGeneratedFromContract: (
    input: {
      artifact: string
      format: "markdown" | "json"
      contract: SectionESmokeRunbookContract
    },
    deps?: Partial<{
      nowMs: () => number
      serializeCommandIDs: (contract: SectionESmokeRunbookContract) => string
    }>,
  ) => AnyResult
}

type CanonicalSmokeSequenceRuntime = {
  canonicalSectionESmokeSequence: () => ReadonlyArray<RunbookCommandStep>
  verifyCanonicalSectionESmokeSequence: (
    steps: ReadonlyArray<RunbookCommandStep>,
    deps?: Partial<{ nowMs: () => number }>,
  ) => AnyResult
}

type WorkingDirectoryLabelRuntime = {
  resolveSectionERunbookWorkingDirectoryLabel: (input: {
    absoluteCwd: string
    repoRootAbsolutePath: string
    harnessAbsolutePath: string
  }) => OkResult<WorkingDirectoryLabel> | ErrResult<Record<string, unknown>>
}

type RunbookEnvironmentPreflightRuntime = {
  verifySectionERunbookEnvironmentPreflight: (
    input: {
      requiredEnv: ReadonlyArray<"OPENCODE_SERVER_URL">
      requiredPaths: ReadonlyArray<string>
      expectedWorkingDirectories: ReadonlyArray<WorkingDirectoryLabel>
    },
    deps?: Partial<{
      nowMs: () => number
      getEnv: (key: "OPENCODE_SERVER_URL") => string | undefined
      parseUrl: (value: string) => OkResult<string> | ErrResult<{ cause: string }>
      pathExists: (path: string) => Promise<boolean>
      cwd: () => string
      resolveRepoRootAbsolutePath: (cwd: string) => OkResult<string> | ErrResult<{ code: string }>
      resolveWorkingDirectoryLabel: (input: {
        absoluteCwd: string
        repoRootAbsolutePath: string
        harnessAbsolutePath: string
      }) => OkResult<WorkingDirectoryLabel> | ErrResult<Record<string, unknown>>
    }>,
  ) => Promise<AnyResult>
}

type SignalInput = { stdout: string; stderr: string; exitCode: number; json?: StartupJsonReport }
type SignalExpectation = { expectedExitCode: 0 | 1; expectedHumanSignal: string; requireJsonContract: boolean }

type RunbookEvidenceReportRuntime = {
  buildSectionERunbookEvidenceReport: (
    input: {
      runbookVersion: "section-e.v1"
      preflight: EnvironmentPreflightSuccess
      stepExecutions: ReadonlyArray<RunbookStepExecution>
      renkeiDevJsonReport?: StartupJsonReport
    },
    deps?: Partial<{
      nowMs: () => number
      verifyCanonicalSectionESmokeSequence: (
        steps: ReadonlyArray<RunbookCommandStep>,
        deps?: Partial<{ nowMs: () => number }>,
      ) => AnyResult
      verifyDeterministicStartupSignals: (input: SignalInput, expectation: SignalExpectation) => AnyResult
    }>,
  ) => AnyResult
}

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const CANONICAL_IDS: ReadonlyArray<RunbookCommandID> = [
  "bootstrap:vendor-install",
  "bootstrap:opencode-dev-server",
  "bootstrap:health-check",
  "quality:typecheck",
  "quality:lint",
  "quality:test-unit",
  "runtime:renkei-dev-json",
  "quality:test-integration",
]

function makeCanonicalSteps(): ReadonlyArray<RunbookCommandStep> {
  return [
    {
      id: "bootstrap:vendor-install",
      command: ["bun", "install", "--cwd", "vendor/opencode"],
      cwd: "repo-root",
      expectedExitCode: 0,
      evidenceKey: "vendorInstall",
    },
    {
      id: "bootstrap:opencode-dev-server",
      command: ["bun", "run", "dev", "--", "serve", "--hostname", "127.0.0.1", "--port", "4099"],
      cwd: "repo-root",
      expectedExitCode: 0,
      evidenceKey: "opencodeDevServer",
    },
    {
      id: "bootstrap:health-check",
      command: ["curl", "-s", "http://127.0.0.1:4099/global/health"],
      cwd: "repo-root",
      expectedExitCode: 0,
      evidenceKey: "healthCheck",
    },
    {
      id: "quality:typecheck",
      command: ["bun", "run", "typecheck"],
      cwd: "harness",
      expectedExitCode: 0,
      evidenceKey: "typecheck",
    },
    {
      id: "quality:lint",
      command: ["bun", "run", "lint"],
      cwd: "harness",
      expectedExitCode: 0,
      evidenceKey: "lint",
    },
    {
      id: "quality:test-unit",
      command: ["bun", "run", "test:unit"],
      cwd: "harness",
      expectedExitCode: 0,
      evidenceKey: "testUnit",
    },
    {
      id: "runtime:renkei-dev-json",
      command: ["bun", "run", "renkei-dev", "--", "--json"],
      cwd: "harness",
      requiresEnv: ["OPENCODE_SERVER_URL"],
      expectedExitCode: 0,
      evidenceKey: "renkeiDevJson",
    },
    {
      id: "quality:test-integration",
      command: ["bun", "run", "test:integration"],
      cwd: "harness",
      requiresEnv: ["OPENCODE_SERVER_URL"],
      expectedExitCode: 0,
      evidenceKey: "testIntegration",
    },
  ]
}

function makeCanonicalStepExecutions(options?: {
  failIndex?: number
  failExitCode?: number
}): ReadonlyArray<RunbookStepExecution> {
  const steps = makeCanonicalSteps()
  return steps.map((step, i) => ({
    id: step.id,
    command: step.command,
    cwd: step.cwd,
    startedAtMs: 1700000000000 + i * 100,
    finishedAtMs: 1700000000050 + i * 100,
    durationMs: 50,
    exitCode: options?.failIndex === i ? (options?.failExitCode ?? 1) : 0,
    stdout: step.id === "runtime:renkei-dev-json" ? "renkei-dev startup ok serverUrl=http://127.0.0.1:4099" : "",
    stderr: "",
  }))
}

function makePreflightSuccess(): EnvironmentPreflightSuccess {
  return {
    checkedAtMs: 1700000000000,
    env: { OPENCODE_SERVER_URL: "http://127.0.0.1:4099" },
    resolvedPaths: ["vendor/opencode", "harness", "harness/config/approved-opencode-surfaces.json"],
    workingDirectory: "/home/user/project/harness",
    workingDirectoryLabel: "harness",
  }
}

function makeStartupJsonReport(): StartupJsonReport {
  return { ok: true, exitCode: 0 }
}

// ---------------------------------------------------------------------------
// T4-01 to T4-03 -- Runbook contract model
// ---------------------------------------------------------------------------

describe("unit section-4 operator-runbook-contract contracts", () => {
  test("T4-01 contract creation emits stable runbook discriminator and required env contract", async () => {
    const runtime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime

    const contract = runtime.createSectionESmokeRunbookContract({ nowMs: () => 1700000000001 })

    expect(contract.version).toBe("section-e.v1")
    expect(contract.requiredEnv).toEqual(["OPENCODE_SERVER_URL"])
    expect(contract.generatedAtMs).toBe(1700000000001)
  })

  test("T4-02 command sequence IDs are unique, stable, and ordered to canonical Section E flow", async () => {
    const runtime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime

    const contract = runtime.createSectionESmokeRunbookContract()
    const ids = contract.commandSequence.map((step) => step.id)

    expect(ids).toEqual(CANONICAL_IDS)
    expect(new Set(ids).size).toBe(8)
  })

  test("T4-03 signal contract pins deterministic startup prefixes and required JSON keys", async () => {
    const runtime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime

    const contract = runtime.createSectionESmokeRunbookContract()

    expect(contract.signalContract.startupSuccess.expectedHumanSignal).toBe("renkei-dev startup ok serverUrl=")
    expect(contract.signalContract.startupFailure.expectedHumanSignal).toBe("renkei-dev startup failed code=")
    expect(contract.signalContract.requiredJsonFields).toContain("ok")
    expect(contract.signalContract.requiredJsonFields).toContain("exitCode")
    expect(contract.signalContract.requiredJsonFields).toContain("timestampMs")
    expect(contract.signalContract.requiredJsonFields).toContain("defaults")
  })
})

// ---------------------------------------------------------------------------
// T4-23 to T4-26 -- Runbook artifact binding
// ---------------------------------------------------------------------------

describe("unit section-4 runbook-artifact-binding contracts", () => {
  test("T4-23 empty artifact fails typed as binding-artifact-empty", async () => {
    const runtime = (await loadRunbookArtifactBindingModule()) as RunbookArtifactBindingRuntime
    const contractRuntime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime
    const allowed = new Set<string>(RUNBOOK_ARTIFACT_BINDING_ERROR_CODES)

    const contract = contractRuntime.createSectionESmokeRunbookContract()
    const result = runtime.verifyRunbookArtifactGeneratedFromContract({
      artifact: "",
      format: "markdown",
      contract,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_BINDING_ARTIFACT_EMPTY")
    }
  })

  test("T4-24 missing generated-from tag fails typed with expected tag", async () => {
    const runtime = (await loadRunbookArtifactBindingModule()) as RunbookArtifactBindingRuntime
    const contractRuntime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime
    const allowed = new Set<string>(RUNBOOK_ARTIFACT_BINDING_ERROR_CODES)

    const contract = contractRuntime.createSectionESmokeRunbookContract()
    const result = runtime.verifyRunbookArtifactGeneratedFromContract(
      {
        artifact: "# Section E Runbook\n\nThis is a runbook without the required binding tag.",
        format: "markdown",
        contract,
      },
      {
        nowMs: () => 1700000000024,
        serializeCommandIDs: (c) => c.commandSequence.map((s) => s.id).join(","),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_BINDING_TAG_MISSING")
      const tag = String(result.error.expectedBindingTag)
      expect(tag).toContain("generated-from:section-e.v1:")
      expect(tag).toContain("bootstrap:vendor-install")
    }
  })

  test("T4-25 command-id set mismatch fails typed with missing and extra sets", async () => {
    const runtime = (await loadRunbookArtifactBindingModule()) as RunbookArtifactBindingRuntime
    const contractRuntime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime
    const allowed = new Set<string>(RUNBOOK_ARTIFACT_BINDING_ERROR_CODES)

    const contract = contractRuntime.createSectionESmokeRunbookContract()
    // Artifact has the prefix but with one missing ID and one extra unknown ID
    const missingId = "quality:typecheck"
    const extraId = "extra:unknown-step"
    const artifactIds = [
      "bootstrap:vendor-install",
      "bootstrap:opencode-dev-server",
      "bootstrap:health-check",
      // quality:typecheck is intentionally missing
      "quality:lint",
      "quality:test-unit",
      "runtime:renkei-dev-json",
      "quality:test-integration",
      extraId,
    ].join(",")
    const artifact = `# Section E Runbook\n\ngenerated-from:section-e.v1:${artifactIds}\n`

    const result = runtime.verifyRunbookArtifactGeneratedFromContract(
      { artifact, format: "markdown", contract },
      { nowMs: () => 1700000000025 },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_BINDING_COMMAND_ID_SET_MISMATCH")
      expect(Array.isArray(result.error.missing)).toBe(true)
      expect(Array.isArray(result.error.extra)).toBe(true)
      expect((result.error.missing as string[]).includes(missingId)).toBe(true)
      expect((result.error.extra as string[]).includes(extraId)).toBe(true)
    }
  })

  test("T4-26 markdown and json pass-path bindings succeed with deterministic metadata", async () => {
    const runtime = (await loadRunbookArtifactBindingModule()) as RunbookArtifactBindingRuntime
    const contractRuntime = (await loadOperatorRunbookContractModule()) as OperatorRunbookContractRuntime

    const contract = contractRuntime.createSectionESmokeRunbookContract()
    const serializeCommandIDs = (c: SectionESmokeRunbookContract) => c.commandSequence.map((s) => s.id).join(",")
    const serializedIds = serializeCommandIDs(contract)
    const bindingTag = `generated-from:section-e.v1:${serializedIds}`

    const markdownArtifact = `# Section E Runbook\n\n<!-- ${bindingTag} -->\n`
    const jsonArtifact = `{"bindingTag":"${bindingTag}","content":"runbook"}`

    for (const [artifact, format] of [
      [markdownArtifact, "markdown"],
      [jsonArtifact, "json"],
    ] as const) {
      const result = runtime.verifyRunbookArtifactGeneratedFromContract(
        { artifact, format: format as "markdown" | "json", contract },
        { nowMs: () => 1700000000026, serializeCommandIDs },
      )

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.pass).toBe(true)
        expect(result.value.checkedAtMs).toBe(1700000000026)
        expect(result.value.format).toBe(format)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// T4-04 to T4-09 -- Canonical smoke sequence
// ---------------------------------------------------------------------------

describe("unit section-4 canonical-smoke-sequence contracts", () => {
  test("T4-04 canonical smoke sequence returns full contract-complete eight-step tuple", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime

    const sequence = runtime.canonicalSectionESmokeSequence()

    expect(sequence).toHaveLength(8)
    expect(sequence.map((s) => s.id)).toEqual(CANONICAL_IDS)

    // Only runtime:renkei-dev-json and quality:test-integration require env
    for (const step of sequence) {
      if (step.id === "runtime:renkei-dev-json" || step.id === "quality:test-integration") {
        expect(step.requiresEnv).toEqual(["OPENCODE_SERVER_URL"])
      } else {
        expect(step.requiresEnv == null || (step.requiresEnv as ReadonlyArray<string>).length === 0).toBe(true)
      }
    }

    // All exit codes are 0
    for (const step of sequence) {
      expect(step.expectedExitCode).toBe(0)
    }
  })

  test("T4-05 canonical verifier success yields deterministic pass report", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime

    const sequence = runtime.canonicalSectionESmokeSequence()
    const result = runtime.verifyCanonicalSectionESmokeSequence(sequence, { nowMs: () => 1700000000005 })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.pass).toBe(true)
      expect(result.value.checkedAtMs).toBe(1700000000005)
      expect(result.value.sequence).toEqual(sequence)
    }
  })

  test("T4-06 length mismatch fails typed with expected/actual counts", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime
    const allowed = new Set<string>(SMOKE_SEQUENCE_ERROR_CODES)

    const sequence = Array.from(runtime.canonicalSectionESmokeSequence())
    const truncated = sequence.slice(0, 7)
    const result = runtime.verifyCanonicalSectionESmokeSequence(truncated)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SMOKE_SEQUENCE_LENGTH_INVALID")
      expect(result.error.expected).toBe(8)
      expect(result.error.actual).toBe(7)
    }
  })

  test("T4-07 step order mismatch fails typed with index and expected/actual IDs", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime
    const allowed = new Set<string>(SMOKE_SEQUENCE_ERROR_CODES)

    // Swap steps at index 3 (quality:typecheck) and 4 (quality:lint)
    const sequence = Array.from(runtime.canonicalSectionESmokeSequence())
    ;[sequence[3], sequence[4]] = [sequence[4], sequence[3]]
    const result = runtime.verifyCanonicalSectionESmokeSequence(sequence)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SMOKE_SEQUENCE_STEP_MISMATCH")
      expect(result.error.index).toBe(3)
      expect(result.error.expected).toBe("quality:typecheck")
      expect(result.error.actual).toBe("quality:lint")
    }
  })

  test("T4-08 empty command array fails typed with offending step ID", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime
    const allowed = new Set<string>(SMOKE_SEQUENCE_ERROR_CODES)

    const sequence = Array.from(runtime.canonicalSectionESmokeSequence()) as RunbookCommandStep[]
    sequence[2] = { ...sequence[2], command: [] }
    const result = runtime.verifyCanonicalSectionESmokeSequence(sequence)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SMOKE_SEQUENCE_COMMAND_EMPTY")
      expect(result.error.id).toBe("bootstrap:health-check")
    }
  })

  test("T4-09 non-zero expected exit code fails typed as contract corruption", async () => {
    const runtime = (await loadCanonicalSmokeSequenceModule()) as CanonicalSmokeSequenceRuntime
    const allowed = new Set<string>(SMOKE_SEQUENCE_ERROR_CODES)

    // Bypass TypeScript literal type restriction via any cast
    const sequence = Array.from(runtime.canonicalSectionESmokeSequence()) as any[]
    sequence[5] = { ...sequence[5], expectedExitCode: 1 }
    const result = runtime.verifyCanonicalSectionESmokeSequence(sequence as RunbookCommandStep[])

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("SMOKE_SEQUENCE_EXPECTED_EXIT_INVALID")
      expect(result.error.id).toBe("quality:test-unit")
      expect(result.error.expectedExitCode).toBe(1)
    }
  })
})

// ---------------------------------------------------------------------------
// T4-27 to T4-29 -- Working-directory label resolver
// ---------------------------------------------------------------------------

describe("unit section-4 working-directory-label contracts", () => {
  test("T4-27 non-absolute input fails typed for offending path", async () => {
    const runtime = (await loadWorkingDirectoryLabelModule()) as WorkingDirectoryLabelRuntime
    const allowed = new Set<string>(CWD_RESOLUTION_ERROR_CODES)

    const validAbs = "/home/user/project"
    const validHarness = "/home/user/project/harness"

    const cases = [
      {
        input: {
          absoluteCwd: "relative/path",
          repoRootAbsolutePath: validAbs,
          harnessAbsolutePath: validHarness,
        },
        offendingPath: "relative/path",
      },
      {
        input: {
          absoluteCwd: validAbs,
          repoRootAbsolutePath: "relative/repo",
          harnessAbsolutePath: validHarness,
        },
        offendingPath: "relative/repo",
      },
      {
        input: {
          absoluteCwd: validAbs,
          repoRootAbsolutePath: validAbs,
          harnessAbsolutePath: "relative/harness",
        },
        offendingPath: "relative/harness",
      },
    ]

    for (const testCase of cases) {
      const result = runtime.resolveSectionERunbookWorkingDirectoryLabel(testCase.input)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(allowed.has(String(result.error.code))).toBe(true)
        expect(result.error.code).toBe("RUNBOOK_CWD_NOT_ABSOLUTE")
        expect(result.error.path).toBe(testCase.offendingPath)
      }
    }
  })

  test("T4-28 traversal segments fail typed before label matching", async () => {
    const runtime = (await loadWorkingDirectoryLabelModule()) as WorkingDirectoryLabelRuntime
    const allowed = new Set<string>(CWD_RESOLUTION_ERROR_CODES)

    const cases = [
      {
        absoluteCwd: "/home/user/../user/project",
        repoRootAbsolutePath: "/home/user/project",
        harnessAbsolutePath: "/home/user/project/harness",
      },
      {
        absoluteCwd: "/home/user/./project",
        repoRootAbsolutePath: "/home/user/project",
        harnessAbsolutePath: "/home/user/project/harness",
      },
    ]

    for (const testCase of cases) {
      const result = runtime.resolveSectionERunbookWorkingDirectoryLabel(testCase)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(allowed.has(String(result.error.code))).toBe(true)
        expect(result.error.code).toBe("RUNBOOK_CWD_PATH_TRAVERSAL")
      }
    }
  })

  test("T4-29 exact normalized matches resolve labels; unresolved cwd fails typed", async () => {
    const runtime = (await loadWorkingDirectoryLabelModule()) as WorkingDirectoryLabelRuntime
    const allowed = new Set<string>(CWD_RESOLUTION_ERROR_CODES)

    const repoRoot = "/home/user/project"
    const harness = "/home/user/project/harness"

    const repoResult = runtime.resolveSectionERunbookWorkingDirectoryLabel({
      absoluteCwd: repoRoot,
      repoRootAbsolutePath: repoRoot,
      harnessAbsolutePath: harness,
    })
    expect(repoResult.ok).toBe(true)
    if (repoResult.ok) {
      expect(repoResult.value).toBe("repo-root")
    }

    const harnessResult = runtime.resolveSectionERunbookWorkingDirectoryLabel({
      absoluteCwd: harness,
      repoRootAbsolutePath: repoRoot,
      harnessAbsolutePath: harness,
    })
    expect(harnessResult.ok).toBe(true)
    if (harnessResult.ok) {
      expect(harnessResult.value).toBe("harness")
    }

    const unmatchedResult = runtime.resolveSectionERunbookWorkingDirectoryLabel({
      absoluteCwd: "/home/user/other",
      repoRootAbsolutePath: repoRoot,
      harnessAbsolutePath: harness,
    })
    expect(unmatchedResult.ok).toBe(false)
    if (!unmatchedResult.ok) {
      expect(allowed.has(String(unmatchedResult.error.code))).toBe(true)
      expect(unmatchedResult.error.code).toBe("RUNBOOK_CWD_LABEL_UNRESOLVED")
      expect(Array.isArray(unmatchedResult.error.allowed)).toBe(true)
    }
  })
})

// ---------------------------------------------------------------------------
// T4-10 to T4-15 -- Environment preflight verifier
// ---------------------------------------------------------------------------

describe("unit section-4 runbook-environment-preflight contracts", () => {
  test("T4-10 missing required env var fails typed before path/cwd checks", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const allowed = new Set<string>(PREFLIGHT_ERROR_CODES)

    let pathExistsCalled = 0
    let cwdCalled = 0

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => undefined,
        pathExists: async () => {
          pathExistsCalled++
          return true
        },
        cwd: () => {
          cwdCalled++
          return "/some/path"
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_PREFLIGHT_ENV_MISSING")
      expect(result.error.envVar).toBe("OPENCODE_SERVER_URL")
    }
    expect(pathExistsCalled).toBe(0)
    expect(cwdCalled).toBe(0)
  })

  test("T4-11 invalid URL fails typed with value and parser cause", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const allowed = new Set<string>(PREFLIGHT_ERROR_CODES)

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: [],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => "not-a-valid-url",
        parseUrl: (value) => ({ ok: false, error: { cause: `invalid-url:${value}` } }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_PREFLIGHT_ENV_INVALID_URL")
      expect(result.error.envVar).toBe("OPENCODE_SERVER_URL")
      expect(result.error.value).toBe("not-a-valid-url")
      expect(typeof result.error.cause).toBe("string")
    }
  })

  test("T4-12 missing required path fails typed and names first missing path", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const allowed = new Set<string>(PREFLIGHT_ERROR_CODES)

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode", "harness", "harness/config/approved-opencode-surfaces.json"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => "http://127.0.0.1:4099",
        parseUrl: (value) => ({ ok: true, value }),
        pathExists: async (path) => path !== "harness",
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_PREFLIGHT_PATH_MISSING")
      expect(result.error.path).toBe("harness")
    }
  })

  test("T4-13 invalid cwd fails typed after env/path checks pass", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const allowed = new Set<string>(PREFLIGHT_ERROR_CODES)

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => "http://127.0.0.1:4099",
        parseUrl: (value) => ({ ok: true, value }),
        pathExists: async () => true,
        cwd: () => "/some/unrelated/directory",
        resolveWorkingDirectoryLabel: () => ({
          ok: false,
          error: {
            code: "RUNBOOK_CWD_LABEL_UNRESOLVED",
            normalizedCwd: "/some/unrelated/directory",
            allowed: ["repo-root", "harness"],
          },
        }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_PREFLIGHT_CWD_INVALID")
      expect(typeof result.error.cwd).toBe("string")
      expect(Array.isArray(result.error.allowed)).toBe(true)
    }
  })

  test("T4-14 success returns normalized env, resolved paths, cwd, and deterministic timestamp", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode", "harness"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        nowMs: () => 1700000000014,
        getEnv: () => "http://127.0.0.1:4099",
        parseUrl: (value) => ({ ok: true, value: value.trim() }),
        pathExists: async () => true,
        cwd: () => "/home/user/project/harness",
        resolveRepoRootAbsolutePath: () => ({ ok: true, value: "/home/user/project" }),
        resolveWorkingDirectoryLabel: () => ({ ok: true, value: "harness" }),
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      const val = result.value as {
        checkedAtMs: number
        env: { OPENCODE_SERVER_URL: string }
        resolvedPaths: string[]
        workingDirectory: string
        workingDirectoryLabel: string
      }
      expect(val.checkedAtMs).toBe(1700000000014)
      expect(val.env.OPENCODE_SERVER_URL).toBe("http://127.0.0.1:4099")
      expect(val.resolvedPaths.includes("vendor/opencode")).toBe(true)
      expect(val.resolvedPaths.includes("harness")).toBe(true)
      expect(typeof val.workingDirectory).toBe("string")
      expect(val.workingDirectoryLabel).toBe("harness")
    }
  })

  test("default cwd and repo-root resolvers are exercised without dependency injection", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const currentCwd = process.cwd()

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode", "harness"],
        expectedWorkingDirectories: ["repo-root", "harness"],
      },
      {
        nowMs: () => 1700000000014,
        getEnv: () => "http://127.0.0.1:4099",
        parseUrl: (value) => ({ ok: true, value }),
        pathExists: async () => true,
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(["repo-root", "harness"]).toContain(result.value.workingDirectoryLabel)
      expect(result.value.workingDirectory).toBe(currentCwd)
    }
  })

  test("repo-root resolution failure maps to typed cwd-invalid preflight error", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime
    const allowed = new Set<string>(PREFLIGHT_ERROR_CODES)

    const result = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => "http://127.0.0.1:4099",
        parseUrl: (value) => ({ ok: true, value }),
        pathExists: async () => true,
        cwd: () => "/workspace/renkei/harness",
        resolveRepoRootAbsolutePath: () => ({ ok: false, error: { code: "PATH_TARGET_MISSING" } }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_PREFLIGHT_CWD_INVALID")
      expect(result.error.cwd).toBe("/workspace/renkei/harness")
    }
  })

  test("T4-15 preflight validation order is deterministic: env -> paths -> cwd", async () => {
    const runtime = (await loadRunbookEnvironmentPreflightModule()) as RunbookEnvironmentPreflightRuntime

    // Case 1: env failure -- only env stage runs, pathExists and cwd not called
    const callOrder1: string[] = []
    const result1 = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => {
          callOrder1.push("getEnv")
          return undefined
        },
        parseUrl: (value) => {
          callOrder1.push("parseUrl")
          return { ok: true, value }
        },
        pathExists: async () => {
          callOrder1.push("pathExists")
          return true
        },
        cwd: () => {
          callOrder1.push("cwd")
          return "/some/path"
        },
      },
    )
    expect(result1.ok).toBe(false)
    expect(callOrder1).toContain("getEnv")
    expect(callOrder1.includes("pathExists")).toBe(false)
    expect(callOrder1.includes("cwd")).toBe(false)

    // Case 2: path failure -- cwd not called
    const callOrder2: string[] = []
    const result2 = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => {
          callOrder2.push("getEnv")
          return "http://127.0.0.1:4099"
        },
        parseUrl: (value) => {
          callOrder2.push("parseUrl")
          return { ok: true, value }
        },
        pathExists: async () => {
          callOrder2.push("pathExists")
          return false
        },
        cwd: () => {
          callOrder2.push("cwd")
          return "/some/path"
        },
      },
    )
    expect(result2.ok).toBe(false)
    expect(callOrder2).toContain("getEnv")
    expect(callOrder2).toContain("parseUrl")
    expect(callOrder2).toContain("pathExists")
    expect(callOrder2.includes("cwd")).toBe(false)

    // Case 3: cwd failure -- all prior stages run once each in correct order
    const callOrder3: string[] = []
    const result3 = await runtime.verifySectionERunbookEnvironmentPreflight(
      {
        requiredEnv: ["OPENCODE_SERVER_URL"],
        requiredPaths: ["vendor/opencode"],
        expectedWorkingDirectories: ["harness"],
      },
      {
        getEnv: () => {
          callOrder3.push("getEnv")
          return "http://127.0.0.1:4099"
        },
        parseUrl: (value) => {
          callOrder3.push("parseUrl")
          return { ok: true, value }
        },
        pathExists: async () => {
          callOrder3.push("pathExists")
          return true
        },
        cwd: () => {
          callOrder3.push("cwd")
          return "/some/path"
        },
        resolveWorkingDirectoryLabel: () => ({
          ok: false,
          error: {
            code: "RUNBOOK_CWD_LABEL_UNRESOLVED",
            normalizedCwd: "/some/path",
            allowed: ["repo-root", "harness"],
          },
        }),
      },
    )
    expect(result3.ok).toBe(false)
    expect(callOrder3.indexOf("getEnv")).toBeLessThan(callOrder3.indexOf("pathExists"))
    expect(callOrder3.indexOf("pathExists")).toBeLessThan(callOrder3.indexOf("cwd"))
  })
})

// ---------------------------------------------------------------------------
// T4-16 to T4-22 -- Runbook evidence report builder
// ---------------------------------------------------------------------------

describe("unit section-4 runbook-evidence-report contracts", () => {
  test("T4-16 sequence contract violation is wrapped as evidence-sequence-invalid", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime
    const allowed = new Set<string>(EVIDENCE_ERROR_CODES)
    const smokeAllowed = new Set<string>(SMOKE_SEQUENCE_ERROR_CODES)

    const knownError = { code: "SMOKE_SEQUENCE_LENGTH_INVALID", expected: 8, actual: 3 }

    const result = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions: makeCanonicalStepExecutions(),
      },
      {
        verifyCanonicalSectionESmokeSequence: () => ({ ok: false, error: knownError }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_EVIDENCE_SEQUENCE_INVALID")
      expect(result.error.error !== undefined && result.error.error !== null).toBe(true)
      const nested = result.error.error as Record<string, unknown>
      expect(smokeAllowed.has(String(nested.code))).toBe(true)
      expect(nested.code).toBe("SMOKE_SEQUENCE_LENGTH_INVALID")
    }
  })

  test("T4-17 first non-zero step exit fails typed and short-circuits signal verification", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime
    const allowed = new Set<string>(EVIDENCE_ERROR_CODES)

    let signalVerifierCalled = 0
    const stepExecutions = makeCanonicalStepExecutions({ failIndex: 4, failExitCode: 7 })

    const result = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions,
        renkeiDevJsonReport: makeStartupJsonReport(),
      },
      {
        verifyCanonicalSectionESmokeSequence: () => ({
          ok: true,
          value: { checkedAtMs: 1700000000000, pass: true, sequence: makeCanonicalSteps() },
        }),
        verifyDeterministicStartupSignals: () => {
          signalVerifierCalled++
          return { ok: true, value: {} }
        },
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_EVIDENCE_STEP_FAILED")
      expect(result.error.stepID).toBe("quality:lint")
      expect(result.error.exitCode).toBe(7)
    }
    expect(signalVerifierCalled).toBe(0)
  })

  test("T4-18 missing renkei-dev JSON report fails typed", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime
    const allowed = new Set<string>(EVIDENCE_ERROR_CODES)

    const result = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions: makeCanonicalStepExecutions(), // all exit 0
        // renkeiDevJsonReport intentionally omitted
      },
      {
        verifyCanonicalSectionESmokeSequence: () => ({
          ok: true,
          value: { checkedAtMs: 1700000000000, pass: true, sequence: makeCanonicalSteps() },
        }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_EVIDENCE_JSON_MISSING")
    }
  })

  test("T4-19 deterministic signal mismatch propagates typed signal failure", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime
    const allowed = new Set<string>(EVIDENCE_ERROR_CODES)
    const signalAllowed = new Set<string>(SIGNAL_ERROR_CODES)

    const knownSignalError = { code: "SIGNAL_EXIT_CODE_MISMATCH", expected: 0, actual: 1 }

    const result = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions: makeCanonicalStepExecutions(),
        renkeiDevJsonReport: makeStartupJsonReport(),
      },
      {
        verifyCanonicalSectionESmokeSequence: () => ({
          ok: true,
          value: { checkedAtMs: 1700000000000, pass: true, sequence: makeCanonicalSteps() },
        }),
        verifyDeterministicStartupSignals: () => ({ ok: false, error: knownSignalError }),
      },
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(allowed.has(String(result.error.code))).toBe(true)
      expect(result.error.code).toBe("RUNBOOK_EVIDENCE_SIGNAL_INVALID")
      expect(result.error.error !== undefined && result.error.error !== null).toBe(true)
      const nested = result.error.error as Record<string, unknown>
      expect(signalAllowed.has(String(nested.code))).toBe(true)
      expect(nested.code).toBe("SIGNAL_EXIT_CODE_MISMATCH")
    }
  })

  test("T4-20 success evidence report is stable, minimal, and machine-comparable", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime

    const stepExecutions = makeCanonicalStepExecutions()
    const jsonReport = makeStartupJsonReport()

    const result = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions,
        renkeiDevJsonReport: jsonReport,
      },
      {
        nowMs: () => 1700000000020,
        verifyCanonicalSectionESmokeSequence: () => ({
          ok: true,
          value: { checkedAtMs: 1700000000000, pass: true, sequence: makeCanonicalSteps() },
        }),
        verifyDeterministicStartupSignals: () => ({ ok: true, value: {} }),
      },
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.generatedAtMs).toBe(1700000000020)
      expect(result.value.pass).toBe(true)
      expect(result.value.runbookVersion).toBe("section-e.v1")
      expect(Array.isArray(result.value.steps)).toBe(true)
      expect((result.value.steps as unknown[]).length).toBe(8)
      for (const step of result.value.steps as Record<string, unknown>[]) {
        expect(step.ok).toBe(true)
        expect(step.exitCode).toBe(0)
        expect(typeof step.id).toBe("string")
        expect(typeof step.durationMs).toBe("number")
        // Minimal output -- no raw stdout/stderr
        expect(step.stdout).toBeUndefined()
        expect(step.stderr).toBeUndefined()
      }
      const signals = result.value.deterministicSignals as Record<string, unknown>
      expect(signals.startupSuccessVerified).toBe(true)
      expect(signals.jsonContractVerified).toBe(true)
    }
  })

  test("T4-21 evidence rejects reordered/partial runbook executions as runbook contract violations", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime
    const allowed = new Set<string>(EVIDENCE_ERROR_CODES)

    const strictVerifier = (steps: ReadonlyArray<RunbookCommandStep>): AnyResult => {
      if (steps.length !== 8) {
        return {
          ok: false,
          error: { code: "SMOKE_SEQUENCE_LENGTH_INVALID", expected: 8, actual: steps.length },
        }
      }
      for (let i = 0; i < 8; i++) {
        if (steps[i].id !== CANONICAL_IDS[i]) {
          return {
            ok: false,
            error: {
              code: "SMOKE_SEQUENCE_STEP_MISMATCH",
              index: i,
              expected: CANONICAL_IDS[i],
              actual: steps[i].id,
            },
          }
        }
      }
      return {
        ok: true,
        value: { checkedAtMs: Date.now(), pass: true, sequence: steps as unknown as Record<string, unknown> },
      }
    }

    // Reordered: swap steps 0 and 1
    const reorderedExecutions = Array.from(makeCanonicalStepExecutions())
    ;[reorderedExecutions[0], reorderedExecutions[1]] = [reorderedExecutions[1], reorderedExecutions[0]]

    const result1 = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions: reorderedExecutions,
        renkeiDevJsonReport: makeStartupJsonReport(),
      },
      { verifyCanonicalSectionESmokeSequence: strictVerifier },
    )

    expect(result1.ok).toBe(false)
    if (!result1.ok) {
      expect(allowed.has(String(result1.error.code))).toBe(true)
      expect(result1.error.code).toBe("RUNBOOK_EVIDENCE_SEQUENCE_INVALID")
    }

    // Partial: only 5 steps
    const partialExecutions = makeCanonicalStepExecutions().slice(0, 5)

    const result2 = runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions: partialExecutions,
        renkeiDevJsonReport: makeStartupJsonReport(),
      },
      { verifyCanonicalSectionESmokeSequence: strictVerifier },
    )

    expect(result2.ok).toBe(false)
    if (!result2.ok) {
      expect(allowed.has(String(result2.error.code))).toBe(true)
      expect(result2.error.code).toBe("RUNBOOK_EVIDENCE_SEQUENCE_INVALID")
    }
  })

  test("T4-22 evidence uses startup-success deterministic expectation contract", async () => {
    const runtime = (await loadRunbookEvidenceReportModule()) as RunbookEvidenceReportRuntime

    let capturedInput: SignalInput | null = null
    let capturedExpectation: SignalExpectation | null = null

    const stepExecutions = makeCanonicalStepExecutions()
    const renkeiStep = stepExecutions.find((s) => s.id === "runtime:renkei-dev-json")!
    const jsonReport = makeStartupJsonReport()

    runtime.buildSectionERunbookEvidenceReport(
      {
        runbookVersion: "section-e.v1",
        preflight: makePreflightSuccess(),
        stepExecutions,
        renkeiDevJsonReport: jsonReport,
      },
      {
        verifyCanonicalSectionESmokeSequence: () => ({
          ok: true,
          value: { checkedAtMs: 1700000000000, pass: true, sequence: makeCanonicalSteps() },
        }),
        verifyDeterministicStartupSignals: (input, expectation) => {
          capturedInput = input as SignalInput
          capturedExpectation = expectation as SignalExpectation
          return { ok: true, value: {} }
        },
      },
    )

    expect(capturedExpectation !== null).toBe(true)
    const exp = capturedExpectation as unknown as SignalExpectation
    expect(exp.expectedExitCode).toBe(0)
    expect(exp.expectedHumanSignal).toBe("renkei-dev startup ok serverUrl=")
    expect(exp.requireJsonContract).toBe(true)
    expect(capturedInput !== null).toBe(true)
    const inp = capturedInput as unknown as SignalInput
    expect(inp.stdout).toBe(renkeiStep.stdout)
    expect(inp.stderr).toBe(renkeiStep.stderr)
    expect(inp.exitCode).toBe(renkeiStep.exitCode)
    expect(inp.json).toEqual(jsonReport)
  })
})
