import { describe, expect, test } from "bun:test"
import { makeCompositionOnlyReport } from "../helpers/contracts"
import { createCompositionFixture } from "../helpers/fixture"
import { spyWarn } from "../helpers/log-spy"
import {
  loadAsyncLifecycleModule,
  loadCompositionSeamModule,
  loadTeammateSessionModule,
  loadProvenanceModule,
} from "../helpers/module-loader"

describe("integration teammate and lifecycle contracts", () => {
  test("T-20 create with name on composition-only drops name and still succeeds", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const parent = await client.value.session.create({ title: `parent-${fixture.runID}` })
    const warn = spyWarn()
    try {
      const result = await teammate.createTeammateSession(
        {
          parentSessionID: parent.id,
          agentType: "general",
          name: fixture.nextName("named-child"),
        },
        report,
        client.value,
      )

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.name).toBeUndefined()
      }
      expect(warn.calls.length).toBeGreaterThan(0)
    } finally {
      warn.restore()
    }
  })

  test("T-21 parent not found returns PARENT_SESSION_NOT_FOUND", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await teammate.createTeammateSession(
      {
        parentSessionID: "ses_missing_parent",
        agentType: "general",
      },
      report,
      client.value,
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("PARENT_SESSION_NOT_FOUND")
    }
  })

  test("T-22 list children without active filter succeeds on composition-only runtime", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const parent = await client.value.session.create({ title: `parent-${fixture.runID}` })
    const created = await teammate.createTeammateSession(
      {
        parentSessionID: parent.id,
        agentType: "general",
      },
      report,
      client.value,
    )
    expect(created.ok).toBe(true)

    const listed = await teammate.listTeammateSessions(
      {
        parentSessionID: parent.id,
      },
      report,
      client.value,
    )

    expect(listed.ok).toBe(true)
    if (listed.ok) {
      expect(listed.value.length).toBeGreaterThan(0)
    }
  })

  test("T-23 list with active filter on composition-only returns FORK_CAPABILITY_REQUIRED", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const parent = await client.value.session.create({ title: `parent-${fixture.runID}` })
    const listed = await teammate.listTeammateSessions(
      {
        parentSessionID: parent.id,
        active: true,
      },
      report,
      client.value,
    )

    expect(listed.ok).toBe(false)
    if (!listed.ok) {
      expect(listed.error.code).toBe("FORK_CAPABILITY_REQUIRED")
      expect(listed.error.capability).toBe("active-child-query")
    }
  })

  test("T-24 get missing child session returns SESSION_NOT_FOUND", async () => {
    const fixture = createCompositionFixture()
    const seam = await loadCompositionSeamModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await teammate.getTeammateSession("ses_missing_child", client.value)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("SESSION_NOT_FOUND")
    }
  })

  test("T-25 launch on composition-only runtime returns FORK_CAPABILITY_REQUIRED and creates no teammate", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()
    const teammate = await loadTeammateSessionModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const parent = await client.value.session.create({ title: `parent-${fixture.runID}` })
    const before = await teammate.listTeammateSessions({ parentSessionID: parent.id }, report, client.value)
    expect(before.ok).toBe(true)
    if (!before.ok) {
      return
    }

    const launched = await lifecycle.launchTeammate(
      {
        name: fixture.nextName("runner"),
        agentType: "general",
        description: "integration launch",
        prompt: "hello",
        parentSessionID: parent.id,
      },
      report,
      client.value,
    )

    expect(launched.ok).toBe(false)
    if (!launched.ok) {
      expect(launched.error.code).toBe("FORK_CAPABILITY_REQUIRED")
      expect(launched.error.capability).toBe("background-launch")
    }

    const after = await teammate.listTeammateSessions({ parentSessionID: parent.id }, report, client.value)
    expect(after.ok).toBe(true)
    if (after.ok) {
      expect(after.value.length).toBe(before.value.length)
    }
  })

  test("T-28 sendTeammateMessage hard-fails when background-launch capability unavailable", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await lifecycle.sendTeammateMessage(
      {
        targetSessionID: "ses_target",
        fromSessionID: "ses_source",
        content: "hello",
      },
      report,
      client.value,
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("FORK_CAPABILITY_REQUIRED")
      expect(result.error.capability).toBe("background-launch")
    }
  })

  test("T-31 tagMessageProvenance returns FORK_CAPABILITY_REQUIRED on composition-only runtime", async () => {
    const fixture = createCompositionFixture()
    const report = makeCompositionOnlyReport(fixture.serverUrl)
    const seam = await loadCompositionSeamModule()
    const provenance = await loadProvenanceModule()
    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })

    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await provenance.tagMessageProvenance(
      "msg_test",
      {
        source: "parent",
        sourceSessionID: "ses_parent",
        sourceName: "director",
      },
      report,
      client.value,
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("FORK_CAPABILITY_REQUIRED")
      expect(result.error.capability).toBe("message-provenance")
    }
  })
})
