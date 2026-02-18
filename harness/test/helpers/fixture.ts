import { randomUUID } from "node:crypto"
import { getForkServerUrl, requireCompositionServerUrl } from "./env"

export type SessionCleanup = () => Promise<void> | void

export type RuntimeFixture = {
  readonly serverUrl: string
  readonly runID: string
  nextName(prefix: string): string
  addCleanup(fn: SessionCleanup): void
  teardown(): Promise<void>
}

function createFixture(serverUrl: string): RuntimeFixture {
  const runID = randomUUID()
  const cleanups: SessionCleanup[] = []

  return {
    serverUrl,
    runID,
    nextName(prefix: string) {
      return `${prefix}-${runID.slice(0, 8)}-${cleanups.length + 1}`
    },
    addCleanup(fn: SessionCleanup) {
      cleanups.push(fn)
    },
    async teardown() {
      for (const cleanup of cleanups.reverse()) {
        await cleanup()
      }
    },
  }
}

export function createCompositionFixture(): RuntimeFixture {
  return createFixture(requireCompositionServerUrl())
}

export function createForkFixture(): RuntimeFixture {
  const serverUrl = getForkServerUrl()
  if (!serverUrl) {
    throw new Error("OPENCODE_FORK_SERVER_URL is required for fork tests")
  }
  return createFixture(serverUrl)
}
