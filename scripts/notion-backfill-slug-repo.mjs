/**
 * notion-backfill-slug-repo.mjs — One-shot backfill for Slug/Repo columns on
 * the canonical Projects DB. Run AFTER adding Slug (rich_text) and Repo
 * (rich_text or url) to the DB in Notion.
 *
 * Matches existing rows by title (NAME_PROP) against projects.json
 * (featured[] + notion_sync[]) and fills Slug/Repo on any row missing them.
 * Matcher order: exact name → legacy_slugs → URL host. Safe to re-run:
 * skips rows that already have both values set.
 *
 * Required env: NOTION_TOKEN, NOTION_DB_ID
 * Optional env: NOTION_NAME_PROPERTY (default: Name),
 *               NOTION_SLUG_PROPERTY (default: Slug),
 *               NOTION_REPO_PROPERTY (default: Repo),
 *               DRY_RUN=1 to preview without writing
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NAME_PROP = process.env.NOTION_NAME_PROPERTY || 'Name';
const SLUG_PROP = process.env.NOTION_SLUG_PROPERTY || 'Slug';
const REPO_PROP = process.env.NOTION_REPO_PROPERTY || 'Repo';
const DRY_RUN = process.env.DRY_RUN === '1';

// Keep in sync with LEGACY_NAMES in verify-notion-canonical-state.mjs.
// Rows with these titles are archived historical markers — do NOT fill
// slug/repo on them, or sync-to-notion.mjs will start upserting them.
const LEGACY_NAMES = new Set(['morphism.systems']);

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DB_ID.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

async function notionFetch(path, options = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`Notion API ${res.status}: ${await res.text()}`);
  return res.json();
}

function normalizeRepo(value) {
  if (!value) return '';
  return value.replace(/^https:\/\/github\.com\//, '');
}

function titleOf(page) {
  return page.properties[NAME_PROP]?.title?.[0]?.plain_text?.trim() || '';
}

function slugOf(page) {
  return page.properties[SLUG_PROP]?.rich_text?.[0]?.plain_text?.trim() || '';
}

function repoOf(page, propType) {
  if (propType === 'url') return page.properties[REPO_PROP]?.url || '';
  return page.properties[REPO_PROP]?.rich_text?.[0]?.plain_text?.trim() || '';
}

async function queryAllPages() {
  const out = [];
  let cursor;
  do {
    const body = cursor ? { start_cursor: cursor } : {};
    const res = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return out;
}

async function main() {
  const db = await notionFetch(`/databases/${NOTION_DB_ID}`, { method: 'GET' });
  const props = db.properties || {};
  if (!props[SLUG_PROP] || props[SLUG_PROP].type !== 'rich_text') {
    throw new Error(`DB is missing '${SLUG_PROP}' rich_text column. Add it in Notion first.`);
  }
  const repoType = props[REPO_PROP]?.type;
  if (repoType !== 'rich_text' && repoType !== 'url') {
    throw new Error(`DB is missing '${REPO_PROP}' (rich_text or url) column. Add it in Notion first.`);
  }

  const projectsPath = resolve(__dirname, '..', 'projects.json');
  const data = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  const projects = [...(data.featured || []), ...(data.notion_sync || [])];

  const norm = (s) => (s || '').trim().toLowerCase();
  const hostOf = (url) => {
    if (!url) return '';
    try {
      return new URL(url).host.replace(/^www\./, '').toLowerCase();
    } catch {
      return '';
    }
  };
  const byName = new Map();
  const bySlug = new Map();
  const byHost = new Map();
  const seen = new Set();
  for (const p of projects) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    byName.set(norm(p.name), p);
    bySlug.set(norm(p.slug), p);
    for (const ls of p.legacy_slugs || []) bySlug.set(norm(ls), p);
    const h = hostOf(p.url);
    if (h) byHost.set(h, p);
  }

  const matchRow = (title) => {
    const t = norm(title);
    return byName.get(t) || bySlug.get(t) || byHost.get(t) || null;
  };

  const pages = await queryAllPages();
  console.log(`Scanning ${pages.length} Notion rows against ${projects.length} projects.json entries...`);

  let updated = 0;
  let skipped = 0;
  let unmatched = 0;

  let legacySkipped = 0;
  for (const page of pages) {
    const title = titleOf(page);
    if (LEGACY_NAMES.has(title.toLowerCase())) {
      legacySkipped += 1;
      console.log(`  [legacy] skipping archived row "${title}"`);
      continue;
    }
    const project = matchRow(title);
    if (!project) {
      unmatched += 1;
      console.log(`  [unmatched] "${title}" — no projects.json entry with this name`);
      continue;
    }
    const existingSlug = slugOf(page);
    const existingRepo = repoOf(page, repoType);
    const needsSlug = !existingSlug && project.slug;
    const needsRepo = !existingRepo && project.repo;
    if (!needsSlug && !needsRepo) {
      skipped += 1;
      continue;
    }

    const patch = { properties: {} };
    if (needsSlug) {
      patch.properties[SLUG_PROP] = { rich_text: [{ text: { content: project.slug } }] };
    }
    if (needsRepo) {
      patch.properties[REPO_PROP] = repoType === 'url'
        ? { url: `https://github.com/${normalizeRepo(project.repo)}` }
        : { rich_text: [{ text: { content: normalizeRepo(project.repo) } }] };
    }

    if (DRY_RUN) {
      console.log(`  [dry] would patch "${title}": slug=${needsSlug ? project.slug : '—'} repo=${needsRepo ? project.repo : '—'}`);
    } else {
      await notionFetch(`/pages/${page.id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      console.log(`  patched "${title}" (slug=${needsSlug}, repo=${needsRepo})`);
    }
    updated += 1;
  }

  console.log(`\nDone. ${DRY_RUN ? 'would update' : 'updated'}: ${updated}, already filled: ${skipped}, legacy skipped: ${legacySkipped}, unmatched: ${unmatched}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
