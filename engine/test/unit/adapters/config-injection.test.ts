import { describe, test, expect, beforeAll, afterAll } from "bun:test"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import type { Ok, Err } from "../../../src/shared/result"
import { isOk, isErr } from "../../../src/shared/result"
import type { LaunchEnvironment, ConfigInjectionInput } from "../../../src/shared/types"
import type { ConfigBuildError } from "../../../src/shared/errors"
import { buildLaunchEnv } from "../../../src/adapters/config-injection"
import { resolution, engineConfig } from "../helpers/fixtures"

let fixtureRoot: string
let pluginFilePath: string
let configDirPath: string

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "renkei-config-test-"))
  configDirPath = path.join(fixtureRoot, ".opencode")
  const pluginsDir = path.join(configDirPath, "plugins")
  await mkdir(pluginsDir, { recursive: true })
  pluginFilePath = path.join(pluginsDir, "renkei.ts")
  await writeFile(pluginFilePath, "export default async () => ({})")
})

afterAll(async () => {
  await rm(fixtureRoot, { recursive: true, force: true })
})

function validInput(overrides?: Partial<ConfigInjectionInput>): ConfigInjectionInput {
  return {
    resolution: resolution({ sourcePath: fixtureRoot }),
    engineConfig: engineConfig({
      pluginPath: pluginFilePath,
      configDirPath,
    }),
    worktreeOverride: undefined,
    ...overrides,
  }
}

describe("buildLaunchEnv", () => {
  test("T-C01: happy path produces valid JSON in OPENCODE_CONFIG_CONTENT", () => {
    const input = validInput({
      engineConfig: engineConfig({
        pluginPath: pluginFilePath,
        configDirPath,
        skillPaths: ["/home/user/renkei/dev/authoring/skills/a", "/home/user/renkei/dev/authoring/skills/b"],
        agentDefinitions: [{ name: "test-designer", filePath: "/home/user/agents/test-designer.md" }],
      }),
    })

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value

    const parsed = JSON.parse(env.OPENCODE_CONFIG_CONTENT)
    expect(parsed.skills).toBeDefined()
    expect(parsed.skills.paths).toBeArray()
    expect(parsed.skills.paths).toEqual([
      "/home/user/renkei/dev/authoring/skills/a",
      "/home/user/renkei/dev/authoring/skills/b",
    ])
  })

  test("T-C02: skill paths in output are absolute", () => {
    const input = validInput({
      engineConfig: engineConfig({
        pluginPath: pluginFilePath,
        configDirPath,
        skillPaths: ["/absolute/path/one", "/absolute/path/two"],
      }),
    })

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value

    const parsed = JSON.parse(env.OPENCODE_CONFIG_CONTENT)
    for (const p of parsed.skills.paths) {
      expect(p).toStartWith("/")
    }
  })

  test("T-C03: OPENCODE_CONFIG_DIR equals engineConfig.configDirPath", () => {
    const input = validInput()

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value
    expect(env.OPENCODE_CONFIG_DIR).toBe(configDirPath)
  })

  test("T-C04: empty skillPaths and agentDefinitions produces Ok with empty paths array", () => {
    const input = validInput({
      engineConfig: engineConfig({
        pluginPath: pluginFilePath,
        configDirPath,
        skillPaths: [],
        agentDefinitions: [],
      }),
    })

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value

    const parsed = JSON.parse(env.OPENCODE_CONFIG_CONTENT)
    expect(parsed.skills.paths).toEqual([])
  })

  test("T-C05: plugin file does not exist -> Err<ConfigBuildError>", () => {
    const input = validInput({
      engineConfig: engineConfig({
        pluginPath: "/tmp/nonexistent-plugin-renkei-test-99999.ts",
        configDirPath,
      }),
    })

    const result = buildLaunchEnv(input)
    expect(isErr(result)).toBe(true)
    const error = (result as Err<ConfigBuildError>).error
    expect(error.tag).toBe("ConfigBuildFailed")
    expect(error.reason.length).toBeGreaterThan(0)
  })

  test("T-C06: RENKEI_ENGINE_SOURCE equals resolution.sourcePath", () => {
    const input = validInput()

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value
    expect(env.RENKEI_ENGINE_SOURCE).toBe(fixtureRoot)
  })

  test("T-C07: RENKEI_SESSION_CAPABILITIES contains child policy JSON", () => {
    const input = validInput()

    const result = buildLaunchEnv(input)
    expect(isOk(result)).toBe(true)
    const env = (result as Ok<LaunchEnvironment>).value

    const parsed = JSON.parse(env.RENKEI_SESSION_CAPABILITIES) as {
      child?: {
        promptVisible?: boolean
        submissionMethod?: "sync" | "async"
        shellModeAllowed?: boolean
      }
    }

    expect(parsed.child).toBeDefined()
    expect(parsed.child?.promptVisible).toBe(true)
    expect(parsed.child?.submissionMethod).toBe("async")
    expect(parsed.child?.shellModeAllowed).toBe(false)
  })
})
