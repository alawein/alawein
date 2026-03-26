/**
 * Tests for notion-kb-sync.mjs — frontmatter parsing and file scanning logic.
 *
 * Tests pure functions extracted from the sync script by re-implementing
 * the same logic here (the script uses top-level process.exit so can't import).
 */
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Re-implement parseFrontmatter to test the algorithm
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
      }
      meta[key] = val;
    }
  }
  return { meta, body: match[2].trim() };
}

describe("parseFrontmatter", () => {
  it("parses standard YAML frontmatter", () => {
    const input = `---
name: Test Record
domain: engineering
category: project
---

# Test Record

Some body content here.`;

    const { meta, body } = parseFrontmatter(input);
    assert.equal(meta.name, "Test Record");
    assert.equal(meta.domain, "engineering");
    assert.equal(meta.category, "project");
    assert.match(body, /# Test Record/);
    assert.match(body, /Some body content/);
  });

  it("parses array values in brackets", () => {
    const input = `---
name: Tagged Record
tags: [python, ml, data]
---

Body.`;

    const { meta } = parseFrontmatter(input);
    assert.deepEqual(meta.tags, ["python", "ml", "data"]);
  });

  it("parses quoted array values", () => {
    const input = `---
name: Quoted Tags
tags: ['one', "two", three]
---

Body.`;

    const { meta } = parseFrontmatter(input);
    assert.deepEqual(meta.tags, ["one", "two", "three"]);
  });

  it("returns empty meta for content without frontmatter", () => {
    const input = `# Just a heading

No frontmatter here.`;

    const { meta, body } = parseFrontmatter(input);
    assert.deepEqual(meta, {});
    assert.equal(body, input);
  });

  it("handles empty body after frontmatter", () => {
    const input = `---
name: Empty Body
---
`;

    const { meta, body } = parseFrontmatter(input);
    assert.equal(meta.name, "Empty Body");
    assert.equal(body, "");
  });

  it("handles colons in values", () => {
    const input = `---
source: https://example.com/path
name: Project: The Sequel
---

Body.`;

    const { meta } = parseFrontmatter(input);
    assert.equal(meta.source, "https://example.com/path");
    assert.equal(meta.name, "Project: The Sequel");
  });
});

describe("file scanning", () => {
  let tmpDir;

  it("finds .md files recursively", () => {
    tmpDir = join(tmpdir(), `test-scan-${Date.now()}`);
    mkdirSync(join(tmpDir, "projects"), { recursive: true });
    mkdirSync(join(tmpDir, "tasks"), { recursive: true });

    writeFileSync(
      join(tmpDir, "projects", "morphism.md"),
      `---\nname: Morphism\ndomain: work\n---\n\nBody.`,
    );
    writeFileSync(
      join(tmpDir, "tasks", "task-1.md"),
      `---\nname: Task One\nstatus: active\n---\n\nTask body.`,
    );
    writeFileSync(join(tmpDir, ".sync-state.json"), "{}");
    writeFileSync(join(tmpDir, "README.md"), "# Ignore me");

    // Count .md files (excluding dotfiles)
    const files = [];
    function walk(dir) {
      for (const entry of readdirSync(dir)) {
        if (entry.startsWith(".")) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith(".md")) files.push(full);
      }
    }
    walk(tmpDir);

    assert.equal(files.length, 3); // morphism.md, task-1.md, README.md
    rmSync(tmpDir, { recursive: true, force: true });
  });
});
