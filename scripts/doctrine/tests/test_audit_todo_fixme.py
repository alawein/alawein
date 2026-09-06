"""Tests for audit-todo-fixme.py: executable-source-only TODO/FIXME auditing."""

from audit_todo_fixme import is_excluded, run_audit
from pathlib import Path


def _write(root: Path, rel: str, content: str) -> Path:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def test_includes_todo_in_python_source(tmp_path):
    _write(tmp_path, "src/app.py", "# TODO: fix this\nx = 1\n")
    findings = run_audit(tmp_path)
    assert len(findings) == 1
    rel = next(iter(findings))
    assert rel == tmp_path / "src" / "app.py"


def test_includes_fixme_in_shell_source(tmp_path):
    _write(tmp_path, "scripts/deploy.sh", "#!/bin/bash\n# FIXME: harden this\n")
    findings = run_audit(tmp_path)
    assert len(findings) == 1


def test_includes_todo_in_js_ts_family(tmp_path):
    _write(tmp_path, "app/index.ts", "// TODO: type this properly\n")
    _write(tmp_path, "app/legacy.js", "// FIXME: remove\n")
    findings = run_audit(tmp_path)
    assert len(findings) == 2


def test_excludes_docs_surface(tmp_path):
    _write(tmp_path, "docs/plan.md", "TODO: not scanned, not executable source\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_excludes_generated_surface(tmp_path):
    _write(tmp_path, "catalog/generated/output.js", "// TODO: generated, skip\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_excludes_vendor_surface(tmp_path):
    _write(tmp_path, "vendor/lib/thing.py", "# TODO: not ours\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_excludes_build_surface(tmp_path):
    _write(tmp_path, "build/bundle.js", "// TODO: build artifact\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_excludes_cache_surface(tmp_path):
    _write(tmp_path, ".pytest_cache/stub.py", "# TODO: cache artifact\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_excludes_archive_surface(tmp_path):
    _write(tmp_path, "_archive/2026-06-helios/old.py", "# TODO: archived, skip\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_ignores_non_executable_extensions(tmp_path):
    _write(tmp_path, "notes/plan.txt", "TODO: not executable source\n")
    _write(tmp_path, "docs/architecture.md", "TODO: markdown, not scanned here\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_is_excluded_matches_any_ancestor_dir():
    assert is_excluded(Path("a/vendor/b.py"))
    assert is_excluded(Path("docs/x.py"))
    assert not is_excluded(Path("src/app.py"))


def test_no_findings_when_no_markers(tmp_path):
    _write(tmp_path, "src/clean.py", "x = 1\n")
    findings = run_audit(tmp_path)
    assert findings == {}


def test_check_mode_exit_code(tmp_path, capsys):
    from audit_todo_fixme import main

    _write(tmp_path, "src/app.py", "# TODO: fix\n")
    assert main(["--check", "--root", str(tmp_path)]) == 1

    clean = tmp_path / "clean_root"
    clean.mkdir()
    assert main(["--check", "--root", str(clean)]) == 0
