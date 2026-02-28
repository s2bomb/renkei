export interface EngineError {
  readonly tag: EngineErrorTag
  readonly message: string
}

export type EngineErrorTag =
  | WorktreeNotFoundError["tag"]
  | MissingDirectoryError["tag"]
  | BareRepoNotFoundError["tag"]
  | ConfigBuildError["tag"]
  | LaunchError["tag"]
  | ParseError["tag"]

export interface WorktreeNotFoundError extends EngineError {
  readonly tag: "WorktreeNotFound"
  readonly path: string
}

export function worktreeNotFoundError(path: string): WorktreeNotFoundError {
  return {
    tag: "WorktreeNotFound",
    message: `Worktree not found at ${path}.\nTo create the dev worktree: git -C renkei.git worktree add ../dev dev`,
    path,
  }
}

export interface MissingDirectoryError extends EngineError {
  readonly tag: "MissingDirectory"
  readonly path: string
  readonly expected: "engine" | "platform"
}

export function missingDirectoryError(path: string, expected: "engine" | "platform"): MissingDirectoryError {
  return {
    tag: "MissingDirectory",
    message: `Required directory '${expected}/' not found at ${path}`,
    path,
    expected,
  }
}

export interface BareRepoNotFoundError extends EngineError {
  readonly tag: "BareRepoNotFound"
  readonly searchedFrom: string
}

export function bareRepoNotFoundError(searchedFrom: string): BareRepoNotFoundError {
  return {
    tag: "BareRepoNotFound",
    message: `Could not find a *.git bare repo directory searching up from ${searchedFrom}`,
    searchedFrom,
  }
}

export interface ConfigBuildError extends EngineError {
  readonly tag: "ConfigBuildFailed"
  readonly reason: string
}

export function configBuildError(reason: string): ConfigBuildError {
  return { tag: "ConfigBuildFailed", message: `Config build failed: ${reason}`, reason }
}

export interface LaunchError extends EngineError {
  readonly tag: "LaunchFailed"
  readonly exitCode: number | null
  readonly command: string
}

export function launchError(exitCode: number | null, command: string): LaunchError {
  const detail = exitCode !== null ? `exit code ${exitCode}` : "failed to start"
  return { tag: "LaunchFailed", message: `OpenCode ${detail}: ${command}`, exitCode, command }
}

export interface ParseError extends EngineError {
  readonly tag: "ParseError"
  readonly flag: string
}

export function parseError(flag: string): ParseError {
  return { tag: "ParseError", message: `${flag} requires a value`, flag }
}

export type WorktreeError = WorktreeNotFoundError | MissingDirectoryError | BareRepoNotFoundError
export type LaunchSequenceError = WorktreeError | ConfigBuildError | LaunchError
