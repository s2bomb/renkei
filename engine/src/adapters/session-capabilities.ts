/**
 * Session capabilities adapter -- anti-corruption layer for the Level 3
 * session capabilities seam.
 *
 * The contract crosses process boundaries (launcher -> OpenCode TUI runtime),
 * so policy must be JSON-serializable and engine-owned.
 */

/**
 * Engine-owned type describing what a session view can do.
 * Structurally mirrors the platform's SessionCapabilities (v1 -- isomorphic).
 * The adapter insulates engine code from platform type changes.
 */
export interface ChildSessionCapabilities {
  readonly promptVisible: boolean
  readonly sidebarVisible: boolean
  readonly permissionsEnabled: boolean
  readonly questionsEnabled: boolean
  readonly exitKeybindActive: boolean
  readonly submissionMethod: "sync" | "async"
  readonly shellModeAllowed: boolean
  readonly commandsAllowed: boolean
  readonly agentCyclingAllowed: boolean
  readonly variantCyclingAllowed: boolean
}

/**
 * Env-serializable session capabilities policy.
 *
 * This contract crosses process boundaries (launcher -> OpenCode TUI main runtime),
 * so it must be JSON-safe and independent of function references.
 */
export interface SessionCapabilitiesPolicy {
  readonly child?: Partial<ChildSessionCapabilities>
}

/**
 * Engine-owned policy for enabling subagent input in child sessions.
 */
export function buildSubagentInputPolicy(): SessionCapabilitiesPolicy {
  return {
    child: {
      promptVisible: true,
      exitKeybindActive: false,
      submissionMethod: "async",
      shellModeAllowed: false,
      commandsAllowed: false,
      agentCyclingAllowed: false,
      variantCyclingAllowed: false,
    },
  }
}

/**
 * Serialize policy for cross-process transport via environment variable.
 */
export function serializeSessionCapabilitiesPolicy(policy: SessionCapabilitiesPolicy): string {
  return JSON.stringify(policy)
}
