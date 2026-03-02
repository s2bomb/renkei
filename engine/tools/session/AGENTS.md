# Session Tools

Utilities for inspecting OpenCode session behavior from the local session database.

## What These Tools Are For

- Find where a specific skill was invoked (`find_skill_sessions.py`)
- Extract structured input/output records for a skill across many sessions (`extract_skill_io.py`)
- Inspect one session deeply (`session_io.py`)
- Visualize parent/child delegation trees (`session_tree.py`)

These tools read `~/.local/share/opencode/opencode.db`.

## Quick Start

Run from repo root (`/home/brad/Code/s2bomb/renkei/renkei-wt-1`):

```bash
python engine/tools/session/find_skill_sessions.py test-designer --limit 20
python engine/tools/session/extract_skill_io.py test-designer --output /tmp/test-designer.json --limit 20
python engine/tools/session/session_tree.py <session_id> --with-io
python engine/tools/session/session_io.py <session_id> --all-messages
```

## Tips That Matter

- **Start broad, then zoom in.** First list session IDs by skill, then extract batch IO, then deep-read outliers.
- **Look at parent/child context.** A session can look verbose in isolation but be normal in a large parent orchestration.
- **Use artifact paths, not summaries.** The real output quality is in files written, not in the last assistant message.
- **Count tests from artifact files.** Session summaries can under/overstate final counts after revisions.
- **Compare input size to output size.** Large API contract sets often drive large test inventories.

## Important Schema Note

OpenCode DB rows store tool calls in `part.data` with this shape:

- Tool record type: `"type": "tool"`
- Skill invocations: `"tool": "skill"`
- Skill name path: `$.state.input.name`

Do not query for older `toolInvocation/toolName`-style records when analyzing current sessions.

## Common Workflow

1. `find_skill_sessions.py <skill>` to get candidate session IDs
2. `extract_skill_io.py <skill>` to produce structured analysis input
3. Pick representative sessions (small/medium/large output)
4. Use `session_tree.py` for delegation structure
5. Use `session_io.py --all-messages` for exact boundary text and tool behavior
