import { join } from "node:path"
import { requireCompositionSurface } from "./integration-probe"
import { recordSpan } from "./observability"
import { addMessage, createSession, getStore, listChildren } from "./state"
import type {
  CapabilityReport,
  ComposedToolDef,
  CompositionError,
  HarnessPluginDef,
  LoadedSkill,
  OpencodeSDKClient,
  Result,
  SessionCreateInput,
  SessionInfo,
} from "./types"

declare const Bun: {
  Glob: new (pattern: string) => {
    scan(options: { cwd: string; absolute?: boolean }): AsyncIterable<string>
  }
  file(path: string): { text(): Promise<string> }
}

const SKILL_GLOB = new Bun.Glob("skills/**/SKILL.md")

function invalidPlugin(name: string, message: string): Result<void, CompositionError> {
  return {
    ok: false,
    error: {
      code: "INVALID_PLUGIN_DEFINITION",
      name,
      message,
    },
  }
}

function parseFrontmatter(
  markdown: string,
): Result<{ name: string; description: string; content: string }, CompositionError> {
  if (!markdown.startsWith("---\n")) {
    return {
      ok: false,
      error: {
        code: "SKILL_PARSE_FAILED",
        path: "unknown",
        message: "missing frontmatter start",
      },
    }
  }
  const end = markdown.indexOf("\n---\n", 4)
  if (end < 0) {
    return {
      ok: false,
      error: {
        code: "SKILL_PARSE_FAILED",
        path: "unknown",
        message: "missing frontmatter end",
      },
    }
  }
  const frontmatter = markdown.slice(4, end)
  const content = markdown.slice(end + 5)
  let name = ""
  let description = ""
  for (const line of frontmatter.split("\n")) {
    const [key, ...rest] = line.split(":")
    const value = rest.join(":").trim()
    if (key.trim() === "name") {
      name = value
    }
    if (key.trim() === "description") {
      description = value
    }
  }
  if (!name) {
    return {
      ok: false,
      error: {
        code: "SKILL_PARSE_FAILED",
        path: "unknown",
        message: "missing skill name",
      },
    }
  }
  return {
    ok: true,
    value: {
      name,
      description,
      content,
    },
  }
}

async function assertReachable(serverUrl: string, timeoutMs: number): Promise<Result<void, CompositionError>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)
  try {
    await fetch(serverUrl, { signal: controller.signal })
    return { ok: true, value: undefined }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "SDK_CONNECTION_FAILED",
        serverUrl,
        cause: String(error),
      },
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function registerComposedTool(
  tool: ComposedToolDef,
  report: CapabilityReport,
): Promise<Result<void, CompositionError>> {
  const required = requireCompositionSurface(report, "tool-registry")
  if (!required.ok) {
    const message =
      required.error.code === "MISSING_REQUIRED_SURFACE"
        ? required.error.message
        : `Composition surface check failed: ${required.error.code}`
    return {
      ok: false,
      error: {
        code: "INVALID_PLUGIN_DEFINITION",
        name: tool.id,
        message,
      },
    }
  }

  const store = getStore(report.serverUrl)
  if (store.tools.has(tool.id)) {
    return {
      ok: false,
      error: {
        code: "DUPLICATE_TOOL_ID",
        id: tool.id,
      },
    }
  }
  store.tools.set(tool.id, tool)
  recordSpan("harness.composition.tool-register", { tool_id: tool.id, ok: true })
  return { ok: true, value: undefined }
}

export async function registerHarnessPlugin(
  plugin: HarnessPluginDef,
  report: CapabilityReport,
): Promise<Result<void, CompositionError>> {
  const required = requireCompositionSurface(report, "plugin-hooks")
  if (!required.ok) {
    const message =
      required.error.code === "MISSING_REQUIRED_SURFACE"
        ? required.error.message
        : `Composition surface check failed: ${required.error.code}`
    return invalidPlugin(plugin.name ?? "unknown", message)
  }

  if (!plugin.name || plugin.name.trim().length === 0) {
    return invalidPlugin("unknown", "plugin name is required")
  }

  if (plugin.hooks && typeof plugin.hooks !== "object") {
    return invalidPlugin(plugin.name, "hooks must be an object")
  }

  if (plugin.tools) {
    for (const tool of Object.values(plugin.tools)) {
      const registered = await registerComposedTool(tool, report)
      if (!registered.ok && registered.error.code !== "DUPLICATE_TOOL_ID") {
        return registered
      }
    }
  }

  const store = getStore(report.serverUrl)
  store.plugins.set(plugin.name, plugin)
  recordSpan("harness.composition.plugin-register", {
    plugin_name: plugin.name,
    tool_count: plugin.tools ? Object.keys(plugin.tools).length : 0,
    hook_count: plugin.hooks ? Object.keys(plugin.hooks).length : 0,
    ok: true,
  })
  return { ok: true, value: undefined }
}

export async function loadDeployedSkills(options?: {
  readonly additionalRoots?: ReadonlyArray<string>
}): Promise<Result<ReadonlyArray<LoadedSkill>, CompositionError>> {
  const roots = options?.additionalRoots ?? []
  const loaded: LoadedSkill[] = []

  for (const root of roots) {
    for await (const match of SKILL_GLOB.scan({ cwd: root, absolute: true })) {
      const location = String(match)
      const markdown = await Bun.file(location).text()
      const parsed = parseFrontmatter(markdown)
      if (!parsed.ok) {
        return {
          ok: false,
          error: {
            code: "SKILL_PARSE_FAILED",
            path: location,
            message: "message" in parsed.error ? parsed.error.message : parsed.error.code,
          },
        }
      }
      loaded.push({
        name: parsed.value.name,
        description: parsed.value.description,
        location,
        content: parsed.value.content,
      })
    }
  }

  recordSpan("harness.composition.skill-load", {
    root_count: roots.length,
    skills_found: loaded.length,
    skills_failed: 0,
  })
  return { ok: true, value: loaded }
}

export async function createHarnessSDKClient(config: {
  readonly serverUrl: string
  readonly directory: string
  readonly signal?: AbortSignal
}): Promise<Result<OpencodeSDKClient, CompositionError>> {
  const connectivity = await assertReachable(config.serverUrl, 1200)
  if (!connectivity.ok) {
    recordSpan("harness.composition.sdk-connect", {
      server_url: config.serverUrl,
      ok: false,
      error: connectivity.error.code,
    })
    return connectivity
  }

  const store = getStore(config.serverUrl)

  const client: OpencodeSDKClient = {
    session: {
      async create(input: SessionCreateInput) {
        const created = createSession(store, input)
        return {
          id: created.id,
          slug: created.slug,
        }
      },
      async get(sessionID: string) {
        return store.sessions.get(sessionID) ?? null
      },
      async list() {
        return Array.from(store.sessions.values())
      },
      async children(parentSessionID: string, active?: boolean) {
        return listChildren(store, parentSessionID, active)
      },
      async prompt(sessionID: string, message: string) {
        addMessage(store, sessionID, {
          fromSessionID: sessionID,
          content: message,
        })
      },
    },
    teammate: {
      async sendMessage(input) {
        addMessage(store, input.targetSessionID, {
          fromSessionID: input.fromSessionID,
          content: input.content,
          sourceName: input.sourceName,
        })
      },
      async listMessages(sessionID: string) {
        return store.messages.get(sessionID) ?? []
      },
    },
  }

  if (store.sessions.size === 0) {
    createSession(store, {
      title: join(config.directory, "bootstrap"),
    })
  }

  recordSpan("harness.composition.sdk-connect", { server_url: config.serverUrl, ok: true })
  return { ok: true, value: client }
}

export type { SessionInfo }
