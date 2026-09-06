#!/usr/bin/env python3
"""Read open GitHub issues and PRs and report shared work-kind drift.

Uses the existing taxonomy and migration planner. No service writes occur.
Exit 0: observed records conform; 1: drift; 2: source coverage unverified.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "plan_work_labels", ROOT / "scripts/catalog/plan-work-labels.py"
)
PLANNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PLANNER)


def github_get(endpoint: str, gh_bin: str, paginate: bool = False) -> Any:
    args = [gh_bin, "api", "--method", "GET", endpoint,
            "-H", "Accept: application/vnd.github+json",
            "-H", "X-GitHub-Api-Version: 2022-11-28"]
    if paginate:
        args.extend(["--paginate", "--slurp"])
    result = subprocess.run(args, check=True, capture_output=True, text=True, timeout=120)
    return json.loads(result.stdout)


def normalize_records(repo: str, metadata: Any, pages: Any) -> list[dict[str, Any]]:
    if (not isinstance(metadata, dict)
            or str(metadata.get("full_name", "")).casefold() != repo.casefold()
            or not isinstance(metadata.get("archived"), bool)):
        raise ValueError("repository identity or archived state is missing")
    if not isinstance(pages, list) or not pages or any(not isinstance(page, list) for page in pages):
        raise ValueError("expected all paginated issue arrays, including an empty page for no records")
    rows = []
    for page in pages:
        for item in page:
            if (not isinstance(item, dict)
                    or type(item.get("id")) is not int or item["id"] <= 0
                    or type(item.get("number")) is not int or item["number"] <= 0
                    or not isinstance(item.get("title"), str)
                    or item.get("state") not in {"open", "closed"}
                    or not isinstance(item.get("updated_at"), str)
                    or not isinstance(item.get("labels"), list)
                    or any(not isinstance(label, dict) or not isinstance(label.get("name"), str)
                           for label in item["labels"])):
                raise ValueError("issue identity, state, timestamp or labels are missing")
            rows.append({
                "repo": repo, "id": item["id"], "number": item["number"],
                "title": item["title"], "state": item["state"],
                "archived": metadata["archived"], "updated_at": item["updated_at"],
                "html_url": f"https://github.com/{repo}/issues/{item['number']}",
                "labels": [label["name"] for label in item["labels"]],
            })
    return rows


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="One authorized owner/repository")
    parser.add_argument("--output", required=True, type=Path, help="Local JSON report path")
    parser.add_argument("--gh-bin", default="gh")
    args = parser.parse_args(argv)
    if (not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_.-]+", args.repo)
            or args.repo.split("/")[-1] in {".", ".."}):
        parser.error("--repo must be owner/repository")
    report: dict[str, Any] = {
        "repo": args.repo, "started_at": datetime.now(timezone.utc).isoformat(),
        "scope": "open GitHub issues and pull requests in this repository",
        "coverage": "unverified", "result": "unverified", "counts": {}, "plan": [],
        "limitations": [
            "Pagination is a dated observation, not an atomic repository snapshot.",
            "Does not verify discussions, label definitions, repository settings, Linear, review or approval.",
        ],
    }
    code = 2
    try:
        metadata = github_get(f"repos/{args.repo}", args.gh_bin)
        pages = github_get(f"repos/{args.repo}/issues?state=open&per_page=100", args.gh_bin, True)
        records = normalize_records(args.repo, metadata, pages)
        vocabulary = json.loads((ROOT / "catalog/taxonomy.json").read_text())["workRecords"]
        rows = PLANNER.plan(records, vocabulary)
        drift = any(row["action"] in {"add", "review"} for row in rows)
        report.update(coverage="observed", result="drift" if drift else "conformant",
                      counts=dict(Counter(row["action"] for row in rows)), plan=rows)
        code = int(drift)
    except (OSError, ValueError, subprocess.SubprocessError) as exc:
        # Keep raw provider output out of artifacts; it can contain private data.
        report["error"] = {"class": type(exc).__name__, "action": "Verify read access and response completeness; do not infer a pass."}
    report["completed_at"] = datetime.now(timezone.utc).isoformat()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Work taxonomy: {report['result']}; coverage: {report['coverage']}; {report['counts']}")
    return code


if __name__ == "__main__":
    raise SystemExit(main())
