import path from "node:path"
import { parseLaunchOptions, launch } from "./features/launch"
import { isErr } from "./shared/result"

/**
 * When --worktree points to a different worktree, re-exec from that worktree's
 * engine so ALL of its code runs -- not just the platform/config/authoring paths.
 * Without this, the engine code always runs from whichever worktree owns the
 * renkei binary, and --worktree only redirects resolution paths.
 */
async function reexecIfNeeded(worktreeOverride: string | undefined): Promise<void> {
  if (worktreeOverride === undefined) return

  const targetIndex = path.resolve(worktreeOverride, "engine", "src", "index.ts")
  const currentIndex = path.resolve(import.meta.dirname, "index.ts")
  if (targetIndex === currentIndex) return

  const proc = Bun.spawn(["bun", "run", targetIndex, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
    env: process.env,
  })
  const exitCode = await proc.exited
  process.exit(exitCode ?? 1)
}

async function main(): Promise<void> {
  const parseResult = parseLaunchOptions(process.argv.slice(2))
  if (isErr(parseResult)) {
    const error = parseResult.error
    console.error(`renkei: ${error.message}`)
    process.exit(1)
  }

  const opts = parseResult.value
  await reexecIfNeeded(opts.worktreeOverride)

  const scriptDir = import.meta.dirname

  const result = await launch(opts, scriptDir)
  // launch() only returns on error -- success replaces the process
  if (isErr(result)) {
    const error = result.error
    if (error.tag === "LaunchFailed" && error.exitCode === 0) {
      process.exit(0)
    }
    console.error(`renkei: ${error.message}`)
    if (error.tag === "LaunchFailed" && error.exitCode !== null) {
      process.exit(error.exitCode)
    }
    process.exit(1)
  }
}

main()
