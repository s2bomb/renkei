import { readdir, stat } from "node:fs/promises"
import path from "node:path"
import type { Result } from "../shared/result"
import type { LaunchOptions, LaunchCommand, LaunchEnvironment, WorktreeResolution, EngineConfig } from "../shared/types"
import type { AgentDefinitionRef } from "../shared/types"
import type { ParseError, ConfigBuildError, LaunchSequenceError } from "../shared/errors"
import { ok, err, isErr } from "../shared/result"
import { parseError, configBuildError, launchError } from "../shared/errors"
import { resolveWorktree } from "./worktree-resolver"
import { buildLaunchEnv } from "../adapters/config-injection"

/**
 * Parse renkei-specific flags from argv, passing unrecognized args through to OpenCode.
 *
 * Consumed flags: --worktree <path>
 * First non-flag positional: projectDir
 * Everything else: passthroughArgs (order preserved)
 */
export function parseLaunchOptions(argv: readonly string[]): Result<LaunchOptions, ParseError> {
  let worktreeOverride: string | undefined
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

  return ok({ worktreeOverride, projectDir, passthroughArgs })
}

/**
 * Build the launch command for exec'ing into OpenCode.
 *
 * Always launches through source runtime:
 * bun run --cwd <platformPath>/opencode/packages/opencode --conditions=browser src/index.ts [project] [...passthrough]
 */
export function buildLaunchCommand(
  resolution: WorktreeResolution,
  opts: LaunchOptions,
  launchEnv: LaunchEnvironment,
): LaunchCommand {
  const projectArgs = opts.projectDir !== undefined ? [opts.projectDir] : []
  const passthroughArgs = [...opts.passthroughArgs]

  const envRecord: Record<string, string> = {
    OPENCODE_CONFIG_CONTENT: launchEnv.OPENCODE_CONFIG_CONTENT,
    OPENCODE_CONFIG_DIR: launchEnv.OPENCODE_CONFIG_DIR,
    RENKEI_ENGINE_SOURCE: launchEnv.RENKEI_ENGINE_SOURCE,
  }

  if (launchEnv.RENKEI_WORKTREE_OVERRIDE !== undefined) {
    envRecord.RENKEI_WORKTREE_OVERRIDE = launchEnv.RENKEI_WORKTREE_OVERRIDE
  }

  const opencodePkgPath = path.resolve(resolution.platformPath, "opencode", "packages", "opencode")
  return {
    command: "bun",
    args: ["run", "--cwd", opencodePkgPath, "--conditions=browser", "src/index.ts", ...projectArgs, ...passthroughArgs],
    env: envRecord,
    cwd: process.cwd(),
  }
}

/**
 * Resolve engine config (skill paths, plugin path, config dir, agent definitions)
 * from a validated worktree resolution.
 */
export async function resolveEngineConfig(
  resolution: WorktreeResolution,
): Promise<Result<EngineConfig, ConfigBuildError>> {
  const configDirPath = path.resolve(resolution.sourcePath, "engine", ".opencode")

  // Validate config dir exists
  try {
    await stat(configDirPath)
  } catch {
    return err(configBuildError(`Config directory not found: ${configDirPath}`))
  }

  // Validate plugin file exists
  const pluginPath = path.resolve(configDirPath, "plugins", "renkei.ts")
  try {
    await stat(pluginPath)
  } catch {
    return err(configBuildError(`Plugin file not found: ${pluginPath}`))
  }

  // Scan authoring for skill paths (empty array if authoring dir doesn't exist)
  const skillPaths: string[] = []
  try {
    const authoringEntries = await readdir(resolution.authoringPath)
    for (const entry of authoringEntries) {
      skillPaths.push(path.resolve(resolution.authoringPath, entry))
    }
  } catch {
    // Authoring directory doesn't exist -- empty skill paths is valid
  }

  // Scan <configDirPath>/agent/*.md for agent definitions
  const agentDefinitions: AgentDefinitionRef[] = []
  const agentDirPath = path.resolve(configDirPath, "agent")
  try {
    const agentEntries = await readdir(agentDirPath)
    for (const entry of agentEntries) {
      if (entry.endsWith(".md")) {
        agentDefinitions.push({
          name: entry.slice(0, -3),
          filePath: path.resolve(agentDirPath, entry),
        })
      }
    }
  } catch {
    // No agent definitions directory -- that's fine
  }

  return ok({ skillPaths, pluginPath, configDirPath, agentDefinitions })
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
  opts: LaunchOptions,
  scriptDir: string,
  exec?: ExecFn,
): Promise<Result<never, LaunchSequenceError>> {
  // Step 1: Resolve the worktree
  const worktreeResult = await resolveWorktree({ worktreeOverride: opts.worktreeOverride, scriptDir })
  if (isErr(worktreeResult)) {
    return worktreeResult
  }
  const resolution = worktreeResult.value

  // Step 2: Resolve engine config (validates .opencode dir and plugin file)
  const configResult = await resolveEngineConfig(resolution)
  if (isErr(configResult)) {
    return configResult
  }
  const engineConfig = configResult.value

  // Step 3: Build launch environment
  const envResult = buildLaunchEnv({
    resolution,
    engineConfig,
    worktreeOverride: opts.worktreeOverride,
  })
  if (isErr(envResult)) {
    return envResult
  }
  const launchEnv = envResult.value

  // Step 4: Build the launch command
  const cmd = buildLaunchCommand(resolution, opts, launchEnv)

  // Step 5: Exec into OpenCode
  const execFn: ExecFn = exec ?? defaultExec
  const { exitCode } = await execFn(cmd)

  // In production, exec replaces the process and this line is never reached.
  // In tests (injected exec), non-zero or null exit codes are failures.
  if (exitCode !== 0) {
    return err(launchError(exitCode, cmd.command))
  }

  // Zero exit: return an error in test context (production would process.exit(0))
  return err(launchError(0, cmd.command))
}

/** Default exec: spawns the command via Bun.spawn, returns exit code. */
async function defaultExec(cmd: LaunchCommand): Promise<{ exitCode: number | null }> {
  try {
    const proc = Bun.spawn([cmd.command, ...cmd.args], {
      env: { ...process.env, ...cmd.env },
      cwd: cmd.cwd,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    })
    const exitCode = await proc.exited
    return { exitCode }
  } catch {
    return { exitCode: null }
  }
}
