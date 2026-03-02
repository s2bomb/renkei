"""
Session tree: show the delegation tree for an OpenCode session.

Usage:
    python tools/session_tree.py <session_id>
    python tools/session_tree.py <session_id> --with-io

Outputs a tree showing parent -> child session delegations,
message counts, and optionally the first/last text parts (I/O boundaries).
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


def get_session(db, session_id):
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


def get_children(db, session_id):
    cur = db.execute(
        "SELECT id, parent_id, title, name, time_created, time_updated "
        "FROM session WHERE parent_id = ? ORDER BY time_created",
        (session_id,),
    )
    rows = cur.fetchall()
    return [
        {
            "id": r[0],
            "parent_id": r[1],
            "title": r[2],
            "name": r[3],
            "time_created": r[4],
            "time_updated": r[5],
        }
        for r in rows
    ]


def get_message_count(db, session_id):
    cur = db.execute("SELECT COUNT(*) FROM message WHERE session_id = ?", (session_id,))
    return cur.fetchone()[0]


def get_skill_invocations(db, session_id):
    """Find skill tool invocations in a session's parts."""
    cur = db.execute(
        "SELECT p.data FROM part p "
        "JOIN message m ON p.message_id = m.id "
        "WHERE p.session_id = ? "
        "ORDER BY p.time_created",
        (session_id,),
    )
    skills = []
    for (data_str,) in cur.fetchall():
        try:
            data = json.loads(data_str)
            if data.get("type") == "tool-invocation":
                tool = data.get("toolInvocation", {})
                if tool.get("toolName") == "mcp_skill":
                    args = tool.get("args", {})
                    skill_name = args.get("name", "unknown")
                    skills.append(skill_name)
        except (json.JSONDecodeError, KeyError):
            continue
    return skills


def get_io_boundaries(db, session_id):
    """Get the first user text (input) and last assistant text (output) for a session."""
    # First user message text parts
    cur = db.execute(
        "SELECT p.data FROM part p "
        "JOIN message m ON p.message_id = m.id "
        "WHERE p.session_id = ? "
        "ORDER BY p.time_created",
        (session_id,),
    )
    first_input = None
    last_output = None
    current_role = None

    # We need to track message roles
    msg_cur = db.execute(
        "SELECT m.id, m.data FROM message m "
        "WHERE m.session_id = ? ORDER BY m.time_created",
        (session_id,),
    )
    messages = []
    for msg_id, msg_data_str in msg_cur.fetchall():
        try:
            msg_data = json.loads(msg_data_str)
            messages.append({"id": msg_id, "role": msg_data.get("role", "unknown")})
        except json.JSONDecodeError:
            continue

    if not messages:
        return None, None

    # Get first user message text
    first_user_msg = next((m for m in messages if m["role"] == "user"), None)
    if first_user_msg:
        cur = db.execute(
            "SELECT data FROM part WHERE message_id = ? ORDER BY time_created",
            (first_user_msg["id"],),
        )
        texts = []
        for (data_str,) in cur.fetchall():
            try:
                data = json.loads(data_str)
                if data.get("type") == "text":
                    texts.append(data.get("text", ""))
            except json.JSONDecodeError:
                continue
        first_input = "\n".join(texts) if texts else None

    # Get last assistant message text
    last_assistant_msg = None
    for m in reversed(messages):
        if m["role"] == "assistant":
            last_assistant_msg = m
            break

    if last_assistant_msg:
        cur = db.execute(
            "SELECT data FROM part WHERE message_id = ? ORDER BY time_created",
            (last_assistant_msg["id"],),
        )
        texts = []
        for (data_str,) in cur.fetchall():
            try:
                data = json.loads(data_str)
                if data.get("type") == "text":
                    texts.append(data.get("text", ""))
            except json.JSONDecodeError:
                continue
        last_output = "\n".join(texts) if texts else None

    return first_input, last_output


def truncate(text, max_len=200):
    if text is None:
        return "(none)"
    text = text.replace("\n", " ").strip()
    if len(text) > max_len:
        return text[:max_len] + "..."
    return text


def print_tree(db, session_id, indent=0, with_io=False):
    session = get_session(db, session_id)
    if not session:
        print(f"{'  ' * indent}(session not found: {session_id})")
        return

    msg_count = get_message_count(db, session_id)
    children = get_children(db, session_id)
    skills = get_skill_invocations(db, session_id)

    prefix = "  " * indent
    title = session["title"] or "(untitled)"
    skill_str = f" [skill: {', '.join(skills)}]" if skills else ""
    child_str = f" -> {len(children)} children" if children else ""

    print(f"{prefix}{title}")
    print(f"{prefix}  id: {session['id']}")
    print(f"{prefix}  messages: {msg_count}{skill_str}{child_str}")

    if with_io:
        first_input, last_output = get_io_boundaries(db, session_id)
        print(f"{prefix}  INPUT:  {truncate(first_input, 150)}")
        print(f"{prefix}  OUTPUT: {truncate(last_output, 150)}")

    print()

    for child in children:
        print_tree(db, child["id"], indent + 1, with_io=with_io)


def main():
    if len(sys.argv) < 2:
        print("Usage: python session_tree.py <session_id> [--with-io]")
        sys.exit(1)

    session_id = sys.argv[1]
    with_io = "--with-io" in sys.argv

    db = get_db()
    try:
        print_tree(db, session_id, with_io=with_io)
    finally:
        db.close()


if __name__ == "__main__":
    main()
