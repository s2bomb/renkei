import type { Result } from "./types"

export type WorkingDirectoryLabel = "repo-root" | "harness"

export type WorkingDirectoryResolutionInput = {
  readonly absoluteCwd: string
  readonly repoRootAbsolutePath: string
  readonly harnessAbsolutePath: string
}

export type WorkingDirectoryResolutionError =
  | {
      readonly code: "RUNBOOK_CWD_NOT_ABSOLUTE"
      readonly path: string
    }
  | {
      readonly code: "RUNBOOK_CWD_PATH_TRAVERSAL"
      readonly path: string
    }
  | {
      readonly code: "RUNBOOK_CWD_LABEL_UNRESOLVED"
      readonly normalizedCwd: string
      readonly allowed: ReadonlyArray<WorkingDirectoryLabel>
    }

function normalizePath(raw: string): string {
  // Step 1: replace backslashes with forward slashes
  let path = raw.replace(/\\/g, "/")
  // Step 2: collapse repeated slashes
  path = path.replace(/\/+/g, "/")
  // Step 4: remove trailing slash unless it is the root
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  return path
}

function hasTraversalSegment(normalized: string): boolean {
  const segments = normalized.split("/")
  for (const segment of segments) {
    if (segment === "." || segment === "..") {
      return true
    }
  }
  return false
}

export function resolveSectionERunbookWorkingDirectoryLabel(
  input: WorkingDirectoryResolutionInput,
): Result<WorkingDirectoryLabel, WorkingDirectoryResolutionError> {
  // Validate all three inputs are absolute (begin with /)
  for (const [path] of [[input.absoluteCwd], [input.repoRootAbsolutePath], [input.harnessAbsolutePath]] as const) {
    if (!path.startsWith("/")) {
      return {
        ok: false,
        error: { code: "RUNBOOK_CWD_NOT_ABSOLUTE", path },
      }
    }
  }

  // Check traversal segments on each input before normalizing (check raw input per spec)
  for (const [rawPath] of [[input.absoluteCwd], [input.repoRootAbsolutePath], [input.harnessAbsolutePath]] as const) {
    const normalized = normalizePath(rawPath)
    if (hasTraversalSegment(normalized)) {
      return {
        ok: false,
        error: { code: "RUNBOOK_CWD_PATH_TRAVERSAL", path: rawPath },
      }
    }
  }

  // Normalize all paths for comparison
  const normalizedCwd = normalizePath(input.absoluteCwd)
  const normalizedRepoRoot = normalizePath(input.repoRootAbsolutePath)
  const normalizedHarness = normalizePath(input.harnessAbsolutePath)

  if (normalizedCwd === normalizedRepoRoot) {
    return { ok: true, value: "repo-root" }
  }

  if (normalizedCwd === normalizedHarness) {
    return { ok: true, value: "harness" }
  }

  return {
    ok: false,
    error: {
      code: "RUNBOOK_CWD_LABEL_UNRESOLVED",
      normalizedCwd,
      allowed: ["repo-root", "harness"],
    },
  }
}
