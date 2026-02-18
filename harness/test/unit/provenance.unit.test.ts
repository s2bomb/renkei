import { describe, expect, test } from "bun:test"
import { makeCompositionOnlyReport, makeForkAvailableReport } from "../helpers/contracts"
import { loadProvenanceModule } from "../helpers/module-loader"

describe("unit provenance contracts", () => {
  test("T-33 wrapPromptContent returns exact wrapper format for parent and child", async () => {
    const runtime = await loadProvenanceModule()
    const report = makeForkAvailableReport()

    const parent = runtime.wrapPromptContent(
      {
        role: "parent",
        name: "researcher",
        content: "hello",
      },
      report,
    )

    const child = runtime.wrapPromptContent(
      {
        role: "child",
        name: "researcher",
        sessionID: "ses_123",
        content: "hello",
      },
      report,
    )

    expect(parent).toEqual({
      ok: true,
      value: '<parent-agent-message name="researcher">\nhello\n</parent-agent-message>',
    })
    expect(child).toEqual({
      ok: true,
      value: '<child-agent-message name="researcher" session-id="ses_123">\nhello\n</child-agent-message>',
    })
  })

  test("T-34 wrapPromptContent returns FORK_CAPABILITY_REQUIRED when prompt-wrapper unavailable", async () => {
    const runtime = await loadProvenanceModule()
    const report = makeCompositionOnlyReport()

    const result = runtime.wrapPromptContent(
      {
        role: "parent",
        name: "researcher",
        content: "hello",
      },
      report,
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("FORK_CAPABILITY_REQUIRED")
      expect(result.error.capability).toBe("prompt-wrapper")
    }
  })

  test("T-35 parseProvenanceFromMessage returns null when absent and metadata when present", async () => {
    const runtime = await loadProvenanceModule()

    const missing = runtime.parseProvenanceFromMessage({ role: "user" })
    expect(missing).toEqual({ ok: true, value: null })

    const valid = runtime.parseProvenanceFromMessage({
      role: "user",
      source: "parent",
      sourceSessionID: "ses_parent",
      sourceName: "director",
    })

    expect(valid).toEqual({
      ok: true,
      value: {
        source: "parent",
        sourceSessionID: "ses_parent",
        sourceName: "director",
      },
    })

    const invalid = runtime.parseProvenanceFromMessage({ role: "user", source: 42 })
    expect(invalid.ok).toBe(false)
    if (!invalid.ok) {
      expect(invalid.error.code).toBe("INVALID_SOURCE")
    }
  })
})
