"""Tests for validate-doctrine.py.

Covers the exemption of internal/archived/vendored trees (`archive/`,
`_archive/`, `imports/`, `docs/superpowers/`, `docs/internal/`,
`tests|test/fixtures/`, a repo-root `db/`) and nested `README.md` files
from the doctrine contract -- and, crucially, that those exemptions do
not over-reach: a governed file sitting next to an exempt one is still
validated.

Tests assert against the structured `ValidationResult` from
`collect_results()` (rule + path), not just `validate()`'s boolean, so a
failure can be attributed to the right file and the right rule.
"""

from pathlib import Path

from validate_doctrine import collect_results, validate


def _write_md(path: Path, frontmatter: bool, type_value: str = "canonical") -> None:
    """Write a Markdown file, with or without doctrine frontmatter."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if frontmatter:
        path.write_text(f"---\ntype: {type_value}\n---\n\n# Doc\n", encoding="utf-8")
    else:
        path.write_text("# Doc\n\nNo frontmatter here.\n", encoding="utf-8")


def _errors(root):
    return collect_results(root).errors


def _failing_files(root):
    return {Path(p).name for p, _rule, _msg in _errors(root)}


def _rules(root):
    return sorted(rule for _p, rule, _msg in _errors(root))


# --- exempt trees: exempt file passes, and a governed sibling still fails ---

def test_archive_dir_is_exempt_and_does_not_over_reach(tmp_path):
    _write_md(tmp_path / "archive" / "old.md", frontmatter=False)
    assert _errors(tmp_path) == []
    # A governed sibling must still be checked.
    _write_md(tmp_path / "docs" / "guide.md", frontmatter=False)
    errs = _errors(tmp_path)
    assert _failing_files(tmp_path) == {"guide.md"}
    assert all(rule == "R1" for _p, rule, _m in errs)


def test_underscore_archive_dir_is_exempt(tmp_path):
    _write_md(tmp_path / "_archive" / "snap" / "old.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_imports_dir_is_exempt(tmp_path):
    # Vendored third-party content under imports/ is outside the contract.
    _write_md(tmp_path / "imports" / "vendor" / "card.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_archive_nested_under_governed_dir_is_still_pruned(tmp_path):
    # archive/ is exempt at any depth, even below a governed directory.
    _write_md(tmp_path / "docs" / "governance" / "archive" / "old.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_docs_superpowers_is_exempt(tmp_path):
    _write_md(tmp_path / "docs" / "superpowers" / "plans" / "p.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_docs_internal_is_exempt(tmp_path):
    _write_md(tmp_path / "docs" / "internal" / "specs" / "s.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_superpowers_exempt_only_directly_under_docs(tmp_path):
    # `superpowers` is exempt only as a direct child of docs/.
    _write_md(tmp_path / "src" / "superpowers" / "x.md", frontmatter=False)
    assert _failing_files(tmp_path) == {"x.md"}


def test_internal_exempt_only_directly_under_docs(tmp_path):
    # Same depth-scoping for `internal` -- a src/internal/ stays governed.
    _write_md(tmp_path / "src" / "internal" / "x.md", frontmatter=False)
    assert _failing_files(tmp_path) == {"x.md"}


def test_tests_fixtures_dir_is_exempt(tmp_path):
    # `fixtures` under tests/ or test/ holds test inputs, not doctrine docs.
    _write_md(tmp_path / "tests" / "fixtures" / "sample.md", frontmatter=False)
    _write_md(
        tmp_path / "packages" / "core" / "test" / "fixtures" / "x.md",
        frontmatter=False,
    )
    assert _errors(tmp_path) == []


def test_non_fixtures_dir_under_tests_is_still_governed(tmp_path):
    # The exemption is `fixtures`-specific, not tests/-wide.
    _write_md(tmp_path / "tests" / "data" / "x.md", frontmatter=False)
    assert _failing_files(tmp_path) == {"x.md"}


def test_root_db_dir_is_exempt(tmp_path):
    _write_md(tmp_path / "db" / "tasks" / "a-task.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_non_root_db_dir_is_not_exempt(tmp_path):
    # db/ is exempt only at the repo root; a nested src/db/ stays governed.
    _write_md(tmp_path / "src" / "db" / "notes.md", frontmatter=False)
    assert _failing_files(tmp_path) == {"notes.md"}


# --- nested README.md exemption (must hold across every rule, incl. R2) ---

def test_nested_readme_is_exempt(tmp_path):
    _write_md(tmp_path / "packages" / "cli" / "README.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_nested_readmes_with_canonical_frontmatter_do_not_trigger_r2(tmp_path):
    # Regression: nested READMEs are excluded from managed_files, so two of
    # them carrying `type: canonical` must NOT collide on R2 duplicate-canonical.
    _write_md(tmp_path / "packages" / "a" / "README.md", frontmatter=True)
    _write_md(tmp_path / "packages" / "b" / "README.md", frontmatter=True)
    assert "R2" not in _rules(tmp_path)
    assert _errors(tmp_path) == []


# --- root entrypoint READMEs: exempt from REQUIRING frontmatter, but must
#     NOT carry a visible YAML block ---

def test_root_readme_without_frontmatter_passes(tmp_path):
    _write_md(tmp_path / "README.md", frontmatter=False)
    assert _errors(tmp_path) == []


def test_root_readme_with_frontmatter_fails(tmp_path):
    _write_md(tmp_path / "README.md", frontmatter=True)
    rules = _rules(tmp_path)
    assert rules == ["R1"]
    assert "must not include visible YAML frontmatter" in _errors(tmp_path)[0][2]


def test_docs_readme_with_frontmatter_fails(tmp_path):
    _write_md(tmp_path / "docs" / "README.md", frontmatter=True)
    assert _rules(tmp_path) == ["R1"]


# --- doctrine still works (anchors against a vacuously-passing suite) ---

def test_governed_headerless_md_fails_r1(tmp_path):
    _write_md(tmp_path / "docs" / "guide.md", frontmatter=False)
    assert _rules(tmp_path) == ["R1"]
    assert validate(tmp_path) is False


def test_governed_file_with_valid_header_passes(tmp_path):
    _write_md(tmp_path / "docs" / "guide.md", frontmatter=True, type_value="canonical")
    assert _errors(tmp_path) == []
    assert validate(tmp_path) is True


def test_governed_file_with_invalid_type_fails_r1(tmp_path):
    _write_md(tmp_path / "docs" / "guide.md", frontmatter=True, type_value="doc")
    assert _rules(tmp_path) == ["R1"]


# --- R11 placeholder-residue: unfilled scaffold stubs must go RED ---

def _write_doc(path: Path, body: str) -> None:
    """Write a governed doc with valid frontmatter and a given body, so R1
    passes and only body-content rules (R11) can fire."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"---\ntype: canonical\n---\n\n# Doc\n\n{body}\n", encoding="utf-8")


def _r11_for(root):
    return [(Path(p).name, msg) for p, rule, msg in _errors(root) if rule == "R11"]


def test_residual_install_command_token_fails_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "guide.md", "Run `{{install_command}}` to begin.")
    assert "R11" in _rules(tmp_path)


def test_residual_mustache_token_fails_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "guide.md", "Maintainer: `{{maintainer}}`.")
    assert "R11" in _rules(tmp_path)


def test_residual_brace_placeholder_fails_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "setup.md", "Install with {INSTALL_COMMAND}.")
    _write_doc(tmp_path / "docs" / "test.md", "Test with {TEST_COMMAND}.")
    assert _rules(tmp_path).count("R11") >= 2


def test_residual_placeholder_prose_fails_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "arch.md", "Summarize the main runtime, data flow, and dependencies.")
    assert "R11" in _rules(tmp_path)


def test_residual_deployment_prose_fails_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "deploy.md", "Document how production or preview environments are built.")
    assert "R11" in _rules(tmp_path)


def test_todo_linked_as_authoritative_fails_r11(tmp_path):
    # A bare authoritative TODO line (blockquote) signals an unfilled stub.
    _write_doc(tmp_path / "docs" / "ops.md", "> TODO: write the runbook.")
    assert "R11" in _rules(tmp_path)


def test_templates_dir_is_exempt_from_r11(tmp_path):
    # Template SOURCES legitimately contain {{...}} tokens and placeholder
    # prose; the rule must never fire inside templates/.
    body = (
        "Run `{{install_command}}`.\n\n"
        "Summarize the main runtime, data flow, and dependencies.\n\n"
        "Document how production or preview environments are built."
    )
    (tmp_path / "templates" / "scaffolding").mkdir(parents=True, exist_ok=True)
    (tmp_path / "templates" / "scaffolding" / "README.product.md").write_text(
        f"# {{{{name}}}}\n\n{body}\n", encoding="utf-8"
    )
    assert "R11" not in _rules(tmp_path)


def test_clean_doc_has_no_r11(tmp_path):
    _write_doc(tmp_path / "docs" / "guide.md", "Run `pip install -e .` to begin.")
    assert "R11" not in _rules(tmp_path)


def test_shell_env_var_reference_is_not_r11(tmp_path):
    # Regression: a documented env-var reference like `${GITHUB_PAT}` is a
    # secure-pattern example, not an unfilled scaffold token.
    _write_doc(
        tmp_path / "docs" / "credential-hygiene.md",
        'Use environment variable references (e.g. `"${GITHUB_PAT}"`).',
    )
    assert "R11" not in _rules(tmp_path)
