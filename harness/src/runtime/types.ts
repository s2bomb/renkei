export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }

export type SessionID = string

export type ForkCapabilityID =
  | "session-name"
  | "active-child-query"
  | "background-launch"
  | "message-provenance"
  | "prompt-wrapper"

export type CompositionSurfaceID = "tool-registry" | "plugin-hooks" | "skill-load" | "sdk-client"

export type CompositionSurface = {
  readonly id: CompositionSurfaceID
  readonly available: true
}

export type ForkCapability = {
  readonly id: ForkCapabilityID
  readonly available: boolean
  readonly gatingChange: string
}

export type CapabilityReport = {
  readonly serverUrl: string
  readonly mode: "composition-only" | "fork-available"
  readonly composition: ReadonlyArray<CompositionSurface>
  readonly fork: ReadonlyArray<ForkCapability>
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

export type StartupWarningCode = "FORK_URL_MISMATCH" | "FORK_URL_INVALID"

export type StartupWarning = {
  readonly code: StartupWarningCode
  readonly message: string
}

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
  readonly mode: CapabilityReport["mode"]
  readonly report: CapabilityReport
  readonly readiness: HostReadiness
  readonly warnings: ReadonlyArray<StartupWarning>
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

export type ForkThreshold = {
  readonly capability: ForkCapabilityID
  readonly condition: string
  readonly schemaEvidence: string
  readonly runtimeEvidence: string
  readonly diffPreview: string
}

export type ForkDecision =
  | { readonly mode: "compose"; readonly capability: ForkCapabilityID }
  | { readonly mode: "fork-required"; readonly capability: ForkCapabilityID; readonly threshold: ForkThreshold }

export type ForkBoundaryReport = {
  readonly composable: ReadonlyArray<ForkDecision & { readonly mode: "compose" }>
  readonly forkRequired: ReadonlyArray<ForkDecision & { readonly mode: "fork-required" }>
}

export type ForkThresholdError = {
  readonly code: "FORK_CAPABILITY_UNAVAILABLE"
  readonly capability: ForkCapabilityID
  readonly threshold: ForkThreshold
}

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
  readonly teammate: {
    sendMessage(input: { readonly targetSessionID: SessionID } & SessionMessage): Promise<void>
    listMessages(sessionID: SessionID): Promise<ReadonlyArray<SessionMessage>>
  }
}

export type CompositionError =
  | { readonly code: "DUPLICATE_TOOL_ID"; readonly id: string }
  | { readonly code: "INVALID_PLUGIN_DEFINITION"; readonly name: string; readonly message: string }
  | { readonly code: "SKILL_PARSE_FAILED"; readonly path: string; readonly message: string }
  | { readonly code: "SDK_CONNECTION_FAILED"; readonly serverUrl: string; readonly cause: string }

export type TeammateSession = SessionInfo & { readonly parentID: SessionID }

export type CreateTeammateSessionInput = {
  readonly parentSessionID: SessionID
  readonly agentType: string
  readonly title?: string
  readonly name?: string
}

export type ListTeammateSessionsInput = {
  readonly parentSessionID: SessionID
  readonly active?: boolean
}

export type TeammateSessionError =
  | { readonly code: "SESSION_NOT_FOUND"; readonly sessionID: SessionID }
  | { readonly code: "PARENT_SESSION_NOT_FOUND"; readonly parentSessionID: SessionID }
  | {
      readonly code: "FORK_CAPABILITY_REQUIRED"
      readonly capability: ForkCapabilityID
      readonly threshold: ForkThreshold
    }
  | { readonly code: "SESSION_CREATE_FAILED"; readonly message: string }

export type TeammateStatus =
  | { readonly status: "running"; readonly sessionID: SessionID; readonly name: string }
  | { readonly status: "completed"; readonly sessionID: SessionID; readonly name: string; readonly result: string }
  | { readonly status: "errored"; readonly sessionID: SessionID; readonly name: string; readonly error: string }
  | { readonly status: "stopped"; readonly sessionID: SessionID; readonly name: string }

export type LaunchTeammateInput = {
  readonly name: string
  readonly agentType: string
  readonly description: string
  readonly prompt: string
  readonly parentSessionID: SessionID
}

export type SendMessageInput = {
  readonly targetSessionID: SessionID
  readonly fromSessionID: SessionID
  readonly content: string
  readonly sourceName?: string
}

export type AsyncLifecycleError =
  | {
      readonly code: "FORK_CAPABILITY_REQUIRED"
      readonly capability: ForkCapabilityID
      readonly threshold: ForkThreshold
    }
  | { readonly code: "TEAMMATE_NOT_FOUND"; readonly name: string; readonly sessionID?: SessionID }
  | { readonly code: "TEAMMATE_ALREADY_STOPPED"; readonly sessionID: SessionID }
  | { readonly code: "MESSAGE_DELIVERY_FAILED"; readonly targetSessionID: SessionID; readonly cause: string }
  | { readonly code: "LAUNCH_FAILED"; readonly name: string; readonly cause: string }

export type MessageSource = "human" | "parent" | "child"

export type ProvenanceMetadata = {
  readonly source: MessageSource
  readonly sourceSessionID?: SessionID
  readonly sourceName?: string
}

export type PromptWrapperInput =
  | {
      readonly role: "parent"
      readonly name: string
      readonly content: string
    }
  | {
      readonly role: "child"
      readonly name: string
      readonly content: string
      readonly sessionID: SessionID
    }

export type ProvenanceError =
  | {
      readonly code: "FORK_CAPABILITY_REQUIRED"
      readonly capability: "message-provenance" | "prompt-wrapper"
      readonly threshold: ForkThreshold
    }
  | { readonly code: "INVALID_SOURCE"; readonly source: string }
  | { readonly code: "MESSAGE_NOT_FOUND"; readonly messageID: string }
  | { readonly code: "TAG_FAILED"; readonly messageID: string; readonly cause: string }

export const COMPOSITION_SURFACE_IDS: ReadonlyArray<CompositionSurfaceID> = [
  "tool-registry",
  "plugin-hooks",
  "skill-load",
  "sdk-client",
]

export const FORK_CAPABILITY_IDS: ReadonlyArray<ForkCapabilityID> = [
  "session-name",
  "active-child-query",
  "background-launch",
  "message-provenance",
  "prompt-wrapper",
]
