"""Validators distinguish governed files from Git metadata and kit history."""

import importlib.util
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_root_whitelist_accepts_git_worktree_metadata(tmp_path, monkeypatch):
    source = tmp_path / "source"
    checkout = tmp_path / "checkout"
    subprocess.run(["git", "init", str(source)], check=True, capture_output=True)
    subprocess.run(["git", "-C", str(source), "-c", "user.name=Test", "-c",
                    "user.email=test@example.invalid", "commit", "--allow-empty",
                    "--no-gpg-sign", "-m", "Fixture"], check=True, capture_output=True)
    subprocess.run(["git", "-C", str(source), "worktree", "add", "--detach",
                    str(checkout)], check=True, capture_output=True)
    monkeypatch.chdir(checkout)
    monkeypatch.setenv("DOC_CONTRACT_MODE", "--full")
    monkeypatch.setenv("DOC_CONTRACT_BASE_REF_INPUT", "")
    script = ROOT / "scripts/doctrine/validate-doc-contract.sh"
    code = script.read_text(encoding="utf-8").split("python3 - <<'PY'\n", 1)[1].rsplit("\nPY", 1)[0]
    namespace = {"__name__": "doc_contract_under_test"}
    exec(compile(code, str(script), "exec"), namespace)
    errors = []
    namespace["check_root_whitelist"](errors)
    assert errors == []

    # An exemption for Git metadata must not hide other unexpected root files.
    (checkout / "unmanaged.txt").write_text("unexpected", encoding="utf-8")
    (checkout / "README.md").write_text("# Fixture", encoding="utf-8")
    errors = []
    namespace["check_root_whitelist"](errors)
    assert len(errors) == 1
    assert errors[0].startswith("unmanaged.txt:1:")


def test_prompt_kit_changelog_is_not_validated_as_a_kit(tmp_path, monkeypatch, capsys):
    script = ROOT / "scripts/doctrine/validate-prompt-kit.py"
    spec = importlib.util.spec_from_file_location("prompt_kit_under_test", script)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    monkeypatch.setattr(module, "PROMPT_KITS_DIR", tmp_path)
    (tmp_path / "KITS-CHANGELOG.md").write_text("# Kit history", encoding="utf-8")
    (tmp_path / "AGENT.md").write_text(
        "---\ntype: canonical\nversion: 1.0.0\nlast-verified: 2026-09-06\n"
        "downstream-consumers: []\n---\n## Identity\nAgent instructions.\n", encoding="utf-8")
    assert module.main() == 0
    assert "All 1 prompt kit(s) valid" in capsys.readouterr().out

    # A malformed real kit still fails validation.
    (tmp_path / "AGENT.md").write_text("# Invalid kit", encoding="utf-8")
    assert module.main() == 1
    assert "FAIL [AGENT.md]" in capsys.readouterr().out
