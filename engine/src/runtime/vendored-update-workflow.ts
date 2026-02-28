import { spawn, spawnSync } from "node:child_process"
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  loadVendoredOpenCodeLinkage,
  type LinkageError,
  type VendoredOpenCodeLinkage,
} from "./vendored-opencode-linkage"
import type { Result } from "./types"

export type VendoredUpdateRequest = {
  readonly remote: string
  readonly branch: string
  readonly upstreamRef?: string
  readonly vendorPrefix: string
  readonly squash: boolean
}

export type VendoredUpdatePlan = {
  readonly command: ReadonlyArray<string>
  readonly expectedPrefix: string
  readonly upstreamRef: string
}

export type VendoredUpdateReceipt = {
  readonly updatedPrefix: string
  readonly upstreamRef: string
  readonly commit: string
  readonly timestampMs: number
}

export type VendoredCommandResult = {
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
}

export type VendoredUpdateError =
  | { readonly code: "GIT_NOT_AVAILABLE"; readonly cause: string }
  | { readonly code: "WORKTREE_DIRTY"; readonly detail: string }
  | { readonly code: "SUBTREE_COMMAND_FAILED"; readonly command: ReadonlyArray<string>; readonly cause: string }
  | { readonly code: "POST_UPDATE_VALIDATION_FAILED"; readonly detail: string }

export type VendoredUpdateExecutionDependencies = {
  readonly nowMs: () => number
  readonly ensureGitAvailable: () => Result<true, VendoredUpdateError>
  readonly checkWorktreeDirty: () => Promise<Result<false, VendoredUpdateError>>
  readonly runSubtreeCommand: (command: ReadonlyArray<string>) => Promise<VendoredCommandResult>
  readonly readHeadCommit: () => Promise<Result<string, VendoredUpdateError>>
  readonly writeLinkageProvenance: (input: {
    readonly upstreamRef: string
    readonly syncedAtIso: string
  }) => Promise<Result<true, VendoredUpdateError>>
  readonly verifyVendoredUpdate: (linkage: VendoredOpenCodeLinkage) => Result<true, VendoredUpdateError>
  readonly loadVendoredOpenCodeLinkage: (cwd: string) => Result<VendoredOpenCodeLinkage, LinkageError>
  readonly cwd: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function runCommand(command: ReadonlyArray<string>, cwd: string): Promise<VendoredCommandResult> {
  return new Promise((resolveResult) => {
    const [bin, ...args] = command
    if (!bin) {
      resolveResult({
        exitCode: 1,
        stdout: "",
        stderr: "Command is empty",
      })
      return
    }

    let stdout = ""
    let stderr = ""
    const child = spawn(bin, args, { cwd })

    child.stdout?.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })
    child.stderr?.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })
    child.on("error", (error) => {
      resolveResult({
        exitCode: 1,
        stdout,
        stderr: stderr || String(error),
      })
    })
    child.on("close", (code) => {
      resolveResult({
        exitCode: code ?? 1,
        stdout,
        stderr,
      })
    })
  })
}

function toPostUpdateValidationFailed(detail: string): VendoredUpdateError {
  return {
    code: "POST_UPDATE_VALIDATION_FAILED",
    detail,
  }
}

function normalizeLinkageFailure(error: LinkageError): VendoredUpdateError {
  const detail =
    error.code === "REPO_ROOT_NOT_FOUND"
      ? `Repository root not found from cwd: ${error.cwd}`
      : error.code === "LINKAGE_CONFIG_MISSING"
        ? `Linkage config missing: ${error.expectedPath}`
        : error.code === "LINKAGE_CONFIG_INVALID"
          ? `Linkage config invalid at ${error.path}: ${error.detail}`
          : error.code === "VENDORED_OPENCODE_MISSING"
            ? `Vendored OpenCode missing at ${error.opencodeRoot}`
            : `Unsupported vendored mode: ${error.mode}`

  return toPostUpdateValidationFailed(detail)
}

function defaultEnsureGitAvailable(cwd: string): () => Result<true, VendoredUpdateError> {
  return () => {
    const result = spawnSync("git", ["--version"], { cwd, encoding: "utf8" })
    if (result.error || result.status !== 0) {
      return {
        ok: false,
        error: {
          code: "GIT_NOT_AVAILABLE",
          cause: String(result.error ?? result.stderr ?? "git --version failed"),
        },
      }
    }
    return { ok: true, value: true }
  }
}

function defaultCheckWorktreeDirty(cwd: string): () => Promise<Result<false, VendoredUpdateError>> {
  return async () => {
    const status = await runCommand(["git", "status", "--porcelain"], cwd)
    if (status.exitCode !== 0) {
      return {
        ok: false,
        error: {
          code: "GIT_NOT_AVAILABLE",
          cause: status.stderr || "failed to inspect git worktree",
        },
      }
    }

    if (status.stdout.trim().length > 0) {
      return {
        ok: false,
        error: {
          code: "WORKTREE_DIRTY",
          detail: "working tree contains local changes",
        },
      }
    }

    return { ok: true, value: false }
  }
}

function defaultRunSubtreeCommand(cwd: string): (command: ReadonlyArray<string>) => Promise<VendoredCommandResult> {
  return async (command) => runCommand(command, cwd)
}

function defaultReadHeadCommit(cwd: string): () => Promise<Result<string, VendoredUpdateError>> {
  return async () => {
    const result = await runCommand(["git", "rev-parse", "HEAD"], cwd)
    if (result.exitCode !== 0) {
      return {
        ok: false,
        error: toPostUpdateValidationFailed(result.stderr || "failed to read HEAD commit"),
      }
    }
    return { ok: true, value: result.stdout.trim() }
  }
}

function defaultWriteLinkageProvenance(
  cwd: string,
): (input: {
  readonly upstreamRef: string
  readonly syncedAtIso: string
}) => Promise<Result<true, VendoredUpdateError>> {
  return async ({ upstreamRef, syncedAtIso }) => {
    const linkage = loadVendoredOpenCodeLinkage(cwd)
    if (!linkage.ok) {
      return { ok: false, error: normalizeLinkageFailure(linkage.error) }
    }

    const configPath = resolve(linkage.value.repoRoot, "engine", "config", "opencode-linkage.json")
    if (!existsSync(configPath) || !statSync(configPath).isFile()) {
      return {
        ok: false,
        error: toPostUpdateValidationFailed(`Linkage config missing: ${configPath}`),
      }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(readFileSync(configPath, "utf8"))
    } catch (error) {
      return {
        ok: false,
        error: toPostUpdateValidationFailed(`Failed parsing linkage config: ${String(error)}`),
      }
    }

    if (!isRecord(parsed) || !isRecord(parsed.provenance)) {
      return {
        ok: false,
        error: toPostUpdateValidationFailed("Linkage config must include provenance object"),
      }
    }

    const nextConfig = {
      ...parsed,
      provenance: {
        ...parsed.provenance,
        upstreamRef,
        syncedAt: syncedAtIso,
      },
    }

    try {
      writeFileSync(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, "utf8")
      return { ok: true, value: true }
    } catch (error) {
      return {
        ok: false,
        error: toPostUpdateValidationFailed(`Failed writing linkage provenance: ${String(error)}`),
      }
    }
  }
}

function mergeDependencies(deps?: Partial<VendoredUpdateExecutionDependencies>): VendoredUpdateExecutionDependencies {
  const cwd = deps?.cwd ?? process.cwd()

  return {
    nowMs: deps?.nowMs ?? (() => Date.now()),
    ensureGitAvailable: deps?.ensureGitAvailable ?? defaultEnsureGitAvailable(cwd),
    checkWorktreeDirty: deps?.checkWorktreeDirty ?? defaultCheckWorktreeDirty(cwd),
    runSubtreeCommand: deps?.runSubtreeCommand ?? defaultRunSubtreeCommand(cwd),
    readHeadCommit: deps?.readHeadCommit ?? defaultReadHeadCommit(cwd),
    writeLinkageProvenance: deps?.writeLinkageProvenance ?? defaultWriteLinkageProvenance(cwd),
    verifyVendoredUpdate: deps?.verifyVendoredUpdate ?? verifyVendoredUpdate,
    loadVendoredOpenCodeLinkage: deps?.loadVendoredOpenCodeLinkage ?? loadVendoredOpenCodeLinkage,
    cwd,
  }
}

function hasTraversalToken(input: string): boolean {
  return input
    .replaceAll("\\", "/")
    .split("/")
    .some((part) => part === "..")
}

export function planVendoredUpdate(request: VendoredUpdateRequest): Result<VendoredUpdatePlan, VendoredUpdateError> {
  if (!request.remote.trim() || !request.branch.trim() || !request.vendorPrefix.trim()) {
    return {
      ok: false,
      error: toPostUpdateValidationFailed("remote, branch, and vendorPrefix are required"),
    }
  }

  if (hasTraversalToken(request.vendorPrefix)) {
    return {
      ok: false,
      error: toPostUpdateValidationFailed("vendorPrefix must stay within repository topology"),
    }
  }

  const upstreamRef = request.upstreamRef?.trim() || `${request.remote}/${request.branch}`
  const command: Array<string> = [
    "git",
    "subtree",
    "pull",
    "--prefix",
    request.vendorPrefix,
    request.remote,
    request.branch,
  ]

  if (request.squash) {
    command.push("--squash")
  }

  return {
    ok: true,
    value: {
      command,
      expectedPrefix: request.vendorPrefix,
      upstreamRef,
    },
  }
}

export function verifyVendoredUpdate(linkage: VendoredOpenCodeLinkage): Result<true, VendoredUpdateError> {
  if (linkage.mode !== "subtree") {
    return {
      ok: false,
      error: toPostUpdateValidationFailed(`Unsupported linkage mode: ${linkage.mode}`),
    }
  }

  if (!existsSync(linkage.opencodeRoot) || !statSync(linkage.opencodeRoot).isDirectory()) {
    return {
      ok: false,
      error: toPostUpdateValidationFailed(`Vendored OpenCode root missing: ${linkage.opencodeRoot}`),
    }
  }

  return { ok: true, value: true }
}

export async function executeVendoredUpdate(
  plan: VendoredUpdatePlan,
  deps?: Partial<VendoredUpdateExecutionDependencies>,
): Promise<Result<VendoredUpdateReceipt, VendoredUpdateError>> {
  const mergedDeps = mergeDependencies(deps)

  const gitAvailability = mergedDeps.ensureGitAvailable()
  if (!gitAvailability.ok) {
    return gitAvailability
  }

  const worktreeDirty = await mergedDeps.checkWorktreeDirty()
  if (!worktreeDirty.ok) {
    return worktreeDirty
  }

  const subtreeResult = await mergedDeps.runSubtreeCommand(plan.command)
  if (subtreeResult.exitCode !== 0) {
    return {
      ok: false,
      error: {
        code: "SUBTREE_COMMAND_FAILED",
        command: plan.command,
        cause:
          subtreeResult.stderr || subtreeResult.stdout || `Subtree command failed with code ${subtreeResult.exitCode}`,
      },
    }
  }

  const headCommit = await mergedDeps.readHeadCommit()
  if (!headCommit.ok) {
    return headCommit
  }

  const timestampMs = mergedDeps.nowMs()
  const syncedAtIso = new Date(timestampMs).toISOString()
  const persisted = await mergedDeps.writeLinkageProvenance({
    upstreamRef: plan.upstreamRef,
    syncedAtIso,
  })
  if (!persisted.ok) {
    return persisted
  }

  const linkage = mergedDeps.loadVendoredOpenCodeLinkage(mergedDeps.cwd)
  if (!linkage.ok) {
    return {
      ok: false,
      error: normalizeLinkageFailure(linkage.error),
    }
  }

  const verified = mergedDeps.verifyVendoredUpdate(linkage.value)
  if (!verified.ok) {
    return verified
  }

  return {
    ok: true,
    value: {
      updatedPrefix: plan.expectedPrefix,
      upstreamRef: plan.upstreamRef,
      commit: headCommit.value,
      timestampMs,
    },
  }
}
