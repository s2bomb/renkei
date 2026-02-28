import { existsSync } from "node:fs"
import type { Result } from "../shared/result"
import type { ConfigInjectionInput, LaunchEnvironment } from "../shared/types"
import type { ConfigBuildError } from "../shared/errors"
import { ok, err } from "../shared/result"
import { configBuildError } from "../shared/errors"

/**
 * Build the environment variable values for launching OpenCode.
 *
 * Validates that the plugin file exists, builds the config JSON,
 * and returns all four environment variable values.
 */
export function buildLaunchEnv(input: ConfigInjectionInput): Result<LaunchEnvironment, ConfigBuildError> {
  // Validate plugin file exists
  if (!existsSync(input.engineConfig.pluginPath)) {
    return err(configBuildError(`Plugin file not found: ${input.engineConfig.pluginPath}`))
  }

  // Build config JSON: { skills: { paths: [...skillPaths] } }
  const configObj: Record<string, unknown> = {
    skills: { paths: [...input.engineConfig.skillPaths] },
  }

  const configContent = JSON.stringify(configObj)

  return ok({
    OPENCODE_CONFIG_CONTENT: configContent,
    OPENCODE_CONFIG_DIR: input.engineConfig.configDirPath,
    RENKEI_ENGINE_SOURCE: input.resolution.sourcePath,
    RENKEI_WORKTREE_OVERRIDE: input.worktreeOverride,
  })
}
