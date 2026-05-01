/**
 * sync-to-notion.mjs — Push projects.json entries to Notion "Projects (Canonical)" database.
 *
 * Environment variables:
 *   NOTION_TOKEN                — Notion integration token
 *   NOTION_DB_ID                — Database ID for "Projects (Canonical)"
 *   NOTION_DOMAIN_PROPERTY      — Domain select property (default: Domain)
 *   NOTION_CATEGORY_PROPERTY    — Lifecycle select property (default: Category)
 *   NOTION_TAGS_PROPERTY        — Tags multi-select property (default: Tags)
 *   NOTION_NAME_PROPERTY        — Title property (default: Name)
 *   NOTION_SLUG_PROPERTY        — Optional slug rich_text property (default: Slug)
 *   NOTION_URL_PROPERTY         — URL property (default: URL)
 *   NOTION_DESCRIPTION_PROPERTY — Description rich_text property (default: Description)
 *   NOTION_REPO_PROPERTY        — Repo property (default: Repo; rich_text or url)
 *   NOTION_AUTO_CREATE_OPTIONS  — "1" to append missing select/multi-select options (default: 1)
 *
 * Sources:
 *   - featured[]     — also drives README via sync-readme.py
 *   - notion_sync[]  — Notion-only rows (e.g. qmlab, simcore, meathead)
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const DOMAIN_PROP = process.env.NOTION_DOMAIN_PROPERTY || 'Domain';
const CATEGORY_PROP = process.env.NOTION_CATEGORY_PROPERTY || 'Category';
const TAGS_PROP = process.env.NOTION_TAGS_PROPERTY || 'Tags';
const NAME_PROP = process.env.NOTION_NAME_PROPERTY || 'Name';
const SLUG_PROP = process.env.NOTION_SLUG_PROPERTY || 'Slug';
const URL_PROP = process.env.NOTION_URL_PROPERTY || 'URL';
const DESCRIPTION_PROP = process.env.NOTION_DESCRIPTION_PROPERTY || 'Description';
const REPO_PROP = process.env.NOTION_REPO_PROPERTY || 'Repo';
const AUTO_CREATE_OPTIONS = (process.env.NOTION_AUTO_CREATE_OPTIONS || '1') === '1';

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

async function getDatabase() {
  return notionFetch(`/databases/${NOTION_DB_ID}`, { method: 'GET' });
}

function normalizeRepoValue(value) {
  if (!value) return '';
  return value.replace(/^https:\/\/github\.com\//, '');
}

function collectTags(projects) {
  const tags = new Set();
  for (const p of projects) {
    for (const tag of p.tags || []) tags.add(tag);
  }
  return tags;
}

function buildPropertyByType(propType, value) {
  if (propType === 'title') return { title: [{ text: { content: value || '' } }] };
  if (propType === 'rich_text') return { rich_text: [{ text: { content: value || '' } }] };
  if (propType === 'url') return { url: value || null };
  return null;
}

async function getExistingPages(dbProperties) {
  const pages = new Map();
  let cursor;
  do {
    const body = {};
    if (cursor) body.start_cursor = cursor;
    const res = await notionFetch(`/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    for (const page of res.results) {
      const slug = page.properties[SLUG_PROP]?.rich_text?.[0]?.plain_text;
      const repoType = dbProperties[REPO_PROP]?.type;
      const repo = repoType === 'url'
        ? page.properties[REPO_PROP]?.url
        : page.properties[REPO_PROP]?.rich_text?.[0]?.plain_text;
      if (slug) pages.set(slug, page.id);
      if (repo) pages.set(`repo:${normalizeRepoValue(repo)}`, page.id);
    }
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return pages;
}

function mergeProjectLists(data) {
  const seen = new Set();
  const out = [];
  for (const project of data.featured || []) {
    out.push(project);
    seen.add(project.slug);
  }
  for (const project of data.notion_sync || []) {
    if (seen.has(project.slug)) continue;
    out.push(project);
    seen.add(project.slug);
  }
  return out;
}

function buildProperties(project, dbProperties) {
  const props = {};
  const name = buildPropertyByType(dbProperties[NAME_PROP]?.type, project.name);
  if (name) props[NAME_PROP] = name;
  const slug = buildPropertyByType(dbProperties[SLUG_PROP]?.type, project.slug);
  if (slug) props[SLUG_PROP] = slug;
  const url = buildPropertyByType(dbProperties[URL_PROP]?.type, project.url || '');
  if (url) props[URL_PROP] = url;
  const desc = buildPropertyByType(dbProperties[DESCRIPTION_PROP]?.type, project.description);
  if (desc) props[DESCRIPTION_PROP] = desc;

  if (dbProperties[REPO_PROP]?.type === 'rich_text') {
    props[REPO_PROP] = { rich_text: [{ text: { content: normalizeRepoValue(project.repo) } }] };
  } else if (dbProperties[REPO_PROP]?.type === 'url') {
    props[REPO_PROP] = { url: `https://github.com/${normalizeRepoValue(project.repo)}` };
  }

  if (dbProperties[TAGS_PROP]?.type === 'multi_select') {
    props[TAGS_PROP] = { multi_select: project.tags.map((t) => ({ name: t })) };
  }
  if (dbProperties[CATEGORY_PROP]?.type === 'select') {
    props[CATEGORY_PROP] = { select: { name: project.category } };
  }
  if (project.portfolio_domain && dbProperties[DOMAIN_PROP]?.type === 'select') {
    props[DOMAIN_PROP] = { select: { name: project.portfolio_domain } };
  }
  return props;
}

function diffMissingOptions(existing, required) {
  const existingLower = new Set(Array.from(existing).map((v) => v.toLowerCase()));
  return Array.from(required).filter((v) => !existingLower.has(v.toLowerCase()));
}

async function appendMissingOptions(dbProperties, propName, propType, missingNames) {
  if (!missingNames.length) return;
  const existingOptions = dbProperties[propName]?.[propType]?.options || [];
  const options = [...existingOptions, ...missingNames.map((name) => ({ name }))];
  await notionFetch(`/databases/${NOTION_DB_ID}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        [propName]: {
          [propType]: {
            options,
          },
        },
      },
    }),
  });
}

async function preflightValidateNotionSchema(database, projects) {
  const errors = [];
  const warnings = [];
  const properties = database.properties || {};
  const category = properties[CATEGORY_PROP];
  const domain = properties[DOMAIN_PROP];
  const tags = properties[TAGS_PROP];
  const availableProps = Object.entries(properties)
    .map(([name, def]) => `${name}:${def.type}`)
    .join(', ');

  if (!properties[NAME_PROP] || properties[NAME_PROP].type !== 'title') {
    errors.push(`Notion property '${NAME_PROP}' must exist and be a title`);
  }
  if (!properties[REPO_PROP]) {
    warnings.push(`Repo property '${REPO_PROP}' is missing; repo matching/update disabled`);
  }

  if (!category || category.type !== 'select') {
    errors.push(`Notion property '${CATEGORY_PROP}' must exist and be a select`);
  } else {
    const options = new Set((category.select?.options || []).map((o) => o.name));
    const missing = diffMissingOptions(options, ['active', 'maintained', 'planned', 'archived']);
    if (missing.length) {
      if (AUTO_CREATE_OPTIONS) {
        await appendMissingOptions(properties, CATEGORY_PROP, 'select', missing);
      } else {
        errors.push(`${CATEGORY_PROP} select missing option(s): ${missing.join(', ')}`);
      }
    }
  }

  const needsDomain = projects.some((p) => p.portfolio_domain);
  if (needsDomain) {
    if (!domain || domain.type !== 'select') {
      errors.push(`Notion property '${DOMAIN_PROP}' must exist and be a select (needed for portfolio_domain)`);
    } else {
      const options = new Set((domain.select?.options || []).map((o) => o.name));
      const missing = diffMissingOptions(options, ['Work', 'Personal', 'scientific-computing']);
      if (missing.length) {
        if (AUTO_CREATE_OPTIONS) {
          await appendMissingOptions(properties, DOMAIN_PROP, 'select', missing);
        } else {
          errors.push(`${DOMAIN_PROP} select missing option(s): ${missing.join(', ')}`);
        }
      }
    }
  }

  if (!tags || tags.type !== 'multi_select') {
    errors.push(`Notion property '${TAGS_PROP}' must exist and be a multi_select`);
  } else {
    const options = new Set((tags.multi_select?.options || []).map((o) => o.name));
    const missing = diffMissingOptions(options, collectTags(projects));
    if (missing.length) {
      if (AUTO_CREATE_OPTIONS) {
        await appendMissingOptions(properties, TAGS_PROP, 'multi_select', missing);
      } else {
        errors.push(`${TAGS_PROP} multi_select missing option(s): ${missing.join(', ')}`);
      }
    }
  }

  if (errors.length) {
    throw new Error(
      `Notion preflight failed:\n- ${errors.join('\n- ')}\nAvailable properties: ${availableProps}`
    );
  }
  return warnings;
}

async function upsertProject(project, existingPages, dbProperties) {
  let pageId = existingPages.get(project.slug);
  if (!pageId) {
    pageId = existingPages.get(`repo:${normalizeRepoValue(project.repo)}`);
  }
  if (!pageId) {
    for (const legacySlug of project.legacy_slugs || []) {
      pageId = existingPages.get(legacySlug);
      if (pageId) {
        break;
      }
    }
  }

  const properties = buildProperties(project, dbProperties);

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
  const projects = mergeProjectLists(data);

  console.log(`Syncing ${projects.length} projects to Notion (featured + notion_sync)...`);
  let database = await getDatabase();
  const warnings = await preflightValidateNotionSchema(database, projects);
  for (const warning of warnings) console.warn(`Warning: ${warning}`);
  database = await getDatabase();
  console.log('Notion preflight passed (Category/Domain/Tags options found).');
  const existingPages = await getExistingPages(database.properties || {});
  console.log(`Found ${existingPages.size} existing pages in Notion.`);

  for (const project of projects) {
    await upsertProject(project, existingPages, database.properties || {});
  }
  console.log('Notion sync complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
