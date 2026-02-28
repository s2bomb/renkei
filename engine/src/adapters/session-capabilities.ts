/**
 * Session capabilities adapter -- anti-corruption layer for the Level 3
 * session capabilities seam.
 *
 * This module runs inside the OpenCode process via the plugin hook.
 * It registers an override function on globalThis that the platform's
 * capabilities memo reads. The engine and platform share no import path;
 * the globalThis function slot is the sole bridge.
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
 * Engine-owned input to the override function.
 * Provides the minimum session data needed for policy decisions.
 */
export interface CapabilitiesOverrideInput {
  readonly parentID: string | undefined
}

/**
 * Register a function that overrides session capabilities.
 * Called once during plugin initialization. Subsequent calls replace the previous override.
 *
 * The registered function is installed on globalThis.__renkei_sessionCapabilities.
 * The platform's capabilities memo reads from this slot when the
 * RENKEI_SESSION_CAPABILITIES env var is set.
 *
 * If the override throws during evaluation, the platform receives the defaults
 * (graceful degradation -- E-A01).
 */
export function registerCapabilitiesOverride(
  override: (input: CapabilitiesOverrideInput, defaults: ChildSessionCapabilities) => ChildSessionCapabilities,
): void {
  ;(globalThis as Record<string, unknown>).__renkei_sessionCapabilities = (
    sessionInfo: { parentID: string | undefined },
    defaults: ChildSessionCapabilities,
  ): ChildSessionCapabilities => {
    try {
      const input: CapabilitiesOverrideInput = { parentID: sessionInfo.parentID }
      const mappedDefaults: ChildSessionCapabilities = { ...defaults }
      return override(input, mappedDefaults)
    } catch (error) {
      console.warn("[renkei] Session capabilities override threw, falling back to defaults:", error)
      return defaults
    }
  }
}

/**
 * Pure function: compute capabilities for a given session.
 *
 * For root sessions (parentID undefined): returns defaults unmodified.
 * For child sessions (parentID is a string): returns restricted capabilities
 * with prompt visible, async submission, and blocked modes.
 */
export function buildChildSessionCapabilities(
  input: CapabilitiesOverrideInput,
  defaults: ChildSessionCapabilities,
): ChildSessionCapabilities {
  if (input.parentID === undefined) {
    return defaults
  }

  return {
    ...defaults,
    promptVisible: true,
    exitKeybindActive: false,
    submissionMethod: "async",
    shellModeAllowed: false,
    commandsAllowed: false,
    agentCyclingAllowed: false,
    variantCyclingAllowed: false,
  }
}
