declare module "bun:test" {
  export const describe: (name: string, fn: () => void | Promise<void>) => void
  export const beforeEach: (fn: () => void | Promise<void>) => void
  export const afterEach: (fn: () => void | Promise<void>) => void
  export const test: {
    (name: string, fn: () => void | Promise<void>): void
    skip: (name: string, fn: () => void | Promise<void>) => void
  }
  export const expect: (value: unknown) => {
    toBe: (expected: unknown) => void
    toEqual: (expected: unknown) => void
    toHaveLength: (expected: number) => void
    toContain: (expected: unknown) => void
    toBeGreaterThan: (expected: number) => void
    toBeLessThan: (expected: number) => void
    toBeUndefined: () => void
    toBeString: () => void
  }
}
