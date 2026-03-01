// Renkei engine plugin -- loaded by OpenCode via OPENCODE_CONFIG_DIR discovery.
// Child-session capabilities now use launch-time policy injection via
// RENKEI_SESSION_CAPABILITIES, so this plugin currently has no runtime hooks.

export default async function renkeiPlugin(input: any): Promise<Record<string, unknown>> {
  return {}
}
