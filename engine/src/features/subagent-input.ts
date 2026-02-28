/**
 * Subagent input feature -- enable user input in child (subagent) sessions.
 *
 * This module runs inside the OpenCode process via the plugin hook.
 * It registers a session capabilities override through the adapter
 * that shows the prompt in child sessions with restricted modes.
 *
 * Call enableSubagentInput() once during plugin initialization.
 */
import { registerCapabilitiesOverride, buildChildSessionCapabilities } from "../adapters/session-capabilities"

/**
 * Enable user input in child (subagent) sessions.
 *
 * Registers a session capabilities override that:
 * - Shows the prompt in child sessions
 * - Routes submission through promptAsync (fire-and-forget)
 * - Blocks shell mode, slash commands, agent cycling, and variant cycling
 *
 * Call this once during plugin initialization.
 */
export function enableSubagentInput(): void {
  registerCapabilitiesOverride(buildChildSessionCapabilities)
}
