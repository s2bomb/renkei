export const SECTION_B_INCLUDE_GLOBS = [
  "engine/test/**/*.ts",
  "engine/AGENTS.md",
  "thoughts/projects/2026-02-19-m2-rebaseline-pure-opencode-integration/**/*.md",
] as const

export const SECTION_B_DEFAULT_EXCLUDE_GLOBS = [
  "platform/**",
  "engine/platform/**",
  "**/node_modules/**",
  "thoughts/projects/2026-02-19-m2-first-runnable-renkei-harness/**",
] as const

export type ScannerFindingLike = {
  readonly file: string
  readonly line: number
  readonly column: number
  readonly patternID: string
}

export function makeSectionBBaseScanTarget(repoRoot: string) {
  return {
    roots: [repoRoot],
    include: [...SECTION_B_INCLUDE_GLOBS],
    exclude: [...SECTION_B_DEFAULT_EXCLUDE_GLOBS],
  }
}

export function lexicalUnique(values: ReadonlyArray<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

export function toFindingSortKey(finding: ScannerFindingLike): string {
  const line = String(finding.line).padStart(8, "0")
  const column = String(finding.column).padStart(8, "0")
  return `${finding.file}|${line}|${column}|${finding.patternID}`
}
