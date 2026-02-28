import type { Result } from "../shared/result"
import type { LaunchOptions } from "../shared/types"
import type { ParseError } from "../shared/errors"
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
