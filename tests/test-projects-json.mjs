/**
 * Integration tests for projects.json data integrity.
 *
 * Validates the actual projects.json content — checks for
 * referential integrity, URL validity, slug conventions, etc.
 */
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const projectsPath = join(import.meta.dirname, "..", "projects.json");
const data = JSON.parse(readFileSync(projectsPath, "utf8"));

describe("projects.json structure", () => {
  it("has required top-level arrays", () => {
    assert.ok(Array.isArray(data.featured), "featured must be array");
    assert.ok(Array.isArray(data.research), "research must be array");
    assert.ok(Array.isArray(data.packages), "packages must be array");
    assert.ok(Array.isArray(data.infrastructure), "infrastructure must be array");
  });

  it("has non-empty featured array", () => {
    assert.ok(data.featured.length > 0, "featured must have entries");
  });

  it("has lastUpdated field", () => {
    assert.ok(data.lastUpdated, "lastUpdated must exist");
    assert.match(data.lastUpdated, /^\d{4}-\d{2}-\d{2}$/, "lastUpdated must be YYYY-MM-DD");
  });
});

describe("featured projects", () => {
  for (const project of data.featured) {
    describe(project.name, () => {
      it("has required fields", () => {
        assert.ok(project.name, "name required");
        assert.ok(project.slug, "slug required");
        assert.ok(project.repo, "repo required");
        assert.ok(project.description, "description required");
        assert.ok(Array.isArray(project.tags), "tags must be array");
        assert.ok(project.tags.length > 0, "tags must be non-empty");
      });

      it("has valid category", () => {
        const valid = ["active", "maintained", "planned", "archived"];
        assert.ok(valid.includes(project.category), `category '${project.category}' not in ${valid}`);
      });

      it("slug is kebab-case", () => {
        assert.match(project.slug, /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, `slug '${project.slug}' must be kebab-case`);
      });

      it("repo follows owner/name format", () => {
        assert.match(project.repo, /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/, `repo '${project.repo}' must be owner/name`);
      });
    });
  }
});

describe("slug uniqueness", () => {
  it("featured slugs are unique", () => {
    const slugs = data.featured.map((p) => p.slug);
    const unique = new Set(slugs);
    assert.equal(slugs.length, unique.size, `Duplicate slugs found: ${slugs.filter((s, i) => slugs.indexOf(s) !== i)}`);
  });

  it("no overlap between featured and notion_sync slugs", () => {
    const featured = new Set(data.featured.map((p) => p.slug));
    for (const entry of data.notion_sync || []) {
      assert.ok(!featured.has(entry.slug), `notion_sync slug '${entry.slug}' duplicates a featured slug`);
    }
  });
});

describe("research projects", () => {
  for (const project of data.research) {
    it(`${project.name} has required fields`, () => {
      assert.ok(project.name, "name required");
      assert.ok(project.slug, "slug required");
      assert.ok(project.repo, "repo required");
      assert.ok(project.domain, "domain required");
    });
  }
});

describe("infrastructure projects", () => {
  for (const project of data.infrastructure) {
    it(`${project.name} has required fields`, () => {
      assert.ok(project.name, "name required");
      assert.ok(project.slug, "slug required");
      assert.ok(project.repo, "repo required");
      assert.ok(project.purpose, "purpose required");
    });
  }
});

describe("packages", () => {
  for (const pkg of data.packages) {
    it(`${pkg.name} has required fields`, () => {
      assert.ok(pkg.name, "name required");
      assert.ok(pkg.registry, "registry required");
      assert.ok(["npm", "pypi"].includes(pkg.registry), `registry must be npm or pypi`);
      assert.ok(pkg.description, "description required");
    });
  }
});
