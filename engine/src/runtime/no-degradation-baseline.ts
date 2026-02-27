import type { CapabilityReport, Result, StartupSuccess } from "./types"

type StartupTimingField = "total" | "readiness" | "probe" | "sdk"

export type BaselineRequirement = {
  readonly requiredCompositionSurfaceCount: 4
  readonly requireStartupTimingFields: true
}

export type BaselineStatus = {
  readonly compositionSurfaceCount: number
  readonly timingsPresent: true
}

export type BaselineViolationError =
  | {
      readonly code: "BASELINE_COMPOSITION_SURFACE_COUNT_MISMATCH"
      readonly expected: number
      readonly actual: number
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
    requireStartupTimingFields: true,
  }
}

function countAvailableCompositionSurfaces(report: CapabilityReport): number {
  return report.composition.filter((surface) => surface.available).length
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
        timingsPresent: true,
      },
    },
  }
}
