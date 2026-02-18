import type { CapabilityReport, Result, StartupSuccess } from "./types"

type StartupTimingField = "total" | "readiness" | "probe" | "sdk"

export type BaselineRequirement = {
  readonly requiredCompositionSurfaceCount: 4
  readonly requireForkUnavailableInCompositionOnly: true
  readonly requireStartupTimingFields: true
}

export type BaselineStatus = {
  readonly compositionSurfaceCount: number
  readonly forkAvailableCount: number
  readonly mode: "composition-only" | "fork-available"
  readonly timingsPresent: true
}

export type BaselineViolationError =
  | {
      readonly code: "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH"
      readonly expected: number
      readonly actual: number
    }
  | {
      readonly code: "BASELINE_UNEXPECTED_FORK_AVAILABILITY"
      readonly mode: "composition-only" | "fork-available"
      readonly availableCapabilities: ReadonlyArray<string>
    }
  | {
      readonly code: "BASELINE_STARTUP_TIMINGS_MISSING"
      readonly field: StartupTimingField
    }

export type BaselineEvaluation = {
  readonly requirement: BaselineRequirement
  readonly status: BaselineStatus
}

const REQUIRED_TIMING_FIELDS: ReadonlyArray<StartupTimingField> = ["total", "readiness", "probe", "sdk"]

export function defaultBaselineRequirement(): BaselineRequirement {
  return {
    requiredCompositionSurfaceCount: 4,
    requireForkUnavailableInCompositionOnly: true,
    requireStartupTimingFields: true,
  }
}

function countAvailableCompositionSurfaces(report: CapabilityReport): number {
  return report.composition.filter((surface) => surface.available).length
}

function availableForkCapabilities(report: CapabilityReport): ReadonlyArray<string> {
  return report.fork.filter((capability) => capability.available).map((capability) => capability.id)
}

function findMissingTimingField(startup: StartupSuccess): StartupTimingField | null {
  const timings = startup.timingsMs as Partial<Record<StartupTimingField, unknown>>
  for (const field of REQUIRED_TIMING_FIELDS) {
    if (typeof timings[field] !== "number") {
      return field
    }
  }
  return null
}

export function evaluateNoDegradationBaseline(input: {
  readonly report: CapabilityReport
  readonly startup: StartupSuccess
  readonly requirement?: BaselineRequirement
}): Result<BaselineEvaluation, BaselineViolationError> {
  const requirement = input.requirement ?? defaultBaselineRequirement()
  const compositionSurfaceCount = countAvailableCompositionSurfaces(input.report)
  if (compositionSurfaceCount !== requirement.requiredCompositionSurfaceCount) {
    return {
      ok: false,
      error: {
        code: "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH",
        expected: requirement.requiredCompositionSurfaceCount,
        actual: compositionSurfaceCount,
      },
    }
  }

  const availableCapabilities = availableForkCapabilities(input.report)
  if (
    requirement.requireForkUnavailableInCompositionOnly &&
    input.report.mode === "composition-only" &&
    availableCapabilities.length > 0
  ) {
    return {
      ok: false,
      error: {
        code: "BASELINE_UNEXPECTED_FORK_AVAILABILITY",
        mode: input.report.mode,
        availableCapabilities,
      },
    }
  }

  if (requirement.requireStartupTimingFields) {
    const missingTiming = findMissingTimingField(input.startup)
    if (missingTiming) {
      return {
        ok: false,
        error: {
          code: "BASELINE_STARTUP_TIMINGS_MISSING",
          field: missingTiming,
        },
      }
    }
  }

  return {
    ok: true,
    value: {
      requirement,
      status: {
        compositionSurfaceCount,
        forkAvailableCount: availableCapabilities.length,
        mode: input.report.mode,
        timingsPresent: true,
      },
    },
  }
}
