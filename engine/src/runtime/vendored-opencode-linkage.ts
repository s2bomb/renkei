import { existsSync, readFileSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import type { Result } from "./types"
import { resolveRepoPath, resolveRepoRoot } from "./repo-path-resolution"

export type VendoredLinkageMode = "subtree"

export type VendoredOpenCodeLinkage = {
  readonly mode: VendoredLinkageMode
  readonly repoRoot: string
  readonly platformRoot: string
  readonly opencodeRoot: string
  readonly engineRoot: string
  readonly provenance: {
    readonly remote: string
    readonly branch: string
    readonly upstreamRef: string
    readonly syncedAt: string
  }
}

export type LinkageError =
  | { readonly code: "REPO_ROOT_NOT_FOUND"; readonly cwd: string }
  | { readonly code: "LINKAGE_CONFIG_MISSING"; readonly expectedPath: string }
  | { readonly code: "LINKAGE_CONFIG_INVALID"; readonly path: string; readonly detail: string }
  | { readonly code: "VENDORED_OPENCODE_MISSING"; readonly opencodeRoot: string }
  | { readonly code: "VENDORED_MODE_UNSUPPORTED"; readonly mode: string }

type LinkageConfig = {
  readonly mode: string
  readonly opencodeRoot: string
  readonly provenance: {
    readonly remote: string
    readonly branch: string
    readonly upstreamRef: string
    readonly syncedAt: string
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseLinkageConfig(path: string): Result<LinkageConfig, LinkageError> {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"))
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "LINKAGE_CONFIG_INVALID",
        path,
        detail: `Invalid JSON: ${String(error)}`,
      },
    }
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      error: {
        code: "LINKAGE_CONFIG_INVALID",
        path,
        detail: "Expected object",
      },
    }
  }

  const provenance = parsed.provenance
  if (
    typeof parsed.mode !== "string" ||
    typeof parsed.opencodeRoot !== "string" ||
    !isRecord(provenance) ||
    typeof provenance.remote !== "string" ||
    typeof provenance.branch !== "string" ||
    typeof provenance.upstreamRef !== "string" ||
    typeof provenance.syncedAt !== "string"
  ) {
    return {
      ok: false,
      error: {
        code: "LINKAGE_CONFIG_INVALID",
        path,
        detail: "Missing or invalid required fields",
      },
    }
  }

  return {
    ok: true,
    value: {
      mode: parsed.mode,
      opencodeRoot: parsed.opencodeRoot,
      provenance: {
        remote: provenance.remote,
        branch: provenance.branch,
        upstreamRef: provenance.upstreamRef,
        syncedAt: provenance.syncedAt,
      },
    },
  }
}

export function loadVendoredOpenCodeLinkage(cwd: string): Result<VendoredOpenCodeLinkage, LinkageError> {
  const repoRootResult = resolveRepoRoot(cwd)
  if (!repoRootResult.ok) {
    return {
      ok: false,
      error: {
        code: "REPO_ROOT_NOT_FOUND",
        cwd,
      },
    }
  }

  const repoRoot = repoRootResult.value.absolute
  const configPath = resolve(repoRoot, "engine", "config", "opencode-linkage.json")

  if (!existsSync(configPath)) {
    return {
      ok: false,
      error: {
        code: "LINKAGE_CONFIG_MISSING",
        expectedPath: configPath,
      },
    }
  }

  const configResult = parseLinkageConfig(configPath)
  if (!configResult.ok) {
    return configResult
  }

  if (configResult.value.mode !== "subtree") {
    return {
      ok: false,
      error: {
        code: "VENDORED_MODE_UNSUPPORTED",
        mode: configResult.value.mode,
      },
    }
  }

  const opencodePathResult = resolveRepoPath(repoRoot, configResult.value.opencodeRoot)
  if (!opencodePathResult.ok) {
    return {
      ok: false,
      error: {
        code: "LINKAGE_CONFIG_INVALID",
        path: configPath,
        detail: `opencodeRoot must stay within repo root: ${opencodePathResult.error.code}`,
      },
    }
  }

  return {
    ok: true,
    value: {
      mode: "subtree",
      repoRoot,
      platformRoot: dirname(opencodePathResult.value.absolute),
      opencodeRoot: opencodePathResult.value.absolute,
      engineRoot: resolve(repoRoot, "engine"),
      provenance: configResult.value.provenance,
    },
  }
}

export function verifyVendoredOpenCodeLinkage(linkage: VendoredOpenCodeLinkage): Result<true, LinkageError> {
  if (linkage.mode !== "subtree") {
    return {
      ok: false,
      error: {
        code: "VENDORED_MODE_UNSUPPORTED",
        mode: linkage.mode,
      },
    }
  }

  if (!existsSync(linkage.opencodeRoot) || !statSync(linkage.opencodeRoot).isDirectory()) {
    return {
      ok: false,
      error: {
        code: "VENDORED_OPENCODE_MISSING",
        opencodeRoot: linkage.opencodeRoot,
      },
    }
  }

  return { ok: true, value: true }
}
