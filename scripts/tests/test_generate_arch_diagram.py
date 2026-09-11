"""Generated diagrams must preserve prose and satisfy document freshness."""
from datetime import datetime, timezone
import importlib.util
import json
import os
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[1] / "ops/generate-arch-diagram.py"
OLD = "2026-09-06"
TODAY = "2026-09-07"
HEADER = f"---\ntype: generated\nlast_updated: {OLD}\nlast-verified: {OLD}\n---\n"
BEFORE = "\n# Architecture\n\n## Context\n\nKeep this prose.\n\n"
AFTER = "\n\n## Workflow\n\nKeep this too.\nlast_updated: body example\n"
TOPOLOGY = '```mermaid\ngraph TB\n  example["Example"]\n```'


@pytest.fixture
def generator():
    spec = importlib.util.spec_from_file_location("arch_generator", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def document(topology=TOPOLOGY):
    return (HEADER + BEFORE + "<!-- AUTO-GENERATED REPO TOPOLOGY START -->\n"
            f"<!-- last updated: {OLD}; do not edit; run scripts/ops/generate-arch-diagram.py -->\n\n"
            "### Repo Topology (auto-generated from catalog/repos.json)\n\n"
            + topology + "\n\n<!-- AUTO-GENERATED REPO TOPOLOGY END -->" + AFTER)


def test_changed_topology_refreshes_only_owned_metadata(generator):
    changed = TOPOLOGY.replace("Example", "Changed")
    result = generator.patch_arch_md(document(), changed, TODAY)
    assert result.startswith(HEADER.replace(f"last_updated: {OLD}", f"last_updated: {TODAY}") + BEFORE)
    assert result.endswith(AFTER)
    assert changed in result and TOPOLOGY not in result
    assert f"<!-- last updated: {TODAY};" in result


def test_later_date_does_not_change_identical_topology(generator):
    original = document()
    assert generator.patch_arch_md(original, TOPOLOGY, TODAY) == original


@pytest.mark.parametrize("prose", ["\n# Architecture\n", BEFORE, BEFORE + AFTER])
def test_missing_block_is_inserted_and_freshness_updated(generator, prose):
    result = generator.patch_arch_md(HEADER + prose, TOPOLOGY, TODAY)
    assert f"last_updated: {TODAY}\n" in result
    assert result.count(generator.SENTINEL_START) == 1
    assert result.count(generator.SENTINEL_END) == 1
    assert TOPOLOGY in result
    for line in prose.splitlines():
        assert line in result


def test_missing_header_date_does_not_overwrite_body_example(generator):
    original = document().replace(f"last_updated: {OLD}\n", "", 1)
    result = generator.patch_arch_md(original, "changed", TODAY)
    assert result.startswith(f"---\ntype: generated\nlast-verified: {OLD}\nlast_updated: {TODAY}\n---\n")
    assert result.endswith(AFTER)


def test_frontmatter_is_not_invented_for_an_unmanaged_document(generator):
    result = generator.patch_arch_md(document()[len(HEADER):], "changed", TODAY)
    assert result.startswith(BEFORE)
    assert result.endswith(AFTER)


def configure_main(generator, monkeypatch, tmp_path, content):
    path = tmp_path / "architecture.md"
    path.write_text(content, encoding="utf-8", newline="\n")
    catalog = tmp_path / "repos.json"
    catalog.write_text(json.dumps({"repos": [{"slug": "example", "type": "app"}]}))
    monkeypatch.setattr(generator, "ARCH_MD", path)
    monkeypatch.setattr(generator, "REPOS_JSON", catalog)
    monkeypatch.setattr(generator.sys, "argv", [str(SCRIPT)])
    return path


def test_generation_uses_utc_and_writes_lf(generator, monkeypatch, tmp_path):
    path = configure_main(generator, monkeypatch, tmp_path, document())

    class FixedClock(datetime):
        @classmethod
        def now(cls, tz=None):
            assert tz == timezone.utc
            return cls(2026, 9, 7, 0, 30, tzinfo=tz)

    monkeypatch.setattr(generator, "datetime", FixedClock, raising=False)
    generator.main()
    output = path.read_bytes()
    assert f"last_updated: {TODAY}\n".encode() in output
    assert b"\r\n" not in output


def test_overflow_label_is_plain_ascii(generator):
    repos = [{"slug": f"repo{i}", "type": "tooling"} for i in range(generator.MAX_PER_GROUP + 3)]
    topology = generator.generate_topology_mermaid(repos)
    assert 'more_tooling["... 3 more"]' in topology
    assert topology.isascii()


def test_unchanged_generation_does_not_write(generator, monkeypatch, tmp_path):
    topology = generator.generate_topology_mermaid([{"slug": "example", "type": "app"}])
    original = document(topology)
    path = configure_main(generator, monkeypatch, tmp_path, original)
    old_ns = 1_700_000_000_000_000_000
    os.utime(path, ns=(old_ns, old_ns))
    generator.main()
    assert path.read_text(encoding="utf-8") == original
    assert path.stat().st_mtime_ns == old_ns


def test_dry_run_prints_changes_without_writing(generator, monkeypatch, tmp_path, capsys):
    original = document()
    path = configure_main(generator, monkeypatch, tmp_path, original)
    monkeypatch.setattr(generator.sys, "argv", [str(SCRIPT), "--dry-run"])
    generator.main()
    assert 'example[' in capsys.readouterr().out
    assert path.read_text(encoding="utf-8") == original
