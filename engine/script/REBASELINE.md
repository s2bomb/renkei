# OpenCode Rebaseline Guide

How to evaluate and apply OpenCode upstream updates to Renkei's vendored platform.

---

## When Asked "There's a New OpenCode Update"

Two questions need answering, in order:

### 1. Is This Upgrade Worthwhile?

Research the changelog before touching any code.

**Steps:**

1. Check the current vendored version:
   ```bash
   cat engine/config/opencode-linkage.json | grep '"ref"'
   ```

2. Check what the user's local OpenCode binary is running:
   ```bash
   opencode --version
   ```

3. Research the changelog between those versions:
   - https://github.com/anomalyco/opencode/releases (canonical)
   - https://opencode.ai/changelog (mirror)

4. Classify the release:
   - **Patch** (x.x.N) — bug fixes, minor improvements. Low risk.
   - **Minor** (x.N.0) — new features, possible breaking changes. Medium risk.
   - **Major** (N.0.0) — breaking changes expected. High risk.

5. Report to the user:
   - What's new (headline features/fixes)
   - What's relevant to Renkei (plugin system changes, TUI changes, agent/session changes)
   - Whether any changes touch files where our Level 3 patches live (check `engine/config/patch-manifest.json` for the file list)
   - Recommendation: upgrade now, wait, or skip

### 2. What's the Upgrade Path?

If the user decides to upgrade, determine if it's clean or requires patch maintenance.

**The patched files** are listed in `engine/config/patch-manifest.json`. If the changelog mentions structural changes to those files, flag it — the patches may need re-application.

---

## Rebaseline Protocol

Execute these steps in exact order. Do not skip or reorder.

### Step 1: Branch

```bash
git checkout dev && git pull origin dev
git checkout -b chore/opencode-subtree-v<VERSION>
```

### Step 2: Subtree Pull

```bash
git subtree pull --prefix=platform/opencode https://github.com/anomalyco/opencode.git v<VERSION> --squash
```

If there are merge conflicts, resolve them. Our additions take priority over upstream removals. If unsure, check the patch documentation in `engine/AGENTS.md` under "Level 3 Patches."

### Step 3: Verify Patches (BEFORE anything else)

```bash
./engine/script/verify-patches.sh
```

**If all OK:** Continue to Step 4.

**If FAIL:** Stop. The script tells you exactly which patches were dropped and in which files. Re-apply each failed patch to the new version of the file, using the documentation in `engine/AGENTS.md` as the reference for what each patch adds. After re-applying, run `verify-patches.sh` again until all pass.

### Step 4: Install Dependencies

```bash
cd platform/opencode && bun install && cd ../..
```

### Step 5: Quality Gates

Run all four in order. All must pass.

```bash
# Platform typecheck (must show 0 errors)
cd platform/opencode/packages/opencode && bun typecheck && cd ../../../..

# Engine typecheck
cd engine && bun typecheck

# Engine lint
bun run lint

# Engine tests (38+ expected)
bun test && cd ..
```

### Step 6: Update Provenance

Edit `engine/config/opencode-linkage.json`:
- `ref` → new version tag
- `upstreamSha` → SHA from the subtree merge commit (run `git log --oneline -1 -- platform/opencode`)
- `syncedAt` → today's date
- `previousRef` → old version
- `previousVersion` → old version number
- `previousSyncedAt` → old sync date

### Step 7: Update AGENTS.md (if patches changed)

If any patches were re-applied, updated, added, or retired during this rebaseline, update the "Level 3 Patches" section and "Current State" table in `engine/AGENTS.md`.

### Step 8: Commit, Push, PR, Merge

```bash
git add -A
git commit -m "chore(engine): rebaseline opencode v<OLD> → v<NEW>

- Subtree pull with --squash, <conflicts or zero conflicts>
- verify-patches.sh: <results>
- All quality gates pass
- Update opencode-linkage.json provenance to v<NEW>"

git push -u origin chore/opencode-subtree-v<VERSION>
gh pr create --base dev --title "chore(engine): rebaseline opencode v<OLD> → v<NEW>" --body "..."
gh pr merge <NUMBER> --squash --delete-branch
```

---

## Sentinel System Reference

### How It Works

Every Level 3 patch includes a `RENKEI-PATCH: <name>` comment in the patched platform file. The manifest at `engine/config/patch-manifest.json` declares:

- `name` — patch identifier
- `sentinel` — the exact string to grep for
- `file` — the target file in the vendored platform
- `also_contains` — additional strings that must be present (function names, variables)
- `doc` — where the patch is documented in AGENTS.md

`verify-patches.sh` reads the manifest and checks every sentinel. If any are missing, the patch was silently dropped during the merge.

### Adding a New Patch

1. Add a `// RENKEI-PATCH: <name>` comment in the patched platform file
2. Add an entry to `engine/config/patch-manifest.json`
3. Document the patch in `engine/AGENTS.md` under "Level 3 Patches"

### Retiring a Patch

1. Remove the entry from `engine/config/patch-manifest.json`
2. Mark the patch as RETIRED in `engine/AGENTS.md` with the reason (upstream absorbed, no longer needed, etc.)
3. Remove the `RENKEI-PATCH` comment from the platform file (or leave it — it's harmless)

---

## Files Involved

| File | Purpose |
|---|---|
| `engine/config/opencode-linkage.json` | Provenance record — current version, upstream SHA, sync dates |
| `engine/config/patch-manifest.json` | Sentinel manifest — all active patches with verification data |
| `engine/script/verify-patches.sh` | Sentinel verification script — run after every subtree merge |
| `engine/AGENTS.md` | Patch documentation — what each patch adds, why, four conditions |
