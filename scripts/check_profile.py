"""Check the references in the profile README."""

import argparse
import os
import re
import subprocess
from pathlib import Path
from typing import NamedTuple


class Ref(NamedTuple):
    kind: str
    target: str
    alt: str
    line: int


REFERENCE = re.compile(
    r"(?P<image>!)?\[(?P<label>[^\]\n]*)\]\((?P<target>[^)\n]*)\)"
    r"|(?P<html><img\b[^>]*>)",
    re.IGNORECASE,
)
ATTRIBUTE = re.compile(r"""\s+([^\s=/>]+)\s*=\s*(["'])(.*?)\2""", re.DOTALL)


def readme_refs(text: str) -> list[Ref]:
    refs = []
    for match in REFERENCE.finditer(text):
        line = text.count("\n", 0, match.start()) + 1
        if match["html"]:
            attrs = {
                name.lower(): value
                for name, _, value in ATTRIBUTE.findall(match["html"])
            }
            if "src" in attrs:
                refs.append(Ref("image", attrs["src"], attrs.get("alt", ""), line))
        else:
            kind = "image" if match["image"] else "link"
            refs.append(Ref(kind, match["target"], match["label"], line))
    return refs


def missing_local(refs: list[Ref], root: Path) -> list[str]:
    missing = []
    for ref in refs:
        if ref.target.lower().startswith(("http://", "https://", "mailto:", "#")):
            continue
        path = ref.target.partition("#")[0]
        if not (root / path).exists():
            missing.append(f"README.md:{ref.line} {ref.target}")
    return missing


def orphan_assets(refs: list[Ref], root: Path) -> list[str]:
    referenced = {Path(ref.target.partition("#")[0]).as_posix() for ref in refs}
    if (root / ".git").exists():
        result = subprocess.run(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard",
             "-z", "--", "assets"],
            cwd=root, check=True, capture_output=True,
        )
        paths = [root / os.fsdecode(name) for name in result.stdout.split(b"\0") if name]
    else:
        assets = root / "assets"
        directories = [assets] if assets.exists() else []
        paths = []
        while directories:
            for path in directories.pop().iterdir():
                if path.name.startswith(".env"):
                    continue
                if path.is_dir():
                    directories.append(path)
                else:
                    paths.append(path)
    return sorted({
        f"{path.relative_to(root).as_posix()} unreferenced"
        for path in paths
        if not path.name.startswith(".env") and path.is_file()
        and path.relative_to(root).as_posix() not in referenced
    })


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    root = parser.parse_args(argv).root
    try:
        refs = readme_refs((root / "README.md").read_text(encoding="utf-8"))
        findings = missing_local(refs, root) + orphan_assets(refs, root)
    except (OSError, UnicodeError, subprocess.CalledProcessError) as error:
        print(f"README.md:0 {error}")
        return 1
    for finding in findings:
        print(finding)
    return int(bool(findings))


if __name__ == "__main__":
    raise SystemExit(main())
