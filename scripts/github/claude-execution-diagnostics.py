#!/usr/bin/env python3
"""Fail closed on Claude execution errors without logging execution content."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

CODE_CATEGORY = {
    "authentication_failed": "auth",
    "oauth_org_not_allowed": "auth",
    "billing_error": "billing",
    "rate_limit": "rate_limit",
    "overloaded": "provider",
    "server_error": "provider",
}


def classify(records: list[dict], index: int) -> tuple[str, int | None]:
    result = records[index]
    if result.get("is_error") is not True or result.get("subtype") != "success":
        return "unknown", None
    raw_status = result.get("api_error_status")
    status = raw_status if type(raw_status) is int and 400 <= raw_status <= 599 else None
    by_status = {401: "auth", 402: "billing", 403: "auth", 429: "rate_limit"}.get(status)
    if status is not None and 500 <= status <= 599:
        by_status = "provider"

    # Only the last root assistant in this execution can explain its result.
    session = result.get("session_id")
    assistants = [item for item in records[:index]
                  if item.get("type") == "assistant"
                  and item.get("parent_tool_use_id") is None
                  and isinstance(session, str) and session
                  and item.get("session_id") == session]
    code = assistants[-1].get("error") if assistants else None
    by_code = CODE_CATEGORY.get(code) if isinstance(code, str) else None
    categories = {category for category in (by_status, by_code) if category}
    return (next(iter(categories)) if len(categories) == 1 else "unknown"), status


def failure(category: str = "unknown", status: int | None = None) -> int:
    # All output is fixed vocabulary or a validated HTTP status. Never print
    # result/errors text, parser errors, messages, tool output, or credentials.
    print(f"::error::Claude execution failed; category={category}; "
          f"http_status={status if status is not None else 'none'}")
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--allow-missing", action="store_true",
                        help="Allow a review action that skipped before execution")
    args = parser.parse_args()
    try:
        records = json.loads(args.output.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return 0 if args.allow_missing else failure()
    except (OSError, UnicodeError, ValueError, RecursionError):
        return failure()
    if not isinstance(records, list) or not records or not all(isinstance(x, dict) for x in records):
        return failure()
    results = [i for i, item in enumerate(records) if item.get("type") == "result"]
    if not results:
        return failure()
    index = results[-1]
    result = records[index]
    if (result.get("subtype") == "success" and result.get("is_error") is False
            and not any(item.get("is_error") is True for item in records)):
        print("Claude execution completed.")
        return 0
    return failure(*classify(records, index))


if __name__ == "__main__":
    raise SystemExit(main())
