#!/usr/bin/env python3
"""Verify expected profile pins against README output and the live GitHub profile."""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from catalog_lib import profile_config

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
PROFILE_URL = "https://github.com/alawein"
README_PIN_HEADER = "Pinned below on GitHub carries the portfolio signal. The current focus set is:"
README_PIN_RE = re.compile(r"^- \[([^\]]+)\]\(([^)]+)\) - (.+)$")
LIVE_PIN_BLOCK_MARKER = "js-pinned-items-reorder-list"
LIVE_PIN_REPO_RE = re.compile(r'href="/alawein/([^"/?#]+)"')


def expected_pins() -> list[str]:
    profile = profile_config()
    return [str(slug).strip() for slug in (profile.get("profile_pins") or []) if str(slug).strip()]


def readme_pins() -> tuple[list[str], list[str]]:
    lines = README.read_text(encoding="utf-8").splitlines()
    try:
        header_index = lines.index(README_PIN_HEADER)
    except ValueError as exc:
        raise ValueError(f"README.md is missing expected pin header: {README_PIN_HEADER}") from exc

    slugs: list[str] = []
    errors: list[str] = []
    for line in lines[header_index + 1 :]:
        if not line.strip():
            if slugs:
                break
            continue
        if not line.startswith("- "):
            if slugs:
                break
            continue
        match = README_PIN_RE.match(line)
        if not match:
            errors.append(f"Unreadable README pin line: {line}")
            continue
        slug, _, description = match.groups()
        if not description.strip():
            errors.append(f"README pin '{slug}' is missing a description")
        slugs.append(slug)
    return slugs, errors


def fetch_live_profile() -> str:
    request = urllib.request.Request(
        PROFILE_URL,
        headers={"User-Agent": "alawein-profile-pin-verifier/1.0"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode("utf-8", errors="replace")


def live_pins(html: str) -> list[str]:
    marker_index = html.find(LIVE_PIN_BLOCK_MARKER)
    if marker_index == -1:
        raise ValueError("GitHub profile page is missing the pinned repository block marker")
    start = html.rfind("<ol", 0, marker_index)
    end = html.find("</ol>", marker_index)
    if start == -1 or end == -1:
        raise ValueError("Unable to isolate the pinned repository list on the GitHub profile page")

    seen: set[str] = set()
    pins: list[str] = []
    for slug in LIVE_PIN_REPO_RE.findall(html[start:end]):
        if slug in seen:
            continue
        seen.add(slug)
        pins.append(slug)
    return pins


def manual_checklist(expected: list[str]) -> list[str]:
    joined = ", ".join(expected)
    return [
        "Open https://github.com/alawein while signed in.",
        "Use the profile UI to edit pinned repositories.",
        f"Set the pinned repository order to: {joined}.",
        "Save the profile, then rerun `python scripts/verify-profile-pins.py --check`.",
    ]


def build_payload(skip_live: bool) -> dict[str, Any]:
    expected = expected_pins()
    readme, readme_errors = readme_pins()
    payload: dict[str, Any] = {
        "expected": expected,
        "readme": readme,
        "readme_errors": readme_errors,
        "readme_matches_expected": readme == expected and not readme_errors,
        "live": None,
        "live_matches_expected": None,
        "live_error": None,
        "manual_checklist": manual_checklist(expected),
    }

    if skip_live:
        return payload

    try:
        payload["live"] = live_pins(fetch_live_profile())
        payload["live_matches_expected"] = payload["live"] == expected
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        payload["live_error"] = str(exc)
    return payload


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Compare expected profile pins with README output and the live GitHub profile"
    )
    parser.add_argument("--check", action="store_true", help="Exit non-zero when drift is detected")
    parser.add_argument("--json", action="store_true", help="Emit the verification payload as JSON")
    parser.add_argument("--skip-live", action="store_true", help="Skip the live GitHub profile fetch")
    args = parser.parse_args(argv)

    payload = build_payload(skip_live=args.skip_live)
    drift = not payload["readme_matches_expected"]
    if not args.skip_live:
        drift = drift or payload["live_matches_expected"] is not True

    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        print("Expected pins:", ", ".join(payload["expected"]))
        print("README pins:", ", ".join(payload["readme"]))
        if payload["readme_errors"]:
            for error in payload["readme_errors"]:
                print(f"README error: {error}")
        if args.skip_live:
            print("Live pins: skipped")
        elif payload["live_error"]:
            print(f"Live pins: error ({payload['live_error']})")
        else:
            print("Live pins:", ", ".join(payload["live"]))

        if drift:
            print("")
            print("Manual pin-update checklist:")
            for index, item in enumerate(payload["manual_checklist"], start=1):
                print(f"{index}. {item}")

    if args.check and drift:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
