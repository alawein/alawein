/**
 * Tests for task-sync.mjs — helper functions and mapping logic.
 *
 * Re-implements pure functions from task-sync.mjs since the script
 * has top-level env checks that call process.exit().
 */
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

// --- Re-implemented from task-sync.mjs ---

function makeExternalId(owner, repo, number) {
  return `${owner}/${repo}#${number}`;
}

function parseExternalId(extId) {
  const m = (extId || "").match(/^([^/]+)\/([^#]+)#(\d+)$/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10) };
}

function richTextPlain(rt) {
  return (rt || []).map((t) => t.plain_text || "").join("").trim();
}

const GITHUB_STATE_TO_NOTION_STATUS = {
  open: "In Progress",
  closed: "Done",
};

const LABEL_TO_PRIORITY = {
  "priority: critical": "Critical",
  "priority: high": "High",
  "priority: medium": "Medium",
  "priority: low": "Low",
  bug: "High",
  enhancement: "Medium",
};

const REPO_TO_DOMAIN = {
  "meshal-web": "Personal",
  morphism: "Work",
  neper: "Scientific Computing",
  qaplibria: "Scientific Computing",
  edfp: "Scientific Computing",
};

// --- Tests ---

describe("makeExternalId", () => {
  it("creates owner/repo#number format", () => {
    assert.equal(makeExternalId("alawein", "neper", 42), "alawein/neper#42");
  });

  it("handles number 0", () => {
    assert.equal(makeExternalId("org", "repo", 0), "org/repo#0");
  });
});

describe("parseExternalId", () => {
  it("parses valid external ID", () => {
    const result = parseExternalId("alawein/neper#42");
    assert.deepEqual(result, { owner: "alawein", repo: "neper", number: 42 });
  });

  it("returns null for invalid format", () => {
    assert.equal(parseExternalId("not-valid"), null);
    assert.equal(parseExternalId(""), null);
    assert.equal(parseExternalId(null), null);
    assert.equal(parseExternalId(undefined), null);
  });

  it("handles repos with hyphens", () => {
    const result = parseExternalId("alawein/meshal-web#7");
    assert.deepEqual(result, { owner: "alawein", repo: "meshal-web", number: 7 });
  });

  it("roundtrips with makeExternalId", () => {
    const id = makeExternalId("alawein", "morphism", 99);
    const parsed = parseExternalId(id);
    assert.equal(parsed.owner, "alawein");
    assert.equal(parsed.repo, "morphism");
    assert.equal(parsed.number, 99);
  });
});

describe("richTextPlain", () => {
  it("extracts plain text from Notion rich_text array", () => {
    const rt = [
      { plain_text: "Hello " },
      { plain_text: "World" },
    ];
    assert.equal(richTextPlain(rt), "Hello World");
  });

  it("returns empty string for null/undefined", () => {
    assert.equal(richTextPlain(null), "");
    assert.equal(richTextPlain(undefined), "");
    assert.equal(richTextPlain([]), "");
  });

  it("trims whitespace", () => {
    const rt = [{ plain_text: "  padded  " }];
    assert.equal(richTextPlain(rt), "padded");
  });

  it("handles missing plain_text property", () => {
    const rt = [{ type: "text" }];
    assert.equal(richTextPlain(rt), "");
  });
});

describe("GITHUB_STATE_TO_NOTION_STATUS", () => {
  it("maps open to In Progress", () => {
    assert.equal(GITHUB_STATE_TO_NOTION_STATUS.open, "In Progress");
  });

  it("maps closed to Done", () => {
    assert.equal(GITHUB_STATE_TO_NOTION_STATUS.closed, "Done");
  });
});

describe("LABEL_TO_PRIORITY", () => {
  it("maps bug label to High", () => {
    assert.equal(LABEL_TO_PRIORITY.bug, "High");
  });

  it("maps enhancement to Medium", () => {
    assert.equal(LABEL_TO_PRIORITY.enhancement, "Medium");
  });

  it("maps all priority labels", () => {
    assert.equal(LABEL_TO_PRIORITY["priority: critical"], "Critical");
    assert.equal(LABEL_TO_PRIORITY["priority: high"], "High");
    assert.equal(LABEL_TO_PRIORITY["priority: medium"], "Medium");
    assert.equal(LABEL_TO_PRIORITY["priority: low"], "Low");
  });
});

describe("REPO_TO_DOMAIN", () => {
  it("maps all target repos", () => {
    assert.equal(REPO_TO_DOMAIN["meshal-web"], "Personal");
    assert.equal(REPO_TO_DOMAIN.morphism, "Work");
    assert.equal(REPO_TO_DOMAIN.neper, "Scientific Computing");
    assert.equal(REPO_TO_DOMAIN.qaplibria, "Scientific Computing");
    assert.equal(REPO_TO_DOMAIN.edfp, "Scientific Computing");
  });

  it("returns undefined for unknown repos", () => {
    assert.equal(REPO_TO_DOMAIN["unknown-repo"], undefined);
  });
});
