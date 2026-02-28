import { describe, test, expect, afterEach } from "bun:test"
import {
  registerCapabilitiesOverride,
  buildChildSessionCapabilities,
  type ChildSessionCapabilities,
  type CapabilitiesOverrideInput,
} from "../../../src/adapters/session-capabilities"
import { childSessionDefaults } from "../helpers/fixtures"

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__renkei_sessionCapabilities
})

describe("registerCapabilitiesOverride", () => {
  test("T-01: override function is installed on globalThis and called with session info and defaults", () => {
    const calls: Array<{ input: CapabilitiesOverrideInput; defaults: ChildSessionCapabilities }> = []
    const expectedResult = childSessionDefaults({ promptVisible: true })

    registerCapabilitiesOverride((input, defaults) => {
      calls.push({ input, defaults })
      return expectedResult
    })

    const overrideFn = (globalThis as Record<string, unknown>).__renkei_sessionCapabilities as (
      sessionInfo: { parentID: string | undefined },
      defaults: ChildSessionCapabilities,
    ) => ChildSessionCapabilities

    expect(typeof overrideFn).toBe("function")

    const testSessionInfo = { parentID: "child-abc" }
    const testDefaults = childSessionDefaults()
    const result = overrideFn(testSessionInfo, testDefaults)

    expect(calls).toHaveLength(1)
    expect(calls[0].input.parentID).toBe("child-abc")
    expect(result).toEqual(expectedResult)
  })

  test("T-02: override receives mapped engine-owned types, not raw platform arguments", () => {
    // NOTE: Limited v1 discriminating power -- types are currently isomorphic.
    // This test is a regression guard for when platform and engine types diverge.
    // See test-design.md DR-01.
    let receivedInput: CapabilitiesOverrideInput | undefined
    let receivedDefaults: ChildSessionCapabilities | undefined

    registerCapabilitiesOverride((input, defaults) => {
      receivedInput = input
      receivedDefaults = defaults
      return defaults
    })

    const overrideFn = (globalThis as Record<string, unknown>).__renkei_sessionCapabilities as (
      sessionInfo: { parentID: string | undefined },
      defaults: ChildSessionCapabilities,
    ) => ChildSessionCapabilities

    const testDefaults = childSessionDefaults()
    overrideFn({ parentID: "child-123" }, testDefaults)

    expect(receivedInput).toBeDefined()
    expect(receivedInput!.parentID).toBe("child-123")
    expect(receivedDefaults).toBeDefined()
    expect(receivedDefaults!.promptVisible).toBe(testDefaults.promptVisible)
    expect(receivedDefaults!.submissionMethod).toBe(testDefaults.submissionMethod)
    expect(receivedDefaults!.shellModeAllowed).toBe(testDefaults.shellModeAllowed)
  })

  test("T-03: override that throws falls back to defaults (graceful degradation)", () => {
    registerCapabilitiesOverride(() => {
      throw new Error("boom")
    })

    const overrideFn = (globalThis as Record<string, unknown>).__renkei_sessionCapabilities as (
      sessionInfo: { parentID: string | undefined },
      defaults: ChildSessionCapabilities,
    ) => ChildSessionCapabilities

    const testDefaults = childSessionDefaults()

    // Must not throw
    const result = overrideFn({ parentID: "child-err" }, testDefaults)

    // Must return defaults exactly -- not undefined, not partial, not the error
    expect(result).toEqual(testDefaults)
  })

  test("T-04: calling registerCapabilitiesOverride twice replaces the previous override", () => {
    let overrideACalled = false

    registerCapabilitiesOverride((_, defaults) => {
      overrideACalled = true
      return { ...defaults, promptVisible: false }
    })

    registerCapabilitiesOverride((_, defaults) => {
      return { ...defaults, promptVisible: true }
    })

    const overrideFn = (globalThis as Record<string, unknown>).__renkei_sessionCapabilities as (
      sessionInfo: { parentID: string | undefined },
      defaults: ChildSessionCapabilities,
    ) => ChildSessionCapabilities

    const result = overrideFn({ parentID: "child-replace" }, childSessionDefaults())

    expect(result.promptVisible).toBe(true)
    expect(overrideACalled).toBe(false)
  })
})

describe("buildChildSessionCapabilities", () => {
  test("T-05: root session returns defaults unmodified", () => {
    const defaults = childSessionDefaults()
    const result = buildChildSessionCapabilities({ parentID: undefined }, defaults)

    expect(result).toEqual(defaults)
  })

  test("T-06: child session returns restricted capabilities", () => {
    const defaults = childSessionDefaults()
    const result = buildChildSessionCapabilities({ parentID: "session-abc" }, defaults)

    // Overridden fields (child session policy)
    expect(result.promptVisible).toBe(true)
    expect(result.submissionMethod).toBe("async")
    expect(result.shellModeAllowed).toBe(false)
    expect(result.commandsAllowed).toBe(false)
    expect(result.agentCyclingAllowed).toBe(false)
    expect(result.variantCyclingAllowed).toBe(false)
    expect(result.exitKeybindActive).toBe(false)

    // Preserved fields (same as defaults)
    expect(result.sidebarVisible).toBe(false)
    expect(result.permissionsEnabled).toBe(false)
    expect(result.questionsEnabled).toBe(false)
  })

  test("T-07: child session capabilities preserve defaults for unchanged fields", () => {
    const defaults = childSessionDefaults({
      sidebarVisible: false,
      permissionsEnabled: false,
      questionsEnabled: false,
    })

    const result = buildChildSessionCapabilities({ parentID: "session-xyz" }, defaults)

    // These fields must come from the defaults input, not be hardcoded
    expect(result.sidebarVisible).toBe(defaults.sidebarVisible)
    expect(result.permissionsEnabled).toBe(defaults.permissionsEnabled)
    expect(result.questionsEnabled).toBe(defaults.questionsEnabled)
  })
})
