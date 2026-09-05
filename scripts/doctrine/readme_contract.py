"""Small Markdown helpers for public README contract validation."""
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class RenderedLine:
    number: int
    text: str


@dataclass(frozen=True)
class Section:
    heading: str
    line: int
    body: tuple[RenderedLine, ...]


def rendered_lines(markdown: str) -> list[RenderedLine]:
    """Return prose lines, excluding fenced blocks and HTML comments."""
    result: list[RenderedLine] = []
    fence: str | None = None
    in_comment = False
    for number, raw in enumerate(markdown.splitlines(), 1):
        stripped = raw.lstrip()
        if fence is not None:
            if re.match(rf"^\s*{re.escape(fence)}\s*$", raw):
                fence = None
            continue
        match = re.match(r"^\s*(`{3,}|~{3,})", raw)
        if match:
            fence = match.group(1)[0] * len(match.group(1))
            continue
        line = raw
        if in_comment:
            if "-->" not in line:
                continue
            line = line.split("-->", 1)[1]
            in_comment = False
        while "<!--" in line:
            before, after = line.split("<!--", 1)
            if "-->" in after:
                line = before + after.split("-->", 1)[1]
            else:
                line = before
                in_comment = True
                break
        result.append(RenderedLine(number, line))
    return result


def sections(markdown: str) -> list[Section]:
    lines = rendered_lines(markdown)
    headings = [
        (index, line, match.group(1).strip())
        for index, line in enumerate(lines)
        if (match := re.match(r"^##\s+(.+?)\s*$", line.text))
    ]
    result: list[Section] = []
    for position, (index, line, heading) in enumerate(headings):
        end = headings[position + 1][0] if position + 1 < len(headings) else len(lines)
        result.append(Section(heading, line.number, tuple(lines[index + 1:end])))
    return result


def meaningful_body(section: Section, *, through_line: int | None = None) -> bool:
    return any(
        line.text.strip() and not line.text.lstrip().startswith("#")
        for line in section.body
        if through_line is None or line.number <= through_line
    )


def runnable_body(section: Section, *, through_line: int | None = None) -> bool:
    lines = [
        line for line in section.body
        if through_line is None or line.number <= through_line
    ]
    body = "\n".join(line.text for line in lines)
    inline = re.findall(r"`([^`\n]+)`", body)
    if any(_looks_like_command(value) for value in inline):
        return True
    # Fenced blocks are removed from rendered prose, so inspect the original
    # line interval separately in callers when needed.
    return any(
        _looks_like_command(line.text)
        for line in lines
    )


def _looks_like_command(value: str) -> bool:
    text = re.sub(r"^\s*(?:[$>]\s*)?", "", value).strip()
    return bool(re.match(
        r"^(?:python\d*(?:\.\d+)?\s+(?:-[\w-]+|[\w./\\-]+\.py\b)|pip\d*\s+\w|uv\s+\w|npm\s+\w|pnpm\s+\w|yarn\s+\w|bun\s+\w|make(?:\s+\w+)?$|cargo\s+\w|go\s+\w|docker\s+\w|pytest(?:\s|$)|\.\\|\.\/|[\w.-]+\s+--?[\w-]+\b)",
        text,
        re.IGNORECASE,
    ))


def strip_markdown_prefix(line: str) -> str:
    text = re.sub(r"^\s*(?:[-+*]|\d+[.)])\s+", "", line)
    text = re.sub(r"^\s*>\s*", "", text)
    return re.sub(r"[*_~`]", "", text).strip()
