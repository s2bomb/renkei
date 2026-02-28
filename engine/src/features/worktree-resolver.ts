import { stat, readdir } from "node:fs/promises"
import path from "node:path"
import type { Result } from "../shared/result"
import type { WorktreeResolution, WorktreeResolveInput } from "../shared/types"
import type { WorktreeError } from "../shared/errors"
import { ok, err } from "../shared/result"
import {
  worktreeNotFoundError,
  missingDirectoryError,
  bareRepoNotFoundError,
} from "../shared/errors"

/**
 * Resolve the engine source worktree path from CLI input and filesystem state.
 *
 * Algorithm:
 * 1. Walk up from scriptDir to find the source root (has engine/ and platform/).
 * 2. Walk up from source root's parent to find a *.git bare repo directory.
 * 3. If worktreeOverride: resolve against cwd(), validate exists + has engine/ + platform/.
 * 4. If no override: resolve <bareRepoParent>/dev/, validate exists + has engine/ + platform/.
 * 5. All paths via path.resolve() for absoluteness.
 */
export async function resolveWorktree(
  opts: WorktreeResolveInput,
): Promise<Result<WorktreeResolution, WorktreeError>> {
  // Step 1: Find the source root by walking up from scriptDir
  const sourceRoot = await findSourceRoot(opts.scriptDir)

  // Step 2: Find the bare repo by walking up from scriptDir
  const bareRepoResult = await findBareRepo(opts.scriptDir)
  if (bareRepoResult === undefined) {
    return err(bareRepoNotFoundError(opts.scriptDir))
  }
  const bareRepoPath = bareRepoResult
  const bareRepoParent = path.dirname(bareRepoPath)

  // Step 3 or 4: Resolve the target worktree
  if (opts.worktreeOverride !== undefined) {
    // Override path: resolve against cwd
    const overridePath = path.resolve(opts.worktreeOverride)
    return validateAndBuildResolution(overridePath, bareRepoPath, true)
  }

  // Default: <bareRepoParent>/dev/
  const devPath = path.resolve(bareRepoParent, "dev")
  return validateAndBuildResolution(devPath, bareRepoPath, false)
}

/** Walk up from startDir looking for a directory that contains both engine/ and platform/. */
async function findSourceRoot(startDir: string): Promise<string | undefined> {
  let current = path.resolve(startDir)
  const root = path.parse(current).root

  while (current !== root) {
    if ((await dirExists(path.join(current, "engine"))) && (await dirExists(path.join(current, "platform")))) {
      return current
    }
    current = path.dirname(current)
  }

  return undefined
}

/** Walk up from startDir looking for a *.git directory (bare repo marker). */
async function findBareRepo(startDir: string): Promise<string | undefined> {
  let current = path.resolve(startDir)
  const root = path.parse(current).root

  while (current !== root) {
    try {
      const entries = await readdir(current)
      for (const entry of entries) {
        if (entry.endsWith(".git")) {
          const candidate = path.join(current, entry)
          if (await dirExists(candidate)) {
            return candidate
          }
        }
      }
    } catch {
      // Cannot read directory -- move up
    }
    current = path.dirname(current)
  }

  return undefined
}

/** Validate that the worktree path exists and has engine/ and platform/, then build the resolution. */
async function validateAndBuildResolution(
  worktreePath: string,
  bareRepoPath: string,
  isOverride: boolean,
): Promise<Result<WorktreeResolution, WorktreeError>> {
  // Validate worktree exists
  if (!(await dirExists(worktreePath))) {
    return err(worktreeNotFoundError(worktreePath))
  }

  // Validate engine/ exists
  const enginePath = path.resolve(worktreePath, "engine")
  if (!(await dirExists(enginePath))) {
    return err(missingDirectoryError(worktreePath, "engine"))
  }

  // Validate platform/ exists
  const platformPath = path.resolve(worktreePath, "platform")
  if (!(await dirExists(platformPath))) {
    return err(missingDirectoryError(worktreePath, "platform"))
  }

  const authoringPath = path.resolve(worktreePath, "authoring")

  return ok({
    sourcePath: path.resolve(worktreePath),
    enginePath,
    platformPath,
    authoringPath,
    bareRepoPath: path.resolve(bareRepoPath),
    isOverride,
  })
}

/** Check if a path exists and is a directory. Returns false on any error. */
async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const s = await stat(dirPath)
    return s.isDirectory()
  } catch {
    return false
  }
}
