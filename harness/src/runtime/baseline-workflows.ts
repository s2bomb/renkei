import { spawn } from "node:child_process"
import type { Result } from "./types"

export type SectionDBaselineWorkflowID =
  | "quality:typecheck"
  | "quality:lint"
  | "quality:test-unit"
  | "runtime:renkei-dev-json"
  | "quality:test-integration"

export type SectionDBaselineWorkflow = {
  readonly id: SectionDBaselineWorkflowID
  readonly command: ReadonlyArray<string>
  readonly requiresLiveServer: boolean
  readonly expectedExitCode: 0
}

export type WorkflowCommandResult = {
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
}

export type WorkflowSignoffFailure =
  | {
      readonly code: "WORKFLOW_SIGNOFF_LIST_EMPTY"
    }
  | {
      readonly code: "WORKFLOW_SIGNOFF_DUPLICATE_ID"
      readonly id: string
    }
  | {
      readonly code: "WORKFLOW_SIGNOFF_COMMAND_FAILED"
      readonly workflowID: SectionDBaselineWorkflowID
      readonly expectedExitCode: 0
      readonly actualExitCode: number
      readonly stderr: string
    }
  | {
      readonly code: "WORKFLOW_SIGNOFF_LIVE_SERVER_REQUIRED"
      readonly workflowID: SectionDBaselineWorkflowID
      readonly envVar: "OPENCODE_SERVER_URL"
    }

export type WorkflowSignoffReport = {
  readonly checkedAtMs: number
  readonly pass: true
  readonly workflows: ReadonlyArray<{
    readonly id: SectionDBaselineWorkflowID
    readonly command: ReadonlyArray<string>
    readonly ok: true
    readonly exitCode: 0
  }>
}

export type WorkflowSignoffDependencies = {
  readonly nowMs: () => number
  readonly hasEnvVar: (name: "OPENCODE_SERVER_URL") => boolean
  readonly runCommand: (command: ReadonlyArray<string>) => Promise<WorkflowCommandResult>
}

const CANONICAL_WORKFLOWS: ReadonlyArray<SectionDBaselineWorkflow> = [
  {
    id: "quality:typecheck",
    command: ["bun", "run", "typecheck"],
    requiresLiveServer: false,
    expectedExitCode: 0,
  },
  {
    id: "quality:lint",
    command: ["bun", "run", "lint"],
    requiresLiveServer: false,
    expectedExitCode: 0,
  },
  {
    id: "quality:test-unit",
    command: ["bun", "run", "test:unit"],
    requiresLiveServer: false,
    expectedExitCode: 0,
  },
  {
    id: "runtime:renkei-dev-json",
    command: ["bun", "run", "renkei-dev", "--", "--json"],
    requiresLiveServer: true,
    expectedExitCode: 0,
  },
  {
    id: "quality:test-integration",
    command: ["bun", "run", "test:integration"],
    requiresLiveServer: true,
    expectedExitCode: 0,
  },
]

function defaultHasEnvVar(name: "OPENCODE_SERVER_URL"): boolean {
  const value = process.env[name]
  return typeof value === "string" && value.trim().length > 0
}

function defaultRunCommand(command: ReadonlyArray<string>): Promise<WorkflowCommandResult> {
  return new Promise((resolve) => {
    const [bin, ...args] = command
    if (!bin) {
      resolve({
        exitCode: 1,
        stdout: "",
        stderr: "Command is empty",
      })
      return
    }

    let stdout = ""
    let stderr = ""
    const child = spawn(bin, args, { cwd: process.cwd() })

    child.stdout?.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })
    child.stderr?.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })
    child.on("error", (error) => {
      resolve({
        exitCode: 1,
        stdout,
        stderr: stderr || String(error),
      })
    })
    child.on("close", (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
      })
    })
  })
}

function mergeDependencies(deps?: Partial<WorkflowSignoffDependencies>): WorkflowSignoffDependencies {
  return {
    nowMs: deps?.nowMs ?? Date.now,
    hasEnvVar: deps?.hasEnvVar ?? defaultHasEnvVar,
    runCommand: deps?.runCommand ?? defaultRunCommand,
  }
}

export function defaultSectionDBaselineWorkflows(): ReadonlyArray<SectionDBaselineWorkflow> {
  return CANONICAL_WORKFLOWS
}

export async function evaluateSectionDBaselineWorkflows(
  workflows: ReadonlyArray<SectionDBaselineWorkflow>,
  deps?: Partial<WorkflowSignoffDependencies>,
): Promise<Result<WorkflowSignoffReport, WorkflowSignoffFailure>> {
  if (workflows.length === 0) {
    return {
      ok: false,
      error: {
        code: "WORKFLOW_SIGNOFF_LIST_EMPTY",
      },
    }
  }

  const seenIDs = new Set<string>()
  for (const workflow of workflows) {
    if (seenIDs.has(workflow.id)) {
      return {
        ok: false,
        error: {
          code: "WORKFLOW_SIGNOFF_DUPLICATE_ID",
          id: workflow.id,
        },
      }
    }
    seenIDs.add(workflow.id)
  }

  const runtimeDeps = mergeDependencies(deps)
  const rows: Array<{
    readonly id: SectionDBaselineWorkflowID
    readonly command: ReadonlyArray<string>
    readonly ok: true
    readonly exitCode: 0
  }> = []

  for (const workflow of workflows) {
    if (workflow.requiresLiveServer && !runtimeDeps.hasEnvVar("OPENCODE_SERVER_URL")) {
      return {
        ok: false,
        error: {
          code: "WORKFLOW_SIGNOFF_LIVE_SERVER_REQUIRED",
          workflowID: workflow.id,
          envVar: "OPENCODE_SERVER_URL",
        },
      }
    }

    const commandResult = await runtimeDeps.runCommand(workflow.command)
    if (commandResult.exitCode !== workflow.expectedExitCode) {
      return {
        ok: false,
        error: {
          code: "WORKFLOW_SIGNOFF_COMMAND_FAILED",
          workflowID: workflow.id,
          expectedExitCode: workflow.expectedExitCode,
          actualExitCode: commandResult.exitCode,
          stderr: commandResult.stderr,
        },
      }
    }

    rows.push({
      id: workflow.id,
      command: workflow.command,
      ok: true,
      exitCode: 0,
    })
  }

  return {
    ok: true,
    value: {
      checkedAtMs: runtimeDeps.nowMs(),
      pass: true,
      workflows: rows,
    },
  }
}
