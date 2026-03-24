#!/usr/bin/env bash
# verify-patches.sh — Run after every subtree merge to catch silent patch drops.
#
# Reads engine/config/patch-manifest.json and verifies that every active patch's
# sentinel marker and required content strings exist in the target files.
#
# Exit 0 = all patches present. Exit 1 = one or more patches silently dropped.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
MANIFEST="$REPO_ROOT/engine/config/patch-manifest.json"

if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: Patch manifest not found at $MANIFEST"
  exit 1
fi

FAILED=0
CHECKED=0

# Parse manifest with python3 (available on all dev machines, no extra deps)
python3 -c "
import json, sys, os

root = '$REPO_ROOT'
manifest = json.load(open('$MANIFEST'))

failed = 0
checked = 0

for patch in manifest['patches']:
    name = patch['name']
    sentinel = patch['sentinel']
    target = os.path.join(root, patch['file'])
    also = patch.get('also_contains', [])

    checked += 1

    if not os.path.exists(target):
        print(f'FAIL [{name}]: target file missing: {patch[\"file\"]}')
        failed += 1
        continue

    content = open(target).read()

    if sentinel not in content:
        print(f'FAIL [{name}]: sentinel missing: \"{sentinel}\"')
        print(f'  in: {patch[\"file\"]}')
        failed += 1
        continue

    missing = [s for s in also if s not in content]
    if missing:
        print(f'FAIL [{name}]: required content missing: {missing}')
        print(f'  in: {patch[\"file\"]}')
        failed += 1
        continue

    print(f'  OK [{name}]')

print()
if failed:
    print(f'PATCH VERIFICATION FAILED: {failed}/{checked} patches missing.')
    print('Patches were silently dropped during merge. Re-apply before proceeding.')
    sys.exit(1)
else:
    print(f'All {checked} patches verified.')
    sys.exit(0)
"
