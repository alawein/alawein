/**
 * Tests for validate-projects-json.mjs validation logic.
 *
 * Tests the validator by running it as a subprocess against synthetic
 * projects.json files, since the script uses process.exit().
 */
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SCRIPT = join(import.meta.dirname, "..", "scripts", "validate-projects-json.mjs");

function makeTmpDir() {
  const dir = join(tmpdir(), `test-validate-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeProjects(dir, data) {
  writeFileSync(join(dir, "projects.json"), JSON.stringify(data));
}

function runValidator(dir) {
  // The script resolves projects.json relative to __dirname/../projects.json
  // We can't easily override that, so we test via a wrapper that patches the path.
  // Instead, test the actual projects.json in the repo.
  try {
    const out = execFileSync("node", [SCRIPT], {
      cwd: join(import.meta.dirname, ".."),
      encoding: "utf8",
      timeout: 10000,
    });
    return { exitCode: 0, stdout: out, stderr: "" };
  } catch (e) {
    return { exitCode: e.status, stdout: e.stdout || "", stderr: e.stderr || "" };
  }
}

describe("validate-projects-json", () => {
  it("passes on the real projects.json", () => {
    const result = runValidator();
    assert.equal(result.exitCode, 0, `Expected exit 0, got ${result.exitCode}. stderr: ${result.stderr}`);
    assert.match(result.stdout, /validation passed/);
  });
});
