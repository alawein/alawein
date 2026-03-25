/**
 * validate-projects-json.mjs
 *
 * Lightweight contract checks for projects.json.
 * No external dependencies required.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const projectsPath = resolve(root, 'projects.json');

const VALID_CATEGORIES = new Set(['active', 'maintained', 'planned', 'archived']);
const VALID_DOMAINS = new Set(['Work', 'Personal', 'scientific-computing']);

function fail(errors) {
  console.error('projects.json validation failed:');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateProjectEntry(entry, path, errors) {
  const required = ['name', 'slug', 'repo', 'description', 'tags', 'category'];
  for (const key of required) {
    if (!(key in entry)) {
      errors.push(`${path}: missing required field '${key}'`);
    }
  }

  if (!isNonEmptyString(entry.name)) errors.push(`${path}.name must be a non-empty string`);
  if (!isNonEmptyString(entry.slug)) errors.push(`${path}.slug must be a non-empty string`);
  if (!isNonEmptyString(entry.repo)) errors.push(`${path}.repo must be a non-empty string`);
  if (!isNonEmptyString(entry.description)) errors.push(`${path}.description must be a non-empty string`);

  if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
    errors.push(`${path}.tags must be a non-empty array`);
  } else if (entry.tags.some((tag) => !isNonEmptyString(tag))) {
    errors.push(`${path}.tags must contain only non-empty strings`);
  }

  if (!VALID_CATEGORIES.has(entry.category)) {
    errors.push(`${path}.category must be one of: ${Array.from(VALID_CATEGORIES).join(', ')}`);
  }

  if ('portfolio_domain' in entry && !VALID_DOMAINS.has(entry.portfolio_domain)) {
    errors.push(`${path}.portfolio_domain must be one of: ${Array.from(VALID_DOMAINS).join(', ')}`);
  }
}

function uniqueBySlug(entries, path, errors) {
  const seen = new Set();
  for (const [idx, entry] of entries.entries()) {
    const slug = entry?.slug;
    if (!isNonEmptyString(slug)) continue;
    if (seen.has(slug)) errors.push(`${path}[${idx}].slug duplicates '${slug}'`);
    seen.add(slug);
  }
}

function main() {
  let data;
  try {
    data = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  } catch (err) {
    console.error(`Failed to parse projects.json: ${err.message}`);
    process.exit(1);
  }

  const errors = [];

  if (!Array.isArray(data.featured)) errors.push('featured must be an array');
  if (!Array.isArray(data.research)) errors.push('research must be an array');
  if (!Array.isArray(data.packages)) errors.push('packages must be an array');
  if (data.notion_sync && !Array.isArray(data.notion_sync)) errors.push('notion_sync must be an array when present');

  for (const [idx, entry] of (data.featured || []).entries()) {
    validateProjectEntry(entry, `featured[${idx}]`, errors);
  }
  for (const [idx, entry] of (data.notion_sync || []).entries()) {
    validateProjectEntry(entry, `notion_sync[${idx}]`, errors);
  }

  uniqueBySlug(data.featured || [], 'featured', errors);
  uniqueBySlug(data.notion_sync || [], 'notion_sync', errors);

  const featuredSlugs = new Set((data.featured || []).map((p) => p.slug));
  for (const [idx, entry] of (data.notion_sync || []).entries()) {
    if (featuredSlugs.has(entry.slug)) {
      errors.push(`notion_sync[${idx}].slug '${entry.slug}' duplicates a featured slug`);
    }
  }

  if (errors.length) fail(errors);
  console.log('projects.json validation passed.');
}

main();
