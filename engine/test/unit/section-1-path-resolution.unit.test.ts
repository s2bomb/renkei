import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { describe, expect, test } from "bun:test"
import { loadRepoPathResolutionModule } from "../helpers/section-1-module-loader"
import { createSection1RepoFixture } from "../helpers/section-1-fixtures"

describe("unit section-1-path-resolution contracts", () => {
  test("S1-T07 resolveRepoRoot returns canonical repo root path", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      const result = runtime.resolveRepoRoot(fixture.nestedCwd)
      expect(result.ok).toBe(true)
      if (!result.ok) {
        return
      }

      expect(result.value.absolute).toBe(fixture.repoRoot)
      expect(result.value.relative.includes("..")).toBe(false)
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T08 non-repo cwd fails with typed path-resolution discriminant", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture({ withRepoMarker: false })

    try {
      const result = runtime.resolveRepoRoot(fixture.nestedCwd)
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("PATH_TARGET_MISSING")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T09 traversal outside repo is rejected with PATH_OUTSIDE_REPO", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      const result = runtime.resolveRepoPath(fixture.repoRoot, "../../opencode")
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("PATH_OUTSIDE_REPO")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T10 traversal token detection is explicit", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      const result = runtime.resolveRepoPath(fixture.repoRoot, "platform/../opencode")
      expect(result.ok).toBe(false)
      if (result.ok) {
        return
      }

      expect(result.error.code).toBe("PATH_TRAVERSAL_DETECTED")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T11 valid in-repo relative path resolves to SafeRepoPath", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      const result = runtime.resolveRepoPath(fixture.repoRoot, "platform/opencode/package.json")
      expect(result.ok).toBe(true)
      if (!result.ok) {
        return
      }

      expect(result.value.absolute).toBe(join(fixture.repoRoot, "platform", "opencode", "package.json"))
      expect(result.value.absolute.startsWith(fixture.repoRoot)).toBe(true)
      expect(result.value.relative).toBe("platform/opencode/package.json")
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T12 ensureFilePath rejects directory and missing targets with typed errors", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      await mkdir(join(fixture.repoRoot, "docs"), { recursive: true })
      const directoryPath = runtime.resolveRepoPath(fixture.repoRoot, "docs")
      expect(directoryPath.ok).toBe(true)
      if (!directoryPath.ok) {
        return
      }

      const directoryResult = runtime.ensureFilePath(directoryPath.value)
      expect(directoryResult.ok).toBe(false)
      if (!directoryResult.ok) {
        expect(directoryResult.error.code).toBe("PATH_EXPECTED_FILE")
      }

      const missingPath = runtime.resolveRepoPath(fixture.repoRoot, "missing/file.ts")
      expect(missingPath.ok).toBe(true)
      if (!missingPath.ok) {
        return
      }

      const missingResult = runtime.ensureFilePath(missingPath.value)
      expect(missingResult.ok).toBe(false)
      if (!missingResult.ok) {
        expect(missingResult.error.code).toBe("PATH_TARGET_MISSING")
      }
    } finally {
      await fixture.cleanup()
    }
  })

  test("S1-T13 ensureDirectoryPath rejects file and missing targets with typed errors", async () => {
    const runtime = await loadRepoPathResolutionModule()
    const fixture = await createSection1RepoFixture()

    try {
      await writeFile(join(fixture.repoRoot, "README.md"), "renkei")
      const filePath = runtime.resolveRepoPath(fixture.repoRoot, "README.md")
      expect(filePath.ok).toBe(true)
      if (!filePath.ok) {
        return
      }

      const fileResult = runtime.ensureDirectoryPath(filePath.value)
      expect(fileResult.ok).toBe(false)
      if (!fileResult.ok) {
        expect(fileResult.error.code).toBe("PATH_EXPECTED_DIRECTORY")
      }

      const missingPath = runtime.resolveRepoPath(fixture.repoRoot, "missing/dir")
      expect(missingPath.ok).toBe(true)
      if (!missingPath.ok) {
        return
      }

      const missingResult = runtime.ensureDirectoryPath(missingPath.value)
      expect(missingResult.ok).toBe(false)
      if (!missingResult.ok) {
        expect(missingResult.error.code).toBe("PATH_TARGET_MISSING")
      }
    } finally {
      await fixture.cleanup()
    }
  })
})
