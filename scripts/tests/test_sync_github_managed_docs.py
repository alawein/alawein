"""Check-mode coverage for the managed docs-validation workflow sync path."""

from __future__ import annotations

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHELL = ROOT / "scripts" / "github" / "sync-github.sh"


def _sync_python_body() -> str:
    shell = SHELL.read_text(encoding="utf-8")
    return shell.split("<<'PY'\n", 1)[1].rsplit("\nPY", 1)[0]


def test_missing_managed_docs_source_emits_missing_in_source() -> None:
    """Absent hub source must surface MISSING, not a silent skip."""
    body = _sync_python_body()
    tree = ast.parse(body)
    sync_repo = next(
        node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == "sync_repo"
    )
    source = ast.unparse(sync_repo)
    assert "docs-validation-managed.yml" in source
    assert 'issues.append(f"MISSING: {docs_managed_src}")' in source or (
        'MISSING:' in source and "docs_managed_src" in source and "else:" in source
    )
    # Guard: the silent no-op (exists-only copy with empty else) must be gone.
    assert "if docs_managed_src.exists():" in source
    assert "else:" in source.split("docs_managed_src.exists():", 1)[1][:400]
