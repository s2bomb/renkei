import { COMPOSITION_SURFACE_IDS, type CompositionSurfaceID, type Result } from "./types"

declare const Bun: {
  file(path: string): {
    exists(): Promise<boolean>
    text(): Promise<string>
  }
}

export type ApprovedSurfaceEntry = {
  readonly id: CompositionSurfaceID
  readonly seam: "tool-registry" | "plugin-hooks" | "skill-load" | "sdk-client"
  readonly upstreamSurface: string
  readonly rationale: string
}

export type ApprovedSurfaceRegistry = {
  readonly version: "2026-02-19"
  readonly sourcePath: string
  readonly generatedAtMs: number
  readonly entries: ReadonlyArray<ApprovedSurfaceEntry>
}

export type ApprovedSurfaceRegistryError =
  | { readonly code: "APPROVED_SURFACE_REGISTRY_NOT_FOUND"; readonly path: string }
  | { readonly code: "APPROVED_SURFACE_REGISTRY_INVALID"; readonly path: string; readonly detail: string }
  | { readonly code: "APPROVED_SURFACE_DUPLICATE_ID"; readonly id: string }
  | { readonly code: "APPROVED_SURFACE_EMPTY"; readonly path: string }

export type ApprovedSurfaceRegistryDependencies = {
  readonly nowMs: () => number
  readonly readTextFile: (path: string) => Promise<Result<string, ApprovedSurfaceRegistryError>>
}

type ParsedEntry = {
  readonly id: string
  readonly seam: string
  readonly upstreamSurface: string
  readonly rationale: string
}

type ParsedRegistry = {
  readonly version: string
  readonly entries: ReadonlyArray<ParsedEntry>
}

const ALLOWED_SURFACE_IDS = new Set<string>(COMPOSITION_SURFACE_IDS)

function toInvalid(path: string, detail: string): Result<never, ApprovedSurfaceRegistryError> {
  return {
    ok: false,
    error: {
      code: "APPROVED_SURFACE_REGISTRY_INVALID",
      path,
      detail,
    },
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseRegistry(sourcePath: string, json: string): Result<ParsedRegistry, ApprovedSurfaceRegistryError> {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (error) {
    return toInvalid(sourcePath, `Failed to parse JSON: ${String(error)}`)
  }

  if (!isObject(parsed)) {
    return toInvalid(sourcePath, "Registry payload must be an object")
  }

  const version = parsed.version
  if (version !== "2026-02-19") {
    return toInvalid(sourcePath, "Registry version must be 2026-02-19")
  }

  const entriesRaw = parsed.entries
  if (!Array.isArray(entriesRaw)) {
    return toInvalid(sourcePath, "Registry entries must be an array")
  }

  const entries: ParsedEntry[] = []
  for (let index = 0; index < entriesRaw.length; index += 1) {
    const entry = entriesRaw[index]
    if (!isObject(entry)) {
      return toInvalid(sourcePath, `Registry entry at index ${index} must be an object`)
    }

    const id = entry.id
    const seam = entry.seam
    const upstreamSurface = entry.upstreamSurface
    const rationale = entry.rationale
    if (
      typeof id !== "string" ||
      typeof seam !== "string" ||
      typeof upstreamSurface !== "string" ||
      typeof rationale !== "string"
    ) {
      return toInvalid(sourcePath, `Registry entry at index ${index} is missing required string fields`)
    }

    entries.push({ id, seam, upstreamSurface, rationale })
  }

  return {
    ok: true,
    value: {
      version,
      entries,
    },
  }
}

function toTypedEntries(entries: ReadonlyArray<ParsedEntry>): ReadonlyArray<ApprovedSurfaceEntry> {
  return entries.map((entry) => ({
    id: entry.id as CompositionSurfaceID,
    seam: entry.seam as ApprovedSurfaceEntry["seam"],
    upstreamSurface: entry.upstreamSurface,
    rationale: entry.rationale,
  }))
}

async function defaultReadTextFile(path: string): Promise<Result<string, ApprovedSurfaceRegistryError>> {
  const file = Bun.file(path)
  if (!(await file.exists())) {
    return {
      ok: false,
      error: {
        code: "APPROVED_SURFACE_REGISTRY_NOT_FOUND",
        path,
      },
    }
  }

  try {
    const value = await file.text()
    return { ok: true, value }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "APPROVED_SURFACE_REGISTRY_INVALID",
        path,
        detail: `Failed to read registry file: ${String(error)}`,
      },
    }
  }
}

export function verifyApprovedSurfaceRegistry(
  registry: ApprovedSurfaceRegistry,
): Result<true, ApprovedSurfaceRegistryError> {
  if (registry.entries.length === 0) {
    return {
      ok: false,
      error: {
        code: "APPROVED_SURFACE_EMPTY",
        path: registry.sourcePath,
      },
    }
  }

  const seen = new Set<string>()
  for (const entry of registry.entries) {
    if (!ALLOWED_SURFACE_IDS.has(entry.id)) {
      return {
        ok: false,
        error: {
          code: "APPROVED_SURFACE_REGISTRY_INVALID",
          path: registry.sourcePath,
          detail: `Unknown approved surface id: ${entry.id}`,
        },
      }
    }

    if (seen.has(entry.id)) {
      return {
        ok: false,
        error: {
          code: "APPROVED_SURFACE_DUPLICATE_ID",
          id: entry.id,
        },
      }
    }

    seen.add(entry.id)
  }

  return { ok: true, value: true }
}

export async function loadApprovedSurfaceRegistry(
  sourcePath: string,
  deps?: Partial<ApprovedSurfaceRegistryDependencies>,
): Promise<Result<ApprovedSurfaceRegistry, ApprovedSurfaceRegistryError>> {
  const runtimeDeps: ApprovedSurfaceRegistryDependencies = {
    nowMs: Date.now,
    readTextFile: defaultReadTextFile,
    ...deps,
  }

  const source = await runtimeDeps.readTextFile(sourcePath)
  if (!source.ok) {
    return source
  }

  const parsed = parseRegistry(sourcePath, source.value)
  if (!parsed.ok) {
    return parsed
  }

  const registry: ApprovedSurfaceRegistry = {
    version: "2026-02-19",
    sourcePath,
    generatedAtMs: runtimeDeps.nowMs(),
    entries: toTypedEntries(parsed.value.entries),
  }

  const verified = verifyApprovedSurfaceRegistry(registry)
  if (!verified.ok) {
    return verified
  }

  return {
    ok: true,
    value: registry,
  }
}
