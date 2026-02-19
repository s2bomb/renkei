import { describe, expect, test } from "bun:test"
import { createSection1RepoFixture } from "../helpers/section-1-fixtures"
import { loadVendoredOpenCodeLinkageModule } from "../helpers/section-1-module-loader"

describe("unit section-1-linkage contracts", () => {
  test("S1-T01 loads valid repository-managed subtree linkage config", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture()

    try {
      const result = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(result.ok).toBe(true)
      if (!result.ok) {
        return
      }

      expect(result.value.mode).toBe("subtree")
      expect(result.value.repoRoot).toBe(fixture.repoRoot)
      expect(result.value.harnessRoot).toBe(fixture.harnessRoot)
      expect(result.value.vendorRoot).toBe(fixture.vendorRoot)
      expect(result.value.opencodeRoot).toBe(fixture.opencodeRoot)
      expect(result.value.opencodeRoot.startsWith(fixture.repoRoot)).toBe(true)
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T02 missing config fails with LINKAGE_CONFIG_MISSING", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture({ writeLinkageConfig: false })

    try {
      const result = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("LINKAGE_CONFIG_MISSING")
      expect(String(result.error.expectedPath).endsWith("harness/config/opencode-linkage.json")).toBe(true)
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T03 invalid config schema fails with LINKAGE_CONFIG_INVALID", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture({ linkageConfigRaw: "{ invalid json" })

    try {
      const result = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("LINKAGE_CONFIG_INVALID")
      expect(typeof result.error.path).toBe("string")
      expect(typeof result.error.detail).toBe("string")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T04 unsupported mode fails with VENDORED_MODE_UNSUPPORTED", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture({
      linkageConfigValue: {
        mode: "submodule",
        opencodeRoot: "vendor/opencode",
        provenance: {
          remote: "https://github.com/sst/opencode.git",
          branch: "main",
          upstreamRef: "origin/main",
          syncedAt: "2026-02-19T00:00:00.000Z",
        },
      },
    })

    try {
      const result = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("VENDORED_MODE_UNSUPPORTED")
      expect(result.error.mode).toBe("submodule")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T05 verify succeeds when vendored OpenCode root exists", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture()

    try {
      const loaded = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(loaded.ok).toBe(true)
      if (!loaded.ok) {
        return
      }

      const verified = runtime.verifyVendoredOpenCodeLinkage(loaded.value)
      expect(verified.ok).toBe(true)
      if (verified.ok) {
        expect(verified.value).toBe(true)
      }
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T06 verify fails typed when vendored OpenCode root is missing", async () => {
    const runtime = await loadVendoredOpenCodeLinkageModule()
    const fixture = await createSection1RepoFixture({ createVendoredRoot: false })

    try {
      const loaded = runtime.loadVendoredOpenCodeLinkage(fixture.nestedCwd)
      expect(loaded.ok).toBe(true)
      if (!loaded.ok) {
        return
      }

      const verified = runtime.verifyVendoredOpenCodeLinkage(loaded.value)
      expect(verified.ok).toBe(false)
      if (verified.ok) {
        return
      }

      expect(verified.error.code).toBe("VENDORED_OPENCODE_MISSING")
      expect(verified.error.opencodeRoot).toBe(fixture.opencodeRoot)
    } finally {
      await fixture.cleanup()
    }
  })
})
