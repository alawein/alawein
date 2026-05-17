"""Tests for validate-doctrine.py -- directory exemption behavior.

Covers the exemption of internal/archived doc workspaces (`archive/`,
`_archive/`, `docs/superpowers/`, `docs/internal/`) from the doctrine
contract: files under those directories are skipped during the walk, so
no rule applies to them.
"""

from pathlib import Path

from validate_doctrine import validate


def _write_md(path: Path, frontmatter: bool) -> None:
    """Write a Markdown file, with or without doctrine frontmatter."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if frontmatter:
        path.write_text("---\ntype: canonical\n---\n\n# Doc\n", encoding="utf-8")
    else:
        path.write_text("# Doc\n\nNo frontmatter here.\n", encoding="utf-8")


def test_archive_dir_is_exempt(tmp_path):
    # A headerless .md under archive/ must not fail validation.
    _write_md(tmp_path / "archive" / "old-notes.md", frontmatter=False)
    assert validate(tmp_path) is True


def test_underscore_archive_dir_is_exempt(tmp_path):
    _write_md(tmp_path / "_archive" / "snapshot" / "old.md", frontmatter=False)
    assert validate(tmp_path) is True


def test_docs_superpowers_is_exempt(tmp_path):
    _write_md(
        tmp_path / "docs" / "superpowers" / "plans" / "a-plan.md",
        frontmatter=False,
    )
    assert validate(tmp_path) is True


def test_docs_internal_is_exempt(tmp_path):
    _write_md(
        tmp_path / "docs" / "internal" / "specs" / "a-spec.md",
        frontmatter=False,
    )
    assert validate(tmp_path) is True


def test_non_exempt_headerless_md_still_fails(tmp_path):
    # Control: a headerless .md outside the exempt dirs must still fail R1.
    _write_md(tmp_path / "docs" / "guide.md", frontmatter=False)
    assert validate(tmp_path) is False


def test_superpowers_exempt_only_directly_under_docs(tmp_path):
    # `superpowers` is exempt only as a direct child of `docs/`. A
    # `superpowers` directory elsewhere stays under the doctrine contract.
    _write_md(tmp_path / "src" / "superpowers" / "x.md", frontmatter=False)
    assert validate(tmp_path) is False


def test_nested_readme_is_exempt(tmp_path):
    # A README.md at any depth is a GitHub surface, exempt from frontmatter.
    _write_md(tmp_path / "packages" / "cli" / "README.md", frontmatter=False)
    assert validate(tmp_path) is True


def test_tests_fixtures_dir_is_exempt(tmp_path):
    # `fixtures` under tests/ or test/ holds test inputs, not doctrine docs.
    _write_md(tmp_path / "tests" / "fixtures" / "sample.md", frontmatter=False)
    _write_md(
        tmp_path / "packages" / "core" / "test" / "fixtures" / "x.md",
        frontmatter=False,
    )
    assert validate(tmp_path) is True


def test_root_db_dir_is_exempt(tmp_path):
    # A repo-root db/ is a record database with its own schema.
    _write_md(tmp_path / "db" / "tasks" / "a-task.md", frontmatter=False)
    assert validate(tmp_path) is True


def test_non_root_db_dir_is_not_exempt(tmp_path):
    # db/ is exempt only at the repo root; a nested src/db/ stays governed.
    _write_md(tmp_path / "src" / "db" / "notes.md", frontmatter=False)
    assert validate(tmp_path) is False
