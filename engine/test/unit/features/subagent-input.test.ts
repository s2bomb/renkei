import { describe, test, expect, afterEach } from "bun:test"
import { enableSubagentInput } from "../../../src/features/subagent-input"
import { childSessionDefaults } from "../helpers/fixtures"
import type { ChildSessionCapabilities } from "../../../src/adapters/session-capabilities"

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__renkei_sessionCapabilities
})

describe("enableSubagentInput", () => {
  test("T-08: enableSubagentInput registers an override that produces child session capabilities", () => {
    enableSubagentInput()

    const overrideFn = (globalThis as Record<string, unknown>).__renkei_sessionCapabilities as (
      sessionInfo: { parentID: string | undefined },
      defaults: ChildSessionCapabilities,
    ) => ChildSessionCapabilities

    expect(typeof overrideFn).toBe("function")

    const defaults = childSessionDefaults()
    const result = overrideFn({ parentID: "child-001" }, defaults)

    expect(result.promptVisible).toBe(true)
    expect(result.submissionMethod).toBe("async")
    expect(result.shellModeAllowed).toBe(false)
    expect(result.commandsAllowed).toBe(false)
    expect(result.agentCyclingAllowed).toBe(false)
    expect(result.variantCyclingAllowed).toBe(false)
    expect(result.exitKeybindActive).toBe(false)
  })
})
