import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"

type Section1RepoFixtureOptions = {
  readonly withRepoMarker?: boolean
  readonly writeLinkageConfig?: boolean
  readonly linkageConfigRaw?: string
  readonly linkageConfigValue?: Record<string, unknown>
  readonly createVendoredRoot?: boolean
}

export type Section1RepoFixture = {
  readonly repoRoot: string
  readonly nestedCwd: string
  readonly harnessRoot: string
  readonly vendorRoot: string
  readonly opencodeRoot: string
  readonly linkageConfigPath: string
  readonly cleanup: () => Promise<void>
}

function makeDefaultLinkageConfig() {
  return {
    mode: "subtree",
    opencodeRoot: "vendor/opencode",
    provenance: {
      remote: "https://github.com/sst/opencode.git",
      branch: "main",
      upstreamRef: "origin/main",
      syncedAt: "2026-02-19T00:00:00.000Z",
    },
  }
}

export async function createSection1RepoFixture(options?: Section1RepoFixtureOptions): Promise<Section1RepoFixture> {
  const repoRoot = await mkdtemp(join(tmpdir(), "renkei-section-1-"))
  const harnessRoot = join(repoRoot, "harness")
  const vendorRoot = join(repoRoot, "vendor")
  const opencodeRoot = join(vendorRoot, "opencode")
  const linkageConfigPath = join(harnessRoot, "config", "opencode-linkage.json")
  const nestedCwd = join(repoRoot, "harness", "test", "fixtures", "nested")

  await mkdir(nestedCwd, { recursive: true })
  await mkdir(join(harnessRoot, "config"), { recursive: true })
  await mkdir(join(harnessRoot, "src"), { recursive: true })

  if (options?.withRepoMarker ?? true) {
    await mkdir(join(repoRoot, ".git"), { recursive: true })
  }

  if (options?.createVendoredRoot ?? true) {
    await mkdir(opencodeRoot, { recursive: true })
    await writeFile(join(opencodeRoot, "package.json"), JSON.stringify({ name: "opencode" }))
  }

  if (options?.writeLinkageConfig ?? true) {
    const raw =
      options?.linkageConfigRaw ?? JSON.stringify(options?.linkageConfigValue ?? makeDefaultLinkageConfig(), null, 2)
    await writeFile(linkageConfigPath, raw)
  }

  return {
    repoRoot,
    nestedCwd,
    harnessRoot,
    vendorRoot,
    opencodeRoot,
    linkageConfigPath,
    cleanup: () => rm(repoRoot, { recursive: true, force: true }),
  }
}
