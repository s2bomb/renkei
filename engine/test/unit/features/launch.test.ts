import { describe, test, expect } from "bun:test"
import type { Ok, Err } from "../../../src/shared/result"
import { isOk, isErr } from "../../../src/shared/result"
import type { LaunchOptions } from "../../../src/shared/types"
import type { ParseError } from "../../../src/shared/errors"
import { parseLaunchOptions } from "../../../src/features/launch"

describe("parseLaunchOptions", () => {
  test("T-L05: --worktree consumes the next argument as its value", () => {
    const result = parseLaunchOptions(["--worktree", "/some/path", "--model", "claude"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.worktreeOverride).toBe("/some/path")
    expect(opts.passthroughArgs).toEqual(["--model", "claude"])
    expect(opts.passthroughArgs).not.toContain("--worktree")
    expect(opts.passthroughArgs).not.toContain("/some/path")
  })

  test("T-L06: --dev is parsed as a boolean flag", () => {
    const result = parseLaunchOptions(["--dev", "--verbose"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.devMode).toBe(true)
    expect(opts.passthroughArgs).toEqual(["--verbose"])
    expect(opts.passthroughArgs).not.toContain("--dev")
  })

  test("T-L07: first positional argument is captured as projectDir", () => {
    const result = parseLaunchOptions(["~/my-project", "--model", "claude"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.projectDir).toBe("~/my-project")
    expect(opts.passthroughArgs).toEqual(["--model", "claude"])
    expect(opts.passthroughArgs).not.toContain("~/my-project")
  })

  test("T-L08: all unrecognized flags pass through", () => {
    const input = ["--model", "claude", "--continue", "--agent", "test-designer"]
    const result = parseLaunchOptions(input)
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.worktreeOverride).toBeUndefined()
    expect(opts.devMode).toBe(false)
    expect(opts.projectDir).toBeUndefined()
    expect(opts.passthroughArgs).toEqual(input)
  })

  test("T-L09: --worktree without a value produces ParseError", () => {
    const result = parseLaunchOptions(["--worktree"])
    expect(isErr(result)).toBe(true)
    const error = (result as Err<ParseError>).error
    expect(error.tag).toBe("ParseError")
    expect(error.flag).toBe("--worktree")
  })

  test("T-L10: --worktree followed by another flag produces ParseError (DD-1)", () => {
    const result = parseLaunchOptions(["--worktree", "--dev"])
    expect(isErr(result)).toBe(true)
    const error = (result as Err<ParseError>).error
    expect(error.tag).toBe("ParseError")
    expect(error.flag).toBe("--worktree")
  })

  test("T-L11: empty argv produces valid defaults", () => {
    const result = parseLaunchOptions([])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.worktreeOverride).toBeUndefined()
    expect(opts.devMode).toBe(false)
    expect(opts.projectDir).toBeUndefined()
    expect(opts.passthroughArgs).toEqual([])
  })

  test("T-L12: combined flags -- --worktree, --dev, positional, and passthrough", () => {
    const result = parseLaunchOptions(["--worktree", "/wt", "--dev", "~/project", "--model", "claude"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.worktreeOverride).toBe("/wt")
    expect(opts.devMode).toBe(true)
    expect(opts.projectDir).toBe("~/project")
    expect(opts.passthroughArgs).toEqual(["--model", "claude"])
  })
})
