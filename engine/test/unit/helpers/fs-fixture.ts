import { mkdtemp, mkdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

export interface WorktreeFixtureResult {
  /** Root of the fixture (parent of bare repo and worktrees) */
  root: string
  /** Path to the *.git bare repo directory */
  bareRepo: string
  /** Path to the worktree directory (if created) */
  worktree: string | undefined
  /** A scriptDir inside the worktree's engine/src (for resolver to walk up from) */
  scriptDir: string
  /** Cleanup function */
  cleanup: () => Promise<void>
}

/**
 * Creates a temporary directory structure simulating the renkei bare repo layout:
 *   <root>/
 *     renkei.git/       (bare repo marker -- just a directory, not a real git repo)
 *     <worktreeName>/
 *       engine/          (if opts.hasEngine)
 *         src/           (always created with engine/ for scriptDir)
 *       platform/        (if opts.hasPlatform)
 *       authoring/       (if opts.hasAuthoring)
 */
export async function createWorktreeFixture(opts: {
  worktreeName?: string
  hasEngine?: boolean
  hasPlatform?: boolean
  hasAuthoring?: boolean
  bareRepoName?: string
  noWorktree?: boolean
}): Promise<WorktreeFixtureResult> {
  const worktreeName = opts.worktreeName ?? "dev"
  const bareRepoName = opts.bareRepoName ?? "renkei.git"
  const hasEngine = opts.hasEngine ?? true
  const hasPlatform = opts.hasPlatform ?? true
  const hasAuthoring = opts.hasAuthoring ?? false
  const noWorktree = opts.noWorktree ?? false

  const root = await mkdtemp(path.join(tmpdir(), "renkei-test-"))
  const bareRepo = path.join(root, bareRepoName)
  await mkdir(bareRepo)

  let worktree: string | undefined
  let scriptDir: string

  if (!noWorktree) {
    worktree = path.join(root, worktreeName)
    await mkdir(worktree)

    if (hasEngine) {
      const engineSrc = path.join(worktree, "engine", "src")
      await mkdir(engineSrc, { recursive: true })
    }

    if (hasPlatform) {
      await mkdir(path.join(worktree, "platform"))
    }

    if (hasAuthoring) {
      await mkdir(path.join(worktree, "authoring"))
    }

    // scriptDir points inside the worktree's engine/src so resolver can walk up
    scriptDir = hasEngine ? path.join(worktree, "engine", "src") : path.join(worktree, "engine", "src")
    // If engine dir doesn't exist, still provide a scriptDir in the worktree
    if (!hasEngine) {
      scriptDir = worktree
    }
  } else {
    // No worktree -- scriptDir is inside the root (bare repo parent)
    // For T-W05, we need scriptDir to be inside a "source" worktree that has bare repo.
    // We create a minimal source worktree for the resolver to find the bare repo from.
    const sourceWorktree = path.join(root, "source-wt")
    await mkdir(path.join(sourceWorktree, "engine", "src"), { recursive: true })
    await mkdir(path.join(sourceWorktree, "platform"))
    scriptDir = path.join(sourceWorktree, "engine", "src")
  }

  return {
    root,
    bareRepo,
    worktree,
    scriptDir,
    cleanup: async () => {
      await rm(root, { recursive: true, force: true })
    },
  }
}

/**
 * Creates an isolated tmp directory with NO *.git ancestor.
 * Used for T-W06 (BareRepoNotFoundError).
 */
export async function createIsolatedDir(): Promise<{ path: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(path.join(tmpdir(), "renkei-isolated-"))
  return {
    path: dir,
    cleanup: async () => {
      await rm(dir, { recursive: true, force: true })
    },
  }
}
