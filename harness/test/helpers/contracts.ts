export const COMPOSITION_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

export const FORK_CAPABILITIES = [
  "session-name",
  "active-child-query",
  "background-launch",
  "message-provenance",
  "prompt-wrapper",
] as const

type ForkCapabilityID = (typeof FORK_CAPABILITIES)[number]

function capability(id: ForkCapabilityID, available: boolean) {
  return {
    id,
    available,
    gatingChange: `gating:${id}`,
  }
}

export function makeCompositionOnlyReport(serverUrl = "http://127.0.0.1:4099") {
  return {
    serverUrl,
    mode: "composition-only",
    composition: COMPOSITION_SURFACES.map((id) => ({ id, available: true as const })),
    fork: FORK_CAPABILITIES.map((id) => capability(id, false)),
    probedAt: Date.now(),
  }
}

export function makeForkAvailableReport(options?: {
  readonly serverUrl?: string
  readonly availableCapabilities?: ReadonlyArray<ForkCapabilityID>
}) {
  const available = new Set(options?.availableCapabilities ?? FORK_CAPABILITIES)
  return {
    serverUrl: options?.serverUrl ?? "http://127.0.0.1:4100",
    mode: "fork-available",
    composition: COMPOSITION_SURFACES.map((id) => ({ id, available: true as const })),
    fork: FORK_CAPABILITIES.map((id) => capability(id, available.has(id))),
    probedAt: Date.now(),
  }
}
