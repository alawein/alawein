/**
 * sync-to-notion.mjs — Push projects.json entries to Notion "Projects (Canonical)" database.
 *
 * Environment variables:
 *   NOTION_TOKEN     — Notion integration token
 *   NOTION_DB_ID     — Database ID for "Projects (Canonical)"
 *
 * For each project in projects.json, upserts a page in Notion:
 *   - Matches on "Slug" property (canonical or legacy slug)
 *   - Updates Name, URL, Description, Tags, Category
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DB_ID environment variables.');
  process.exit(1);
}

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': NOTION_VERSION,
};

async function notionFetch(path, options = {}) {
  const url = `${NOTION_API}${path}`;
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

async function getExistingPages() {
  const pages = new Map();
  let cursor;
  do {
    const body = { filter: { property: 'Slug', rich_text: { is_not_empty: true } } };
    if (cursor) body.start_cursor = cursor;
    const res = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    for (const page of res.results) {
      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text;
      if (slug) pages.set(slug, page.id);
    }
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages;
}

function buildProperties(project) {
  return {
    Name: { title: [{ text: { content: project.name } }] },
    Slug: { rich_text: [{ text: { content: project.slug } }] },
    URL: { url: project.url },
    Description: { rich_text: [{ text: { content: project.description } }] },
    Tags: { multi_select: project.tags.map((t) => ({ name: t })) },
    Category: { select: { name: project.category } },
    Repo: { rich_text: [{ text: { content: project.repo } }] },
  };
}

async function upsertProject(project, existingPages) {
  let pageId = existingPages.get(project.slug);
  if (!pageId) {
    for (const legacySlug of project.legacy_slugs || []) {
      pageId = existingPages.get(legacySlug);
      if (pageId) {
        break;
      }
    }
  }

  const properties = buildProperties(project);

  if (pageId) {
    await notionFetch(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
    existingPages.set(project.slug, pageId);
    console.log(`  Updated: ${project.name}`);
  } else {
    await notionFetch('/pages', {
      method: 'POST',
      body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties }),
    });
    console.log(`  Created: ${project.name}`);
  }
}

async function main() {
  const projectsPath = resolve(__dirname, '..', 'projects.json');
  const data = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  const featured = data.featured || [];

  console.log(`Syncing ${featured.length} projects to Notion...`);
  const existingPages = await getExistingPages();
  console.log(`Found ${existingPages.size} existing pages in Notion.`);

  for (const project of featured) {
    await upsertProject(project, existingPages);
  }
  console.log('Notion sync complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
