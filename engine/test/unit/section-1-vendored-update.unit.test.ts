import { describe, expect, test } from "bun:test"
import { loadVendoredUpdateWorkflowModule } from "../helpers/section-1-module-loader"

type VendoredUpdateRequest = {
  readonly remote: string
  readonly branch: string
  readonly upstreamRef?: string
  readonly vendorPrefix: string
  readonly squash: boolean
}

type VendoredUpdatePlan = {
  readonly command: ReadonlyArray<string>
  readonly expectedPrefix: string
  readonly upstreamRef: string
}

function makeValidRequest(overrides?: Partial<VendoredUpdateRequest>): VendoredUpdateRequest {
  return {
    remote: "origin",
    branch: "main",
    vendorPrefix: "platform/opencode",
    squash: true,
    ...overrides,
  }
}

function makeValidPlan(overrides?: Partial<VendoredUpdatePlan>): VendoredUpdatePlan {
  return {
    command: ["git", "subtree", "pull", "--prefix", "platform/opencode", "origin", "main", "--squash"],
    expectedPrefix: "platform/opencode",
    upstreamRef: "origin/main",
    ...overrides,
  }
}

describe("unit section-1-vendored-update contracts", () => {
  test("S1-T14 planner emits deterministic subtree command and upstream reference", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()

    const result = runtime.planVendoredUpdate(makeValidRequest())
    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.expectedPrefix).toBe("platform/opencode")
    expect(result.value.upstreamRef).toBe("origin/main")
    expect(result.value.command[0]).toBe("git")
    expect(result.value.command.includes("subtree")).toBe(true)
    expect(result.value.command.includes("pull")).toBe(true)
    expect(result.value.command.includes("--prefix")).toBe(true)
    expect(result.value.command.includes("platform/opencode")).toBe(true)
    expect(result.value.command.includes("origin")).toBe(true)
    expect(result.value.command.includes("main")).toBe(true)
  })

  test("S1-T15 planner rejects invalid input with declared VendoredUpdateError discriminant", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()

    const result = runtime.planVendoredUpdate(
      makeValidRequest({
        vendorPrefix: "../../opencode",
      }),
    )
    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(
      ["GIT_NOT_AVAILABLE", "WORKTREE_DIRTY", "SUBTREE_COMMAND_FAILED", "POST_UPDATE_VALIDATION_FAILED"].includes(
        result.error.code,
      ),
    ).toBe(true)
  })

  test("S1-T16 dirty worktree blocks update with WORKTREE_DIRTY", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()

    const result = await runtime.executeVendoredUpdate(makeValidPlan(), {
      ensureGitAvailable: () => ({ ok: true, value: true }),
      checkWorktreeDirty: async () => ({
        ok: false,
        error: {
          code: "WORKTREE_DIRTY",
          detail: "working tree contains local changes",
        },
      }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }
    expect(result.error.code).toBe("WORKTREE_DIRTY")
    expect(typeof result.error.detail).toBe("string")
  })

  test("S1-T17 missing git dependency surfaces GIT_NOT_AVAILABLE", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()

    const result = await runtime.executeVendoredUpdate(makeValidPlan(), {
      ensureGitAvailable: () => ({
        ok: false,
        error: {
          code: "GIT_NOT_AVAILABLE",
          cause: "git executable not found",
        },
      }),
      checkWorktreeDirty: async () => ({ ok: true, value: false }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("GIT_NOT_AVAILABLE")
    expect(typeof result.error.cause).toBe("string")
  })

  test("S1-T18 subtree command failure maps typed and preserves command context", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()
    const plan = makeValidPlan()
    const attemptedCommands: Array<ReadonlyArray<string>> = []

    const result = await runtime.executeVendoredUpdate(plan, {
      ensureGitAvailable: () => ({ ok: true, value: true }),
      checkWorktreeDirty: async () => ({ ok: true, value: false }),
      runSubtreeCommand: async (command: ReadonlyArray<string>) => {
        attemptedCommands.push(command)
        return {
          exitCode: 1,
          stdout: "",
          stderr: "subtree pull failed",
        }
      },
    })

    expect(attemptedCommands).toEqual([plan.command])
    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("SUBTREE_COMMAND_FAILED")
    expect(result.error.command).toEqual(plan.command)
    expect(typeof result.error.cause).toBe("string")
  })

  test("S1-T19 post-update verification failure blocks success with POST_UPDATE_VALIDATION_FAILED", async () => {
    const runtime = await loadVendoredUpdateWorkflowModule()

    const result = await runtime.executeVendoredUpdate(makeValidPlan(), {
      ensureGitAvailable: () => ({ ok: true, value: true }),
      checkWorktreeDirty: async () => ({ ok: true, value: false }),
      runSubtreeCommand: async () => ({
        exitCode: 0,
        stdout: "ok",
        stderr: "",
      }),
      readHeadCommit: async () => ({ ok: true, value: "abc1234" }),
      writeLinkageProvenance: async () => ({ ok: true, value: true }),
      loadVendoredOpenCodeLinkage: () => ({
        ok: true,
        value: {
          mode: "subtree",
          repoRoot: "/tmp/repo",
          platformRoot: "/tmp/repo/platform",
          opencodeRoot: "/tmp/repo/platform/opencode",
          engineRoot: "/tmp/repo/engine",
          provenance: {
            remote: "origin",
            branch: "main",
            upstreamRef: "origin/main",
            syncedAt: "2026-02-19T00:00:00.000Z",
          },
        },
      }),
      verifyVendoredUpdate: () => ({
        ok: false,
        error: {
          code: "POST_UPDATE_VALIDATION_FAILED",
          detail: "linked state did not verify",
        },
      }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("POST_UPDATE_VALIDATION_FAILED")
    expect(typeof result.error.detail).toBe("string")
  })
})
