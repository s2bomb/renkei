import { selectStartupMode } from "./mode-selector"
import {
  startHarnessRuntime,
  type Clock,
  type RenkeiDevDependencies as RuntimeDependencies,
} from "./startup-orchestrator"
import type { StartupError, StartupResult, StartupSuccess, StartupWarning, StartupWarningCode } from "./types"

const DEFAULT_TIMEOUT_MS = 1500
const DEFAULT_HEALTH_PATH = "/global/health"

type ServerUrlSource = "arg" | "env" | "missing"
type DefaultSource = "arg" | "default"

export type RenkeiDevArgs = {
  readonly serverUrl?: string
  readonly timeoutMs?: number
  readonly healthPath?: string
  readonly json?: boolean
}

export type StartupJsonSuccessReport = {
  readonly ok: true
  readonly exitCode: 0
  readonly timestampMs: number
  readonly defaults: {
    readonly timeoutMs: number
    readonly healthPath: string
    readonly source: {
      readonly serverUrl: "arg" | "env"
      readonly timeoutMs: DefaultSource
      readonly healthPath: DefaultSource
    }
  }
  readonly startup: StartupSuccess
}

export type StartupJsonFailureReport = {
  readonly ok: false
  readonly exitCode: 1
  readonly timestampMs: number
  readonly defaults: {
    readonly timeoutMs: number
    readonly healthPath: string
    readonly source: {
      readonly serverUrl: ServerUrlSource
      readonly timeoutMs: DefaultSource
      readonly healthPath: DefaultSource
    }
  }
  readonly error: StartupError
}

export type StartupJsonReport = StartupJsonSuccessReport | StartupJsonFailureReport

export type RenkeiDevDependencies = {
  readonly selectStartupMode: typeof selectStartupMode
  readonly startHarnessRuntime: typeof startHarnessRuntime
  readonly clock: Clock
}

type ResolvedInput = {
  readonly serverUrl?: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly source: {
    readonly serverUrl: ServerUrlSource
    readonly timeoutMs: DefaultSource
    readonly healthPath: DefaultSource
  }
}

const DEFAULT_CLOCK: Clock = {
  nowMs: () => Date.now(),
}

function toWarningMessage(code: StartupWarningCode): string {
  if (code === "FORK_URL_INVALID") {
    return "Fork server URL is invalid; continuing in composition-only mode"
  }
  return "Fork server URL does not match serverUrl; continuing in composition-only mode"
}

function normalizeWarning(warning: unknown): StartupWarning | undefined {
  if (!warning) {
    return undefined
  }

  if (typeof warning === "string") {
    if (warning === "FORK_URL_INVALID" || warning === "FORK_URL_MISMATCH") {
      return {
        code: warning,
        message: toWarningMessage(warning),
      }
    }
    return undefined
  }

  if (typeof warning === "object") {
    const candidate = warning as { code?: unknown; message?: unknown }
    if (
      (candidate.code === "FORK_URL_INVALID" || candidate.code === "FORK_URL_MISMATCH") &&
      typeof candidate.message === "string"
    ) {
      return {
        code: candidate.code,
        message: candidate.message,
      }
    }
  }

  return undefined
}

function resolveInput(args: RenkeiDevArgs): ResolvedInput {
  const source: ServerUrlSource = args.serverUrl ? "arg" : process.env.OPENCODE_SERVER_URL ? "env" : "missing"

  return {
    serverUrl: args.serverUrl ?? process.env.OPENCODE_SERVER_URL,
    timeoutMs: args.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    healthPath: args.healthPath ?? DEFAULT_HEALTH_PATH,
    source: {
      serverUrl: source,
      timeoutMs: args.timeoutMs === undefined ? "default" : "arg",
      healthPath: args.healthPath === undefined ? "default" : "arg",
    },
  }
}

function makeMissingError(): StartupError {
  return { code: "STARTUP_SERVER_URL_MISSING" }
}

function validateServerUrl(serverUrl: string): StartupError | null {
  try {
    void new URL(serverUrl)
    return null
  } catch (error) {
    return {
      code: "STARTUP_SERVER_URL_INVALID",
      value: serverUrl,
      cause: String(error),
    }
  }
}

function toJsonReport(timestampMs: number, input: ResolvedInput, result: StartupResult): StartupJsonReport {
  if (result.ok) {
    return {
      ok: true,
      exitCode: 0,
      timestampMs,
      defaults: {
        timeoutMs: input.timeoutMs,
        healthPath: input.healthPath,
        source: {
          serverUrl: input.source.serverUrl === "missing" ? "env" : input.source.serverUrl,
          timeoutMs: input.source.timeoutMs,
          healthPath: input.source.healthPath,
        },
      },
      startup: result.value,
    }
  }

  return {
    ok: false,
    exitCode: 1,
    timestampMs,
    defaults: {
      timeoutMs: input.timeoutMs,
      healthPath: input.healthPath,
      source: input.source,
    },
    error: result.error,
  }
}

function renderHumanReadable(result: StartupResult): void {
  if (result.ok) {
    console.log(`renkei-dev startup ok mode=${result.value.mode} serverUrl=${result.value.serverUrl}`)
    return
  }
  const detail = "value" in result.error ? ` value=${result.error.value}` : ""
  console.error(`renkei-dev startup failed code=${result.error.code}${detail}`)
}

export async function runRenkeiDevCommand(args: RenkeiDevArgs, deps?: Partial<RenkeiDevDependencies>): Promise<number> {
  const runtimeDeps: RenkeiDevDependencies = {
    selectStartupMode,
    startHarnessRuntime,
    clock: DEFAULT_CLOCK,
    ...deps,
  }

  const input = resolveInput(args)
  const timestampMs = runtimeDeps.clock.nowMs()

  if (!input.serverUrl) {
    const result: StartupResult = { ok: false, error: makeMissingError() }
    if (args.json) {
      console.log(JSON.stringify(toJsonReport(timestampMs, input, result)))
    } else {
      renderHumanReadable(result)
    }
    return 1
  }

  const invalidUrlError = validateServerUrl(input.serverUrl)
  if (invalidUrlError) {
    const result: StartupResult = { ok: false, error: invalidUrlError }
    if (args.json) {
      console.log(JSON.stringify(toJsonReport(timestampMs, input, result)))
    } else {
      renderHumanReadable(result)
    }
    return 1
  }

  const selection = runtimeDeps.selectStartupMode({
    serverUrl: input.serverUrl,
    forkServerUrl: process.env.OPENCODE_FORK_SERVER_URL,
  })
  const warning = normalizeWarning(selection.warning)

  const runtimeResult = await runtimeDeps.startHarnessRuntime(
    {
      serverUrl: input.serverUrl,
      cwd: process.cwd(),
      timeoutMs: input.timeoutMs,
      healthPath: input.healthPath,
      warning,
    },
    deps as Partial<RuntimeDependencies> | undefined,
  )

  if (args.json) {
    console.log(JSON.stringify(toJsonReport(timestampMs, input, runtimeResult)))
  } else {
    renderHumanReadable(runtimeResult)
  }

  return runtimeResult.ok ? 0 : 1
}

export function parseRenkeiDevArgs(argv: ReadonlyArray<string>): RenkeiDevArgs {
  const parsed: {
    serverUrl?: string
    timeoutMs?: number
    healthPath?: string
    json?: boolean
  } = {}

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--json") {
      parsed.json = true
      continue
    }
    if (argument.startsWith("--server-url=")) {
      parsed.serverUrl = argument.slice("--server-url=".length)
      continue
    }
    if (argument === "--server-url") {
      parsed.serverUrl = argv[index + 1]
      index += 1
      continue
    }
    if (argument.startsWith("--timeout-ms=")) {
      const value = Number(argument.slice("--timeout-ms=".length))
      if (Number.isFinite(value)) {
        parsed.timeoutMs = value
      }
      continue
    }
    if (argument === "--timeout-ms") {
      const value = Number(argv[index + 1])
      if (Number.isFinite(value)) {
        parsed.timeoutMs = value
      }
      index += 1
      continue
    }
    if (argument.startsWith("--health-path=")) {
      parsed.healthPath = argument.slice("--health-path=".length)
      continue
    }
    if (argument === "--health-path") {
      parsed.healthPath = argv[index + 1]
      index += 1
      continue
    }
  }

  return parsed
}
