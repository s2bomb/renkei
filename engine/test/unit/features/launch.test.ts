import { describe, test, expect, afterEach } from "bun:test"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Ok, Err } from "../../../src/shared/result"
import { isOk, isErr } from "../../../src/shared/result"
import type { LaunchOptions, LaunchCommand, EngineConfig } from "../../../src/shared/types"
import type { ParseError, ConfigBuildError, LaunchError, LaunchSequenceError } from "../../../src/shared/errors"
import { parseLaunchOptions, buildLaunchCommand, resolveEngineConfig, launch } from "../../../src/features/launch"
import type { ExecFn } from "../../../src/features/launch"
import * as fixtures from "../helpers/fixtures"
import { createWorktreeFixture, createIsolatedDir } from "../helpers/fs-fixture"
import type { WorktreeFixtureResult } from "../helpers/fs-fixture"

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

  test("T-L06: unrecognized flags pass through without being consumed", () => {
    const result = parseLaunchOptions(["--dev", "--verbose"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.projectDir).toBeUndefined()
    expect(opts.passthroughArgs).toEqual(["--dev", "--verbose"])
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
    expect(opts.projectDir).toBeUndefined()
    expect(opts.passthroughArgs).toEqual([])
  })

  test("T-L12: combined flags -- --worktree, positional, and passthrough", () => {
    const result = parseLaunchOptions(["--worktree", "/wt", "~/project", "--model", "claude"])
    expect(isOk(result)).toBe(true)
    const opts = (result as Ok<LaunchOptions>).value
    expect(opts.worktreeOverride).toBe("/wt")
    expect(opts.projectDir).toBe("~/project")
    expect(opts.passthroughArgs).toEqual(["--model", "claude"])
  })
})

describe("buildLaunchCommand", () => {
  test("T-L13: produces bun run command with correct args and env", () => {
    const res = fixtures.resolution()
    const opts = fixtures.launchOptions({
      projectDir: "~/project",
      passthroughArgs: ["--model", "claude"],
    })
    const env = fixtures.launchEnvironment()

    const cmd = buildLaunchCommand(res, opts, env)

    expect(cmd.command).toBe("bun")
    // args must start with ["run", "--cwd", ...] and include key tokens
    expect(cmd.args[0]).toBe("run")
    expect(cmd.args[1]).toBe("--cwd")
    // --cwd value should reference platformPath's opencode package
    const cwdArg = cmd.args[2] as string
    expect(cwdArg).toContain(res.platformPath)
    expect(cwdArg).toContain("opencode/packages/opencode")
    expect(cmd.args).toContain("--conditions=browser")
    expect(cmd.args).toContain("src/index.ts")
    // projectDir and passthrough in order after the fixed prefix
    const projectIdx = cmd.args.indexOf("~/project")
    const modelIdx = cmd.args.indexOf("--model")
    const claudeIdx = cmd.args.indexOf("claude")
    expect(projectIdx).toBeGreaterThan(-1)
    expect(modelIdx).toBeGreaterThan(projectIdx)
    expect(claudeIdx).toBeGreaterThan(modelIdx)
    // env must contain the LaunchEnvironment values
    expect(cmd.env.OPENCODE_CONFIG_CONTENT).toBe(env.OPENCODE_CONFIG_CONTENT)
    expect(cmd.env.OPENCODE_CONFIG_DIR).toBe(env.OPENCODE_CONFIG_DIR)
    expect(cmd.env.RENKEI_ENGINE_SOURCE).toBe(env.RENKEI_ENGINE_SOURCE)
    expect(cmd.env.RENKEI_SESSION_CAPABILITIES).toBe(env.RENKEI_SESSION_CAPABILITIES)
  })
})

describe("resolveEngineConfig", () => {
  let fixtureCleanup: (() => Promise<void>) | undefined

  afterEach(async () => {
    if (fixtureCleanup) {
      await fixtureCleanup()
      fixtureCleanup = undefined
    }
  })

  test("T-EC01: valid worktree with plugin file returns Ok with correct paths", async () => {
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    fixtureCleanup = fixture.cleanup

    // Create .opencode/plugins/renkei.ts inside the worktree
    const opencodePath = path.join(fixture.worktree!, "engine", ".opencode")
    const pluginsPath = path.join(opencodePath, "plugins")
    await mkdir(pluginsPath, { recursive: true })
    await writeFile(path.join(pluginsPath, "renkei.ts"), "export default async () => ({})")

    const resolution = fixtures.resolution({
      sourcePath: fixture.worktree!,
      enginePath: path.join(fixture.worktree!, "engine"),
      platformPath: path.join(fixture.worktree!, "platform"),
      authoringPath: path.join(fixture.worktree!, "authoring"),
      bareRepoPath: fixture.bareRepo,
    })

    const result = await resolveEngineConfig(resolution)
    expect(isOk(result)).toBe(true)
    const config = (result as Ok<EngineConfig>).value
    expect(config.pluginPath).toBe(path.join(pluginsPath, "renkei.ts"))
    expect(config.configDirPath).toBe(opencodePath)
  })

  test("T-EC02: missing plugin file returns Err<ConfigBuildError>", async () => {
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    fixtureCleanup = fixture.cleanup

    // Create .opencode dir but NO plugins/renkei.ts
    const opencodePath = path.join(fixture.worktree!, "engine", ".opencode")
    await mkdir(opencodePath, { recursive: true })

    const resolution = fixtures.resolution({
      sourcePath: fixture.worktree!,
      enginePath: path.join(fixture.worktree!, "engine"),
      platformPath: path.join(fixture.worktree!, "platform"),
      authoringPath: path.join(fixture.worktree!, "authoring"),
      bareRepoPath: fixture.bareRepo,
    })

    const result = await resolveEngineConfig(resolution)
    expect(isErr(result)).toBe(true)
    const error = (result as Err<ConfigBuildError>).error
    expect(error.tag).toBe("ConfigBuildFailed")
    expect(error.reason).toBeTruthy()
  })

  test("T-EC03: missing authoring dir returns Ok with empty skillPaths", async () => {
    // hasAuthoring: false -- no authoring/ directory
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true, hasAuthoring: false })
    fixtureCleanup = fixture.cleanup

    // Create .opencode/plugins/renkei.ts
    const opencodePath = path.join(fixture.worktree!, "engine", ".opencode")
    const pluginsPath = path.join(opencodePath, "plugins")
    await mkdir(pluginsPath, { recursive: true })
    await writeFile(path.join(pluginsPath, "renkei.ts"), "export default async () => ({})")

    const resolution = fixtures.resolution({
      sourcePath: fixture.worktree!,
      enginePath: path.join(fixture.worktree!, "engine"),
      platformPath: path.join(fixture.worktree!, "platform"),
      authoringPath: path.join(fixture.worktree!, "authoring"),
      bareRepoPath: fixture.bareRepo,
    })

    const result = await resolveEngineConfig(resolution)
    expect(isOk(result)).toBe(true)
    const config = (result as Ok<EngineConfig>).value
    expect(config.skillPaths).toEqual([])
  })
})

describe("launch", () => {
  let fixtureCleanup: (() => Promise<void>) | undefined

  afterEach(async () => {
    if (fixtureCleanup) {
      await fixtureCleanup()
      fixtureCleanup = undefined
    }
  })

  test("T-L01: pipeline propagates worktree resolution error", async () => {
    // Use an isolated dir with no bare repo -- resolveWorktree should fail
    const isolated = await createIsolatedDir()
    fixtureCleanup = isolated.cleanup

    const opts = fixtures.launchOptions()
    const result = await launch(opts, isolated.path)

    expect(isErr(result)).toBe(true)
    const error = (result as Err<LaunchSequenceError>).error
    // Should be a WorktreeError tag (BareRepoNotFound, WorktreeNotFound, or MissingDirectory)
    expect(["BareRepoNotFound", "WorktreeNotFound", "MissingDirectory"]).toContain(error.tag)
  })

  test("T-L02: pipeline propagates config build error", async () => {
    // Create a valid worktree structure but WITHOUT .opencode/plugins/renkei.ts
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    fixtureCleanup = fixture.cleanup

    // Create .opencode dir but no plugin file
    const opencodePath = path.join(fixture.worktree!, "engine", ".opencode")
    await mkdir(opencodePath, { recursive: true })

    const opts = fixtures.launchOptions({ worktreeOverride: fixture.worktree! })
    const result = await launch(opts, fixture.scriptDir)

    expect(isErr(result)).toBe(true)
    const error = (result as Err<ConfigBuildError>).error
    expect(error.tag).toBe("ConfigBuildFailed")
  })

  test("T-L03: non-zero exit code returns Err<LaunchError> with exitCode", async () => {
    // Create complete fixture so pipeline reaches exec step
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    fixtureCleanup = fixture.cleanup

    // Create .opencode/plugins/renkei.ts
    const pluginsPath = path.join(fixture.worktree!, "engine", ".opencode", "plugins")
    await mkdir(pluginsPath, { recursive: true })
    await writeFile(path.join(pluginsPath, "renkei.ts"), "export default async () => ({})")

    const opts = fixtures.launchOptions({ worktreeOverride: fixture.worktree! })
    const fakeExec: ExecFn = async () => ({ exitCode: 42 })
    const result = await launch(opts, fixture.scriptDir, fakeExec)

    expect(isErr(result)).toBe(true)
    const error = (result as Err<LaunchError>).error
    expect(error.tag).toBe("LaunchFailed")
    expect(error.exitCode).toBe(42)
  })

  test("T-L04: spawn failure returns Err<LaunchError> with exitCode null", async () => {
    // Create complete fixture so pipeline reaches exec step
    const fixture = await createWorktreeFixture({ hasEngine: true, hasPlatform: true })
    fixtureCleanup = fixture.cleanup

    // Create .opencode/plugins/renkei.ts
    const pluginsPath = path.join(fixture.worktree!, "engine", ".opencode", "plugins")
    await mkdir(pluginsPath, { recursive: true })
    await writeFile(path.join(pluginsPath, "renkei.ts"), "export default async () => ({})")

    const opts = fixtures.launchOptions({ worktreeOverride: fixture.worktree! })
    const fakeExec: ExecFn = async () => ({ exitCode: null })
    const result = await launch(opts, fixture.scriptDir, fakeExec)

    expect(isErr(result)).toBe(true)
    const error = (result as Err<LaunchError>).error
    expect(error.tag).toBe("LaunchFailed")
    expect(error.exitCode).toBeNull()
  })
})
