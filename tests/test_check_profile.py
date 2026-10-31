import hashlib
import shlex
import subprocess
import sys
import tempfile
import unittest
from glob import has_magic
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from check_profile import Ref, missing_local, readme_refs


class TestParse(unittest.TestCase):
    def test_parses_markdown_image(self):
        self.assertEqual(
            readme_refs("\n![A mark](assets/mark.svg)"),
            [Ref("image", "assets/mark.svg", "A mark", 2)],
        )

    def test_parses_html_img_with_alt(self):
        self.assertEqual(
            readme_refs("""\n<img width="48" alt="A mark"\n src='assets/mark.svg'>"""),
            [Ref("image", "assets/mark.svg", "A mark", 2)],
        )

    def test_parses_links_with_line_numbers(self):
        self.assertEqual(
            readme_refs("[One](one.md) and [Two](two.md)\n\n[Three](three.md)"),
            [
                Ref("link", "one.md", "One", 1),
                Ref("link", "two.md", "Two", 1),
                Ref("link", "three.md", "Three", 3),
            ],
        )


class TestMissing(unittest.TestCase):
    def test_missing_local_reports_absent_file(self):
        root = Path(tempfile.mkdtemp())
        (root / "present.md").touch()
        refs = readme_refs("[Present](present.md)\n\n![Absent](missing.svg)")
        self.assertEqual(missing_local(refs, root), ["README.md:3 missing.svg"])

    def test_missing_local_ignores_external_and_anchors(self):
        refs = readme_refs((ROOT / "README.md").read_text(encoding="utf-8"))
        secure = next(ref.target for ref in refs if ref.target.startswith("https://"))
        targets = [secure, secure.replace("https:", "http:", 1), "#section", "mailto:me"]
        refs = [Ref("link", target, "Link", 1) for target in targets]
        self.assertEqual(missing_local(refs, Path(tempfile.mkdtemp())), [])


class TestInventory(unittest.TestCase):
    def test_readme_link_inventory_is_pinned(self):
        refs = readme_refs((ROOT / "README.md").read_text(encoding="utf-8"))
        images = [ref.target for ref in refs if ref.kind == "image"]
        self.assertCountEqual(images, [
            "assets/meshal-mark.svg",
            "assets/label-ai-systems.svg",
            "assets/label-scientific-computing.svg",
            "assets/label-research-software.svg",
            "assets/stack-python.svg",
            "assets/stack-pytorch.svg",
            "assets/stack-cuda.svg",
            "assets/stack-slurm.svg",
            "assets/stack-docker.svg",
        ])
        self.assertEqual(sum(ref.kind == "link" for ref in refs), 5)
        pairs = sorted((ref.kind, ref.target) for ref in refs)
        inventory = "\n".join(f"{kind}\t{target}" for kind, target in pairs)
        self.assertEqual(
            hashlib.sha256(inventory.encode("utf-8")).hexdigest(),
            "ea783ea0aa5265d021fbfe65cb4d0f94c211af3fb56585dc6e545e0abcba57b8",
            inventory,
        )


class TestJustfile(unittest.TestCase):
    def test_justfile_names_only_existing_files(self):
        text = (ROOT / "justfile").read_text(encoding="utf-8")
        targets = {
            token for line in text.splitlines() for token in shlex.split(line)
            if token.endswith((".md", ".yaml"))
        }
        self.assertTrue(targets)
        tracked = set(subprocess.run(
            ["git", "ls-files", "-z"], cwd=ROOT, check=True,
            capture_output=True, text=True, encoding="utf-8",
        ).stdout.split("\0"))
        for target in sorted(targets):
            with self.subTest(target=target):
                paths = list(ROOT.glob(target)) if has_magic(target) else [ROOT / target]
                self.assertTrue(paths, f"No files match {target}")
                for path in paths:
                    self.assertTrue(path.is_file(), str(path))
                    self.assertIn(path.relative_to(ROOT).as_posix(), tracked)
        self.assertNotIn("AGENTS.md", text)
        self.assertNotIn("CLAUDE.md", text)
