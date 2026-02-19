import type { DeterministicSignalExpectation } from "./deterministic-signals"

export type RunbookEnvironmentVar = "OPENCODE_SERVER_URL"

export type RunbookCommandID =
  | "bootstrap:vendor-install"
  | "bootstrap:opencode-dev-server"
  | "bootstrap:health-check"
  | "quality:typecheck"
  | "quality:lint"
  | "quality:test-unit"
  | "runtime:renkei-dev-json"
  | "quality:test-integration"

export type RunbookCommandStep = {
  readonly id: RunbookCommandID
  readonly command: ReadonlyArray<string>
  readonly cwd: "repo-root" | "harness"
  readonly requiresEnv?: ReadonlyArray<RunbookEnvironmentVar>
  readonly expectedExitCode: 0
  readonly evidenceKey:
    | "vendorInstall"
    | "opencodeDevServer"
    | "healthCheck"
    | "typecheck"
    | "lint"
    | "testUnit"
    | "renkeiDevJson"
    | "testIntegration"
}

export type RunbookSignalContract = {
  readonly startupSuccess: DeterministicSignalExpectation
  readonly startupFailure: DeterministicSignalExpectation
  readonly requiredJsonFields: ReadonlyArray<"ok" | "exitCode" | "timestampMs" | "defaults">
}

export type SectionESmokeRunbookContract = {
  readonly version: "section-e.v1"
  readonly generatedAtMs: number
  readonly requiredEnv: ReadonlyArray<RunbookEnvironmentVar>
  readonly commandSequence: ReadonlyArray<RunbookCommandStep>
  readonly signalContract: RunbookSignalContract
}

export type RunbookContractDependencies = {
  readonly nowMs: () => number
}

export type RunbookArtifactFormat = "markdown" | "json"

export type RunbookArtifactBindingInput = {
  readonly artifact: string
  readonly format: RunbookArtifactFormat
  readonly contract: SectionESmokeRunbookContract
}

export type RunbookArtifactBindingSuccess = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly format: RunbookArtifactFormat
  readonly expectedBindingTag: string
}

export type RunbookArtifactBindingError =
  | {
      readonly code: "RUNBOOK_BINDING_ARTIFACT_EMPTY"
    }
  | {
      readonly code: "RUNBOOK_BINDING_TAG_MISSING"
      readonly expectedBindingTag: string
    }
  | {
      readonly code: "RUNBOOK_BINDING_COMMAND_ID_SET_MISMATCH"
      readonly missing: ReadonlyArray<RunbookCommandID>
      readonly extra: ReadonlyArray<string>
    }

export type RunbookArtifactBindingDependencies = {
  readonly nowMs: () => number
  readonly serializeCommandIDs: (contract: SectionESmokeRunbookContract) => string
}

// Lookup table mapping command ID to evidence key -- used by runbook-evidence-report
export const STEP_EVIDENCE_KEYS: Readonly<Record<RunbookCommandID, RunbookCommandStep["evidenceKey"]>> = {
  "bootstrap:vendor-install": "vendorInstall",
  "bootstrap:opencode-dev-server": "opencodeDevServer",
  "bootstrap:health-check": "healthCheck",
  "quality:typecheck": "typecheck",
  "quality:lint": "lint",
  "quality:test-unit": "testUnit",
  "runtime:renkei-dev-json": "renkeiDevJson",
  "quality:test-integration": "testIntegration",
}

const CANONICAL_COMMAND_SEQUENCE: ReadonlyArray<RunbookCommandStep> = [
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

export function createSectionESmokeRunbookContract(
  deps?: Partial<RunbookContractDependencies>,
): SectionESmokeRunbookContract {
  const nowMs = deps?.nowMs ?? Date.now

  return {
    version: "section-e.v1",
    generatedAtMs: nowMs(),
    requiredEnv: ["OPENCODE_SERVER_URL"],
    commandSequence: CANONICAL_COMMAND_SEQUENCE,
    signalContract: {
      startupSuccess: {
        expectedExitCode: 0,
        expectedHumanSignal: "renkei-dev startup ok serverUrl=",
        requireJsonContract: true,
      },
      startupFailure: {
        expectedExitCode: 1,
        expectedHumanSignal: "renkei-dev startup failed code=",
        requireJsonContract: false,
      },
      requiredJsonFields: ["ok", "exitCode", "timestampMs", "defaults"],
    },
  }
}
