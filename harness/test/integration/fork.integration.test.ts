import { describe, expect, test } from "bun:test"
import { makeForkAvailableReport } from "../helpers/contracts"
import { createForkFixture } from "../helpers/fixture"
import {
  loadAsyncLifecycleModule,
  loadCompositionSeamModule,
  loadIntegrationProbeModule,
  loadProvenanceModule,
} from "../helpers/module-loader"

const forkEnabled = Boolean(process.env.OPENCODE_FORK_SERVER_URL)
const forkTest = forkEnabled ? test : test.skip

describe("fork integration contracts", () => {
  forkTest("T-02 fork-enabled runtime reports mode fork-available", async () => {
    const fixture = createForkFixture()
    const probe = await loadIntegrationProbeModule()

    const result = await probe.probeIntegrationCapabilities(fixture.serverUrl)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.mode).toBe("fork-available")
      expect(result.value.fork.some((item: { available: boolean }) => item.available)).toBe(true)
    }
  })

  forkTest("T-26 launch on fork-enabled runtime returns immediate running status", async () => {
    const fixture = createForkFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()
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
    const startedAt = Date.now()
    const launched = await lifecycle.launchTeammate(
      {
        name: fixture.nextName("fork-launch"),
        agentType: "general",
        description: "fork launch",
        prompt: "say hello",
        parentSessionID: parent.id,
      },
      report.value,
      client.value,
    )
    const elapsedMs = Date.now() - startedAt

    expect(launched.ok).toBe(true)
    if (launched.ok) {
      expect(launched.value.status).toBe("running")
    }
    expect(elapsedMs).toBeLessThan(1000)
  })

  forkTest("T-27 status APIs return structured teammate status when fork-enabled", async () => {
    const fixture = createForkFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()

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

    const list = await lifecycle.listTeammateStatuses("ses_any_parent", report.value, client.value)
    expect(list.ok).toBe(true)
    if (list.ok && list.value.length > 0) {
      const one = await lifecycle.getTeammateStatus(list.value[0].sessionID, report.value, client.value)
      expect(one.ok).toBe(true)
    }
  })

  forkTest("T-29 sendTeammateMessage delivers without wrapper when provenance fork unavailable", async () => {
    const fixture = createForkFixture()
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()
    const report = makeForkAvailableReport({
      serverUrl: fixture.serverUrl,
      availableCapabilities: ["background-launch"],
    })

    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })
    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await lifecycle.sendTeammateMessage(
      {
        fromSessionID: "ses_parent",
        targetSessionID: "ses_child",
        sourceName: "director",
        content: "check status",
      },
      report,
      client.value,
    )

    expect(result).toEqual({ ok: true, value: undefined })
  })

  forkTest("T-30 stopTeammate and signalTeammateDone are fork-gated and idempotent on stopped sessions", async () => {
    const fixture = createForkFixture()
    const probe = await loadIntegrationProbeModule()
    const seam = await loadCompositionSeamModule()
    const lifecycle = await loadAsyncLifecycleModule()

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

    const firstStop = await lifecycle.stopTeammate("ses_already_stopped", report.value, client.value)
    const secondStop = await lifecycle.stopTeammate("ses_already_stopped", report.value, client.value)
    const done = await lifecycle.signalTeammateDone(
      {
        sessionID: "ses_already_stopped",
        summary: "done",
      },
      report.value,
      client.value,
    )

    expect(firstStop.ok).toBe(true)
    expect(secondStop.ok).toBe(false)
    if (!secondStop.ok) {
      expect(secondStop.error.code).toBe("TEAMMATE_ALREADY_STOPPED")
    }
    expect(done).toEqual({ ok: true, value: undefined })
  })

  forkTest("T-32 tagMessageProvenance rejects invalid source values", async () => {
    const fixture = createForkFixture()
    const seam = await loadCompositionSeamModule()
    const provenance = await loadProvenanceModule()
    const report = makeForkAvailableReport({ serverUrl: fixture.serverUrl })

    const client = await seam.createHarnessSDKClient({ serverUrl: fixture.serverUrl, directory: process.cwd() })
    expect(client.ok).toBe(true)
    if (!client.ok) {
      return
    }

    const result = await provenance.tagMessageProvenance(
      "msg_invalid",
      {
        source: "invalid-source",
      },
      report,
      client.value,
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_SOURCE")
    }
  })
})
