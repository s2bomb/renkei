"""
Session I/O extractor: get the full input and output text for a specific session.

Usage:
    python tools/session_io.py <session_id>
    python tools/session_io.py <session_id> --input-only
    python tools/session_io.py <session_id> --output-only
    python tools/session_io.py <session_id> --all-messages

Shows the delegation boundary: what went in (first user message)
and what came out (last assistant message).
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


def get_messages(db, session_id):
    """Get all messages for a session in order."""
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


def get_text_parts(db, message_id):
    """Get all text parts for a message."""
    cur = db.execute(
        "SELECT data FROM part WHERE message_id = ? ORDER BY time_created",
        (message_id,),
    )
    texts = []
    tool_uses = []
    skills = []
    for (data_str,) in cur.fetchall():
        try:
            data = json.loads(data_str)
            if data.get("type") == "text":
                texts.append(data.get("text", ""))
            elif data.get("type") == "tool-invocation":
                tool = data.get("toolInvocation", {})
                tool_name = tool.get("toolName", "unknown")
                if tool_name == "mcp_skill":
                    args = tool.get("args", {})
                    skills.append(args.get("name", "unknown"))
                elif tool_name == "mcp_task":
                    args = tool.get("args", {})
                    desc = args.get("description", "")
                    prompt_preview = args.get("prompt", "")[:100]
                    tool_uses.append(f"Task({desc}): {prompt_preview}")
                else:
                    tool_uses.append(tool_name)
        except json.JSONDecodeError:
            continue
    return texts, tool_uses, skills


def print_message(db, msg, label=None):
    """Print a single message with its text parts."""
    texts, tool_uses, skills = get_text_parts(db, msg["id"])
    role_label = msg["role"].upper()
    if label:
        role_label = f"{label} ({role_label})"

    print(f"--- {role_label} ---")
    if skills:
        print(f"[Loaded skills: {', '.join(skills)}]")
    if texts:
        for t in texts:
            print(t)
    if tool_uses:
        print(f"\n[Tool uses: {len(tool_uses)}]")
        for tu in tool_uses[:10]:
            print(f"  - {tu}")
        if len(tool_uses) > 10:
            print(f"  ... and {len(tool_uses) - 10} more")
    print()


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python session_io.py <session_id> "
            "[--input-only|--output-only|--all-messages]"
        )
        sys.exit(1)

    session_id = sys.argv[1]
    input_only = "--input-only" in sys.argv
    output_only = "--output-only" in sys.argv
    all_messages = "--all-messages" in sys.argv

    db = get_db()
    try:
        messages = get_messages(db, session_id)
        if not messages:
            print(f"No messages found for session {session_id}")
            sys.exit(1)

        if all_messages:
            for i, msg in enumerate(messages):
                print_message(db, msg, label=f"msg-{i}")
            return

        if not output_only:
            first_user = next((m for m in messages if m["role"] == "user"), None)
            if first_user:
                print_message(db, first_user, label="INPUT")
            else:
                print("(no user message found)")

        if not input_only:
            last_assistant = None
            for m in reversed(messages):
                if m["role"] == "assistant":
                    last_assistant = m
                    break
            if last_assistant:
                print_message(db, last_assistant, label="OUTPUT")
            else:
                print("(no assistant message found)")
    finally:
        db.close()


if __name__ == "__main__":
    main()
