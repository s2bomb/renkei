declare const process: {
  env: Record<string, string | undefined>
  cwd(): string
}

declare module "node:crypto" {
  export function randomUUID(): string
}

declare module "node:fs/promises" {
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>
  export function mkdtemp(prefix: string): Promise<string>
  export function rm(
    path: string,
    options?: { force?: boolean; recursive?: boolean; maxRetries?: number; retryDelay?: number },
  ): Promise<void>
  export function writeFile(path: string, data: string): Promise<void>
}

declare module "node:fs" {
  export function existsSync(path: string): boolean
  export function readFileSync(path: string, encoding: "utf8"): string
  export function writeFileSync(path: string, data: string, encoding: "utf8"): void
  export function statSync(path: string): {
    isDirectory(): boolean
    isFile(): boolean
  }
}

declare module "node:child_process" {
  type ChunkHandler = (chunk: Buffer | string) => void
  type ErrorHandler = (error: unknown) => void
  type CloseHandler = (code: number | null) => void

  export function spawn(
    command: string,
    args: ReadonlyArray<string>,
    options: { cwd: string },
  ): {
    stdout?: { on(event: "data", handler: ChunkHandler): void }
    stderr?: { on(event: "data", handler: ChunkHandler): void }
    on(event: "error", handler: ErrorHandler): void
    on(event: "close", handler: CloseHandler): void
  }

  export function spawnSync(
    command: string,
    args: ReadonlyArray<string>,
    options: { cwd: string; encoding: "utf8" },
  ): {
    status: number | null
    error?: unknown
    stderr?: string
  }
}

declare module "node:os" {
  export function tmpdir(): string
}

declare module "node:path" {
  export function dirname(path: string): string
  export function isAbsolute(path: string): boolean
  export function join(...parts: string[]): string
  export function normalize(path: string): string
  export function relative(from: string, to: string): string
  export function resolve(...parts: string[]): string
}

declare type Buffer = {
  toString(): string
}
