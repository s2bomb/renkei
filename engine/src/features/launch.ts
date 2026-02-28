import type { Result } from "../shared/result"
import type { LaunchOptions } from "../shared/types"
import type { ParseError } from "../shared/errors"

export function parseLaunchOptions(argv: readonly string[]): Result<LaunchOptions, ParseError> {
  throw new Error("not implemented")
}
