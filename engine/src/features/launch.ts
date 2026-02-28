import type { Result } from "../shared/result"
import type { LaunchOptions, LaunchCommand, LaunchEnvironment, WorktreeResolution, EngineConfig } from "../shared/types"
import type { ParseError, ConfigBuildError, LaunchSequenceError } from "../shared/errors"
import { ok, err } from "../shared/result"
import { parseError } from "../shared/errors"

/**
 * Parse renkei-specific flags from argv, passing unrecognized args through to OpenCode.
 *
 * Consumed flags: --worktree <path>, --dev
 * First non-flag positional: projectDir
 * Everything else: passthroughArgs (order preserved)
 */
export function parseLaunchOptions(argv: readonly string[]): Result<LaunchOptions, ParseError> {
  let worktreeOverride: string | undefined
  let devMode = false
  let projectDir: string | undefined
  const passthroughArgs: string[] = []

  let i = 0
  while (i < argv.length) {
    const arg = argv[i]!

    if (arg === "--worktree") {
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("--")) {
        return err(parseError("--worktree"))
      }
      worktreeOverride = next
      i += 2
      continue
    }

    if (arg === "--dev") {
      devMode = true
      i += 1
      continue
    }

    // First positional (not a flag, not consumed by a flag)
    if (!arg.startsWith("--") && projectDir === undefined) {
      projectDir = arg
      i += 1
      continue
    }

    // Unrecognized flag: pass through with its value (if it has one)
    if (arg.startsWith("--")) {
      passthroughArgs.push(arg)
      // If the next token is not a flag, it is this flag's value -- pass it through too
      const next = argv[i + 1]
      if (next !== undefined && !next.startsWith("--")) {
        passthroughArgs.push(next)
        i += 2
        continue
      }
      i += 1
      continue
    }

    // Non-flag positional after all known flags have been consumed: pass through
    passthroughArgs.push(arg)
    i += 1
  }

  return ok({ worktreeOverride, devMode, projectDir, passthroughArgs })
}

/**
 * Build the launch command for exec'ing into OpenCode.
 *
 * Dev mode: bun run --cwd <platformPath>/opencode/packages/opencode --conditions=browser src/index.ts [project] [...passthrough]
 * Binary mode: <platformPath>/opencode/packages/opencode/bin/opencode [project] [...passthrough]
 */
export function buildLaunchCommand(
  _resolution: WorktreeResolution,
  _opts: LaunchOptions,
  _launchEnv: LaunchEnvironment,
): LaunchCommand {
  throw new Error("not implemented")
}

/**
 * Resolve engine config (skill paths, plugin path, config dir, agent definitions)
 * from a validated worktree resolution.
 */
export async function resolveEngineConfig(
  _resolution: WorktreeResolution,
): Promise<Result<EngineConfig, ConfigBuildError>> {
  throw new Error("not implemented")
}

/** Function signature for the exec step, injectable for testing. */
export type ExecFn = (cmd: LaunchCommand) => Promise<{ exitCode: number | null }>

/**
 * Launch OpenCode through the engine composition layer.
 *
 * On success, this function does NOT return -- the process is replaced by OpenCode via exec.
 * The return type Result<never, ...> encodes this: the Ok branch is unreachable.
 * On failure, returns Err with the first error encountered in the pipeline.
 */
export async function launch(
  _opts: LaunchOptions,
  _scriptDir: string,
  _exec?: ExecFn,
): Promise<Result<never, LaunchSequenceError>> {
  throw new Error("not implemented")
}
