import { parseRenkeiDevArgs, runRenkeiDevCommand } from "./renkei-dev"

declare const process: {
  readonly argv: ReadonlyArray<string>
  exit(code: number): never
}

const args = parseRenkeiDevArgs(process.argv.slice(2))
const exitCode = await runRenkeiDevCommand(args)
process.exit(exitCode)
