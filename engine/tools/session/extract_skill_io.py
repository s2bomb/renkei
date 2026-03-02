"""
Extract structured IO data for all sessions that invoked a specific skill.

Usage:
    python extract_skill_io.py <skill_name>
    python extract_skill_io.py <skill_name> --output analysis.json
    python extract_skill_io.py <skill_name> --limit 10

Produces a JSON array of session records, each containing:
- session metadata (id, parent, timestamps)
- input: the delegation prompt / first user message
- output: the final assistant message (the return)
- skills loaded
- tool usage summary
- child session count
- message count
- files written (artifacts produced)

Designed for batch analysis of how a skill behaves across invocations.
"""

import json
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path.home() / ".local/share/opencode/opencode.db"


def get_db():
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}", file=sys.stderr)
        sys.exit(1)
    return sqlite3.connect(str(DB_PATH))


def find_sessions_with_skill(db, skill_name, limit=50):
    """Find all sessions that invoked a specific skill."""
    cur = db.execute(
        "SELECT DISTINCT p.session_id FROM part p "
        "WHERE json_extract(p.data, '$.tool') = 'skill' "
        "AND json_extract(p.data, '$.state.input.name') = ? "
        "ORDER BY p.time_created DESC "
        "LIMIT ?",
        (skill_name, limit),
    )
    return [row[0] for row in cur.fetchall()]


def get_session_info(db, session_id):
    cur = db.execute(
        "SELECT id, parent_id, title, name, time_created, time_updated "
        "FROM session WHERE id = ?",
        (session_id,),
    )
    row = cur.fetchone()
    if not row:
        return None
    return {
        "id": row[0],
        "parent_id": row[1],
        "title": row[2],
        "name": row[3],
        "time_created": row[4],
        "time_updated": row[5],
    }


def get_messages(db, session_id):
    cur = db.execute(
        "SELECT m.id, m.data, m.time_created FROM message m "
        "WHERE m.session_id = ? ORDER BY m.time_created",
        (session_id,),
    )
    messages = []
    for msg_id, msg_data_str, time_created in cur.fetchall():
        try:
            msg_data = json.loads(msg_data_str)
            messages.append(
                {
                    "id": msg_id,
                    "role": msg_data.get("role", "unknown"),
                    "time_created": time_created,
                }
            )
        except json.JSONDecodeError:
            continue
    return messages


def get_message_parts(db, message_id):
    """Get all parts for a message, categorized by type."""
    cur = db.execute(
        "SELECT data FROM part WHERE message_id = ? ORDER BY time_created",
        (message_id,),
    )
    texts = []
    tool_uses = []
    skills = []
    file_writes = []
    file_reads = []

    for (data_str,) in cur.fetchall():
        try:
            data = json.loads(data_str)
            data_type = data.get("type")

            if data_type == "text":
                texts.append(data.get("text", ""))
            elif data_type == "tool":
                tool_name = data.get("tool", "unknown")
                state = data.get("state", {})
                input_data = state.get("input", {})

                if tool_name == "skill":
                    skills.append(input_data.get("name", "unknown"))
                elif tool_name == "write":
                    file_writes.append(input_data.get("filePath", "unknown"))
                elif tool_name == "read":
                    file_reads.append(input_data.get("filePath", "unknown"))
                elif tool_name == "task":
                    desc = input_data.get("description", "")
                    subagent = input_data.get("subagent_type", "")
                    tool_uses.append(f"Task({subagent}): {desc}")
                else:
                    tool_uses.append(tool_name)
        except json.JSONDecodeError:
            continue

    return {
        "texts": texts,
        "tool_uses": tool_uses,
        "skills": skills,
        "file_writes": file_writes,
        "file_reads": file_reads,
    }


def extract_session_io(db, session_id):
    """Extract structured IO for a single session."""
    info = get_session_info(db, session_id)
    if not info:
        return None

    messages = get_messages(db, session_id)
    if not messages:
        return None

    # Input: first user message
    first_user = next((m for m in messages if m["role"] == "user"), None)
    input_data = None
    if first_user:
        parts = get_message_parts(db, first_user["id"])
        input_data = {
            "text": "\n".join(parts["texts"]) if parts["texts"] else None,
            "file_reads": parts["file_reads"],
        }

    # Output: last assistant message
    last_assistant = None
    for m in reversed(messages):
        if m["role"] == "assistant":
            last_assistant = m
            break

    output_data = None
    if last_assistant:
        parts = get_message_parts(db, last_assistant["id"])
        output_data = {
            "text": "\n".join(parts["texts"]) if parts["texts"] else None,
            "tool_uses": parts["tool_uses"],
            "file_writes": parts["file_writes"],
        }

    # Aggregate stats across ALL assistant messages
    all_skills = []
    all_tool_uses = []
    all_file_writes = []
    all_file_reads = []
    for msg in messages:
        if msg["role"] == "assistant":
            parts = get_message_parts(db, msg["id"])
            all_skills.extend(parts["skills"])
            all_tool_uses.extend(parts["tool_uses"])
            all_file_writes.extend(parts["file_writes"])
            all_file_reads.extend(parts["file_reads"])

    # Child sessions
    child_cur = db.execute(
        "SELECT COUNT(*) FROM session WHERE parent_id = ?", (session_id,)
    )
    child_count = child_cur.fetchone()[0]

    return {
        "session": info,
        "message_count": len(messages),
        "child_count": child_count,
        "skills_loaded": list(set(all_skills)),
        "input": input_data,
        "output": output_data,
        "stats": {
            "total_tool_uses": len(all_tool_uses),
            "total_file_writes": len(all_file_writes),
            "total_file_reads": len(all_file_reads),
            "unique_files_written": list(set(all_file_writes)),
            "unique_files_read": list(set(all_file_reads)),
        },
    }


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python extract_skill_io.py <skill_name> [--output file.json] [--limit N]"
        )
        sys.exit(1)

    skill_name = sys.argv[1]
    output_path = None
    limit = 50

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]

    if "--limit" in sys.argv:
        idx = sys.argv.index("--limit")
        if idx + 1 < len(sys.argv):
            limit = int(sys.argv[idx + 1])

    db = get_db()
    try:
        session_ids = find_sessions_with_skill(db, skill_name, limit=limit)

        if not session_ids:
            print(f"No sessions found with skill '{skill_name}'")
            sys.exit(0)

        records = []
        for sid in session_ids:
            record = extract_session_io(db, sid)
            if record:
                records.append(record)

        result = json.dumps(records, indent=2)

        if output_path:
            Path(output_path).write_text(result)
            print(f"Wrote {len(records)} session records to {output_path}")
        else:
            print(result)

    finally:
        db.close()


if __name__ == "__main__":
    main()
