"""
Find all sessions where a specific skill was invoked.

Usage:
    python find_skill_sessions.py <skill_name>
    python find_skill_sessions.py <skill_name> --limit 20
    python find_skill_sessions.py <skill_name> --json

Searches the OpenCode database for sessions that invoked a given skill.
Returns session IDs, timestamps, and parent context.
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
    """Get session metadata."""
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


def get_message_count(db, session_id):
    cur = db.execute("SELECT COUNT(*) FROM message WHERE session_id = ?", (session_id,))
    return cur.fetchone()[0]


def get_child_count(db, session_id):
    cur = db.execute("SELECT COUNT(*) FROM session WHERE parent_id = ?", (session_id,))
    return cur.fetchone()[0]


def main():
    if len(sys.argv) < 2:
        print("Usage: python find_skill_sessions.py <skill_name> [--limit N] [--json]")
        sys.exit(1)

    skill_name = sys.argv[1]
    as_json = "--json" in sys.argv
    limit = 50
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
            info = get_session_info(db, sid)
            if not info:
                continue
            info["message_count"] = get_message_count(db, sid)
            info["child_count"] = get_child_count(db, sid)
            records.append(info)

        if as_json:
            print(json.dumps(records, indent=2))
        else:
            print(f"Found {len(records)} sessions with skill '{skill_name}':\n")
            for r in records:
                parent_str = (
                    f" (child of {str(r['parent_id'])[:8]}...)"
                    if r["parent_id"]
                    else " (root)"
                )
                title = r["title"] or "(untitled)"
                ts = str(r["time_created"])[:19]
                sid = str(r["id"])[:12]
                print(
                    f"  {sid}...  {ts}  "
                    f"msgs={r['message_count']}  children={r['child_count']}{parent_str}"
                )
                print(f"    title: {title[:80]}")
                print()
    finally:
        db.close()


if __name__ == "__main__":
    main()
