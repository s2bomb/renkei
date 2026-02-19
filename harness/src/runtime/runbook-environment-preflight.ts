import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { resolveRepoRoot } from "./repo-path-resolution"
import type { Result } from "./types"
import type { RunbookEnvironmentVar } from "./operator-runbook-contract"
import {
  resolveSectionERunbookWorkingDirectoryLabel,
  type WorkingDirectoryLabel,
  type WorkingDirectoryResolutionInput,
  type WorkingDirectoryResolutionError,
} from "./working-directory-label"

export type { WorkingDirectoryLabel }

export type EnvironmentPreflightInput = {
  readonly requiredEnv: ReadonlyArray<RunbookEnvironmentVar>
  readonly requiredPaths: ReadonlyArray<
    "vendor/opencode" | "harness" | "harness/config/approved-opencode-surfaces.json" | string
  >
  readonly expectedWorkingDirectories: ReadonlyArray<WorkingDirectoryLabel>
}

export type EnvironmentPreflightSuccess = {
  readonly checkedAtMs: number
  readonly env: {
    readonly OPENCODE_SERVER_URL: string
  }
  readonly resolvedPaths: ReadonlyArray<string>
  readonly workingDirectory: string
  readonly workingDirectoryLabel: WorkingDirectoryLabel
}

export type EnvironmentPreflightError =
  | {
      readonly code: "RUNBOOK_PREFLIGHT_ENV_MISSING"
      readonly envVar: RunbookEnvironmentVar
    }
  | {
      readonly code: "RUNBOOK_PREFLIGHT_ENV_INVALID_URL"
      readonly envVar: "OPENCODE_SERVER_URL"
      readonly value: string
      readonly cause: string
    }
  | {
      readonly code: "RUNBOOK_PREFLIGHT_PATH_MISSING"
      readonly path: string
    }
  | {
      readonly code: "RUNBOOK_PREFLIGHT_CWD_INVALID"
      readonly cwd: string
      readonly allowed: ReadonlyArray<WorkingDirectoryLabel>
    }

export type EnvironmentPreflightDependencies = {
  readonly nowMs: () => number
  readonly getEnv: (key: RunbookEnvironmentVar) => string | undefined
  readonly parseUrl: (value: string) => Result<string, { readonly cause: string }>
  readonly pathExists: (path: string) => Promise<boolean>
  readonly cwd: () => string
  readonly resolveWorkingDirectoryLabel: (
    input: WorkingDirectoryResolutionInput,
  ) => Result<WorkingDirectoryLabel, WorkingDirectoryResolutionError>
  readonly resolveRepoRootAbsolutePath: (cwd: string) => Result<string, { readonly code: string }>
}

function defaultParseUrl(value: string): Result<string, { readonly cause: string }> {
  try {
    const parsed = new URL(value)
    return { ok: true, value: parsed.toString() }
  } catch (err) {
    return { ok: false, error: { cause: String(err) } }
  }
}

async function defaultPathExists(path: string): Promise<boolean> {
  return existsSync(path)
}

function mergeDependencies(deps?: Partial<EnvironmentPreflightDependencies>): EnvironmentPreflightDependencies {
  return {
    nowMs: deps?.nowMs ?? Date.now,
    getEnv: deps?.getEnv ?? ((k) => process.env[k]),
    parseUrl: deps?.parseUrl ?? defaultParseUrl,
    pathExists: deps?.pathExists ?? defaultPathExists,
    cwd: deps?.cwd ?? process.cwd,
    resolveWorkingDirectoryLabel: deps?.resolveWorkingDirectoryLabel ?? resolveSectionERunbookWorkingDirectoryLabel,
    resolveRepoRootAbsolutePath:
      deps?.resolveRepoRootAbsolutePath ??
      ((cwd) => {
        const result = resolveRepoRoot(cwd)
        if (!result.ok) {
          return { ok: false, error: { code: result.error.code } }
        }
        return { ok: true, value: result.value.absolute }
      }),
  }
}

export async function verifySectionERunbookEnvironmentPreflight(
  input: EnvironmentPreflightInput,
  deps?: Partial<EnvironmentPreflightDependencies>,
): Promise<Result<EnvironmentPreflightSuccess, EnvironmentPreflightError>> {
  const resolved = mergeDependencies(deps)

  // Stage 1: Validate required environment variables
  const envValues: Record<string, string> = {}
  for (const envVar of input.requiredEnv) {
    const value = resolved.getEnv(envVar)
    if (value === undefined) {
      return {
        ok: false,
        error: { code: "RUNBOOK_PREFLIGHT_ENV_MISSING", envVar },
      }
    }

    // Stage 1b: URL validation for OPENCODE_SERVER_URL
    if (envVar === "OPENCODE_SERVER_URL") {
      const parseResult = resolved.parseUrl(value)
      if (!parseResult.ok) {
        return {
          ok: false,
          error: {
            code: "RUNBOOK_PREFLIGHT_ENV_INVALID_URL",
            envVar: "OPENCODE_SERVER_URL",
            value,
            cause: parseResult.error.cause,
          },
        }
      }
      envValues[envVar] = parseResult.value
    } else {
      envValues[envVar] = value
    }
  }

  // Stage 2: Validate required paths
  const resolvedPaths: string[] = []
  for (const path of input.requiredPaths) {
    const exists = await resolved.pathExists(path)
    if (!exists) {
      return {
        ok: false,
        error: { code: "RUNBOOK_PREFLIGHT_PATH_MISSING", path },
      }
    }
    resolvedPaths.push(path)
  }

  // Stage 3: Validate working directory
  const currentCwd = resolved.cwd()
  const repoRootResult = resolved.resolveRepoRootAbsolutePath(currentCwd)
  if (!repoRootResult.ok) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_PREFLIGHT_CWD_INVALID",
        cwd: currentCwd,
        allowed: ["repo-root", "harness"],
      },
    }
  }

  const repoRoot = repoRootResult.value
  const harnessPath = resolve(repoRoot, "harness")

  const labelResult = resolved.resolveWorkingDirectoryLabel({
    absoluteCwd: currentCwd,
    repoRootAbsolutePath: repoRoot,
    harnessAbsolutePath: harnessPath,
  })

  if (!labelResult.ok) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_PREFLIGHT_CWD_INVALID",
        cwd: currentCwd,
        allowed: ["repo-root", "harness"],
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: resolved.nowMs(),
      env: {
        OPENCODE_SERVER_URL: envValues["OPENCODE_SERVER_URL"] ?? "",
      },
      resolvedPaths,
      workingDirectory: currentCwd,
      workingDirectoryLabel: labelResult.value,
    },
  }
}
