import type { WorktreeResolution, EngineConfig, LaunchOptions, LaunchEnvironment } from "../../../src/shared/types"
import type { ChildSessionCapabilities } from "../../../src/adapters/session-capabilities"

export function resolution(overrides?: Partial<WorktreeResolution>): WorktreeResolution {
  return {
    sourcePath: "/home/user/renkei/dev",
    enginePath: "/home/user/renkei/dev/engine",
    platformPath: "/home/user/renkei/dev/platform",
    authoringPath: "/home/user/renkei/dev/authoring",
    bareRepoPath: "/home/user/renkei/renkei.git",
    isOverride: false,
    ...overrides,
  }
}

export function engineConfig(overrides?: Partial<EngineConfig>): EngineConfig {
  return {
    skillPaths: [],
    pluginPath: "/home/user/renkei/dev/engine/.opencode/plugins/renkei.ts",
    configDirPath: "/home/user/renkei/dev/engine/.opencode",
    agentDefinitions: [],
    ...overrides,
  }
}

export function launchOptions(overrides?: Partial<LaunchOptions>): LaunchOptions {
  return {
    worktreeOverride: undefined,
    projectDir: undefined,
    passthroughArgs: [],
    ...overrides,
  }
}

export function launchEnvironment(overrides?: Partial<LaunchEnvironment>): LaunchEnvironment {
  return {
    OPENCODE_CONFIG_CONTENT: '{"skills":{"paths":[]}}',
    OPENCODE_CONFIG_DIR: "/home/user/renkei/dev/engine/.opencode",
    RENKEI_ENGINE_SOURCE: "/home/user/renkei/dev",
    RENKEI_WORKTREE_OVERRIDE: undefined,
    RENKEI_SESSION_CAPABILITIES: "override",
    ...overrides,
  }
}

/**
 * Factory for upstream child session defaults (the "before engine override" state).
 * Prompt hidden, exit keybind active, all modes permissive.
 */
export function childSessionDefaults(overrides?: Partial<ChildSessionCapabilities>): ChildSessionCapabilities {
  return {
    promptVisible: false,
    sidebarVisible: false,
    permissionsEnabled: false,
    questionsEnabled: false,
    exitKeybindActive: true,
    submissionMethod: "sync",
    shellModeAllowed: true,
    commandsAllowed: true,
    agentCyclingAllowed: true,
    variantCyclingAllowed: true,
    ...overrides,
  }
}
