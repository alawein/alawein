#!/usr/bin/env python3
"""Read-only, deterministic work-kind plan from observed GitHub records.

Input is an array of repository issue objects with repo/full_name and labels.
Output is a JSON plan. This script never writes to a service. Keep private
observations in the authorized batch ledger, outside the public control plane.
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def classify(record, vocabulary):
    kinds = vocabulary["workKinds"]
    labels = {x["name"] if isinstance(x, dict) else x for x in record.get("labels", [])}
    canonical = {x["key"] for x in kinds if x["github"] in labels}
    if len(canonical) > 1:
        return None, "conflicting canonical work kinds"
    if canonical:
        return next(iter(canonical)), "existing canonical label"
    aliases = {x["key"] for x in kinds if labels.intersection(x.get("aliases", []))}
    if len(aliases) > 1:
        return None, "conflicting legacy work kinds"
    title = re.match(r"^([a-z]+)(?:\([^\n)]+\))?!?:\s+", record.get("title", ""))
    prefix_kind = vocabulary["titlePrefixes"].get(title.group(1)) if title else None
    if aliases and prefix_kind and prefix_kind not in aliases:
        return None, "title conflicts with legacy label"
    if aliases:
        return next(iter(aliases)), "existing legacy label"
    if prefix_kind:
        return prefix_kind, "explicit conventional title prefix"
    return None, "no unambiguous work kind"


def plan(records, vocabulary):
    names = {x["key"]: x["github"] for x in vocabulary["workKinds"]}
    result = []
    seen = set()
    for record in records:
        repo = record.get("repo") or record.get("repository_full_name")
        number = record.get("number") or record.get("issue_number")
        identity = (repo, number)
        if not repo or not number or identity in seen:
            raise ValueError(f"missing or duplicate record identity: {identity}")
        seen.add(identity)
        labels = sorted(x["name"] if isinstance(x, dict) else x for x in record.get("labels", []))
        kind, reason = classify(record, vocabulary)
        action = "review"
        if record.get("state") != "open" or record.get("archived"):
            action, reason = "preserve", "historical or archived record"
        elif kind:
            action = "unchanged" if names[kind] in labels else "add"
        result.append({
            "repo": repo, "number": number, "source_id": record.get("id"),
            "url": record.get("html_url") or record.get("url"),
            "title": record.get("title"), "kind": kind, "reason": reason,
            "action": action, "add": [names[kind]] if action == "add" else [],
            "before_labels": labels, "observed_updated_at": record.get("updated_at"),
        })
    return sorted(result, key=lambda row: (row["repo"], row["number"]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("observations", type=Path)
    parser.add_argument("--taxonomy", type=Path, default=ROOT / "catalog/taxonomy.json")
    args = parser.parse_args()
    vocabulary = json.loads(args.taxonomy.read_text())["workRecords"]
    print(json.dumps(plan(json.loads(args.observations.read_text()), vocabulary), indent=2))


if __name__ == "__main__":
    main()
