type UnknownModule = Record<string, (...args: any[]) => any>

async function loadModule(path: string): Promise<UnknownModule> {
  try {
    return (await import(path)) as UnknownModule
  } catch (error) {
    throw new Error(`Runtime module unavailable: ${path}; ${String(error)}`)
  }
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
