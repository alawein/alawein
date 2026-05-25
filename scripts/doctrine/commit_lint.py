"""Advisory linter for the workspace commit convention.

Checks the subject against Conventional Commits plus the house rules (length,
lowercase description, no trailing period, no em-dash) and the whole message for
AI attribution. Returns a list of findings; an empty list means clean.
"""
from __future__ import annotations

import re
import sys

TYPES = {
    "feat", "fix", "docs", "chore", "test",
    "refactor", "perf", "build", "ci", "style", "revert",
}
SUBJECT_RE = re.compile(r"^(?P<type>[a-z]+)(?:\((?P<scope>[^)]+)\))?(?P<bang>!)?: (?P<desc>.+)$")
AI_MARKERS = ("co-authored-by: claude", "generated with claude", "anthropic.com")
EM_DASH = chr(0x2014)


def lint_subject(subject: str) -> list[str]:
    findings: list[str] = []
    if EM_DASH in subject:
        findings.append("subject contains an em-dash")
    if len(subject) > 72:
        findings.append(f"subject exceeds 72 characters ({len(subject)})")
    match = SUBJECT_RE.match(subject)
    if not match:
        findings.append("subject must be 'type(scope): description'")
        return findings
    if match.group("type") not in TYPES:
        findings.append(f"unknown type {match.group('type')!r}; expected one of {sorted(TYPES)}")
    desc = match.group("desc")
    if desc.endswith("."):
        findings.append("subject must not end with a period")
    if desc[:1].isupper():
        findings.append("description should start lowercase")
    return findings


def lint_message(message: str) -> list[str]:
    lines = message.splitlines()
    findings = lint_subject(lines[0]) if lines else ["empty commit message"]
    lower = message.lower()
    for marker in AI_MARKERS:
        if marker in lower:
            findings.append(f"AI attribution found ({marker!r}); not allowed")
    if EM_DASH in message:
        findings.append("message body contains an em-dash")
    return findings


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: commit_lint.py <commit-message-file>")
        return 2
    text = open(argv[0], encoding="utf-8").read()
    findings = lint_message(text)
    for finding in findings:
        print(f"commit-lint: {finding}")
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
