// Renkei engine plugin -- loaded by OpenCode via OPENCODE_CONFIG_DIR discovery.
// This file runs inside the OpenCode process, NOT the engine launcher process.

import { enableSubagentInput } from "../../src/features/subagent-input"

export default async function renkeiPlugin(input: any): Promise<Record<string, unknown>> {
  enableSubagentInput()
  return {}
}
