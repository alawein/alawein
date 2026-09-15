"""Path and content contract for Grok-thin freeze + model routing."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

REQUIRED_AFTER_MERGE = (
    ROOT / "docs/internal/maios/USAGE-FREEZE-TEST-MATRIX-2026-09-14.md",
    ROOT / "docs/internal/maios/scripts/smoke-offload-classifier.md",
    ROOT / "scripts/smoke-openrouter-one.sh",
)

REQUIRED_ENFORCE = (
    ROOT / "docs/internal/maios/GROK-USAGE-FREEZE.md",
    ROOT / "docs/internal/maios/GROK-THIN-OFFLOAD.md",
    ROOT / "docs/internal/maios/GROK-SPEND-INVESTIGATION-2026-09-14.md",
    ROOT / "docs/internal/maios/MODEL-ROUTING-BY-PURPOSE.md",
)

FLASH_ID = "google/gemini-3.8-flash"
VERIFIED_OPENROUTER_IDS = (
    "openai/gpt-6-astra-pro",
    "anthropic/claude-opus-5",
    "qwen/qwen3.8-max-0902",
    "z-ai/glm-5.3",
    "deepseek/deepseek-v4-pro-0813",
    "moonshotai/kimi-k3",
    "google/gemini-3.8-flash",
)


def classify_offload_target(task_kind: str) -> str:
    mapping = {
        "orient": "InlineGrok",
        "continue": "InlineGrok",
        "approve": "InlineGrok",
        "nudge": "InlineGrok",
        "code": "CursorCloud",
        "repo": "CursorCloud",
        "pr": "CursorCloud",
        "docs-git": "CursorCloud",
        "grill": "OpenRouterPanel",
        "panel": "OpenRouterPanel",
        "architecture": "OpenRouterPanel",
    }
    return mapping.get(task_kind, "InlineGrok")


def grok_usage_freeze(weekly_pct: float, ondemand_pct: float) -> str:
    if weekly_pct >= 80.0 or ondemand_pct >= 70.0:
        return "FREEZE"
    return "OPEN"


def _bash() -> str:
    if sys.platform.startswith("win"):
        for candidate in (
            r"C:\Program Files\Git\bin\bash.exe",
            r"C:\Program Files\Git\usr\bin\bash.exe",
        ):
            if os.path.exists(candidate):
                return candidate
    return shutil.which("bash") or "bash"


def test_classify_orient_is_inline_grok() -> None:
    assert classify_offload_target("orient") == "InlineGrok"
    assert classify_offload_target("continue") == "InlineGrok"
    assert classify_offload_target("approve") == "InlineGrok"
    assert classify_offload_target("nudge") == "InlineGrok"


def test_classify_code_is_cursor_cloud() -> None:
    assert classify_offload_target("code") == "CursorCloud"
    assert classify_offload_target("pr") == "CursorCloud"
    assert classify_offload_target("docs-git") == "CursorCloud"


def test_classify_grill_is_openrouter_panel() -> None:
    assert classify_offload_target("grill") == "OpenRouterPanel"
    assert classify_offload_target("architecture") == "OpenRouterPanel"


def test_freeze_thresholds() -> None:
    assert grok_usage_freeze(80.0, 0.0) == "FREEZE"
    assert grok_usage_freeze(100.0, 10.0) == "FREEZE"
    assert grok_usage_freeze(10.0, 70.0) == "FREEZE"
    assert grok_usage_freeze(79.9, 69.9) == "OPEN"


def test_merged_smoke_paths_exist() -> None:
    missing = [str(p) for p in REQUIRED_AFTER_MERGE if not p.is_file()]
    assert missing == [], missing


def test_enforce_docs_exist() -> None:
    missing = [str(p) for p in REQUIRED_ENFORCE if not p.is_file()]
    assert missing == [], missing


def test_freeze_doc_has_rule_and_verbs() -> None:
    text = (ROOT / "docs/internal/maios/GROK-USAGE-FREEZE.md").read_text(
        encoding="utf-8"
    )
    assert "80" in text
    assert "70" in text
    assert "FREEZE" in text
    assert "Force Grok:" in text
    assert "Offload:" in text
    assert "Cursor:" in text
    assert "Panel:" in text
    assert "Panel fleet:" in text
    assert "poll-as-daemon" in text or "poll as daemon" in text
    assert "MAIOS_PANEL_KILL=1" in text
    assert "fifth keeper" in text.lower() or "BLOCK fifth keeper" in text


def test_offload_doc_has_matrix_targets() -> None:
    text = (ROOT / "docs/internal/maios/GROK-THIN-OFFLOAD.md").read_text(
        encoding="utf-8"
    )
    assert "InlineGrok" in text
    assert "CursorCloud" in text
    assert "OpenRouterPanel" in text
    assert "Offload:" in text
    assert "Force Grok:" in text


def test_spend_investigation_separates_meters() -> None:
    text = (
        ROOT / "docs/internal/maios/GROK-SPEND-INVESTIGATION-2026-09-14.md"
    ).read_text(encoding="utf-8")
    assert "Grok Bot weekly" in text
    assert "Cursor Cloud" in text
    assert "OpenRouter" in text
    assert "Orchestration tax" in text
    assert "Cursor-first" in text


def test_model_routing_lists_verified_ids() -> None:
    text = (ROOT / "docs/internal/maios/MODEL-ROUTING-BY-PURPOSE.md").read_text(
        encoding="utf-8"
    )
    for model_id in VERIFIED_OPENROUTER_IDS:
        assert model_id in text, model_id
    assert "cannot change Grok" in text.lower() or "cannot change Grok" in text
    assert FLASH_ID in text
    assert "max_tokens" in text
    assert "24000" in text


def test_smoke_script_flash_id_and_no_key_echo() -> None:
    script = ROOT / "scripts/smoke-openrouter-one.sh"
    text = script.read_text(encoding="utf-8")
    assert FLASH_ID in text
    assert "echo \"$OPENROUTER_API_KEY\"" not in text
    assert "echo $OPENROUTER_API_KEY" not in text
    assert "print(os.environ[\"OPENROUTER_API_KEY\"])" not in text
    result = subprocess.run(
        [_bash(), "-n", str(script)],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    assert result.returncode == 0, result.stderr
