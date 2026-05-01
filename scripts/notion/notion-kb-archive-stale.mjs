/**
 * notion-kb-archive-stale.mjs
 *
 * Archives stale pages in a Notion KB database whose corresponding local
 * markdown file no longer exists.
 *
 * Supports two schema strategies, auto-detected from the DB properties:
 *
 *   (A) LocalFile strategy — DB has a `LocalFile` rich_text/url property.
 *       A page is stale iff its LocalFile value points to a missing file
 *       under db/projects/. Used by the legacy "KB Projects" DB layout.
 *
 *   (B) Name strategy — DB does NOT have a LocalFile property. A page is
 *       stale iff its Name title doesn't match any local record's name
 *       (frontmatter `name:` field) or filename (without .md). Walks the
 *       entire db/ tree, not just db/projects/. Used by the current
 *       "Knowledge Base" DB layout.
 *
 * Usage:
 *   NOTION_TOKEN=<token> node scripts/notion-kb-archive-stale.mjs            # diff (default)
 *   NOTION_TOKEN=<token> node scripts/notion-kb-archive-stale.mjs --apply    # actually archive
 *
 * Environment:
 *   NOTION_TOKEN              required
 *   NOTION_KB_DB_ID           default: 3166d8de-2215-810e-89e6-cc9ed7b723d7
 *   KNOWLEDGE_BASE_DB_DIR     default: ../../knowledge-base/db
 *
 * Safety:
 *   - Default mode is `--diff`: prints which pages WOULD be archived. No writes.
 *   - `--apply` mode sets `archived: true` on matching pages (Notion soft-delete).
 *   - Archived pages can be restored manually via Notion UI.
 *   - The script never deletes pages; archive is reversible.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_KB_DB_ID =
  process.env.NOTION_KB_DB_ID || "3166d8de-2215-810e-89e6-cc9ed7b723d7";
const KB_DB_DIR = resolve(
  process.env.KNOWLEDGE_BASE_DB_DIR || join(__dirname, "../../knowledge-base/db"),
);

if (!NOTION_TOKEN) {
  console.error("NOTION_TOKEN environment variable is required");
  process.exit(1);
}

const mode = process.argv[2] || "--diff";
if (!["--diff", "--apply"].includes(mode)) {
  console.error("Usage: node notion-kb-archive-stale.mjs [--diff|--apply]");
  process.exit(1);
}

const NOTION_VERSION = "2022-06-28";
const BASE_URL = "https://api.notion.com/v1";

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

// --- Local file walking ---

function parseFrontmatter(content) {
  // Supports both `---` and `---type: canonical` openers.
  const match = content.match(/^---(?:type:\s*\S+)?\n?([\s\S]*?)\n---\n?/);
  if (!match) return {};
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line
        .slice(idx + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      meta[key] = val;
    }
  }
  return meta;
}

function listLocalProjectFiles() {
  const projectsDir = join(KB_DB_DIR, "projects");
  if (!existsSync(projectsDir)) return new Set();
  const files = new Set();
  for (const entry of readdirSync(projectsDir)) {
    if (entry.endsWith(".md")) files.add(`projects/${entry}`);
  }
  return files;
}

function buildLocalNameSet() {
  // Walk entire db/ tree, extract frontmatter name + filename for each .md.
  const names = new Set();
  if (!existsSync(KB_DB_DIR)) {
    console.error(`KB DB directory not found: ${KB_DB_DIR}`);
    process.exit(1);
  }

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith(".")) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".md")) {
        const filename = basename(entry, ".md").toLowerCase();
        names.add(filename);
        try {
          const content = readFileSync(full, "utf8");
          const meta = parseFrontmatter(content);
          if (meta.name) {
            names.add(meta.name.toLowerCase());
          }
        } catch {
          // ignore read errors
        }
      }
    }
  }

  walk(KB_DB_DIR);
  return names;
}

// --- Notion DB ---

async function fetchDbSchema() {
  return notionFetch(`/databases/${NOTION_KB_DB_ID}`, { method: "GET" });
}

async function fetchAllPages() {
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
      const localFile =
        props.LocalFile?.rich_text?.[0]?.plain_text ||
        props.LocalFile?.url ||
        "";
      pages.push({ id: page.id, name, localFile, archived: page.archived === true });
    }
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function archivePage(pageId) {
  return notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ archived: true }),
  });
}

// --- Main ---

async function main() {
  console.log(`Mode: ${mode}`);
  console.log(`KB DB dir: ${KB_DB_DIR}`);
  console.log(`Notion DB: ${NOTION_KB_DB_ID}\n`);

  const schema = await fetchDbSchema();
  const hasLocalFile = Boolean(schema.properties?.LocalFile);
  const strategy = hasLocalFile ? "LocalFile" : "Name";
  console.log(`Strategy: ${strategy} (auto-detected from DB schema)\n`);

  const notionPages = await fetchAllPages();
  console.log(`Notion pages: ${notionPages.length}`);

  const stale = [];
  const matched = [];
  const alreadyArchived = [];

  if (strategy === "LocalFile") {
    const localFiles = listLocalProjectFiles();
    console.log(`Local project files: ${localFiles.size}\n`);

    for (const page of notionPages) {
      if (page.archived) {
        alreadyArchived.push(page);
        continue;
      }
      if (!page.localFile) {
        // No LocalFile on a DB that has the column is ambiguous — skip.
        continue;
      }
      const normalized = page.localFile.replace(/\\/g, "/");
      if (localFiles.has(normalized)) {
        matched.push(page);
      } else {
        stale.push({ ...page, reason: `missing file: ${normalized}` });
      }
    }
  } else {
    // Name strategy — walk entire db/ tree.
    const localNames = buildLocalNameSet();
    console.log(`Local record names: ${localNames.size}\n`);

    for (const page of notionPages) {
      if (page.archived) {
        alreadyArchived.push(page);
        continue;
      }
      const nm = (page.name || "").toLowerCase();
      if (!nm) continue; // skip untitled pages (safety)
      if (localNames.has(nm)) {
        matched.push(page);
      } else {
        stale.push({ ...page, reason: `no local match for name: ${page.name}` });
      }
    }
  }

  console.log("=== Diff Report ===\n");
  console.log(`Matched:           ${matched.length}`);
  console.log(`Stale:             ${stale.length}`);
  console.log(`Already archived:  ${alreadyArchived.length}\n`);

  if (stale.length > 0) {
    console.log("--- Stale pages (would be archived) ---");
    for (const p of stale) {
      console.log(`  ${(p.name || "(untitled)").padEnd(45)} [${p.id}]`);
    }
    console.log();
  }

  if (mode === "--diff") {
    console.log("Run with --apply to archive the stale pages.");
    return;
  }

  if (mode === "--apply") {
    if (stale.length === 0) {
      console.log("Nothing to archive.");
      return;
    }
    console.log(`Archiving ${stale.length} stale pages...\n`);
    let ok = 0;
    let failed = 0;
    for (const page of stale) {
      try {
        await archivePage(page.id);
        console.log(`  archived: ${page.name || "(untitled)"}`);
        ok += 1;
      } catch (e) {
        console.error(`  FAILED: ${page.name || "(untitled)"} -- ${e.message}`);
        failed += 1;
      }
    }
    console.log(`\nDone: ${ok} archived, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  }
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
