import type { ApprovedSurfaceRegistry } from "./approved-surface-registry"
import type { CapabilityReport, CompositionSurfaceID, ProbeError, Result } from "./types"

export type SurfaceGateInput = {
  readonly report: CapabilityReport
  readonly requiredSurfaces: ReadonlyArray<CompositionSurfaceID>
  readonly approvedRegistry: ApprovedSurfaceRegistry
}

export type SurfaceGateViolation =
  | {
      readonly code: "SURFACE_NOT_APPROVED"
      readonly surface: string
      readonly approved: ReadonlyArray<CompositionSurfaceID>
    }
  | {
      readonly code: "REQUIRED_SURFACE_UNAVAILABLE"
      readonly surface: CompositionSurfaceID
      readonly probeError: Extract<ProbeError, { readonly code: "MISSING_REQUIRED_SURFACE" }>
    }
  | {
      readonly code: "SURFACE_REPORT_CONTAINS_DUPLICATE"
      readonly surface: string
    }
  | {
      readonly code: "SURFACE_REPORT_EMPTY"
      readonly serverUrl: string
    }

export type SurfaceGateEvaluation = {
  readonly checkedAtMs: number
  readonly approved: ReadonlyArray<CompositionSurfaceID>
  readonly required: ReadonlyArray<CompositionSurfaceID>
  readonly reportSurfaceCount: number
}

function approvedSurfaces(registry: ApprovedSurfaceRegistry): ReadonlyArray<CompositionSurfaceID> {
  return registry.entries.map((entry) => entry.id)
}

export function assertSurfaceApproved(
  registry: ApprovedSurfaceRegistry,
  surface: string,
): Result<CompositionSurfaceID, Extract<SurfaceGateViolation, { readonly code: "SURFACE_NOT_APPROVED" }>> {
  const approved = approvedSurfaces(registry)
  const exists = approved.some((value) => value === surface)
  if (!exists) {
    return {
      ok: false,
      error: {
        code: "SURFACE_NOT_APPROVED",
        surface,
        approved,
      },
    }
  }

  return { ok: true, value: surface as CompositionSurfaceID }
}

export function enforcePureSurfaceContract(
  input: SurfaceGateInput,
  nowMs: () => number = Date.now,
): Result<SurfaceGateEvaluation, SurfaceGateViolation> {
  if (input.report.composition.length === 0) {
    return {
      ok: false,
      error: {
        code: "SURFACE_REPORT_EMPTY",
        serverUrl: input.report.serverUrl,
      },
    }
  }

  const seen = new Set<string>()
  for (const item of input.report.composition) {
    if (seen.has(item.id)) {
      return {
        ok: false,
        error: {
          code: "SURFACE_REPORT_CONTAINS_DUPLICATE",
          surface: item.id,
        },
      }
    }

    seen.add(item.id)
  }

  for (const item of input.report.composition) {
    const approved = assertSurfaceApproved(input.approvedRegistry, item.id)
    if (!approved.ok) {
      return approved
    }
  }

  for (const requiredSurface of input.requiredSurfaces) {
    const exists = input.report.composition.some((item) => item.id === requiredSurface && item.available)
    if (!exists) {
      return {
        ok: false,
        error: {
          code: "REQUIRED_SURFACE_UNAVAILABLE",
          surface: requiredSurface,
          probeError: {
            code: "MISSING_REQUIRED_SURFACE",
            surface: requiredSurface,
            message: `Required composition surface unavailable: ${requiredSurface}`,
          },
        },
      }
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: nowMs(),
      approved: approvedSurfaces(input.approvedRegistry),
      required: [...input.requiredSurfaces],
      reportSurfaceCount: input.report.composition.length,
    },
  }
}
