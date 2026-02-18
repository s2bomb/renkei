import type { StartupWarningCode } from "./types"

export type StartupMode = "composition-only" | "fork-available"

export type ModeSelection = {
  readonly mode: StartupMode
  readonly forkUrl?: string
  readonly warning?: StartupWarningCode
}

function normalizeUrl(url: string): string {
  return new URL(url).toString().replace(/\/$/, "")
}

export function selectStartupMode(input: {
  readonly serverUrl: string
  readonly forkServerUrl?: string
}): ModeSelection {
  const forkServerUrl = input.forkServerUrl
  if (!forkServerUrl) {
    return { mode: "composition-only" }
  }

  let normalizedServerUrl: string
  try {
    normalizedServerUrl = normalizeUrl(input.serverUrl)
  } catch {
    return {
      mode: "composition-only",
      warning: "FORK_URL_INVALID",
    }
  }

  try {
    const normalizedForkUrl = normalizeUrl(forkServerUrl)
    if (normalizedForkUrl === normalizedServerUrl) {
      return {
        mode: "fork-available",
        forkUrl: normalizedForkUrl,
      }
    }
    return {
      mode: "composition-only",
      forkUrl: normalizedForkUrl,
      warning: "FORK_URL_MISMATCH",
    }
  } catch {
    return {
      mode: "composition-only",
      warning: "FORK_URL_INVALID",
    }
  }
}
