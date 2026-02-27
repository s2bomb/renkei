import { describe, expect, test } from "bun:test"
import { APPROVED_SURFACE_REGISTRY_ERROR_CODES } from "../helpers/contracts"
import { loadApprovedSurfaceRegistryModule } from "../helpers/module-loader"

const CANONICAL_SURFACES = ["tool-registry", "plugin-hooks", "skill-load", "sdk-client"] as const

function makeRegistryJSON(entries: ReadonlyArray<{ readonly id: string }>) {
  return JSON.stringify({
    version: "2026-02-19",
    entries: entries.map((entry) => ({
      id: entry.id,
      seam: entry.id,
      upstreamSurface: `upstream:${entry.id}`,
      rationale: `rationale:${entry.id}`,
    })),
  })
}

function makeCanonicalRegistry(sourcePath = "harness/config/approved-opencode-surfaces.json") {
  return {
    version: "2026-02-19",
    sourcePath,
    generatedAtMs: 1234,
    entries: CANONICAL_SURFACES.map((id) => ({
      id,
      seam: id,
      upstreamSurface: `upstream:${id}`,
      rationale: `rationale:${id}`,
    })),
  }
}

describe("unit section-2 approved-surface-registry contracts", () => {
  test("S2-T01 loads canonical JSON and preserves deterministic entry order", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const sourcePath = "harness/config/approved-opencode-surfaces.json"
    const json = makeRegistryJSON([
      { id: "plugin-hooks" },
      { id: "tool-registry" },
      { id: "sdk-client" },
      { id: "skill-load" },
    ])

    const result = await runtime.loadApprovedSurfaceRegistry(sourcePath, {
      nowMs: () => 4242,
      readTextFile: async () => ({ ok: true, value: json }),
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }

    expect(result.value.version).toBe("2026-02-19")
    expect(result.value.sourcePath).toBe(sourcePath)
    expect(result.value.generatedAtMs).toBe(4242)
    expect(result.value.entries.map((entry: { id: string }) => entry.id)).toEqual([
      "plugin-hooks",
      "tool-registry",
      "sdk-client",
      "skill-load",
    ])
  })

  test("S2-T02 missing source path fails with APPROVED_SURFACE_REGISTRY_NOT_FOUND", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const sourcePath = "harness/config/missing-registry.json"
    const allowed = new Set<string>(APPROVED_SURFACE_REGISTRY_ERROR_CODES)

    const result = await runtime.loadApprovedSurfaceRegistry(sourcePath, {
      nowMs: () => 4242,
      readTextFile: async () => ({
        ok: false,
        error: {
          code: "APPROVED_SURFACE_REGISTRY_NOT_FOUND",
          path: sourcePath,
        },
      }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(allowed.has(result.error.code)).toBe(true)
    expect(result.error.code).toBe("APPROVED_SURFACE_REGISTRY_NOT_FOUND")
    expect(result.error.path).toBe(sourcePath)
  })

  test("S2-T03 invalid JSON or schema fails with APPROVED_SURFACE_REGISTRY_INVALID", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()

    for (const payload of ["{", JSON.stringify({ version: "2026-02-19", entries: [{ id: "tool-registry" }] })]) {
      const result = await runtime.loadApprovedSurfaceRegistry("harness/config/approved-opencode-surfaces.json", {
        nowMs: () => 4242,
        readTextFile: async () => ({ ok: true, value: payload }),
      })

      expect(result.ok).toBe(false)
      if (result.ok) {
        continue
      }

      expect(result.error.code).toBe("APPROVED_SURFACE_REGISTRY_INVALID")
      expect(typeof result.error.detail).toBe("string")
      expect(result.error.detail.length).toBeGreaterThan(0)
    }
  })

  test("S2-T04 duplicate ids fail with APPROVED_SURFACE_DUPLICATE_ID", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const json = makeRegistryJSON([
      { id: "tool-registry" },
      { id: "plugin-hooks" },
      { id: "tool-registry" },
      { id: "sdk-client" },
    ])

    const result = await runtime.loadApprovedSurfaceRegistry("harness/config/approved-opencode-surfaces.json", {
      nowMs: () => 4242,
      readTextFile: async () => ({ ok: true, value: json }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("APPROVED_SURFACE_DUPLICATE_ID")
    expect(result.error.id).toBe("tool-registry")
  })

  test("S2-T05 empty entries fail with APPROVED_SURFACE_EMPTY", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const sourcePath = "harness/config/approved-opencode-surfaces.json"
    const json = JSON.stringify({ version: "2026-02-19", entries: [] })

    const result = await runtime.loadApprovedSurfaceRegistry(sourcePath, {
      nowMs: () => 4242,
      readTextFile: async () => ({ ok: true, value: json }),
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("APPROVED_SURFACE_EMPTY")
    expect(result.error.path).toBe(sourcePath)
  })

  test("S2-T06 verifyApprovedSurfaceRegistry passes for canonical unique ids", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()

    const result = runtime.verifyApprovedSurfaceRegistry(makeCanonicalRegistry())
    expect(result).toEqual({ ok: true, value: true })
  })

  test("S2-T07 verifyApprovedSurfaceRegistry rejects unknown surface id", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const registry = makeCanonicalRegistry()
    const corrupted = {
      ...registry,
      entries: [
        ...registry.entries.slice(0, 3),
        {
          id: "unknown-surface",
          seam: "unknown-surface",
          upstreamSurface: "upstream:unknown-surface",
          rationale: "rationale:unknown-surface",
        },
      ],
    }

    const result = runtime.verifyApprovedSurfaceRegistry(corrupted)
    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("APPROVED_SURFACE_REGISTRY_INVALID")
  })

  test("S2-T08 verifyApprovedSurfaceRegistry fails deterministically on duplicate ids", async () => {
    const runtime = await loadApprovedSurfaceRegistryModule()
    const registry = makeCanonicalRegistry()
    const duplicated = {
      ...registry,
      entries: [
        ...registry.entries,
        {
          id: "sdk-client",
          seam: "sdk-client",
          upstreamSurface: "upstream:sdk-client",
          rationale: "rationale:sdk-client-duplicate",
        },
      ],
    }

    const result = runtime.verifyApprovedSurfaceRegistry(duplicated)
    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.error.code).toBe("APPROVED_SURFACE_DUPLICATE_ID")
    expect(result.error.id).toBe("sdk-client")
  })
})
