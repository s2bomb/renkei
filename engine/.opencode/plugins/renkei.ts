// Renkei engine plugin -- loaded by OpenCode via OPENCODE_CONFIG_DIR discovery.
// This file runs inside the OpenCode process, NOT the engine launcher process.
// For MVP, it proves the plugin loading path works. No hooks are wired.

export default async function renkeiPlugin(input: any): Promise<Record<string, unknown>> {
  // MVP: return empty hooks, proving the loading path works
  return {}
}
