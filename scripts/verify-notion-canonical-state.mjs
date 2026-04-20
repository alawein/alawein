/**
 * verify-notion-canonical-state.mjs
 *
 * Verifies canonical Notion DB state after sync:
 * - Exactly expected canonical slugs exist (from featured + notion_sync)
 * - Legacy rows are archived
 * - Total row count matches canonical + expected legacy count
 *
 * Required env:
 * - NOTION_TOKEN
 * - NOTION_DB_ID
 *
 * Optional env:
 * - NOTION_STATUS_PROPERTY (default: Status)
 * - NOTION_NAME_PROPERTY (default: Name)
 * - NOTION_SLUG_PROPERTY (default: Slug)
 * - NOTION_REPO_PROPERTY (default: Repo)
 * - NOTION_EXPECTED_LEGACY_COUNT (default: 1)
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const STATUS_PROP = process.env.NOTION_STATUS_PROPERTY || 'Status';
const NAME_PROP = process.env.NOTION_NAME_PROPERTY || 'Name';
const SLUG_PROP = process.env.NOTION_SLUG_PROPERTY || 'Slug';
const REPO_PROP = process.env.NOTION_REPO_PROPERTY || 'Repo';
const EXPECTED_LEGACY_COUNT = Number(process.env.NOTION_EXPECTED_LEGACY_COUNT || '1');

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DB_ID.');
  process.exit(1);
}

const LEGACY_NAMES = new Set(['morphism.systems']);

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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

function normalizeRepo(value) {
  return (value || '').replace(/^https:\/\/github\.com\//, '');
}

function extractName(page) {
  const title = page.properties?.[NAME_PROP]?.title || [];
  return title.map((t) => t.plain_text || '').join('').trim();
}

function extractSlug(page) {
  const rt = page.properties?.[SLUG_PROP]?.rich_text || [];
  return rt.map((t) => t.plain_text || '').join('').trim();
}

function extractRepo(page, repoType) {
  if (repoType === 'url') return normalizeRepo(page.properties?.[REPO_PROP]?.url || '');
  const rt = page.properties?.[REPO_PROP]?.rich_text || [];
  return normalizeRepo(rt.map((t) => t.plain_text || '').join('').trim());
}

function extractStatus(page) {
  return page.properties?.[STATUS_PROP]?.select?.name || '';
}

async function getAllPages() {
  const pages = [];
  let cursor;
  do {
    const body = {};
    if (cursor) body.start_cursor = cursor;
    const res = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    pages.push(...(res.results || []));
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages;
}

function expectedCanonicalSet(data) {
  const seen = new Set();
  for (const p of data.featured || []) seen.add(p.slug);
  for (const p of data.notion_sync || []) seen.add(p.slug);
  return seen;
}

async function main() {
  const projects = JSON.parse(readFileSync(resolve(root, 'projects.json'), 'utf-8'));
  const expectedCanonical = expectedCanonicalSet(projects);
  const pages = await getAllPages();
  const db = await notionFetch(`/databases/${NOTION_DB_ID}`, { method: 'GET' });
  const repoType = db.properties?.[REPO_PROP]?.type;

  const canonicalByKey = new Set();
  let archivedLegacy = 0;
  const errors = [];

  for (const page of pages) {
    const name = extractName(page);
    const slug = extractSlug(page);
    const repo = extractRepo(page, repoType);
    const status = extractStatus(page);

    if (LEGACY_NAMES.has(name)) {
      if ((status || '').toLowerCase() !== 'archived') {
        errors.push(`Legacy row '${name}' is not archived (status='${status || 'empty'}')`);
      } else {
        archivedLegacy += 1;
      }
    }

    if (slug && expectedCanonical.has(slug)) canonicalByKey.add(slug);
    if (repo) {
      for (const p of [...(projects.featured || []), ...(projects.notion_sync || [])]) {
        if (normalizeRepo(p.repo) === repo) canonicalByKey.add(p.slug);
      }
    }
  }

  for (const slug of expectedCanonical) {
    if (!canonicalByKey.has(slug)) errors.push(`Missing canonical row for slug '${slug}'`);
  }

  const expectedTotal = expectedCanonical.size + EXPECTED_LEGACY_COUNT;
  if (pages.length !== expectedTotal) {
    errors.push(`Unexpected total rows: got ${pages.length}, expected ${expectedTotal}`);
  }
  if (archivedLegacy !== EXPECTED_LEGACY_COUNT) {
    errors.push(`Unexpected archived legacy count: got ${archivedLegacy}, expected ${EXPECTED_LEGACY_COUNT}`);
  }

  if (errors.length) {
    console.error('Notion canonical state check failed:');
    for (const err of errors) console.error(`- ${err}`);
    process.exit(1);
  }

  console.log(
    `Notion canonical state verified: canonical=${expectedCanonical.size}, archived_legacy=${archivedLegacy}, total=${pages.length}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

