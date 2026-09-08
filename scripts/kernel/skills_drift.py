"""Phase 7 step 9: report-only comparison of catalog/skills.yaml +
catalog/agent-integrations.yaml against Grok Bot's own taxonomy
(Desktop/ops-shared-inventory/{agents,workflows,routines}.yaml).

The two taxonomies are not directly comparable by name: catalog/skills.yaml
is domain/role-keyed (repo capability areas like "frontend",
"ml-research"), while the ops-shared-inventory files describe a personal
agent fleet (bot ids, workflow ids, routine ids, skill_ids under each bot).
A shallow name diff between them would misreport near-100% drift on
concepts that were never meant to overlap.

Per the execution plan (Phase 6-8 execution plan, step 9), this module
extracts a flat identifier list from each side -- reviewed once as a fixed
mapping table below, not regenerated per run -- and diffs *those* flattened
lists instead of diffing the raw YAML structures against each other.

Writer boundary: this module only *reads* Desktop/ops-shared-inventory (a
Windows-local SSOT file, not a live Grok Bot profile) and only *writes* to
catalog/generated/skills-drift.json in this repo. It never writes to any
Grok Bot profile path (Name, Label, Description, routines, memory) -- that
boundary is enforced by never importing or invoking anything that could
mutate Grok Bot's live agent state, not just by convention.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from .paths import CATALOG_DIR, GENERATED_DIR

AGENT_INTEGRATIONS_YAML = CATALOG_DIR / "agent-integrations.yaml"
SKILLS_YAML = CATALOG_DIR / "skills.yaml"

# Windows-local SSOT, read-only. Not a Grok Bot live profile path.
OPS_SHARED_INVENTORY = Path(r"C:\Users\mesha\Desktop\ops-shared-inventory")

SKILLS_DRIFT_OUTPUT = GENERATED_DIR / "skills-drift.json"


@dataclass(frozen=True)
class FlatIdentifierSet:
    """One side's flattened, reviewed identifier list, grouped by kind.

    ``kind`` groups exist so the diff report can say *what* is missing
    (e.g. "no agent-fleet identifier maps to this repo-domain identifier")
    rather than just listing bare strings with no context.
    """

    source: str
    by_kind: dict[str, list[str]]

    def all_ids(self) -> set[str]:
        return {i for ids in self.by_kind.values() for i in ids}


def _load_yaml(path: Path) -> dict[str, Any]:
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def extract_alawein_catalog_identifiers(
    skills_path: Path = SKILLS_YAML,
    agent_integrations_path: Path = AGENT_INTEGRATIONS_YAML,
) -> FlatIdentifierSet:
    """Flatten catalog/skills.yaml + catalog/agent-integrations.yaml.

    Reviewed mapping (2026-09-08): the closest analogue to Grok Bot's
    "agent" concept in this catalog is `agent-integrations.yaml`'s
    `agents[].id` (Cursor, Claude, Codex, etc. -- external LLM surfaces
    dispatched from this workspace, not the repo-domain skills). The
    closest analogue to Grok Bot's "routine"/"workflow" concept is
    `agent-integrations.yaml`'s `workflow_bots[].id`. `catalog/skills.yaml`
    domain ids have no Grok Bot analogue at all (they describe *this repo
    fleet's* engineering domains, not agent behavior) and are kept in their
    own kind so the diff does not force a false match.
    """
    skills = _load_yaml(skills_path)
    integrations = _load_yaml(agent_integrations_path)

    domains = [d["id"] for d in skills.get("domains", []) if "id" in d]
    agents = [a["id"] for a in integrations.get("agents", []) if "id" in a]
    workflow_bots = [w["id"] for w in integrations.get("workflow_bots", []) if "id" in w]
    integration_ids = [i["id"] for i in integrations.get("integrations", []) if "id" in i]

    return FlatIdentifierSet(
        source="alawein-catalog",
        by_kind={
            "repo_domain": sorted(domains),
            "agent_surface": sorted(agents),
            "workflow_bot": sorted(workflow_bots),
            "external_integration": sorted(integration_ids),
        },
    )


def extract_grok_bot_taxonomy_identifiers(
    ops_shared_inventory: Path = OPS_SHARED_INVENTORY,
) -> FlatIdentifierSet:
    """Flatten Desktop/ops-shared-inventory/{agents,workflows,routines}.yaml.

    Reviewed mapping (2026-09-08): `agents.yaml`'s `agents[].id` (fleet
    bots: Intake, Policy, Cleanup, plus hidden/deprecated shells) is the
    analogue kind for `agent_surface` above. `workflows.yaml`'s
    `workflows[].id` and `routines.yaml`'s `routines[].id` both map to the
    `workflow_bot` kind (Grok Bot splits "workflow" and "routine" where
    this catalog has one `workflow_bots` list; kept as one kind here since
    the finer split has no counterpart on the catalog side). Each bot's own
    `skill_ids` are flattened into a `bot_skill` kind with no catalog-side
    analogue -- catalog/skills.yaml never enumerates individual skill
    scripts, only domains.
    """
    agents_raw = _load_yaml(ops_shared_inventory / "agents.yaml")
    workflows_raw = _load_yaml(ops_shared_inventory / "workflows.yaml")
    routines_raw = _load_yaml(ops_shared_inventory / "routines.yaml")

    agent_ids = [a["ui_name"] for a in agents_raw.get("agents", []) if "ui_name" in a]
    bot_skills: set[str] = set()
    for a in agents_raw.get("agents", []):
        bot_skills.update(a.get("skills", []) or [])
        bot_skills.update(a.get("skill_ids", []) or [])

    workflow_ids = [w["id"] for w in workflows_raw.get("workflows", []) if "id" in w]
    routine_ids = [r["id"] for r in routines_raw.get("routines", []) if "id" in r]

    return FlatIdentifierSet(
        source="grok-bot-taxonomy",
        by_kind={
            "agent_surface": sorted(agent_ids),
            "workflow_bot": sorted(set(workflow_ids) | set(routine_ids)),
            "bot_skill": sorted(bot_skills),
        },
    )


def diff_flat_identifier_sets(
    alawein: FlatIdentifierSet, grok: FlatIdentifierSet
) -> dict[str, Any]:
    """Diff the two flattened, kind-grouped identifier sets.

    Only kinds present on *both* sides are diffed for overlap/no-overlap;
    kinds present on only one side are reported as "no analogue" rather
    than as drift, since forcing a comparison there would misreport by the
    plan's own definition.
    """
    shared_kinds = sorted(set(alawein.by_kind) & set(grok.by_kind))
    alawein_only_kinds = sorted(set(alawein.by_kind) - set(grok.by_kind))
    grok_only_kinds = sorted(set(grok.by_kind) - set(alawein.by_kind))

    by_kind_diff: dict[str, Any] = {}
    for kind in shared_kinds:
        a_ids = set(alawein.by_kind[kind])
        g_ids = set(grok.by_kind[kind])
        by_kind_diff[kind] = {
            "alawein_only": sorted(a_ids - g_ids),
            "grok_only": sorted(g_ids - a_ids),
            "overlap": sorted(a_ids & g_ids),
        }

    return {
        "shared_kinds": shared_kinds,
        "alawein_only_kinds": alawein_only_kinds,
        "grok_only_kinds": grok_only_kinds,
        "by_kind": by_kind_diff,
    }


def build_report() -> dict[str, Any]:
    alawein = extract_alawein_catalog_identifiers()
    grok = extract_grok_bot_taxonomy_identifiers()
    diff = diff_flat_identifier_sets(alawein, grok)
    return {
        "schema_version": 1,
        "report_only": True,
        "writer_boundary": (
            "Report only. Never writes to any Grok Bot profile path "
            "(Name, Label, Description, routines, memory)."
        ),
        "sources": {
            "alawein_catalog": [str(SKILLS_YAML), str(AGENT_INTEGRATIONS_YAML)],
            "grok_bot_taxonomy": [
                str(OPS_SHARED_INVENTORY / "agents.yaml"),
                str(OPS_SHARED_INVENTORY / "workflows.yaml"),
                str(OPS_SHARED_INVENTORY / "routines.yaml"),
            ],
        },
        "alawein_catalog": alawein.by_kind,
        "grok_bot_taxonomy": grok.by_kind,
        "diff": diff,
    }


def write_report(out_path: Path = SKILLS_DRIFT_OUTPUT) -> dict[str, Any]:
    report = build_report()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n"
    )
    return report


if __name__ == "__main__":
    report = write_report()
    print(f"Wrote {SKILLS_DRIFT_OUTPUT}")
    print(json.dumps(report["diff"], indent=2))
