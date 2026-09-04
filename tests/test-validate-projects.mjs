import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "..");
const script = join(repoRoot, "scripts", "catalog", "validate-projects-json.py");

describe("validate-projects-json", () => {
  it("passes on the real projects.json", () => {
    const output = execFileSync(process.env.PYTHON || "python", [script], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    assert.match(output, /projects\.json validation passed/);
  });
});
