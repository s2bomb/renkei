import { createHarnessSDKClient } from "./composition-seam"
import { checkHostReadiness } from "./host-readiness"
import { probeIntegrationCapabilities } from "./integration-probe"
import type { StartupResult, StartupWarning } from "./types"

export type StartupInput = {
  readonly serverUrl: string
  readonly cwd: string
  readonly timeoutMs: number
  readonly healthPath: string
  readonly warning?: StartupWarning
}

export type Clock = {
  readonly nowMs: () => number
}

export type RenkeiDevDependencies = {
  readonly checkHostReadiness: typeof checkHostReadiness
  readonly probeIntegrationCapabilities: typeof probeIntegrationCapabilities
  readonly createHarnessSDKClient: typeof createHarnessSDKClient
  readonly clock: Clock
}

const DEFAULT_CLOCK: Clock = {
  nowMs: () => Date.now(),
}

export async function startHarnessRuntime(
  input: StartupInput,
  deps?: Partial<RenkeiDevDependencies>,
): Promise<StartupResult> {
  const runtimeDeps: RenkeiDevDependencies = {
    checkHostReadiness,
    probeIntegrationCapabilities,
    createHarnessSDKClient,
    clock: DEFAULT_CLOCK,
    ...deps,
  }

  const t0 = runtimeDeps.clock.nowMs()
  const readiness = await runtimeDeps.checkHostReadiness({
    serverUrl: input.serverUrl,
    healthPath: input.healthPath,
    timeoutMs: input.timeoutMs,
  })
  const t1 = runtimeDeps.clock.nowMs()
  if (!readiness.ok) {
    return { ok: false, error: readiness.error }
  }

  const probe = await runtimeDeps.probeIntegrationCapabilities(input.serverUrl, {
    timeoutMs: input.timeoutMs,
  })
  const t2 = runtimeDeps.clock.nowMs()
  if (!probe.ok) {
    return {
      ok: false,
      error: {
        code: "PROBE_FAILED",
        error: probe.error,
      },
    }
  }

  const sdk = await runtimeDeps.createHarnessSDKClient({
    serverUrl: input.serverUrl,
    directory: input.cwd,
  })
  const t3 = runtimeDeps.clock.nowMs()
  if (!sdk.ok) {
    return {
      ok: false,
      error: {
        code: "SDK_BOOTSTRAP_FAILED",
        error: sdk.error,
      },
    }
  }

  const t4 = runtimeDeps.clock.nowMs()

  return {
    ok: true,
    value: {
      serverUrl: input.serverUrl,
      mode: probe.value.mode,
      report: probe.value,
      readiness: readiness.value,
      warnings: input.warning ? [input.warning] : [],
      timingsMs: {
        readiness: t1 - t0,
        probe: t2 - t1,
        sdk: t3 - t2,
        total: t4 - t0,
      },
    },
  }
}
