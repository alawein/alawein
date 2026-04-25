#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BASELINE="$SCRIPT_DIR/governance-checksums.json"

if [ ! -f "$BASELINE" ]; then
  echo "ERROR: governance-checksums.json not found at $BASELINE" >&2
  echo "Run: bash .claude/hooks/update-checksums.sh" >&2
  exit 1
fi

python - "$BASELINE" "$REPO_ROOT" <<'PY'
import json
import hashlib
import sys
from pathlib import Path

baseline_path = Path(sys.argv[1])
repo_root = Path(sys.argv[2])

baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
files = baseline.get("files", {})

drift_found = False

for rel_path, expected_sha in files.items():
    target = repo_root / rel_path
    if not target.exists():
        print(f"MISSING: {rel_path} (expected in governance-checksums.json)")
        drift_found = True
        continue

    actual_sha = hashlib.sha256(target.read_bytes()).hexdigest()
    if actual_sha != expected_sha:
        print(f"DRIFT: {rel_path}")
        print(f"  expected: {expected_sha}")
        print(f"  actual:   {actual_sha}")
        print(f"  If this change is intentional, run: bash .claude/hooks/update-checksums.sh")
        drift_found = True

if drift_found:
    sys.exit(1)
else:
    print("Governance files unchanged.")
PY
