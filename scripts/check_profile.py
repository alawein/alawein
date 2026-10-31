"""Check the references in the profile README."""

import re
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
