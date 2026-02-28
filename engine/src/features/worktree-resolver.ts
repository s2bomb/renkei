import type { Result } from "../shared/result"
import type { WorktreeResolution, WorktreeResolveInput } from "../shared/types"
import type { WorktreeError } from "../shared/errors"

export async function resolveWorktree(
  opts: WorktreeResolveInput,
): Promise<Result<WorktreeResolution, WorktreeError>> {
  throw new Error("not implemented")
}
