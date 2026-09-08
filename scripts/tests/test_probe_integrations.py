"""Tests for the read-only integration probe CLI."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))

from probe_integrations import main  # noqa: E402


def test_inventory_lists_codex_and_chatgpt(capsys) -> None:
    assert main(["inventory", "--json"]) == 0
    payload = json.loads(capsys.readouterr().out)
    ids = {row["id"] for row in payload["agents"]}
    assert "codex-slack" in ids
    assert "chatgpt-slack" in ids
    assert "notion-ai-slack" in ids
    assert payload["classification"] == "PROVED"
    assert payload["layer"] == "A-static"


def test_static_returns_no_errors(capsys) -> None:
    code = main(["static", "--json"])
    payload = json.loads(capsys.readouterr().out)
    assert payload["errors"] == []
    assert code == 0


def test_live_commands_are_blocked(capsys) -> None:
    assert main(["codex", "--json"]) == 2
    payload = json.loads(capsys.readouterr().out)
    assert payload["classification"] == "BLOCKED"
    assert "session-only" in payload["reason"]


def test_report_mentions_catalog_and_no_second_ssot(capsys) -> None:
    assert main(["report"]) == 0
    text = capsys.readouterr().out
    assert "codex-slack" in text
    assert "Do not create a second inventory file." in text


def test_evidence_merge_redacts_secrets(tmp_path: Path, capsys) -> None:
    evidence = tmp_path / "evidence.json"
    evidence.write_text(
        json.dumps({"api_key": "should-not-leak", "codex": "needs_auth"}),
        encoding="utf-8",
    )
    assert main(["inventory", "--json", "--evidence", str(evidence)]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["evidence"]["api_key"] == "[redacted]"
    assert payload["evidence"]["codex"] == "needs_auth"
