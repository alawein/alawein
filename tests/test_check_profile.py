import hashlib
import io
import shlex
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from glob import has_magic
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from check_profile import Ref, missing_local, readme_refs
import check_profile


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

    def test_ignores_commented_profile_links_and_preserves_line_numbers(self):
        links = "[Work and contact](contact.md) [Research](research.md)"
        self.assertEqual(
            [ref.alt for ref in readme_refs(links)], ["Work and contact", "Research"],
        )
        self.assertEqual(
            readme_refs(f"<!--\n{links}\n--> [Visible](here.md)"),
            [Ref("link", "here.md", "Visible", 3)],
        )

    def test_checks_unquoted_html_image_sources_in_order(self):
        refs = readme_refs(
            "[Before](#before)\n<img src=missing.svg> <img alt=Icon src='mark.svg'>"
        )
        self.assertEqual(refs, [
            Ref("link", "#before", "Before", 1),
            Ref("image", "missing.svg", "", 2),
            Ref("image", "mark.svg", "Icon", 2),
        ])
        root = Path(tempfile.mkdtemp())
        (root / "mark.svg").touch()
        self.assertEqual(missing_local(refs, root), ["README.md:2 missing.svg"])
        self.assertEqual(check_profile.empty_alt(refs), ["README.md:2 missing.svg empty alt"])

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

    def test_local_images_require_files_but_links_may_point_to_directories(self):
        root = Path(tempfile.mkdtemp())
        (root / "assets").mkdir()
        refs = readme_refs("![x]()\n![x](assets)\n![x](#icon)\n[Assets](assets)")
        self.assertEqual(missing_local(refs, root), [
            "README.md:1 empty image source",
            "README.md:2 assets",
            "README.md:3 #icon",
        ])

    def test_missing_local_ignores_external_and_anchors(self):
        refs = readme_refs((ROOT / "README.md").read_text(encoding="utf-8"))
        secure = next(ref.target for ref in refs if ref.target.startswith("https://"))
        targets = [secure, secure.replace("https:", "http:", 1), "#section", "mailto:me"]
        refs = [Ref("link", target, "Link", 1) for target in targets]
        self.assertEqual(missing_local(refs, Path(tempfile.mkdtemp())), [])


class TestAlt(unittest.TestCase):
    def test_empty_alt_is_reported(self):
        refs = readme_refs(
            '![](mark.svg)\n![ \t](label.svg)\n<img src="icon.svg">'
            '\n[](page.md)'
        )
        self.assertEqual(check_profile.empty_alt(refs), [
            "README.md:1 mark.svg empty alt",
            "README.md:2 label.svg empty alt",
            "README.md:3 icon.svg empty alt",
        ])

    def test_nonempty_alt_passes(self):
        refs = readme_refs(
            '![A mark](mark.svg)\n<img src="icon.svg" alt=" Icon ">'
        )
        self.assertEqual(check_profile.empty_alt(refs), [])


class TestVoice(unittest.TestCase):
    def test_em_dash_lines_reports_line_numbers(self):
        dash = chr(0x2014)
        text = f"Profile\nOne {dash} two {dash} three\nPlain - text\n{dash}\n"
        self.assertEqual(check_profile.em_dash_lines(text), [2, 4])


class TestInventory(unittest.TestCase):
    def test_current_readme_identity_and_contact_links(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        with self.subTest("headline"):
            self.assertEqual(
                [line for line in text.splitlines() if line.startswith("# ")],
                ["# AI Researcher | Computational Physicist"],
            )
        with self.subTest("profile links"):
            self.assertEqual(
                [ref.alt for ref in readme_refs(text) if ref.kind == "link"],
                ["Work and contact", "Siftgrain Cite", "Siftgrain Audit", "Siftgrain State"],
            )

    def test_tools_line_names_all_five_tools(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertEqual(
            [line for line in text.splitlines() if line.startswith("Tools:")],
            ["Tools: Python, PyTorch, CUDA, SLURM and Docker."],
        )
        self.assertFalse(any(
            "stack-" in ref.target for ref in readme_refs(text)
            if ref.kind == "image"
        ))

    def test_each_suite_link_has_a_description(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        suite_paths = {
            "/alawein/siftgrain-cite",
            "/alawein/siftgrain-audit",
            "/alawein/siftgrain-state",
        }
        refs = [
            ref for ref in readme_refs(text)
            if ref.kind == "link" and urlsplit(ref.target).path in suite_paths
        ]
        self.assertCountEqual([urlsplit(ref.target).path for ref in refs], suite_paths)
        lines = text.splitlines()
        for ref in refs:
            _, separator, description = lines[ref.line - 1].partition(
                f"]({ref.target}): "
            )
            self.assertTrue(separator, f"{ref.alt} line has no description")
            self.assertGreaterEqual(len(description.split()), 6, ref.alt)
            self.assertTrue(description.endswith("."), ref.alt)

    def test_readme_link_inventory_is_pinned(self):
        refs = readme_refs((ROOT / "README.md").read_text(encoding="utf-8"))
        images = [ref.target for ref in refs if ref.kind == "image"]
        self.assertCountEqual(images, [
            "assets/meshal-mark.svg",
            "assets/label-ai-systems.svg",
            "assets/label-scientific-computing.svg",
            "assets/label-research-software.svg",
        ])
        self.assertEqual(
            [ref.alt for ref in refs if ref.target.startswith("assets/label-")],
            ["Focus area: AI systems", "Focus area: scientific computing",
             "Focus area: research software"],
        )
        self.assertEqual(sum(ref.kind == "link" for ref in refs), 4)
        pairs = sorted((ref.kind, ref.target) for ref in refs)
        inventory = "\n".join(f"{kind}\t{target}" for kind, target in pairs)
        self.assertEqual(
            hashlib.sha256(inventory.encode("utf-8")).hexdigest(),
            "d320621f2f3fa1746d0194e2255df742d56b607a2e2bc00f4fa0afb3f105e4f3",
            inventory,
        )


class TestAssets(unittest.TestCase):
    def test_unreferenced_asset_is_reported(self):
        root = Path(tempfile.mkdtemp())
        (root / "assets" / "nested").mkdir(parents=True)
        (root / "assets" / "nested" / "unused.svg").touch()
        self.assertEqual(
            check_profile.orphan_assets([], root),
            ["assets/nested/unused.svg unreferenced"],
        )

    def test_referenced_asset_is_not_reported(self):
        root = Path(tempfile.mkdtemp())
        (root / "assets").mkdir()
        (root / "assets" / "mark.svg").touch()
        refs = readme_refs("[Mark](./assets/mark.svg#shape)")
        self.assertEqual(check_profile.orphan_assets(refs, root), [])

    def test_git_inventory_keeps_tracked_and_new_but_excludes_ignored(self):
        root = Path(tempfile.mkdtemp())
        subprocess.run(["git", "init", "--quiet", str(root)], check=True)
        (root / "assets").mkdir()
        (root / "assets" / "tracked.svg").touch()
        subprocess.run(
            ["git", "add", "assets/tracked.svg"], cwd=root, check=True,
        )
        (root / ".gitignore").write_text(
            "assets/tracked.svg\nassets/retained.svg\n", encoding="utf-8",
        )
        (root / "assets" / "retained.svg").touch()
        (root / "assets" / "new asset.svg").touch()
        self.assertEqual(check_profile.orphan_assets([], root), [
            "assets/new asset.svg unreferenced",
            "assets/tracked.svg unreferenced",
        ])

    def test_git_file_uses_nul_delimited_inventory(self):
        root = Path(tempfile.mkdtemp())
        (root / ".git").touch()
        (root / "assets").mkdir()
        (root / "assets" / "new asset.svg").touch()
        result = subprocess.CompletedProcess([], 0, b"assets/new asset.svg\0")
        with patch("check_profile.subprocess.run", return_value=result) as run:
            self.assertEqual(
                check_profile.orphan_assets([], root),
                ["assets/new asset.svg unreferenced"],
            )
        run.assert_called_once_with(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard",
             "-z", "--", "assets"],
            cwd=root, check=True, capture_output=True,
        )

    def test_git_inventory_failure_does_not_use_filesystem_fallback(self):
        root = Path(tempfile.mkdtemp())
        (root / ".git").touch()
        failure = subprocess.CalledProcessError(128, ["git", "ls-files"])
        with patch("check_profile.subprocess.run", side_effect=failure):
            with self.assertRaises(subprocess.CalledProcessError):
                check_profile.orphan_assets([], root)

    def test_filesystem_inventory_does_not_descend_directory_links(self):
        scratch = Path(tempfile.mkdtemp())
        outside = scratch / "outside"
        outside.mkdir()
        (outside / "external.svg").touch()
        linked_root = scratch / "linked-root"
        linked_root.mkdir()
        nested_root = scratch / "nested"
        assets = nested_root / "assets"
        assets.mkdir(parents=True)
        (assets / "inside.svg").touch()

        for link in [linked_root / "assets", assets / "link"]:
            if sys.platform == "win32":
                subprocess.run(
                    ["cmd", "/d", "/c", "mklink", "/J", link.name,
                     str(outside.relative_to(link.parent, walk_up=True))],
                    cwd=link.parent, check=True, capture_output=True,
                )
            else:
                link.symlink_to(outside, target_is_directory=True)
        self.assertEqual(
            (check_profile.orphan_assets([], linked_root),
             check_profile.orphan_assets([], nested_root)),
            ([], ["assets/inside.svg unreferenced"]),
        )

    def test_filesystem_inventory_errors_propagate(self):
        root = Path(tempfile.mkdtemp())
        (root / "assets").mkdir()
        with patch.object(Path, "iterdir", side_effect=PermissionError("denied")):
            with self.assertRaises(PermissionError):
                check_profile.orphan_assets([], root)


class TestMain(unittest.TestCase):
    def test_main_returns_1_on_orphan(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text("Profile\n", encoding="utf-8")
        (root / "assets").mkdir()
        (root / "assets" / "unused.svg").touch()
        output = io.StringIO()
        with redirect_stdout(output):
            self.assertEqual(check_profile.main(["--root", str(root)]), 1)
        self.assertEqual(output.getvalue(), "assets/unused.svg unreferenced\n")

    def test_main_reports_missing_local_reference(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text("\n[Missing](missing.md)", encoding="utf-8")
        output = io.StringIO()
        with redirect_stdout(output):
            self.assertEqual(check_profile.main(["--root", str(root)]), 1)
        self.assertEqual(output.getvalue(), "README.md:2 missing.md\n")

    def test_main_returns_0_when_clean(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text("Profile\n", encoding="utf-8")
        output = io.StringIO()
        with redirect_stdout(output):
            self.assertEqual(check_profile.main(["--root", str(root)]), 0)
        self.assertEqual(output.getvalue(), "")

    def test_main_reports_read_error(self):
        root = Path(tempfile.mkdtemp())
        output = io.StringIO()
        with redirect_stdout(output):
            self.assertEqual(check_profile.main(["--root", str(root)]), 1)
        self.assertIn("README.md:0", output.getvalue())
        self.assertIn("No such file", output.getvalue())

    def test_main_reports_inventory_error(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text("Profile\n", encoding="utf-8")
        output = io.StringIO()
        with patch("check_profile.subprocess.run", side_effect=OSError("git unavailable")):
            (root / ".git").touch()
            with redirect_stdout(output):
                self.assertEqual(check_profile.main(["--root", str(root)]), 1)
        self.assertIn("README.md:0", output.getvalue())
        self.assertIn("git unavailable", output.getvalue())

    def test_cli_default_root_is_independent_of_working_directory(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "check_profile.py")],
            cwd=tempfile.mkdtemp(), capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "")

    def test_cli_root_option_and_exit_status(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text("[Missing](missing.md)", encoding="utf-8")
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "check_profile.py"),
             "--root", str(root)],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertEqual(result.stdout, "README.md:1 missing.md\n")

    def test_cli_reports_empty_alt(self):
        root = Path(tempfile.mkdtemp())
        (root / "mark.svg").touch()
        (root / "README.md").write_text("\n![](mark.svg)", encoding="utf-8")
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "check_profile.py"),
             "--root", str(root)],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertEqual(result.stdout, "README.md:2 mark.svg empty alt\n")

    def test_cli_reports_em_dash(self):
        root = Path(tempfile.mkdtemp())
        (root / "README.md").write_text(
            f"Profile\nOne {chr(0x2014)} two\n", encoding="utf-8",
        )
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "check_profile.py"),
             "--root", str(root)],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertEqual(result.stdout, "README.md:2 em dash\n")


class TestBrand(unittest.TestCase):
    def test_mark_bytes_are_approved(self):
        self.assertEqual(
            hashlib.sha256((ROOT / "assets" / "meshal-mark.svg").read_bytes()).hexdigest(),
            "799809a07d734a54c04aa0b7b6b9bfba59d934553d68270395135ad566c29b5d",
        )


class TestCi(unittest.TestCase):
    def test_ci_runs_the_profile_guard(self):
        text = (ROOT / ".github" / "workflows" / "ci.yml").read_text(encoding="utf-8")
        self.assertIn("run: python3 scripts/check_profile.py", text)
        self.assertIn("run: python3 -m unittest discover -s tests -q", text)
        uses = [
            line.strip().removeprefix("- ") for line in text.splitlines()
            if line.strip().removeprefix("- ").startswith("uses:")
        ]
        self.assertTrue(uses)
        for line in uses:
            self.assertRegex(line, r"^uses: \S+@[0-9a-f]{40}(?:\s|$)")


class TestJustfile(unittest.TestCase):
    def test_check_recipe_runs_the_profile_guard(self):
        text = (ROOT / "justfile").read_text(encoding="utf-8")
        self.assertIn("scripts/check_profile.py", text)
        self.assertIn("-m unittest discover -s tests -q", text)
        self.assertIn("check: lint test guard build", text)

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
