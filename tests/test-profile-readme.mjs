import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const profilePath = join(import.meta.dirname, "..", "profile-from-guides.yaml");
const readmePath = join(import.meta.dirname, "..", "README.md");
const RESEARCH_HEADER = "## Research & Scientific Computing";

function parseProfilePins(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "profile_pins:");
  assert.notEqual(start, -1, "profile-from-guides.yaml must contain profile_pins");

  const pins = [];
  for (const line of lines.slice(start + 1)) {
    const match = line.match(/^\s*-\s+([a-z0-9-]+)\s*$/);
    if (!match) {
      if (pins.length) break;
      continue;
    }
    pins.push(match[1]);
  }
  return pins;
}

function parseResearchRows(readmeText) {
  const lines = readmeText.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === RESEARCH_HEADER);
  assert.notEqual(start, -1, "README.md must contain the research section");

  const rows = [];
  for (const line of lines.slice(start + 4)) {
    if (!line.startsWith("|")) break;
    const match = line.match(/^\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+)\|\s*(.*?)\s*\|$/);
    assert.ok(match, `README research row is not parseable: ${line}`);
    rows.push({ slug: match[1], url: match[2], lifecycle: match[3].trim(), description: match[4] });
  }
  return rows;
}

describe("profile README research rows", () => {
  const profilePins = parseProfilePins(readFileSync(profilePath, "utf8"));
  const researchRows = parseResearchRows(readFileSync(readmePath, "utf8"));
  const pinnedRows = researchRows.slice(0, profilePins.length);

  it("starts with profile-from-guides.yaml pin ordering", () => {
    assert.deepEqual(
      pinnedRows.map((row) => row.slug),
      profilePins,
      "first README research rows must match profile-from-guides.yaml pins"
    );
  });

  it("renders non-empty descriptions for pinned research rows", () => {
    for (const row of pinnedRows) {
      assert.ok(row.description.length > 0, `README research row '${row.slug}' must have a description`);
    }
  });

  it("labels active and maintenance work honestly", () => {
    const lifecycle = Object.fromEntries(researchRows.map((row) => [row.slug, row.lifecycle]));
    assert.equal(lifecycle.fallax, "Active");
    assert.equal(lifecycle.chshlab, "Active");
    assert.equal(lifecycle.qmatsim, "Maintenance");
  });
});
