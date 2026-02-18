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
  export function writeFile(path: string, data: string): Promise<void>
}

declare module "node:os" {
  export function tmpdir(): string
}

declare module "node:path" {
  export function join(...parts: string[]): string
}
