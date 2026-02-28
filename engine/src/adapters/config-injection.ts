import type { Result } from "../shared/result"
import type { ConfigInjectionInput, LaunchEnvironment } from "../shared/types"
import type { ConfigBuildError } from "../shared/errors"

export function buildLaunchEnv(input: ConfigInjectionInput): Result<LaunchEnvironment, ConfigBuildError> {
  throw new Error("not implemented")
}
