import { resolveForkThreshold } from "./fork-threshold"
import { hasForkCapability } from "./integration-probe"
import { recordSpan } from "./observability"
import type {
  CapabilityReport,
  CreateTeammateSessionInput,
  ListTeammateSessionsInput,
  OpencodeSDKClient,
  Result,
  SessionID,
  TeammateSession,
  TeammateSessionError,
} from "./types"

function requireForkCapability(
  report: CapabilityReport,
  capability: "session-name" | "active-child-query",
): Result<void, TeammateSessionError> {
  if (hasForkCapability(report, capability)) {
    return { ok: true, value: undefined }
  }
  return {
    ok: false,
    error: {
      code: "FORK_CAPABILITY_REQUIRED",
      capability,
      threshold: resolveForkThreshold(capability),
    },
  }
}

function toTeammateSession(value: Awaited<ReturnType<OpencodeSDKClient["session"]["get"]>>): TeammateSession | null {
  if (!value || !value.parentID) {
    return null
  }
  return value as TeammateSession
}

export async function createTeammateSession(
  input: CreateTeammateSessionInput,
  report: CapabilityReport,
  client: OpencodeSDKClient,
): Promise<Result<TeammateSession, TeammateSessionError>> {
  const parent = await client.session.get(input.parentSessionID)
  if (!parent) {
    return {
      ok: false,
      error: {
        code: "PARENT_SESSION_NOT_FOUND",
        parentSessionID: input.parentSessionID,
      },
    }
  }

  let name = input.name
  if (name) {
    const gate = requireForkCapability(report, "session-name")
    if (!gate.ok) {
      console.warn(
        `session-name capability unavailable for parent ${input.parentSessionID}; dropping requested name '${name}'`,
      )
      name = undefined
    }
  }

  try {
    const created = await client.session.create({
      parentID: input.parentSessionID,
      title: input.title ?? `Child session - ${new Date().toISOString()}`,
      name,
    })
    const hydrated = await client.session.get(created.id)
    const teammate = toTeammateSession(hydrated)
    if (!teammate) {
      return {
        ok: false,
        error: {
          code: "SESSION_CREATE_FAILED",
          message: `Failed to hydrate created session ${created.id}`,
        },
      }
    }
    recordSpan("harness.teammate.session.create", {
      parent_session_id: input.parentSessionID,
      agent_type: input.agentType,
      name_requested: Boolean(input.name),
      name_applied: Boolean(name),
      ok: true,
    })
    return { ok: true, value: teammate }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "SESSION_CREATE_FAILED",
        message: String(error),
      },
    }
  }
}

export async function listTeammateSessions(
  input: ListTeammateSessionsInput,
  report: CapabilityReport,
  client: OpencodeSDKClient,
): Promise<Result<ReadonlyArray<TeammateSession>, TeammateSessionError>> {
  const parent = await client.session.get(input.parentSessionID)
  if (!parent) {
    return {
      ok: false,
      error: {
        code: "PARENT_SESSION_NOT_FOUND",
        parentSessionID: input.parentSessionID,
      },
    }
  }

  if (typeof input.active === "boolean") {
    const gate = requireForkCapability(report, "active-child-query")
    if (!gate.ok) {
      return gate
    }
  }

  const children = await client.session.children(input.parentSessionID, input.active)
  const mapped = children.filter((item): item is TeammateSession => Boolean(item.parentID))
  recordSpan("harness.teammate.session.list", {
    parent_session_id: input.parentSessionID,
    active_filter_used: typeof input.active === "boolean",
    result_count: mapped.length,
    ok: true,
  })
  return {
    ok: true,
    value: mapped,
  }
}

export async function getTeammateSession(
  sessionID: SessionID,
  client: OpencodeSDKClient,
): Promise<Result<TeammateSession, TeammateSessionError>> {
  const session = await client.session.get(sessionID)
  const mapped = toTeammateSession(session)
  if (!mapped) {
    return {
      ok: false,
      error: {
        code: "SESSION_NOT_FOUND",
        sessionID,
      },
    }
  }
  recordSpan("harness.teammate.session.get", { session_id: sessionID, ok: true })
  return {
    ok: true,
    value: mapped,
  }
}
