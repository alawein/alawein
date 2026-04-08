/**
 * notion-kb-archive-stale.mjs
 *
 * Archives stale pages in the Notion "KB Projects" database whose `LocalFile`
 * property references a markdown file that no longer exists in
 * `knowledge-base/db/projects/`.
 *
 * Use this after running a KB cleanup that deletes/renames project records.
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
import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
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

function listLocalProjectFiles() {
  const projectsDir = join(KB_DB_DIR, "projects");
  if (!existsSync(projectsDir)) {
    console.error(`Projects directory not found: ${projectsDir}`);
    process.exit(1);
  }
  const files = new Set();
  for (const entry of readdirSync(projectsDir)) {
    if (entry.endsWith(".md")) {
      files.add(`projects/${entry}`);
    }
  }
  return files;
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
      // LocalFile is typically a rich_text or url property
      const localFile =
        props.LocalFile?.rich_text?.[0]?.plain_text ||
        props.LocalFile?.url ||
        "";
      const status = props.Status?.select?.name || "";
      const archived = page.archived === true;
      pages.push({ id: page.id, name, localFile, status, archived });
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

async function main() {
  console.log(`Mode: ${mode}`);
  console.log(`KB DB dir: ${KB_DB_DIR}`);
  console.log(`Notion KB DB: ${NOTION_KB_DB_ID}\n`);

  const localFiles = listLocalProjectFiles();
  console.log(`Local project files: ${localFiles.size}`);

  const notionPages = await fetchAllPages();
  console.log(`Notion pages: ${notionPages.length}\n`);

  // Find stale pages: LocalFile references a deleted/missing local file
  const stale = [];
  const missingLocalFile = [];
  const alreadyArchived = [];
  const matched = [];

  for (const page of notionPages) {
    if (page.archived) {
      alreadyArchived.push(page);
      continue;
    }
    if (!page.localFile) {
      missingLocalFile.push(page);
      continue;
    }
    // Normalize backslashes (Windows) to forward slashes
    const normalized = page.localFile.replace(/\\/g, "/");
    if (localFiles.has(normalized)) {
      matched.push(page);
    } else {
      stale.push({ ...page, normalized });
    }
  }

  console.log("=== Diff Report ===\n");
  console.log(`Matched (LocalFile exists locally): ${matched.length}`);
  console.log(`Stale (LocalFile missing locally):  ${stale.length}`);
  console.log(`Missing LocalFile property:         ${missingLocalFile.length}`);
  console.log(`Already archived:                   ${alreadyArchived.length}\n`);

  if (stale.length > 0) {
    console.log("--- Stale pages (would be archived) ---");
    for (const p of stale) {
      console.log(`  ${p.name.padEnd(40)} -> ${p.normalized}  [${p.id}]`);
    }
    console.log();
  }

  if (missingLocalFile.length > 0) {
    console.log("--- Pages with no LocalFile property (skipped) ---");
    for (const p of missingLocalFile) {
      console.log(`  ${p.name.padEnd(40)} [${p.id}]`);
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
        console.log(`  Archived: ${page.name}`);
        ok += 1;
      } catch (e) {
        console.error(`  Failed: ${page.name} -- ${e.message}`);
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
