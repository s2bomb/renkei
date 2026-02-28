import { parseLaunchOptions, launch } from "./features/launch"
import { isErr } from "./shared/result"

async function main(): Promise<void> {
  const parseResult = parseLaunchOptions(process.argv.slice(2))
  if (isErr(parseResult)) {
    const error = parseResult.error
    console.error(`renkei: ${error.message}`)
    process.exit(1)
  }

  const opts = parseResult.value
  const scriptDir = import.meta.dirname

  const result = await launch(opts, scriptDir)
  // launch() only returns on error -- success replaces the process
  if (isErr(result)) {
    const error = result.error
    console.error(`renkei: ${error.message}`)
    if (error.tag === "LaunchFailed" && error.exitCode !== null) {
      process.exit(error.exitCode)
    }
    process.exit(1)
  }
}

main()
