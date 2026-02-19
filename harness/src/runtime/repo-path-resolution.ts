import { existsSync, statSync } from "node:fs"
import { isAbsolute, normalize, relative, resolve } from "node:path"
import type { Result } from "./types"

export type SafeRepoPath = {
  readonly absolute: string
  readonly relative: string
}

export type PathResolutionError =
  | { readonly code: "PATH_OUTSIDE_REPO"; readonly input: string; readonly repoRoot: string }
  | { readonly code: "PATH_TRAVERSAL_DETECTED"; readonly input: string }
  | { readonly code: "PATH_TARGET_MISSING"; readonly absolute: string }
  | { readonly code: "PATH_EXPECTED_FILE"; readonly absolute: string }
  | { readonly code: "PATH_EXPECTED_DIRECTORY"; readonly absolute: string }

function hasTraversalToken(input: string): boolean {
  return input
    .replaceAll("\\", "/")
    .split("/")
    .some((part) => part === "..")
}

function isOutsideRepo(repoRoot: string, absolutePath: string): boolean {
  const rel = relative(repoRoot, absolutePath)
  return rel === ".." || rel.startsWith(`..${"/"}`) || isAbsolute(rel)
}

export function resolveRepoRoot(cwd: string): Result<SafeRepoPath, PathResolutionError> {
  let current = resolve(cwd)

  while (true) {
    const marker = resolve(current, ".git")
    if (existsSync(marker)) {
      return {
        ok: true,
        value: {
          absolute: current,
          relative: ".",
        },
      }
    }

    const parent = resolve(current, "..")
    if (parent === current) {
      return {
        ok: false,
        error: {
          code: "PATH_TARGET_MISSING",
          absolute: resolve(cwd, ".git"),
        },
      }
    }
    current = parent
  }
}

export function resolveRepoPath(repoRoot: string, relativePath: string): Result<SafeRepoPath, PathResolutionError> {
  if (hasTraversalToken(relativePath)) {
    const normalized = normalize(relativePath)
    if (normalized === ".." || normalized.startsWith(`..${"/"}`) || normalized.startsWith(`..${"\\"}`)) {
      return {
        ok: false,
        error: {
          code: "PATH_OUTSIDE_REPO",
          input: relativePath,
          repoRoot,
        },
      }
    }

    return {
      ok: false,
      error: {
        code: "PATH_TRAVERSAL_DETECTED",
        input: relativePath,
      },
    }
  }

  const absolute = resolve(repoRoot, relativePath)
  if (isOutsideRepo(repoRoot, absolute)) {
    return {
      ok: false,
      error: {
        code: "PATH_OUTSIDE_REPO",
        input: relativePath,
        repoRoot,
      },
    }
  }

  return {
    ok: true,
    value: {
      absolute,
      relative: relative(repoRoot, absolute),
    },
  }
}

export function ensureFilePath(path: SafeRepoPath): Result<SafeRepoPath, PathResolutionError> {
  if (!existsSync(path.absolute)) {
    return {
      ok: false,
      error: {
        code: "PATH_TARGET_MISSING",
        absolute: path.absolute,
      },
    }
  }

  if (!statSync(path.absolute).isFile()) {
    return {
      ok: false,
      error: {
        code: "PATH_EXPECTED_FILE",
        absolute: path.absolute,
      },
    }
  }

  return { ok: true, value: path }
}

export function ensureDirectoryPath(path: SafeRepoPath): Result<SafeRepoPath, PathResolutionError> {
  if (!existsSync(path.absolute)) {
    return {
      ok: false,
      error: {
        code: "PATH_TARGET_MISSING",
        absolute: path.absolute,
      },
    }
  }

  if (!statSync(path.absolute).isDirectory()) {
    return {
      ok: false,
      error: {
        code: "PATH_EXPECTED_DIRECTORY",
        absolute: path.absolute,
      },
    }
  }

  return { ok: true, value: path }
}
