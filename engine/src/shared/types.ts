export interface WorktreeResolution {
  readonly sourcePath: string
  readonly enginePath: string
  readonly platformPath: string
  readonly authoringPath: string
  readonly bareRepoPath: string
  readonly isOverride: boolean
}

export interface LaunchOptions {
  readonly worktreeOverride: string | undefined
  readonly projectDir: string | undefined
  readonly passthroughArgs: readonly string[]
}

export interface EngineConfig {
  readonly skillPaths: readonly string[]
  readonly pluginPath: string
  readonly configDirPath: string
  readonly agentDefinitions: readonly AgentDefinitionRef[]
}

export interface AgentDefinitionRef {
  readonly name: string
  readonly filePath: string
}

export interface LaunchEnvironment {
  readonly OPENCODE_CONFIG_CONTENT: string
  readonly OPENCODE_CONFIG_DIR: string
  readonly RENKEI_ENGINE_SOURCE: string
  readonly RENKEI_WORKTREE_OVERRIDE: string | undefined
}

export interface LaunchCommand {
  readonly command: string
  readonly args: readonly string[]
  readonly env: Readonly<Record<string, string>>
  readonly cwd: string
}

export interface ConfigInjectionInput {
  readonly resolution: WorktreeResolution
  readonly engineConfig: EngineConfig
  readonly worktreeOverride: string | undefined
}

export interface WorktreeResolveInput {
  readonly worktreeOverride: string | undefined
  readonly scriptDir: string
}
