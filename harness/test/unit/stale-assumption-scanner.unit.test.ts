import { describe, expect, test } from "bun:test"
import { STALE_ASSUMPTION_SCANNER_ERROR_CODES } from "../helpers/contracts"
import { loadStaleAssumptionScannerModule } from "../helpers/module-loader"
import {
  SECTION_B_DEFAULT_EXCLUDE_GLOBS,
  SECTION_B_INCLUDE_GLOBS,
  lexicalUnique,
  makeSectionBBaseScanTarget,
  toFindingSortKey,
} from "../helpers/stale-assumption-scanner-fixtures"

type StaleAssumptionPatternID = "fork-surface" | "openteams-surface" | "fork-env-var" | "fork-test-script"
type StaleAssumptionSeverity = "error" | "warning"

type StaleAssumptionPattern = {
  readonly id: StaleAssumptionPatternID
  readonly expression: RegExp
  readonly severity: StaleAssumptionSeverity
}

type StaleAssumptionFinding = {
  readonly file: string
  readonly line: number
  readonly column: number
  readonly matchedText: string
  readonly patternID: StaleAssumptionPatternID
  readonly severity: StaleAssumptionSeverity
}

type StaleAssumptionScanTarget = {
  readonly roots: ReadonlyArray<string>
  readonly include: ReadonlyArray<string>
  readonly exclude: ReadonlyArray<string>
}

type StaleAssumptionScanError =
  | { readonly code: "SCAN_ROOT_MISSING"; readonly root: string }
  | { readonly code: "SCAN_TARGET_INVALID"; readonly detail: string }
  | { readonly code: "SCAN_IO_FAILURE"; readonly path: string; readonly cause: string }

type StaleAssumptionScanResult = {
  readonly scannedFiles: number
  readonly findings: ReadonlyArray<StaleAssumptionFinding>
}

type RuntimeModule = {
  defaultStaleAssumptionPatterns: () => ReadonlyArray<StaleAssumptionPattern>
  defaultSectionBScanTarget: (repoRoot: string) => StaleAssumptionScanTarget
  resolveSectionBScanTarget: (
    base: StaleAssumptionScanTarget,
    overrides?: {
      readonly roots?: ReadonlyArray<string>
      readonly include?: ReadonlyArray<string>
      readonly excludeAdditions?: ReadonlyArray<string>
      readonly excludeReplacements?: ReadonlyArray<string>
    },
  ) =>
    | { readonly ok: true; readonly value: StaleAssumptionScanTarget }
    | { readonly ok: false; readonly error: StaleAssumptionScanError }
  scanForStaleAssumptions: (
    target: StaleAssumptionScanTarget,
    patterns?: ReadonlyArray<StaleAssumptionPattern>,
    deps?: {
      readonly globFiles?: (
        target: StaleAssumptionScanTarget,
      ) => Promise<
        | { readonly ok: true; readonly value: ReadonlyArray<string> }
        | { readonly ok: false; readonly error: StaleAssumptionScanError }
      >
      readonly readTextFile?: (
        path: string,
      ) => Promise<
        { readonly ok: true; readonly value: string } | { readonly ok: false; readonly error: StaleAssumptionScanError }
      >
    },
  ) => Promise<
    | { readonly ok: true; readonly value: StaleAssumptionScanResult }
    | { readonly ok: false; readonly error: StaleAssumptionScanError }
  >
}

function makeMissingImplementationRuntime(): RuntimeModule {
  return {
    defaultStaleAssumptionPatterns: () => [],
    defaultSectionBScanTarget: () => ({ roots: [], include: [], exclude: [] }),
    resolveSectionBScanTarget: () => ({ ok: true, value: { roots: [], include: [], exclude: [] } }),
    scanForStaleAssumptions: async () => ({
      ok: true,
      value: {
        scannedFiles: 0,
        findings: [],
      },
    }),
  }
}

async function loadRuntimeModule(): Promise<RuntimeModule> {
  try {
    return (await loadStaleAssumptionScannerModule()) as unknown as RuntimeModule
  } catch {
    return makeMissingImplementationRuntime()
  }
}

describe("unit section-2 stale-assumption-scanner contracts", () => {
  test("S2-T16 default pattern set includes all Section B stale-assumption IDs", async () => {
    const runtime = await loadRuntimeModule()
    const patterns = runtime.defaultStaleAssumptionPatterns()
    const byID = new Map(patterns.map((pattern) => [pattern.id, pattern]))

    expect(byID.size).toBe(4)
    expect([...byID.keys()].sort()).toEqual(["fork-env-var", "fork-surface", "fork-test-script", "openteams-surface"])

    const expectedSeverity: Record<StaleAssumptionPatternID, StaleAssumptionSeverity> = {
      "fork-surface": "error",
      "openteams-surface": "error",
      "fork-env-var": "warning",
      "fork-test-script": "warning",
    }

    for (const [id, severity] of Object.entries(expectedSeverity)) {
      const pattern = byID.get(id as StaleAssumptionPatternID)
      expect(pattern === undefined).toBe(false)
      if (!pattern) {
        continue
      }

      expect(pattern.expression instanceof RegExp).toBe(true)
      expect(pattern.severity).toBe(severity)
    }
  })

  test("S2-T17 default Section B scan target emits canonical include and default excludes", async () => {
    const runtime = await loadRuntimeModule()
    const target = runtime.defaultSectionBScanTarget("/repo/root")

    expect(target.roots).toEqual(["/repo/root"])
    expect(target.include).toEqual(SECTION_B_INCLUDE_GLOBS)
    expect(target.exclude).toEqual(SECTION_B_DEFAULT_EXCLUDE_GLOBS)
  })

  test("S2-T18 resolver replaces roots and include, then merges excludes with lexical de-dup", async () => {
    const runtime = await loadRuntimeModule()
    const base = makeSectionBBaseScanTarget("/repo")

    const result = runtime.resolveSectionBScanTarget(base, {
      roots: ["/override-root"],
      include: ["harness/src/**/*.ts", "harness/test/**/*.ts"],
      excludeAdditions: ["docs/archive/**", "vendor/**", "harness/vendor/**", "docs/archive/**", "**/node_modules/**"],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.roots).toEqual(["/override-root"])
    expect(result.value.include).toEqual(["harness/src/**/*.ts", "harness/test/**/*.ts"])
    expect(result.value.exclude).toEqual(
      lexicalUnique([
        ...SECTION_B_DEFAULT_EXCLUDE_GLOBS,
        "docs/archive/**",
        "vendor/**",
        "harness/vendor/**",
        "docs/archive/**",
        "**/node_modules/**",
      ]),
    )
  })

  test("S2-T19 resolver excludeReplacements has full precedence over base and additions", async () => {
    const runtime = await loadRuntimeModule()
    const base = makeSectionBBaseScanTarget("/repo")

    const result = runtime.resolveSectionBScanTarget(base, {
      excludeAdditions: ["tmp/**", "vendor/**"],
      excludeReplacements: ["tmp/**", "custom/**", "tmp/**"],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.exclude).toEqual(lexicalUnique(["tmp/**", "custom/**", "tmp/**"]))
  })

  test("S2-T20 invalid resolved target fails with SCAN_TARGET_INVALID", async () => {
    const runtime = await loadRuntimeModule()
    const allowed = new Set<string>(STALE_ASSUMPTION_SCANNER_ERROR_CODES)

    for (const overrides of [{ roots: [] }, { include: [] }]) {
      const result = runtime.resolveSectionBScanTarget(makeSectionBBaseScanTarget("/repo"), overrides)
      expect(result.ok).toBe(false)
      if (result.ok) {
        continue
      }

      expect(allowed.has(result.error.code)).toBe(true)
      expect(result.error.code).toBe("SCAN_TARGET_INVALID")
      if (result.error.code === "SCAN_TARGET_INVALID") {
        expect(typeof result.error.detail).toBe("string")
        expect(result.error.detail.length).toBeGreaterThan(0)
      }
    }
  })

  test("S2-T21 missing scan root fails with SCAN_ROOT_MISSING", async () => {
    const runtime = await loadRuntimeModule()
    const target = makeSectionBBaseScanTarget("/repo/missing")

    const result = await runtime.scanForStaleAssumptions(target, runtime.defaultStaleAssumptionPatterns(), {
      globFiles: async () => ({
        ok: false,
        error: {
          code: "SCAN_ROOT_MISSING",
          root: "/repo/missing",
        },
      }),
      readTextFile: async () => ({ ok: true, value: "" }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SCAN_ROOT_MISSING")
    if (result.error.code === "SCAN_ROOT_MISSING") {
      expect(result.error.root).toBe("/repo/missing")
    }
  })

  test("S2-T22 I/O failure while reading files fails with SCAN_IO_FAILURE", async () => {
    const runtime = await loadRuntimeModule()

    const result = await runtime.scanForStaleAssumptions(
      makeSectionBBaseScanTarget("/repo"),
      runtime.defaultStaleAssumptionPatterns(),
      {
        globFiles: async () => ({ ok: true, value: ["/repo/harness/AGENTS.md"] }),
        readTextFile: async (path) => ({
          ok: false,
          error: {
            code: "SCAN_IO_FAILURE",
            path,
            cause: "EACCES",
          },
        }),
      },
    )

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SCAN_IO_FAILURE")
    if (result.error.code === "SCAN_IO_FAILURE") {
      expect(result.error.path).toBe("/repo/harness/AGENTS.md")
      expect(result.error.cause).toBe("EACCES")
    }
  })

  test("S2-T23 Section B scan returns deterministic lexical traversal and sorted findings", async () => {
    const runtime = await loadRuntimeModule()
    const readOrder: string[] = []
    const fileContents = new Map<string, string>([
      ["/repo/harness/AGENTS.md", "openteams"],
      ["/repo/harness/test/unit/a.unit.test.ts", "fork"],
      ["/repo/harness/test/unit/z.unit.test.ts", "fork\nopenteams"],
    ])

    const result = await runtime.scanForStaleAssumptions(
      makeSectionBBaseScanTarget("/repo"),
      [
        { id: "fork-surface", expression: /fork/g, severity: "error" },
        { id: "openteams-surface", expression: /openteams/g, severity: "error" },
      ],
      {
        globFiles: async () => ({
          ok: true,
          value: [
            "/repo/harness/test/unit/z.unit.test.ts",
            "/repo/harness/AGENTS.md",
            "/repo/harness/test/unit/a.unit.test.ts",
          ],
        }),
        readTextFile: async (path) => {
          readOrder.push(path)
          const value = fileContents.get(path)
          if (!value) {
            return {
              ok: false,
              error: {
                code: "SCAN_IO_FAILURE" as const,
                path,
                cause: "missing fixture",
              },
            }
          }

          return { ok: true, value }
        },
      },
    )

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(readOrder).toEqual([
      "/repo/harness/AGENTS.md",
      "/repo/harness/test/unit/a.unit.test.ts",
      "/repo/harness/test/unit/z.unit.test.ts",
    ])
    expect(result.value.scannedFiles).toBe(3)

    const keys = result.value.findings.map((finding) => toFindingSortKey(finding))
    expect(keys).toEqual([...keys].sort((left, right) => left.localeCompare(right)))
    expect(result.value.findings.length).toBeGreaterThan(0)
  })

  test("S2-T24 prior-project stale files are excluded by default in Section B target", async () => {
    const runtime = await loadRuntimeModule()
    const currentProjectFile =
      "/repo/thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/working/notes.md"
    const priorProjectFile =
      "/repo/thoughts/projects/2026-02-19-m2-first-runnable-renkei-harness/working/legacy-notes.md"

    const target = runtime.defaultSectionBScanTarget("/repo")
    const result = await runtime.scanForStaleAssumptions(
      target,
      [{ id: "fork-surface", expression: /fork/g, severity: "error" }],
      {
        globFiles: async (inputTarget) => {
          const hasPriorProjectExclusion = inputTarget.exclude.includes(
            "thoughts/projects/2026-02-19-m2-first-runnable-renkei-harness/**",
          )

          return {
            ok: true,
            value: hasPriorProjectExclusion ? [currentProjectFile] : [currentProjectFile, priorProjectFile],
          }
        },
        readTextFile: async () => ({ ok: true, value: "fork" }),
      },
    )

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.scannedFiles).toBe(1)
    expect(result.value.findings.length).toBeGreaterThan(0)
    expect(
      result.value.findings.every((finding) => finding.file.includes("m2-rebaseline-pure-opencode-integration")),
    ).toBe(true)
    expect(result.value.findings.some((finding) => finding.file.includes("m2-first-runnable-renkei-harness"))).toBe(
      false,
    )
  })
})
