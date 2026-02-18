import { resolveForkThreshold } from "./fork-threshold"
import { hasForkCapability } from "./integration-probe"
import { recordSpan } from "./observability"
import { archiveSession, getStore } from "./state"
import type {
  AsyncLifecycleError,
  CapabilityReport,
  LaunchTeammateInput,
  OpencodeSDKClient,
  Result,
  SendMessageInput,
  SessionID,
  TeammateStatus,
} from "./types"

function requireBackgroundLaunch(report: CapabilityReport): Result<void, AsyncLifecycleError> {
  if (hasForkCapability(report, "background-launch")) {
    return { ok: true, value: undefined }
  }
  return {
    ok: false,
    error: {
      code: "FORK_CAPABILITY_REQUIRED",
      capability: "background-launch",
      threshold: resolveForkThreshold("background-launch"),
    },
  }
}

function defaultRunningStatus(sessionID: SessionID, name: string): Extract<TeammateStatus, { status: "running" }> {
  return {
    status: "running",
    sessionID,
    name,
  }
}

export async function launchTeammate(
  input: LaunchTeammateInput,
  report: CapabilityReport,
  client: OpencodeSDKClient,
): Promise<Result<TeammateStatus & { status: "running" }, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }

  try {
    const created = await client.session.create({
      parentID: input.parentSessionID,
      title: input.description,
      name: input.name,
    })
    const store = getStore(report.serverUrl)
    const status = defaultRunningStatus(created.id, input.name)
    store.teammateStatuses.set(created.id, status)

    queueMicrotask(async () => {
      try {
        await client.session.prompt(created.id, input.prompt)
      } catch {
        store.teammateStatuses.set(created.id, {
          status: "errored",
          sessionID: created.id,
          name: input.name,
          error: "prompt delivery failed",
        })
      }
    })

    recordSpan("harness.async-lifecycle.launch", {
      teammate_name: input.name,
      agent_type: input.agentType,
      parent_session_id: input.parentSessionID,
      fork_available: true,
      ok: true,
    })
    return { ok: true, value: status }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "LAUNCH_FAILED",
        name: input.name,
        cause: String(error),
      },
    }
  }
}

export async function getTeammateStatus(
  sessionID: SessionID,
  report: CapabilityReport,
  _client: OpencodeSDKClient,
): Promise<Result<TeammateStatus, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }
  const store = getStore(report.serverUrl)
  const status = store.teammateStatuses.get(sessionID)
  if (!status) {
    return {
      ok: false,
      error: {
        code: "TEAMMATE_NOT_FOUND",
        name: sessionID,
        sessionID,
      },
    }
  }
  recordSpan("harness.async-lifecycle.status", {
    session_id: sessionID,
    status: status.status,
  })
  return { ok: true, value: status }
}

export async function listTeammateStatuses(
  _parentSessionID: SessionID,
  report: CapabilityReport,
  _client: OpencodeSDKClient,
): Promise<Result<ReadonlyArray<TeammateStatus>, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }
  const store = getStore(report.serverUrl)
  return { ok: true, value: Array.from(store.teammateStatuses.values()) }
}

export async function sendTeammateMessage(
  input: SendMessageInput,
  report: CapabilityReport,
  client: OpencodeSDKClient,
): Promise<Result<void, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }

  try {
    await client.teammate.sendMessage({
      targetSessionID: input.targetSessionID,
      fromSessionID: input.fromSessionID,
      sourceName: input.sourceName,
      content: input.content,
    })
    recordSpan("harness.async-lifecycle.message", {
      from_session_id: input.fromSessionID,
      target_session_id: input.targetSessionID,
      source_name: input.sourceName,
      ok: true,
    })
    return { ok: true, value: undefined }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "MESSAGE_DELIVERY_FAILED",
        targetSessionID: input.targetSessionID,
        cause: String(error),
      },
    }
  }
}

export async function stopTeammate(
  sessionID: SessionID,
  report: CapabilityReport,
  _client: OpencodeSDKClient,
): Promise<Result<void, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }
  const store = getStore(report.serverUrl)
  const existing = store.teammateStatuses.get(sessionID)
  if (existing?.status === "stopped") {
    return {
      ok: false,
      error: {
        code: "TEAMMATE_ALREADY_STOPPED",
        sessionID,
      },
    }
  }

  const name = existing?.name ?? sessionID
  store.teammateStatuses.set(sessionID, {
    status: "stopped",
    sessionID,
    name,
  })
  archiveSession(store, sessionID)
  recordSpan("harness.async-lifecycle.stop", { session_id: sessionID, ok: true })
  return { ok: true, value: undefined }
}

export async function signalTeammateDone(
  input: { readonly sessionID: SessionID; readonly summary?: string },
  report: CapabilityReport,
  _client: OpencodeSDKClient,
): Promise<Result<void, AsyncLifecycleError>> {
  const gate = requireBackgroundLaunch(report)
  if (!gate.ok) {
    return gate
  }
  const store = getStore(report.serverUrl)
  const previous = store.teammateStatuses.get(input.sessionID)
  store.teammateStatuses.set(input.sessionID, {
    status: "completed",
    sessionID: input.sessionID,
    name: previous?.name ?? input.sessionID,
    result: input.summary ?? "",
  })
  recordSpan("harness.async-lifecycle.done", {
    session_id: input.sessionID,
    has_summary: Boolean(input.summary),
    ok: true,
  })
  return { ok: true, value: undefined }
}
