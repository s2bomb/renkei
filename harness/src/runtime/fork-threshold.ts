import { hasForkCapability } from "./integration-probe"
import { recordSpan } from "./observability"
import type {
  CapabilityReport,
  ForkBoundaryReport,
  ForkCapabilityID,
  ForkDecision,
  ForkThreshold,
  ForkThresholdError,
  Result,
} from "./types"

const FORK_THRESHOLDS: ReadonlyArray<ForkThreshold> = [
  {
    capability: "session-name",
    condition: "Session schema/create path exposes optional name field",
    schemaEvidence: "packages/opencode/src/session/index.ts:114",
    runtimeEvidence: "packages/opencode/src/session/index.ts:267",
    diffPreview: "+ name: z.string().optional()",
  },
  {
    capability: "active-child-query",
    condition: "Session children query accepts active filter",
    schemaEvidence: "packages/opencode/src/session/index.ts:547",
    runtimeEvidence: "packages/opencode/src/session/index.ts:547",
    diffPreview: "+ if (input.active === true) conditions.push(...)",
  },
  {
    capability: "background-launch",
    condition: "teams tool launches subagent prompt non-blocking",
    schemaEvidence: "packages/opencode/src/tool/registry.ts:99",
    runtimeEvidence: "packages/opencode/src/tool/task.ts:128",
    diffPreview: "+ const promise = SessionPrompt.prompt(...)",
  },
  {
    capability: "message-provenance",
    condition: "Message schema includes source/sourceSessionID/sourceName",
    schemaEvidence: "packages/opencode/src/session/message-v2.ts:345",
    runtimeEvidence: "packages/opencode/src/session/prompt.ts",
    diffPreview: "+ source: z.enum(['human', 'parent', 'child']).optional()",
  },
  {
    capability: "prompt-wrapper",
    condition: "Prompt loop renders parent/child wrappers from source metadata",
    schemaEvidence: "packages/opencode/src/session/prompt.ts",
    runtimeEvidence: "packages/opencode/src/session/prompt.ts",
    diffPreview: "+ <parent-agent-message ...> ... </parent-agent-message>",
  },
]

function getThreshold(capability: ForkCapabilityID): ForkThreshold {
  const threshold = FORK_THRESHOLDS.find((item) => item.capability === capability)
  if (!threshold) {
    throw new Error(`Unknown fork capability: ${capability}`)
  }
  return threshold
}

export function listForkThresholds(): ReadonlyArray<ForkThreshold> {
  return FORK_THRESHOLDS.slice()
}

export function evaluateForkThreshold(
  capability: ForkCapabilityID,
  report: CapabilityReport,
): Result<ForkDecision, ForkThresholdError> {
  const available = hasForkCapability(report, capability)
  const threshold = getThreshold(capability)
  const value: ForkDecision = available
    ? { mode: "compose", capability }
    : { mode: "fork-required", capability, threshold }

  recordSpan("harness.fork-threshold.evaluate", {
    capability,
    mode: value.mode,
    available,
  })
  return { ok: true, value }
}

export function requireForkCapability(
  capability: ForkCapabilityID,
  report: CapabilityReport,
): Result<void, ForkThresholdError> {
  const decision = evaluateForkThreshold(capability, report)
  if (!decision.ok) {
    return decision
  }
  if (decision.value.mode === "compose") {
    return { ok: true, value: undefined }
  }
  return {
    ok: false,
    error: {
      code: "FORK_CAPABILITY_UNAVAILABLE",
      capability,
      threshold: decision.value.threshold,
    },
  }
}

export function describeForkBoundary(report: CapabilityReport): ForkBoundaryReport {
  const composable: Array<ForkDecision & { mode: "compose" }> = []
  const forkRequired: Array<ForkDecision & { mode: "fork-required" }> = []

  for (const threshold of FORK_THRESHOLDS) {
    const result = evaluateForkThreshold(threshold.capability, report)
    if (!result.ok) {
      continue
    }
    if (result.value.mode === "compose") {
      composable.push(result.value)
      continue
    }
    forkRequired.push(result.value)
  }

  return {
    composable,
    forkRequired,
  }
}

export function resolveForkThreshold(capability: ForkCapabilityID): ForkThreshold {
  return getThreshold(capability)
}
