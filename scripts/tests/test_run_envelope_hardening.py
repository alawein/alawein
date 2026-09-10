"""Offline regression tests. No repository writes or native-service calls."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "catalog"))
import validate_run_envelope as checker  # noqa: E402


def _isolated_env():
    """Minimal child environment; Windows still needs SYSTEMROOT to start Python."""
    env = {"PATH": os.defpath, "PYTHONDONTWRITEBYTECODE": "1", "PYTHONUTF8": "1"}
    if os.name == "nt" and "SYSTEMROOT" in os.environ:
        env["SYSTEMROOT"] = os.environ["SYSTEMROOT"]
    return env


def base():
    return checker.load_envelope(checker.EXAMPLE_PATH)


def authorized():
    payload = base()
    payload.update(phase="authorized", control_level="managed", write_set="synthetic-target")
    payload.pop("receipt", None)
    return payload


def accepted():
    payload = base()
    payload["phase"] = "accepted"
    payload["acceptance"] = {
        "status": "accepted", "by": "contact@meshal.ai",
        "at": "2026-09-10T10:06:00Z", "revision": "synthetic-revision-not-an-approval",
    }
    return payload


class HardeningTests(unittest.TestCase):
    def errors(self, payload):
        return [issue for issue in checker.validate_envelope(payload) if issue.level == "error"]

    def assertRejected(self, payload):
        self.assertTrue(self.errors(payload))

    def test_example_still_valid(self):
        self.assertEqual(checker.validate_envelope(base()), [])

    def test_authorized_malformed_expiry_rejected(self):
        payload = authorized()
        payload["authorization"]["expires_at"] = "not-a-timestamp"
        self.assertRejected(payload)

    def test_explicit_timezone_required(self):
        for value in ("2026-09-10", "2026-09-10T23:59:59", "2026-09-10 23:59:59+00:00"):
            with self.subTest(value=value):
                payload = authorized()
                payload["authorization"]["expires_at"] = value
                self.assertRejected(payload)

    def test_offset_comparison_uses_actual_instant(self):
        payload = base()
        payload["authorization"]["expires_at"] = "2026-09-10T03:05:00-07:00"
        self.assertEqual(self.errors(payload), [])
        payload["authorization"]["expires_at"] = "2026-09-10T03:04:59-07:00"
        self.assertRejected(payload)

    def test_missing_execution_time_rejected(self):
        payload = base()
        del payload["receipt"]["executed_at"]
        self.assertRejected(payload)

    def test_list_write_set_returns_diagnostics(self):
        payload = base()
        payload["write_set"] = ["synthetic-target"]
        self.assertRejected(payload)

    def test_list_authorization_returns_diagnostics(self):
        payload = base()
        payload["authorization"] = ["synthetic-value"]
        self.assertRejected(payload)

    def test_malformed_root_returns_diagnostics(self):
        for value in (None, [], "synthetic", 123, True):
            with self.subTest(value=value):
                self.assertRejected(value)
                self.assertTrue(checker.validate_semantics(value))

    def test_direct_semantics_wrong_types_return_diagnostics(self):
        bad_fields = {
            "phase": [], "control_level": [], "write_set": [],
            "authorization": ["x"], "receipt": ["x"], "executor": ["x"],
            "native_gate": ["x"], "acceptance": ["x"], "model_identity": ["x"],
            "policy_refs": 42, "prompt_refs": [42], "inputs": "x", "outputs": "x",
        }
        for name, value in bad_fields.items():
            with self.subTest(name=name):
                payload = base()
                payload[name] = value
                self.assertTrue(checker.validate_semantics(payload))

    def test_missing_completed_evidence_rejected(self):
        for name in ("policy_refs", "prompt_refs", "model_identity", "inputs", "outputs"):
            with self.subTest(name=name):
                payload = base()
                del payload[name]
                self.assertRejected(payload)

    def test_empty_completed_evidence_rejected(self):
        for name in ("policy_refs", "prompt_refs", "inputs", "outputs"):
            with self.subTest(name=name):
                payload = base()
                payload[name] = []
                self.assertRejected(payload)

    def test_missing_or_blank_loaded_revision_rejected(self):
        for name in ("policy_refs", "prompt_refs"):
            for value in (None, "", "  "):
                with self.subTest(name=name, value=value):
                    payload = base()
                    if value is None:
                        del payload[name][0]["loaded_revision"]
                    else:
                        payload[name][0]["loaded_revision"] = value
                    self.assertRejected(payload)

    def test_missing_recovery_status_rejected(self):
        payload = base()
        del payload["receipt"]["recovery_status"]
        self.assertRejected(payload)

    def test_failed_readback_rejected(self):
        payload = base()
        for row in payload["receipt"]["readback"]:
            row["result"] = "failed"
        self.assertRejected(payload)

    def test_mixed_success_and_failure_readback_rejected(self):
        payload = base()
        payload["receipt"]["readback"][0]["result"] = "failed"
        self.assertRejected(payload)

    def test_unknown_readback_not_promoted_to_verified(self):
        for result in ("pending", "not_failed", "unknown", "unverified", "apparently fine"):
            with self.subTest(result=result):
                payload = base()
                payload["receipt"]["readback"][0]["result"] = result
                self.assertRejected(payload)

    def test_blank_native_readback_id_rejected(self):
        payload = base()
        payload["receipt"]["readback"][0]["native_id"] = "   "
        self.assertRejected(payload)

    def test_independent_credentials_rejected_even_with_gate(self):
        payload = base()
        payload["control_level"] = "enforced"
        payload["native_gate"] = {"kind": "synthetic", "id": "synthetic", "agent_can_bypass": False}
        self.assertRejected(payload)
        self.assertTrue(checker.validate_semantics(payload))

    def test_unknown_credential_independence_rejected(self):
        payload = base()
        payload["control_level"] = "enforced"
        payload["native_gate"] = {"kind": "synthetic", "id": "synthetic", "agent_can_bypass": False}
        del payload["executor"]["independently_credentialed"]
        self.assertRejected(payload)

    def test_restricted_executor_and_gate_declarations_parse(self):
        payload = base()
        payload["control_level"] = "enforced"
        payload["executor"]["independently_credentialed"] = False
        payload["native_gate"] = {"kind": "synthetic", "id": "synthetic", "agent_can_bypass": False}
        self.assertEqual(self.errors(payload), [])

    def test_unknown_bypassability_rejected(self):
        payload = base()
        payload["control_level"] = "enforced"
        payload["executor"]["independently_credentialed"] = False
        payload["native_gate"] = {"kind": "synthetic", "id": "synthetic"}
        self.assertRejected(payload)

    def test_bool_is_not_execution_count(self):
        payload = base()
        payload["receipt"]["execute_count"] = True
        self.assertRejected(payload)
        self.assertTrue(checker.validate_semantics(payload))

    def test_missing_acceptance_evidence_rejected(self):
        for name in ("by", "at", "revision"):
            with self.subTest(name=name):
                payload = accepted()
                del payload["acceptance"][name]
                self.assertRejected(payload)

    def test_acceptance_cannot_precede_execution(self):
        payload = accepted()
        payload["acceptance"]["at"] = "2026-09-10T10:04:59Z"
        self.assertRejected(payload)

    def test_malformed_acceptance_time_rejected_in_any_phase(self):
        for value in ("yesterday", "2026-09-10T10:06:00", ""):
            with self.subTest(value=value):
                payload = base()
                payload["acceptance"] = {"status": "pending", "at": value}
                self.assertTrue(checker.validate_semantics(payload))
                self.assertRejected(payload)

    def test_complete_acceptance_declaration_is_not_authentication(self):
        self.assertEqual(self.errors(accepted()), [])

    def test_valid_historical_receipt_does_not_expire_retroactively(self):
        payload = base()
        payload["authorization"]["expires_at"] = "2000-01-01T01:00:00Z"
        payload["receipt"]["executed_at"] = "2000-01-01T00:00:00Z"
        self.assertEqual(self.errors(payload), [])

    def test_unexecuted_history_is_not_a_current_admission_decision(self):
        payload = authorized()
        payload["authorization"]["expires_at"] = "2000-01-01T00:00:00Z"
        self.assertEqual(self.errors(payload), [])

    def test_repeat_validation_does_not_claim_replay_enforcement(self):
        self.assertEqual(self.errors(base()), [])
        self.assertEqual(self.errors(base()), [])

    def test_missing_schema_is_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            with mock.patch.object(checker, "SCHEMA_PATH", Path(directory)/"missing.json"):
                self.assertRejected(base())

    def test_missing_schema_dependency_is_failure(self):
        payload = base()
        with mock.patch.dict(sys.modules, {"jsonschema": None}):
            self.assertRejected(payload)

    def test_broken_schema_returns_diagnostics(self):
        for text in (
            "not json",
            '{"type": "not-a-schema-type"}',
            '{"$schema": "https://json-schema.org/draft/2020-12/schema", "properties": {"phase": {"$ref": "#/$defs/missing"}}}',
        ):
            with self.subTest(text=text), tempfile.TemporaryDirectory() as directory:
                path = Path(directory)/"schema.json"
                path.write_text(text, encoding="utf-8")
                payload = base()
                with mock.patch.object(checker, "SCHEMA_PATH", path):
                    self.assertRejected(payload)

    def test_schema_errors_do_not_reach_semantics(self):
        payload = base()
        payload["authorization"] = ["synthetic"]
        with mock.patch.object(checker, "validate_semantics", side_effect=AssertionError("must not be called")):
            self.assertRejected(payload)

    def test_invalid_yaml_cli_emits_json_not_traceback(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)/"invalid.yaml"
            path.write_text("authorization: [broken", encoding="utf-8")
            process = subprocess.run(
                [sys.executable, str(ROOT/"scripts/catalog/validate_run_envelope.py"), str(path), "--json"],
                capture_output=True, text=True, timeout=20,
                env=_isolated_env(),
            )
            self.assertEqual(process.returncode, 1)
            self.assertIn("invalid YAML", json.loads(process.stdout)["errors"][0])
            self.assertNotIn("Traceback", process.stderr)

    def test_shape_mutations_fail_without_exceptions(self):
        mutations = {
            "authorization": [False, 1, "text", [], None],
            "receipt": [False, 1, "text", [], None],
            "executor": [False, 1, "text", [], None],
            "write_set": [False, 1, {}, [], None],
            "phase": [False, 1, {}, [], None],
            "policy_refs": [False, 1, "text", {}, None],
        }
        for field, values in mutations.items():
            for value in values:
                with self.subTest(field=field, value=value):
                    payload = base()
                    payload[field] = value
                    self.assertRejected(payload)


if __name__ == "__main__":
    unittest.main(verbosity=2)
