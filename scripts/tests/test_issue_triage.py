"""Exercise the workflow's actual JavaScript with mock GitHub API methods."""

import json
import subprocess
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = yaml.safe_load((ROOT / ".github/workflows/issue-triage.yml").read_text(encoding="utf-8"))
SCRIPT = WORKFLOW["jobs"]["triage"]["steps"][0]["with"]["script"]
FORM = yaml.safe_load((ROOT / ".github/ISSUE_TEMPLATE/prompt-change.yml").read_text(encoding="utf-8"))
KINDS = next(field for field in FORM["body"] if field.get("id") == "work-kind")["attributes"]["options"]
RUNNER = """
const {script, body, labels} = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const calls = [];
const context = {repo: {owner: 'example', repo: 'demo'}, payload: {issue: {
  number: 1, body, labels: labels.map(name => ({name})),
}}};
const github = {rest: {issues: {
  addLabels: async data => calls.push({method: 'addLabels', ...data}),
  createComment: async data => calls.push({method: 'createComment', ...data}),
}}};
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
new AsyncFunction('context', 'github', script)(context, github)
  .then(() => process.stdout.write(JSON.stringify(calls)))
  .catch(error => { console.error(error); process.exitCode = 1; });
"""


def triage(body, labels=None):
    result = subprocess.run(["node", "-e", RUNNER], input=json.dumps({
        "script": SCRIPT, "body": body,
        "labels": ["prompt-kit", "llmops", "triage"] if labels is None else labels,
    }), text=True, capture_output=True, check=True, encoding="utf-8")
    calls = json.loads(result.stdout)
    assert [call["method"] for call in calls] == ["addLabels", "createComment"]
    return calls[0]["labels"], calls[1]["body"]


@pytest.mark.parametrize("kind", KINDS)
@pytest.mark.parametrize("newline", ["\n", "\r\n"])
def test_form_selection_adds_shared_work_kind(kind, newline):
    labels, comment = triage(newline.join(["### Work kind", "", kind, "", "### Current Behavior", "", "DO_NOT_ECHO_THIS"]))
    assert f"type:{kind}" in labels
    assert "DO_NOT_ECHO_THIS" not in comment
    if kind == "security":
        assert "P1" in labels
        assert "https://github.com/example/demo/security/policy" in comment
        assert "Do not post vulnerability details" in comment


def test_form_options_match_shared_taxonomy():
    vocabulary = json.loads((ROOT / "catalog/taxonomy.json").read_text(encoding="utf-8"))
    assert set(KINDS) == {kind["key"] for kind in vocabulary["workRecords"]["workKinds"]}


@pytest.mark.parametrize("body", [None, "", "### Work kind\n\nunknown",
    "### Work kind\n\nbug\nextra", "### Work kind\n\nbug\n### Work kind\n\ndocs",
    "### Work kind\n\nsecurity; process.exit(1)"])
def test_invalid_form_values_do_not_add_a_work_kind(body):
    labels, _ = triage(body)
    assert not any(label.startswith("type:") for label in labels)


def test_non_prompt_issue_ignores_work_kind_heading():
    labels, _ = triage("### Work kind\n\nsecurity", labels=["bug"])
    assert labels == ["P2"]


@pytest.mark.parametrize("security_label", ["security", "type:security"])
def test_existing_security_labels_keep_private_routing(security_label):
    labels, comment = triage("", labels=[security_label])
    assert labels == ["P1"]
    assert "https://github.com/example/demo/security/policy" in comment


def test_conflicting_form_selection_does_not_add_another_kind():
    labels, comment = triage("### Work kind\n\nsecurity", labels=["prompt-kit", "type:docs"])
    assert labels == ["P1"]
    assert "classification pending" in comment.lower()
    assert "https://github.com/example/demo/security/policy" in comment


@pytest.mark.parametrize("existing,selection", [("security", "docs"), ("docs", "security")])
def test_conflicting_legacy_label_keeps_security_routing(existing, selection):
    labels, comment = triage(f"### Work kind\n\n{selection}", labels=["prompt-kit", existing])
    assert labels == ["P1"]
    assert "classification pending" in comment.lower()
    assert "https://github.com/example/demo/security/policy" in comment


VOCABULARY = json.loads((ROOT / "catalog/taxonomy.json").read_text(encoding="utf-8"))["workRecords"]["workKinds"]


@pytest.mark.parametrize("kind,alias", [(kind["key"], alias) for kind in VOCABULARY for alias in kind["aliases"]])
def test_all_shared_aliases_agree_with_matching_form_and_block_others(kind, alias):
    labels, comment = triage(f"### Work kind\n\n{kind}", labels=["prompt-kit", alias])
    assert f"type:{kind}" in labels
    assert "classification pending" not in comment.lower()
    other_kind = "docs" if kind != "docs" else "bug"
    labels, comment = triage(f"### Work kind\n\n{other_kind}", labels=["prompt-kit", alias])
    assert not any(label.startswith("type:") for label in labels)
    assert "classification pending" in comment.lower()
