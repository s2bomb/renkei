import { describe, expect, test } from "bun:test"
import { loadModeSelectorModule } from "../helpers/module-loader"

describe("unit mode-selector contracts", () => {
  test("T-16 matching normalized URLs yields fork-available without warning", async () => {
    const runtime = await loadModeSelectorModule()

    const result = runtime.selectStartupMode({
      serverUrl: "http://localhost:4099/",
      forkServerUrl: "http://LOCALHOST:4099",
    })

    expect(result.mode).toBe("fork-available")
    expect(result.warning).toBeUndefined()
  })

  test("T-17 missing fork URL yields composition-only without warning", async () => {
    const runtime = await loadModeSelectorModule()

    const result = runtime.selectStartupMode({
      serverUrl: "http://localhost:4099",
    })

    expect(result.mode).toBe("composition-only")
    expect(result.warning).toBeUndefined()
  })

  test("T-18 invalid fork URL yields FORK_URL_INVALID warning", async () => {
    const runtime = await loadModeSelectorModule()

    const result = runtime.selectStartupMode({
      serverUrl: "http://localhost:4099",
      forkServerUrl: "::::invalid-url::::",
    })

    expect(result.mode).toBe("composition-only")
    expect(result.warning).toBe("FORK_URL_INVALID")
  })

  test("T-19 mismatched valid URLs yield FORK_URL_MISMATCH warning", async () => {
    const runtime = await loadModeSelectorModule()

    const result = runtime.selectStartupMode({
      serverUrl: "http://localhost:4099",
      forkServerUrl: "http://localhost:4100",
    })

    expect(result.mode).toBe("composition-only")
    expect(result.warning).toBe("FORK_URL_MISMATCH")
  })
})
