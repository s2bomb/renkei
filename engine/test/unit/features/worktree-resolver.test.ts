import { describe, test, expect, afterEach } from "bun:test"
import type { Ok, Err } from "../../../src/shared/result"
import { isOk, isErr } from "../../../src/shared/result"
import type { WorktreeResolution } from "../../../src/shared/types"
import type { WorktreeNotFoundError, MissingDirectoryError, BareRepoNotFoundError } from "../../../src/shared/errors"
import { resolveWorktree } from "../../../src/features/worktree-resolver"
import { createWorktreeFixture, createIsolatedDir } from "../helpers/fs-fixture"

let cleanups: Array<() => Promise<void>> = []

afterEach(async () => {
  for (const cleanup of cleanups) {
    await cleanup()
  }
  cleanups = []
})

describe("resolveWorktree", () => {
  test("T-W01: override path exists with engine/ and platform/ -> Ok with isOverride true", async () => {
    const fixture = await createWorktreeFixture({ worktreeName: "custom-wt", hasEngine: true, hasPlatform: true })
    cleanups.push(fixture.cleanup)

    const result = await resolveWorktree({
      worktreeOverride: fixture.worktree!,
      scriptDir: fixture.scriptDir,
    })

    expect(isOk(result)).toBe(true)
    const resolution = (result as Ok<WorktreeResolution>).value
    expect(resolution.isOverride).toBe(true)
    expect(resolution.sourcePath).toStartWith("/")
    expect(resolution.enginePath).toStartWith("/")
    expect(resolution.platformPath).toStartWith("/")
    expect(resolution.bareRepoPath).toStartWith("/")
  })

  test("T-W02: override path does not exist -> Err<WorktreeNotFoundError>", async () => {
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    cleanups.push(fixture.cleanup)

    const nonexistent = `${fixture.root}/nonexistent-worktree`
    const result = await resolveWorktree({
      worktreeOverride: nonexistent,
      scriptDir: fixture.scriptDir,
    })

    expect(isErr(result)).toBe(true)
    const error = (result as Err<WorktreeNotFoundError>).error
    expect(error.tag).toBe("WorktreeNotFound")
    expect(error.path).toBe(nonexistent)
  })

  test("T-W03: override path exists but missing engine/ -> Err<MissingDirectoryError>", async () => {
    const fixture = await createWorktreeFixture({
      worktreeName: "override-wt",
      hasEngine: true,
      hasPlatform: true,
    })
    cleanups.push(fixture.cleanup)

    // Create a directory that exists but has only platform/, no engine/
    const { mkdtemp, mkdir } = await import("node:fs/promises")
    const { tmpdir } = await import("node:os")
    const path = await import("node:path")
    const missingEngineDir = await mkdtemp(path.join(tmpdir(), "renkei-noengine-"))
    cleanups.push(async () => {
      const { rm } = await import("node:fs/promises")
      await rm(missingEngineDir, { recursive: true, force: true })
    })
    await mkdir(path.join(missingEngineDir, "platform"))

    const result = await resolveWorktree({
      worktreeOverride: missingEngineDir,
      scriptDir: fixture.scriptDir,
    })

    expect(isErr(result)).toBe(true)
    const error = (result as Err<MissingDirectoryError>).error
    expect(error.tag).toBe("MissingDirectory")
    expect(error.expected).toBe("engine")
  })

  test("T-W04: no override, dev/ exists with required dirs -> Ok with isOverride false", async () => {
    const fixture = await createWorktreeFixture({
      worktreeName: "dev",
      hasEngine: true,
      hasPlatform: true,
    })
    cleanups.push(fixture.cleanup)

    const result = await resolveWorktree({
      worktreeOverride: undefined,
      scriptDir: fixture.scriptDir,
    })

    expect(isOk(result)).toBe(true)
    const resolution = (result as Ok<WorktreeResolution>).value
    expect(resolution.isOverride).toBe(false)
    expect(resolution.sourcePath).toStartWith("/")
  })

  test("T-W05: no override, dev/ does not exist -> Err<WorktreeNotFoundError>", async () => {
    const fixture = await createWorktreeFixture({
      noWorktree: true,
    })
    cleanups.push(fixture.cleanup)

    const result = await resolveWorktree({
      worktreeOverride: undefined,
      scriptDir: fixture.scriptDir,
    })

    expect(isErr(result)).toBe(true)
    const error = (result as Err<WorktreeNotFoundError>).error
    expect(error.tag).toBe("WorktreeNotFound")
    expect(error.message.length).toBeGreaterThan(0)
    expect(error.path).toContain("dev")
  })

  test("T-W06: no *.git bare repo in any ancestor -> Err<BareRepoNotFoundError>", async () => {
    const isolated = await createIsolatedDir()
    cleanups.push(isolated.cleanup)

    const result = await resolveWorktree({
      worktreeOverride: undefined,
      scriptDir: isolated.path,
    })

    expect(isErr(result)).toBe(true)
    const error = (result as Err<BareRepoNotFoundError>).error
    expect(error.tag).toBe("BareRepoNotFound")
    expect(error.searchedFrom).toBe(isolated.path)
  })

  test("T-W07: override as relative path -> Ok with all absolute paths", async () => {
    const fixture = await createWorktreeFixture({
      worktreeName: "rel-wt",
      hasEngine: true,
      hasPlatform: true,
    })
    cleanups.push(fixture.cleanup)

    // Use a relative path by computing relative from cwd to the worktree
    const path = await import("node:path")
    const relativePath = path.relative(process.cwd(), fixture.worktree!)

    const result = await resolveWorktree({
      worktreeOverride: relativePath,
      scriptDir: fixture.scriptDir,
    })

    expect(isOk(result)).toBe(true)
    const resolution = (result as Ok<WorktreeResolution>).value
    expect(resolution.sourcePath).toStartWith("/")
    expect(resolution.enginePath).toStartWith("/")
    expect(resolution.platformPath).toStartWith("/")
    expect(resolution.authoringPath).toStartWith("/")
    expect(resolution.bareRepoPath).toStartWith("/")
  })
})
