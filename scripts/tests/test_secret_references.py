"""Offline fixtures for hub workflow secret-reference lint (P2-D)."""

from __future__ import annotations

import importlib.util
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "github" / "github-baseline-audit.py"

_spec = importlib.util.spec_from_file_location("github_baseline_audit", SCRIPT)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules["github_baseline_audit"] = _mod
_spec.loader.exec_module(_mod)
audit = _mod


def test_parse_ignores_github_token() -> None:
    text = "GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\nOTHER: ${{ secrets.FOO_TOKEN }}\n"
    names, bad = audit.parse_workflow_secret_references(text)
    assert "GITHUB_TOKEN" not in names
    assert names == ["FOO_TOKEN"]
    assert bad == []


def test_parse_or_expression_collects_alt_token() -> None:
    text = "token: ${{ secrets.AUTO_PR_TOKEN || secrets.GITHUB_TOKEN }}\n"
    names, bad = audit.parse_workflow_secret_references(text)
    assert names == ["AUTO_PR_TOKEN"]
    assert bad == []


def test_parse_fromjson_secrets_name() -> None:
    text = "env: ${{ fromJSON(secrets.FOO_JSON) }}\n"
    names, bad = audit.parse_workflow_secret_references(text)
    assert names == ["FOO_JSON"]
    assert bad == []


def test_parse_rejects_unparseable_expressions() -> None:
    text = "\n".join(
        [
            "a: ${{ secrets. }}",
            "b: ${{ secrets.bad-name }}",
            "c: ${{ secrets.lowercase }}",
            "d: ${{ secrets.GOOD_TOKEN }}",
        ]
    )
    names, bad = audit.parse_workflow_secret_references(text)
    assert names == ["GOOD_TOKEN"]
    assert any("secrets." in item for item in bad)
    assert len(bad) >= 3


def test_debt_parser_reads_expires_without_retired() -> None:
    debt = """
### Hub secret VERCEL_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `VERCEL_TOKEN`; `.github/workflows/sync-vercel.yml`
- **Owner:** alawein
"""
    entries = audit.parse_debt_secret_entries(debt)
    assert len(entries) == 1
    entry = entries[0]
    assert entry.name == "VERCEL_TOKEN"
    assert entry.expires == date(2026, 10, 13)
    assert entry.retired is False


def test_debt_parser_marks_retired_status() -> None:
    debt = """
### Hub secret OLD_TOKEN retired
- **Date:** 2026-01-01
- **Status:** retired
- **Where:** repo secret name `OLD_TOKEN`
- **Owner:** alawein
"""
    entries = audit.parse_debt_secret_entries(debt)
    assert len(entries) == 1
    assert entries[0].name == "OLD_TOKEN"
    assert entries[0].retired is True


def test_check_fails_on_unparseable_fixture(tmp_path: Path) -> None:
    workflows = tmp_path / "workflows"
    workflows.mkdir()
    (workflows / "broken.yml").write_text(
        "env:\n  X: ${{ secrets.bad-name }}\n",
        encoding="utf-8",
    )
    debt = tmp_path / "DEBT.md"
    debt.write_text("# Debt\n", encoding="utf-8")
    errors: list[str] = []
    audit.check_hub_secret_references(
        errors,
        workflow_dir=workflows,
        debt_path=debt,
        today=date(2026, 9, 13),
    )
    assert any("unparseable" in e.lower() for e in errors)


def test_check_fails_on_retired_name_still_referenced(tmp_path: Path) -> None:
    workflows = tmp_path / "workflows"
    workflows.mkdir()
    (workflows / "uses-retired.yml").write_text(
        "env:\n  T: ${{ secrets.OLD_TOKEN }}\n",
        encoding="utf-8",
    )
    debt = tmp_path / "DEBT.md"
    debt.write_text(
        """
### Hub secret OLD_TOKEN retired
- **Date:** 2026-01-01
- **Status:** retired
- **Where:** repo secret name `OLD_TOKEN`
- **Owner:** alawein
""",
        encoding="utf-8",
    )
    errors: list[str] = []
    audit.check_hub_secret_references(
        errors,
        workflow_dir=workflows,
        debt_path=debt,
        today=date(2026, 9, 13),
    )
    assert any("retired" in e.lower() and "OLD_TOKEN" in e for e in errors)


def test_check_does_not_fail_for_future_expires(tmp_path: Path) -> None:
    workflows = tmp_path / "workflows"
    workflows.mkdir()
    (workflows / "ok.yml").write_text(
        "env:\n  T: ${{ secrets.VERCEL_TOKEN }}\n",
        encoding="utf-8",
    )
    debt = tmp_path / "DEBT.md"
    debt.write_text(
        """
### Hub secret VERCEL_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `VERCEL_TOKEN`
- **Owner:** alawein
""",
        encoding="utf-8",
    )
    errors: list[str] = []
    audit.check_hub_secret_references(
        errors,
        workflow_dir=workflows,
        debt_path=debt,
        today=date(2026, 9, 13),
    )
    assert errors == []


def test_check_fails_after_expires_date(tmp_path: Path) -> None:
    workflows = tmp_path / "workflows"
    workflows.mkdir()
    (workflows / "stale.yml").write_text(
        "env:\n  T: ${{ secrets.VERCEL_TOKEN }}\n",
        encoding="utf-8",
    )
    debt = tmp_path / "DEBT.md"
    debt.write_text(
        """
### Hub secret VERCEL_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `VERCEL_TOKEN`
- **Owner:** alawein
""",
        encoding="utf-8",
    )
    errors: list[str] = []
    audit.check_hub_secret_references(
        errors,
        workflow_dir=workflows,
        debt_path=debt,
        today=date(2026, 10, 13),
    )
    assert any("expired" in e.lower() and "VERCEL_TOKEN" in e for e in errors)


def test_hub_workflows_pass_secret_reference_lint() -> None:
    """Live hub workflows must stay green against current DEBT (no network)."""
    errors: list[str] = []
    audit.check_hub_secret_references(errors, today=date(2026, 9, 13))
    assert errors == [], "\n".join(errors)


def test_audit_wires_secret_reference_check() -> None:
    source = SCRIPT.read_text(encoding="utf-8")
    assert "check_hub_secret_references" in source
    assert "check_control_plane_workflows(errors)" in source
    # Sibling call site next to permissions hygiene.
    assert "check_hub_workflow_permissions(errors)" in source
