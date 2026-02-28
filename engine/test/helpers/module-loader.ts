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

export async function loadApprovedSurfaceRegistryModule() {
  return loadModule("../../src/runtime/approved-surface-registry")
}

export async function loadPureSurfaceGateModule() {
  return loadModule("../../src/runtime/pure-surface-gate")
}

export async function loadStaleAssumptionScannerModule() {
  return loadModule("../../src/runtime/stale-assumption-scanner")
}

export async function loadPurityVerificationModule() {
  return loadModule("../../src/runtime/purity-verification")
}

export async function loadRenkeiDevModule() {
  return loadModule("../../src/runtime/renkei-dev")
}

export async function loadVendoredOpenCodeLinkageModule() {
  return loadModule("../../src/runtime/vendored-opencode-linkage")
}

export async function loadRepoPathResolutionModule() {
  return loadModule("../../src/runtime/repo-path-resolution")
}

export async function loadStartupBoundaryModule() {
  return loadModule("../../src/runtime/startup-boundary")
}

export async function loadVendoredUpdateWorkflowModule() {
  return loadModule("../../src/runtime/vendored-update-workflow")
}

export async function loadLiveIntegrationPrereqsModule() {
  return loadModule("../../src/runtime/live-integration-prereqs")
}

export async function loadNoDegradationPipelineModule() {
  return loadModule("../../src/runtime/no-degradation-pipeline")
}

export async function loadBaselineWorkflowsModule() {
  return loadModule("../../src/runtime/baseline-workflows")
}

export async function loadDeterministicSignalsModule() {
  return loadModule("../../src/runtime/deterministic-signals")
}

export async function loadOperatorRunbookContractModule() {
  return loadModule("../../src/runtime/operator-runbook-contract")
}

export async function loadRunbookArtifactBindingModule() {
  return loadModule("../../src/runtime/runbook-artifact-binding")
}

export async function loadCanonicalSmokeSequenceModule() {
  return loadModule("../../src/runtime/canonical-smoke-sequence")
}

export async function loadWorkingDirectoryLabelModule() {
  return loadModule("../../src/runtime/working-directory-label")
}

export async function loadRunbookEnvironmentPreflightModule() {
  return loadModule("../../src/runtime/runbook-environment-preflight")
}

export async function loadRunbookEvidenceReportModule() {
  return loadModule("../../src/runtime/runbook-evidence-report")
}
