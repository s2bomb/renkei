import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import {
  STARTUP_ERROR_CODES,
  makeStartupError,
  makeStartupFailureResult,
  makeStartupSuccess,
  makeStartupSuccessResult,
  makeStartupWarning,
} from "../helpers/contracts"
import { loadRenkeiDevModule } from "../helpers/module-loader"

type ConsoleFn = (...args: unknown[]) => void

function keysOf(value: Record<string, unknown>): ReadonlyArray<string> {
  return Object.keys(value).sort()
}

function containsSubstring(lines: ReadonlyArray<string>, needle: string): boolean {
  return lines.some((line) => line.includes(needle))
}

function parseLastJson(lines: ReadonlyArray<string>): Record<string, unknown> {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const candidate = lines[index]
    try {
      return JSON.parse(candidate) as Record<string, unknown>
    } catch {
      continue
    }
  }
  throw new Error("No parseable JSON output found")
}

describe("unit renkei-dev contracts", () => {
  const originalLog = console.log
  const originalError = console.error
  const originalServerUrlEnv = process.env.OPENCODE_SERVER_URL

  let stdout: string[] = []
  let stderr: string[] = []

  beforeEach(() => {
    stdout = []
    stderr = []
    process.env.OPENCODE_SERVER_URL = undefined

    console.log = ((...args: unknown[]) => {
      stdout.push(args.map((value) => String(value)).join(" "))
    }) as ConsoleFn

    console.error = ((...args: unknown[]) => {
      stderr.push(args.map((value) => String(value)).join(" "))
    }) as ConsoleFn
  })

  afterEach(() => {
    console.log = originalLog
    console.error = originalError
    process.env.OPENCODE_SERVER_URL = originalServerUrlEnv
  })

  test("T-01 args.serverUrl overrides env and startup runs exactly once", async () => {
    const runtime = await loadRenkeiDevModule()
    const calls: Array<{ serverUrl: string }> = []
    process.env.OPENCODE_SERVER_URL = "http://127.0.0.1:4100"

    const exitCode = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "http://127.0.0.1:4099",
      },
      {
        startHarnessRuntime: async (input: { serverUrl: string }) => {
          calls.push({ serverUrl: input.serverUrl })
          return makeStartupSuccessResult({ serverUrl: input.serverUrl })
        },
      },
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].serverUrl).toBe("http://127.0.0.1:4099")
    expect(exitCode).toBe(0)
  })

  test("T-02 env fallback uses OPENCODE_SERVER_URL when arg is absent", async () => {
    const runtime = await loadRenkeiDevModule()
    const calls: Array<{ serverUrl: string }> = []
    process.env.OPENCODE_SERVER_URL = "http://127.0.0.1:4200"

    const exitCode = await runtime.runRenkeiDevCommand(
      {},
      {
        startHarnessRuntime: async (input: { serverUrl: string }) => {
          calls.push({ serverUrl: input.serverUrl })
          return makeStartupSuccessResult({ serverUrl: input.serverUrl })
        },
      },
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].serverUrl).toBe("http://127.0.0.1:4200")
    expect(exitCode).toBe(0)
  })

  test("T-03 missing URL fails typed before startup orchestration", async () => {
    const runtime = await loadRenkeiDevModule()
    let startupCalls = 0

    const exitCode = await runtime.runRenkeiDevCommand(
      {},
      {
        startHarnessRuntime: async () => {
          startupCalls += 1
          return makeStartupSuccessResult()
        },
      },
    )

    expect(exitCode).toBe(1)
    expect(startupCalls).toBe(0)
    expect(containsSubstring([...stdout, ...stderr], "STARTUP_SERVER_URL_MISSING")).toBe(true)
  })

  test("T-04 invalid URL fails typed before startup orchestration", async () => {
    const runtime = await loadRenkeiDevModule()
    let startupCalls = 0

    const exitCode = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "::::invalid::::",
      },
      {
        startHarnessRuntime: async () => {
          startupCalls += 1
          return makeStartupSuccessResult()
        },
      },
    )

    expect(exitCode).toBe(1)
    expect(startupCalls).toBe(0)
    expect(containsSubstring([...stdout, ...stderr], "STARTUP_SERVER_URL_INVALID")).toBe(true)
    expect(containsSubstring([...stdout, ...stderr], "::::invalid::::")).toBe(true)
  })

  test("T-05 json mode emits required report shape with defaults metadata", async () => {
    const runtime = await loadRenkeiDevModule()

    const successExit = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "http://127.0.0.1:4099",
        json: true,
      },
      {
        startHarnessRuntime: async () => makeStartupSuccessResult(),
      },
    )

    const successReport = parseLastJson(stdout)
    expect(successExit).toBe(0)
    expect(keysOf(successReport)).toEqual(["defaults", "exitCode", "ok", "startup", "timestampMs"])
    expect(successReport.ok).toBe(true)
    expect(successReport.exitCode).toBe(0)

    const successDefaults = successReport.defaults as Record<string, unknown>
    expect(typeof successDefaults.timeoutMs).toBe("number")
    expect(typeof successDefaults.healthPath).toBe("string")
    expect(typeof successDefaults.source).toBe("object")
    if (typeof successDefaults.source === "object" && successDefaults.source) {
      const source = successDefaults.source as Record<string, unknown>
      expect(["arg", "env", "missing"].includes(String(source.serverUrl))).toBe(true)
      expect(["arg", "default"].includes(String(source.timeoutMs))).toBe(true)
      expect(["arg", "default"].includes(String(source.healthPath))).toBe(true)
    }

    stdout = []
    stderr = []

    const failureExit = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "http://127.0.0.1:4099",
        json: true,
      },
      {
        startHarnessRuntime: async () => makeStartupFailureResult("HOST_HEALTH_TIMEOUT"),
      },
    )

    const failureReport = parseLastJson(stdout)
    expect(failureExit).toBe(1)
    expect(keysOf(failureReport)).toEqual(["defaults", "error", "exitCode", "ok", "timestampMs"])
    expect(failureReport.ok).toBe(false)
    expect(failureReport.exitCode).toBe(1)
  })

  test("T-06 expected startup failures resolve with exit code 1 and do not throw", async () => {
    const runtime = await loadRenkeiDevModule()

    const exitCode = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "http://127.0.0.1:4099",
      },
      {
        startHarnessRuntime: async () => makeStartupFailureResult("PROBE_FAILED"),
      },
    )

    expect(exitCode).toBe(1)
  })

  test("T-20 failure paths emit only declared StartupError.code values", async () => {
    const runtime = await loadRenkeiDevModule()
    const allowed = new Set<string>(STARTUP_ERROR_CODES)

    const scenarios: ReadonlyArray<{
      readonly args: { readonly serverUrl?: string; readonly json?: boolean }
      readonly envServerUrl?: string
      readonly startupResult?: { readonly ok: false; readonly error: ReturnType<typeof makeStartupError> }
      readonly expectedCode?: string
    }> = [
      {
        args: { json: true },
        expectedCode: "STARTUP_SERVER_URL_MISSING",
      },
      {
        args: { serverUrl: "not-a-url", json: true },
        expectedCode: "STARTUP_SERVER_URL_INVALID",
      },
      {
        args: { serverUrl: "http://127.0.0.1:4099", json: true },
        startupResult: makeStartupFailureResult("HOST_HEALTH_TIMEOUT"),
      },
      {
        args: { serverUrl: "http://127.0.0.1:4099", json: true },
        startupResult: makeStartupFailureResult("HOST_HEALTH_UNREACHABLE"),
      },
      {
        args: { serverUrl: "http://127.0.0.1:4099", json: true },
        startupResult: makeStartupFailureResult("HOST_HEALTH_INVALID"),
      },
      {
        args: { serverUrl: "http://127.0.0.1:4099", json: true },
        startupResult: makeStartupFailureResult("PROBE_FAILED"),
      },
      {
        args: { serverUrl: "http://127.0.0.1:4099", json: true },
        startupResult: makeStartupFailureResult("SDK_BOOTSTRAP_FAILED"),
      },
    ]

    for (const scenario of scenarios) {
      stdout = []
      stderr = []
      process.env.OPENCODE_SERVER_URL = scenario.envServerUrl

      await runtime.runRenkeiDevCommand(scenario.args, {
        startHarnessRuntime: async () => scenario.startupResult ?? makeStartupSuccessResult(),
      })

      const report = parseLastJson([...stdout, ...stderr])
      const code =
        scenario.expectedCode ??
        String((report.error as Record<string, unknown> | undefined)?.code ?? "missing-error-code")

      expect(allowed.has(code)).toBe(true)
    }
  })

  test("T-21 warning ownership path preserves probe-derived mode", async () => {
    const runtime = await loadRenkeiDevModule()
    const warning = makeStartupWarning("FORK_URL_MISMATCH")
    let startupInputWarningCode = ""

    const exitCode = await runtime.runRenkeiDevCommand(
      {
        serverUrl: "http://127.0.0.1:4099",
        json: true,
      },
      {
        selectStartupMode: () => ({
          mode: "composition-only",
          warning,
        }),
        startHarnessRuntime: async (input: {
          warning?: { code: "FORK_URL_MISMATCH" | "FORK_URL_INVALID"; message: string }
        }) => {
          startupInputWarningCode = input.warning?.code ?? ""
          return {
            ok: true,
            value: makeStartupSuccess({
              mode: "fork-available",
              warnings: input.warning ? [input.warning] : [],
            }),
          }
        },
      },
    )

    const report = parseLastJson(stdout)
    expect(exitCode).toBe(0)
    expect(startupInputWarningCode).toBe("FORK_URL_MISMATCH")
    expect(((report.startup as Record<string, unknown>).mode as string) === "fork-available").toBe(true)

    const warnings = (report.startup as Record<string, unknown>).warnings as ReadonlyArray<Record<string, unknown>>
    expect(Array.isArray(warnings)).toBe(true)
    expect(warnings[0].code).toBe("FORK_URL_MISMATCH")
  })
})
