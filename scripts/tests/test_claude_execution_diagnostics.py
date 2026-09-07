"""Claude CI errors must be actionable without exposing execution content."""
import json
from pathlib import Path
import subprocess
import sys

import pytest

SCRIPT = Path(__file__).resolve().parents[1] / "github/claude-execution-diagnostics.py"
SECRET = "sentinel-private-content::error::forged"


def records(code=None, status=None):
    return [
        {"type": "assistant", "session_id": "review", "parent_tool_use_id": None,
         "error": code, "message": SECRET},
        {"type": "result", "session_id": "review", "subtype": "success",
         "is_error": True, "api_error_status": status, "result": SECRET},
    ]


def probe(tmp_path, data, *flags):
    path = tmp_path / "execution.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), str(path), *flags],
                          capture_output=True, text=True, check=False)


def assert_failure(result, category="unknown", status="none"):
    assert result.returncode == 1
    assert result.stdout == f"::error::Claude execution failed; category={category}; http_status={status}\n"
    assert result.stderr == ""
    assert SECRET not in result.stdout


@pytest.mark.parametrize("code,category", [
    ("authentication_failed", "auth"), ("oauth_org_not_allowed", "auth"),
    ("billing_error", "billing"), ("rate_limit", "rate_limit"),
    ("overloaded", "provider"), ("server_error", "provider"),
    ("unknown", "unknown"), (SECRET, "unknown"), ({"error": SECRET}, "unknown"),
])
def test_only_known_assistant_error_codes_are_reported(tmp_path, code, category):
    assert_failure(probe(tmp_path, records(code)), category)


@pytest.mark.parametrize("status,category", [
    (400, "unknown"), (401, "auth"), (402, "billing"), (403, "auth"),
    (429, "rate_limit"), (500, "provider"), (529, "provider"), (599, "provider"),
])
def test_structured_http_status_is_reported(tmp_path, status, category):
    assert_failure(probe(tmp_path, records(status=status)), category, status)


@pytest.mark.parametrize("status", ["401", True, 401.5, 399, 600, SECRET])
def test_invalid_status_is_not_printed_or_interpreted(tmp_path, status):
    assert_failure(probe(tmp_path, records(status=status)))


def test_conflicting_evidence_is_unknown(tmp_path):
    assert_failure(probe(tmp_path, records("authentication_failed", 429)), "unknown", 429)


def test_billing_code_can_explain_http_400(tmp_path):
    assert_failure(probe(tmp_path, records("billing_error", 400)), "billing", 400)


@pytest.mark.parametrize("context", ["earlier", "subagent", "other_session", "local_failure"])
def test_unrelated_or_stale_errors_do_not_classify_failure(tmp_path, context):
    data = records("authentication_failed")
    if context == "earlier":
        data.insert(1, {"type": "assistant", "session_id": "review", "parent_tool_use_id": None})
    elif context == "subagent":
        data[0]["parent_tool_use_id"] = "tool"
    elif context == "other_session":
        data[0]["session_id"] = "other"
    else:
        data[-1]["subtype"] = "error_max_turns"
    assert_failure(probe(tmp_path, data))


def test_successful_result_is_not_classified_as_an_api_error(tmp_path):
    data = records("authentication_failed", 401)
    data[-1]["is_error"] = False
    result = probe(tmp_path, data)
    assert result.returncode == 0
    assert SECRET not in result.stdout + result.stderr


@pytest.mark.parametrize("data", [None, {}, [], [SECRET], [{"type": "result"}],
                                   [{"is_error": True}], records(SECRET) + [None]])
def test_incomplete_or_malformed_output_fails_without_content(tmp_path, data):
    assert_failure(probe(tmp_path, data))


def test_previous_execution_error_is_not_hidden_by_success(tmp_path):
    data = records()
    data.append({"type": "result", "subtype": "success", "is_error": False})
    assert_failure(probe(tmp_path, data))


def test_invalid_json_does_not_expose_parser_details(tmp_path):
    path = tmp_path / "execution.json"
    path.write_text("{" + SECRET, encoding="utf-8")
    result = subprocess.run([sys.executable, str(SCRIPT), str(path)],
                            capture_output=True, text=True, check=False)
    assert_failure(result)


def test_missing_output_is_allowed_only_for_skipped_review(tmp_path):
    path = tmp_path / "missing.json"
    command = [sys.executable, str(SCRIPT), str(path)]
    assert_failure(subprocess.run(command, capture_output=True, text=True, check=False))
    skipped = subprocess.run(command + ["--allow-missing"], capture_output=True, text=True, check=False)
    assert skipped.returncode == 0
