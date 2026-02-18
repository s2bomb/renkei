import { describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createCompositionFixture } from "../helpers/fixture"
import {
  loadCompositionSeamModule,
  loadIntegrationProbeModule,
  loadTeammateSessionModule,
} from "../helpers/module-loader"

describe("integration composition seam contracts", () => {
  test("T-01 composition-only runtime reports four composition surfaces and fork unavailable", async () => {
    const fixture = createCompositionFixture()
    const runtime = await loadIntegrationProbeModule()

    const result = await runtime.probeIntegrationCapabilities(fixture.serverUrl)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.mode).toBe("composition-only")
      expect(result.value.composition).toHaveLength(4)
      for (const capability of result.value.fork) {
        expect(capability.available).toBe(false)
      }
    }
  })

  test("T-03 unreachable server returns OPENCODE_UNREACHABLE", async () => {
    const runtime = await loadIntegrationProbeModule()

    const result = await runtime.probeIntegrationCapabilities("http://127.0.0.1:1")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("OPENCODE_UNREACHABLE")
      expect(result.error.serverUrl).toBe("http://127.0.0.1:1")
    }
  })

  test("T-06 tool registration succeeds and tool is invokable", async () => {
    const fixture = createCompositionFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()

    const report = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(report.ok).toBe(true)
    if (!report.ok) {
      return
    }

    const result = await seam.registerComposedTool(
      {
        id: `renkei-tool-${fixture.runID}`,
        description: "integration tool",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => ({ title: "ok", output: "ok" }),
      },
      report.value,
    )

    expect(result).toEqual({ ok: true, value: undefined })
  })

  test("T-07 duplicate tool ID returns DUPLICATE_TOOL_ID", async () => {
    const fixture = createCompositionFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()
    const id = `renkei-dup-${fixture.runID}`

    const report = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(report.ok).toBe(true)
    if (!report.ok) {
      return
    }

    await seam.registerComposedTool(
      {
        id,
        description: "first",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => ({ title: "ok", output: "ok" }),
      },
      report.value,
    )

    const second = await seam.registerComposedTool(
      {
        id,
        description: "second",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => ({ title: "ok", output: "ok" }),
      },
      report.value,
    )

    expect(second.ok).toBe(false)
    if (!second.ok) {
      expect(second.error.code).toBe("DUPLICATE_TOOL_ID")
      expect(second.error.id).toBe(id)
    }
  })

  test("T-08 plugin registration accepts valid hooks/tools", async () => {
    const fixture = createCompositionFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()

    const report = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(report.ok).toBe(true)
    if (!report.ok) {
      return
    }

    const result = await seam.registerHarnessPlugin(
      {
        name: `renkei-plugin-${fixture.runID}`,
        tools: {
          [`tool-${fixture.runID}`]: {
            id: `tool-${fixture.runID}`,
            description: "plugin tool",
            parameters: { type: "object", properties: {}, required: [] },
            execute: async () => ({ title: "ok", output: "ok" }),
          },
        },
        hooks: {
          event: () => {},
        },
      },
      report.value,
    )

    expect(result).toEqual({ ok: true, value: undefined })
  })

  test("T-09 invalid plugin definition returns INVALID_PLUGIN_DEFINITION", async () => {
    const fixture = createCompositionFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()

    const report = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(report.ok).toBe(true)
    if (!report.ok) {
      return
    }

    const result = await seam.registerHarnessPlugin({ hooks: { event: () => {} } }, report.value)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_PLUGIN_DEFINITION")
    }
  })

  test("T-10 loadDeployedSkills returns parseable skill set from scan roots", async () => {
    const seam = await loadCompositionSeamModule()
    const root = await mkdtemp(join(tmpdir(), "renkei-skill-ok-"))
    const skillDir = join(root, "skills", "integration-check")
    await mkdir(skillDir, { recursive: true })
    await writeFile(
      join(skillDir, "SKILL.md"),
      "---\nname: integration-check\ndescription: integration test skill\n---\n# Integration check\n",
    )

    const result = await seam.loadDeployedSkills({ additionalRoots: [root] })
    expect(result.ok).toBe(true)
    if (result.ok) {
      const names = result.value.map((item: { name: string }) => item.name)
      expect(names).toContain("integration-check")
    }
  })

  test("T-11 malformed skill returns SKILL_PARSE_FAILED", async () => {
    const seam = await loadCompositionSeamModule()
    const root = await mkdtemp(join(tmpdir(), "renkei-skill-bad-"))
    const skillDir = join(root, "skills", "broken")
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, "SKILL.md"), "---\nname: broken\n# malformed frontmatter")

    const result = await seam.loadDeployedSkills({ additionalRoots: [root] })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("SKILL_PARSE_FAILED")
      expect(result.error.path).toContain("SKILL.md")
    }
  })

  test("T-12 SDK client creation succeeds against reachable server", async () => {
    const fixture = createCompositionFixture()
    const seam = await loadCompositionSeamModule()

    const clientResult = await seam.createHarnessSDKClient({
      serverUrl: fixture.serverUrl,
      directory: process.cwd(),
    })

    expect(clientResult.ok).toBe(true)
    if (clientResult.ok) {
      const sessions = await clientResult.value.session.list()
      expect(Array.isArray(sessions)).toBe(true)
    }
  })

  test("T-13 SDK connection failure returns SDK_CONNECTION_FAILED", async () => {
    const seam = await loadCompositionSeamModule()

    const result = await seam.createHarnessSDKClient({
      serverUrl: "http://127.0.0.1:1",
      directory: process.cwd(),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("SDK_CONNECTION_FAILED")
    }
  })

  test("T-19 create child session succeeds on composition-only runtime without name", async () => {
    const fixture = createCompositionFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()

    const report = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(report.ok).toBe(true)
    if (!report.ok) {
      return
    }

    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })
    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const parent = await client.value.session.create({ title: `parent-${fixture.runID}` })
    const result = await teammate.createTeammateSession(
      {
        parentSessionID: parent.id,
        agentType: "general",
      },
      report.value,
      client.value,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.parentID).toBe(parent.id)
      expect(typeof result.value.id).toBe("string")
      expect(typeof result.value.slug).toBe("string")
    }
  })
})
