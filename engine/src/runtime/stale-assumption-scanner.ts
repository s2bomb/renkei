import { relative } from "node:path"
import type { Result } from "./types"

export type StaleAssumptionPattern = {
  readonly id: "fork-surface" | "openteams-surface" | "fork-env-var" | "fork-test-script"
  readonly expression: RegExp
  readonly severity: "error" | "warning"
}

export type StaleAssumptionFinding = {
  readonly file: string
  readonly line: number
  readonly column: number
  readonly matchedText: string
  readonly patternID: StaleAssumptionPattern["id"]
  readonly severity: StaleAssumptionPattern["severity"]
}

export type StaleAssumptionScanTarget = {
  readonly roots: ReadonlyArray<string>
  readonly include: ReadonlyArray<string>
  readonly exclude: ReadonlyArray<string>
}

export type StaleAssumptionScanTargetOverrides = {
  readonly roots?: ReadonlyArray<string>
  readonly include?: ReadonlyArray<string>
  readonly excludeAdditions?: ReadonlyArray<string>
  readonly excludeReplacements?: ReadonlyArray<string>
}

export type StaleAssumptionScanError =
  | { readonly code: "SCAN_ROOT_MISSING"; readonly root: string }
  | { readonly code: "SCAN_TARGET_INVALID"; readonly detail: string }
  | { readonly code: "SCAN_IO_FAILURE"; readonly path: string; readonly cause: string }

export type StaleAssumptionScanResult = {
  readonly scannedFiles: number
  readonly findings: ReadonlyArray<StaleAssumptionFinding>
}

export type StaleAssumptionScannerDependencies = {
  readonly globFiles: (
    target: StaleAssumptionScanTarget,
  ) => Promise<Result<ReadonlyArray<string>, StaleAssumptionScanError>>
  readonly readTextFile: (path: string) => Promise<Result<string, StaleAssumptionScanError>>
}

declare const Bun: {
  Glob: new (pattern: string) => {
    scan(options: { cwd: string; absolute?: boolean }): AsyncIterable<string>
  }
  file(path: string): { exists(): Promise<boolean>; text(): Promise<string> }
}

const SECTION_B_INCLUDE_GLOBS = [
  "engine/test/**/*.ts",
  "engine/AGENTS.md",
  "thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/**/*.md",
] as const

const SECTION_B_DEFAULT_EXCLUDE_GLOBS = [
  "platform/**",
  "engine/platform/**",
  "**/node_modules/**",
  "thoughts/projects/2026-02-19-m2-first-runnable-renkei-harness/**",
] as const

function toLexicalUnique(values: ReadonlyArray<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/")
}

function globPatternToRegExp(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replaceAll("**", "__DOUBLE_STAR__")
    .replaceAll("*", "[^/]*")
    .replaceAll("__DOUBLE_STAR__", ".*")
  return new RegExp(`^${escaped}$`)
}

function isExcluded(root: string, path: string, excludes: ReadonlyArray<string>): boolean {
  const normalizedPath = normalizePath(path)
  const relativePath = normalizePath(relative(root, path))
  return excludes.some((glob) => {
    const regex = globPatternToRegExp(normalizePath(glob))
    return regex.test(normalizedPath) || regex.test(relativePath)
  })
}

function validateTarget(target: StaleAssumptionScanTarget): Result<true, StaleAssumptionScanError> {
  if (target.roots.length === 0) {
    return {
      ok: false,
      error: {
        code: "SCAN_TARGET_INVALID",
        detail: "Scan target roots must be non-empty",
      },
    }
  }

  if (target.include.length === 0) {
    return {
      ok: false,
      error: {
        code: "SCAN_TARGET_INVALID",
        detail: "Scan target include globs must be non-empty",
      },
    }
  }

  return { ok: true, value: true }
}

function clonePatternForGlobalExec(pattern: RegExp): RegExp {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
  return new RegExp(pattern.source, flags)
}

function toLineColumn(text: string, index: number): { line: number; column: number } {
  const prefix = text.slice(0, index)
  const lines = prefix.split("\n")
  const line = lines.length
  const column = (lines.at(-1)?.length ?? 0) + 1
  return { line, column }
}

function compareFindings(left: StaleAssumptionFinding, right: StaleAssumptionFinding): number {
  const leftKey = `${left.file}|${String(left.line).padStart(8, "0")}|${String(left.column).padStart(8, "0")}|${left.patternID}`
  const rightKey = `${right.file}|${String(right.line).padStart(8, "0")}|${String(right.column).padStart(8, "0")}|${right.patternID}`
  return leftKey.localeCompare(rightKey)
}

async function defaultGlobFiles(
  target: StaleAssumptionScanTarget,
): Promise<Result<ReadonlyArray<string>, StaleAssumptionScanError>> {
  for (const root of target.roots) {
    if (!(await Bun.file(root).exists())) {
      return {
        ok: false,
        error: {
          code: "SCAN_ROOT_MISSING",
          root,
        },
      }
    }
  }

  const matches = new Set<string>()
  for (const root of target.roots) {
    for (const includeGlob of target.include) {
      const glob = new Bun.Glob(includeGlob)
      try {
        for await (const match of glob.scan({ cwd: root, absolute: true })) {
          const path = String(match)
          if (!isExcluded(root, path, target.exclude)) {
            matches.add(path)
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: {
            code: "SCAN_IO_FAILURE",
            path: root,
            cause: String(error),
          },
        }
      }
    }
  }

  return {
    ok: true,
    value: [...matches],
  }
}

async function defaultReadTextFile(path: string): Promise<Result<string, StaleAssumptionScanError>> {
  try {
    const value = await Bun.file(path).text()
    return { ok: true, value }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "SCAN_IO_FAILURE",
        path,
        cause: String(error),
      },
    }
  }
}

export function defaultStaleAssumptionPatterns(): ReadonlyArray<StaleAssumptionPattern> {
  return [
    {
      id: "fork-surface",
      expression: /fork/gi,
      severity: "error",
    },
    {
      id: "openteams-surface",
      expression: /openteams/gi,
      severity: "error",
    },
    {
      id: "fork-env-var",
      expression: /\bOPENTEAMS_[A-Z0-9_]+\b/g,
      severity: "warning",
    },
    {
      id: "fork-test-script",
      expression: /test:openteams/gi,
      severity: "warning",
    },
  ]
}

export function defaultSectionBScanTarget(repoRoot: string): StaleAssumptionScanTarget {
  return {
    roots: [repoRoot],
    include: [...SECTION_B_INCLUDE_GLOBS],
    exclude: [...SECTION_B_DEFAULT_EXCLUDE_GLOBS],
  }
}

export function resolveSectionBScanTarget(
  base: StaleAssumptionScanTarget,
  overrides?: StaleAssumptionScanTargetOverrides,
): Result<StaleAssumptionScanTarget, StaleAssumptionScanError> {
  const roots = overrides?.roots ? [...overrides.roots] : [...base.roots]
  const include = overrides?.include ? [...overrides.include] : [...base.include]
  const exclude = overrides?.excludeReplacements
    ? toLexicalUnique(overrides.excludeReplacements)
    : toLexicalUnique([...base.exclude, ...(overrides?.excludeAdditions ?? [])])

  const target: StaleAssumptionScanTarget = {
    roots,
    include,
    exclude,
  }

  const validated = validateTarget(target)
  if (!validated.ok) {
    return validated
  }

  return {
    ok: true,
    value: target,
  }
}

export async function scanForStaleAssumptions(
  target: StaleAssumptionScanTarget,
  patterns: ReadonlyArray<StaleAssumptionPattern> = defaultStaleAssumptionPatterns(),
  deps?: Partial<StaleAssumptionScannerDependencies>,
): Promise<Result<StaleAssumptionScanResult, StaleAssumptionScanError>> {
  const validated = validateTarget(target)
  if (!validated.ok) {
    return validated
  }

  const runtimeDeps: StaleAssumptionScannerDependencies = {
    globFiles: defaultGlobFiles,
    readTextFile: defaultReadTextFile,
    ...deps,
  }

  const filesResult = await runtimeDeps.globFiles(target)
  if (!filesResult.ok) {
    return filesResult
  }

  const files = toLexicalUnique(filesResult.value)
  const findings: StaleAssumptionFinding[] = []

  for (const file of files) {
    const contentResult = await runtimeDeps.readTextFile(file)
    if (!contentResult.ok) {
      return contentResult
    }

    const content = contentResult.value
    for (const pattern of patterns) {
      const regex = clonePatternForGlobalExec(pattern.expression)
      let match = regex.exec(content)
      while (match !== null) {
        const { line, column } = toLineColumn(content, match.index)
        findings.push({
          file,
          line,
          column,
          matchedText: match[0],
          patternID: pattern.id,
          severity: pattern.severity,
        })

        if (match[0].length === 0) {
          regex.lastIndex += 1
        }
        match = regex.exec(content)
      }
    }
  }

  findings.sort(compareFindings)

  return {
    ok: true,
    value: {
      scannedFiles: files.length,
      findings,
    },
  }
}
