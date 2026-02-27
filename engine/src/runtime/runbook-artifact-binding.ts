import type { Result } from "./types"
import type {
  RunbookCommandID,
  RunbookArtifactFormat,
  RunbookArtifactBindingInput,
  RunbookArtifactBindingSuccess,
  RunbookArtifactBindingError,
  RunbookArtifactBindingDependencies,
  SectionESmokeRunbookContract,
} from "./operator-runbook-contract"

export type {
  RunbookArtifactFormat,
  RunbookArtifactBindingInput,
  RunbookArtifactBindingSuccess,
  RunbookArtifactBindingError,
  RunbookArtifactBindingDependencies,
}

const BINDING_PREFIX = "generated-from:section-e.v1:"

function defaultSerializeCommandIDs(contract: SectionESmokeRunbookContract): string {
  return contract.commandSequence.map((s) => s.id).join(",")
}

export function verifyRunbookArtifactGeneratedFromContract(
  input: RunbookArtifactBindingInput,
  deps?: Partial<RunbookArtifactBindingDependencies>,
): Result<RunbookArtifactBindingSuccess, RunbookArtifactBindingError> {
  const nowMs = deps?.nowMs ?? Date.now
  const serializeCommandIDs = deps?.serializeCommandIDs ?? defaultSerializeCommandIDs

  if (input.artifact === "") {
    return { ok: false, error: { code: "RUNBOOK_BINDING_ARTIFACT_EMPTY" } }
  }

  const expectedBindingTag = BINDING_PREFIX + serializeCommandIDs(input.contract)

  const prefixIdx = input.artifact.indexOf(BINDING_PREFIX)
  if (prefixIdx === -1) {
    return {
      ok: false,
      error: { code: "RUNBOOK_BINDING_TAG_MISSING", expectedBindingTag },
    }
  }

  // Extract serialized ID list from artifact tag.
  // IDs contain alphanumeric chars, colons, and hyphens; commas are separators between IDs.
  // Terminate at any character not in this allowed set (whitespace, quotes, brackets, etc.)
  const afterPrefix = input.artifact.slice(prefixIdx + BINDING_PREFIX.length)
  const match = afterPrefix.match(/^[a-zA-Z0-9:,-]+/)
  const serializedIds = match ? match[0] : ""
  const artifactIds = serializedIds.split(",").filter((s) => s.length > 0)

  const contractIds = input.contract.commandSequence.map((s) => s.id)
  const contractSet = new Set<string>(contractIds)
  const artifactSet = new Set<string>(artifactIds)

  const missing = contractIds.filter((id) => !artifactSet.has(id)) as RunbookCommandID[]
  const extra = artifactIds.filter((id) => !contractSet.has(id))

  if (missing.length > 0 || extra.length > 0) {
    return {
      ok: false,
      error: {
        code: "RUNBOOK_BINDING_COMMAND_ID_SET_MISMATCH",
        missing,
        extra,
      },
    }
  }

  return {
    ok: true,
    value: {
      checkedAtMs: nowMs(),
      pass: true,
      format: input.format,
      expectedBindingTag,
    },
  }
}
