#!/usr/bin/env python3
"""
Assemble an archetype into a Claude Code SKILL.md file.

Reads archetype.yaml, composes articles in pillar order (truth → ethos → doctrine),
and produces a host-adapted SKILL.md for Claude Code.

Usage:
    python lib/assemble.py archetypes/development/test-designer --dry-run
    python lib/assemble.py archetypes/development/test-designer -o output/
    python lib/assemble.py --all archetypes/development/
    python lib/assemble.py --push archetypes/development/test-designer
    python lib/assemble.py --push --all archetypes/development/
"""

import argparse
import difflib
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

import yaml


PILLARS = ["truth", "ethos", "doctrine"]


def read_manifest(archetype_dir: Path) -> dict:
    """Read and validate archetype.yaml."""
    manifest_path = archetype_dir / "archetype.yaml"
    if not manifest_path.exists():
        print(f"Error: No archetype.yaml found in {archetype_dir}", file=sys.stderr)
        sys.exit(1)
    return yaml.safe_load(manifest_path.read_text())


def resolve_article_path(archetype_dir: Path, pillar: str, entry: str) -> Path:
    """Resolve an article entry to its filesystem path.

    Plain filenames resolve locally:  archetype_dir/pillar/entry
    _shared/ prefix resolves to ensemble shared:  ensemble/_shared/pillar/article
    """
    if entry.startswith("_shared/"):
        article_name = entry[len("_shared/") :]
        ensemble_dir = archetype_dir.parent
        return ensemble_dir / "_shared" / pillar / article_name
    return archetype_dir / pillar / entry


def read_article(archetype_dir: Path, pillar: str, entry: str) -> str:
    """Read a single article file."""
    path = resolve_article_path(archetype_dir, pillar, entry)
    if not path.exists():
        print(f"Error: Article not found: {path}", file=sys.stderr)
        sys.exit(1)
    return path.read_text().strip()


def downshift_headings(text: str) -> str:
    """Shift all markdown headings down one level (# → ##, ## → ###, etc.)."""
    lines = text.split("\n")
    result = []
    for line in lines:
        if re.match(r"^#{1,5}\s", line):
            result.append("#" + line)
        else:
            result.append(line)
    return "\n".join(result)


def build_frontmatter(manifest: dict) -> str:
    """Build YAML frontmatter for Claude Code SKILL.md."""
    description = manifest["description"].strip()
    description = " ".join(description.split())
    return textwrap.dedent(f"""\
        ---
        name: {manifest["name"]}
        description: {description}
        model: {manifest.get("model", "opus")}
        ---""")


def build_title(manifest: dict) -> str:
    """Build the top-level heading from the archetype name."""
    name = manifest["name"].replace("-", " ").title()
    return f"# {name}"


def assemble(archetype_dir: Path) -> str:
    """Assemble an archetype into a Claude Code SKILL.md string."""
    archetype_dir = Path(archetype_dir)
    manifest = read_manifest(archetype_dir)

    parts = []

    # Frontmatter
    parts.append(build_frontmatter(manifest))
    parts.append("")

    # Title
    parts.append(build_title(manifest))
    parts.append("")

    # Articles in pillar order
    for pillar in PILLARS:
        articles = manifest.get(pillar, [])
        if not articles:
            continue

        for article_name in articles:
            content = read_article(archetype_dir, pillar, article_name)
            content = downshift_headings(content)
            parts.append(content)
            parts.append("")

        # Separator between pillars
        parts.append("---")
        parts.append("")

    # Remove trailing separator
    if parts and parts[-2] == "---":
        parts.pop(-2)

    return "\n".join(parts).rstrip() + "\n"


def get_output_path(manifest: dict, archetype_dir: Path) -> Path:
    """Get the Claude Code output path from the manifest."""
    outputs = manifest.get("output", [])
    for out in outputs:
        if out.get("target") == "claude-code":
            return Path(out["path"]).expanduser()
    return archetype_dir / "assembled.md"


def show_diff(name: str, target: Path, assembled: str) -> bool:
    """Show diff between existing file and assembled output. Returns True if changed."""
    if not target.exists():
        line_count = assembled.count("\n")
        print(f"\n  {name}: NEW FILE → {target} ({line_count} lines)")
        print("  (no existing file to diff against)\n")
        return True

    existing = target.read_text()
    if existing == assembled:
        print(f"\n  {name}: no changes")
        return False

    # Use unified diff
    existing_lines = existing.splitlines(keepends=True)
    assembled_lines = assembled.splitlines(keepends=True)
    diff = difflib.unified_diff(
        existing_lines,
        assembled_lines,
        fromfile=f"deployed/{target.name}",
        tofile=f"assembled/{target.name}",
        lineterm="",
    )

    diff_lines = list(diff)
    if not diff_lines:
        print(f"\n  {name}: no changes")
        return False

    # Count additions/removals
    adds = sum(1 for l in diff_lines if l.startswith("+") and not l.startswith("+++"))
    removes = sum(
        1 for l in diff_lines if l.startswith("-") and not l.startswith("---")
    )

    print(f"\n  {name}: {target}")
    print(f"  +{adds} -{removes} lines changed\n")

    # Try colored diff via external diff command for readability
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
            f.write(assembled)
            tmp_path = f.name
        subprocess.run(
            ["diff", "--color=always", "-u", str(target), tmp_path],
            check=False,
        )
        Path(tmp_path).unlink()
    except FileNotFoundError:
        # No diff command, fall back to difflib output
        for line in diff_lines:
            print(line, end="")
        print()

    return True


def find_git_root(path: Path) -> Path | None:
    """Walk up from path looking for a .git directory."""
    current = path if path.is_dir() else path.parent
    for parent in [current, *current.parents]:
        if (parent / ".git").exists():
            return parent
    return None


def ensure_git(target: Path) -> Path:
    """Ensure the target path is inside a git repo. Init one if needed.

    Returns the git root directory.
    """
    git_root = find_git_root(target)
    if git_root is not None:
        return git_root

    # No git repo found -- init one at the target's parent directory
    init_dir = target.parent
    init_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=init_dir, check=True, capture_output=True)
    print(f"  Initialized git repo at {init_dir}")
    return init_dir


def git_commit_path(git_root: Path, paths: list[Path], message: str) -> bool:
    """Stage and commit specific paths in a git repo.

    Returns True if a commit was created, False if nothing to commit.
    """
    # Build relative paths for git add
    rel_paths = []
    for p in paths:
        if p.exists():
            rel_paths.append(str(p.relative_to(git_root)))

    if not rel_paths:
        return False

    # Stage the paths
    subprocess.run(
        ["git", "add", "--"] + rel_paths,
        cwd=git_root,
        check=True,
        capture_output=True,
    )

    # Check if there's anything staged to commit
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=git_root,
        capture_output=True,
    )
    if result.returncode == 0:
        # Nothing staged -- no changes to commit
        return False

    subprocess.run(
        ["git", "commit", "-m", message],
        cwd=git_root,
        check=True,
        capture_output=True,
    )
    return True


def push_one(archetype_dir: Path, force: bool = False) -> None:
    """Assemble and push one archetype to its target, with diff approval.

    Wraps every deploy in two git commits:
      1. Pre-deploy snapshot of the current state (rollback point)
      2. Post-deploy commit of the new state
    """
    manifest = read_manifest(archetype_dir)
    name = manifest["name"]
    target = get_output_path(manifest, archetype_dir)
    assembled = assemble(archetype_dir)

    changed = show_diff(name, target, assembled)

    if not changed:
        return

    if not force:
        answer = input(f"\n  Deploy {name} to {target}? [y/N] ").strip().lower()
        if answer != "y":
            print(f"  Skipped {name}")
            return

    # Ensure the target is in a git repo
    git_root = ensure_git(target)

    # Collect all paths that will be affected by this deploy
    deploy_paths = [target]
    refs_src = archetype_dir / "references"
    refs_dst = target.parent / "references"
    if refs_src.is_dir():
        deploy_paths.append(refs_dst)

    # Pre-deploy commit: snapshot the current state as a rollback point
    if target.exists():
        committed = git_commit_path(
            git_root, deploy_paths, f"pre-deploy snapshot: {name}"
        )
        if committed:
            print(f"  Committed pre-deploy snapshot for {name}")

    # Deploy: write the new files
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(assembled)
    print(f"  Deployed {name} → {target}")

    # Copy references/ directory if it exists in the archetype
    if refs_src.is_dir():
        if refs_dst.exists():
            shutil.rmtree(refs_dst)
        shutil.copytree(refs_src, refs_dst)
        ref_files = list(refs_dst.rglob("*"))
        ref_count = sum(1 for f in ref_files if f.is_file())
        print(f"  Copied references/ ({ref_count} file(s)) → {refs_dst}")

    # Post-deploy commit: record the new state
    committed = git_commit_path(
        git_root, deploy_paths, f"deploy: {name} (assembled from renkei)"
    )
    if committed:
        print(f"  Committed deploy for {name}")


def main():
    parser = argparse.ArgumentParser(
        description="Assemble archetypes into Claude Code SKILL.md files"
    )
    parser.add_argument(
        "path",
        type=Path,
        help="Path to archetype directory, or ensemble directory with --all",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output path (overrides manifest output target)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Assemble all archetypes in an ensemble directory",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print assembled output to stdout instead of writing files",
    )
    parser.add_argument(
        "--push",
        action="store_true",
        help="Assemble, diff against deployed skill, and deploy with approval",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Skip approval prompt when pushing (use with --push)",
    )

    args = parser.parse_args()

    # Collect archetype directories
    if args.all:
        archetype_dirs = sorted(p.parent for p in args.path.rglob("archetype.yaml"))
        if not archetype_dirs:
            print(f"No archetypes found under {args.path}", file=sys.stderr)
            sys.exit(1)
    else:
        archetype_dirs = [args.path]

    # Push mode: assemble → diff → approve → deploy
    if args.push:
        for archetype_dir in archetype_dirs:
            push_one(archetype_dir, force=args.force)
        return

    # Normal mode: assemble → write
    for archetype_dir in archetype_dirs:
        manifest = read_manifest(archetype_dir)
        assembled = assemble(archetype_dir)

        if args.dry_run:
            if args.all:
                print(f"=== {manifest['name']} ===")
            print(assembled)
            if args.all:
                print()
        else:
            if args.output and args.all:
                out_dir = args.output
                out_dir.mkdir(parents=True, exist_ok=True)
                output_path = out_dir / f"{manifest['name']}-SKILL.md"
            elif args.output:
                output_path = args.output
            else:
                output_path = get_output_path(manifest, archetype_dir)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(assembled)
            print(f"  {manifest['name']} → {output_path}")


if __name__ == "__main__":
    main()
