"""Every README template carries the framework header and its canon H2 order."""

from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEMPLATES = ROOT / "templates" / "scaffolding"
CATALOG_DIR = ROOT / "scripts" / "catalog"
if str(CATALOG_DIR) not in sys.path:
    sys.path.insert(0, str(CATALOG_DIR))

from catalog_lib import README_SECTIONS  # noqa: E402

HEADER_LINES = ["Status:", "Category:", "Owner:", "Visibility:", "Purpose:", "Next action:"]
TEMPLATE_TYPES = {
    "README.product.md": "product",
    "README.research.md": "research",
    "README.tooling.md": "tooling",
    "README.governance.md": "governance",
    "README.archive.md": "archive",
}


def _h2s(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"^##\s+(.+?)\s*$", text, re.MULTILINE)]


class ReadmeTemplateTests(unittest.TestCase):
    def test_all_templates_exist(self) -> None:
        for name in TEMPLATE_TYPES:
            self.assertTrue((TEMPLATES / name).is_file(), name)

    def test_header_block_follows_title(self) -> None:
        for name in TEMPLATE_TYPES:
            lines = (TEMPLATES / name).read_text(encoding="utf-8").splitlines()
            self.assertEqual(lines[0], "# {{name}}", name)
            block = lines[2:8]
            for expected, actual in zip(HEADER_LINES, block):
                self.assertTrue(actual.startswith(expected), f"{name}: expected {expected!r}, got {actual!r}")

    def test_h2_order_matches_canon(self) -> None:
        for name, rtype in TEMPLATE_TYPES.items():
            h2s = _h2s((TEMPLATES / name).read_text(encoding="utf-8"))
            self.assertEqual(h2s, README_SECTIONS[rtype], name)

    def test_no_em_dash(self) -> None:
        for name in TEMPLATE_TYPES:
            text = (TEMPLATES / name).read_text(encoding="utf-8")
            self.assertNotIn("\u2014", text, name)

    def test_catalog_sections_match_topology_validator(self) -> None:
        import importlib.util

        script = ROOT / "scripts" / "doctrine" / "validate-readme-topology.py"
        spec = importlib.util.spec_from_file_location("vrt", script)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for rtype in ("product", "research", "tooling", "infra", "archive"):
            self.assertEqual(README_SECTIONS[rtype], mod.SECTIONS_BY_TYPE[rtype], rtype)


if __name__ == "__main__":
    sys.exit(unittest.main(verbosity=2))
