type UnknownModule = Record<string, (...args: any[]) => any>

async function loadModule(path: string): Promise<UnknownModule> {
  try {
    return (await import(path)) as UnknownModule
  } catch (error) {
    throw new Error(`Runtime module unavailable: ${path}; ${String(error)}`)
  }
}

export async function loadIntegrationProbeModule() {
  return loadModule("../../src/runtime/integration-probe")
}

export async function loadCompositionSeamModule() {
  return loadModule("../../src/runtime/composition-seam")
}

export async function loadForkThresholdModule() {
  return loadModule("../../src/runtime/fork-threshold")
}

export async function loadTeammateSessionModule() {
  return loadModule("../../src/runtime/teammate-session")
}

export async function loadAsyncLifecycleModule() {
  return loadModule("../../src/runtime/async-lifecycle")
}

export async function loadProvenanceModule() {
  return loadModule("../../src/runtime/provenance")
}

export async function loadModeSelectorModule() {
  return loadModule("../../src/runtime/mode-selector")
}

export async function loadHostReadinessModule() {
  return loadModule("../../src/runtime/host-readiness")
}

export async function loadStartupOrchestratorModule() {
  return loadModule("../../src/runtime/startup-orchestrator")
}

export async function loadCompositionIntegrationBoundaryModule() {
  return loadModule("../../src/runtime/composition-integration-boundary")
}

export async function loadNoDegradationBaselineModule() {
  return loadModule("../../src/runtime/no-degradation-baseline")
}

export async function loadIntegrationDepthPolicyModule() {
  return loadModule("../../src/runtime/integration-depth-policy")
}

export async function loadRenkeiDevModule() {
  return loadModule("../../src/runtime/renkei-dev")
}
