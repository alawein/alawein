// notion-kb-sync.mjs
// Bidirectional sync between PKOS knowledge base (.md files) and Notion KB database.
// Usage: NOTION_TOKEN=<token> node scripts/notion-kb-sync.mjs [--push|--pull|--diff]
// Default: --diff (report only)

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_KB_DB_ID =
  process.env.NOTION_KB_DB_ID || "3166d8de-2215-810e-89e6-cc9ed7b723d7";
// 2026-04-07: _pkos/ retired -> knowledge-base/ (consolidation 2026-04-03).
// PKOS_DB_DIR env var still supported for override; default updated.
const PKOS_DB_DIR = resolve(
  process.env.PKOS_DB_DIR || join(__dirname, "../../knowledge-base/db"),
);
const SYNC_STATE_FILE = join(PKOS_DB_DIR, ".sync-state.json");

const NOTION_VERSION = "2022-06-28";
const BASE_URL = "https://api.notion.com/v1";

if (!NOTION_TOKEN) {
  console.error("NOTION_TOKEN environment variable is required");
  process.exit(1);
}

const mode = process.argv[2] || "--diff";
if (!["--push", "--pull", "--diff"].includes(mode)) {
  console.error("Usage: node notion-kb-sync.mjs [--push|--pull|--diff]");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

async function notionFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { headers, ...opts });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

// --- Frontmatter parsing ---
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

// --- Scan local PKOS records ---
function scanLocalRecords() {
  const records = [];
  if (!existsSync(PKOS_DB_DIR)) {
    console.error(`PKOS DB directory not found: ${PKOS_DB_DIR}`);
    return records;
  }

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith(".")) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".md")) {
        const content = readFileSync(full, "utf8");
        const { meta, body } = parseFrontmatter(content);
        records.push({
          path: full,
          relativePath: full.slice(PKOS_DB_DIR.length + 1).replace(/\\/g, "/"),
          filename: basename(entry, ".md"),
          meta,
          body,
          mtime: stat.mtimeMs,
        });
      }
    }
  }

  walk(PKOS_DB_DIR);
  return records;
}

// --- Fetch Notion KB pages ---
async function fetchNotionPages() {
  const pages = [];
  let cursor = undefined;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const data = await notionFetch(`/databases/${NOTION_KB_DB_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    for (const page of data.results) {
      const props = page.properties;
      const name =
        props.Name?.title?.[0]?.plain_text ||
        props.Title?.title?.[0]?.plain_text ||
        "";
      const domain = props.Domain?.select?.name || "";
      const category = props.Category?.select?.name || "";
      const tags =
        props.Tags?.multi_select?.map((t) => t.name) || [];
      const source = props.Source?.url || "";

      pages.push({
        id: page.id,
        name,
        domain,
        category,
        tags,
        source,
        lastEdited: page.last_edited_time,
      });
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages;
}

// --- Load/save sync state ---
function loadSyncState() {
  if (existsSync(SYNC_STATE_FILE)) {
    return JSON.parse(readFileSync(SYNC_STATE_FILE, "utf8"));
  }
  return { lastSync: null, mappings: {} };
}

function saveSyncState(state) {
  writeFileSync(SYNC_STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

// --- Create Notion page ---
async function createNotionPage(record) {
  const tags = Array.isArray(record.meta.tags)
    ? record.meta.tags
    : typeof record.meta.tags === "string"
      ? [record.meta.tags]
      : [];

  const properties = {
    Name: { title: [{ text: { content: record.meta.name || record.filename } }] },
  };

  if (record.meta.domain) {
    properties.Domain = { select: { name: record.meta.domain } };
  }
  if (record.meta.category) {
    properties.Category = { select: { name: record.meta.category } };
  }
  if (tags.length > 0) {
    properties.Tags = { multi_select: tags.map((t) => ({ name: t })) };
  }
  if (record.meta.source) {
    properties.Source = { url: record.meta.source };
  }

  const body = {
    parent: { database_id: NOTION_KB_DB_ID },
    properties,
  };

  // Add body content as paragraph blocks (max 2000 chars each)
  if (record.body) {
    const chunks = [];
    for (let i = 0; i < record.body.length; i += 1900) {
      chunks.push(record.body.slice(i, i + 1900));
    }
    body.children = chunks.map((chunk) => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: chunk } }],
      },
    }));
  }

  return notionFetch("/pages", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// --- Main ---
async function main() {
  console.log(`Mode: ${mode}`);
  console.log(`PKOS DB: ${PKOS_DB_DIR}`);
  console.log(`Notion KB DB: ${NOTION_KB_DB_ID}\n`);

  const localRecords = scanLocalRecords();
  console.log(`Local records: ${localRecords.length}`);

  const notionPages = await fetchNotionPages();
  console.log(`Notion pages: ${notionPages.length}\n`);

  // Build lookup maps
  const notionByName = new Map();
  for (const p of notionPages) {
    notionByName.set(p.name.toLowerCase(), p);
  }

  const localOnly = [];
  const notionOnly = [];
  const matched = [];

  for (const rec of localRecords) {
    const name = (rec.meta.name || rec.filename).toLowerCase();
    if (notionByName.has(name)) {
      matched.push({ local: rec, notion: notionByName.get(name) });
      notionByName.delete(name);
    } else {
      localOnly.push(rec);
    }
  }

  for (const [, page] of notionByName) {
    notionOnly.push(page);
  }

  // Report
  console.log("=== Sync Report ===\n");
  console.log(`Matched (in both): ${matched.length}`);
  console.log(`Local only (not in Notion): ${localOnly.length}`);
  console.log(`Notion only (not local): ${notionOnly.length}\n`);

  if (localOnly.length > 0) {
    console.log("--- Local only ---");
    for (const r of localOnly) {
      console.log(
        `  ${r.meta.name || r.filename} (${r.relativePath})`,
      );
    }
    console.log();
  }

  if (notionOnly.length > 0) {
    console.log("--- Notion only ---");
    for (const p of notionOnly) {
      console.log(`  ${p.name} (${p.id})`);
    }
    console.log();
  }

  if (mode === "--diff") {
    console.log("Run with --push to create missing Notion pages.");
    console.log("Run with --pull to create missing local files.");
    return;
  }

  const syncState = loadSyncState();

  if (mode === "--push") {
    console.log(`Pushing ${localOnly.length} records to Notion...\n`);
    for (const rec of localOnly) {
      const name = rec.meta.name || rec.filename;
      try {
        const page = await createNotionPage(rec);
        console.log(`  Created: ${name} -> ${page.id}`);
        syncState.mappings[rec.relativePath] = {
          notionId: page.id,
          pushedAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error(`  Failed: ${name} — ${e.message}`);
      }
    }
    syncState.lastSync = new Date().toISOString();
    saveSyncState(syncState);
    console.log(`\nSync state saved to ${SYNC_STATE_FILE}`);
  }

  if (mode === "--pull") {
    console.log(`Pulling ${notionOnly.length} records from Notion...\n`);
    for (const page of notionOnly) {
      const slug = page.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const filename = `${slug}.md`;
      const filepath = join(PKOS_DB_DIR, "from-notion", filename);

      const tags = page.tags.length > 0 ? `[${page.tags.join(", ")}]` : "[]";
      const content = [
        "---",
        `name: ${page.name}`,
        `domain: ${page.domain}`,
        `category: ${page.category}`,
        `tags: ${tags}`,
        `source: ${page.source}`,
        `notion_id: ${page.id}`,
        `pulled_at: ${new Date().toISOString()}`,
        "---",
        "",
        `# ${page.name}`,
        "",
        "(Content pulled from Notion — body not available via database query.)",
        "",
      ].join("\n");

      try {
        const dir = dirname(filepath);
        if (!existsSync(dir)) {
          const { mkdirSync } = await import("node:fs");
          mkdirSync(dir, { recursive: true });
        }
        writeFileSync(filepath, content);
        console.log(`  Pulled: ${page.name} -> ${filename}`);
        syncState.mappings[`from-notion/${filename}`] = {
          notionId: page.id,
          pulledAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error(`  Failed: ${page.name} — ${e.message}`);
      }
    }
    syncState.lastSync = new Date().toISOString();
    saveSyncState(syncState);
    console.log(`\nSync state saved to ${SYNC_STATE_FILE}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
