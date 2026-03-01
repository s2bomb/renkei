import { describe, test, expect } from "bun:test"
import { buildSubagentInputPolicy, serializeSessionCapabilitiesPolicy } from "../../../src/adapters/session-capabilities"

describe("session capabilities policy", () => {
  test("T-SC01: subagent input policy sets child session behavior overrides", () => {
    const policy = buildSubagentInputPolicy()

    expect(policy.child).toBeDefined()
    expect(policy.child?.promptVisible).toBe(true)
    expect(policy.child?.submissionMethod).toBe("async")
    expect(policy.child?.shellModeAllowed).toBe(false)
    expect(policy.child?.commandsAllowed).toBe(false)
    expect(policy.child?.agentCyclingAllowed).toBe(false)
    expect(policy.child?.variantCyclingAllowed).toBe(false)
    expect(policy.child?.exitKeybindActive).toBe(false)
  })

  test("T-SC02: policy serializes to JSON-safe launch contract", () => {
    const policy = buildSubagentInputPolicy()
    const encoded = serializeSessionCapabilitiesPolicy(policy)
    const decoded = JSON.parse(encoded) as {
      child?: {
        promptVisible?: boolean
        submissionMethod?: "sync" | "async"
        shellModeAllowed?: boolean
      }
    }

    expect(decoded.child).toBeDefined()
    expect(decoded.child?.promptVisible).toBe(true)
    expect(decoded.child?.submissionMethod).toBe("async")
    expect(decoded.child?.shellModeAllowed).toBe(false)
  })
})
