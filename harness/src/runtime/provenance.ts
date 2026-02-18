import { resolveForkThreshold } from "./fork-threshold"
import { hasForkCapability } from "./integration-probe"
import { recordSpan } from "./observability"
import type {
  CapabilityReport,
  OpencodeSDKClient,
  PromptWrapperInput,
  ProvenanceError,
  ProvenanceMetadata,
  Result,
} from "./types"

function isMessageSource(source: unknown): source is ProvenanceMetadata["source"] {
  return source === "human" || source === "parent" || source === "child"
}

function requireCapability(
  report: CapabilityReport,
  capability: "message-provenance" | "prompt-wrapper",
): Result<void, ProvenanceError> {
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

export async function tagMessageProvenance(
  messageID: string,
  provenance: ProvenanceMetadata,
  report: CapabilityReport,
  _client: OpencodeSDKClient,
): Promise<Result<void, ProvenanceError>> {
  if (!isMessageSource((provenance as { source?: unknown }).source)) {
    return {
      ok: false,
      error: {
        code: "INVALID_SOURCE",
        source: String((provenance as { source?: unknown }).source),
      },
    }
  }

  const gate = requireCapability(report, "message-provenance")
  if (!gate.ok) {
    return gate
  }

  if (!messageID || messageID.trim().length === 0) {
    return {
      ok: false,
      error: {
        code: "MESSAGE_NOT_FOUND",
        messageID,
      },
    }
  }

  recordSpan("harness.provenance.tag", {
    message_id: messageID,
    source: provenance.source,
    source_session_id: provenance.sourceSessionID,
    ok: true,
  })
  return { ok: true, value: undefined }
}

export function wrapPromptContent(
  input: PromptWrapperInput,
  report: CapabilityReport,
): Result<string, ProvenanceError> {
  const gate = requireCapability(report, "prompt-wrapper")
  if (!gate.ok) {
    return gate
  }

  const wrapped =
    input.role === "parent"
      ? `<parent-agent-message name="${input.name}">\n${input.content}\n</parent-agent-message>`
      : `<child-agent-message name="${input.name}" session-id="${input.sessionID}">\n${input.content}\n</child-agent-message>`

  recordSpan("harness.provenance.wrap", {
    role: input.role,
    name: input.name,
    fork_available: true,
    ok: true,
  })
  return { ok: true, value: wrapped }
}

export function parseProvenanceFromMessage(rawMessage: unknown): Result<ProvenanceMetadata | null, ProvenanceError> {
  if (!rawMessage || typeof rawMessage !== "object") {
    return { ok: true, value: null }
  }

  const source = (rawMessage as { source?: unknown }).source
  if (source === undefined || source === null) {
    return { ok: true, value: null }
  }
  if (!isMessageSource(source)) {
    return {
      ok: false,
      error: {
        code: "INVALID_SOURCE",
        source: String(source),
      },
    }
  }

  const sourceSessionID = (rawMessage as { sourceSessionID?: unknown }).sourceSessionID
  const sourceName = (rawMessage as { sourceName?: unknown }).sourceName
  return {
    ok: true,
    value: {
      source,
      sourceSessionID: typeof sourceSessionID === "string" ? sourceSessionID : undefined,
      sourceName: typeof sourceName === "string" ? sourceName : undefined,
    },
  }
}
