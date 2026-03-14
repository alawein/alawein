#!/usr/bin/env python3
"""Generate a static GitHub repository dashboard with persisted snapshots."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from github_dashboard_lib import (
    apply_outputs,
    build_payload,
    build_static_outputs,
    fetch_repos,
    iso_now,
    json_load,
    list_scope_snapshots,
    make_scope_key,
    prune_snapshot_paths,
    snapshot_id_now,
    snapshot_path,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build static GitHub dashboard artifacts.")
    parser.add_argument("--owners", required=True, help="Comma-separated owner list. Example: alawein,morphism-systems")
    parser.add_argument("--output", default="docs/dashboard", help="Output directory for generated artifacts.")
    parser.add_argument("--retention", type=int, default=180, help="Maximum snapshots to keep per owner scope.")
    parser.add_argument("--check", action="store_true", help="Exit non-zero when generated outputs would change.")
    parser.add_argument(
        "--fixture",
        help="Optional JSON fixture file for deterministic generation without network calls.",
    )
    return parser.parse_args()


def normalize_owners(raw: str) -> List[str]:
    owners = [entry.strip() for entry in raw.split(",") if entry.strip()]
    if not owners:
        raise ValueError("At least one owner is required.")
    return owners


def load_fixture(path: Optional[str]) -> Optional[Dict[str, Any]]:
    if not path:
        return None
    fixture_path = Path(path).resolve()
    return json.loads(fixture_path.read_text(encoding="utf-8"))


def _same_scope(payload: Optional[Dict[str, Any]], owners: List[str]) -> bool:
    if not payload:
        return False
    return [owner.lower() for owner in payload.get("owners", [])] == [owner.lower() for owner in owners]


def main() -> int:
    args = parse_args()
    owners = normalize_owners(args.owners)
    output_dir = Path(args.output).resolve()
    scope_key = make_scope_key(owners)
    fixture_data = load_fixture(args.fixture)

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "snapshots").mkdir(parents=True, exist_ok=True)

    latest_path = output_dir / "latest.json"
    existing_latest = json_load(latest_path)
    existing_snapshots = list_scope_snapshots(output_dir, scope_key)
    previous_payload = json_load(existing_snapshots[0]) if existing_snapshots else None
    if previous_payload is None and _same_scope(existing_latest, owners):
        previous_payload = existing_latest

    token = (
        os.environ.get("DASHBOARD_GITHUB_TOKEN")
        or os.environ.get("GITHUB_DASHBOARD_TOKEN")
        or os.environ.get("GITHUB_TOKEN")
    )
    cache_status = "fresh"
    stale_reason = None
    include_snapshot_file = True
    current_snapshot_id = snapshot_id_now()
    history_depth_override: Optional[int] = None

    deterministic_check_mode = bool(args.check and _same_scope(existing_latest, owners))
    generated_at_override: Optional[str] = None
    rate_limit_override: Optional[Dict[str, Any]] = None
    if deterministic_check_mode:
        snapshot_meta = (existing_latest or {}).get("snapshot", {})
        current_snapshot_id = snapshot_meta.get("currentId", current_snapshot_id)
        history_depth_override = int(snapshot_meta.get("historyDepth") or len(existing_snapshots))
        include_snapshot_file = False
        generated_at_override = (existing_latest or {}).get("generatedAt")
        rate_limit_override = (existing_latest or {}).get("rateLimit")
        previous_payload = None

        previous_id = snapshot_meta.get("previousId")
        if previous_id:
            previous_from_id = json_load(snapshot_path(output_dir, scope_key, previous_id))
            if previous_from_id:
                previous_payload = previous_from_id

    try:
        repos, rate_limit, _request_count = fetch_repos(owners=owners, token=token, fixture=fixture_data)
        effective_rate_limit = rate_limit_override if rate_limit_override is not None else rate_limit
        history_depth = history_depth_override if history_depth_override is not None else (len(existing_snapshots) + 1)
        payload = build_payload(
            owners=owners,
            repos=repos,
            cache_status=cache_status,
            rate_limit=effective_rate_limit,
            previous_payload=previous_payload,
            current_snapshot_id=current_snapshot_id,
            history_depth=history_depth,
            generated_at=generated_at_override,
        )
    except Exception as exc:
        if not _same_scope(existing_latest, owners):
            print(f"Dashboard generation failed: {exc}", file=sys.stderr)
            return 1

        cache_status = "stale"
        include_snapshot_file = False
        stale_reason = str(exc)
        payload = dict(existing_latest)
        payload["generatedAt"] = iso_now()
        payload["cacheStatus"] = cache_status
        payload["owners"] = owners
        payload["snapshot"] = dict(payload.get("snapshot", {}))
        payload["snapshot"]["historyDepth"] = len(existing_snapshots)
        payload["snapshot"]["currentId"] = payload["snapshot"].get("currentId", current_snapshot_id)
        payload["snapshot"]["previousId"] = payload["snapshot"].get("previousId")

    if stale_reason:
        payload["staleReason"] = stale_reason

    writes = build_static_outputs(
        payload=payload,
        output_dir=output_dir,
        scope_key=scope_key,
        current_snapshot_id=current_snapshot_id,
        include_snapshot_file=include_snapshot_file,
    )

    snapshot_files_for_prune = list(existing_snapshots)
    if include_snapshot_file:
        snapshot_files_for_prune = [snapshot_path(output_dir, scope_key, current_snapshot_id), *snapshot_files_for_prune]
    deletes = prune_snapshot_paths(snapshot_files_for_prune, args.retention)

    changed = apply_outputs(writes=writes, deletes=deletes, check=args.check)
    if args.check:
        if changed:
            print("Dashboard outputs are out of date. Run the generator without --check.")
            return 1
        print("Dashboard outputs are up to date.")
        return 0

    print(f"Generated dashboard for owners: {', '.join(owners)}")
    print(f"Cache status: {payload['cacheStatus']}")
    print(f"Current snapshot: {payload['snapshot']['currentId']}")
    if deletes:
        print(f"Pruned snapshots: {len(deletes)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
