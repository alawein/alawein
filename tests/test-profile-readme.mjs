import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const profilePath = join(import.meta.dirname, "..", "profile-from-guides.yaml");
const readmePath = join(import.meta.dirname, "..", "README.md");
const README_PIN_HEADER = "Pinned below on GitHub carries the portfolio signal. The current focus set is:";

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

function parseReadmePins(readmeText) {
  const lines = readmeText.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === README_PIN_HEADER);
  assert.notEqual(start, -1, "README.md must contain the profile pin header");

  const pins = [];
  const pinLines = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.trim()) {
      if (pins.length) break;
      continue;
    }
    if (!line.startsWith("- ")) {
      if (pins.length) break;
      continue;
    }
    pinLines.push(line);
    const match = line.match(/^- \[([^\]]+)\]\(([^)]+)\) - (.+)$/);
    assert.ok(match, `README pin line is not parseable: ${line}`);
    pins.push({
      slug: match[1],
      url: match[2],
      description: match[3].trim(),
    });
  }
  return { pins, pinLines };
}

describe("profile README pin block", () => {
  const expectedPins = parseProfilePins(readFileSync(profilePath, "utf8"));
  const { pins } = parseReadmePins(readFileSync(readmePath, "utf8"));

  it("matches profile-from-guides.yaml ordering", () => {
    assert.deepEqual(
      pins.map((pin) => pin.slug),
      expectedPins,
      "README pin ordering must match profile-from-guides.yaml"
    );
  });

  it("renders non-empty descriptions for each pin", () => {
    for (const pin of pins) {
      assert.ok(pin.description.length > 0, `README pin '${pin.slug}' must have a description`);
    }
  });
});
