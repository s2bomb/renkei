import { describe, expect, test } from "bun:test"
import { STARTUP_ERROR_CODES } from "../helpers/contracts"
import { loadStartupBoundaryModule } from "../helpers/section-1-module-loader"

const INVARIANT_IDS = [
  "SERVER_URL_SOURCE_RULE",
  "STARTUP_STAGE_ORDER",
  "STARTUP_ERROR_DISCRIMINANTS_STABLE",
  "EXIT_CODE_CONTRACT_STABLE",
  "URL_BOUNDARY_INTEGRATION_ONLY",
] as const

type StartupBoundaryInvariant = (typeof INVARIANT_IDS)[number]

type StartupBoundaryEvidence = {
  readonly serverUrlSourceRuleHolds: boolean
  readonly startupStageOrder: ReadonlyArray<"readiness" | "probe" | "sdk">
  readonly startupErrorDiscriminants: ReadonlyArray<string>
  readonly exitCodeContract: {
    readonly success: number
    readonly failure: number
  }
  readonly importsDirectVendoredRuntime: boolean
}

function makeCompliantEvidence(): StartupBoundaryEvidence {
  return {
    serverUrlSourceRuleHolds: true,
    startupStageOrder: ["readiness", "probe", "sdk"],
    startupErrorDiscriminants: [...STARTUP_ERROR_CODES],
    exitCodeContract: {
      success: 0,
      failure: 1,
    },
    importsDirectVendoredRuntime: false,
  }
}

function makeViolationEvidence(invariant: StartupBoundaryInvariant): StartupBoundaryEvidence {
  const evidence = makeCompliantEvidence()

  if (invariant === "SERVER_URL_SOURCE_RULE") {
    return {
      ...evidence,
      serverUrlSourceRuleHolds: false,
    }
  }

  if (invariant === "STARTUP_STAGE_ORDER") {
    return {
      ...evidence,
      startupStageOrder: ["probe", "readiness", "sdk"],
    }
  }

  if (invariant === "STARTUP_ERROR_DISCRIMINANTS_STABLE") {
    return {
      ...evidence,
      startupErrorDiscriminants: ["HOST_HEALTH_TIMEOUT"],
    }
  }

  if (invariant === "EXIT_CODE_CONTRACT_STABLE") {
    return {
      ...evidence,
      exitCodeContract: {
        success: 1,
        failure: 2,
      },
    }
  }

  return {
    ...evidence,
    importsDirectVendoredRuntime: true,
  }
}

describe("unit section-1-startup-boundary contracts", () => {
  test("S1-T20 pure evaluator accepts fully compliant evidence", async () => {
    const runtime = await loadStartupBoundaryModule()

    const result = runtime.evaluateStartupBoundaryEvidence(makeCompliantEvidence(), 1000)
    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    const seen = new Set(result.value.invariants.map((invariant: { id: string; ok: boolean }) => invariant.id))
    expect(seen).toEqual(new Set(INVARIANT_IDS))

    for (const expectedInvariant of INVARIANT_IDS) {
      const report = result.value.invariants.find(
        (invariant: { id: string; ok: boolean }) => invariant.id === expectedInvariant,
      )
      expect(report?.ok).toBe(true)
    }
  })

  test("S1-T21 pure evaluator returns STARTUP_BOUNDARY_VIOLATION with exact invariant id", async () => {
    const runtime = await loadStartupBoundaryModule()

    for (const invariant of INVARIANT_IDS) {
      const result = runtime.evaluateStartupBoundaryEvidence(makeViolationEvidence(invariant), 2000)
      expect(result.ok).toBe(false)
      if (result.ok) {
        continue
      }

      expect(result.error.code).toBe("STARTUP_BOUNDARY_VIOLATION")
      expect(result.error.invariant).toBe(invariant)
    }
  })

  test("S1-T22 verifier uses injected compliant evidence and reports all invariants", async () => {
    const runtime = await loadStartupBoundaryModule()

    const result = runtime.verifyRenkeiDevStartupBoundary({
      nowMs: () => 4242,
      provideEvidence: () => makeCompliantEvidence(),
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.checkedAtMs).toBe(4242)
    const seen = new Set(result.value.invariants.map((invariant: { id: string; ok: boolean }) => invariant.id))
    expect(seen).toEqual(new Set(INVARIANT_IDS))

    for (const expectedInvariant of INVARIANT_IDS) {
      const report = result.value.invariants.find(
        (invariant: { id: string; ok: boolean }) => invariant.id === expectedInvariant,
      )
      expect(report?.ok).toBe(true)
    }
  })

  test("S1-T23 verifier surfaces injected invariant violations as typed failures", async () => {
    const runtime = await loadStartupBoundaryModule()

    for (const invariant of INVARIANT_IDS) {
      const result = runtime.verifyRenkeiDevStartupBoundary({
        nowMs: () => 7777,
        provideEvidence: () => makeViolationEvidence(invariant),
      })

      expect(result.ok).toBe(false)
      if (result.ok) {
        continue
      }

      expect(result.error.code).toBe("STARTUP_BOUNDARY_VIOLATION")
      expect(result.error.invariant).toBe(invariant)
      expect(typeof result.error.detail).toBe("string")
    }
  })
})
