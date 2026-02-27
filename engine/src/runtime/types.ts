export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }

export type SessionID = string

export type CompositionSurfaceID = "tool-registry" | "plugin-hooks" | "skill-load" | "sdk-client"

export type CompositionSurface = {
  readonly id: CompositionSurfaceID
  readonly available: true
}

export type CapabilityReport = {
  readonly serverUrl: string
  readonly composition: ReadonlyArray<CompositionSurface>
  readonly probedAt: number
}

export type ProbeError =
  | { readonly code: "OPENCODE_UNREACHABLE"; readonly serverUrl: string; readonly cause: string }
  | {
      readonly code: "MISSING_REQUIRED_SURFACE"
      readonly surface: CompositionSurfaceID
      readonly message: string
    }

export type StartupStage = "readiness" | "probe" | "sdk"

export type HostReadinessInput = {
  readonly serverUrl: string
  readonly healthPath: string
  readonly timeoutMs: number
}

export type HostHealthPayload = {
  readonly healthy: boolean
  readonly version?: string
}

export type HostReadiness = {
  readonly checkedUrl: string
  readonly healthUrl: string
  readonly healthy: true
  readonly respondedAt: number
  readonly version?: string
}

export type StartupSuccess = {
  readonly serverUrl: string
  readonly report: CapabilityReport
  readonly readiness: HostReadiness
  readonly timingsMs: {
    readonly total: number
    readonly readiness: number
    readonly probe: number
    readonly sdk: number
  }
}

export type StartupError =
  | { readonly code: "STARTUP_SERVER_URL_MISSING" }
  | { readonly code: "STARTUP_SERVER_URL_INVALID"; readonly value: string; readonly cause: string }
  | { readonly code: "HOST_HEALTH_TIMEOUT"; readonly healthUrl: string; readonly timeoutMs: number }
  | { readonly code: "HOST_HEALTH_UNREACHABLE"; readonly healthUrl: string; readonly cause: string }
  | { readonly code: "HOST_HEALTH_INVALID"; readonly healthUrl: string; readonly detail: string }
  | { readonly code: "PROBE_FAILED"; readonly error: ProbeError }
  | { readonly code: "SDK_BOOTSTRAP_FAILED"; readonly error: CompositionError }

export type StartupResult = Result<StartupSuccess, StartupError>

export type ToolContext = {
  readonly sessionID: SessionID
  readonly messageID: string
  readonly agent: string
  readonly abort: AbortSignal
  readonly callID?: string
}

export type ToolResult = {
  readonly title: string
  readonly output: string
  readonly metadata?: Record<string, unknown>
}

export type ComposedToolDef = {
  readonly id: string
  readonly description: string
  readonly parameters: unknown
  readonly execute: (args: unknown, ctx: ToolContext) => Promise<ToolResult>
}

export type PluginHookHandlers = {
  readonly [key: string]: ((input: unknown, output?: unknown) => void | Promise<void>) | undefined
}

export type HarnessPluginDef = {
  readonly name?: string
  readonly tools?: Record<string, ComposedToolDef>
  readonly hooks?: PluginHookHandlers
}

export type LoadedSkill = {
  readonly name: string
  readonly description: string
  readonly location: string
  readonly content: string
}

export type SessionInfo = {
  readonly id: SessionID
  readonly slug: string
  readonly title: string
  readonly parentID?: SessionID
  readonly name?: string
  readonly time: {
    readonly created: number
    readonly updated: number
    readonly archived?: number
  }
}

export type SessionCreateInput = {
  readonly parentID?: SessionID
  readonly title?: string
  readonly name?: string
}

export type SessionMessage = {
  readonly fromSessionID: SessionID
  readonly content: string
  readonly sourceName?: string
}

export type OpencodeSDKClient = {
  readonly session: {
    create(input: SessionCreateInput): Promise<{ readonly id: SessionID; readonly slug: string }>
    get(sessionID: SessionID): Promise<SessionInfo | null>
    list(): Promise<ReadonlyArray<SessionInfo>>
    children(parentSessionID: SessionID, active?: boolean): Promise<ReadonlyArray<SessionInfo>>
    prompt(sessionID: SessionID, message: string): Promise<void>
  }
}

export type CompositionError =
  | { readonly code: "DUPLICATE_TOOL_ID"; readonly id: string }
  | { readonly code: "INVALID_PLUGIN_DEFINITION"; readonly name: string; readonly message: string }
  | { readonly code: "SKILL_PARSE_FAILED"; readonly path: string; readonly message: string }
  | { readonly code: "SDK_CONNECTION_FAILED"; readonly serverUrl: string; readonly cause: string }

export const COMPOSITION_SURFACE_IDS: ReadonlyArray<CompositionSurfaceID> = [
  "tool-registry",
  "plugin-hooks",
  "skill-load",
  "sdk-client",
]
